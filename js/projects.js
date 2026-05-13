/* ============================================================
   MICH PROJECT — Projects Loader
   ============================================================ */

const DEFAULT_PROJECTS = [
  { id:'p1', title:'MITV Network Portal', category:'iptv', description:'Advanced IPTV reseller portal with Firebase, multi-theme PWA, AI chat, R2R messaging.', price:'PKR 15,000', poster:'https://i.ibb.co/QvQXfgxt/IMG-20260509-125341-removebg-preview.png', wa:'923001234567', tg:'michproject' },
  { id:'p2', title:'ZimmalBoost Platform', category:'web', description:'Social media growth services platform with admin panel, order system, live chat.', price:'PKR 12,000', poster:'https://i.ibb.co/QvQXfgxt/IMG-20260509-125341-removebg-preview.png', wa:'923001234567', tg:'michproject' },
  { id:'p3', title:'NoorPost Islamic Blog', category:'web', description:'Firebase-powered Islamic blog with JSON-LD schema, dark gold aesthetic, SEO optimized.', price:'PKR 8,000', poster:'https://i.ibb.co/QvQXfgxt/IMG-20260509-125341-removebg-preview.png', wa:'923001234567', tg:'michproject' },
  { id:'p4', title:'MI Library Digital', category:'web', description:'PWA digital library with 3D cards, PDF viewer, JazzCash payment, AI assistant.', price:'PKR 20,000', poster:'https://i.ibb.co/QvQXfgxt/IMG-20260509-125341-removebg-preview.png', wa:'923001234567', tg:'michproject' },
  { id:'p5', title:'Dajjali Matrix Book', category:'graphics', description:'AI graphics & cover design for Islamic eschatology book by Muslim Islam Org.', price:'PKR 3,000', poster:'https://i.ibb.co/QvQXfgxt/IMG-20260509-125341-removebg-preview.png', wa:'923001234567', tg:'michproject' },
  { id:'p6', title:'MITV Telegram Bot', category:'iptv', description:'Advanced async Telegram bot with M3U loading, stats dashboard, group auto-posting.', price:'PKR 10,000', poster:'https://i.ibb.co/QvQXfgxt/IMG-20260509-125341-removebg-preview.png', wa:'923001234567', tg:'michproject' },
];

function createProjectCard(project) {
  const card = document.createElement('div');
  card.className = 'project-card';
  card.dataset.category = project.category || 'web';
  card.setAttribute('data-aos', 'fade-up');
  card.innerHTML = `
    <img src="${project.poster || 'https://i.ibb.co/QvQXfgxt/IMG-20260509-125341-removebg-preview.png'}" 
         alt="${project.title}" class="project-card-img" loading="lazy"
         onerror="this.src='https://i.ibb.co/QvQXfgxt/IMG-20260509-125341-removebg-preview.png'"/>
    <div class="project-card-body">
      <div class="project-card-cat">${(project.category||'web').toUpperCase()}</div>
      <div class="project-card-title">${project.title}</div>
      <div class="project-card-desc">${project.description}</div>
      <div class="project-card-price">${project.price || 'Contact for Price'}</div>
      <div class="project-card-actions">
        <a href="https://wa.me/${project.wa||'923001234567'}?text=Mujhe+${encodeURIComponent(project.title)}+ke+baare+mein+maloomat+chahiye" 
           target="_blank" class="btn-wa"><i class="fab fa-whatsapp"></i> WhatsApp</a>
        <a href="https://t.me/${project.tg||'michproject'}" target="_blank" class="btn-tg">
          <i class="fab fa-telegram"></i> Telegram</a>
      </div>
    </div>
  `;
  card.addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    openProjectModal(project);
  });
  return card;
}

function openProjectModal(project) {
  const modal = document.getElementById('projectModal');
  const content = document.getElementById('modalContent');
  content.innerHTML = `
    <img src="${project.poster || 'https://i.ibb.co/QvQXfgxt/IMG-20260509-125341-removebg-preview.png'}" 
         alt="${project.title}" style="width:100%;border-radius:14px;margin-bottom:20px;max-height:280px;object-fit:cover;" loading="lazy"/>
    <div style="display:inline-block;background:rgba(168,85,247,0.1);border:1px solid rgba(168,85,247,0.3);color:var(--purple);padding:3px 12px;border-radius:20px;font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:12px;">
      ${(project.category||'web').toUpperCase()}
    </div>
    <h2 style="font-family:var(--font-display);font-size:1.4rem;font-weight:900;color:#fff;margin-bottom:12px;">${project.title}</h2>
    <p style="color:var(--gray);font-size:0.95rem;line-height:1.7;margin-bottom:20px;">${project.description}</p>
    <div style="background:rgba(250,204,21,0.08);border:1px solid rgba(250,204,21,0.2);border-radius:10px;padding:14px;display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
      <span style="color:var(--gray);font-size:0.85rem;">Price</span>
      <span style="font-family:var(--font-display);font-size:1.1rem;font-weight:900;color:var(--yellow);">${project.price || 'Contact for Price'}</span>
    </div>
    <div style="display:flex;gap:12px;flex-wrap:wrap;">
      <a href="https://wa.me/${project.wa||'923001234567'}?text=Mujhe+${encodeURIComponent(project.title)}+order+karna+hai" 
         target="_blank" class="btn-primary" style="flex:1;justify-content:center;"><i class="fab fa-whatsapp"></i> WhatsApp Order</a>
      <a href="https://t.me/${project.tg||'michproject'}" target="_blank" class="btn-ghost" style="flex:1;justify-content:center;"><i class="fab fa-telegram"></i> Telegram</a>
    </div>
  `;
  modal.classList.add('active');
}
window.openProjectModal = openProjectModal;

function loadProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  function renderProjects(projects) {
    grid.innerHTML = '';
    if (!projects || projects.length === 0) {
      DEFAULT_PROJECTS.forEach(p => grid.appendChild(createProjectCard(p)));
    } else {
      projects.forEach(p => grid.appendChild(createProjectCard(p)));
    }
    if (typeof AOS !== 'undefined') AOS.refresh();
  }

  if (typeof projectsRef !== 'undefined') {
    projectsRef.on('value', snap => {
      const data = snap.val();
      if (data) {
        const projects = Object.entries(data).map(([id, p]) => ({ id, ...p }));
        renderProjects(projects.reverse());
      } else {
        renderProjects(null);
      }
    }, () => renderProjects(null));
  } else {
    renderProjects(null);
  }
}

document.addEventListener('DOMContentLoaded', loadProjects);
