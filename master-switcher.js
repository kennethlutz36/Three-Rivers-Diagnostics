(()=>{
'use strict';
if(window.__kensMasterSwitcher)return;window.__kensMasterSwitcher=1;

const personalRoutes=new Set(['todo','calendar','email','finance','health','life','settings']);
const primevaRoutes=new Set(['primeva-ceo','primeva-finance','labs-crm','labs-content','health-crm','health-content']);
const riverRoutes=new Set(['tr-today','tr-active','tr-pipeline','tr-tasks','tr-route','tr-panels','tr-payors']);
const sourceRoutes=new Set([...personalRoutes,...primevaRoutes,...riverRoutes]);
const externalRoutes=new Set([...primevaRoutes,...riverRoutes]);
const quickTaskRoutes=new Set(['home','todo']);
const sectionMap={
  home:'What should I do today?',
  todo:'To-Do',calendar:'Calendar',email:'Email',
  'tr-today':'Three Rivers','tr-active':'Three Rivers','tr-pipeline':'Three Rivers','tr-tasks':'Three Rivers','tr-route':'Three Rivers','tr-panels':'Three Rivers','tr-payors':'Three Rivers',
  'primeva-ceo':'Primeva OS','primeva-finance':'Primeva OS','labs-crm':'Primeva OS','labs-content':'Primeva OS','health-crm':'Primeva OS','health-content':'Primeva OS',
  finance:'Finance',health:'Health',life:'Life',settings:'Settings'
};

const route=()=>location.hash.replace(/^#/,'')||'home';
const switcher=()=>document.getElementById('master-switcher');
const button=()=>document.getElementById('master-switcher-button');
const items=()=>[...document.querySelectorAll('.master-menu-item')];

function close({restoreFocus=false}={}){
  switcher()?.classList.remove('open');
  button()?.setAttribute('aria-expanded','false');
  if(restoreFocus)button()?.focus();
}
function open(){
  switcher()?.classList.add('open');
  button()?.setAttribute('aria-expanded','true');
}
function sync(){
  const r=route();
  document.body.classList.toggle('source-dashboard',sourceRoutes.has(r));
  document.body.classList.toggle('personal-tab',personalRoutes.has(r));
  document.body.classList.toggle('external-dashboard',externalRoutes.has(r));
  document.body.classList.toggle('quick-task-route',quickTaskRoutes.has(r));
  document.body.dataset.kensRoute=r;

  const label=document.getElementById('master-current');
  if(label)label.textContent=sectionMap[r]||'Ken\'s Life';
  const title=document.getElementById('page-title');
  if(title&&sourceRoutes.has(r))title.textContent=sectionMap[r]||title.textContent;

  items().forEach(a=>{
    const ar=a.dataset.route;
    let on=ar===r;
    if(ar==='primeva-ceo'&&primevaRoutes.has(r))on=true;
    if(ar==='tr-today'&&riverRoutes.has(r))on=true;
    a.classList.toggle('on',on);
    a.setAttribute('role','menuitem');
    if(on)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
  });
}

window.addEventListener('hashchange',()=>{close();sync()});
window.addEventListener('load',sync);
document.addEventListener('click',e=>{
  const sw=switcher();
  const btn=e.target.closest('#master-switcher-button');
  if(btn){
    e.preventDefault();
    if(sw?.classList.contains('open'))close();else open();
    return;
  }
  if(sw&&!sw.contains(e.target))close();
  if(e.target.closest('.master-menu-item'))close();
});
document.addEventListener('keydown',e=>{
  const sw=switcher();
  if(e.key==='Escape'&&sw?.classList.contains('open')){
    e.preventDefault();close({restoreFocus:true});return;
  }
  if(!sw?.classList.contains('open')||!['ArrowDown','ArrowUp','Home','End'].includes(e.key))return;
  const menuItems=items();
  if(!menuItems.length)return;
  e.preventDefault();
  let idx=menuItems.indexOf(document.activeElement);
  if(e.key==='Home')idx=0;
  else if(e.key==='End')idx=menuItems.length-1;
  else if(e.key==='ArrowDown')idx=(idx+1+menuItems.length)%menuItems.length;
  else idx=(idx-1+menuItems.length)%menuItems.length;
  menuItems[idx].focus();
});

sync();
})();
