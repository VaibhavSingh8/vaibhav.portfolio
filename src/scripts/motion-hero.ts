import { animate, stagger } from 'motion';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const nameEl = document.getElementById('name-glitch');

if (nameEl && !reduced) {
  const text = nameEl.textContent ?? '';
  nameEl.textContent = '';

  // Screen readers would announce one-letter spans letter by letter, so the
  // animated letters are hidden from them and the name is kept whole beside.
  const spoken = document.createElement('span');
  spoken.className = 'sr-only';
  spoken.textContent = text;
  const visual = document.createElement('span');
  visual.setAttribute('aria-hidden', 'true');
  nameEl.append(spoken, visual);

  const letters = [...text].map((ch) => {
    const s = document.createElement('span');
    s.className = 'l';
    s.textContent = ch === ' ' ? '\u00A0' : ch;
    s.style.display = 'inline-block';
    s.style.willChange = 'transform, opacity';
    s.style.opacity = '0';
    s.style.transform = 'translateY(8px)';
    visual.appendChild(s);
    return s;
  });

  animate(
    letters,
    {
      opacity: [0, 1],
      transform: ['translateY(8px)', 'translateY(0px)'],
    },
    {
      duration: 0.55,
      delay: stagger(0.035, { startDelay: 0.15 }),
      ease: [0.16, 1, 0.3, 1],
    },
  );
}
