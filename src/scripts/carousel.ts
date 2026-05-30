import { stackRows } from '../data/stack.ts';

document.querySelectorAll<HTMLElement>('.marquee').forEach((m) => {
  const row = m.querySelector<HTMLElement>('.track');
  if (!row) return;
  const n = Number(row.dataset['row']) as 1 | 2 | 3;
  const items = stackRows[n] ?? [];
  const speed = Number(m.dataset['speed'] ?? 50);
  m.style.setProperty('--speed', String(speed));
  const html = [...items, ...items]
    .map(
      ({ kind, name, meta }) =>
        `<span class="stack-chip" data-kind="${kind}"><span class="sdot"></span>${name}<span class="meta">${meta}</span></span>`,
    )
    .join('');
  row.innerHTML = html;
});
