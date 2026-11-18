// Small repeatable lab sample; no Lighthouse score or field-CWV claim.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
  const browser=await chromium.launch({executablePath:process.env.EDGE_EXECUTABLE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
  try{
    const target=process.env.PORTFOLIO_URL||'https://mohamed-abogourin-portfolio.awalabgr.workers.dev/';const runs=[];
    for(let i=0;i<3;i++){
      const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});const page=await context.newPage(),cdp=await context.newCDPSession(page);let bytes=0;const requests=[],errors=[];
      page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750});cdp.on('Network.loadingFinished',r=>bytes+=r.encodedDataLength);
      await page.addInitScript(()=>{window.lab={lcp:0,cls:0};new PerformanceObserver(list=>{for(const e of list.getEntries())window.lab.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.lab.cls+=e.value;}).observe({type:'layout-shift',buffered:true});});
      await page.goto(target,{waitUntil:'networkidle'});await page.waitForTimeout(1000);const metrics=await page.evaluate(()=>({...window.lab,height:document.documentElement.scrollHeight,paints:performance.getEntriesByType('paint').map(e=>({name:e.name,time:e.startTime}))}));assert.equal(requests.some(url=>/\/three-/.test(url)),false);assert.deepEqual(errors,[]);runs.push({metrics,transferredBytes:bytes,errors});await context.close();
    }
    const page=await browser.newPage();const paths=[];for(const path of ['robots.txt','sitemap.xml','page-inexistante-verification']){const response=await page.request.get(target+path);paths.push({path,status:response.status(),type:response.headers()['content-type']});assert.equal(response.status(),path.startsWith('page-inexistante')?404:200);}const report={target,checkedAt:new Date().toISOString(),conditions:{viewport:'390x844',cpuSlowdown:4,downloadMbit:1.6,addedLatencyMs:150,cache:'disabled',sampleSize:3},runs,paths,fieldData:false,inpMeasured:false,passed:true};fs.writeFileSync('test-results/performance-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
