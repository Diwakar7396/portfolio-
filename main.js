/* ═══════════════════════════════════════════════════
   DIWAKAR B — main.js
   No external deps except tsParticles (CDN)
═══════════════════════════════════════════════════ */
'use strict';

/* ═══════════════════════════════════════════════
   1. TSPARTICLES — floating nodes + click links
═══════════════════════════════════════════════ */
tsParticles.load('tsparticles', {
  fpsLimit: 60,
  background: { color: { value: 'transparent' } },
  particles: {
    number: { value: 90, density: { enable: true, area: 900 } },
    color: { value: '#D4A017' },
    shape: { type: 'circle' },
    opacity: { value: { min: 0.15, max: 0.55 }, animation: { enable: true, speed: 0.6, minimumValue: 0.1, sync: false } },
    size: { value: { min: 1.2, max: 2.8 } },
    links: {
      enable: false          /* OFF by default — clean floating */
    },
    move: {
      enable: true,
      speed: 0.55,
      direction: 'none',
      random: true,
      straight: false,
      outModes: { default: 'bounce' },
      attract: { enable: false }
    }
  },
  interactivity: {
    detectsOn: 'window',
    events: {
      onClick: { enable: true, mode: 'repulse' },
      onHover: { enable: false },
      resize: true
    },
    modes: {
      repulse: { distance: 120, duration: 0.4 }
    }
  },
  detectRetina: true
});

/* Click → flash network links briefly */
document.addEventListener('click', (e) => {
  if (e.target.closest('a,button,input,textarea,select')) return;
  const container = tsParticles.domItem(0);
  if (!container) return;
  const opts = container.options;

  /* Enable links */
  opts.particles.links.enable = true;
  opts.particles.links.color  = { value: '#C0392B' };
  opts.particles.links.opacity = 0.55;
  opts.particles.links.distance = 160;
  opts.particles.links.width   = 1;
  container.refresh();

  /* Turn off links after 900ms */
  setTimeout(() => {
    opts.particles.links.enable = false;
    container.refresh();
  }, 900);
});


/* ═══════════════════════════════════════════════
   2. LOADER
═══════════════════════════════════════════════ */
document.body.style.overflow = 'hidden';
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    document.body.style.overflow = '';
    startHero();
  }, 2100);
});


/* ═══════════════════════════════════════════════
   3. TYPEWRITER
═══════════════════════════════════════════════ */
const ROLES = ['Web Developer','CS Engineer','Problem Solver','Growth Strategist','Team Player'];
let rIdx = 0, cIdx = 0, deleting = false;

function typewrite() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const word = ROLES[rIdx];
  if (!deleting) {
    el.textContent = word.slice(0, ++cIdx);
    if (cIdx === word.length) { deleting = true; setTimeout(typewrite, 1800); return; }
  } else {
    el.textContent = word.slice(0, --cIdx);
    if (cIdx === 0) { deleting = false; rIdx = (rIdx + 1) % ROLES.length; }
  }
  setTimeout(typewrite, deleting ? 58 : 100);
}

function startHero() {
  typewrite();
  document.querySelectorAll('.hero-content .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 140);
  });
}


/* ═══════════════════════════════════════════════
   4. SCROLL REVEAL
═══════════════════════════════════════════════ */
const revObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => {
  if (!el.closest('.hero-content')) revObs.observe(el);
});


/* ═══════════════════════════════════════════════
   5. NAVBAR
═══════════════════════════════════════════════ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveNav();
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

function updateActiveNav() {
  const y = window.scrollY + 100;
  document.querySelectorAll('section[id]').forEach(sec => {
    const l = navLinks.querySelector(`a[href="#${sec.id}"]`);
    if (l) l.classList.toggle('active', y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight);
  });
}
updateActiveNav();


/* ═══════════════════════════════════════════════
   6. SMOOTH SCROLL (Safari fallback)
═══════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 68, behavior: 'smooth' }); }
  });
});


/* ═══════════════════════════════════════════════
   7. EXIT OVERLAY — back button goodbye
═══════════════════════════════════════════════ */
const exitOverlay = document.getElementById('exit-overlay');
const exitStay    = document.getElementById('exit-stay');
let exitShown = false;

history.pushState({ p: true }, '');

window.addEventListener('popstate', () => {
  if (!exitShown) {
    exitShown = true;
    exitOverlay.classList.add('show');
    history.pushState({ p: true }, '');
  }
});

exitStay.addEventListener('click', () => {
  exitOverlay.classList.remove('show');
  exitShown = false;
});

exitOverlay.addEventListener('click', e => {
  if (e.target === exitOverlay) { exitOverlay.classList.remove('show'); exitShown = false; }
});


/* ═══════════════════════════════════════════════
   8. CONTACT FORM — AJAX via FormSubmit, no redirect
═══════════════════════════════════════════════ */
function showToast(msg, duration = 4000) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-msg');
  msgEl.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

document.getElementById('contact-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const btn  = document.getElementById('submit-btn');
  const form = this;

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
  btn.disabled  = true;

  const data = new FormData(form);
  data.append('_captcha', 'false');
  data.append('_subject', 'New message from Portfolio — ' + (data.get('name') || 'Visitor'));
  /* Prevent FormSubmit redirect by using ajax=true */
  data.append('_template', 'table');

  try {
    const res = await fetch('https://formsubmit.co/ajax/battinidivakar@gmail.com', {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      showToast('✅ Message sent! I'll get back to you soon.');
      form.reset();
    } else {
      showToast('⚠️ Something went wrong. Please email me directly.');
    }
  } catch {
    showToast('⚠️ Network error. Please email battinidivakar@gmail.com directly.');
  } finally {
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    btn.disabled  = false;
  }
});


/* ═══════════════════════════════════════════════
   9. RESUME DOWNLOAD — works on all devices
═══════════════════════════════════════════════ */
document.querySelectorAll('a[download]').forEach(a => {
  a.addEventListener('click', e => {
    /* On iOS, force open in new tab if direct download unavailable */
    const ua = navigator.userAgent || '';
    if (/iP(hone|ad|od)/i.test(ua)) {
      e.preventDefault();
      window.open(a.href, '_blank');
    }
  });
});


console.log('%c👋 Hey developer! Diwakar B built this portfolio. Let\'s connect → battinidivakar@gmail.com',
  'color:#D4A017;font-size:13px;font-weight:bold;');
