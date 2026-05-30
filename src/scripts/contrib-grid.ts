const weeksEl = document.getElementById('weeks');
const monthsEl = document.getElementById('months');
const tip = document.getElementById('tip');
if (!weeksEl || !monthsEl || !tip) throw new Error('Contrib grid elements missing');

const today = new Date(2026, 3, 18);
const start = new Date(today);
start.setDate(start.getDate() - 52 * 7);
while (start.getDay() !== 0) start.setDate(start.getDate() - 1);

let seed = 42;
const rnd = () => {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
};

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const totalWeeks = 53;
const monthCols: string[] = new Array(totalWeeks).fill('');
let lastMonth = -1;
let total = 0;

for (let w = 0; w < totalWeeks; w++) {
  const weekDiv = document.createElement('div');
  weekDiv.className = 'week';
  const weekStart = new Date(start);
  weekStart.setDate(start.getDate() + w * 7);
  if (weekStart.getMonth() !== lastMonth && weekStart.getDate() <= 7) {
    monthCols[w] = monthNames[weekStart.getMonth()] ?? '';
    lastMonth = weekStart.getMonth();
  }
  for (let d = 0; d < 7; d++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + d);
    const cell = document.createElement('div');
    cell.className = 'cell';
    if (date > today) {
      cell.style.visibility = 'hidden';
      weekDiv.appendChild(cell);
      continue;
    }
    const r = rnd();
    const bias = d === 0 || d === 6 ? 0.55 : 0.15;
    const v = r - bias;
    let count = 0;
    if (v > -0.05) count = 1;
    if (v > 0.2) count = 2;
    if (v > 0.45) count = 4;
    if (v > 0.7) count = 8;
    if (count > 0) {
      const lvl = count <= 1 ? 1 : count <= 2 ? 2 : count <= 4 ? 3 : 4;
      cell.classList.add('l' + lvl);
    }
    total += count;
    const dayLabel = date.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' });
    cell.dataset['tip'] =
      count === 0
        ? `No activity on ${dayLabel}`
        : `${count} ${count === 1 ? 'commit' : 'commits'} on ${dayLabel}`;
    weekDiv.appendChild(cell);
  }
  weeksEl.appendChild(weekDiv);
}

const countEl = document.getElementById('commit-count');
if (countEl) countEl.textContent = total.toLocaleString();

monthCols.forEach((m) => {
  const s = document.createElement('span');
  s.textContent = m;
  monthsEl.appendChild(s);
});

document.querySelectorAll<HTMLElement>('.cell[data-tip]').forEach((c) => {
  c.addEventListener('pointerenter', () => {
    const tipText = c.dataset['tip'] ?? '';
    tip!.textContent = tipText;
    const r = c.getBoundingClientRect();
    tip!.style.left = r.left + r.width / 2 + 'px';
    tip!.style.top = r.top + 'px';
    tip!.classList.add('show');
  });
  c.addEventListener('pointerleave', () => tip!.classList.remove('show'));
});
