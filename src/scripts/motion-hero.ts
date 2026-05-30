import { animate, stagger } from 'motion';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const nameEl = document.getElementById('name-glitch');

if (nameEl && !reduced) {
  const text = nameEl.textContent ?? '';
  nameEl.textContent = '';
  const letters = [...text].map((ch) => {
    const s = document.createElement('span');
    s.className = 'l';
    s.textContent = ch === ' ' ? '\u00A0' : ch;
    s.style.display = 'inline-block';
    s.style.willChange = 'transform, opacity';
    s.style.opacity = '0';
    s.style.transform = 'translateY(8px)';
    nameEl.appendChild(s);
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
