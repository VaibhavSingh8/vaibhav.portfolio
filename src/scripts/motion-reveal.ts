import { animate, inView } from 'motion';

/**
 * Fades sections in as they scroll into view.
 *
 * Progressive: content is only hidden when it starts below the fold, so
 * anything visible on load never depends on an animation callback to appear.
 * Printing reveals everything.
 */

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

function show(el: HTMLElement) {
  el.style.opacity = '';
  el.style.transform = '';
  el.style.willChange = '';
}

if (!reduced) {
  const targets = [
    ...document.querySelectorAll<HTMLElement>('main > section, footer'),
  ].filter((el) => el.getBoundingClientRect().top > window.innerHeight);

  for (const el of targets) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    el.style.willChange = 'transform, opacity';

    inView(
      el,
      () => {
        void animate(
          el,
          { opacity: [0, 1], transform: ['translateY(10px)', 'translateY(0px)'] },
          { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        ).finished.then(() => show(el));
      },
      { amount: 0.15 },
    );
  }

  window.addEventListener('beforeprint', () => targets.forEach(show));
}
