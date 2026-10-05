(() => {
  const sameOriginHardNavigation = (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

    let url;
    try { url = new URL(link.href, window.location.href); } catch { return; }
    if (url.origin !== window.location.origin) return;

    const sameDocument = url.pathname === window.location.pathname && url.search === window.location.search;
    if (sameDocument && url.hash) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.assign(url.href);
  };

  document.addEventListener('click', sameOriginHardNavigation, true);

  function openFallbackMenu() {
    if (document.getElementById('standalone-mobile-menu')) return;

    const overlay = document.createElement('div');
    overlay.id = 'standalone-mobile-menu';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Навигация');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#0b0b0b;color:#fff;padding:24px;display:flex;flex-direction:column;gap:28px;overflow:auto';

    const close = document.createElement('button');
    close.type = 'button';
    close.textContent = 'Закрыть ×';
    close.style.cssText = 'align-self:flex-end;border:0;background:transparent;color:inherit;font:inherit;font-size:18px;padding:8px;cursor:pointer';
    close.addEventListener('click', () => overlay.remove());

    const nav = document.createElement('nav');
    nav.style.cssText = 'display:grid;gap:18px;font-size:clamp(28px,8vw,54px);line-height:1.05';
    const links = [
      ['Главная', '/'],
      ['Обо мне', '/#coach'],
      ['Подход', '/#method'],
      ['Услуги', '/#services'],
      ['Калькулятор темпа', '/#pace-lab'],
      ['Журнал', '/journal'],
      ['Контакты', '/contacts'],
      ['English', '/en'],
    ];
    for (const [label, href] of links) {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = label;
      a.style.cssText = 'color:inherit;text-decoration:none';
      nav.appendChild(a);
    }

    overlay.append(close, nav);
    overlay.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') overlay.remove();
    });
    document.body.appendChild(overlay);
    close.focus();
  }

  document.addEventListener('click', (event) => {
    const trigger = event.target instanceof Element ? event.target.closest('.mobile-menu') : null;
    if (!trigger) return;
    setTimeout(() => {
      const nativeDialog = [...document.querySelectorAll('[role="dialog"]')].some((node) => node.id !== 'standalone-mobile-menu');
      if (!nativeDialog) openFallbackMenu();
    }, 180);
  });
})();
