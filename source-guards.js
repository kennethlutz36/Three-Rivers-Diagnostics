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
  if(!n){n=document.createElement('div');n.dataset.klSourceError='1';n.className='notice warn';n.style.marginTop='10px';form.querySelector('.form-grid')?.after(n);}
  n.textContent='Three Rivers tasks must be linked to an account because the source CRM requires account_id.';
},true);
