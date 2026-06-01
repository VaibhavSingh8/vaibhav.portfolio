interface TweakState {
  wipe: string;
  accentHue: number;
  sound: boolean;
}

const DEFAULTS: TweakState = { wipe: 'diag', accentHue: 55, sound: true };

const SAVED = (() => {
  try {
    return JSON.parse(localStorage.getItem('portfolio-tweaks') ?? '{}') as Partial<TweakState>;
  } catch {
    return {} as Partial<TweakState>;
  }
})();

const state: TweakState = { ...DEFAULTS, ...SAVED };

function applyAccent(h: number) {
  const root = document.documentElement;
  root.style.setProperty('--accent', `oklch(0.68 0.14 ${h})`);
  root.style.setProperty('--accent-ink', `oklch(0.45 0.12 ${h})`);
  if (root.dataset['theme'] === 'dark') {
    root.style.setProperty('--accent', `oklch(0.78 0.13 ${h})`);
    root.style.setProperty('--accent-ink', `oklch(0.82 0.09 ${h})`);
  }
}
applyAccent(state.accentHue);

const wipe = document.getElementById('wipe');
const themeBtn = document.getElementById('theme');

/* web audio click */
let audioCtx: AudioContext | null = null;
function playClick() {
  if (!state.sound) return;
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    audioCtx = audioCtx ?? new Ctx();
    const t = audioCtx.currentTime;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    const o2 = audioCtx.createOscillator();
    const g2 = audioCtx.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(880, t);
    o.frequency.exponentialRampToValueAtTime(220, t + 0.09);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.18, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    o2.type = 'square';
    o2.frequency.setValueAtTime(2200, t);
    g2.gain.setValueAtTime(0.0001, t);
    g2.gain.exponentialRampToValueAtTime(0.04, t + 0.002);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
    o.connect(g).connect(audioCtx.destination);
    o2.connect(g2).connect(audioCtx.destination);
    o.start(t);
    o2.start(t);
    o.stop(t + 0.15);
    o2.stop(t + 0.06);
  } catch {
    // audio not available
  }
}

function toggleTheme() {
  if (!wipe) return;
  playClick();
  const html = document.documentElement;
  const next = html.dataset['theme'] === 'dark' ? 'light' : 'dark';
  const nextBg = next === 'dark' ? '#0b0b0d' : '#f6f5f0';
  wipe.style.setProperty('--wipe-bg', nextBg);

  if (state.wipe === 'flat') {
    wipe.classList.remove('diag');
    wipe.classList.add('flat');
    wipe.classList.remove('animating');
    wipe.style.clipPath = 'inset(100% 0 0 0)';
    requestAnimationFrame(() => {
      wipe.classList.add('animating');
      wipe.style.clipPath = 'inset(0 0 0 0)';
    });
    setTimeout(() => {
      html.dataset['theme'] = next;
      applyAccent(state.accentHue);
      localStorage.setItem('portfolio-theme', next);
      wipe.style.clipPath = 'inset(0 0 100% 0)';
      setTimeout(() => {
        wipe.classList.remove('animating');
        wipe.style.clipPath = 'inset(100% 0 0 0)';
      }, 500);
    }, 700);
  } else {
    if (!themeBtn) return;
    const rect = themeBtn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    wipe.classList.remove('flat', 'animating');
    wipe.classList.add('diag');
    wipe.style.setProperty('--wipe-x', x + 'px');
    wipe.style.setProperty('--wipe-y', y + 'px');
    wipe.style.clipPath = `circle(0 at ${x}px ${y}px)`;
    requestAnimationFrame(() => {
      wipe.classList.add('animating');
      const d = Math.hypot(Math.max(x, vw - x), Math.max(y, vh - y));
      wipe.style.clipPath = `circle(${d + 20}px at ${x}px ${y}px)`;
    });
    setTimeout(() => {
      html.dataset['theme'] = next;
      applyAccent(state.accentHue);
      localStorage.setItem('portfolio-theme', next);
      wipe.style.clipPath = `circle(0 at ${x}px ${y}px)`;
      setTimeout(() => {
        wipe.classList.remove('animating', 'diag');
      }, 700);
    }, 700);
  }
}

themeBtn?.addEventListener('click', toggleTheme);

const savedTheme = localStorage.getItem('portfolio-theme') ?? 'dark';
document.documentElement.dataset['theme'] = savedTheme;
applyAccent(state.accentHue);

/* tweaks panel */
const tweaksEl = document.getElementById('tweaks');
const wipeSel = document.getElementById('wipe-style') as HTMLSelectElement | null;
const hueInp = document.getElementById('accent-hue') as HTMLInputElement | null;
const soundInp = document.getElementById('sound-on') as HTMLInputElement | null;

if (wipeSel) wipeSel.value = state.wipe;
if (hueInp) hueInp.value = String(state.accentHue);
if (soundInp) soundInp.checked = !!state.sound;

function persist(patch: Partial<TweakState>) {
  Object.assign(state, patch);
  localStorage.setItem('portfolio-tweaks', JSON.stringify(state));
  try {
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*');
  } catch {
    // cross-origin parent
  }
}

wipeSel?.addEventListener('change', () => persist({ wipe: wipeSel.value }));
hueInp?.addEventListener('input', () => {
  applyAccent(+hueInp.value);
  persist({ accentHue: +hueInp.value });
});
soundInp?.addEventListener('change', () => persist({ sound: soundInp.checked }));

window.addEventListener('message', (ev: MessageEvent<{ type?: string }>) => {
  const d = ev.data;
  if (d?.type === '__activate_edit_mode') tweaksEl?.classList.add('on');
  if (d?.type === '__deactivate_edit_mode') tweaksEl?.classList.remove('on');
});

try {
  window.parent.postMessage({ type: '__edit_mode_available' }, '*');
} catch {
  // cross-origin
}
