/* GSAP progressive enhancement. All navigation/content works without animation. */
(() => {
  let cleanup = () => {};
  let heroNode;
  const enhance = () => {
    const hero = document.querySelector('main .hero');
    if (!window.gsap || !window.ScrollTrigger || !hero || hero === heroNode) return;
    cleanup();
    heroNode = hero;
    const gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        // Introduce the name before the invitation to start training.
        gsap.fromTo(hero.querySelectorAll('.hero-name h1 em'), { yPercent: 105 }, { yPercent: 0, duration: 1.15, stagger: .09, ease: 'power3.out', clearProps: 'transform' });
        const image = hero.querySelector('.hero-photo');
        if (image && innerWidth > 800) gsap.fromTo(image, { scale: 1.035 }, { scale: 1, duration: 1.6, ease: 'power2.out', clearProps: 'transform' });
        // Large photographic crops open as their stories enter the viewport.
        document.querySelectorAll('.coach-image img, .training-photo-story img, .journal-image img').forEach(image => {
          gsap.fromTo(image, { clipPath: 'inset(12% 0 0 0)' }, {
            clipPath: 'inset(0% 0 0 0)', duration: 1.05, ease: 'power3.out', clearProps: 'clipPath',
            scrollTrigger: { trigger: image, start: 'top 92%', once: true },
          });
        });
      });
      return () => context.revert();
    });
    document.fonts?.ready.then(() => window.ScrollTrigger.refresh());
    cleanup = () => media.revert();
  };
  const start = () => {
    enhance();
    // Captured React may complete hydration after window.load.
    let queued = false;
    const observer = new MutationObserver(() => {
      if (heroNode?.isConnected || queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; enhance(); });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('pagehide', event => { if (!event.persisted) { observer.disconnect(); cleanup(); } }, { once: true });
  };
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
})();
