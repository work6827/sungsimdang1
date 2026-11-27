import {useEffect,useMemo,useRef,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Search,X,Wheat,MapPin,Store,ArrowUpRight,Clock,Compass,Ticket,Stamp,Sparkles,Glasses} from 'lucide-react';
import {products,stores} from '../data/catalog';
import {productPhotos} from '../data/productPhotos';
import {places} from './Explore';
import './SearchBar.css';

type Language='en'|'ko';
type Kind='bread'|'place'|'store'|'page';
type Entry={id:string;kind:Kind;title:string;ko:string;sub:string;to:string;image?:string;icon?:typeof Wheat;keywords:string};
type Hit=Entry&{score:number};

const pages:[string,string,string,typeof Wheat,string][]=[
 ['/find','Bread & pastries','빵과 디저트',Wheat,'find bread pastries cake availability menu'],
 ['/assistant','Bakery assistant','베이커리 도우미',Sparkles,'assistant ask help chat question'],
 ['/passes','Bread Pass','브레드 패스',Ticket,'bread pass reserve reservation booking pickup qr'],
 ['/passport','My Passport','내 패스포트',Stamp,'passport stamps rewards ledger'],
 ['/explore','Explore Daejeon','대전 여행',Compass,'explore daejeon city travel trip places'],
 ['/trainee','Trainee AI glasses','수습 제빵사 AI 안경',Glasses,'trainee glasses ai chef training recipe dough mix kitchen'],
];

const index:Entry[]=[
 ...products.map(p=>({id:p.id,kind:'bread' as const,title:p.name,ko:p.ko,sub:p.category,to:`/find?product=${p.id}`,image:productPhotos[p.id]?.src,keywords:`${p.category} ${p.category==='Cake'?'cake dessert':'bread pastry'} ${p.limited?'limited bread pass':''}`})),
 ...places.map(p=>({id:p.id,kind:'place' as const,title:p.name,ko:p.ko,sub:`${p.category} · ${p.area}`,to:'/explore',image:p.image,keywords:`${p.category} daejeon ${p.area}`})),
 ...stores.map(s=>({id:String(s.id),kind:'store' as const,title:`Sungsimdang ${s.name}`,ko:`성심당 ${s.ko}`,sub:s.area,to:`/find?store=${s.id}`,icon:Store,keywords:'store bakery shop location'})),
 ...pages.map(([to,title,ko,icon,keywords])=>({id:to,kind:'page' as const,title,ko,sub:'Page',to,icon,keywords})),
];

/** Instagram-style ranking: whole-name prefix beats word prefix beats substring beats keyword. */
function score(e:Entry,q:string){
 const names=[e.title.toLowerCase(),e.ko];
 if(names.some(n=>n.startsWith(q)))return 100;
 if(names.some(n=>n.split(/[\s·&]+/).some(w=>w.startsWith(q))))return 80;
 if(q.length>1&&names.some(n=>n.includes(q)))return 60;
 const k=e.keywords.toLowerCase();
 if(k.split(/\s+/).some(w=>w.startsWith(q)))return 40;
 if(q.length>1&&k.includes(q))return 20;
 return 0;
}

const sections:[Kind,string,string][]=[['bread','Bread & pastries','빵과 디저트'],['place','Daejeon places','대전 명소'],['store','Stores','매장'],['page','Pages','페이지']];
const phrases:[string,string][]=[
 ['What are you looking for?','무엇을 찾고 계신가요?'],
 ['Try “soboro”…','“소보로”를 검색해 보세요…'],
 ['Strawberry cake, Daejeon spots…','딸기 케이크, 대전 명소…'],
 ['Type to search','검색어를 입력하세요'],
];
const RECENT='passport-recent-searches';

function readRecent():Entry[]{
 try{const ids=JSON.parse(localStorage.getItem(RECENT)||'[]');return Array.isArray(ids)?ids.map((key:string)=>index.find(e=>`${e.kind}:${e.id}`===key)).filter(Boolean).slice(0,5) as Entry[]:[]}catch{return []}
}

/** Bold the part of the label that matches, like Instagram does. */
function Highlight({text,q}:{text:string;q:string}){
 const i=q?text.toLowerCase().indexOf(q):-1;
 if(i<0)return <>{text}</>;
 return <>{text.slice(0,i)}<mark>{text.slice(i,i+q.length)}</mark>{text.slice(i+q.length)}</>;
}

function useTypewriter(lang:Language,active:boolean){
 const [text,setText]=useState('');
 useEffect(()=>{
  const list=phrases.map(p=>lang==='ko'?p[1]:p[0]);
  if(!active||matchMedia('(prefers-reduced-motion: reduce)').matches){setText(list[0]);return}
  let phrase=0,chars=0,deleting=false,timer=0;
  const step=()=>{
   const full=list[phrase];
   chars+=deleting?-1:1;
   setText(full.slice(0,chars));
   let wait=deleting?28:62;
   if(!deleting&&chars===full.length){deleting=true;wait=1700}
   else if(deleting&&chars===0){deleting=false;phrase=(phrase+1)%list.length;wait=350}
   timer=window.setTimeout(step,wait);
  };
  timer=window.setTimeout(step,400);
  return()=>clearTimeout(timer);
 },[lang,active]);
 return text;
}

