/* =========================================================
   Seng Vichea — Portfolio v2  |  script.js
   ========================================================= */

/* ── Theme toggle ───────────────────────────────────────── */
const html = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
const stored = localStorage.getItem('theme');
if (stored) html.setAttribute('data-theme', stored);

themeBtn.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* ── Nav scroll spy & stuck ─────────────────────────────── */
const nav = document.getElementById('nav');
const navLinkEls = document.querySelectorAll('.nl');

window.addEventListener('scroll', () => {
  nav.classList.toggle('stuck', window.scrollY > 20);
}, { passive: true });

const sections = document.querySelectorAll('main section[id]');
const spyObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.getAttribute('id');
    navLinkEls.forEach(l => {
      l.classList.toggle('on', l.getAttribute('href') === '#' + id);
    });
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => spyObs.observe(s));

/* ── Burger / drawer ────────────────────────────────────── */
const burger  = document.getElementById('burger');
const drawer  = document.getElementById('drawer');
const overlay = document.getElementById('drawerOverlay');
const dClose  = document.getElementById('drawerClose');

function openDrawer() {
  drawer.classList.add('open');
  overlay.classList.add('show');
  burger.classList.add('open');
  burger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  drawer.classList.remove('open');
  overlay.classList.remove('show');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

burger.addEventListener('click', openDrawer);
dClose.addEventListener('click', closeDrawer);
overlay.addEventListener('click', closeDrawer);
drawer.querySelectorAll('.dl').forEach(l => l.addEventListener('click', closeDrawer));

/* ── Scroll reveal ──────────────────────────────────────── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in');
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ── Skill bar animation ────────────────────────────────── */
const barObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const bar = entry.target;
    bar.style.setProperty('--p', bar.dataset.p + '%');
    bar.classList.add('filled');
    barObs.unobserve(bar);
  });
}, { threshold: 0.3 });
document.querySelectorAll('.sl-bar[data-p]').forEach(b => barObs.observe(b));

/* ── Typed text ─────────────────────────────────────────── */
const phrases = [
  'Software Engineering Student',
  'Mobile App Developer',
  'Full-Stack Web Developer',
  'UI/UX Enthusiast',
  
];
const typedEl = document.getElementById('typed');
let pi = 0, ci = 0, deleting = false;

function type() {
  const phrase = phrases[pi];
  if (!deleting) {
    typedEl.textContent = phrase.slice(0, ++ci);
    if (ci === phrase.length) {
      deleting = true;
      setTimeout(type, 2000);
      return;
    }
    setTimeout(type, 65);
  } else {
    typedEl.textContent = phrase.slice(0, --ci);
    if (ci === 0) {
      deleting = false;
      pi = (pi + 1) % phrases.length;
      setTimeout(type, 400);
      return;
    }
    setTimeout(type, 35);
  }
}
setTimeout(type, 800);

/* ── Back to top ────────────────────────────────────────── */
const btt = document.getElementById('btt');
window.addEventListener('scroll', () => {
  btt.classList.toggle('show', window.scrollY > 400);
}, { passive: true });
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── Footer year ────────────────────────────────────────── */
document.getElementById('yr').textContent = new Date().getFullYear();

/* ── Image slider (RentDora flyer, football posters) ───── */
/* Any .proof-slider is wired up automatically: arrows, dots,
   drag/swipe, arrow keys and optional autoplay.              */
function initSlider(slider) {
  const track = slider.querySelector('.proof-track');
  if (!track) return;

  const counter  = slider.querySelector('.slider-count');
  const prevBtn  = slider.querySelector('.slider-prev');
  const nextBtn  = slider.querySelector('.slider-next');
  const dotsWrap = slider.querySelector('.slider-dots');

  const slides = Array.from(track.querySelectorAll('.proof-slide'));
  const total  = slides.length;
  if (total < 1) return;

  /* Nothing to page through */
  if (total === 1) {
    if (prevBtn) prevBtn.hidden = true;
    if (nextBtn) nextBtn.hidden = true;
    if (dotsWrap) dotsWrap.hidden = true;
    if (counter) counter.hidden = true;
  }

  let cur = 0;
  const dots = [];

  /* Dots are generated so adding a slide needs no markup edit */
  if (dotsWrap && total > 1) {
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.type = 'button';
      d.className = 'slider-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
      dots.push(d);
    });
  }

  function goTo(n) {
    cur = (n + total) % total;
    track.style.transform = `translateX(-${cur * 100}%)`;
    if (counter) counter.textContent = `${cur + 1} / ${total}`;
    dots.forEach((d, i) => d.classList.toggle('active', i === cur));
    slides.forEach((s, i) => s.setAttribute('aria-hidden', i === cur ? 'false' : 'true'));
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(cur - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(cur + 1));

  slider.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { goTo(cur - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { goTo(cur + 1); e.preventDefault(); }
  });

  /* Drag / swipe — advances one slide past the threshold */
  let startX = 0, dragging = false, moved = false;
  const THRESHOLD = 50;

  track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    dragging = true;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    if (!dragging) return;
    dragging = false;
    const delta = startX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > THRESHOLD) goTo(delta > 0 ? cur + 1 : cur - 1);
  });

  track.addEventListener('mousedown', e => {
    startX = e.clientX;
    dragging = true;
    moved = false;
  });

  track.addEventListener('mousemove', e => {
    if (Math.abs(e.clientX - startX) > 5) moved = true;
  });

  window.addEventListener('mouseup', e => {
    if (!dragging) return;
    dragging = false;
    if (!moved) return;               // it was a click — don't hijack it
    const delta = startX - e.clientX;
    if (Math.abs(delta) > THRESHOLD) goTo(delta > 0 ? cur + 1 : cur - 1);
  });

  /* Opt-in autoplay via data-autoplay="4500" */
  const delay = Number(slider.dataset.autoplay) || 0;
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (delay > 0 && total > 1 && !still) {
    let timer = setInterval(() => goTo(cur + 1), delay);
    const stop  = () => clearInterval(timer);
    const start = () => { stop(); timer = setInterval(() => goTo(cur + 1), delay); };
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    slider.addEventListener('focusin', stop);
    slider.addEventListener('focusout', start);
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  }

  goTo(0);
}

