import {useEffect,useRef,useState} from 'react';
import {useLocation} from 'react-router-dom';
import {Wheat} from 'lucide-react';
import './PageTransition.css';

type Language='en'|'ko';

const destinations:Record<string,[string,string]>={
 '/':['Home','홈'],
 '/find':['Bread & pastries','빵과 디저트'],
 '/assistant':['Bakery assistant','베이커리 도우미'],
 '/passes':['Bread Pass','브레드 패스'],
 '/passport':['My Passport','내 패스포트'],
 '/explore':['Explore Daejeon','대전 여행'],
 '/how':['How it works','이용 방법'],
 '/operations':['Inventory & kitchen','재고 및 주방'],
 '/trainee':['Trainee AI glasses','수습 제빵사 AI 안경'],
 '/dashboard':['Analytics','분석 대시보드'],
 '/business':['Business platform','비즈니스 플랫폼'],
};

const messages:[string,string][]=[
 ['Warming up the ovens…','오븐을 데우는 중…'],
 ['Checking the shelves…','진열대를 확인하는 중…'],
 ['Almost out of the oven…','곧 나와요…'],
];

/** Duration of the loading bar in ms. Kept short so navigation still feels responsive. */
const DURATION=1100;
const FADE=320;

/**
 * Full-screen interstitial shown on every route change. The new page renders underneath
 * immediately; the overlay covers it until the bar reaches 100%, then fades away.
 * Skipped on first load and for visitors who prefer reduced motion.
 */
export function PageTransition({lang}:{lang:Language}){
 const {pathname}=useLocation();
 const previous=useRef(pathname);
 const [run,setRun]=useState(0);
 const [progress,setProgress]=useState(0);
 const [phase,setPhase]=useState<'idle'|'loading'|'leaving'>('idle');

 useEffect(()=>{
  if(previous.current===pathname)return;
  previous.current=pathname;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  setRun(r=>r+1);
 },[pathname]);

 useEffect(()=>{
  if(!run)return;
  setPhase('loading');setProgress(0);
  let frame=0,timer=0;
  const start=performance.now();
  const tick=(now:number)=>{
   const t=Math.max(0,Math.min(1,(now-start)/DURATION));
   // Ease-in-out with a brief pause near 70% so the bar feels like real loading.
   const eased=t<.6?(t/.6)*.72:.72+((t-.6)/.4)**2*.28;
   setProgress(Math.round(eased*100));
   if(t<1)frame=requestAnimationFrame(tick);
   else{setPhase('leaving');timer=window.setTimeout(()=>setPhase('idle'),FADE)}
  };
  frame=requestAnimationFrame(tick);
  return()=>{cancelAnimationFrame(frame);clearTimeout(timer)};
 },[run]);

 if(phase==='idle')return null;
 const t=([en,ko]:[string,string])=>lang==='ko'?ko:en;
 const place=t(destinations[pathname]??['your page','페이지']);
 const message=messages[Math.max(0,Math.min(messages.length-1,Math.floor(progress/34)))];

 return <div className={`page-transition ${phase==='leaving'?'is-leaving':''}`} role="status" aria-live="polite" aria-label={t(['Loading page','페이지 불러오는 중'])}>
  <div className="page-transition-card">
   <div className="page-transition-oven" aria-hidden="true">
    <span className="page-transition-steam"/><span className="page-transition-steam"/><span className="page-transition-steam"/>
    <span className="page-transition-loaf"><Wheat size={34}/></span>
   </div>
   <p className="page-transition-kicker">{t(['Hang tight','잠시만 기다려 주세요'])}</p>
   <h2>{t(['We’ll take you there soon','곧 안내해 드릴게요'])}</h2>
   <p className="page-transition-destination">{t(['Heading to','이동 중'])} · <strong>{place}</strong></p>
   <div className="page-transition-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
    <span style={{transform:`scaleX(${progress/100})`}}/>
   </div>
   <div className="page-transition-meta"><span key={message[0]}>{t(message)}</span><span>{progress}%</span></div>
  </div>
 </div>;
}
