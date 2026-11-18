// Optional asset regeneration: Playwright + an installed Edge/Chromium browser.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {readFileSync}=require('node:fs');
(async()=>{
  const browser=await chromium.launch({executablePath:process.env.EDGE_EXECUTABLE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
  try {
    const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
    const image=readFileSync('public/bureau-nocturne.webp').toString('base64');
    await page.setContent(`<html lang="fr"><style>*{box-sizing:border-box}body{margin:0;background:#030b14;color:#edf7ff;font-family:'Segoe UI',Arial,sans-serif;width:1200px;height:630px;overflow:hidden}.room{position:absolute;right:-250px;top:0;width:1200px;height:676px;background:url(data:image/webp;base64,${image}) center/cover}.shade{position:absolute;inset:0;background:linear-gradient(90deg,#030b14 0%,#030b14f5 36%,#030b14a0 60%,#030b1420 100%)}main{position:relative;padding:58px 65px;width:760px}.logo{font-weight:900;font-style:italic;font-size:44px;color:#bfefff;letter-spacing:-4px}.logo b{color:#00d5f4}small{display:block;color:#a8d3e5;letter-spacing:2px;font-size:15px;margin-top:40px}h1{font-size:65px;line-height:1.05;letter-spacing:-2px;margin:18px 0}h1 span{color:#2bdcf1;font-style:italic}p{font-size:23px;color:#c7dbe6;margin-top:22px}.line{width:70px;height:3px;background:#00d5f4;margin-top:30px}footer{font-size:18px;color:#b1d1e2;margin-top:23px}</style><body><div class="room"></div><div class="shade"></div><main><div class="logo">MA<b>.</b></div><small>ÉTUDIANT EN CYBERSÉCURITÉ · COTONOU</small><h1>Mohamed<br><span>ABOGOURIN</span></h1><p>Linux · Réseaux · Sécurité web</p><div class="line"></div><footer>Recherche de stage · janvier 2027</footer></main></body></html>`);
    await page.screenshot({path:'public/partage-portfolio.png'});
    console.log('Image de partage créée : 1200 × 630.');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
