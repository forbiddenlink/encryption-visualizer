const { chromium, expect } = require('../encryption-visualizer/node_modules/@playwright/test');
const fs = require('node:fs');
const routes = ['aes','rsa','ecc','block-modes','diffie-hellman','hashing','hmac','signatures','padding','password-hashing','tls','cryptanalysis'];
let browser;
(async () => {
  browser = await chromium.launch({ channel: 'chrome' });
  const records=[];
  for (const width of [1440,390]) {
    const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
    const page=await context.newPage();
    for (const route of routes) {
      await page.goto(`http://127.0.0.1:4173/${route}`);
      const cards=page.locator('#lesson-notes button[aria-expanded][aria-controls]');
      await expect(cards.first()).toBeVisible();
      const count=await cards.count();
      expect(count).toBeGreaterThan(0);
      for(let i=0;i<count;i++) {
        const button=cards.nth(i);
        const label=await button.innerText();
        const id=await button.getAttribute('aria-controls');
        const panel=page.locator(`[id="${id}"]`);
        if(await button.getAttribute('aria-expanded')==='true') {await button.click();await expect(panel).not.toBeVisible();}
        await button.focus();await page.keyboard.press('Enter');
        await expect(button).toHaveAttribute('aria-expanded','true');
        await expect(panel).toBeVisible();
        expect((await panel.innerText()).trim().length).toBeGreaterThan(0);
        await page.keyboard.press('Space');
        await expect(button).toHaveAttribute('aria-expanded','false');
        await expect(panel).not.toBeVisible();
        records.push({route,width,label,keyboardExpand:'passed',keyboardCollapse:'passed'});
      }
      console.log(route,width,count,'cards verified');
    }
    await page.goto('http://127.0.0.1:4173/compare');
    const cells=page.locator('button[title*=" for "]');
    await expect(cells).toHaveCount(42);
    for(let i=0;i<42;i++) {
      const cell=cells.nth(i);const label=await cell.getAttribute('title');
      await cell.click();
      const panel=page.getByRole('region',{name:'Use case explanation'});
      await expect(panel).toBeVisible();
      expect((await panel.innerText()).trim().length).toBeGreaterThan(20);
      await expect(cell).toHaveAttribute('aria-pressed','true');
      await page.getByRole('button',{name:'Close use case explanation'}).focus();
      await page.keyboard.press('Enter');
      await expect(panel).not.toBeVisible();
      await expect(cell).toHaveAttribute('aria-pressed','false');
      records.push({route:'compare',width,label,explanation:'passed',keyboardClose:'passed'});
    }
    await context.close();
  }
  fs.writeFileSync(__dirname+'/evidence/control-sweep.json',JSON.stringify(records,null,2));
  await browser.close();
})().catch(async e=>{console.error(e);if(browser)await browser.close();process.exitCode=1;});
