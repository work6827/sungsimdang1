import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5173/#/explore');
 await page.locator('.travel-card').first().waitFor();
 await page.locator('img').evaluateAll(imgs=>imgs.forEach(i=>i.loading='eager'));
 await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0));
 assert.equal(await page.locator('.travel-card').count(),6);
 assert.equal(new Set(await page.locator('.travel-card img').evaluateAll(imgs=>imgs.map(i=>i.src))).size,6);
 await page.getByRole('button',{name:'Nature',exact:true}).click();assert.equal(await page.locator('.travel-card').count(),2);
 await page.getByRole('button',{name:'All places',exact:true}).click();
 await page.getByRole('button',{name:'Explore place',exact:true}).first().click();await page.locator('dialog[open]').waitFor();assert.ok(await page.getByRole('link',{name:'Official visitor guide'}).getAttribute('href'));
 await page.getByRole('button',{name:'Save to my trip',exact:true}).click();await page.keyboard.press('Escape');
 await page.reload();await page.locator('.travel-card').first().waitFor();assert.equal(await page.locator('.travel-saved li').count(),1);
 await page.getByRole('button',{name:/Gardens to golden hour/}).click();await page.getByRole('button',{name:/Add these places/}).click();assert.equal(await page.locator('.travel-saved li').count(),3);
 await page.getByRole('button',{name:'Remove Expo Bridge & Plaza from trip',exact:true}).click();assert.equal(await page.locator('.travel-saved li').count(),2);
 await page.getByRole('button',{name:'Clear my shortlist'}).click();assert.equal(await page.locator('.travel-saved li').count(),0);
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of [1440,768,390,320]){
 await page.setViewportSize({width,height:950});await page.locator('img').evaluateAll(imgs=>imgs.forEach(i=>i.loading='eager'));
 await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=650){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,50))}window.scrollTo(0,0)});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`overflow at ${width}`);
 if(width===1440||width===390)await page.screenshot({path:`docs/screenshots/explore-${width}.png`,fullPage:true});
 }
 assert.deepEqual(errors,[]);console.log('PASS: six unique loaded photos; filters; details; persistent saves; itinerary merge; removal; clear; 320–1440px layouts; no browser errors.');
}finally{await browser.close()}
