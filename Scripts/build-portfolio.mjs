import {cp,mkdir,readFile,writeFile,rm} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
await mkdir(new URL('site-dist/',root),{recursive:true});
await cp(new URL('portfolio/',root),new URL('site-dist/',root),{recursive:true,filter:source=>!String(source).replaceAll('\\','/').toLowerCase().endsWith('/resume.pdf')});
// Preserve the original archive on disk, but do not publish the résumé.
await rm(new URL('site-dist/legacy/resume.pdf',root),{force:true});
const about=new URL('site-dist/legacy/AboutMe.html',root);
await writeFile(about,(await readFile(about,'utf8')).replace(/<p>If you'd like,[\s\S]*?<\/p>/,''));
console.log('Built portfolio in site-dist; original files and dist are untouched.');
