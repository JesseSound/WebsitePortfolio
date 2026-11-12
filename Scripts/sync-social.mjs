import {parseChannelPage} from './youtube.mjs';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const target=new URL('../portfolio/data/social.json',import.meta.url);
const old=JSON.parse(await readFile(target,'utf8').catch(()=>'{}'));
const next={...old,checkedAt:new Date().toISOString(),sources:{...old.sources}};
const decode=s=>s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
async function get(url,headers={}){const r=await fetch(url,{headers,signal:AbortSignal.timeout(20000)});if(!r.ok)throw Error(`Source returned ${r.status}`);return r;}
let failed=false;
try{
 const xml=await (await get('https://www.youtube.com/feeds/videos.xml?channel_id=UCbt2hIePC7_0A1Nij4onFuA')).text();
 const items=[...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([,entry])=>{const tag=n=>decode(entry.match(new RegExp(`<${n}[^>]*>([\\s\\S]*?)<\\/${n}>`))?.[1]||''); const id=tag('yt:videoId');return {id,platform:'youtube',title:tag('title'),published:tag('published'),url:`https://www.youtube.com/watch?v=${id}`,image:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`};});
 if(!items.length)throw Error('No video entries returned');
 next.youtube=items.slice(0,9);next.sources.youtube={status:'ready',updatedAt:new Date().toISOString()};
}catch(e){try{const html=await (await get('https://www.youtube.com/@jessesound/videos',{'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36'})).text();next.youtube=parseChannelPage(html);next.sources.youtube={status:'ready',updatedAt:new Date().toISOString()};}catch{next.sources.youtube={...old.sources?.youtube,status:old.youtube?.length?'stale':'unavailable'};console.error('YouTube refresh failed; saved posts retained.');failed=true;}}
if(process.env.INSTAGRAM_ACCESS_TOKEN && process.env.INSTAGRAM_USER_ID){
 try{const url=new URL(`https://graph.instagram.com/${process.env.INSTAGRAM_API_VERSION||'v25.0'}/${encodeURIComponent(process.env.INSTAGRAM_USER_ID)}/media`);url.searchParams.set('fields','id,caption,media_type,media_url,thumbnail_url,permalink,timestamp');url.searchParams.set('limit','9');const body=await (await get(url,{Authorization:`Bearer ${process.env.INSTAGRAM_ACCESS_TOKEN}`})).json();if(!Array.isArray(body.data))throw Error('Invalid Instagram response');next.instagram=body.data.map(p=>({id:p.id,platform:'instagram',title:p.caption?.slice(0,160)||'From Instagram',published:p.timestamp,url:p.permalink,image:p.media_type==='VIDEO'?p.thumbnail_url:p.media_url}));next.sources.instagram={status:'ready',updatedAt:new Date().toISOString()};}
 catch(e){next.sources.instagram={...old.sources?.instagram,status:old.instagram?.length?'stale':'unavailable'};console.error('Instagram:',e.message);failed=true;}
}else next.sources.instagram={status:'not_connected'};
await mkdir(new URL('../portfolio/data/',import.meta.url),{recursive:true});await writeFile(target,JSON.stringify(next,null,2)+'\n');
console.log(`Saved ${next.youtube?.length||0} YouTube posts and ${next.instagram?.length||0} Instagram posts.`);
if(failed)process.exitCode=1;


