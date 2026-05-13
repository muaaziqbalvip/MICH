/* ============================================================
   MICH PROJECT — Main JS
   ============================================================ */

// ---- LOADING SCREEN ----
(function() {
  const bar = document.getElementById('loaderBar');
  const pct = document.getElementById('loaderPct');
  const screen = document.getElementById('loadingScreen');
  if (!bar) return;
  let p = 0;
  const t = setInterval(() => {
    p += Math.random() * 18;
    if (p >= 100) { p = 100; clearInterval(t); }
    bar.style.width = p + '%';
    pct.textContent = Math.round(p) + '%';
    if (p === 100) setTimeout(() => screen.classList.add('loaded'), 400);
  }, 120);
  // Loader particles
  const lp = document.getElementById('loaderParticles');
  if (lp) {
    for (let i = 0; i < 30; i++) {
      const d = document.createElement('div');
      d.style.cssText = `position:absolute;width:${2+Math.random()*3}px;height:${2+Math.random()*3}px;background:rgba(168,85,247,${0.2+Math.random()*0.4});border-radius:50%;left:${Math.random()*100}%;top:${Math.random()*100}%;animation:float ${4+Math.random()*6}s ease-in-out ${Math.random()*4}s infinite alternate;`;
      lp.appendChild(d);
    }
  }
})();

