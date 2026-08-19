import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const PERSONAL_URL='https://moczyyqxcveqewvxjiph.supabase.co';
const PERSONAL_KEY='sb_publishable_Wj8Tjx_v0tvkcUcr3vvpgA_uQ3V4Vmn';
const TR_BRIDGE='https://wqrdczvprvbcybixneho.supabase.co/functions/v1/kens-life-three-rivers';
const STAGES=['No Contact','Needs Contact','Working','Meeting Scheduled','Corporate Review','Corporate Trial','Stalled'];
const sb=createClient(PERSONAL_URL,PERSONAL_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
let mode='working';
let accounts=null;
let fetching=false;

const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
const num=v=>Number(v||0);
const badge=(text,tone='orange')=>`<span class="badge ${tone}">${esc(text||'—')}</span>`;

async function getAccounts(){
  if(accounts)return accounts;
  if(fetching)return null;
  fetching=true;
  try{
    const {data:{session}}=await sb.auth.getSession();
    if(!session?.access_token)return null;
    const r=await fetch(TR_BRIDGE,{method:'POST',headers:{Authorization:`Bearer ${session.access_token}`,'Content-Type':'application/json'},body:JSON.stringify({action:'bootstrap',payload:{}})});
    if(!r.ok)return null;
    const b=await r.json();
    accounts=(b.accounts||[]).filter(a=>!a.active&&!a.excluded&&!a.out_of_territory);
    return accounts;
  }finally{fetching=false;}
}

function card(a){
  return `<div class="pipe-card" data-edit-tr-account="${esc(a.id)}"><b>${esc(a.name)}</b><span>${esc(a.specialty||'Prospect')} · ${esc(a.region||a.city||'')}</span><span>${a.next_step?`Next: ${esc(a.next_step)}`:`Est. ${esc(a.est_monthly_samples??'—')} samples/mo`}</span></div>`;
}

async function renderParity(){
  if(location.hash!=='#tr-pipeline')return;
  const view=document.querySelector('#view');
  if(!view||view.querySelector('[data-kl-pipeline-parity]'))return;
  const rows=await getAccounts();
  if(!rows||location.hash!=='#tr-pipeline')return;
  const visible=mode==='working'?rows.filter(a=>(a.stage||'No Contact')!=='No Contact'):rows;
  const boardStages=mode==='working'?STAGES.filter(s=>s!=='No Contact'):STAGES;
  view.innerHTML=`<div data-kl-pipeline-parity>
    <div class="section-head"><h2>Pipeline</h2><span>Everything not yet sending samples</span><div class="actions"><a class="btn ghost small" target="_blank" rel="noopener" href="https://goldenrod-stinkbug-404688.hostingersite.com/"><i data-lucide="external-link"></i>Open Three Rivers backup</a></div></div>
    <div class="filters"><div style="display:flex;border:1px solid var(--line);border-radius:9px;padding:2px;background:#fff">
      <button class="btn small ${mode==='working'?'primary':'ghost'}" style="border:0;box-shadow:none" data-kl-pipeline-mode="working">Working now ${rows.filter(a=>(a.stage||'No Contact')!=='No Contact').length}</button>
      <button class="btn small ${mode==='all'?'primary':'ghost'}" style="border:0;box-shadow:none" data-kl-pipeline-mode="all">All prospects ${rows.length}</button>
    </div>${badge(`${visible.length} shown`)}<span class="spacer"></span><span class="sync-line"><i></i>Live Three Rivers source</span></div>
    <div class="pipe" style="grid-template-columns:repeat(${boardStages.length},minmax(230px,1fr))">${boardStages.map(stage=>{const list=visible.filter(a=>(a.stage||'No Contact')===stage).sort((a,b)=>(num(b.score)||num(b.est_monthly_samples))-(num(a.score)||num(a.est_monthly_samples)));return `<div class="pipe-col"><div class="pipe-head"><b>${esc(stage)}</b><span>${list.length}</span></div>${list.length?list.map(card).join(''):`<div class="empty" style="padding:16px 6px">No accounts</div>`}</div>`}).join('')}</div>
  </div>`;
  window.lucide?.createIcons?.({attrs:{'stroke-width':1.8}});
}

document.addEventListener('click',e=>{
  const b=e.target.closest('[data-kl-pipeline-mode]');
  if(!b)return;
  mode=b.dataset.klPipelineMode;
  const marker=document.querySelector('[data-kl-pipeline-parity]');
  if(marker)marker.remove();
  renderParity();
});

window.addEventListener('hashchange',()=>setTimeout(renderParity,40));
const observer=new MutationObserver(()=>{
  if(location.hash==='#tr-pipeline'&&!document.querySelector('[data-kl-pipeline-parity]'))setTimeout(renderParity,20);
});
observer.observe(document.documentElement,{subtree:true,childList:true});
setTimeout(renderParity,120);
