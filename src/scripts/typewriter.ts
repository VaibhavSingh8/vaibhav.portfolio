const tw = document.getElementById('typewriter');
if (tw) {
  const phrases = [
    'UI · Agents · Systems',
    'Builds fast. Breaks things. Fixes them.',
    'Makes things ship on Friday.',
    'Also makes chai.',
  ];
  let pi = 0;
  let ci = 0;
  let dir = 1;

  function tick() {
    const p = phrases[pi];
    if (!p || !tw) return;
    ci += dir;
    tw.textContent = p.slice(0, ci) + (Date.now() % 900 < 450 ? '▎' : ' ');
    if (dir === 1 && ci === p.length) {
      dir = 0;
      setTimeout(() => {
        dir = -1;
        tick();
      }, 1600);
      return;
    }
    if (dir === -1 && ci === 0) {
      dir = 1;
      pi = (pi + 1) % phrases.length;
    }
    setTimeout(tick, dir === 1 ? 55 + Math.random() * 40 : 28);
  }
  tick();
}
