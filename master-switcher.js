(()=>{
'use strict';
if(window.__kensMasterSwitcher)return;window.__kensMasterSwitcher=1;
const sourceRoutes=new Set(['health','finance','life','primeva-ceo','primeva-finance','labs-crm','labs-content','health-crm','health-content','tr-today','tr-active','tr-pipeline','tr-tasks','tr-route','tr-panels','tr-payors']);
const sectionMap={
  home:'Today', 'all-tasks':'All Tasks', calendar:'Unified Calendar',
  health:'Personal OS', finance:'Personal OS', life:'Personal OS',
  'primeva-ceo':'Primeva OS','primeva-finance':'Primeva OS','labs-crm':'Primeva OS','labs-content':'Primeva OS','health-crm':'Primeva OS','health-content':'Primeva OS',
  'tr-today':'Three Rivers','tr-active':'Three Rivers','tr-pipeline':'Three Rivers','tr-tasks':'Three Rivers','tr-route':'Three Rivers','tr-panels':'Three Rivers','tr-payors':'Three Rivers'
};
function route(){return location.hash.replace(/^#/,'')||'home'}
function close(){document.getElementById('master-switcher')?.classList.remove('open');document.getElementById('master-switcher-button')?.setAttribute('aria-expanded','false')}
function sync(){
  const r=route();
  document.body.classList.toggle('source-dashboard',sourceRoutes.has(r));
  const label=document.getElementById('master-current');if(label)label.textContent=sectionMap[r]||'Ken\'s Life';
  document.querySelectorAll('.master-menu-item').forEach(a=>{
    const ar=a.dataset.route;
    let on=ar===r;
    if(ar==='health'&&['health','finance','life'].includes(r))on=true;
    if(ar==='primeva-ceo'&&['primeva-ceo','primeva-finance','labs-crm','labs-content','health-crm','health-content'].includes(r))on=true;
    if(ar==='tr-today'&&r.startsWith('tr-'))on=true;
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
