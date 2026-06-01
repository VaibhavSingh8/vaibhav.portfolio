import { stackRows } from '../data/stack.ts';

document.querySelectorAll<HTMLElement>('.marquee').forEach((m) => {
  const row = m.querySelector<HTMLElement>('.track');
  if (!row) return;
  const n = Number(row.dataset['row']) as 1 | 2 | 3;
  const items = stackRows[n] ?? [];
  const speed = Number(m.dataset['speed'] ?? 50);
  m.style.setProperty('--speed', String(speed));

  const copies = Math.max(2, Math.ceil(12 / items.length));
  const evenCopies = copies % 2 === 0 ? copies : copies + 1;
  const html = Array(evenCopies).fill(items).flat()
    .map(({ kind, name, icon, color, darkColor, meta }) => {
      const badge = icon
        ? `<span class="sicon" style="mask-image:url('${icon}');-webkit-mask-image:url('${icon}')"></span>`
        : meta ? `<span class="meta">${meta}</span>` : '';
      const vars = [color ? `--chip-color:${color}` : '', darkColor ? `--chip-color-dark:${darkColor}` : ''].filter(Boolean).join(';');
      const styleAttr = vars ? `style="${vars}"` : '';
      return `<span class="stack-chip" data-kind="${kind}" ${styleAttr}>${badge}${name}</span>`;
    })
    .join('');
  row.innerHTML = html;
});
