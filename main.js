/* ═══════════════════════════════════════════════════
   DIWAKAR B PORTFOLIO — main.js
   Clean, no-dependency, GitHub Pages compatible
═══════════════════════════════════════════════════ */

'use strict';

/* ─── 1. LOADER ─────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  // Minimum display time so animation completes
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    startHeroAnimations();
  }, 2000);
});

// Prevent scroll during load
document.body.style.overflow = 'hidden';

/* ─── 2. PARTICLES ──────────────────────────────── */
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = window.innerWidth < 600 ? 20 : 40;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const x    = Math.random() * 100;
    const y    = Math.random() * 100;
    const dur  = Math.random() * 12 + 8;
    const delay= Math.random() * 6;
    p.style.cssText = `
      position:absolute;
      width:${size}px; height:${size}px;
      left:${x}%; top:${y}%;
      background: ${Math.random() > .5 ? '#00D4FF' : '#7C3AED'};
      border-radius:50%;
      opacity:${Math.random() * .5 + .1};
      animation: floatParticle ${dur}s ${delay}s ease-in-out infinite alternate;
    `;
    container.appendChild(p);
  }

  // Inject keyframe if not exists
  if (!document.getElementById('particle-kf')) {
    const style = document.createElement('style');
    style.id = 'particle-kf';
    style.textContent = `
      @keyframes floatParticle {
        from { transform: translate(0,0) scale(1); opacity:.15; }
        to   { transform: translate(${rnd(30)}px,${rnd(50)}px) scale(1.5); opacity:.5; }
      }
    `;
    document.head.appendChild(style);
  }
}
function rnd(n) { return (Math.random() - .5) * n; }
initParticles();

/* ─── 3. TYPEWRITER ─────────────────────────────── */
const roles = [
  'Web Developer',
  'CS Engineer',
  'Problem Solver',
  'Growth Strategist',
  'Team Player',
];
let rIdx = 0, cIdx = 0, isDeleting = false;

function typewrite() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const current = roles[rIdx];

  if (!isDeleting) {
    el.textContent = current.slice(0, ++cIdx);
    if (cIdx === current.length) {
      isDeleting = true;
      setTimeout(typewrite, 1800);
      return;
    }
  } else {
    el.textContent = current.slice(0, --cIdx);
    if (cIdx === 0) {
      isDeleting = false;
      rIdx = (rIdx + 1) % roles.length;
    }
  }
  setTimeout(typewrite, isDeleting ? 60 : 100);
}

function startHeroAnimations() {
  typewrite();
  // Stagger hero reveals
  document.querySelectorAll('.hero-content .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 150);
  });
}

/* ─── 4. SCROLL REVEAL ──────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  // skip hero items (handled by startHeroAnimations)
  if (!el.closest('.hero-content')) revealObserver.observe(el);
});

/* ─── 5. NAVBAR ─────────────────────────────────── */
const navbar   = document.getElementById('navbar');
const hamburger= document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

// Scroll behaviour
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 20);
  lastY = y;
  updateActiveLink();
}, { passive: true });

// Hamburger
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close on link click (mobile)
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Active link tracker
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY  = window.scrollY + 100;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const bot = top + sec.offsetHeight;
    const link = navLinks.querySelector(`a[href="#${sec.id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < bot);
  });
}
updateActiveLink();

/* ─── 6. EXIT OVERLAY (back button / beforeunload) ─ */
const exitOverlay = document.getElementById('exit-overlay');
const exitStay    = document.getElementById('exit-stay');
let exitShown     = false;

function showExit(e) {
  if (exitShown) return;
  exitShown = true;
  exitOverlay.classList.add('show');
  // For beforeunload we can't prevent it, but we show the overlay anyway
  if (e && e.type === 'beforeunload') {
    e.preventDefault();
    e.returnValue = '';
  }
}

// Push a history state so back triggers popstate
history.pushState({ portfolio: true }, '');
window.addEventListener('popstate', (e) => {
  showExit(e);
  // Push again so page doesn't actually navigate away
  history.pushState({ portfolio: true }, '');
});

// Also catch tab/window close
window.addEventListener('beforeunload', showExit);

exitStay.addEventListener('click', () => {
  exitOverlay.classList.remove('show');
  exitShown = false;
});

// Close on overlay backdrop click
exitOverlay.addEventListener('click', (e) => {
  if (e.target === exitOverlay) {
    exitOverlay.classList.remove('show');
    exitShown = false;
  }
});

/* ─── 7. SMOOTH SCROLL (fallback for older Safari) ─ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ─── 8. CONTACT FORM feedback ──────────────────── */
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    const btn = form.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
    btn.disabled = true;
    // FormSubmit handles the actual POST; button resets after 3s for UX
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.disabled = false;
    }, 3000);
  });
}

/* ─── 9. SKILL TAG hover glow ───────────────────── */
document.querySelectorAll('.skill-tag').forEach(tag => {
  tag.addEventListener('mouseenter', () => {
    tag.style.boxShadow = '0 0 12px rgba(0,212,255,.3)';
  });
  tag.addEventListener('mouseleave', () => {
    tag.style.boxShadow = '';
  });
});

/* ─── 10. BACK-TO-TOP on logo click ─────────────── */
document.querySelector('.nav-logo')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── 11. RESIZE: re-init particles on big change ── */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const pc = document.getElementById('particles');
    if (pc) { pc.innerHTML = ''; initParticles(); }
  }, 400);
});

console.log('%c👋 Hey there! Thanks for checking the code — Diwakar B', 'color:#00D4FF;font-size:14px;font-weight:bold;');
