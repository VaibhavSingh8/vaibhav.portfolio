/**
 * Light/dark toggle.
 *
 * The switch itself is instant — what takes 700ms is the wipe: a full-screen
 * panel painted in the NEXT theme's background colour, revealed with clip-path
 * from the toggle button. We flip `data-theme` when the panel fully covers the
 * page, then clip the panel back away.
 */

const WIPE_MS = 700;

const wipe = document.getElementById('wipe');
const themeBtn = document.getElementById('theme');

const THEME_BG = { light: '#f6f5f0', dark: '#0f0f13' } as const;
type Theme = keyof typeof THEME_BG;

/* --- restore the saved theme ------------------------------------------- */

const saved = localStorage.getItem('portfolio-theme');
const initial: Theme = saved === 'light' ? 'light' : 'dark';
document.documentElement.dataset['theme'] = initial;

/* --- click sound (delete this block if you don't want it) --------------- */

let audioCtx: AudioContext | null = null;

function playClick() {
  try {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return;
    audioCtx ??= new Ctx();

    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.09);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.18, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

    osc.connect(gain).connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + 0.15);
  } catch {
    // audio unavailable — not worth doing anything about
  }
}

/* --- the toggle --------------------------------------------------------- */

function toggleTheme() {
  if (!wipe || !themeBtn) return;
  playClick();

  const html = document.documentElement;
  const next: Theme = html.dataset['theme'] === 'dark' ? 'light' : 'dark';

  // the panel is painted in the theme we're moving TO
  wipe.style.setProperty('--wipe-bg', THEME_BG[next]);

  // open the circle from the centre of the toggle button
  const rect = themeBtn.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  wipe.classList.remove('animating');
  wipe.classList.add('diag');
  wipe.style.clipPath = `circle(0 at ${x}px ${y}px)`;

  requestAnimationFrame(() => {
    wipe.classList.add('animating');
    wipe.style.clipPath = `circle(${radius + 20}px at ${x}px ${y}px)`;
  });

  // once the panel covers the page, swap the theme under it and clip it away
  window.setTimeout(() => {
    html.dataset['theme'] = next;
    localStorage.setItem('portfolio-theme', next);

    wipe.style.clipPath = `circle(0 at ${x}px ${y}px)`;
    window.setTimeout(() => {
      wipe.classList.remove('animating', 'diag');
    }, WIPE_MS);
  }, WIPE_MS);
}

themeBtn?.addEventListener('click', toggleTheme);
