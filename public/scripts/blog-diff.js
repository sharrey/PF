/**
 * blog-diff.js
 * Shows a git-diff-style popover on blog card hover.
 */

document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.blog-card[data-diff]');
  if (!cards.length) return;

  // ── Build one shared popover ─────────────────────────────
  const pop = document.createElement('div');
  pop.id = 'diff-pop';
  Object.assign(pop.style, {
    position:      'fixed',
    zIndex:        '8000',
    pointerEvents: 'none',
    opacity:       '0',
    transform:     'translateY(6px)',
    transition:    'opacity 0.18s ease, transform 0.18s ease',
    maxWidth:      '360px',
    width:         'max-content',
    background:    '#0d0d0d',
    border:        '1px solid #27272a',
    borderRadius:  '10px',
    padding:       '10px 14px',
    fontFamily:    '"JetBrains Mono", "Fira Mono", monospace',
    fontSize:      '11px',
    lineHeight:    '1.8',
    boxShadow:     '0 8px 32px rgba(0,0,0,0.7)',
  });
  document.body.appendChild(pop);

  let hideTimer = null;

  function show(card) {
    clearTimeout(hideTimer);

    const lines = JSON.parse(card.dataset.diff || '[]');
    if (!lines.length) return;

    // Build diff content
    pop.innerHTML = `
      <div style="color:#3f3f46;margin-bottom:6px;">
        diff --git a/post.md b/post.md
      </div>
      <div style="color:#3f3f46;">@@ -0,0 +1,${lines.length} @@</div>
      ${lines.map(l => `<div><span style="color:#22c55e;user-select:none;">+&nbsp;</span><span style="color:#a1a1aa;">${l}</span></div>`).join('')}
    `;

    // Position: above the card, centred horizontally
    const rect   = card.getBoundingClientRect();
    const popH   = 90; // rough estimate before paint
    const spaceAbove = rect.top;

    const top = spaceAbove > popH + 16
      ? rect.top - popH - 12        // above
      : rect.bottom + 10;           // below if too close to top

    const left = Math.min(
      Math.max(rect.left, 8),
      window.innerWidth - 376,
    );

    pop.style.top  = `${top}px`;
    pop.style.left = `${left}px`;

    // Trigger transition
    requestAnimationFrame(() => {
      pop.style.opacity   = '1';
      pop.style.transform = 'translateY(0)';
    });
  }

  function hide() {
    hideTimer = setTimeout(() => {
      pop.style.opacity   = '0';
      pop.style.transform = 'translateY(6px)';
    }, 80);
  }

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => show(card));
    card.addEventListener('mouseleave', hide);
    card.addEventListener('focus',      () => show(card));
    card.addEventListener('blur',       hide);
  });
});
