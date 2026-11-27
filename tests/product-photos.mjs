import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}});page.setDefaultTimeout(15000);
 await page.goto('http://127.0.0.1:5173/?preview=individual-product-photos#/find');
 await page.locator('.product-card').first().waitFor();
 await page.locator('img').evaluateAll(images=>images.forEach(i=>i.loading='eager'));
 await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0));
 const sources=await page.locator('.product-card img').evaluateAll(images=>images.map(i=>i.src));
 assert.equal(sources.length,12);assert.equal(new Set(sources).size,12);
 await page.getByRole('button',{name:'View Mango Siru Cake details'}).click();
 assert.equal(await page.locator('dialog img').getAttribute('src'),'/assets/photos/products/mango.webp');
 await page.keyboard.press('Escape');await page.screenshot({path:'docs/screenshots/unique-product-photos-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'docs/screenshots/unique-product-photos-mobile.png',fullPage:true});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
 console.log('PASS: 12 products, 12 unique loaded photo sources, matching detail image, no mobile overflow.');
} finally {await browser.close()}
