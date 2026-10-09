const {chromium}=require('/Users/elizabethstein/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
(async()=>{
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:1000}});
const urls=process.argv.slice(2);const out=[];
for(const url of urls){try{
const r=await p.goto(url,{waitUntil:'domcontentloaded',timeout:25000});await p.waitForTimeout(/drone.riotters|cerebrium/.test(url)?15000:2000);
const name=new URL(url).hostname.replaceAll('.','-')+new URL(url).pathname.replaceAll('/','-');
await p.screenshot({path:__dirname+'/screenshots/references/'+name+'.png',fullPage:false});
const item={url,finalUrl:p.url(),status:r?.status(),title:await p.title(),text:(await p.locator('body').innerText()).slice(0,14000),links:await p.locator('a[href]').evaluateAll(els=>els.map(e=>({text:e.textContent.trim().slice(0,100),url:e.href})))};out.push(item);console.log(JSON.stringify({url,finalUrl:item.finalUrl,status:item.status,title:item.title}));
}catch(e){out.push({url,blocked:e.message});console.log(JSON.stringify({url,blocked:e.message}));}}
fs.writeFileSync(__dirname+'/research-'+Date.now()+'.json',JSON.stringify(out,null,2));await b.close();})();
