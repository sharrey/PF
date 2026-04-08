(() => {
  const widget   = document.getElementById('chat-widget');
  const messages = document.getElementById('chat-messages');
  const form     = document.getElementById('chat-form');
  const input    = document.getElementById('chat-input');
  const closeBtn = document.getElementById('chat-close');
  const trigger  = document.getElementById('android-img');

  if (!widget || !trigger) return;

  // Conversation history sent to API
  const history = [];

  function openChat() {
    widget.classList.add('chat-open');
    widget.setAttribute('aria-hidden', 'false');
    input.focus();
  }

  function closeChat() {
    widget.classList.remove('chat-open');
    widget.setAttribute('aria-hidden', 'true');
  }

  trigger.addEventListener('click', openChat);
  closeBtn.addEventListener('click', closeChat);

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeChat();
  });

  function appendMsg(text, role) {
    const el = document.createElement('div');
    el.className = `msg msg-${role === 'user' ? 'user' : 'ai'}`;
    el.textContent = text;
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
  }

  function appendTyping() {
    const el = document.createElement('div');
    el.className = 'msg msg-ai msg-typing';
    el.id = 'chat-typing';
    el.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
    return el;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    input.disabled = true;
    document.getElementById('chat-send').disabled = true;

    appendMsg(text, 'user');
    history.push({ role: 'user', content: text });

    const typing = appendTyping();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();
      const reply = data.reply ?? data.error ?? 'Something went wrong.';

      typing.remove();
      appendMsg(reply, 'assistant');
      history.push({ role: 'assistant', content: reply });
    } catch {
      typing.remove();
      appendMsg('Network error — try again.', 'assistant');
    } finally {
      input.disabled = false;
      document.getElementById('chat-send').disabled = false;
      input.focus();
    }
  });
})();
