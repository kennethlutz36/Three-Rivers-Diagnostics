(()=>{
  'use strict';
  if (window.__kensPersonalRouteBridgeV6) return;
  window.__kensPersonalRouteBridgeV6 = 1;

  const routeMap = {
    todo:'tasks',
    calendar:'calendar',
    email:'email',
    finance:'finance',
    health:'health',
    life:'life',
    settings:'settings'
  };

  const current = () => location.hash.replace(/^#/,'') || 'home';
  let timer = null;

  function sync(){
    clearTimeout(timer);
    const outer = current();
    const target = routeMap[outer];
    if (!target) return;

    let attempts = 0;
    const tryNavigate = () => {
      attempts++;
      const frame = document.querySelector('.personal-source-view .exact-source-frame, iframe[data-personal-target]');
      if (!frame) {
        if (attempts < 40) timer = setTimeout(tryNavigate, 150);
        return;
      }
      try {
        const api = frame.contentWindow?.KensLifeEmbed;
        if (api?.ready?.()) {
          const before = api.current?.();
          if (before !== target) api.navigate(target);
          const after = api.current?.();
          if (after === target) return;
        }
      } catch {}
      if (attempts < 40) timer = setTimeout(tryNavigate, 150);
    };

    tryNavigate();
  }

  addEventListener('hashchange', sync);
  addEventListener('load', ()=>setTimeout(sync, 100));
  new MutationObserver(()=>{
    if (routeMap[current()]) sync();
  }).observe(document.documentElement,{subtree:true,childList:true});
  setTimeout(sync,100);
})();
