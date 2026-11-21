// Generate the social image from the live V2 UI. Start pnpm preview first.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.EDGE_EXECUTABLE?{executablePath:process.env.EDGE_EXECUTABLE}:{})});
 try{
  const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
  await page.addInitScript(()=>localStorage.setItem('ma-motion','paused'));
  await page.goto(process.env.PORTFOLIO_URL||'http://127.0.0.1:4173/',{waitUntil:'networkidle'});
  await page.addStyleTag({content:'.site-header,.v2-reference-strip,.v2-bottom,.v2-scroll-cue{display:none!important}.v2-hero{height:630px;min-height:630px;padding-top:55px}.v2-hero-main,.v2-art,.v2-crystal-button{min-height:390px;height:390px}.v2-copy{padding-top:20px}.v2-domain{min-height:108px}.v2-copy h1 span{font-size:80px}.v2-copy h1 em{font-size:70px}.v2-role{font-size:16px}'});
  await page.waitForTimeout(2200);await page.evaluate(()=>document.fonts.ready);await page.locator('.v2-webgl[data-ready=true]').waitFor();

  await page.screenshot({path:'public/partage-portfolio.png'});
  console.log('V2 social image: public/partage-portfolio.png (1200 × 630)');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
