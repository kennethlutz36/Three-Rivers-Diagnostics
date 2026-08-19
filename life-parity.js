import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const sb=createClient('https://moczyyqxcveqewvxjiph.supabase.co','sb_publishable_Wj8Tjx_v0tvkcUcr3vvpgA_uQ3V4Vmn',{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
const CATS=[
  ['admin','Admin'],['home_vehicle','Home & Vehicle'],['relationships','Relationships'],
  ['travel_experiences','Travel & Experiences'],['important_dates','Important Dates'],['other','Other']
];
let items=null,fetching=false;
const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
const label=v=>CATS.find(x=>x[0]===v)?.[1]||v||'Other';
const fmt=v=>{if(!v)return '—';const d=new Date(`${String(v).slice(0,10)}T12:00:00`);return new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric'}).format(d)};

async function load(){
  if(fetching)return null; fetching=true;
  try{
    const {data,error}=await sb.from('life_items').select('*').order('item_date',{ascending:true,nullsFirst:false}).limit(200);
    if(error)throw error; items=data||[]; return items;
  }finally{fetching=false;}
}
function count(cat){return (items||[]).filter(x=>x.status==='open'&&x.category===cat).length}
async function renderLife(){
  if(location.hash!=='#life')return;
  const view=document.querySelector('#view'); if(!view||view.querySelector('[data-kl-life-parity]'))return;
  if(!items)await load(); if(location.hash!=='#life')return;
  const open=(items||[]).filter(x=>x.status==='open');
  view.innerHTML=`<div data-kl-life-parity>
    <div class="section-head"><h2>Life</h2><span>Personal OS life categories · same source records</span><div class="actions"><button class="btn primary small" data-kl-new-life><i data-lucide="plus"></i>Add item</button></div></div>
    <div class="grid three section">${CATS.map(([key,name])=>`<div class="card metric"><div class="label">${esc(name)}</div><div class="value">${count(key)}</div><div class="sub">Open items</div></div>`).join('')}</div>
    <div class="card list">${(items||[]).length?(items||[]).map(x=>`<div class="list-row"><div class="row-main"><div class="row-title">${esc(x.title)}</div><div class="row-meta"><span class="badge purple">${esc(label(x.category))}</span>${x.details?` <span class="truncate">${esc(x.details)}</span>`:''}</div></div><div class="row-side"><b>${fmt(x.item_date)}</b>${esc(x.status)}</div></div>`).join(''):`<div class="empty"><b>No Life items yet</b>Add personal admin, home, relationships, travel, dates or other priorities here.</div>`}</div>
  </div>`;
  window.lucide?.createIcons?.({attrs:{'stroke-width':1.8}});
}
function openForm(){
  const modal=document.querySelector('#modal'),body=document.querySelector('#modal-body');
  document.querySelector('#modal-kicker').textContent='PERSONAL'; document.querySelector('#modal-title').textContent='Add Life item';
  body.innerHTML=`<form id="kl-life-form"><div class="form-grid"><div class="field"><span>Title</span><input name="title" required /></div><div class="field"><span>Category</span><select name="category">${CATS.map(([v,n])=>`<option value="${v}">${esc(n)}</option>`).join('')}</select></div><div class="field"><span>Date</span><input name="item_date" type="date" /></div><div class="field full"><span>Details</span><textarea name="details"></textarea></div></div><div class="form-actions"><button type="button" class="btn" data-close-modal>Cancel</button><button class="btn primary" type="submit">Add item</button></div></form>`;
  modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false');
}
async function save(form){
  const {data:{user}}=await sb.auth.getUser(); if(!user)throw new Error('Sign in required');
  const f=new FormData(form),title=String(f.get('title')||'').trim(); if(!title)throw new Error('Title is required');
  const {error}=await sb.from('life_items').insert({user_id:user.id,title,category:f.get('category'),item_date:f.get('item_date')||null,details:f.get('details')||null,status:'open'}); if(error)throw error;
  document.querySelector('#modal').classList.add('hidden'); items=null; await load(); const marker=document.querySelector('[data-kl-life-parity]'); if(marker)marker.remove(); await renderLife();
}

document.addEventListener('click',e=>{const b=e.target.closest('[data-kl-new-life]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();openForm();},true);
document.addEventListener('submit',e=>{if(e.target.id!=='kl-life-form')return;e.preventDefault();e.stopImmediatePropagation();save(e.target).catch(err=>{const form=e.target;let n=form.querySelector('.form-error');if(!n){n=document.createElement('div');n.className='form-error field full';form.querySelector('.form-grid').appendChild(n)}n.textContent=String(err?.message||err)});},true);
window.addEventListener('hashchange',()=>setTimeout(renderLife,30));
const observer=new MutationObserver(()=>{if(location.hash==='#life'&&!document.querySelector('[data-kl-life-parity]'))setTimeout(renderLife,20)});
observer.observe(document.documentElement,{subtree:true,childList:true});
setTimeout(renderLife,120);
