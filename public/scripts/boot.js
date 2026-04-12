/**
 * boot.js — one-time fake boot sequence on first visit
 * Stores a flag in localStorage so it never replays.
 */

(function () {
  // Skip if already seen
  if (localStorage.getItem('boot_seen')) return;

  const LINES = [
    { text: 'BIOS v2.4.1 — sharriy.sh bootloader',           delay: 0,    color: '#71717a', prefix: '' },
    { text: 'Initializing kernel modules...',                  delay: 300,  color: '#71717a', prefix: '' },
    { text: 'Loading cloud drivers',                           delay: 580,  color: '#a1a1aa', prefix: 'LOAD' },
    { text: 'Mounting /dev/brain (ext4, rw)',                  delay: 820,  color: '#a1a1aa', prefix: 'MOUNT' },
    { text: 'Starting containerd.service',                     delay: 1050, color: '#a1a1aa', prefix: 'OK' },
    { text: 'Starting kubelet.service',                        delay: 1220, color: '#a1a1aa', prefix: 'OK' },
    { text: 'Pulling sharriy/portfolio:latest',                delay: 1420, color: '#a1a1aa', prefix: 'PULL' },
    { text: 'docker: sha256:4a8f…c3d2 pulled',                delay: 1750, color: '#52525b', prefix: '' },
    { text: 'Applying Terraform plan (3 changes)',             delay: 1950, color: '#a1a1aa', prefix: 'APPLY' },
    { text: 'terraform: Apply complete! Resources: 3 added.',  delay: 2250, color: '#52525b', prefix: '' },
    { text: 'Running helm upgrade portfolio ./chart',          delay: 2480, color: '#a1a1aa', prefix: 'HELM' },
    { text: 'Deployment "portfolio" successfully rolled out',  delay: 2750, color: '#52525b', prefix: '' },
    { text: 'Coffee supply',                                   delay: 3000, color: '#f59e0b', prefix: 'WARN', warn: true },
    { text: 'Caffeine levels critical — reloading anyway',     delay: 3200, color: '#52525b', prefix: '' },
    { text: 'CI/CD pipeline',                                  delay: 3430, color: '#22c55e', prefix: 'OK' },
    { text: 'Kubernetes cluster',                              delay: 3580, color: '#22c55e', prefix: 'OK' },
    { text: 'portfolio.sh',                                    delay: 3730, color: '#22c55e', prefix: 'OK' },
    { text: 'All systems operational. Welcome.',               delay: 4000, color: '#22c55e', prefix: 'BOOT' },
  ];

  // ── Wait for body before injecting ─────────────────────────
  function run() {
    if (!document.body) {
      document.addEventListener('DOMContentLoaded', run);
      return;
    }
    init();
  }
  run();

  function init() {

  // ── Build overlay ───────────────────────────────────────────
  const overlay = document.createElement('div');
  overlay.id = 'boot-overlay';
  Object.assign(overlay.style, {
    position:        'fixed',
    inset:           '0',
    zIndex:          '9999',
    background:      '#000',
    display:         'flex',
    flexDirection:   'column',
    justifyContent:  'center',
    padding:         'clamp(24px, 6vw, 80px)',
    fontFamily:      '"JetBrains Mono", "Fira Mono", monospace',
    fontSize:        'clamp(11px, 1.5vw, 13px)',
    lineHeight:      '1.9',
    overflowY:       'auto',
    transition:      'opacity 0.6s ease',
  });

  // Skip button
  const skipBtn = document.createElement('button');
  skipBtn.textContent = 'skip →';
  Object.assign(skipBtn.style, {
    position:   'fixed',
    top:        '20px',
    right:      '24px',
    background: 'transparent',
    border:     '1px solid #27272a',
    color:      '#52525b',
    padding:    '4px 12px',
    borderRadius: '6px',
    cursor:     'pointer',
    fontFamily: 'inherit',
    fontSize:   '11px',
    zIndex:     '10000',
    transition: 'color 0.15s, border-color 0.15s',
  });
  skipBtn.addEventListener('mouseenter', () => {
    skipBtn.style.color = '#22c55e';
    skipBtn.style.borderColor = '#22c55e';
  });
  skipBtn.addEventListener('mouseleave', () => {
    skipBtn.style.color = '#52525b';
    skipBtn.style.borderColor = '#27272a';
  });

  const logContainer = document.createElement('div');
  logContainer.style.maxWidth = '680px';
  logContainer.style.margin   = '0 auto';
  logContainer.style.width    = '100%';

  overlay.appendChild(logContainer);
  overlay.appendChild(skipBtn);
  document.body.appendChild(overlay);
  // Freeze page scroll while boot runs
  document.body.style.overflow = 'hidden';

  // ── Helper: append a log line ───────────────────────────────
  function appendLine(line) {
    const row = document.createElement('div');
    row.style.display    = 'flex';
    row.style.gap        = '12px';
    row.style.alignItems = 'baseline';
    row.style.opacity    = '0';
    row.style.transition = 'opacity 0.25s ease';

    if (line.prefix) {
      const badge = document.createElement('span');
      badge.textContent = `[ ${line.prefix.padEnd(5)} ]`;
      badge.style.flexShrink = '0';
      badge.style.color =
        line.prefix === 'OK'    ? '#22c55e' :
        line.prefix === 'WARN'  ? '#f59e0b' :
        line.prefix === 'ERR'   ? '#ef4444' :
                                   '#3f3f46';
      row.appendChild(badge);
    } else {
      const spacer = document.createElement('span');
      spacer.style.flexShrink = '0';
      spacer.style.width      = '78px'; // same as badge width
      row.appendChild(spacer);
    }

    const msg = document.createElement('span');
    msg.textContent = line.text;
    msg.style.color = line.color;
    row.appendChild(msg);

    logContainer.appendChild(row);
    // Fade in on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { row.style.opacity = '1'; });
    });
  }

  // ── Schedule lines ──────────────────────────────────────────
  let timers = [];

  LINES.forEach((line) => {
    timers.push(setTimeout(() => appendLine(line), line.delay));
  });

  // Final: fade out and remove
  const TOTAL = 4800;
  timers.push(setTimeout(dismiss, TOTAL));

  function dismiss() {
    timers.forEach(clearTimeout);
    timers = [];
    localStorage.setItem('boot_seen', '1');
    overlay.style.opacity = '0';
    document.body.style.overflow = '';
    setTimeout(() => overlay.remove(), 650);
  }

  skipBtn.addEventListener('click', dismiss);

  } // end init()
})();
