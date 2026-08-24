(()=>{
'use strict';
if(window.__kensExactSourcePages)return; window.__kensExactSourcePages=1;

const PERSONAL_BASE='https://kennethlutz36.github.io/personal-os/?embed=kens-life-v7';
const PERSONAL_ROUTE={
  'To-Do':'tasks',
  'Calendar':'calendar',
  'Email':'email',
  'Finance':'finance',
  'Health':'health',
  'Life':'life',
  'Settings':'settings'
};
const SOURCES={
  todo:{system:'To-Do',url:PERSONAL_BASE,personalTarget:'To-Do'},
  calendar:{system:'Calendar',url:PERSONAL_BASE,personalTarget:'Calendar'},
  email:{system:'Email',url:PERSONAL_BASE,personalTarget:'Email'},
  finance:{system:'Finance',url:PERSONAL_BASE,personalTarget:'Finance'},
  health:{system:'Health',url:PERSONAL_BASE,personalTarget:'Health'},
  life:{system:'Life',url:PERSONAL_BASE,personalTarget:'Life'},
  settings:{system:'Settings',url:PERSONAL_BASE,personalTarget:'Settings'},
  'primeva-ceo':{system:'Primeva OS',url:'https://primeva-os.vercel.app/overview',external:true},
  'primeva-finance':{system:'Primeva OS',url:'https://primeva-os.vercel.app/finances',external:true},
  'labs-crm':{system:'Primeva OS',url:'https://primeva-os.vercel.app/labs/crm',external:true},
  'labs-content':{system:'Primeva OS',url:'https://primeva-os.vercel.app/labs/content',external:true},
  'health-crm':{system:'Primeva OS',url:'https://primeva-os.vercel.app/health/crm',external:true},
  'health-content':{system:'Primeva OS',url:'https://primeva-os.vercel.app/health/content',external:true},
  'tr-today':{system:'Three Rivers',url:'https://goldenrod-stinkbug-404688.hostingersite.com/?v=20260824viewer1#command',external:true},
  'tr-active':{system:'Three Rivers',url:'https://goldenrod-stinkbug-404688.hostingersite.com/?v=20260824viewer1#accounts',external:true},
  'tr-pipeline':{system:'Three Rivers',url:'https://goldenrod-stinkbug-404688.hostingersite.com/?v=20260824viewer1#pipeline',external:true},
  'tr-tasks':{system:'Three Rivers',url:'https://goldenrod-stinkbug-404688.hostingersite.com/?v=20260824viewer1#tasks',external:true},
  'tr-route':{system:'Three Rivers',url:'https://goldenrod-stinkbug-404688.hostingersite.com/?v=20260824viewer1#route',external:true},
  'tr-panels':{system:'Three Rivers',url:'https://goldenrod-stinkbug-404688.hostingersite.com/?v=20260824viewer1#panels',external:true},
  'tr-payors':{system:'Three Rivers',url:'https://goldenrod-stinkbug-404688.hostingersite.com/?v=20260824viewer1#payors',external:true}
};

let applying=false;
let viewObserver=null;
let resizeTimer=null;

const route=()=>location.hash.replace(/^#/,'')||'home';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').replace(/\s+/g,' ').trim().toLowerCase();

function sourceShell(cfg,r){
  return `<section class="exact-source-view ${cfg.personalTarget?'personal-source-view':'external-source-view'}" data-exact-route="${esc(r)}">
    <div class="exact-source-stage">
      <iframe class="exact-source-frame" data-personal-target="${esc(cfg.personalTarget||'')}" src="${esc(cfg.url)}" title="${esc(cfg.system)}" loading="eager" referrerpolicy="strict-origin-when-cross-origin"></iframe>
    </div>
  </section>`;
}

function setOuterChrome(cfg){
  const kicker=document.getElementById('page-kicker');
  const title=document.getElementById('page-title');
  if(kicker)kicker.textContent=cfg.personalTarget?'KEN\'S LIFE':'DASHBOARD';
  if(title)title.textContent=cfg.system;
}

function findPersonalNav(doc,target){
  const aliases={
    'To-Do':['to-do','todo','to do','tasks'],
    'Calendar':['calendar'],
    'Email':['email'],
    'Finance':['finance'],
    'Health':['health'],
    'Life':['life'],
    'Settings':['settings']
  }[target]||[target];
  const wanted=aliases.map(norm);
  const zones=[...doc.querySelectorAll('aside,nav,[class*="sidebar" i],[class*="nav" i]')];
  const candidates=(zones.length?zones:[doc.body]).flatMap(z=>[...z.querySelectorAll('a,button,[role="button"]')]);
  return candidates.find(el=>wanted.includes(norm(el.textContent)))||
    [...doc.querySelectorAll('a,button,[role="button"]')].find(el=>wanted.includes(norm(el.textContent)));
}

function fallbackChrome(doc){
  const zones=[...doc.querySelectorAll('aside,[class*="sidebar" i],[data-pos-mobile-sidebar]')];
  const sidebar=zones.find(el=>{
    const r=el.getBoundingClientRect();
    const t=norm(el.textContent);
    return r.width>=150&&r.width<=380&&r.height>300&&r.left<20&&
      (t.includes('personal os')||((t.includes('calendar')||t.includes('to-do')||t.includes('tasks'))&&t.includes('finance')&&t.includes('health')));
  });
  const left=sidebar?Math.max(0,Math.round(sidebar.getBoundingClientRect().right)):0;
  const headers=[...doc.querySelectorAll('header,[class*="topbar" i],[class*="header" i]')];
  const header=headers.find(el=>{
    const r=el.getBoundingClientRect();
    if(r.top>24||r.height<35||r.height>140)return false;
    const t=norm(el.textContent);
    return (t.includes('start day')&&t.includes('ai brief'))||
      (t.includes('live')&&t.includes('synced')&&t.includes('sign out'))||
      (r.left>=Math.max(0,left-20)&&r.width>Math.max(480,(doc.defaultView?.innerWidth||800)*.55));
  });
  const top=header?Math.max(0,Math.round(header.getBoundingClientRect().bottom)):0;
  return {left,top};
}

function applyCrop(frame,left=0,top=0){
  frame.style.position='absolute';
  frame.style.maxWidth='none';
  frame.style.left=`-${Math.max(0,left)}px`;
  frame.style.top=`-${Math.max(0,top)}px`;
  frame.style.width=`calc(100% + ${Math.max(0,left)}px)`;
  frame.style.height=`calc(100% + ${Math.max(0,top)}px)`;
}

function routePersonalFrame(frame,target){
  try{
    const win=frame.contentWindow;
    const key=PERSONAL_ROUTE[target];
    if(!key||!win)return false;
    const api=win.KensLifeEmbed;
    if(api?.ready?.()){
      api.prepare?.();
      if(api.current?.()!==key)api.navigate(key);
      return api.current?.()===key;
    }
    const doc=frame.contentDocument;
    const nav=doc&&findPersonalNav(doc,target);
    if(nav){nav.click();return true}
  }catch{}
  return false;
}

function cropPersonalFrame(frame){
  try{
    const win=frame.contentWindow;
    const doc=frame.contentDocument;
    if(!doc?.body)return false;
    let metrics=null;
    const api=win?.KensLifeEmbed;
    if(api?.ready?.()){
      api.prepare?.();
      metrics=api.chrome?.();
    }
    if(!metrics)metrics=fallbackChrome(doc);
    applyCrop(frame,metrics.left||0,metrics.top||0);
    return true;
  }catch{return false}
}

function wirePersonalFrame(frame,target){
  if(!frame||!target)return;
  let attempts=0;
  let stable=0;
  const settle=()=>{
    attempts++;
    const routed=routePersonalFrame(frame,target);
    const cropped=cropPersonalFrame(frame);
    if(routed&&cropped)stable++; else stable=0;
    if(attempts<24&&stable<3)setTimeout(settle,180);
  };
  frame.addEventListener('load',()=>{attempts=0;stable=0;setTimeout(settle,50)});
  setTimeout(settle,80);
}

function apply(){
  if(applying)return;
  const r=route(),cfg=SOURCES[r];
  if(!cfg)return;
  const view=document.getElementById('view');
  if(!view)return;
  setOuterChrome(cfg);
  const existing=view.querySelector(`.exact-source-view[data-exact-route="${r}"]`);
  if(existing){
    if(cfg.personalTarget){
      const frame=existing.querySelector('.exact-source-frame');
      if(frame){routePersonalFrame(frame,cfg.personalTarget);cropPersonalFrame(frame)}
    }
    return;
  }
  applying=true;
  view.innerHTML=sourceShell(cfg,r);
  const frame=view.querySelector('.exact-source-frame');
  if(cfg.personalTarget)wirePersonalFrame(frame,cfg.personalTarget);
  applying=false;
}

function installViewObserver(){
  const view=document.getElementById('view');
  if(!view||viewObserver)return;
  viewObserver=new MutationObserver(()=>{
    const r=route();
    if(!SOURCES[r])return;
    if(!view.querySelector(`.exact-source-view[data-exact-route="${r}"]`))queueMicrotask(apply);
  });
  viewObserver.observe(view,{childList:true});
}

window.addEventListener('hashchange',()=>requestAnimationFrame(apply));
window.addEventListener('load',()=>{installViewObserver();setTimeout(apply,40)});
window.addEventListener('resize',()=>{
  clearTimeout(resizeTimer);
  resizeTimer=setTimeout(()=>{
    const cfg=SOURCES[route()];
    if(!cfg?.personalTarget)return;
    const frame=document.querySelector('.personal-source-view .exact-source-frame');
    if(frame)cropPersonalFrame(frame);
  },120);
});

document.addEventListener('click',e=>{
  const refresh=e.target.closest?.('#refresh');
  const cfg=SOURCES[route()];
  if(!refresh||!cfg?.personalTarget)return;
  const frame=document.querySelector('.personal-source-view .exact-source-frame');
  if(!frame)return;
  e.preventDefault();
  e.stopImmediatePropagation();
  try{frame.contentWindow.location.reload()}catch{frame.src=frame.src}
},true);

installViewObserver();
setTimeout(apply,60);
})();
