// assets/js/main.js
(function () {
  /* 1) Footer year */
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* 2) Smooth, accessible in-page anchor navigation (respects Reduced Motion) */
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const internalAnchors = Array.from(document.querySelectorAll('a[href^="#"]'))
    .filter(a => a.getAttribute('href') && a.getAttribute('href') !== '#');

  function focusTarget(el) {
    if (!el) return;
    const hadTabindex = el.hasAttribute('tabindex');
    if (!hadTabindex) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
    if (!hadTabindex) el.removeAttribute('tabindex');
  }

  internalAnchors.forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      const behavior = prefersReduced ? 'auto' : 'smooth';
      target.scrollIntoView({ behavior, block: 'start' });
      window.setTimeout(() => focusTarget(target), prefersReduced ? 0 : 250);

      // Update URL hash without jump
      if (history.replaceState) history.replaceState(null, '', href);
      else window.location.hash = href;

      // Close mobile menu after navigating
      closeMenu();
    });
  });

  /* 3) Mobile menu toggle (accessible) */
  const toggleBtn = document.querySelector('.nav__toggle');
  const menu = document.getElementById('primary-menu');

  function isOpen() {
    return document.body.classList.contains('menu-open');
  }
  function openMenu() {
    document.body.classList.add('menu-open');
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.setAttribute('aria-label', 'Close menu');
    }
  }
  function closeMenu() {
    document.body.classList.remove('menu-open');
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-label', 'Open menu');
    }
  }
  function toggleMenu() { isOpen() ? closeMenu() : openMenu(); }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleMenu);
  }

  // Close on Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      e.preventDefault();
      closeMenu();
      if (toggleBtn) toggleBtn.focus();
    }
  });

  // Close when clicking a link inside the menu
  if (menu) {
    menu.addEventListener('click', (e) => {
      if (e.target && e.target.closest('a')) closeMenu();
    });
  }

  // Close on resize to desktop
  let lastW = window.innerWidth;
  window.addEventListener('resize', () => {
    const w = window.innerWidth;
    if (w >= 769 && lastW < 769) closeMenu();
    lastW = w;
  });
})();
