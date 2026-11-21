/**
 * "Feel the difference" demo for the planning workspace case study.
 *
 * Synthetic constraint rows with a six-level hierarchy path. Two validators
 * return the same issues:
 *  - pairwise: every row compared with every other row, O(n²)
 *  - indexed:  rows keyed by their joined path (NUL separator, because level
 *              names can contain spaces), with a parent index, O(n)
 *
 * Every keystroke re-runs the selected validator on the main thread and the
 * time is measured in the reader's own browser. This reproduces the shape of
 * the problem, not the production code.
 */

interface Row {
  path: string[];
  value: number;
}

interface Result {
  duplicates: number;
  overBudget: number;
}

const LEVELS = 6;
const SEP = '\u0000';

/* --- synthetic data ------------------------------------------------------ */

function makeRows(n: number): Row[] {
  const rows: Row[] = [];
  // a small, deterministic fan-out so every parent has a handful of children
  for (let i = 0; i < n; i++) {
    const path: string[] = [];
    let k = i;
    for (let level = LEVELS; level >= 1; level--) {
      const fan = level === LEVELS ? 12 : 4; // 12 × 4⁵ = 12,288 unique paths
      path.unshift(`Level ${level} item ${k % fan}`);
      k = Math.floor(k / fan);
    }
    rows.push({ path, value: (i * 37) % 1000 });
  }
  // a few deliberate duplicates so the validators have something to find
  for (let i = 0; i < Math.min(5, n); i++) {
    const src = rows[i * 97 % n];
    if (src) rows.push({ path: [...src.path], value: src.value });
  }
  return rows;
}

const PARENT_LIMIT = 4000;

/* --- validator 1: pairwise, O(n²) ----------------------------------------- */

function samePath(a: string[], b: string[], depth: number): boolean {
  for (let l = 0; l < depth; l++) if (a[l] !== b[l]) return false;
  return true;
}

function validatePairwise(rows: Row[]): Result {
  let duplicates = 0;
  let overBudget = 0;
  for (let i = 0; i < rows.length; i++) {
    const a = rows[i];
    if (!a) continue;
    let siblingSum = a.value;
    let firstOfParent = true;
    for (let j = 0; j < rows.length; j++) {
      if (i === j) continue;
      const b = rows[j];
      if (!b) continue;
      if (j > i && samePath(a.path, b.path, LEVELS)) duplicates++;
      if (samePath(a.path, b.path, LEVELS - 1)) {
        siblingSum += b.value;
        if (j < i) firstOfParent = false;
      }
    }
    if (firstOfParent && siblingSum > PARENT_LIMIT) overBudget++;
  }
  return { duplicates, overBudget };
}

/* --- validator 2: indexed by path, O(n) ----------------------------------- */

function validateIndexed(rows: Row[]): Result {
  const seen = new Map<string, number>();
  const parentSums = new Map<string, number>();
  let duplicates = 0;
  for (const r of rows) {
    const key = r.path.join(SEP);
    const count = seen.get(key) ?? 0;
    duplicates += count;
    seen.set(key, count + 1);
    const parent = r.path.slice(0, LEVELS - 1).join(SEP);
    parentSums.set(parent, (parentSums.get(parent) ?? 0) + r.value);
  }
  let overBudget = 0;
  for (const sum of parentSums.values()) if (sum > PARENT_LIMIT) overBudget++;
  return { duplicates, overBudget };
}

/* --- UI -------------------------------------------------------------------- */

function mount(host: HTMLElement) {
  const id = `vdemo-${Math.random().toString(36).slice(2, 8)}`;
  host.className = 'vdemo';
  host.innerHTML = `
    <p class="vdemo-title">Try it: the same validation, two ways</p>
    <p class="vdemo-note">Synthetic rows, timed in your browser on every keystroke. Switch the algorithm and type again. Pairwise at 12,000 rows freezes the page for a moment; that is the point.</p>
    <div class="vdemo-controls">
      <fieldset>
        <legend>Rows</legend>
        <div class="vdemo-seg">
          <label><input type="radio" name="${id}-n" value="3000" checked>3,000</label>
          <label><input type="radio" name="${id}-n" value="12000">12,000</label>
        </div>
      </fieldset>
      <fieldset>
        <legend>Validator</legend>
        <div class="vdemo-seg">
          <label><input type="radio" name="${id}-algo" value="pairwise" checked>pairwise O(n²)</label>
          <label><input type="radio" name="${id}-algo" value="indexed">indexed O(n)</label>
        </div>
      </fieldset>
    </div>
    <div class="vdemo-field">
      <label for="${id}-input">Edit a budget cell (type a number)</label>
      <input id="${id}-input" type="text" inputmode="numeric" autocomplete="off" value="120">
    </div>
    <dl class="vdemo-out" aria-live="polite">
      <div><dt>Last keystroke</dt><dd data-out="ms">–</dd></div>
      <div><dt>Issues found</dt><dd data-out="issues">–</dd></div>
      <div><dt>Rows checked</dt><dd data-out="rows">–</dd></div>
    </dl>`;

  const input = host.querySelector<HTMLInputElement>(`#${id}-input`);
  const outMs = host.querySelector<HTMLElement>('[data-out="ms"]');
  const outIssues = host.querySelector<HTMLElement>('[data-out="issues"]');
  const outRows = host.querySelector<HTMLElement>('[data-out="rows"]');
  if (!input || !outMs || !outIssues || !outRows) return;

  const cache = new Map<number, Row[]>();
  const rowsFor = (n: number) => {
    let rows = cache.get(n);
    if (!rows) {
      rows = makeRows(n);
      cache.set(n, rows);
    }
    return rows;
  };

  const selected = (name: string) =>
    host.querySelector<HTMLInputElement>(`input[name="${id}-${name}"]:checked`)?.value;

  function run() {
    if (!input || !outMs || !outIssues || !outRows) return;
    const n = Number(selected('n') ?? 3000);
    const algo = selected('algo') === 'indexed' ? validateIndexed : validatePairwise;
    const rows = rowsFor(n);
    const edited = rows[0];
    if (edited) edited.value = Number.parseFloat(input.value) || 0;

    const t0 = performance.now();
    const result = algo(rows);
    const ms = performance.now() - t0;

    outMs.textContent = ms < 10 ? `${ms.toFixed(1)} ms` : `${Math.round(ms)} ms`;
    outMs.classList.toggle('slow', ms > 100);
    outIssues.textContent = String(result.duplicates + result.overBudget);
    outRows.textContent = rows.length.toLocaleString('en');
  }

  input.addEventListener('input', run);
  host.querySelectorAll('input[type="radio"]').forEach((r) => r.addEventListener('change', run));
  run();
}

document.querySelectorAll<HTMLElement>('[data-demo="validator"]').forEach(mount);
