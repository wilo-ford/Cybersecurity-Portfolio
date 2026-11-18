import { readdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
export async function getAssets(root='dist',prefix='') {
  const assets=[];
  for(const entry of await readdir(path.join(root,prefix),{withFileTypes:true})){
    const relative=path.posix.join(prefix,entry.name);
    if(entry.isDirectory()) assets.push(...await getAssets(root,relative));
    else if(!entry.name.startsWith('_')) {
      const content=await readFile(path.join(root,relative));
      assets.push({path:'/'+relative,hash:createHash('sha256').update(content).digest('hex').slice(0,32),size:content.length,base64:content.toString('base64')});
    }
  }
  return assets;
}
if(process.argv.includes('--json')) console.log(JSON.stringify(await getAssets()));
if(process.argv.includes('--manifest-json')) console.log(JSON.stringify((await getAssets()).map(({path,hash,size})=>({path,hash,size}))));
