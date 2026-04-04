import confetti from "https://cdn.skypack.dev/canvas-confetti";

window.addEventListener("load", () => {
  const btn = document.getElementById("confetti-button");

  const audio = new Audio("/assets/party.mp3");
  audio.load();

  // Fixed full-screen canvas
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;pointer-events:none;";
  canvas.id = "confetti-canvas";
  document.body.appendChild(canvas);

  const shoot = confetti.create(canvas, { resize: true });

  function fire(opts) {
    shoot(Object.assign({
      ticks: 400,
      gravity: 1.0,
      drift: 0,
      colors: ['#00ff41', '#22c55e', '#ffc107', '#f59e0b', '#60a5fa', '#f472b6', '#ffffff', '#a78bfa'],
    }, opts));
  }

  if (!btn) return;

  btn.addEventListener("click", () => {
    audio.currentTime = 0;
    audio.play().catch(() => {});

    btn.classList.add("btn-celebrate");
    setTimeout(() => btn.classList.remove("btn-celebrate"), 600);

    // ── 1. Big upward burst from bottom-center
    fire({ particleCount: 160, spread: 120, startVelocity: 65, origin: { x: 0.5, y: 1 } });

    // ── 2. Left & right bottom cannons
    setTimeout(() => {
      fire({ particleCount: 80, angle: 65,  spread: 55, startVelocity: 60, origin: { x: 0,   y: 1   } });
      fire({ particleCount: 80, angle: 115, spread: 55, startVelocity: 60, origin: { x: 1,   y: 1   } });
    }, 80);

    // ── 3. Top corners raining DOWN
    setTimeout(() => {
      fire({ particleCount: 90, angle: 260, spread: 70, startVelocity: 40, gravity: 1.4, origin: { x: 0.1, y: 0 } });
      fire({ particleCount: 90, angle: 280, spread: 70, startVelocity: 40, gravity: 1.4, origin: { x: 0.9, y: 0 } });
    }, 180);

    // ── 4. Top-center shower raining straight down
    setTimeout(() => {
      fire({ particleCount: 120, angle: 270, spread: 80, startVelocity: 30, gravity: 1.2, origin: { x: 0.5, y: 0 } });
    }, 300);

    // ── 5. Mid-screen side blasts
    setTimeout(() => {
      fire({ particleCount: 60, angle: 45,  spread: 50, startVelocity: 55, origin: { x: 0, y: 0.5 } });
      fire({ particleCount: 60, angle: 135, spread: 50, startVelocity: 55, origin: { x: 1, y: 0.5 } });
    }, 450);

    // ── 6. Sustained rain from top for 3s
    const rainEnd = Date.now() + 3000;
    (function rain() {
      fire({ particleCount: 8, angle: 265, spread: 90, startVelocity: 20, gravity: 1.3, origin: { x: Math.random(), y: 0 }, ticks: 280 });
      fire({ particleCount: 8, angle: 60,  spread: 55, startVelocity: 35, origin: { x: 0,            y: 0.6 }, ticks: 220 });
      fire({ particleCount: 8, angle: 120, spread: 55, startVelocity: 35, origin: { x: 1,            y: 0.6 }, ticks: 220 });
      if (Date.now() < rainEnd) requestAnimationFrame(rain);
    })();
  });
});
