/**
 * animations.js
 * – Card entrance: staggered fade-up via IntersectionObserver
 * – Skill bars: fill from 0 → target on scroll into view
 * – Skill counters: count-up from 0 → target %
 */

document.addEventListener('DOMContentLoaded', () => {

  // ── CARD ENTRANCE ─────────────────────────────────────────
  const cards = document.querySelectorAll('[data-card]');

  if (cards.length) {
    // Set initial hidden state
    cards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(22px)';
      card.style.transition = `opacity 0.55s ease ${i * 90}ms, transform 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${i * 90}ms`;
    });

    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            cardObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    cards.forEach(card => cardObserver.observe(card));
  }

  // ── SKILL BARS + COUNTERS ─────────────────────────────────
  const skillsGrid = document.querySelector('[data-skills]');

  if (skillsGrid) {
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          const bars     = entry.target.querySelectorAll('.skill-bar-fill');
          const counters = entry.target.querySelectorAll('.skill-pct');

          bars.forEach((bar, i) => {
            const pct = bar.dataset.pct;
            setTimeout(() => {
              bar.style.transition = 'width 1.1s cubic-bezier(0.22, 1, 0.36, 1)';
              bar.style.width = pct + '%';
            }, 120 + i * 75);
          });

          counters.forEach((el, i) => {
            const target = parseInt(el.dataset.pct, 10);
            setTimeout(() => {
              countUp(el, 0, target, 1000);
            }, 120 + i * 75);
          });

          skillObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    skillObserver.observe(skillsGrid);
  }

});

// Ease-out cubic count-up
function countUp(el, from, to, duration) {
  const start = performance.now();
  function tick(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(from + (to - from) * eased) + '%';
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
