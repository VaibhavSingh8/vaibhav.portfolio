import { animate } from 'motion';

let openEl: HTMLElement | null = null;
let overlay: HTMLElement | null = null;
let originalParent: ParentNode | null = null;
let placeholder: HTMLElement | null = null;

function ensureOverlay(): HTMLElement {
  if (overlay) return overlay;
  overlay = document.createElement('div');
  overlay.className = 'proj-overlay';
  overlay.innerHTML = `
    <button class="close" aria-label="Close">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M6 6l12 12M18 6 6 18"/>
      </svg>
    </button>
    <div class="stage"></div>
  `;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', (e: MouseEvent) => {
    if (e.target === overlay) void closeProject();
  });
  overlay.querySelector('.close')?.addEventListener('click', () => void closeProject());
  return overlay;
}

async function openProject(card: HTMLElement) {
  if (openEl) return;
  const ov = ensureOverlay();
  const first = card.getBoundingClientRect();

  placeholder = document.createElement('div');
  placeholder.style.width = first.width + 'px';
  placeholder.style.height = first.height + 'px';
  originalParent = card.parentNode;
  originalParent?.insertBefore(placeholder, card);

  ov.classList.add('open');
  const stage = ov.querySelector<HTMLElement>('.stage');
  if (!stage) return;
  stage.appendChild(card);
  card.classList.add('proj-opened');

  card.style.maxWidth = '860px';
  card.style.width = '100%';
  const last = card.getBoundingClientRect();
  const dx = first.left - last.left;
  const dy = first.top - last.top;
  const sx = first.width / last.width;
  const sy = first.height / last.height;

  animate(ov, { opacity: [0, 1] }, { duration: 0.25 });
  animate(
    card,
    {
      transform: [
        `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`,
        'translate(0,0) scale(1,1)',
      ],
    },
    { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  );

  openEl = card;
  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', onKey);
}

async function closeProject() {
  if (!openEl || !placeholder || !overlay) return;
  const card = openEl;
  const last = placeholder.getBoundingClientRect();
  const first = card.getBoundingClientRect();
  const dx = last.left - first.left;
  const dy = last.top - first.top;
  const sx = last.width / first.width;
  const sy = last.height / first.height;

  await animate(
    card,
    {
      transform: [
        'translate(0,0) scale(1,1)',
        `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`,
      ],
    },
    { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  ).finished;

  await animate(overlay, { opacity: [1, 0] }, { duration: 0.2 }).finished;

  card.style.maxWidth = '';
  card.style.width = '';
  card.style.transform = '';
  card.classList.remove('proj-opened');
  if (originalParent && placeholder.parentNode) {
    originalParent.insertBefore(card, placeholder);
  }
  placeholder.remove();
  overlay.classList.remove('open');
  openEl = null;
  placeholder = null;
  document.body.style.overflow = '';
  document.removeEventListener('keydown', onKey);
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') void closeProject();
}

document.querySelectorAll<HTMLElement>('.proj').forEach((p) => {
  p.style.cursor = 'zoom-in';
  p.addEventListener('click', (e: MouseEvent) => {
    if ((e.target as HTMLElement | null)?.closest('a, button')) return;
    void openProject(p);
  });
});
