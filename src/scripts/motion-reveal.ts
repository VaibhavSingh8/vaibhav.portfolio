import { animate, inView } from 'motion';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduced) {
  const targets = document.querySelectorAll<HTMLElement>(
    'main > section, main > .hatch, footer, .buildstrip',
  );
  targets.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    el.style.willChange = 'transform, opacity';
  });
  targets.forEach((el) => {
    inView(
      el,
      () => {
        animate(
          el,
          {
            opacity: [0, 1],
            transform: ['translateY(10px)', 'translateY(0px)'],
          },
          { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        );
        return () => {};
      },
      { amount: 0.15 },
    );
  });
}
