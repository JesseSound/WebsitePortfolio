import {cp,mkdir} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
await mkdir(new URL('site-dist/',root),{recursive:true});
await cp(new URL('portfolio/',root),new URL('site-dist/',root),{recursive:true});
console.log('Built portfolio in site-dist; original files and dist are untouched.');
