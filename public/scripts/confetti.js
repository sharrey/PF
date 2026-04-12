/**
 * confetti.js — LET'S SHIP IT button: rockets + confetti
 * Depends on canvas-confetti loaded as a global (window.confetti)
 */

window.addEventListener("load", () => {
  const btn = document.getElementById("confetti-button");
  if (!btn) return;

  const audio = new Audio("/assets/party.mp3");
  audio.load();

  // Fixed full-screen canvas for confetti
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;pointer-events:none;";
  canvas.id = "confetti-canvas";
  document.body.appendChild(canvas);

  const shoot = window.confetti
    ? window.confetti.create(canvas, { resize: true })
    : null;

  function fire(opts) {
    if (!shoot) return;
    shoot(Object.assign({
      ticks: 400,
      gravity: 1.0,
      drift: 0,
      colors: ['#00ff41', '#22c55e', '#ffc107', '#f59e0b', '#60a5fa', '#f472b6', '#ffffff', '#a78bfa'],
    }, opts));
  }

  // ── Rocket style injection ──────────────────────────────────
  const rocketStyle = document.createElement('style');
  rocketStyle.textContent = `
    @keyframes rocket-fly {
      0%   { transform: translate(0, 0) rotate(var(--r)) scale(1); opacity: 1; }
      80%  { opacity: 1; }
      100% { transform: translate(var(--tx), var(--ty)) rotate(var(--r)) scale(0.6); opacity: 0; }
    }
    .rocket-particle {
      position: fixed;
      font-size: var(--size);
      pointer-events: none;
      z-index: 10000;
      animation: rocket-fly var(--dur) cubic-bezier(0.2, 0.8, 0.4, 1) forwards;
      filter: drop-shadow(0 0 6px rgba(34,197,94,0.7));
    }
  `;
  document.head.appendChild(rocketStyle);

  function launchRockets() {
    const count = 22;
    const W = window.innerWidth;
    const H = window.innerHeight;

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const el = document.createElement('span');
        el.className = 'rocket-particle';
        el.textContent = '🚀';

        const edge = Math.random();
        let startX, startY;
        if (edge < 0.6) {
          startX = Math.random() * W;
          startY = H - 20;
        } else if (edge < 0.8) {
          startX = 10;
          startY = H * 0.3 + Math.random() * H * 0.5;
        } else {
          startX = W - 10;
          startY = H * 0.3 + Math.random() * H * 0.5;
        }

        const endX = W * 0.1 + Math.random() * W * 0.8;
        const endY = -(H * 0.1 + Math.random() * H * 0.6);
        const tx = endX - startX;
        const ty = endY - startY;
        const angle = Math.atan2(tx, -ty) * (180 / Math.PI);
        const size = 20 + Math.random() * 22;
        const dur  = 0.9 + Math.random() * 1.1;

        el.style.cssText = `
          left: ${startX}px;
          top:  ${startY}px;
          --tx:   ${tx}px;
          --ty:   ${ty}px;
          --r:    ${angle}deg;
          --size: ${size}px;
          --dur:  ${dur}s;
        `;

        document.body.appendChild(el);
        setTimeout(() => el.remove(), dur * 1000 + 100);
      }, i * 60);
    }
  }

  btn.addEventListener("click", () => {
    launchRockets();

    audio.currentTime = 0;
    audio.play().catch(() => {});

    btn.classList.add("btn-celebrate");
    setTimeout(() => btn.classList.remove("btn-celebrate"), 600);

    fire({ particleCount: 160, spread: 120, startVelocity: 65, origin: { x: 0.5, y: 1 } });

    setTimeout(() => {
      fire({ particleCount: 80, angle: 65,  spread: 55, startVelocity: 60, origin: { x: 0, y: 1 } });
      fire({ particleCount: 80, angle: 115, spread: 55, startVelocity: 60, origin: { x: 1, y: 1 } });
    }, 80);

    setTimeout(() => {
      fire({ particleCount: 90, angle: 260, spread: 70, startVelocity: 40, gravity: 1.4, origin: { x: 0.1, y: 0 } });
      fire({ particleCount: 90, angle: 280, spread: 70, startVelocity: 40, gravity: 1.4, origin: { x: 0.9, y: 0 } });
    }, 180);

    setTimeout(() => {
      fire({ particleCount: 120, angle: 270, spread: 80, startVelocity: 30, gravity: 1.2, origin: { x: 0.5, y: 0 } });
    }, 300);

    setTimeout(() => {
      fire({ particleCount: 60, angle: 45,  spread: 50, startVelocity: 55, origin: { x: 0, y: 0.5 } });
      fire({ particleCount: 60, angle: 135, spread: 50, startVelocity: 55, origin: { x: 1, y: 0.5 } });
    }, 450);

    const rainEnd = Date.now() + 3000;
    (function rain() {
      fire({ particleCount: 8, angle: 265, spread: 90, startVelocity: 20, gravity: 1.3, origin: { x: Math.random(), y: 0 }, ticks: 280 });
      fire({ particleCount: 8, angle: 60,  spread: 55, startVelocity: 35, origin: { x: 0, y: 0.6 }, ticks: 220 });
      fire({ particleCount: 8, angle: 120, spread: 55, startVelocity: 35, origin: { x: 1, y: 0.6 }, ticks: 220 });
      if (Date.now() < rainEnd) requestAnimationFrame(rain);
    })();
  });
});
