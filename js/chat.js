/* ============================================================
   MICH PROJECT — Live Chat System
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const userId = 'user_' + (localStorage.getItem('michUserId') || (() => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    localStorage.setItem('michUserId', id);
    return id;
  })());

  const userChatRef = typeof db !== 'undefined' ? db.ref('mich/chat/' + userId + '/messages') : null;

  // ---- POPUP CHAT ----
  const popupMessages = document.getElementById('chatPopupMessages');
  const popupInput = document.getElementById('chatPopupInput');
  const popupSend = document.getElementById('chatPopupSend');

  function addPopupMsg(text, isUser = false) {
    if (!popupMessages) return;
    const div = document.createElement('div');
    div.className = 'msg ' + (isUser ? 'user-msg' : 'admin-msg');
    div.textContent = text;
    popupMessages.appendChild(div);
    popupMessages.scrollTop = popupMessages.scrollHeight;
  }

  async function sendPopupMsg() {
    const text = popupInput?.value?.trim();
    if (!text) return;
    popupInput.value = '';
    addPopupMsg(text, true);
    if (userChatRef) {
      try {
        await userChatRef.push({ text, sender: 'user', time: Date.now() });
      } catch(e) {}
    }
  }

  if (popupSend) popupSend.addEventListener('click', sendPopupMsg);
  if (popupInput) {
    popupInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendPopupMsg(); });
  }

  // Listen for admin replies
  if (userChatRef) {
    userChatRef.on('child_added', snap => {
      const msg = snap.val();
      if (msg.sender === 'admin') addPopupMsg(msg.text, false);
    });
  }

  // ---- MINI CHAT BOX (Contact section) ----
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');

  function addMiniMsg(text, isUser = false) {
    if (!chatMessages) return;
    const div = document.createElement('div');
    div.style.cssText = `padding:8px 12px;border-radius:10px;font-size:0.85rem;max-width:80%;${isUser ? 'background:linear-gradient(135deg,var(--purple2),var(--blue));color:#fff;align-self:flex-end;margin-left:auto;' : 'background:rgba(168,85,247,0.1);color:var(--white);'}`;
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Welcome message
  setTimeout(() => {
    addMiniMsg('Assalamu Alaikum! Kya help kar sakta hoon? 👋');
  }, 1000);

  async function sendMiniMsg() {
    const text = chatInput?.value?.trim();
    if (!text) return;
    chatInput.value = '';
    addMiniMsg(text, true);
    if (userChatRef) {
      try { await userChatRef.push({ text, sender: 'user', time: Date.now() }); } catch(e) {}
    }
    // Auto reply
    setTimeout(() => {
      const replies = [
        'Shukriya! Hum aapka message dekh rahe hain. 🙏',
        'Zaroor! Humara team jald reply karega. Please WhatsApp par bhi message karein.',
        'JazakAllah! Aapki inquiry receive ho gayi. WhatsApp: +92 300 1234567',
      ];
      addMiniMsg(replies[Math.floor(Math.random() * replies.length)]);
    }, 1200);
  }

  if (chatSendBtn) chatSendBtn.addEventListener('click', sendMiniMsg);
  if (chatInput) chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMiniMsg(); });
});
