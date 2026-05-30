document.querySelectorAll<HTMLElement>('[data-expand]').forEach((el) => {
  el.addEventListener('click', (e: MouseEvent) => {
    if ((e.target as HTMLElement | null)?.closest('.tag')) return;
    el.classList.toggle('open');
  });
});
