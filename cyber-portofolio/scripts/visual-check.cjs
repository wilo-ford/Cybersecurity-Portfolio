const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.EDGE_EXECUTABLE?{executablePath:process.env.EDGE_EXECUTABLE}:{}),args:['--disable-dev-shm-usage']});
 try {
  fs.mkdirSync('screenshots',{recursive:true});
  for(const [width,height] of [[1536,864],[1440,900],[390,844]]){
   const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});const errors=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
   await page.goto(process.env.PORTFOLIO_URL||'http://127.0.0.1:4173/',{waitUntil:'networkidle'});
   await page.waitForTimeout(2200);await page.evaluate(()=>document.fonts.ready);
   const pause=page.getByRole('button',{name:'Pause',exact:true});if(await pause.count())await pause.click();
   await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(250);
   await page.screenshot({path:`screenshots/accueil-${width}x${height}.png`});
   console.log(JSON.stringify({viewport:[width,height],errors,metrics:await page.evaluate(()=>({width:document.documentElement.scrollWidth,hero:document.querySelector('.v2-hero').getBoundingClientRect().height,canvas:document.querySelector('canvas')?.getBoundingClientRect().toJSON(),ready:document.querySelector('.v2-webgl')?.dataset.ready,progress:document.querySelector('.v2-webgl')?.dataset.progress}))}));
   if(width===1536){await page.locator('.v2-crystal-button').click();await page.waitForTimeout(1900);console.log('Open crystal:',await page.locator('.v2-webgl').getAttribute('data-progress'));await page.screenshot({path:'screenshots/cristal-ouvert-1536x864.png'});await page.locator('.v2-crystal-button').click();await page.waitForTimeout(1900);}
   await page.evaluate(async()=>{for(const el of document.querySelectorAll('main section')){el.scrollIntoView({behavior:'instant'});await new Promise(r=>setTimeout(r,160));}scrollTo({top:0,behavior:'instant'});});await page.waitForTimeout(350);
   await page.screenshot({path:`screenshots/page-${width}.png`,fullPage:true});
   await page.close();
  }
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
