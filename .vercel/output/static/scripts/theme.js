/**
 * theme.js
 * 1. Dark ↔ Light mode toggle
 * 2. Lofi music toggle (loops /assets/lofi.mp3)
 */

const THEME_KEY = 'sharriy-theme';
const SOUND_KEY = 'sharriy-sound';

// ── Theme ──────────────────────────────────────────────────
function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  localStorage.setItem(THEME_KEY, theme);

  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = theme === 'light' ? '[dark]' : '[light]';

  // Notify Three.js canvas (if on homepage)
  document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme') ?? 'dark';
  applyTheme(cur === 'light' ? 'dark' : 'light');
}

// ── Lofi Music ─────────────────────────────────────────────
let lofi = null;

function initLofi() {
  if (lofi) return lofi;
  lofi = new Audio('/assets/lofi.mp3');
  lofi.loop = true;
  lofi.volume = 0.35;
  return lofi;
}

function toggleSound() {
  const a = initLofi();
  const wasPlaying = !a.paused;
  if (wasPlaying) {
    a.pause();
  } else {
    a.play().catch(() => {});
  }
  const btn = document.getElementById('sound-toggle');
  if (btn) btn.textContent = wasPlaying ? '[♪ off]' : '[♪ on]';
  localStorage.setItem(SOUND_KEY, wasPlaying ? 'off' : 'on');
}

// ── Init ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Restore saved theme (default: dark)
  const saved = localStorage.getItem(THEME_KEY) ?? 'dark';
  applyTheme(saved);

  // Restore sound label
  const savedSound = localStorage.getItem(SOUND_KEY);
  const sBtn = document.getElementById('sound-toggle');
  if (sBtn) sBtn.textContent = savedSound === 'on' ? '[♪ on]' : '[♪ off]';

  // Wire buttons
  document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
  document.getElementById('sound-toggle')?.addEventListener('click', toggleSound);
});
