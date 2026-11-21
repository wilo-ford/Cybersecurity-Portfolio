import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { projects } from '../src/content.js';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/tmp/v2-playwright/node_modules/playwright');
const base=(process.env.PORTFOLIO_URL||'http://127.0.0.1:4173/').replace(/\/?$/,'/');
const browser=await chromium.launch({headless:true,...(process.env.EDGE_EXECUTABLE?{executablePath:process.env.EDGE_EXECUTABLE}:{}),args:['--disable-dev-shm-usage','--enable-unsafe-swiftshader']});
const report={base,checkedAt:new Date().toISOString(),checks:[],errors:[]};
const pass=name=>report.checks.push(name);
try {
 await mkdir('test-results',{recursive:true});await mkdir('screenshots',{recursive:true});
 for(const [width,height] of [[1536,864],[1440,900],[390,844]]){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});const requests=[];
  page.on('pageerror',e=>report.errors.push(e.message));page.on('request',r=>requests.push(r.url()));
  await page.goto(base,{waitUntil:'networkidle'});
  await writeFile('test-results/accessibility-'+width+'.yml',await page.locator('body').ariaSnapshot());assert.equal(await page.locator('h1').count(),1);assert.match(await page.locator('h1').innerText(),/Mohamed\s+ABOGOURIN/);
  for(const id of ['accueil','a-propos','competences','projets','parcours','blog','contact'])assert.equal(await page.locator('#'+id).count(),1);
  assert.equal(await page.locator('.v2-skill-tile').count(),10);assert.equal(await page.locator('.v2-domain-motion').count(),3);
  for(const anchor of await page.locator('a[href^="#"]').all()){const id=(await anchor.getAttribute('href')).slice(1);assert.equal(await page.locator(`[id="${id}"]`).count(),1,'Anchor target '+id);}
  const crystal=page.locator('.v2-crystal-button');await crystal.focus();await page.keyboard.press('Enter');assert.equal(await crystal.getAttribute('aria-expanded'),'true');
  assert.match(await page.locator('#crystal-status').innerText(),/Réseau révélé/);await page.keyboard.press('Space');assert.equal(await crystal.getAttribute('aria-expanded'),'false');
  assert.equal(await page.evaluate(()=>document.documentElement.dataset.motion),'paused');
  if(width===390){assert.ok(!requests.some(url=>/\/three-/.test(url)),'Mobile does not load Three');assert.equal(await page.locator('canvas').count(),0);await page.getByRole('button',{name:'Ouvrir le menu',exact:true}).click();await page.locator('#mobile-nav').getByRole('link',{name:'Projets',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Ouvrir le menu',exact:true}).getAttribute('aria-expanded'),'false');}
  for(const w of width===390?[320,390,768,1024,1280]:[width]){await page.setViewportSize({width:w,height});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'No overflow at '+w);}
  await page.setViewportSize({width,height});
  const project=page.getByRole('button',{name:'Découvrir OverTheWire Bandit',exact:true});await project.click();await page.locator('dialog[open]').waitFor();assert.equal(await page.getByRole('button',{name:'Fermer le projet',exact:true}).evaluate(el=>el===document.activeElement),true);await page.keyboard.press('Escape');await page.waitForFunction(()=>document.activeElement?.getAttribute('aria-label')==='Découvrir OverTheWire Bandit');assert.equal(await project.evaluate(el=>el===document.activeElement),true);
  const cv=await page.request.get(base+'cv-mohamed-abogourin.pdf');assert.equal(cv.status(),200);assert.ok((await cv.body()).subarray(0,5).toString()==='%PDF-');
  assert.equal(await page.locator('.v2-socials a[aria-label="LinkedIn"]').count(),0);
  await page.close();pass(`Layout, keyboard crystal, sections, modal focus and CV ${width}×${height}`);
 }
 const page=await browser.newPage({viewport:{width:1536,height:864},reducedMotion:'no-preference'});
 page.on('pageerror',e=>report.errors.push(e.message));await page.goto(base,{waitUntil:'networkidle'});await page.locator('.v2-webgl[data-ready=true]').waitFor();
 const webgl=page.locator('.v2-webgl'),frames=()=>webgl.getAttribute('data-frames').then(Number);
 const first=await frames();await page.waitForTimeout(700);assert.ok(await frames()>first+2,'Idle rotation renders');
 await page.getByRole('button',{name:'Pause',exact:true}).click();await page.waitForTimeout(300);const stopped=await frames();await page.waitForTimeout(400);assert.equal(await frames(),stopped,'Paused WebGL stops scheduling frames');
 await page.locator('.v2-crystal-button').click();await page.waitForTimeout(1900);assert.ok(Number(await webgl.getAttribute('data-progress'))>.99,'Facets fully open');assert.ok(await page.locator('canvas').evaluate(c=>{const gl=c.getContext('webgl2')||c.getContext('webgl');const pixels=new Uint8Array(c.width*c.height*4);gl.readPixels(0,0,c.width,c.height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);let opaque=0;for(let i=3;i<pixels.length;i+=4)if(pixels[i]>20)opaque++;return opaque>500;}),'Paused open crystal retains visible pixels');
 await page.locator('.v2-crystal-button').click();await page.waitForTimeout(1900);assert.ok(Number(await webgl.getAttribute('data-progress'))<.01,'Facets fully close');
 await page.getByRole('button',{name:'Animer',exact:true}).click();await page.evaluate(()=>document.querySelector('#contact').scrollIntoView({behavior:'instant'}));await page.waitForTimeout(400);const offscreen=await frames();await page.waitForTimeout(500);assert.equal(await frames(),offscreen,'Offscreen WebGL stops');
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(300);
 for(let i=0;i<3;i++){await page.getByRole('button',{name:'Mode léger',exact:true}).click();assert.equal(await page.locator('canvas').count(),0);await page.getByRole('button',{name:'Mode détaillé',exact:true}).click();await page.locator('.v2-webgl[data-ready=true]').waitFor();}
 pass('Real WebGL idle, reversible facet opening, pause, offscreen suspension and three remounts');
 for(const project of projects){const res=await page.goto(base+`projets/${project.id}/`,{waitUntil:'networkidle'});assert.equal(res.status(),200);assert.equal(await page.locator('.case-study h1').count(),1);assert.ok((await page.locator('main').innerText()).includes(project.name));}
 pass('Seven prerendered project pages');await page.close();
 const noGL=await browser.newPage({viewport:{width:1440,height:900}});
 await noGL.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...rest){return /webgl/.test(type)?null:original.call(this,type,...rest);};});
 await noGL.goto(base,{waitUntil:'networkidle'});await noGL.locator('.v2-render-note').waitFor();assert.equal(await noGL.locator('canvas').count(),0);await noGL.locator('.v2-crystal-button').click();assert.equal(await noGL.locator('.v2-crystal-button').getAttribute('aria-expanded'),'true');await noGL.close();pass('WebGL failure keeps the CSS crystal interactive');
 const noJS=await browser.newContext({javaScriptEnabled:false,viewport:{width:1440,height:900}});const staticPage=await noJS.newPage();await staticPage.goto(base);assert.equal(await staticPage.locator('main section[id]').count(),7);await staticPage.locator('.more-projects summary').click();assert.equal(await staticPage.locator('.project-page-link').count(),7);await staticPage.goto(base+'projets/bandit/');assert.match(await staticPage.locator('main').innerText(),/Difficulté rencontrée/i);await noJS.close();pass('Content and project pages readable without JavaScript');
 assert.deepEqual(report.errors,[]);report.passed=true;console.log(JSON.stringify(report,null,2));
}finally{await writeFile('test-results/v2-browser-report.json',JSON.stringify(report,null,2));await browser.close();}
