const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {spawn}=require('node:child_process');
const fs=require('node:fs'),assert=require('node:assert/strict');
let browser,server;
(async()=>{
  let target=process.env.PORTFOLIO_URL;
  if(!target){target='http://127.0.0.1:4180/';server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4180','--strictPort'],{stdio:'pipe',windowsHide:true});await new Promise((resolve,reject)=>{server.stdout.on('data',d=>{if(String(d).includes('Local:'))resolve();});server.on('error',reject);setTimeout(()=>reject(Error('Preview timeout')),30000).unref();});}
  browser=await chromium.launch({executablePath:process.env.EDGE_EXECUTABLE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
  const errors=[],consoleErrors=[];
  const context=await browser.newContext({viewport:{width:390,height:844}});
  const page=await context.newPage(),requests=[];page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.stack));page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
  await page.goto(target,{waitUntil:'networkidle'});await page.waitForTimeout(1800);
  assert.equal(requests.some(url=>/\/three-/.test(url)),false,'Mobile does not download Three.js by default');
  assert.equal(await page.locator('.globe-lite').count(),1);
  assert.match(await page.locator('.hero-availability').innerText(),/Recherche de stage[\s\S]*janvier 2027/);
  assert.equal(await page.locator('.featured-projects .project').count(),3);
  assert.equal(await page.locator('.more-projects').getAttribute('open'),null);
  for(const width of [320,390,768,1024,1280,1440]){
    await page.setViewportSize({width,height:900});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'No horizontal overflow '+width);
    const button=page.getByRole('button',{name:'Découvrir OverTheWire Bandit',exact:true});await button.click();await page.locator('dialog[open]').waitFor();
    assert.equal(await page.getByRole('button',{name:'Fermer le projet',exact:true}).evaluate(e=>e===document.activeElement),true);
    await page.keyboard.press('Escape');await page.waitForTimeout(100);assert.equal(await button.evaluate(e=>e===document.activeElement),true,'Focus returns '+width);
  }
  // Exercise the previous SVG/unmount race repeatedly, without sending messages.
  await page.evaluate(()=>scrollTo(0,0));
  for(let i=0;i<4;i++){await page.getByRole('button',{name:'Activer le globe 3D',exact:true}).click();await page.locator('canvas').waitFor();await page.getByRole('button',{name:'Passer en mode léger',exact:true}).click();await page.locator('.globe-lite').waitFor();}
  const globePath=page.locator('.globe-lite > path').first(),before=await globePath.getAttribute('d');await page.waitForTimeout(1200);assert.notEqual(await globePath.getAttribute('d'),before);
  await page.getByRole('button',{name:'Pause',exact:true}).click();
  const stopped=await globePath.getAttribute('d');await page.waitForTimeout(500);assert.equal(await globePath.getAttribute('d'),stopped);
  await page.getByRole('button',{name:'Animer',exact:true}).click();
  await page.locator('.more-projects summary').click();await page.getByRole('button',{name:'Découvrir SahelSound Records',exact:true}).click();
  assert.equal(await page.locator('dialog').getByRole('heading',{name:'Ma contribution',exact:true}).count(),0);
  assert.match(await page.locator('dialog .evidence-note').innerText(),/Aucun livrable technique public/);await page.keyboard.press('Escape');
  const ids=['bandit','monitoring','docker','web','pentest-lab','windows-server','sahelsound'];
  for(const id of ids){await page.goto(target+'projets/'+id+'/',{waitUntil:'networkidle'});assert.equal(await page.locator('.case-study h1').count(),1);assert.match(await page.locator('link[rel=canonical]').getAttribute('href'),new RegExp('/projets/'+id+'/$'));}
  const noJs=await browser.newContext({javaScriptEnabled:false});const staticPage=await noJs.newPage();await staticPage.goto(target);assert.equal(await staticPage.locator('main section[id]').count(),6);await staticPage.locator('.more-projects summary').click();assert.equal(await staticPage.locator('.project-page-link').count(),7);await staticPage.goto(target+'projets/bandit/');assert.match(await staticPage.locator('main').innerText(),/Difficulté rencontrée/i);await noJs.close();
  await page.goto(target,{waitUntil:'networkidle'});await page.getByRole('button',{name:'Pause',exact:true}).click();
  fs.mkdirSync('test-results',{recursive:true});for(const width of [390,1280,1440]){await page.setViewportSize({width,height:width===390?844:900});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`test-results/improved-${width}.png`,fullPage:width!==1280});}
  assert.deepEqual(errors,[]);assert.deepEqual(consoleErrors,[]);
  const report={target,passed:true,mobileSkipsThree:true,stageVisible:true,threeFeaturedProjects:true,otherPracticesCollapsed:true,viewports:[320,390,768,1024,1280,1440],focusRestored:true,rapidRendererSwitches:4,liteRotation:true,pause:true,sevenShareablePages:true,htmlWithoutJavaScript:true,unknownContributionNotInvented:true,errors,consoleErrors};fs.writeFileSync('test-results/improvements-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
  await browser.close();server?.kill();
})().catch(async e=>{console.error(e);server?.kill();await browser?.close().catch(()=>{});process.exit(1)});
