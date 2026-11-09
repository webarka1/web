/* =====================================================
   PERFORMANCE-OPTIMIZATIONS.JS — ADD-ON ONLY
   Tidak mengubah/mengganti fungsi, data, selector, atau struktur lama.
   Menjaga FULL MODE: semua efek visual tetap aktif ketika terlihat.
   ===================================================== */
(function initViewportAnimationOptimization(){
  'use strict';
  const root = document.documentElement;

  // FULL/NORMAL menjadi default baru. Pilihan Lite yang pernah dipilih manual
  // tetap dihormati; auto-deteksi lama tidak akan memaksa Lite pada instalasi baru.
  try {
    const savedLite = localStorage.getItem('arkaLite');
    if (savedLite === null) localStorage.setItem('arkaLite', 'off');
    if (savedLite === null || savedLite === 'off') root.classList.remove('perf-lite');
  } catch (e) {
    root.classList.remove('perf-lite');
  }

  if (!('IntersectionObserver' in window)) return;
  root.classList.add('perf-viewport');

  // Jeda animasi dekoratif pada section yang jauh dari viewport.
  const sections = document.querySelectorAll('section[id], footer');
  const sectionObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      entry.target.classList.toggle('perf-offscreen', !entry.isIntersecting);
    }
  }, { root: null, rootMargin: '180px 0px', threshold: 0 });
  sections.forEach(section => sectionObserver.observe(section));

  // Elemen dekoratif yang tidak selalu berada di dalam section.
  const decorativeSelector = '.ios-bubble, .overlay-blob, .hero-particles, .global-particles, .hero-particle, .global-particle';
  const decorativeObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      entry.target.classList.toggle('perf-observe-paused', !entry.isIntersecting);
    }
  }, { root: null, rootMargin: '120px', threshold: 0 });
  document.querySelectorAll(decorativeSelector).forEach(el => decorativeObserver.observe(el));

  // Amati hanya elemen dekoratif baru (contohnya bubble iOS), bukan seluruh DOM.
  const bodyObserver = new MutationObserver(records => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (node.matches(decorativeSelector)) decorativeObserver.observe(node);
        node.querySelectorAll?.(decorativeSelector).forEach(el => decorativeObserver.observe(el));
      }
    }
  });
  bodyObserver.observe(document.body, { childList: true, subtree: true });
})();

/* Scroll UI deliberately uses the browser's existing native scrollbar; no extra DOM slider is injected. */
