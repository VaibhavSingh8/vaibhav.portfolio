/**
 * Moves the cursor glow. Writes at most once per frame, because pointermove
 * can fire faster than the screen refreshes.
 */

const ambient = document.querySelector<HTMLElement>('.ambient');

if (ambient) {
  let x = 0;
  let y = 0;
  let queued = false;

  window.addEventListener(
    'pointermove',
    (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (queued) return;

      queued = true;
      requestAnimationFrame(() => {
        ambient.style.setProperty('--mx', `${x}px`);
        ambient.style.setProperty('--my', `${y}px`);
        queued = false;
      });
    },
    { passive: true },
  );
}
