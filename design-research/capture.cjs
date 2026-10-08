const { chromium } = require('/Users/elizabethstein/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
(async () => {
 const browser = await chromium.launch();
 const mode = process.argv[2] || 'before';
 const routes = ['/', '/aes', '/rsa', '/ecc', '/block-modes', '/diffie-hellman', '/hashing', '/hmac', '/signatures', '/padding', '/password-hashing', '/tls', '/cryptanalysis', '/compare', '/learn', '/glossary', '/about'];
 const records = [];
 for (const viewport of [{width:1440,height:1000},{width:390,height:844}]) {
  const context = await browser.newContext({viewport, reducedMotion:'reduce'});
  const page = await context.newPage();
  for(const route of routes) {
   const errors=[]; const listener=e=>errors.push(e.message); page.on('pageerror',listener);
   await page.goto('http://127.0.0.1:3002'+route, {waitUntil:'networkidle'});
   await page.locator('h1').waitFor();
   await page.screenshot({path:path.join(root,'screenshots',mode,`${route.slice(1)||'home'}-${viewport.width}.png`),fullPage:true});
   records.push({route,width:viewport.width,title:await page.title(),heading:await page.locator('h1').allTextContents(),overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),errors,buttons:await page.getByRole('button').allTextContents()});
   page.off('pageerror',listener);
   console.log(route,viewport.width,errors.length?'ERROR':'loaded');
  }
  await context.close();
 }
 fs.writeFileSync(path.join(root,`${mode}-browser.json`),JSON.stringify(records,null,2));
 await browser.close();
})();
