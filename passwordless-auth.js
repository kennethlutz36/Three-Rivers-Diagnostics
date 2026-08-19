import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const PERSONAL_URL='https://moczyyqxcveqewvxjiph.supabase.co';
const PERSONAL_KEY='sb_publishable_Wj8Tjx_v0tvkcUcr3vvpgA_uQ3V4Vmn';
const OWNER='kennethlutz36@gmail.com';
const client=createClient(PERSONAL_URL,PERSONAL_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});

function message(text,ok=false){
  const el=document.getElementById('login-error');
  if(!el)return;
  el.textContent=text;
  el.style.color=ok?'#267c55':'';
}

// Capture the login submit before the legacy password handler in app.js.
document.addEventListener('submit',async e=>{
  const form=e.target;
  if(form?.id!=='login-form')return;
  e.preventDefault();
  e.stopImmediatePropagation();

  const email=document.getElementById('login-email')?.value?.trim().toLowerCase()||'';
  const btn=form.querySelector('button[type="submit"]');
  message('');
  if(email!==OWNER){
    message('Use the authorized Ken\'s Life email address.');
    return;
  }

  if(btn){btn.disabled=true;btn.textContent='Sending sign-in link…';}
  const redirectTo=`${window.location.origin}${window.location.pathname}`;
  const {error}=await client.auth.signInWithOtp({
    email,
    options:{emailRedirectTo:redirectTo,shouldCreateUser:false}
  });

  if(error){
    message(error.message||'Could not send the sign-in link.');
    if(btn){btn.disabled=false;btn.textContent='Email me a sign-in link';}
    return;
  }

  message('Check your email and tap the secure sign-in link. No password is required.',true);
  if(btn){btn.textContent='Sign-in link sent';}
},true);
