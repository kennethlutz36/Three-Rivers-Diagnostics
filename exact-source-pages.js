(()=>{
'use strict';
if(window.__kensExactSourcePages)return; window.__kensExactSourcePages=1;

const PERSONAL_BASE='https://kennethlutz36.github.io/personal-os/';
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
    'To-Do':['to-do','todo','to do'],
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

function hidePersonalChrome(doc){
  const zones=[...doc.querySelectorAll('aside,[class*="sidebar" i]')];
  const sidebar=zones.find(el=>{
    const t=norm(el.textContent);
    return t.includes('personal os')&&t.includes('calendar')&&t.includes('finance')&&t.includes('health');
  })||doc.querySelector('aside');
  if(sidebar)sidebar.style.setProperty('display','none','important');

  const headers=[...doc.querySelectorAll('header,[class*="topbar" i],[class*="header" i]')];
  const header=headers.find(el=>{
    const t=norm(el.textContent);
    return (t.includes('start day')&&t.includes('ai brief'))||(t.includes('live')&&t.includes('synced')&&t.includes('sign out'));
  });
  if(header)header.style.setProperty('display','none','important');

  let style=doc.getElementById('kens-life-embedded-style');
  if(!style){
    style=doc.createElement('style');
    style.id='kens-life-embedded-style';
    style.textContent=`
      html,body{min-height:100%!important}
      body{overflow:auto!important}
      [data-kens-life-hide]{display:none!important}
    `;
    doc.head?.appendChild(style);
  }
}

function wirePersonalFrame(frame,target){
  if(!frame||!target)return;
  let attempts=0;
  const apply=()=>{
    attempts++;
    try{
      const doc=frame.contentDocument;
      if(!doc?.body)return;
      hidePersonalChrome(doc);
      const nav=findPersonalNav(doc,target);
      if(nav&&!nav.dataset.kensLifeActivated){
        nav.dataset.kensLifeActivated='1';
        nav.click();
      }
      setTimeout(()=>{try{hidePersonalChrome(doc)}catch{}},120);
      setTimeout(()=>{try{hidePersonalChrome(doc)}catch{}},500);
    }catch{}
    if(attempts<12)setTimeout(apply,250);
  };
  frame.addEventListener('load',()=>{attempts=0;setTimeout(apply,40)},{once:false});
  setTimeout(apply,80);
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
