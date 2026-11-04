/* GSAP 3 + ScrollTrigger, served locally. Motion communicates hierarchy only. */
(() => {
  const start = () => {
    if (!window.gsap || !window.ScrollTrigger || !document.querySelector('main')) return;
    const gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const progress = document.createElement('div');
      progress.className = 'motion-progress';
      progress.setAttribute('aria-hidden', 'true');
      document.body.appendChild(progress);
      const context = gsap.context(() => {
        const hero = document.querySelector('.hero-intro');
        if (hero) gsap.fromTo(hero, { y: 22, opacity: .2 }, { y: 0, opacity: 1, duration: .8, ease: 'power2.out', clearProps: 'transform,opacity' });
        document.querySelectorAll('.service-card, .journal-card, .education-photos figure').forEach((element, index) => {
          gsap.fromTo(element, { y: 28, opacity: .2 }, {
            y: 0, opacity: 1, duration: .65, delay: (index % 3) * .055, ease: 'power2.out',
            clearProps: 'transform,opacity',
            scrollTrigger: { trigger: element, start: 'top 94%', once: true },
          });
        });
        gsap.to(progress, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.documentElement, start: 0, end: 'max', scrub: .15 } });
      });
      return () => { context.revert(); progress.remove(); };
    });
    document.fonts?.ready.then(() => window.ScrollTrigger.refresh());
    window.addEventListener('pagehide', () => media.revert(), { once: true });
  };
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
})();
