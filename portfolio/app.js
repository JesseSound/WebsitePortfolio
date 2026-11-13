const feed=document.querySelector('#social-feed');let selected='all';let data={};
const profiles={youtube:{title:'The sound of JesseSound',description:'Bass covers, music, and whatever comes next. Watch on my YouTube channel.',url:'https://www.youtube.com/@jessesound',symbol:'▶'},instagram:{title:'Off the record. In the moment.',description:'Catch the latest moments over on Instagram.',url:'https://www.instagram.com/_jessesound/',symbol:'◎'}};
function safeUrl(value,hosts){try{const u=new URL(value);return u.protocol==='https:'&&hosts.some(h=>u.hostname===h||u.hostname.endsWith('.'+h))?u.href:null}catch{return null}}
function element(tag,className,text){const el=document.createElement(tag);el.className=className;if(text)el.textContent=text;return el}
function card(p,fallback=false,index=0){
 const platform=profiles[p.platform];const a=element('a','social-card '+p.platform);a.href=safeUrl(p.url,p.platform==='youtube'?['youtube.com']:['instagram.com'])||platform.url;a.target='_blank';a.rel='noopener';
 const media=element('div','post-media');const art=element('div','platform-art '+p.platform,platform.symbol);art.setAttribute('aria-hidden','true');media.append(art);
 const image=safeUrl(p.image,['ytimg.com','cdninstagram.com','fbcdn.net']);
 if(image){const img=element('img','social-image');img.src=image;img.alt='';img.loading='lazy';img.addEventListener('error',()=>img.remove(),{once:true});media.append(img)}
 const play=element('span','post-open',p.platform==='youtube'?'▶':'↗');play.setAttribute('aria-hidden','true');media.append(play);
 const body=element('div','body');const label=element('div','post-label',p.platform==='youtube'?'YouTube':'Instagram');
 if(p.published&&!Number.isNaN(Date.parse(p.published))){const time=element('time','',new Date(p.published).toLocaleDateString('en-CA',{month:'short',day:'numeric',year:'numeric'}));time.dateTime=p.published;label.append(time)}
 const caption=p.title||platform.title;const clean=caption.replace(/#[\p{L}\p{N}_]+/gu,'').replace(/\s+/g,' ').trim();const title=element('h3','',clean||caption);body.append(label,title);
 if(fallback)body.append(element('p','',p.description));
 const footer=element('div','post-footer',fallback?'Visit channel ↗':p.platform==='youtube'?'Watch video ↗':'View post ↗');body.append(footer);a.append(media,body);return a;
}
function render(){feed.replaceChildren();const platforms=selected==='all'?['youtube','instagram']:[selected];const sorted=p=>(data[p]||[]).slice().sort((a,b)=>(Date.parse(b.published)||0)-(Date.parse(a.published)||0));const posts=selected==='all'?Array.from({length:6},(_,i)=>platforms.map(p=>sorted(p)[i])).flat().filter(Boolean):sorted(selected);posts.slice(0,6).forEach((p,i)=>feed.append(card(p,false,i)));platforms.filter(p=>!data[p]?.length).forEach(p=>feed.append(card({...profiles[p],platform:p},true)));const status=document.querySelector('#feed-status');const stamps=platforms.map(p=>data.sources?.[p]?.updatedAt).filter(Boolean);status.textContent=stamps.length?'Feed updated '+new Date(stamps.sort().at(-1)).toLocaleDateString('en-CA',{month:'short',day:'numeric'}):'Explore my social channels';if(platforms.some(p=>data.sources?.[p]?.status==='stale'))status.textContent+=' · Showing saved posts';}
document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{selected=btn.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn))});render()}));
async function refresh(){try{const r=await fetch('/data/social.json',{cache:'no-store'});if(!r.ok)throw Error();data=await r.json();render()}catch{if(!feed.children.length)render()}}
document.querySelector('#year').textContent=new Date().getFullYear();refresh();setInterval(()=>{if(!document.hidden)refresh()},300000);
