(() => {
  const GA_ID = 'G-C2R5SCLQZ0';
  const CONSENT_KEY = 'seleznevcoach_analytics_consent';
  const isProduction = ['seleznevcoach.ru', 'www.seleznevcoach.ru'].includes(window.location.hostname);

  function analyticsAllowed() {
    try { return localStorage.getItem(CONSENT_KEY) === 'granted'; } catch { return false; }
  }

  function gtag() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }

  function loadAnalytics() {
    if (!isProduction || window.__seleznevGaLoaded) return;
    window.__seleznevGaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    gtag('js', new Date());
    gtag('config', GA_ID, {
      anonymize_ip: true,
      allow_google_signals: false,
      send_page_view: true,
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
    document.head.appendChild(script);
  }

  function track(name, params = {}) {
    if (!analyticsAllowed() || !window.__seleznevGaLoaded) return;
    gtag('event', name, params);
  }

  function setConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch {}
    const banner = document.getElementById('analytics-consent');
    if (banner) banner.remove();
    if (value === 'granted') loadAnalytics();
  }

  function showConsent() {
    if (!isProduction) return;
    let saved = null;
    try { saved = localStorage.getItem(CONSENT_KEY); } catch {}
    if (saved === 'granted') return loadAnalytics();
    if (saved === 'denied' || document.getElementById('analytics-consent')) return;

    const box = document.createElement('div');
    box.id = 'analytics-consent';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Настройки аналитики');
    box.style.cssText = 'position:fixed;left:16px;right:16px;bottom:16px;z-index:10000;max-width:760px;margin:auto;background:#111;color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:16px;padding:16px;box-shadow:0 16px 50px rgba(0,0,0,.35);font:14px/1.45 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif';
    box.innerHTML = '<div style="font-weight:700;font-size:15px;margin-bottom:6px">Аналитика сайта</div><div style="opacity:.82;margin-bottom:14px">Используем Google Analytics только с вашего согласия, чтобы понимать, какие страницы и услуги полезны. Необходимые функции сайта работают и без аналитики. <a href="/cookies" style="color:inherit;text-decoration:underline">Подробнее</a>.</div><div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" data-consent="granted" style="border:0;border-radius:999px;padding:10px 16px;font:inherit;font-weight:700;cursor:pointer">Разрешить аналитику</button><button type="button" data-consent="denied" style="border:1px solid rgba(255,255,255,.35);border-radius:999px;padding:10px 16px;background:transparent;color:#fff;font:inherit;cursor:pointer">Только необходимые</button></div>';
    box.addEventListener('click', (event) => {
      const button = event.target instanceof Element ? event.target.closest('[data-consent]') : null;
      if (!button) return;
      setConsent(button.getAttribute('data-consent'));
    });
    document.body.appendChild(box);
  }

  function classifyLink(url, link) {
    const text = (link.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 120);
    if (/t\.me|telegram\.me/i.test(url.hostname)) return { event: 'telegram_click', type: 'telegram', text };
    if (url.protocol === 'mailto:') return { event: 'email_click', type: 'email', text };
    if (url.protocol === 'tel:') return { event: 'phone_click', type: 'phone', text };
    if (/запис|заяв|консультац|начать|выбрать|купить|план/i.test(text)) return { event: 'lead_click', type: 'cta', text };
    if (url.origin !== window.location.origin) return { event: 'outbound_click', type: 'outbound', text };
    return null;
  }

  document.addEventListener('click', (event) => {
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link) return;
    let url;
    try { url = new URL(link.href, window.location.href); } catch { return; }
    const kind = classifyLink(url, link);
    if (kind) {
      track(kind.event, {
        link_url: url.href,
        link_text: kind.text,
        destination_type: kind.type,
        page_path: window.location.pathname,
      });
    }
  }, true);

  document.addEventListener('submit', (event) => {
    const form = event.target instanceof HTMLFormElement ? event.target : null;
    if (!form) return;
    track('lead_form_submit', {
      form_id: form.id || '',
      form_name: form.getAttribute('name') || '',
      page_path: window.location.pathname,
    });
  }, true);

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
      const nativeDialog = [...document.querySelectorAll('[role="dialog"]')].some((node) => node.id !== 'standalone-mobile-menu' && node.id !== 'analytics-consent');
      if (!nativeDialog) openFallbackMenu();
    }, 180);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showConsent, { once: true });
  } else {
    showConsent();
  }
})();
