(()=>{
'use strict';
if(window.__kensExactSourcePages)return; window.__kensExactSourcePages=1;

const SOURCES={
  health:{system:'Personal OS',url:'https://kennethlutz36.github.io/personal-os/#health'},
  finance:{system:'Personal OS',url:'https://kennethlutz36.github.io/personal-os/#finance'},
  life:{system:'Personal OS',url:'https://kennethlutz36.github.io/personal-os/#life'},

  'primeva-ceo':{system:'Primeva OS',url:'https://primeva-os.vercel.app/overview'},
  'primeva-finance':{system:'Primeva OS',url:'https://primeva-os.vercel.app/finances'},
  'labs-crm':{system:'Primeva OS',url:'https://primeva-os.vercel.app/labs/crm'},
  'labs-content':{system:'Primeva OS',url:'https://primeva-os.vercel.app/labs/content'},
  'health-crm':{system:'Primeva OS',url:'https://primeva-os.vercel.app/health/crm'},
  'health-content':{system:'Primeva OS',url:'https://primeva-os.vercel.app/health/content'},

  'tr-today':{system:'Three Rivers Territory OS',url:'https://goldenrod-stinkbug-404688.hostingersite.com/#command'},
  'tr-active':{system:'Three Rivers Territory OS',url:'https://goldenrod-stinkbug-404688.hostingersite.com/#accounts'},
  'tr-pipeline':{system:'Three Rivers Territory OS',url:'https://goldenrod-stinkbug-404688.hostingersite.com/#pipeline'},
  'tr-tasks':{system:'Three Rivers Territory OS',url:'https://goldenrod-stinkbug-404688.hostingersite.com/#tasks'},
  'tr-route':{system:'Three Rivers Territory OS',url:'https://goldenrod-stinkbug-404688.hostingersite.com/#route'},
  'tr-panels':{system:'Three Rivers Territory OS',url:'https://goldenrod-stinkbug-404688.hostingersite.com/#panels'},
  'tr-payors':{system:'Three Rivers Territory OS',url:'https://goldenrod-stinkbug-404688.hostingersite.com/#payors'}
};

const nativeOnly=new Set(['home','all-tasks','calendar','primeva-tasks']);
let lastRoute='';
let applying=false;

function route(){return location.hash.replace(/^#/,'')||'home'}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

function sourceShell(cfg,r){
  return `<section class="exact-source-view" data-exact-route="${esc(r)}">
    <div class="exact-source-bar">
      <div><span>EXACT SOURCE VIEW</span><b>${esc(cfg.system)}</b><small>This is the current hosted dashboard page, not a Ken’s Life redesign.</small></div>
      <a href="${esc(cfg.url)}" target="_blank" rel="noopener">Open original ↗</a>
    </div>
    <div class="exact-source-stage">
      <iframe class="exact-source-frame" src="${esc(cfg.url)}" title="${esc(cfg.system)} — exact source page" loading="eager" referrerpolicy="strict-origin-when-cross-origin"></iframe>
    </div>
  </section>`;
}

function apply(){
  if(applying)return;
  const r=route(),cfg=SOURCES[r];
  if(!cfg||nativeOnly.has(r))return;
  const view=document.getElementById('view');
  if(!view)return;
  if(view.querySelector(`.exact-source-view[data-exact-route="${CSS.escape(r)}"]`))return;
  applying=true;
  view.innerHTML=sourceShell(cfg,r);
  lastRoute=r;
  applying=false;
}

// The base app renders first; this layer replaces only detailed source-system routes.
window.addEventListener('hashchange',()=>setTimeout(apply,0));
window.addEventListener('load',()=>setTimeout(apply,50));

const mo=new MutationObserver(()=>{
  const r=route();
  if(SOURCES[r]&&!nativeOnly.has(r))requestAnimationFrame(apply);
});
mo.observe(document.documentElement,{subtree:true,childList:true});

setInterval(()=>{
  const r=route();
  if(r!==lastRoute||SOURCES[r])apply();
},500);
})();
