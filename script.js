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
