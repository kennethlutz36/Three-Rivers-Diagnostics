(()=>{
'use strict';
if(window.__kensExactSourcePages)return; window.__kensExactSourcePages=1;

const PERSONAL_BASE='https://kennethlutz36.github.io/personal-os/';
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

  'tr-today':{system:'Three Rivers',url:'https://goldenrod-stinkbug-404688.hostingersite.com/#command',external:true},
  'tr-active':{system:'Three Rivers',url:'https://goldenrod-stinkbug-404688.hostingersite.com/#accounts',external:true},
  'tr-pipeline':{system:'Three Rivers',url:'https://goldenrod-stinkbug-404688.hostingersite.com/#pipeline',external:true},
  'tr-tasks':{system:'Three Rivers',url:'https://goldenrod-stinkbug-404688.hostingersite.com/#tasks',external:true},
  'tr-route':{system:'Three Rivers',url:'https://goldenrod-stinkbug-404688.hostingersite.com/#route',external:true},
  'tr-panels':{system:'Three Rivers',url:'https://goldenrod-stinkbug-404688.hostingersite.com/#panels',external:true},
  'tr-payors':{system:'Three Rivers',url:'https://goldenrod-stinkbug-404688.hostingersite.com/#payors',external:true}
};

let lastRoute='';
let applying=false;

function route(){return location.hash.replace(/^#/,'')||'home'}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function norm(v){return String(v||'').replace(/\s+/g,' ').trim().toLowerCase()}

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

function detectPersonalSidebar(doc){
  const zones=[...doc.querySelectorAll('aside,[class*="sidebar" i],[data-pos-mobile-sidebar]')];
  const sidebar=zones.find(el=>{
    const r=el.getBoundingClientRect();
    const t=norm(el.textContent);
    return r.width>=150&&r.width<=360&&r.height>300&&r.left<20&&
      (t.includes('personal os')||((t.includes('calendar')||t.includes('to-do')||t.includes('tasks'))&&t.includes('finance')&&t.includes('health')));
  });
  if(!sidebar)return 0;
  const r=sidebar.getBoundingClientRect();
  return Math.max(0,Math.round(r.right));
}

function detectPersonalHeader(doc,leftCrop){
  const headers=[...doc.querySelectorAll('header,[class*="topbar" i],[class*="header" i]')];
  const header=headers.find(el=>{
    const r=el.getBoundingClientRect();
    if(r.top>24||r.height<35||r.height>130)return false;
    const t=norm(el.textContent);
    return (t.includes('start day')&&t.includes('ai brief'))||
      (t.includes('live')&&t.includes('synced')&&t.includes('sign out'))||
      (r.left>=Math.max(0,leftCrop-20)&&r.width>500);
  });
  if(!header)return 0;
  const r=header.getBoundingClientRect();
  return Math.max(0,Math.round(r.bottom));
}

function prepPersonalDoc(doc){
  // Personal OS mobile navigation is redundant inside Ken's Life.
  const mobileNav=doc.getElementById('posv10MobileNav');
  if(mobileNav)mobileNav.style.setProperty('display','none','important');
}

function cropPersonalFrame(frame){
  try{
    const doc=frame.contentDocument;
    if(!doc?.body)return false;
    prepPersonalDoc(doc);
    const left=detectPersonalSidebar(doc);
    const top=detectPersonalHeader(doc,left);
    frame.style.position='absolute';
    frame.style.maxWidth='none';
    frame.style.left=`-${left}px`;
    frame.style.top=`-${top}px`;
    frame.style.width=`calc(100% + ${left}px)`;
    frame.style.height=`calc(100% + ${top}px)`;
    return true;
  }catch{return false}
}

function routePersonalFrame(frame,target){
  try{
    const win=frame.contentWindow;
    const key=PERSONAL_ROUTE[target];
    if(!key||!win)return false;
    if(win.state&&typeof win.render==='function'){
      if(String(win.state.route||'')!==key){
        win.state.route=key;
        win.render();
      }
      return true;
    }
    const doc=frame.contentDocument;
    const nav=doc&&findPersonalNav(doc,target);
    if(nav){nav.click();return true}
  }catch{}
  return false;
}

function wirePersonalFrame(frame,target){
  if(!frame||!target)return;
  let attempts=0;
  const settle=()=>{
    attempts++;
    const routed=routePersonalFrame(frame,target);
    const cropped=cropPersonalFrame(frame);
    // Personal OS applies several post-render patches; re-assert route/crop while they settle.
    if(attempts<20&&(!routed||!cropped||attempts<8))setTimeout(settle,250);
  };
  frame.addEventListener('load',()=>{attempts=0;setTimeout(settle,70)},{once:false});
  setTimeout(settle,100);
}

function apply(){
  if(applying)return;
  const r=route(),cfg=SOURCES[r];
  if(!cfg)return;
  const view=document.getElementById('view');
  if(!view)return;
  setOuterChrome(cfg);
  if(view.querySelector(`.exact-source-view[data-exact-route="${CSS.escape(r)}"]`))return;
  applying=true;
  view.innerHTML=sourceShell(cfg,r);
  const frame=view.querySelector('.exact-source-frame');
  if(cfg.personalTarget)wirePersonalFrame(frame,cfg.personalTarget);
  lastRoute=r;
  applying=false;
}

window.addEventListener('hashchange',()=>setTimeout(apply,0));
window.addEventListener('load',()=>setTimeout(apply,50));

const mo=new MutationObserver(()=>{
  const r=route();
  if(SOURCES[r])requestAnimationFrame(apply);
});
mo.observe(document.documentElement,{subtree:true,childList:true});

setInterval(()=>{
  const r=route();
  if(r!==lastRoute||SOURCES[r])apply();
},500);
})();
