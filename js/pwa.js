/* ============================================================
   MICH PROJECT — PWA Handler
   ============================================================ */

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  setTimeout(() => {
    const banner = document.getElementById('pwaInstallBanner');
    if (banner) banner.classList.remove('hidden');
  }, 3000);
});

document.addEventListener('DOMContentLoaded', () => {
  const installBtn = document.getElementById('pwaInstallBtn');
  const dismissBtn = document.getElementById('pwaDismiss');
  const banner = document.getElementById('pwaInstallBanner');

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        banner.classList.add('hidden');
      }
      deferredPrompt = null;
    });
  }

  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      banner.classList.add('hidden');
      localStorage.setItem('pwaDismissed', '1');
    });
  }

  if (localStorage.getItem('pwaDismissed')) {
    const b = document.getElementById('pwaInstallBanner');
    if (b) b.classList.add('hidden');
  }
});

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('✅ MICH SW registered:', reg.scope))
      .catch(err => console.log('SW error:', err));
  });
}

window.addEventListener('appinstalled', () => {
  const banner = document.getElementById('pwaInstallBanner');
  if (banner) banner.classList.add('hidden');
  console.log('✅ MICH PROJECT installed as PWA!');
});
