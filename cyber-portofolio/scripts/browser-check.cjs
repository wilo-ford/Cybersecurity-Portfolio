// Optional browser QA: install Playwright or set PLAYWRIGHT_MODULE to its package.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { spawn } = require('node:child_process');
let server;
(async () => {
  if(!process.env.PORTFOLIO_URL){
    server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4174','--strictPort'],{stdio:'pipe',windowsHide:true});
    await new Promise((resolve,reject)=>{let output='';server.stdout.on('data',d=>{output+=String(d);if(String(d).includes('Local:'))resolve();});server.stderr.on('data',d=>output+=String(d));server.on('error',reject);server.on('exit',code=>{if(code)reject(new Error(output));});setTimeout(()=>reject(new Error('Preview start timeout: '+output)),60000).unref();});
  }
  const browser = await chromium.launch({ executablePath: process.env.EDGE_EXECUTABLE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  const page = await browser.newPage({ viewport: {width:1440,height:1000},deviceScaleFactor:1 });
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const consoleErrors=[];page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
  const failed=[];page.on('requestfailed',r=>failed.push(r.url()));
  const target=process.env.PORTFOLIO_URL || 'http://127.0.0.1:4174/';
  await page.goto(target,{waitUntil:'networkidle'});
  await page.evaluate(()=>{localStorage.setItem('ma-render-quality','full');localStorage.removeItem('ma-motion');});
  await page.reload({waitUntil:'networkidle'});
  await page.waitForSelector('canvas');
  await page.waitForTimeout(1500);
  fs.mkdirSync('test-results',{recursive:true});
  await page.screenshot({path:'test-results/desktop.png',fullPage:true});
  await page.setViewportSize({width:1280,height:721});
  await page.locator('#accueil').screenshot({path:'test-results/hero-reference.png'});
  assert.match(await page.locator('.terminal-plane').innerText(),/kali/);
  await page.setViewportSize({width:1440,height:1000});
  assert.equal(await page.locator('main section[id]').count(),6);
  assert.equal(await page.locator('.skills-grid .skill').count(),6);
  assert.equal(await page.locator('.projects-grid .project').count(),7);
  assert.equal(await page.locator('canvas').count(),1);
  await page.getByRole('button',{name:'Pause',exact:true}).click();
  await page.getByRole('button',{name:'Animer',exact:true}).waitFor();
  await page.getByRole('button',{name:'Découvrir OverTheWire Bandit',exact:true}).click();
  await page.locator('dialog[open]').waitFor();
  assert.match(await page.locator('dialog').innerText(),/Parcours personnel/);
  for(const heading of ['Objectif','Actions réalisées','Résultat','Documentation technique'])assert.equal(await page.locator('dialog').getByRole('heading',{name:heading,exact:true}).count(),1);
  assert.equal(await page.locator('dialog .practice-evidence-links a').count(),4);
  await page.locator('dialog .practice-evidence').scrollIntoViewIfNeeded();
  await page.locator('dialog').screenshot({path:'test-results/practice-bandit.png'});
  await page.keyboard.press('Escape');assert.equal(await page.locator('dialog[open]').count(),0);
  await page.locator('.more-projects summary').click();
  await page.getByRole('button',{name:'Découvrir SahelSound Records',exact:true}).click();
  await page.locator('dialog[open]').waitFor();
  assert.equal(await page.locator('dialog .dialog-role').textContent(),'Projet de groupe');
  assert.equal(await page.locator('dialog .practice-evidence-links a').getAttribute('href'),'/cv-mohamed-abogourin.pdf');
  assert.equal(await page.locator('dialog').getByRole('heading',{name:'Ma contribution',exact:true}).count(),0,'Unknown individual contribution stays unpublished');
  await page.locator('dialog').screenshot({path:'test-results/practice-sahelsound.png'});
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Passer en mode léger',exact:true}).click();
  await page.waitForSelector('.globe-static');assert.equal(await page.locator('canvas').count(),0);
  await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('canvas').count(),0);
  await page.screenshot({path:'test-results/lite.png',fullPage:true});
  await page.locator('.more-projects summary').click();
  const captureStyle=await page.addStyleTag({content:'.site-header,.skip-link{visibility:hidden!important}'});
  await page.locator('#competences').screenshot({path:'test-results/skills-desktop.png'});
  await page.locator('.project').filter({has:page.getByRole('heading',{name:'SahelSound Records',exact:true})}).screenshot({path:'test-results/project-sahelsound.png'});
  const viewports=[{width:390,height:844},{width:320,height:740},{width:768,height:1024},{width:1024,height:768}];
  for(const size of viewports){
    await page.setViewportSize(size);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
    if(overflow)console.log('OVERFLOW',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+1||r.left<-1);}).map(e=>({tag:e.tagName,cls:e.className,left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right})).slice(0,30))));
    assert.equal(overflow,false,`horizontal overflow at ${size.width}`);
    if(size.width===390){
      await page.locator('#competences').screenshot({path:'test-results/skills-mobile.png'});
      await captureStyle.evaluate(node=>node.remove());
      await page.getByRole('button',{name:'Ouvrir le menu',exact:true}).click();
      await page.getByRole('navigation').getByRole('link',{name:'Contact',exact:true}).click();
      assert.equal(await page.getByRole('button',{name:'Ouvrir le menu',exact:true}).getAttribute('aria-expanded'),'false');
      assert.match(await page.locator('.contact-email').getAttribute('href'),/^mailto:/);
      await page.evaluate(()=>scrollTo(0,0));
      await page.screenshot({path:'test-results/mobile.png',fullPage:true});
    }
  }
  const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await reduced.goto(target,{waitUntil:'networkidle'});
  assert.equal(await reduced.locator('html').getAttribute('data-motion'),'paused');
  await reduced.getByRole('button',{name:'Animer',exact:true}).waitFor();
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);assert.deepEqual(consoleErrors,[]);
  const report={target,passed:true,viewports:[1440,1280,390,320,768,1024],sections:6,skillCategories:6,projects:7,structuredPracticeDetails:true,banditEvidenceLinks:4,sahelsoundGroupRole:true,unknownContributionHidden:true,webgl:true,projectedTerminal:true,modal:true,litePersistence:true,reducedMotion:true,errors,consoleErrors,failed};
  fs.writeFileSync('test-results/browser-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
  await browser.close();
  server?.kill();
})().catch(e=>{server?.kill();console.error(e);process.exit(1);});
