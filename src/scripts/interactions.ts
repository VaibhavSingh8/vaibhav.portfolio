/* magnetic hover */
document.querySelectorAll<HTMLElement>('.nav-a, .chip, .theme-btn, .kbd').forEach((el) => {
  el.addEventListener('pointermove', (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
  });
  el.addEventListener('pointerleave', () => {
    el.style.transform = '';
  });
});

/* chip ripple origin */
document.querySelectorAll<HTMLElement>('.chip').forEach((el) => {
  el.addEventListener('pointerenter', (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--rx', e.clientX - r.left + 'px');
    el.style.setProperty('--ry', e.clientY - r.top + 'px');
  });
});

/* view counter jitter */
const viewsEl = document.getElementById('views');
if (viewsEl) {
  let n = 12408;
  setInterval(() => {
    if (Math.random() < 0.3) {
      n += 1;
      viewsEl.textContent = n.toLocaleString();
    }
  }, 2400);
}