// ---- AOS INIT ----
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({ duration: 700, once: true, offset: 60 });

  // ---- HEADER SCROLL ----
  const header = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ---- HAMBURGER / SIDEBAR ----
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('mobileSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const sidebarClose = document.getElementById('sidebarClose');
  function openSidebar() { sidebar.classList.add('open'); overlay.classList.add('active'); document.body.style.overflow = 'hidden'; }
  function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('active'); document.body.style.overflow = ''; }
  if (hamburger) hamburger.addEventListener('click', openSidebar);
  if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);
  // Close sidebar on nav link click
  document.querySelectorAll('.sidebar-nav a').forEach(a => a.addEventListener('click', closeSidebar));

  // ---- SEARCH ----
  const searchToggle = document.getElementById('searchToggle');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('searchInput');
  if (searchToggle) {
    searchToggle.addEventListener('click', () => {
      searchOverlay.classList.toggle('active');
      if (searchOverlay.classList.contains('active')) setTimeout(() => searchInput.focus(), 100);
    });
  }
  if (searchClose) searchClose.addEventListener('click', () => searchOverlay.classList.remove('active'));
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('.project-card').forEach(card => {
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(q) || q === '' ? '' : 'none';
      });
    });
  }

  // ---- ACTIVE NAV LINK ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
    navLinks.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
  });

  // ---- TYPEWRITER ----
  const words = ['Websites', 'Android Apps', 'IPTV Systems', 'AI Songs', 'YouTube Channels', 'Islamic Content', 'Motion Graphics'];
  let wi = 0, ci = 0, deleting = false;
  const tw = document.getElementById('typewriter');
  if (tw) {
    function type() {
      const word = words[wi];
      tw.textContent = deleting ? word.substring(0, ci--) : word.substring(0, ci++);
      if (!deleting && ci === word.length + 1) { deleting = true; setTimeout(type, 1400); return; }
      if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
      setTimeout(type, deleting ? 60 : 110);
    }
    type();
  }

  // ---- ANIMATED COUNTERS ----
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.dataset.target;
        let current = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { el.textContent = target; clearInterval(timer); return; }
          el.textContent = Math.floor(current);
        }, 25);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num').forEach(el => observer.observe(el));

  // ---- PARTICLE CANVAS ----
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
    resize(); window.addEventListener('resize', resize);
    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.alpha = Math.random() * 0.5 + 0.1;
        const colors = ['168,85,247','59,130,246','250,204,21','6,182,212'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = `rgba(${this.color},1)`;
        ctx.shadowBlur = 8; ctx.shadowColor = `rgba(${this.color},0.5)`;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }
    for (let i = 0; i < 80; i++) particles.push(new Particle());
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      // Lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 100) {
            ctx.save();
            ctx.globalAlpha = 0.06 * (1 - dist/100);
            ctx.strokeStyle = `rgba(168,85,247,1)`;
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
            ctx.restore();
          }
        }
      }
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ---- SWIPER POSTER SLIDER ----
  if (typeof Swiper !== 'undefined') {
    new Swiper('.posterSwiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: { delay: 3000, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      breakpoints: {
        600: { slidesPerView: 2 },
        900: { slidesPerView: 3 },
      }
    });
  }

  // ---- LIVE VISITOR COUNT ----
  const visitorCount = document.getElementById('visitorCount');
  if (visitorCount && typeof db !== 'undefined') {
    const sessionId = 'v_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    const myRef = visitorsRef.child(sessionId);
    myRef.set({ t: firebase.database.ServerValue.TIMESTAMP });
    myRef.onDisconnect().remove();
    visitorsRef.on('value', snap => {
      visitorCount.textContent = snap.numChildren() || 1;
    });
  } else if (visitorCount) {
    visitorCount.textContent = Math.floor(Math.random() * 20) + 8;
  }

  // ---- PROJECT FILTERS ----
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.project-card').forEach(card => {
        const cat = card.dataset.category || '';
        card.style.display = (filter === 'all' || cat === filter) ? '' : 'none';
      });
    });
  });

  // ---- ORDER FORM ----
  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('orderSubmitBtn');
      const status = document.getElementById('orderStatus');
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;
      const order = {
        name: document.getElementById('orderName').value,
        phone: document.getElementById('orderPhone').value,
        service: document.getElementById('orderService').value,
        message: document.getElementById('orderMsg').value,
        timestamp: Date.now(),
        status: 'pending'
      };
      try {
        if (typeof ordersRef !== 'undefined') {
          await ordersRef.push(order);
        }
        status.className = 'order-status success';
        status.textContent = '✅ Order bhej diya! Hum jald contact karenge.';
        status.classList.remove('hidden');
        orderForm.reset();
      } catch (err) {
        status.className = 'order-status error';
        status.textContent = '❌ Error. Dobara try karein ya WhatsApp karein.';
        status.classList.remove('hidden');
      }
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Order';
      btn.disabled = false;
      setTimeout(() => status.classList.add('hidden'), 6000);
    });
  }

  // ---- CHAT TOGGLE ----
  const chatToggle = document.getElementById('chatToggle');
  const chatPopup = document.getElementById('chatPopup');
  const chatPopupClose = document.getElementById('chatPopupClose');
  if (chatToggle) {
    chatToggle.addEventListener('click', () => chatPopup.classList.toggle('active'));
    chatPopupClose.addEventListener('click', () => chatPopup.classList.remove('active'));
  }

  // ---- SERVICE MODAL ----
  window.openService = function(type) {
    const data = {
      web: { title:'MICH Web Studio', icon:'fas fa-code', color:'var(--purple)', items:['Professional Websites','Android Apps','IPTV Portals','eCommerce Stores'], desc:'Hum aapke liye world-class websites aur Android apps banate hain Firebase ke saath. Fast, modern, aur SEO-optimized.' },
      yt: { title:'MICH YT Project', icon:'fab fa-youtube', color:'#ff0000', items:['YouTube Channel Setup','Live Streaming Config','SEO Optimization','Channel Branding'], desc:'YouTube par apni presence strong banao — complete setup se lekar growth tak sab kuch hum handle karte hain.' },
      mitv: { title:'MICH MITV', icon:'fas fa-tv', color:'var(--blue2)', items:['IPTV Subscriptions','Live TV Channels','Sports Packages','Movies & Series'], desc:'Premium IPTV service with 10,000+ channels. Sports, Movies, News — sab kuch ek jagah.' },
      graphics: { title:'MICH Graphics', icon:'fas fa-paint-brush', color:'var(--yellow)', items:['Social Media Posters','Professional Logos','YouTube Thumbnails','Flex Banner Designs'], desc:'Eye-catching graphics jo aapke brand ko alag karte hain. Professional aur affordable.' },
      video: { title:'MICH Video Editing', icon:'fas fa-film', color:'var(--red)', items:['AI-Powered Videos','Instagram Reels','YouTube Shorts','Motion Graphics'], desc:'AI tools ke saath premium video content banao. Reels se lekar cinematic videos tak.' },
      books: { title:'MICH Books Library', icon:'fas fa-book-open', color:'var(--green)', items:['Islamic PDF Books','Educational Resources','Online Courses','Dajjali Matrix'], desc:'Muslim Islam Organization ki digital library — Islamic books, courses, aur educational content.' },
      song: { title:'MICH You Song', icon:'fas fa-music', color:'var(--purple)', items:['AI Song Generation','Naat Production','Custom Lyrics','Music Videos'], desc:'AI ki madad se apni Naat ya song banao. Professional production quality.' },
    };
    const s = data[type];
    if (!s) return;
    const modal = document.getElementById('serviceModal');
    document.getElementById('serviceModalInner').innerHTML = `
      <button onclick="closeServiceModal()" style="position:absolute;top:16px;right:16px;background:rgba(255,255,255,0.1);border:none;color:#fff;width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;"><i class="fas fa-times"></i></button>
      <div style="text-align:center;margin-bottom:28px;">
        <div style="width:70px;height:70px;background:rgba(255,255,255,0.08);border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:2rem;color:${s.color};"><i class="${s.icon}"></i></div>
        <h2 style="font-family:var(--font-display);font-size:1.3rem;font-weight:900;color:#fff;margin-bottom:8px;">${s.title}</h2>
        <p style="color:var(--gray);font-size:0.95rem;">${s.desc}</p>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px;">
        ${s.items.map(item => `<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:12px 16px;font-size:0.88rem;color:#fff;display:flex;align-items:center;gap:8px;"><i class="fas fa-check" style="color:${s.color};"></i>${item}</div>`).join('')}
      </div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;">
        <a href="https://wa.me/923001234567?text=MICH+${encodeURIComponent(s.title)}+ke+baare+mein+maloom+karna+tha" target="_blank" class="btn-primary" style="flex:1;justify-content:center;"><i class="fab fa-whatsapp"></i> WhatsApp Order</a>
        <a href="https://t.me/michproject" target="_blank" class="btn-ghost" style="flex:1;justify-content:center;"><i class="fab fa-telegram"></i> Telegram</a>
      </div>
    `;
    modal.classList.add('active');
    document.getElementById('serviceModalBackdrop').onclick = closeServiceModal;
  };
  window.closeServiceModal = function() {
    document.getElementById('serviceModal').classList.remove('active');
  };

  // ---- MODAL ----
  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');
  if (modalClose) modalClose.addEventListener('click', () => document.getElementById('projectModal').classList.remove('active'));
  if (modalBackdrop) modalBackdrop.addEventListener('click', () => document.getElementById('projectModal').classList.remove('active'));

  // ---- GSAP HERO ----
  if (typeof gsap !== 'undefined') {
    gsap.from('.hero-badge', { y: 20, opacity: 0, duration: 0.7, delay: 1.2 });
    gsap.from('.hero-title .line-1', { y: 40, opacity: 0, duration: 0.8, delay: 1.4 });
    gsap.from('.hero-title .line-2', { y: 40, opacity: 0, duration: 0.8, delay: 1.6 });
    gsap.from('.hero-typewriter', { y: 20, opacity: 0, duration: 0.7, delay: 1.8 });
    gsap.from('.hero-desc', { y: 20, opacity: 0, duration: 0.7, delay: 2.0 });
    gsap.from('.hero-btns', { y: 20, opacity: 0, duration: 0.7, delay: 2.2 });
    gsap.from('.hero-stats', { y: 20, opacity: 0, duration: 0.7, delay: 2.4 });
  }
});
