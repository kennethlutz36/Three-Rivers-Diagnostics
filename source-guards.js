// Embedded Three Rivers release marker: 20260824viewer1
// Client-side guardrails that mirror source database requirements.
// Server-side validation remains authoritative.

document.addEventListener('submit',e=>{
  const form=e.target;
  if(form?.id!=='task-form')return;
  const f=new FormData(form);
  if(f.get('workspace')!=='Three Rivers'||f.get('account'))return;
  e.preventDefault();
  e.stopImmediatePropagation();
  let n=form.querySelector('[data-kl-source-error]');
  if(!n){
    n=document.createElement('div');
    n.dataset.klSourceError='1';
    n.className='notice warn';
    n.style.marginTop='10px';
    form.querySelector('.form-grid')?.after(n);
  }
  n.textContent='Three Rivers tasks must be linked to an account because the source CRM requires account_id.';
},true);

// Exact-source layer: Personal OS pages become Ken's Life tabs, while
// Primeva and Three Rivers remain complete embedded dashboards.
if(!document.querySelector('link[data-kens-exact-source]')){
  const l=document.createElement('link');
  l.rel='stylesheet';
  l.href='exact-source-pages.css?v=7';
  l.dataset.kensExactSource='1';
  document.head.appendChild(l);
}
if(!document.querySelector('script[data-kens-exact-source]')){
  const s=document.createElement('script');
  s.src='exact-source-pages.js?v=20260824viewer1';
  s.dataset.kensExactSource='1';
  document.body.appendChild(s);
}