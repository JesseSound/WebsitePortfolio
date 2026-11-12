import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
const root=path.resolve(fileURLToPath(new URL('../site-dist/',import.meta.url)));
const feed=fileURLToPath(new URL('../portfolio/data/social.json',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.glb':'model/gltf-binary','.pdf':'application/pdf'};
let refreshing=false;
function refresh(){if(refreshing)return;refreshing=true;const proc=spawn(process.execPath,[fileURLToPath(new URL('./sync-social.mjs',import.meta.url))],{stdio:'inherit'});proc.on('error',()=>{refreshing=false});proc.on('exit',()=>{refreshing=false});}
http.createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(pathname==='/healthz'){res.writeHead(200).end('OK');return}let file=path.resolve(root,'.'+pathname);if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return}if(pathname==='/data/social.json')file=feed;else if((await stat(file)).isDirectory())file=path.join(file,'index.html');const body=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':pathname==='/data/social.json'?'no-store':'public, max-age=300'}).end(body)}catch{res.writeHead(404).end('Not found')}}).listen(Number(process.env.PORT)||4174,'0.0.0.0',()=>{console.log('Portfolio server ready');if(process.env.SOCIAL_REFRESH_ENABLED==='true'){refresh();setInterval(refresh,60*60*1000).unref()}});
