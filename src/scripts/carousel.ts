import { stackRows } from '../data/stack.ts';

document.querySelectorAll<HTMLElement>('.marquee').forEach((m) => {
  const row = m.querySelector<HTMLElement>('.track');
  if (!row) return;
  const n = Number(row.dataset['row']) as 1 | 2 | 3;
  const items = stackRows[n] ?? [];
  const speed = Number(m.dataset['speed'] ?? 50);
  m.style.setProperty('--speed', String(speed));

  const copies = Math.max(2, Math.ceil(12 / items.length));
  const evenCopies = copies % 2 === 0 ? copies : copies + 1;
  const html = Array(evenCopies).fill(items).flat()
    .map(({ kind, name, icon, color, darkColor, meta }) => {
      const badge = icon
        ? `<span class="sicon" style="mask-image:url('${icon}');-webkit-mask-image:url('${icon}')"></span>`
        : meta ? `<span class="meta">${meta}</span>` : '';
      const vars = [color ? `--chip-color:${color}` : '', darkColor ? `--chip-color-dark:${darkColor}` : ''].filter(Boolean).join(';');
      const styleAttr = vars ? `style="${vars}"` : '';
      return `<span class="stack-chip" data-kind="${kind}" ${styleAttr}>${badge}${name}</span>`;
    })
    .join('');
  row.innerHTML = html;
});

/* ------------------------------------------------------------------
   Pause control.

   WCAG 2.2.2 (Pause, Stop, Hide) requires a real mechanism to stop
   content that moves for more than five seconds. Hover-to-pause does
   not count — it is unreachable by keyboard and does not exist on
   touch — so this button is the actual mechanism.

   If the visitor prefers reduced motion we start paused, but leave the
   button working so they can opt back in.
   ------------------------------------------------------------------ */

const stack = document.getElementById('stack');
const toggle = document.getElementById('marquee-toggle');
const toggleLabel = toggle?.querySelector<HTMLElement>('.label');

if (stack && toggle && toggleLabel) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  const setPaused = (paused: boolean) => {
    stack.dataset['paused'] = String(paused);
    toggleLabel.textContent = paused ? 'Play' : 'Pause';
    toggle.setAttribute(
      'aria-label',
      paused ? 'Play tech stack animation' : 'Pause tech stack animation',
    );
  };

  setPaused(reduced.matches);
  reduced.addEventListener('change', (e) => setPaused(e.matches));
  toggle.addEventListener('click', () => {
    setPaused(stack.dataset['paused'] !== 'true');
  });
}