export function SearchBar({lang}:{lang:Language}){
 const navigate=useNavigate();
 const [query,setQuery]=useState(''),[open,setOpen]=useState(false),[active,setActive]=useState(0),[recent,setRecent]=useState<Entry[]>(readRecent);
 const box=useRef<HTMLDivElement>(null),input=useRef<HTMLInputElement>(null);
 const t=(en:string,ko:string)=>lang==='ko'?ko:en;
 const q=query.trim().toLowerCase();
 const typed=useTypewriter(lang,!query);

 const hits=useMemo(()=>{
  if(!q)return [] as Hit[];
  return index.map(e=>({...e,score:score(e,q)})).filter(e=>e.score>0).sort((a,b)=>b.score-a.score||a.title.localeCompare(b.title));
 },[q]);
 const grouped=sections.map(([kind,en,ko])=>({kind,label:t(en,ko),items:hits.filter(h=>h.kind===kind).slice(0,kind==='bread'?6:4)})).filter(g=>g.items.length);
 const flat=q?grouped.flatMap(g=>g.items):recent;

 useEffect(()=>setActive(0),[q]);
 useEffect(()=>{
  const onKey=(e:KeyboardEvent)=>{if(e.key==='/'&&!(e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement||e.target instanceof HTMLSelectElement)){e.preventDefault();input.current?.focus()}};
  window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey);
 },[]);

 function choose(e:Entry){
  const next=[e,...recent.filter(r=>!(r.kind===e.kind&&r.id===e.id))].slice(0,5);
  setRecent(next);
  try{localStorage.setItem(RECENT,JSON.stringify(next.map(r=>`${r.kind}:${r.id}`)))}catch{/* recent searches are optional */}
  setOpen(false);setQuery('');input.current?.blur();
  navigate(e.to);
 }
 function clearRecent(){setRecent([]);try{localStorage.removeItem(RECENT)}catch{/* optional */}}
 function onKeyDown(e:React.KeyboardEvent){
  if(e.key==='Escape'){setOpen(false);input.current?.blur()}
  else if(e.key==='ArrowDown'&&flat.length){e.preventDefault();setOpen(true);setActive(a=>(a+1)%flat.length)}
  else if(e.key==='ArrowUp'&&flat.length){e.preventDefault();setActive(a=>(a-1+flat.length)%flat.length)}
  else if(e.key==='Enter'&&flat[active]){e.preventDefault();choose(flat[active])}
 }

 const row=(e:Entry,i:number)=>{const Icon=e.icon??(e.kind==='place'?MapPin:Wheat);return <li key={`${e.kind}:${e.id}`} role="option" aria-selected={i===active} id={`search-opt-${i}`}>
  <button type="button" className={i===active?'is-active':''} onMouseEnter={()=>setActive(i)} onMouseDown={ev=>ev.preventDefault()} onClick={()=>choose(e)} style={{'--i':i} as React.CSSProperties}>
   <span className={`search-thumb ${e.kind==='place'?'is-round':''}`}>{e.image?<img src={'/assets/photos/'+e.image} alt="" loading="lazy"/>:<Icon size={18}/>}</span>
   <span className="search-text"><strong><Highlight text={lang==='ko'?e.ko:e.title} q={q}/></strong><small><Highlight text={lang==='ko'?e.title:e.ko} q={q}/> · {e.sub}</small></span>
   <ArrowUpRight size={15} className="search-go"/>
  </button>
 </li>};

 let n=0;
 const showPanel=open&&(q||recent.length);
 return <div ref={box} className={`home-search ${open?'is-focused':''}`} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOpen(false)}}>
  <Search size={19}/>
  <div className="search-field">
   <input ref={input} role="combobox" aria-label={t('Search bread and Daejeon','빵과 대전 검색')} aria-expanded={!!showPanel} aria-controls="home-search-results" aria-activedescendant={showPanel&&flat.length?`search-opt-${active}`:undefined} aria-autocomplete="list" value={query} onChange={e=>{setQuery(e.target.value);setOpen(true)}} onFocus={()=>setOpen(true)} onKeyDown={onKeyDown} autoComplete="off" spellCheck={false}/>
   {!query&&<span className="search-typewriter" aria-hidden="true">{typed}<span className="search-caret"/></span>}
  </div>
  {query?<button type="button" className="search-clear" aria-label={t('Clear search','검색 지우기')} onClick={()=>{setQuery('');input.current?.focus()}}><X size={15}/></button>:<kbd className="search-kbd" aria-hidden="true">/</kbd>}
  {showPanel?<div className="home-search-results" id="home-search-results" role="listbox" aria-label={t('Search results','검색 결과')}>
   {!q&&<><div className="search-section-head"><span>{t('Recent','최근 검색')}</span><button type="button" onMouseDown={e=>e.preventDefault()} onClick={clearRecent}>{t('Clear all','모두 지우기')}</button></div><ul>{recent.map(e=>row(e,n++))}</ul></>}
   {q&&<p className="search-count" role="status">{hits.length?`${hits.length} ${t(hits.length===1?'result':'results','개의 결과')}`:t('No results','결과 없음')}</p>}
   {q&&grouped.map(g=><section key={g.kind}><div className="search-section-head"><span>{g.label}</span></div><ul>{g.items.map(e=>row(e,n++))}</ul></section>)}
   {q&&!hits.length&&<div className="search-empty"><Clock size={20}/><p>{t('Nothing matches “','“')}{query}{t('” yet. Try “soboro”, “cake” or “Daejeon”.','”와 일치하는 결과가 없어요. “소보로”, “케이크” 또는 “대전”을 검색해 보세요.')}</p></div>}
  </div>:null}
 </div>;
}
