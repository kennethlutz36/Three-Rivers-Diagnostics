(()=>{
'use strict';
if(window.__kensMasterSwitcher)return;window.__kensMasterSwitcher=1;

const personalRoutes=new Set(['todo','calendar','email','finance','health','life','settings']);
const primevaRoutes=new Set(['primeva-ceo','primeva-finance','labs-crm','labs-content','health-crm','health-content']);
const riverRoutes=new Set(['tr-today','tr-active','tr-pipeline','tr-tasks','tr-route','tr-panels','tr-payors']);
const sourceRoutes=new Set([...personalRoutes,...primevaRoutes,...riverRoutes]);
const sectionMap={
  home:'What should I do today?',
  todo:'To-Do',calendar:'Calendar',email:'Email',
  'tr-today':'Three Rivers','tr-active':'Three Rivers','tr-pipeline':'Three Rivers','tr-tasks':'Three Rivers','tr-route':'Three Rivers','tr-panels':'Three Rivers','tr-payors':'Three Rivers',
  'primeva-ceo':'Primeva OS','primeva-finance':'Primeva OS','labs-crm':'Primeva OS','labs-content':'Primeva OS','health-crm':'Primeva OS','health-content':'Primeva OS',
  finance:'Finance',health:'Health',life:'Life',settings:'Settings'
};
function route(){return location.hash.replace(/^#/,'')||'home'}
function close(){document.getElementById('master-switcher')?.classList.remove('open');document.getElementById('master-switcher-button')?.setAttribute('aria-expanded','false')}
function sync(){
  const r=route();
  document.body.classList.toggle('source-dashboard',sourceRoutes.has(r));
  document.body.classList.toggle('personal-tab',personalRoutes.has(r));
  document.body.classList.toggle('external-dashboard',primevaRoutes.has(r)||riverRoutes.has(r));
  const label=document.getElementById('master-current');if(label)label.textContent=sectionMap[r]||'Ken\'s Life';
  document.querySelectorAll('.master-menu-item').forEach(a=>{
    const ar=a.dataset.route;
    let on=ar===r;
    if(ar==='primeva-ceo'&&primevaRoutes.has(r))on=true;
    if(ar==='tr-today'&&riverRoutes.has(r))on=true;
    a.classList.toggle('on',on);
  });
}
window.addEventListener('hashchange',()=>{close();sync()});
window.addEventListener('load',sync);
document.addEventListener('click',e=>{
  const sw=document.getElementById('master-switcher');
  const btn=e.target.closest('#master-switcher-button');
  if(btn){e.preventDefault();const open=sw?.classList.toggle('open');btn.setAttribute('aria-expanded',open?'true':'false');return}
  if(sw&&!sw.contains(e.target))close();
  if(e.target.closest('.master-menu-item'))close();
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
sync();
})();
