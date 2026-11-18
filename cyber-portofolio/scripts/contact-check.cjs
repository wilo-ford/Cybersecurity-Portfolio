const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {spawn}=require('node:child_process');
const fs=require('node:fs'),assert=require('node:assert/strict');
let server,browser;
(async()=>{
  let target=process.env.PORTFOLIO_URL;
  if(!target){target='http://127.0.0.1:4177/';server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4177','--strictPort'],{stdio:'pipe',windowsHide:true});await new Promise((resolve,reject)=>{let output='';server.stdout.on('data',d=>{output+=d;if(String(d).includes('Local:'))resolve();});server.stderr.on('data',d=>output+=d);server.on('error',reject);server.on('exit',c=>{if(c)reject(new Error(output));});setTimeout(()=>reject(new Error('Preview timeout: '+output)),60000).unref();});}
  browser=await chromium.launch({executablePath:process.env.EDGE_EXECUTABLE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[],externalRequests=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(/https:\/\/(?:wa\.me|(?:www\.|web\.)?whatsapp\.com)\//.test(r.url()))externalRequests.push(r.url());});
  // Capture the intended handoff locally. Never contact WhatsApp or send a message.
  await page.addInitScript(()=>{window.__contactOpens=[];window.open=(url,target,features)=>{window.__contactOpens.push({url,target,features});return null;};});
  await page.goto(target+'#contact',{waitUntil:'networkidle'});
  assert.equal(await page.locator('.contact-email').getAttribute('href'),'mailto:awalabgr@gmail.com');
  assert.equal(await page.locator('.contact-phone').getAttribute('href'),'tel:+2290167544610');
  assert.equal(await page.locator('.contact-whatsapp').getAttribute('href'),'https://wa.me/2290167544610');
  assert.equal(await page.locator('.contact-methods .contact-method').count(),3);
  const submit=page.getByRole('button',{name:'Continuer sur WhatsApp',exact:true});
  await submit.click();assert.equal(await page.evaluate(()=>window.__contactOpens.length),0,'Empty message is blocked');
  await page.getByLabel('Votre message',{exact:true}).fill('   ');await submit.click();
  assert.equal(await page.evaluate(()=>window.__contactOpens.length),0,'Whitespace is blocked');
  assert.equal(await page.locator('#contact-message').evaluate(e=>e.validity.valid),false);
  const visitor='Camille & Associés',message='Bonjour Mohamed, un audit & un stage ? + conseils éthiques.\nMerci !';
  await page.getByLabel('Votre nom',{exact:false}).fill(visitor);
  await page.getByLabel('Sujet',{exact:true}).selectOption('Mission freelance');
  await page.getByLabel('Votre message',{exact:true}).fill(message);await submit.click();
  const opens=await page.evaluate(()=>window.__contactOpens);assert.equal(opens.length,1);
  const url=new URL(opens[0].url),text=url.searchParams.get('text');
  assert.equal(url.origin,'https://wa.me');assert.equal(url.pathname,'/2290167544610');
  assert.ok(text.includes(visitor)&&text.includes(message)&&text.includes('Mission freelance'),'Text survives URL encoding');
  assert.equal(opens[0].target,'_blank');assert.match(opens[0].features,/noopener/);
  assert.equal(await page.locator('.whatsapp-ready a').getAttribute('href'),opens[0].url,'Fallback opens the same prepared message');
  await page.getByLabel('Votre nom',{exact:false}).fill('Camille');assert.equal(await page.locator('.whatsapp-ready').count(),0,'Editing the form clears a stale prepared message');
  assert.deepEqual(externalRequests,[],'No WhatsApp request or message is sent during verification');
  // Save clean screenshots without visitor test text.
  await page.reload({waitUntil:'networkidle'});await page.addStyleTag({content:'.site-header,.skip-link{visibility:hidden!important}'});await page.locator('#contact').scrollIntoViewIfNeeded();
  fs.mkdirSync('test-results',{recursive:true});await page.locator('#contact').screenshot({path:'test-results/contact-desktop.png'});
  for(const width of [320,390,768,1024,1280,1440]){await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'No horizontal overflow at '+width);if(width===390)await page.locator('#contact').screenshot({path:'test-results/contact-mobile.png'});}
  assert.deepEqual(errors,[]);
  const report={target,passed:true,email:'awalabgr@gmail.com',phone:'+2290167544610',whatsapp:'2290167544610',labelledContactCards:3,emptyAndWhitespaceRejected:true,unicodeAndSpecialCharactersPreserved:true,correctWhatsAppDestination:true,popupHandoffIntercepted:true,fallbackLinkMatches:true,noMessageSent:true,viewports:[320,390,768,1024,1280,1440],errors};
  fs.writeFileSync('test-results/contact-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
  await browser.close();server?.kill();
})().catch(async e=>{server?.kill();console.error(e);await browser?.close().catch(()=>{});process.exit(1);});
