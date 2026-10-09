const {chromium}=require('/Users/elizabethstein/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
(async()=>{const b=await chromium.launch();const results=[];
for(const width of [320,768,1024]){
const p=await b.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
await p.goto('http://127.0.0.1:3002',{waitUntil:'networkidle'});
results.push({width,overflow:await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});
await p.screenshot({path:__dirname+`/screenshots/foundation/home-${width}.png`,fullPage:false});
if(width===320){await p.getByLabel('Open navigation menu').click();await p.screenshot({path:__dirname+'/screenshots/foundation/mobile-menu-320.png'});}
await p.close();}
const p=await b.newPage({viewport:{width:1440,height:1000}});await p.goto('http://127.0.0.1:3002',{waitUntil:'networkidle'});
const lab=p.getByRole('region',{name:'Interactive cipher lab'});await lab.getByRole('textbox',{name:'Plaintext to encrypt'}).fill('');
await lab.screenshot({path:__dirname+'/screenshots/foundation/lab-empty.png'});
await lab.getByRole('textbox',{name:'Plaintext to encrypt'}).fill('encrypt me');await lab.getByRole('button',{name:'Next step',exact:true}).click();await lab.screenshot({path:__dirname+'/screenshots/foundation/lab-step.png'});
await p.getByRole('searchbox').fill('no such algorithm');await p.locator('#topics').screenshot({path:__dirname+'/screenshots/foundation/catalog-empty.png'});
fs.writeFileSync(__dirname+'/foundation-check.json',JSON.stringify(results,null,2));console.log(results);await b.close();})();
