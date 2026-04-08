/**
 * copy-code.js
 * Injects a "copy" button into every code block chrome bar.
 * Button is hidden until the block is hovered.
 */

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.code-block').forEach(pre => {
    // Chrome bar is the sibling div directly before <pre>
    const chrome = pre.previousElementSibling;
    if (!chrome) return;

    const btn = document.createElement('button');
    btn.textContent = 'copy';
    btn.className = 'copy-btn';
    btn.setAttribute('aria-label', 'Copy code to clipboard');

    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(pre.textContent.trim());
        btn.textContent = 'copied!';
        btn.classList.add('copied');
      } catch (_) {
        btn.textContent = 'error';
      }
      setTimeout(() => {
        btn.textContent = 'copy';
        btn.classList.remove('copied');
      }, 1600);
    });

    // Append to right end of chrome bar (it's already flex)
    chrome.style.position = 'relative';
    chrome.appendChild(btn);
  });
});
