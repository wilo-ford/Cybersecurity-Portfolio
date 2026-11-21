import { getAssets } from './asset-manifest.mjs';
import { createHash } from 'node:crypto';
import { writeFile, mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
const origin=process.argv[2] || 'https://mohamed-abogourin-portfolio.awalabgr.workers.dev';
const checks=[];
for(const file of await getAssets(process.argv[3]||'dist')){
  const url=origin+(file.path==='/index.html'?'/':file.path);
  const r=await fetch(url);assert.equal(r.status,200,url);
  const bytes=Buffer.from(await r.arrayBuffer());
  assert.equal(createHash('sha256').update(bytes).digest('hex').slice(0,32),file.hash,`Content mismatch: ${url}`);
  assert.equal(r.headers.get('x-content-type-options'),'nosniff');
  if(file.path.endsWith('.webp'))assert.match(r.headers.get('content-type'),/^image\/webp/);
  if(file.path.endsWith('.pdf')){assert.match(r.headers.get('content-type'),/^application\/pdf/);assert.match(r.headers.get('content-disposition'),/attachment/);}
  assert.ok(r.headers.get('content-security-policy')?.includes("default-src 'self'"));
  if(file.path.startsWith('/assets/')) assert.match(r.headers.get('cache-control'),/immutable/);
  checks.push({path:file.path,status:r.status,bytes:bytes.length,verifiedHash:file.hash,contentType:r.headers.get('content-type')});
}
const report={origin,checkedAt:new Date().toISOString(),passed:true,checks};
await mkdir('test-results',{recursive:true});await writeFile('test-results/deployment-report.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
