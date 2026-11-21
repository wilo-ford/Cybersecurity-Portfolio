import { cp, readFile, writeFile, rm } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const preview=resolve(root,'dist-preview');
if(dirname(preview)!==resolve(root))throw new Error('Unexpected preview output directory');
// Only this checked, generated sibling of dist/ can be replaced.
await rm(preview,{recursive:true,force:true});
await cp(resolve(root,'dist'), preview, { recursive:true });
const headers=(await readFile(resolve(root,'dist/_headers'),'utf8')).replaceAll('\r\n','\n');
await writeFile(resolve(preview,'_headers'),headers.replace('/*\n','/*\n  X-Robots-Tag: noindex, nofollow\n'));
await writeFile(resolve(preview,'robots.txt'),'User-agent: *\nDisallow: /\n');
console.log('Prévisualisation isolée préparée dans dist-preview/ (noindex).');
