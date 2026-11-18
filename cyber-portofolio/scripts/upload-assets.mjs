// A one-time upload session comes from the authenticated Cloudflare connector.
// Credentials are accepted through stdin only; no token is written to disk.
import { getAssets } from './asset-manifest.mjs';
import readline from 'node:readline';
if(process.stdin.isTTY)process.stdin.setRawMode(true);
const rl=readline.createInterface({input:process.stdin,terminal:false});
console.log('Ready for upload session on stdin.');
for await(const line of rl) {
  try {
    const {accountId,jwt,buckets}=JSON.parse(line), assets=await getAssets();
    let completion=jwt;
    for(const bucket of buckets){
      const form=new FormData();
      for(const hash of bucket){const file=assets.find(a=>a.hash===hash);if(!file)throw new Error('Missing asset '+hash);const ext=file.path.split('.').pop();const type=({js:'application/javascript',css:'text/css',html:'text/html',svg:'image/svg+xml',webp:'image/webp',jpg:'image/jpeg',png:'image/png',pdf:'application/pdf',txt:'text/plain',xml:'application/xml'})[ext]||'application/octet-stream';form.append(hash,new Blob([file.base64],{type}),file.path.split('/').pop());}
      const r=await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/assets/upload?base64=true`,{method:'POST',headers:{Authorization:'Bearer '+jwt},body:form});
      const result=await r.json();if(!r.ok||!result.success)throw new Error(JSON.stringify(result.errors));if(result.result?.jwt)completion=result.result.jwt;
    }
    // The caller retains the completion token in memory, then publishes metadata.
    console.log(JSON.stringify({jwt:completion,files:assets.length}));
    rl.close();break;
  }catch(e){console.error(e.message);process.exitCode=1;rl.close();break;}
}
