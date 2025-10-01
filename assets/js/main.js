// assets/js/main.js
(function () {
  // 1) Footer year
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // 2) Smooth, accessible in-page anchor navigation
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Find all in-page anchor links (e.g., href="#about")
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

      // Let the browser update the hash, but control the scroll/focus
      e.preventDefault();

      // Choose behavior based on user preference
      const behavior = prefersReduced ? 'auto' : 'smooth';
      target.scrollIntoView({ behavior, block: 'start' });

      // After scroll completes (or immediately for auto), move keyboard focus
      // Using a small timeout to wait for scroll position to settle cross-browser
      window.setTimeout(() => focusTarget(target), prefersReduced ? 0 : 250);

      // Update URL hash without jumping (optional)
      if (history.replaceState) {
        history.replaceState(null, '', href);
      } else {
        // Fallback for older browsers
        window.location.hash = href;
      }
    });
  });
})();
