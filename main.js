'use strict';

/* ═══════════════════════════════
   1. tsParticles — bright, visible
═══════════════════════════════ */
tsParticles.load('tsparticles', {
  fpsLimit: 60,
  background: { color: { value: 'transparent' } },
  particles: {
    number: { value: 80, density: { enable: true, area: 800 } },
    color: { value: ['#D4A017', '#C0392B', '#F0C040', '#E74C3C'] },
    shape: { type: 'circle' },
    opacity: {
      value: { min: 0.4, max: 0.85 },
      animation: { enable: true, speed: 0.8, minimumValue: 0.3, sync: false }
    },
    size: {
      value: { min: 2, max: 4.5 }
    },
    links: { enable: false },
    move: {
      enable: true,
      speed: 0.6,
      direction: 'none',
      random: true,
      straight: false,
      outModes: { default: 'bounce' }
    }
  },
  interactivity: {
    detectsOn: 'window',
    events: {
      onClick: { enable: true, mode: 'repulse' },
      onHover: { enable: true, mode: 'bubble' },
      resize: true
    },
    modes: {
      repulse: { distance: 100, duration: 0.4 },
      bubble:  { distance: 150, size: 6, opacity: 1, duration: 0.3 }
    }
  },
  detectRetina: true
});

/* Click → flash red network links for 800ms */
document.addEventListener('click', (e) => {
  if (e.target.closest('a,button,input,textarea,select,label')) return;
  const c = tsParticles.domItem(0);
  if (!c) return;
  const o = c.options;
  o.particles.links.enable   = true;
  o.particles.links.color    = { value: '#D4A017' };
  o.particles.links.opacity  = 0.5;
  o.particles.links.distance = 140;
  o.particles.links.width    = 1;
  c.refresh();
  setTimeout(() => { o.particles.links.enable = false; c.refresh(); }, 800);
});

/* ═══════════════════════════════
   2. LOADER — fast (1.3s)
═══════════════════════════════ */
document.body.style.overflow = 'hidden';
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    startHero();
  }, 1300);
});

/* ═══════════════════════════════
   3. TYPEWRITER
═══════════════════════════════ */
const ROLES = ['Web Developer','CS Engineer','Problem Solver','Growth Strategist','Team Player'];
let rIdx = 0, cIdx = 0, deleting = false;

function typewrite() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const word = ROLES[rIdx];
  if (!deleting) {
    el.textContent = word.slice(0, ++cIdx);
    if (cIdx === word.length) { deleting = true; setTimeout(typewrite, 1600); return; }
  } else {
    el.textContent = word.slice(0, --cIdx);
    if (cIdx === 0) { deleting = false; rIdx = (rIdx + 1) % ROLES.length; }
  }
  setTimeout(typewrite, deleting ? 55 : 95);
}

function startHero() {
  typewrite();
  document.querySelectorAll('.hero-content .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 130);
  });
}

/* ═══════════════════════════════
   4. SCROLL REVEAL
═══════════════════════════════ */
const revObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => {
  if (!el.closest('.hero-content')) revObs.observe(el);
});

/* ═══════════════════════════════
   5. NAVBAR
═══════════════════════════════ */
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
  const y = window.scrollY + 90;
  document.querySelectorAll('section[id]').forEach(sec => {
    const l = navLinks.querySelector(`a[href="#${sec.id}"]`);
    if (l) l.classList.toggle('active', y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight);
  });
}
updateActiveNav();

/* ═══════════════════════════════
   6. SMOOTH SCROLL
═══════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) {
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 68, behavior: 'smooth' });
    }
  });
});

/* ═══════════════════════════════
   7. EXIT OVERLAY
═══════════════════════════════ */
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
exitStay.addEventListener('click', () => { exitOverlay.classList.remove('show'); exitShown = false; });
exitOverlay.addEventListener('click', e => {
  if (e.target === exitOverlay) { exitOverlay.classList.remove('show'); exitShown = false; }
});

/* ═══════════════════════════════
   8. TOAST HELPER
═══════════════════════════════ */
function showToast(title, msg, isSuccess = true) {
  const toast   = document.getElementById('toast');
  const iconEl  = toast.querySelector('.toast-icon i');
  const titleEl = document.getElementById('toast-title');
  const msgEl   = document.getElementById('toast-msg');
  const border  = isSuccess ? '#D4A017' : '#E74C3C';

  iconEl.className  = isSuccess ? 'fas fa-check' : 'fas fa-exclamation';
  titleEl.textContent = title;
  msgEl.textContent   = msg;
  toast.style.borderColor     = border;
  toast.style.borderLeftColor = border;

  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 5000);
}

/* ═══════════════════════════════
   9. CONTACT FORM — Pure AJAX
      URL NEVER changes
═══════════════════════════════ */
document.getElementById('contact-form').addEventListener('submit', async function(e) {
  /* CRITICAL: stop default form submit (prevents URL change) */
  e.preventDefault();
  e.stopPropagation();

  const btn  = document.getElementById('submit-btn');
  const form = this;

  /* Validate manually */
  const name    = form.querySelector('#f-name').value.trim();
  const email   = form.querySelector('#f-email').value.trim();
  const message = form.querySelector('#f-message').value.trim();
  if (!name || !email || !message) {
    showToast('Missing Fields', 'Please fill in all required fields.', false);
    return;
  }

  /* Loading state */
  const origHTML = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled  = true;
  btn.style.opacity = '0.8';

  /* Build FormData */
  const data = new FormData(form);
  data.append('_captcha',  'false');
  data.append('_template', 'table');
  data.append('_subject',  `Portfolio message from ${name}`);

  try {
    const res = await fetch('https://formsubmit.co/ajax/battinidivakar@gmail.com', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: data
    });

    if (res.ok) {
      form.reset();
      /* Cool animated thank-you toast */
      showToast(
        '🎉 Message Sent!',
        'Thank you for reaching out! I\'ll get back to you within 24 hours.',
        true
      );
      /* Animate the submit button briefly */
      btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
      btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
      setTimeout(() => {
        btn.innerHTML = origHTML;
        btn.style.background = '';
        btn.disabled  = false;
        btn.style.opacity = '1';
      }, 3000);
    } else {
      throw new Error('Server error');
    }
  } catch {
    showToast(
      'Send Failed',
      'Something went wrong. Email me at battinidivakar@gmail.com',
      false
    );
    btn.innerHTML  = origHTML;
    btn.disabled   = false;
    btn.style.opacity = '1';
  }

  return false; /* extra safety — prevent any submit */
});

/* ═══════════════════════════════
   10. RESUME DOWNLOAD
       Opens in new tab on iOS
═══════════════════════════════ */
document.querySelectorAll('a[download]').forEach(a => {
  a.addEventListener('click', e => {
    if (/iP(hone|ad|od)/i.test(navigator.userAgent)) {
      e.preventDefault();
      window.open(a.href, '_blank');
    }
  });
});
