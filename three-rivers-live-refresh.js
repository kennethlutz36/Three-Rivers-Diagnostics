(()=>{
'use strict';
if(window.__kensThreeRiversLiveRefresh)return;
window.__kensThreeRiversLiveRefresh=1;

const HOST='goldenrod-stinkbug-404688.hostingersite.com';
const TOKEN='20260830light1';
let timer=0;

function refreshThreeRiversFrame(){
  if(!location.hash.startsWith('#tr-'))return;
  const frame=document.querySelector('.exact-source-frame');
  if(!frame)return;
  let url;
  try{url=new URL(frame.src,location.href);}catch{return;}
  if(url.hostname!==HOST)return;
  if(url.searchParams.get('v')===TOKEN)return;
  url.searchParams.set('v',TOKEN);
  frame.src=url.toString();
}

function queue(){
  clearTimeout(timer);
  timer=setTimeout(refreshThreeRiversFrame,25);
}

const view=document.getElementById('view');
if(view)new MutationObserver(queue).observe(view,{childList:true,subtree:true});
window.addEventListener('hashchange',()=>setTimeout(refreshThreeRiversFrame,40));
window.addEventListener('load',()=>setTimeout(refreshThreeRiversFrame,80));
setTimeout(refreshThreeRiversFrame,120);
setTimeout(refreshThreeRiversFrame,700);
})();