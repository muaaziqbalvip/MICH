/* ============================================================
   MICH PROJECT — Admin Panel JS
   ============================================================ */

const ADMIN_EMAIL = 'muaaz@michproject.com';
const ADMIN_PASS_HASH = 'mich2026admin'; // Simple check, use Firebase Auth in production

document.addEventListener('DOMContentLoaded', () => {

  // ---- LOGIN ----
  const loginForm = document.getElementById('adminLoginForm');
  const loginError = document.getElementById('loginError');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('adminEmail').value;
      const pass = document.getElementById('adminPass').value;

      const btn = loginForm.querySelector('button[type=submit]');
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';
      btn.disabled = true;

      // Firebase Auth Login
      if (typeof auth !== 'undefined') {
        auth.signInWithEmailAndPassword(email, pass)
          .then(() => showDashboard())
          .catch((err) => {
            // Fallback check
            if (pass === ADMIN_PASS_HASH) { showDashboard(); return; }
            loginError.textContent = '❌ Invalid credentials. ' + err.message;
            loginError.style.display = 'block';
            btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            btn.disabled = false;
          });
      } else {
        if (pass === ADMIN_PASS_HASH) { showDashboard(); }
        else {
          loginError.textContent = '❌ Invalid password.';
          loginError.style.display = 'block';
          btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
          btn.disabled = false;
        }
      }
    });
  }

  function showDashboard() {
    document.getElementById('adminLoginPage')?.classList.add('hidden');
    document.getElementById('adminDashboardPage')?.classList.remove('hidden');
    loadDashboard();
  }

  // ---- LOGOUT ----
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    if (typeof auth !== 'undefined') auth.signOut();
    document.getElementById('adminLoginPage')?.classList.remove('hidden');
    document.getElementById('adminDashboardPage')?.classList.add('hidden');
  });

  // ---- NAV ----
  document.querySelectorAll('.admin-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.admin-nav-item').forEach(i => i.classList.remove('active'));
      document.querySelectorAll('.admin-page').forEach(p => p.classList.remove('active'));
      item.classList.add('active');
      const page = item.dataset.page;
      const pageEl = document.getElementById('page-' + page);
      if (pageEl) pageEl.classList.add('active');
      if (page === 'chat') loadAdminChat();
      if (page === 'orders') loadOrders();
    });
  });

  // ---- LOAD DASHBOARD ----
  function loadDashboard() {
    loadStats();
    loadProjectsAdmin();
    loadOrders();
    // Show first page
    document.getElementById('page-overview')?.classList.add('active');
    document.querySelector('.admin-nav-item')?.classList.add('active');
  }

  // ---- STATS ----
  function loadStats() {
    if (typeof db === 'undefined') return;
    db.ref('mich/projects').once('value', s => {
      document.getElementById('statProjects').textContent = s.numChildren();
    });
    db.ref('mich/orders').once('value', s => {
      document.getElementById('statOrders').textContent = s.numChildren();
    });
    db.ref('mich/chat').once('value', s => {
      document.getElementById('statChats').textContent = s.numChildren();
    });
    db.ref('mich/visitors').on('value', s => {
      document.getElementById('statVisitors').textContent = s.numChildren() || 0;
    });
  }

  // ---- ADD PROJECT ----
  const addProjectForm = document.getElementById('addProjectForm');
  if (addProjectForm) {
    const posterUrlInput = document.getElementById('projectPosterUrl');
    const imgPreview = document.getElementById('projectImgPreview');

    posterUrlInput?.addEventListener('input', () => {
      const url = posterUrlInput.value.trim();
      if (url) { imgPreview.src = url; imgPreview.classList.add('show'); }
      else imgPreview.classList.remove('show');
    });

    addProjectForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = addProjectForm.querySelector('button[type=submit]');
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
      btn.disabled = true;

      const project = {
        title: document.getElementById('projectTitle').value,
        category: document.getElementById('projectCategory').value,
        description: document.getElementById('projectDesc').value,
        price: document.getElementById('projectPrice').value,
        poster: document.getElementById('projectPosterUrl').value,
        wa: document.getElementById('projectWa').value || '923001234567',
        tg: document.getElementById('projectTg').value || 'michproject',
        timestamp: Date.now()
      };

      try {
        if (typeof projectsRef !== 'undefined') {
          await projectsRef.push(project);
          showAdminToast('✅ Project add ho gaya!', 'success');
          addProjectForm.reset();
          imgPreview.classList.remove('show');
          loadProjectsAdmin();
        }
      } catch (err) {
        showAdminToast('❌ Error: ' + err.message, 'error');
      }

      btn.innerHTML = '<i class="fas fa-plus"></i> Add Project';
      btn.disabled = false;
    });
  }

  // ---- LOAD PROJECTS (Admin) ----
  function loadProjectsAdmin() {
    const tbody = document.getElementById('projectsTableBody');
    if (!tbody || typeof projectsRef === 'undefined') return;
    projectsRef.on('value', snap => {
      tbody.innerHTML = '';
      const data = snap.val();
      if (!data) { tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--gray);">Koi project nahi mila.</td></tr>'; return; }
      Object.entries(data).reverse().forEach(([id, p]) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><img src="${p.poster||''}" alt="" style="width:48px;height:40px;object-fit:cover;border-radius:6px;" onerror="this.style.display='none'"/></td>
          <td style="color:#fff;font-weight:600;">${p.title}</td>
          <td><span class="status-badge status-active">${p.category||'web'}</span></td>
          <td style="color:var(--yellow);">${p.price||'-'}</td>
          <td><span class="status-badge status-active">Active</span></td>
          <td>
            <button class="btn-delete" onclick="deleteProject('${id}')"><i class="fas fa-trash"></i></button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    });
  }

  window.deleteProject = async function(id) {
    if (!confirm('Is project ko delete karen?')) return;
    try {
      await projectsRef.child(id).remove();
      showAdminToast('✅ Project delete ho gaya!', 'success');
    } catch (err) {
      showAdminToast('❌ Error: ' + err.message, 'error');
    }
  };

  // ---- LOAD ORDERS ----
  function loadOrders() {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody || typeof ordersRef === 'undefined') return;
    ordersRef.on('value', snap => {
      tbody.innerHTML = '';
      const data = snap.val();
      if (!data) { tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--gray);">Koi order nahi mila.</td></tr>'; return; }
      Object.entries(data).reverse().forEach(([id, o]) => {
        const tr = document.createElement('tr');
        const date = new Date(o.timestamp).toLocaleDateString('en-PK');
        tr.innerHTML = `
          <td style="color:#fff;font-weight:600;">${o.name}</td>
          <td>${o.phone}</td>
          <td>${o.service}</td>
          <td><span class="status-badge status-${o.status||'pending'}">${o.status||'Pending'}</span></td>
          <td>
            <button class="btn-edit" onclick="updateOrderStatus('${id}','active')">Active</button>
            <button class="btn-delete" onclick="deleteOrder('${id}')"><i class="fas fa-trash"></i></button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    });
  }

  window.updateOrderStatus = async function(id, status) {
    try { await ordersRef.child(id).update({ status }); showAdminToast('✅ Status update ho gaya!', 'success'); }
    catch(err) { showAdminToast('❌ ' + err.message, 'error'); }
  };
  window.deleteOrder = async function(id) {
    if (!confirm('Order delete karen?')) return;
    try { await ordersRef.child(id).remove(); showAdminToast('✅ Order deleted!', 'success'); }
    catch(err) { showAdminToast('❌ ' + err.message, 'error'); }
  };

  // ---- ADMIN CHAT ----
  let activeUserId = null;
  function loadAdminChat() {
    const userList = document.getElementById('chatUserList');
    if (!userList || typeof chatRef === 'undefined') return;
    chatRef.on('value', snap => {
      userList.innerHTML = '';
      const data = snap.val();
      if (!data) { userList.innerHTML = '<div style="padding:20px;color:var(--gray);font-size:0.85rem;">Koi chat nahi.</div>'; return; }
      Object.entries(data).forEach(([uid, userData]) => {
        const msgs = Object.values(userData.messages || {});
        const lastMsg = msgs[msgs.length - 1];
        const userMsgs = msgs.filter(m => m.sender === 'user');
        const unread = userMsgs.filter(m => !m.read).length;
        const div = document.createElement('div');
        div.className = 'chat-user-item' + (uid === activeUserId ? ' active' : '');
        div.innerHTML = `
          <div class="chat-user-avatar">${uid.slice(5,7).toUpperCase()}</div>
          <div style="flex:1;min-width:0;">
            <div class="chat-user-name">User ${uid.slice(-4)}</div>
            <div class="chat-user-preview">${lastMsg?.text || 'No messages'}</div>
          </div>
          ${unread > 0 ? `<div class="unread-badge">${unread}</div>` : ''}
        `;
        div.addEventListener('click', () => openAdminChat(uid));
        userList.appendChild(div);
      });
    });
  }

  function openAdminChat(uid) {
    activeUserId = uid;
    const chatWindow = document.getElementById('adminChatMessages');
    if (!chatWindow) return;
    document.querySelectorAll('.chat-user-item').forEach(i => i.classList.remove('active'));
    document.querySelector(`[data-uid="${uid}"]`)?.classList.add('active');

    db.ref('mich/chat/' + uid + '/messages').on('value', snap => {
      chatWindow.innerHTML = '';
      const data = snap.val();
      if (!data) return;
      Object.values(data).forEach(msg => {
        const div = document.createElement('div');
        div.className = 'msg ' + (msg.sender === 'user' ? 'admin-msg' : 'user-msg');
        div.style.alignSelf = msg.sender === 'admin' ? 'flex-end' : 'flex-start';
        div.textContent = (msg.sender === 'admin' ? '👤 Admin: ' : '👤 User: ') + msg.text;
        chatWindow.appendChild(div);
      });
      chatWindow.scrollTop = chatWindow.scrollHeight;
    });

    document.getElementById('adminChatHeader').textContent = `User ${uid.slice(-6)}`;
  }

  const adminChatSend = document.getElementById('adminChatSend');
  const adminChatInput = document.getElementById('adminChatInput');
  if (adminChatSend) {
    adminChatSend.addEventListener('click', sendAdminReply);
    adminChatInput?.addEventListener('keydown', e => { if (e.key === 'Enter') sendAdminReply(); });
  }

  async function sendAdminReply() {
    if (!activeUserId || !adminChatInput?.value?.trim()) return;
    const text = adminChatInput.value.trim();
    adminChatInput.value = '';
    try {
      await db.ref('mich/chat/' + activeUserId + '/messages').push({ text, sender: 'admin', time: Date.now() });
    } catch (err) { console.error(err); }
  }

  // ---- ADD POSTER ----
  const addPosterForm = document.getElementById('addPosterForm');
  if (addPosterForm) {
    addPosterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const poster = {
        title: document.getElementById('posterTitle').value,
        url: document.getElementById('posterUrl').value,
        subtitle: document.getElementById('posterSubtitle').value,
        price: document.getElementById('posterPrice').value,
        timestamp: Date.now()
      };
      try {
        await postersRef.push(poster);
        showAdminToast('✅ Poster add ho gaya!', 'success');
        addPosterForm.reset();
      } catch (err) {
        showAdminToast('❌ Error: ' + err.message, 'error');
      }
    });
  }

  // ---- TOAST ----
  function showAdminToast(msg, type) {
    const toast = document.createElement('div');
    toast.style.cssText = `position:fixed;top:24px;right:24px;z-index:9999;background:${type==='success'?'rgba(34,197,94,0.15)':'rgba(239,68,68,0.15)'};border:1px solid ${type==='success'?'rgba(34,197,94,0.4)':'rgba(239,68,68,0.4)'};color:${type==='success'?'#22c55e':'#ef4444'};padding:14px 20px;border-radius:12px;font-weight:700;font-size:0.9rem;backdrop-filter:blur(10px);animation:slideUp 0.3s ease;`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  }
  window.showAdminToast = showAdminToast;
});
