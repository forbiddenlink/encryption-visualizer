const {chromium}=require('/Users/elizabethstein/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
(async()=>{const b=await chromium.launch();const records=[];
for(const width of [1440,390])for(const theme of ['dark','light']){
const p=await b.newPage({viewport:{width,height:width===390?844:1000},reducedMotion:'reduce'});
const errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto('http://127.0.0.1:3002',{waitUntil:'networkidle'});
await p.getByRole('radio',{name:theme==='dark'?'Dark mode':'Light mode',exact:true}).click();
await p.screenshot({path:__dirname+`/screenshots/after/home-${process.argv[2]}-${theme}-${width}.png`,fullPage:true});
await p.screenshot({path:__dirname+`/screenshots/after/home-${process.argv[2]}-${theme}-${width}-viewport.png`,fullPage:false});
records.push({width,theme,overflow:await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),errors});
await p.close();}
fs.writeFileSync(__dirname+`/home-${process.argv[2]}.json`,JSON.stringify(records,null,2));await b.close();console.log(records);})();