document.querySelectorAll('.proof-slider').forEach(initSlider);

/* ── Lightbox — full-size image viewer ─────────────────── */
/* Opt an image in with data-lb. Images inside the same
   data-lb-group browse together. data-full loads a
   higher-resolution file than the slide thumbnail.          */
(function () {
  const overlay = document.getElementById('lb');
  if (!overlay) return;

  const lbImg     = document.getElementById('lbImg');
  const lbClose   = document.getElementById('lbClose');
  const lbPrev    = document.getElementById('lbPrev');
  const lbNext    = document.getElementById('lbNext');
  const lbCaption = document.getElementById('lbCaption');
  const lbHint    = document.getElementById('lbHint');

  lbImg.style.transition = 'opacity .14s ease';

  let images = [];
  let cur = 0;
  let downX = 0, downY = 0;

  const groupOf = img => {
    const g = img.closest('[data-lb-group]');
    return g ? g.getAttribute('data-lb-group') : 'all';
  };

  function buildList(img) {
    const group = groupOf(img);
    images = Array.from(document.querySelectorAll('img[data-lb]'))
      .filter(i => groupOf(i) === group);
  }

  /* Fade the swap in once the full-size file is decoded, so
     paging never flashes the previous image */
  function show() {
    const img = images[cur];
    if (!img) return;
    const src = img.getAttribute('data-full') || img.currentSrc || img.src;
    lbCaption.textContent = img.getAttribute('data-caption') || img.alt || '';
    lbImg.style.opacity = '0';
    const reveal = () => {
      lbImg.style.opacity = '1';
      lbImg.removeEventListener('load', reveal);
      lbImg.removeEventListener('error', reveal);
    };
    lbImg.addEventListener('load', reveal);
    lbImg.addEventListener('error', reveal);
    lbImg.alt = img.alt || '';
    lbImg.src = src;
    if (lbImg.complete) reveal();
  }

  function open(idx) {
    cur = idx;
    const multi = images.length > 1;
    lbPrev.hidden = !multi;
    lbNext.hidden = !multi;
    lbHint.textContent = multi
      ? 'Swipe or use ← → to browse · ESC to close'
      : 'Click outside or press ESC to close';
    show();
    overlay.classList.add('lb-open');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function close() {
    overlay.classList.remove('lb-open');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 350);
  }

  function step(dir) {
    if (images.length < 2) return;
    cur = (cur + dir + images.length) % images.length;
    show();
  }

  /* Track where the press started so a slider drag never
     triggers the viewer */
  document.addEventListener('pointerdown', e => {
    downX = e.clientX;
    downY = e.clientY;
  }, true);

  document.addEventListener('click', e => {
    const img = e.target.closest('img[data-lb]');
    if (!img) return;
    if (e.detail > 0 && (Math.abs(e.clientX - downX) > 10 || Math.abs(e.clientY - downY) > 10)) return;
    buildList(img);
    open(images.indexOf(img));
  });

  lbClose.addEventListener('click', close);
  if (lbPrev) lbPrev.addEventListener('click', () => step(-1));
  if (lbNext) lbNext.addEventListener('click', () => step(1));
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

  /* Swipe between images inside the viewer */
  let lx = 0, lDrag = false;
  lbImg.addEventListener('touchstart', e => { lx = e.touches[0].clientX; lDrag = true; }, { passive: true });
  lbImg.addEventListener('touchend', e => {
    if (!lDrag) return;
    lDrag = false;
    const delta = lx - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) step(delta > 0 ? 1 : -1);
  });

  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('lb-open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
})();

