import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.setDefaultTimeout(12000);page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:5173');await page.evaluate(()=>localStorage.clear());await page.reload();
 await page.getByRole('button',{name:'Demo Mode',exact:true}).click();await page.getByRole('button',{name:'Load Saturday Demand Surge'}).click();
 await page.getByLabel('Experience').selectOption('operations');await page.getByLabel('Product shelf').selectOption('soboro');
 await page.getByRole('button',{name:'Simulate shelf scan'}).click();await page.getByRole('button',{name:'Confirm and update inventory'}).click();
 await page.getByRole('heading',{name:'7 total units'}).waitFor();await page.getByRole('button',{name:'Kitchen Tasks',exact:true}).click();
 await page.getByRole('button',{name:'Create production recommendation'}).click();
 const saved=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('sungsimdang-passport-v3')));
 let s=await saved();assert.equal(s.tasks[0].status,'Recommended');const quantity=s.tasks[0].quantity;
 await page.getByRole('button',{name:'Approve production',exact:true}).click();await page.getByRole('button',{name:'Start production',exact:true}).click();
 assert.equal(await page.getByRole('button',{name:'Complete production',exact:true}).isDisabled(),true);
 await page.getByRole('button',{name:'Demo: advance to completion'}).click();await page.getByRole('button',{name:'Complete production',exact:true}).click();
 s=await saved();assert.equal(s.inventory['0:soboro'].count,7);assert.equal(s.tasks[0].status,'Completed');
 await page.getByRole('button',{name:'Confirm Store Receipt',exact:true}).click();s=await saved();assert.equal(s.inventory['0:soboro'].count,quantity);assert.equal(s.tasks[0].status,'Received by Store');
 await page.screenshot({path:'docs/screenshots/kitchen-desktop.png',fullPage:true});await page.reload();assert.equal((await saved()).tasks[0].status,'Received by Store');
 await page.goto('http://localhost:5173/#/assistant?product=soboro&store=0');await page.getByLabel('Date',{exact:true}).fill('2026-11-21');await page.getByLabel('Arrival · KST').fill('11:05');await page.getByLabel('Your bakery question').fill('Is soboro available?');await page.getByRole('button',{name:'Send question'}).click();await page.getByText(new RegExp(`${quantity} estimated unallocated units`)).waitFor();
 const inventory=(await saved()).inventory;await page.getByLabel('Experience').selectOption('business');await page.getByLabel('Bakery tenant').selectOption('bakehouse');await page.getByLabel('Confirmed demo count').fill('3');await page.getByRole('button',{name:'Confirm tenant inventory'}).click();assert.equal((await saved()).tenantStock['wanchai:tart'],3);assert.deepEqual((await saved()).inventory,inventory);
 await page.getByLabel('Language').selectOption('zh-Hant');await page.getByText('已確認示範庫存').waitFor();await page.getByLabel('Bakery tenant').selectOption('sungsimdang');await page.getByLabel('Bakery tenant').selectOption('bakehouse');await page.reload();assert.equal((await saved()).tenantStock['wanchai:tart'],3);
 await page.screenshot({path:'docs/screenshots/business-desktop.png',fullPage:true});
 for(const width of [320,768,1440]){await page.setViewportSize({width,height:900});for(const route of ['','find','operations','business','passport']){await page.goto(`http://localhost:5173/#/${route}`);await page.locator('main h1').waitFor();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`Overflow at ${width}px: ${route}`);}}
 assert.deepEqual(errors,[]);console.log('PASS redesign: Saturday surge, scan, approval, production timing, completion/receipt isolation, assistant consistency, persistence, tenant isolation, Traditional Chinese, 320/768/1440px layouts; no page errors.');
} finally {await browser.close()}
