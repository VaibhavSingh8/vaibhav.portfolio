interface Star {
  x: number;
  y: number;
  r: number;
  a: number;
  s: number;
  t: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  len: number;
}

(function initMeteors() {
  const cvs = document.getElementById('meteors') as HTMLCanvasElement | null;
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  if (!ctx) return;

  let W = 0;
  let H = 0;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const stars: Star[] = [];
  const meteors: Meteor[] = [];

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    cvs!.width = W * dpr;
    cvs!.height = H * dpr;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars.length = 0;
    const count = Math.min(120, Math.round((W * H) / 18000));
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 0.9 + 0.2,
        a: Math.random() * 0.5 + 0.2,
        s: Math.random() * 0.6 + 0.2,
        t: Math.random() * Math.PI * 2,
      });
    }
  }
  resize();
  window.addEventListener('resize', resize);

  function spawnMeteor() {
    const fromLeft = Math.random() < 0.55;
    const sx = fromLeft ? -40 : W + 40;
    const sy = Math.random() * H * 0.6;
    const dir = fromLeft ? 1 : -1;
    const speed = 4 + Math.random() * 3.5;
    meteors.push({
      x: sx,
      y: sy,
      vx: dir * speed * 1.2,
      vy: speed * 0.55,
      life: 0,
      maxLife: 70 + Math.random() * 30,
      len: 90 + Math.random() * 80,
    });
    setTimeout(spawnMeteor, 2200 + Math.random() * 5200);
  }
  setTimeout(spawnMeteor, 1400);

  function getInk() {
    const dark = document.documentElement.dataset['theme'] === 'dark';
    return dark ? 'rgba(255,252,245,' : 'rgba(30,28,24,';
  }

  function frame() {
    ctx!.clearRect(0, 0, W, H);
    const inkBase = getInk();
    for (const s of stars) {
      s.t += 0.008 * s.s;
      const alpha = s.a * (0.55 + 0.45 * Math.sin(s.t));
      ctx!.fillStyle = inkBase + alpha.toFixed(3) + ')';
      ctx!.beginPath();
      ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx!.fill();
    }
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      if (!m) continue;
      m.life++;
      m.x += m.vx;
      m.y += m.vy;
      const fade = 1 - m.life / m.maxLife;
      if (fade <= 0 || m.x < -200 || m.x > W + 200 || m.y > H + 80) {
        meteors.splice(i, 1);
        continue;
      }
      const speed = Math.hypot(m.vx, m.vy);
      const tailX = m.x - (m.vx / speed) * m.len;
      const tailY = m.y - (m.vy / speed) * m.len;
      const grad = ctx!.createLinearGradient(tailX, tailY, m.x, m.y);
      grad.addColorStop(0, inkBase + '0)');
      grad.addColorStop(1, inkBase + (0.55 * fade).toFixed(3) + ')');
      ctx!.strokeStyle = grad;
      ctx!.lineWidth = 1.1;
      ctx!.beginPath();
      ctx!.moveTo(tailX, tailY);
      ctx!.lineTo(m.x, m.y);
      ctx!.stroke();
      ctx!.fillStyle = inkBase + (0.75 * fade).toFixed(3) + ')';
      ctx!.beginPath();
      ctx!.arc(m.x, m.y, 1.3, 0, Math.PI * 2);
      ctx!.fill();
    }
    requestAnimationFrame(frame);
  }
  frame();
})();
