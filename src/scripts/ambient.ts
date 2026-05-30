const ambient = document.querySelector<HTMLElement>('.ambient');
if (ambient) {
  window.addEventListener('pointermove', (e: PointerEvent) => {
    ambient.style.setProperty('--mx', e.clientX + 'px');
    ambient.style.setProperty('--my', e.clientY + 'px');
  });
}
