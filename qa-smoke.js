import fs from 'node:fs';

const read=p=>fs.readFileSync(p,'utf8');
const fail=m=>{throw new Error(m)};
const assert=(ok,m)=>{if(!ok)fail(m)};

const index=read('index.html');
const source=read('source-guards.js');
const exact=read('exact-source-pages.js');
const switcher=read('master-switcher.js');
const css=read('master-switcher.css');
const manifest=JSON.parse(read('manifest.webmanifest'));

const routeOrder=['#home','#todo','#calendar','#email','#tr-today','#primeva-ceo','#finance','#health','#life','#settings'];
let cursor=-1;
for(const route of routeOrder){
  const pos=index.indexOf(`href="${route}"`,cursor+1);
  assert(pos>cursor,`Missing or out-of-order navigation route: ${route}`);
  cursor=pos;
}

assert(index.includes('rel="apple-touch-icon"'),'Missing Apple touch icon link');
assert(index.includes('manifest.webmanifest?v=2'),'Manifest cache version not current');
assert(index.includes('source-guards.js?v=7'),'Source integration cache version not current');
assert(index.includes('master-switcher.css?v=3'),'Responsive shell cache version not current');
assert(index.includes('master-switcher.js?v=3'),'Navigation cache version not current');

for(const file of ['apple-touch-icon.png','icon-192.png','icon-512.png','app-icon.svg']){
  assert(fs.existsSync(file),`Missing app icon asset: ${file}`);
}
assert(manifest.id==='./','PWA manifest must have a stable app id');
assert(manifest.start_url==='./#home','PWA must open on Ken\'s Life Today');
assert(Array.isArray(manifest.icons)&&manifest.icons.length>=2,'PWA manifest icons missing');

assert(source.includes('exact-source-pages.js?v=7'),'Source loader is not using the final exact-source controller');
assert(!source.includes('personal-route-bridge-v6.js'),'Obsolete duplicate Personal route controller is still loaded');
assert(exact.includes('KensLifeEmbed'),'Personal OS navigation bridge is not used');
assert(exact.includes("'To-Do':'tasks'"),'To-Do must map to Personal OS tasks');
assert(exact.includes("'Email':'email'"),'Email route mapping missing');
assert(exact.includes("'Settings':'settings'"),'Settings route mapping missing');
assert(!exact.includes('setInterval('),'Exact-source controller should be event-driven, not persistent polling');
assert(exact.includes("frame.contentWindow.location.reload()"),'Personal Refresh must refresh the actual embedded source page');

for(const route of ['todo','calendar','email','finance','health','life','settings']){
  assert(switcher.includes(`'${route}'`)||switcher.includes(`${route}:`),`Switcher missing Personal route: ${route}`);
}
assert(css.includes('safe-area-inset-top'),'iPhone safe-area top handling missing');
assert(css.includes('safe-area-inset-bottom'),'iPhone safe-area bottom handling missing');
assert(css.includes('min-height:44px'),'Mobile menu touch targets are below release standard');
assert(css.includes('prefers-reduced-motion'),'Reduced-motion accessibility rule missing');

console.log('Ken\'s Life smoke checks passed.');
