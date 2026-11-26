function platformIcon(platform){
 const ns='http://www.w3.org/2000/svg';const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.classList.add('social-icon');
 const path=document.createElementNS(ns,'path');path.setAttribute('d',platform==='youtube'?'M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z M10 9l5 3-5 3Z':'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Z M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z M17 7h.01');svg.append(path);return svg;
}
document.querySelectorAll('.social-links a').forEach(a=>{const platform=a.href.includes('youtube')?'youtube':'instagram';const circle=element('span','social-orb');circle.setAttribute('aria-hidden','true');circle.append(platformIcon(platform));a.prepend(circle)});
const feed=document.querySelector('#social-feed');let selected='all';let data={};
const profiles={youtube:{title:'The sound of JesseSound',description:'Bass covers, music, and whatever comes next. Watch on my YouTube channel.',url:'https://www.youtube.com/@jessesound',symbol:'▶'},instagram:{title:'Off the record. In the moment.',description:'Catch the latest moments over on Instagram.',url:'https://www.instagram.com/_jessesound/',symbol:'◎'}};
function safeUrl(value,hosts){try{const u=new URL(value);return u.protocol==='https:'&&hosts.some(h=>u.hostname===h||u.hostname.endsWith('.'+h))?u.href:null}catch{return null}}
function element(tag,className,text){const el=document.createElement(tag);el.className=className;if(text)el.textContent=text;return el}
function card(p,fallback=false,index=0){
 const platform=profiles[p.platform];const a=element('a','social-card '+p.platform);a.href=safeUrl(p.url,p.platform==='youtube'?['youtube.com']:['instagram.com'])||platform.url;a.target='_blank';a.rel='noopener';
 const media=element('div','post-media');const art=element('div','platform-art '+p.platform,platform.symbol);art.setAttribute('aria-hidden','true');media.append(art);
 const image=/^\/assets\/social\/\d+\.(jpg|png|webp)$/.test(p.image||'')?p.image:safeUrl(p.image,['ytimg.com','cdninstagram.com','fbcdn.net']);
 if(image){const img=element('img','social-image');img.src=image;img.alt='';img.loading='lazy';img.addEventListener('error',()=>{img.remove();a.classList.add('image-unavailable');art.textContent='Preview unavailable';},{once:true});media.append(img)}
 const play=element('span','post-open');play.append(platformIcon(p.platform));play.setAttribute('aria-hidden','true');media.append(play);
 const body=element('div','body');const label=element('div','post-label',p.platform==='youtube'?'YouTube':'Instagram');
 if(p.published&&!Number.isNaN(Date.parse(p.published))){const time=element('time','',new Date(p.published).toLocaleDateString('en-CA',{month:'short',day:'numeric',year:'numeric'}));time.dateTime=p.published;label.append(time)}
 const caption=p.title||platform.title;const clean=caption.replace(/#[\p{L}\p{N}_]+/gu,'').replace(/\s+/g,' ').trim();const title=element('h3','',clean||caption);body.append(label,title);
 if(fallback)body.append(element('p','',p.description));
 const footer=element('div','post-footer',fallback?'Visit channel ':p.platform==='youtube'?'Watch video ':'View post ');body.append(footer);a.append(media,body);return a;
}
function render(){feed.replaceChildren();const platforms=selected==='all'?['youtube','instagram']:[selected];const sorted=p=>(data[p]||[]).slice().sort((a,b)=>(Date.parse(b.published)||0)-(Date.parse(a.published)||0));const posts=selected==='all'?Array.from({length:6},(_,i)=>platforms.map(p=>sorted(p)[i])).flat().filter(Boolean):sorted(selected);posts.slice(0,6).forEach((p,i)=>feed.append(card(p,false,i)));platforms.filter(p=>!data[p]?.length).forEach(p=>feed.append(card({...profiles[p],platform:p},true)));const status=document.querySelector('#feed-status');const stamps=platforms.map(p=>data.sources?.[p]?.updatedAt).filter(Boolean);status.textContent=stamps.length?'Feed updated '+new Date(stamps.sort().at(-1)).toLocaleDateString('en-CA',{month:'short',day:'numeric'}):'Explore my social channels';if(platforms.some(p=>data.sources?.[p]?.status==='stale'))status.textContent+=' · Showing saved posts';}
document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{selected=btn.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn))});render()}));
async function refresh(){try{const r=await fetch('/data/social.json',{cache:'no-store'});if(!r.ok)throw Error();data=await r.json();render()}catch{if(!feed.children.length)render()}}
document.querySelector('#year').textContent=new Date().getFullYear();refresh();setInterval(()=>{if(!document.hidden)refresh()},300000);
