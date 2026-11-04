/* GSAP 3 + ScrollTrigger, served locally. Motion communicates hierarchy only. */
(() => {
  let cleanup = () => {};
  const start = () => {
    cleanup();
    // An independent enhancement: the existing React menu, forms and portrait stay intact.
    const homeHero = /^\/(en\/?)?$/.test(location.pathname) && document.querySelector('main .hero');
    let scene;
    if (homeHero && !document.querySelector('.motion-scene')) {
      const en = location.pathname.startsWith('/en');
      const copy = en ? {
        label: 'THE TRAINING PROCESS', title: 'Train with<br>understanding.',
        steps: [['Find your starting point', 'Your experience, current fitness and goals shape the starting point.'], ['Build the right load', 'Running, strength work and recovery form one training system.'], ['Follow the adaptation', 'Review how you respond to training and adjust the next steps.']],
      } : {
        label: 'ОТ ЦЕЛИ — К СИСТЕМЕ', title: 'Тренироваться<br>с пониманием.',
        steps: [['Определяем отправную точку', 'Опыт, текущая форма и цель — основа, от которой строится подготовка.'], ['Выстраиваем нагрузку', 'Бег, силовая работа и восстановление становятся частями одной системы.'], ['Следим за адаптацией', 'Оцениваем реакцию на нагрузку и корректируем следующие шаги.']],
      };
      scene = document.createElement('section');
      scene.className = 'motion-scene';
      scene.setAttribute('aria-labelledby', 'motion-scene-title');
      scene.innerHTML = `<div class="motion-scene__stage"><div class="motion-scene__image" aria-hidden="true"><img src="/images/generated/track-panorama.webp" width="1914" height="822" loading="lazy" decoding="async" alt=""></div><div class="motion-scene__heading"><p>${copy.label}</p><h2 id="motion-scene-title">${copy.title}</h2></div><div class="motion-scene__steps">${copy.steps.map(([title, text], i) => `<article class="motion-scene__step"><span class="motion-scene__number" aria-hidden="true">0${i + 1}</span><div><h3>${title}</h3><p>${text}</p></div></article>`).join('')}</div><div class="motion-scene__rail" aria-hidden="true"><span></span><span></span><span></span></div></div>`;
      homeHero.after(scene);
    }
    if (!window.gsap || !window.ScrollTrigger || !document.querySelector('main')) return;
    const gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(min-width: 900px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)', () => {
      if (!scene) return;
      scene.classList.add('is-animated');
      const steps = [...scene.querySelectorAll('.motion-scene__step')];
      const rails = [...scene.querySelectorAll('.motion-scene__rail span')];
      let current = -1;
      const context = gsap.context(() => {
        gsap.fromTo(scene.querySelector('img'), { scale: 1.16, xPercent: -3 }, {
          scale: 1, xPercent: 0, ease: 'none',
          scrollTrigger: { trigger: scene, start: 'top 72px', end: 'bottom bottom', scrub: .6 },
        });
        window.ScrollTrigger.create({
          trigger: scene, start: 'top 72px', end: 'bottom bottom',
          onUpdate: self => select(Math.min(2, Math.floor(self.progress * 3))),
        });
        function select(index) {
          if (current === index) return;
          current = index;
          steps.forEach((step, i) => gsap.to(step, { opacity: i === index ? 1 : 0, y: i === index ? 0 : 24, duration: .4, overwrite: true }));
          rails.forEach((rail, i) => rail.classList.toggle('is-current', i === index));
        }
        select(0);
      }, scene);
      return () => { context.revert(); scene.classList.remove('is-animated'); rails.forEach(rail => rail.classList.remove('is-current')); };
    });
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
    cleanup = () => media.revert();
  };
  const mount = () => {
    start();
    // The captured React shell may finish hydration after window.load.
    // Reattach only if that shell replaces the enhanced subtree.
    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled || document.querySelector('.motion-scene') || !/^\/(en\/?)?$/.test(location.pathname)) return;
      if (!document.querySelector('main .hero')) return;
      scheduled = true;
      requestAnimationFrame(() => { scheduled = false; start(); });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('pagehide', () => { observer.disconnect(); cleanup(); }, { once: true });
  };
  if (document.readyState === 'complete') mount();
  else window.addEventListener('load', mount, { once: true });
})();
