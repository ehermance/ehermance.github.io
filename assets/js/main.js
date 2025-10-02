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

  /* 4) Back to Top */
  // Back to Top
  const topBtn = document.getElementById('backToTop');
  const topAnchor = document.getElementById('top') || document.body;
  if (!topBtn || !topAnchor) return;
  const showAt = 500; // px scrolled

  const onScroll = () => {
    if (window.scrollY > showAt) {
      topBtn.classList.add('is-visible');
      topBtn.removeAttribute('hidden');
    } else {
      topBtn.classList.remove('is-visible');
      topBtn.setAttribute('hidden', '');
    }
  };

  topBtn.addEventListener('click', () => {
    if (prefersReduced) {
      window.scrollTo(0, 0);
      // Move focus immediately
      focusTop();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // After smooth scroll, move focus (small timeout to let scroll settle)
      setTimeout(focusTop, 300);
    }
  });

  function focusTop() {
    // Ensure focusable target without altering semantics
    const needsTabIndex = !topAnchor.hasAttribute('tabindex');
    if (needsTabIndex) topAnchor.setAttribute('tabindex', '-1');
    topAnchor.focus({ preventScroll: true });
    if (needsTabIndex) {
      // Optional: clean up to avoid tab order pollution
      topAnchor.addEventListener('blur', () => topAnchor.removeAttribute('tabindex'), { once: true });
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

})();
