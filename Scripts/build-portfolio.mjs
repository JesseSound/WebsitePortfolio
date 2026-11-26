import {cp,mkdir,readFile,writeFile,rm} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
await mkdir(new URL('site-dist/',root),{recursive:true});
await cp(new URL('portfolio/',root),new URL('site-dist/',root),{recursive:true,filter:source=>!String(source).replaceAll('\\','/').toLowerCase().endsWith('/resume.pdf')});
// Preserve the original archive on disk, but do not publish the résumé.
await rm(new URL('site-dist/legacy/resume.pdf',root),{force:true});
const about=new URL('site-dist/legacy/AboutMe.html',root);
await writeFile(about,(await readFile(about,'utf8')).replace(/<p>If you'd like,[\s\S]*?<\/p>/,''));
// Publish both historical short URLs. Render's Linux filesystem is case-sensitive.
// On Windows these directories resolve to the same location, which is harmless.
const calendar=await readFile(new URL('portfolio/legacy/Calendar.html',root),'utf8');
for(const route of ['calendar','Calendar']){
 await mkdir(new URL(`site-dist/${route}/`,root),{recursive:true});
 await writeFile(new URL(`site-dist/${route}/index.html`,root),calendar);
}
await writeFile(new URL('site-dist/Calendar.html',root),calendar);
console.log('Built portfolio in site-dist; original files and dist are untouched.');
