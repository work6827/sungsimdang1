import {useEffect,useMemo,useRef,useState} from 'react';
import {Glasses,ChevronLeft,ChevronRight,RotateCcw,Check,Hand,Timer,Thermometer,Info,Play,Pause,Sparkles} from 'lucide-react';
import {PageTitle} from './UI';
import {useLang} from '../i18n';
import './Trainee.css';

/* ---------- Representative training recipes (illustrative, not Sungsimdang recipes) ---------- */
type Station='flour'|'sugar'|'salt'|'yeast'|'milk'|'water'|'eggs'|'butter';
type Tx=[string,string];
type Ingredient={station:Station;name:Tx;grams:number;tip:Tx};
type Process={kind:'mix'|'knead'|'proof'|'divide'|'finish';title:Tx;say:Tx;minutes:number;checks:Tx[];temp?:Tx};
type Recipe={id:string;name:string;ko:string;pieces:number;ingredients:Ingredient[];process:Process[]};

const recipes:Recipe[]=[
 {id:'soboro',name:'Soboro bun dough',ko:'소보로빵 반죽',pieces:12,ingredients:[
  {station:'flour',name:['Bread flour','강력분'],grams:500,tip:['Scoop gently. Do not pack the flour into the scoop.','가볍게 떠 담으세요. 스쿱에 밀가루를 눌러 담지 마세요.']},
  {station:'sugar',name:['Sugar','설탕'],grams:75,tip:['Keep sugar on the opposite side of the bowl from the yeast.','설탕은 이스트와 볼의 반대쪽에 넣으세요.']},
  {station:'salt',name:['Salt','소금'],grams:8,tip:['Small amount. Pour slowly, a few grams makes a big difference.','소량입니다. 천천히 부으세요. 몇 그램 차이도 결과가 크게 달라집니다.']},
  {station:'yeast',name:['Instant yeast','인스턴트 이스트'],grams:10,tip:['Add away from the salt. Salt touching yeast slows it down.','소금과 떨어뜨려 넣으세요. 소금이 이스트에 닿으면 발효가 느려집니다.']},
  {station:'eggs',name:['Whole egg','달걀'],grams:50,tip:['About one large egg. Crack into a cup first to check for shell.','큰 달걀 약 1개입니다. 먼저 컵에 깨서 껍데기가 없는지 확인하세요.']},
  {station:'milk',name:['Milk (cool)','우유 (차가운 것)'],grams:275,tip:['Cool milk keeps the final dough near 26 °C.','차가운 우유를 써야 반죽 온도가 26 °C 근처로 유지됩니다.']},
  {station:'butter',name:['Butter (soft)','버터 (말랑한 것)'],grams:50,tip:['Add after the first mix so gluten can start forming.','글루텐이 생기기 시작하도록 1차 믹싱 후에 넣으세요.']},
 ],process:[
  {kind:'mix',title:['First mix','1차 믹싱'],say:['Mixer on LOW. Combine until no dry flour remains.','믹서 저속. 마른 가루가 남지 않을 때까지 섞으세요.'],minutes:3,checks:[['No dry flour on the bowl walls','볼 벽에 마른 가루가 없음'],['Butter not added yet','버터는 아직 넣지 않음']]},
  {kind:'knead',title:['Knead to windowpane','글루텐 막이 생길 때까지 반죽'],say:['Add butter, then mixer on MEDIUM. Stop when the dough stretches thin without tearing.','버터를 넣고 믹서 중속. 반죽이 찢어지지 않고 얇게 늘어나면 멈추세요.'],minutes:8,checks:[['Smooth, slightly tacky surface','매끄럽고 살짝 끈적한 표면'],['Windowpane test passes','글루텐 막 테스트 통과']],temp:['Target dough temperature 26 °C','목표 반죽 온도 26 °C']},
  {kind:'proof',title:['Bulk proof','1차 발효'],say:['Cover the bowl. Proof until roughly doubled.','볼을 덮고 약 2배가 될 때까지 발효하세요.'],minutes:50,checks:[['Dough roughly doubled','반죽이 약 2배로 부풂'],['Finger poke springs back slowly','손가락으로 누르면 천천히 올라옴']],temp:['Proofer 27 °C · 75% humidity','발효기 27 °C · 습도 75%']},
  {kind:'divide',title:['Divide & round','분할 및 둥글리기'],say:['Divide into equal pieces. The glasses check each piece on the scale.','같은 무게로 분할하세요. 안경이 저울에서 각 조각을 확인합니다.'],minutes:10,checks:[['All pieces within ±3 g','모든 조각이 ±3 g 이내'],['Seams tucked underneath','이음매를 아래로 마무리']]},
  {kind:'finish',title:['Top & fry','토핑 및 튀기기'],say:['Press into soboro crumble, final proof, then fry until deep golden.','소보로 가루를 눌러 묻히고 2차 발효 후, 진한 황금색이 될 때까지 튀기세요.'],minutes:8,checks:[['Crumble covers the top evenly','윗면에 소보로가 고르게 묻음'],['Oil at 170 °C before frying','튀기기 전 기름 170 °C']],temp:['Fryer 170 °C','튀김기 170 °C']},
 ]},
 {id:'salt',name:'Salt butter roll dough',ko:'소금빵 반죽',pieces:12,ingredients:[
  {station:'flour',name:['Bread flour','강력분'],grams:500,tip:['Scoop gently. Do not pack the flour into the scoop.','가볍게 떠 담으세요. 스쿱에 밀가루를 눌러 담지 마세요.']},
  {station:'sugar',name:['Sugar','설탕'],grams:40,tip:['Less sugar than sweet dough, so the crust stays crisp.','단과자 반죽보다 설탕이 적어 겉이 바삭하게 유지됩니다.']},
  {station:'salt',name:['Salt','소금'],grams:9,tip:['Small amount. Pour slowly, a few grams makes a big difference.','소량입니다. 천천히 부으세요. 몇 그램 차이도 결과가 크게 달라집니다.']},
  {station:'yeast',name:['Instant yeast','인스턴트 이스트'],grams:8,tip:['Add away from the salt.','소금과 떨어뜨려 넣으세요.']},
  {station:'milk',name:['Milk','우유'],grams:150,tip:['Milk softens the crumb.','우유가 속살을 부드럽게 해 줍니다.']},
  {station:'water',name:['Water (cool)','물 (차가운 것)'],grams:175,tip:['Use cool water if the kitchen is warm.','주방이 따뜻하면 차가운 물을 사용하세요.']},
  {station:'butter',name:['Butter (soft)','버터 (말랑한 것)'],grams:25,tip:['Most of the butter goes inside the roll later.','버터 대부분은 나중에 빵 안에 넣습니다.']},
 ],process:[
  {kind:'mix',title:['First mix','1차 믹싱'],say:['Mixer on LOW until the dough comes together.','반죽이 한 덩어리가 될 때까지 믹서 저속.'],minutes:3,checks:[['No dry flour remaining','마른 가루가 남지 않음']]},
  {kind:'knead',title:['Knead','반죽하기'],say:['Mixer on MEDIUM until smooth and elastic.','매끄럽고 탄력 있을 때까지 믹서 중속.'],minutes:7,checks:[['Dough pulls away from the bowl','반죽이 볼에서 깔끔하게 떨어짐'],['Windowpane test passes','글루텐 막 테스트 통과']],temp:['Target dough temperature 25 °C','목표 반죽 온도 25 °C']},
  {kind:'proof',title:['Rest','휴지'],say:['Cover and rest so the dough relaxes before shaping.','성형 전에 반죽이 이완되도록 덮어서 휴지하세요.'],minutes:40,checks:[['Dough has relaxed and grown slightly','반죽이 이완되고 살짝 부풂']]},
  {kind:'divide',title:['Divide & shape','분할 및 성형'],say:['Divide equally. Roll each into a long teardrop around an 8 g butter stick.','같은 무게로 분할하고, 8 g 버터 스틱을 넣어 긴 물방울 모양으로 말아주세요.'],minutes:15,checks:[['All pieces within ±3 g','모든 조각이 ±3 g 이내'],['Butter fully wrapped inside','버터가 안쪽에 완전히 감싸짐']]},
  {kind:'finish',title:['Salt & bake','소금 뿌리고 굽기'],say:['Sprinkle sea salt and bake until the bottom is crisp and golden.','천일염을 뿌리고 바닥이 바삭한 황금색이 될 때까지 구우세요.'],minutes:13,checks:[['Sea salt on every roll','모든 빵에 천일염'],['Bottoms golden and crisp','바닥이 황금색으로 바삭함']],temp:['Oven 200 °C','오븐 200 °C']},
 ]},
];


/* ---------- Camera-feed photography (see public/assets/photos/credits.md) ---------- */
type Box={x:number;y:number;w:number;h:number};
const PHOTO={
 kitchen:{src:'training/kitchen-mixer.webp',credit:'Infrogmation of New Orleans · CC BY-SA 3.0'},
 bowls:{src:'training/prep-bowls.webp',credit:'Cynthinee · CC BY 4.0'},
 mixer:{src:'training/kitchen-mixer.webp',credit:'Infrogmation of New Orleans · CC BY-SA 3.0'},
 knead:{src:'training/kneading.webp',credit:'Shixart1985 · CC BY 2.0'},
 proof:{src:'training/proofing.webp',credit:'Ruth Hartnup · CC BY 2.0'},
 divide:{src:'training/divider.webp',credit:'Martin Carpenter · CC BY 3.0'},
 fry:{src:'training/frying.webp',credit:'Waldo Jaquith · CC BY-SA 2.0'},
 bake:{src:'bread-rolls.webp',credit:'kall · Pexels'},
};
/* Storage zones visible in the kitchen photo, in % of the 4:3 frame. Each ingredient maps to the zone it is stored in. */
type Zone='bin'|'dry'|'cold';
const zones:Record<Zone,{box:Box;name:Tx}>={
 bin:{box:{x:0.5,y:34,w:9.5,h:22},name:['Flour bin','밀가루 통']},
 dry:{box:{x:10.5,y:28,w:7.5,h:22},name:['Dry goods','건조 식재료']},
 cold:{box:{x:88.5,y:13,w:11,h:22},name:['Fridge','냉장고']},
};
const zoneOf:Record<Station,Zone>={flour:'bin',sugar:'dry',salt:'dry',yeast:'dry',milk:'cold',water:'cold',eggs:'cold',butter:'cold'};
const labelOf:Record<Station,Tx>={flour:['Flour','밀가루'],sugar:['Sugar','설탕'],salt:['Salt','소금'],yeast:['Yeast','이스트'],milk:['Milk','우유'],water:['Water','물'],eggs:['Eggs','달걀'],butter:['Butter','버터']};
const locationOf:Record<Station,Tx>={flour:['Dry store · Bin B2','건조 창고 · B2'],sugar:['Dry store · Bin B4','건조 창고 · B4'],salt:['Spice rack · Shelf 1','양념 선반 · 1단'],yeast:['Walk-in fridge · Shelf 3','워크인 냉장고 · 3단'],milk:['Walk-in fridge · Shelf 1','워크인 냉장고 · 1단'],water:['Chilled tap · Station 2','냉수 탭 · 2번 스테이션'],eggs:['Walk-in fridge · Shelf 2','워크인 냉장고 · 2단'],butter:['Walk-in fridge · Shelf 2','워크인 냉장고 · 2단']};
/* The prep bowl on the scale in the bowls photo. */
const BOWL:Box={x:1,y:12,w:39,h:72};
const TOLERANCE=.03;

type Step={type:'weigh';ing:Ingredient}|{type:'process';proc:Process};

export function Trainee(){
 const {lang,t}=useLang();
 const L=(x:Tx)=>lang==='ko'?x[1]:x[0];
 const [recipeId,setRecipeId]=useState('soboro'),[batch,setBatch]=useState(1),[index,setIndex]=useState(0);
 const [poured,setPoured]=useState<Record<number,number>>({}),[pouring,setPouring]=useState(false);
 const [elapsed,setElapsed]=useState<Record<number,number>>({}),[running,setRunning]=useState(false);
 const [ticked,setTicked]=useState<Record<string,boolean>>({});
 const recipe=recipes.find(r=>r.id===recipeId)!;
 const steps=useMemo<Step[]>(()=>[...recipe.ingredients.map(ing=>({type:'weigh' as const,ing})),...recipe.process.map(proc=>({type:'process' as const,proc}))],[recipe]);
 const step=steps[index];
 const flour=recipe.ingredients[0].grams;
 const target=step.type==='weigh'?Math.round(step.ing.grams*batch):0;
 const current=poured[index]??0;
 const off=target?(current-target)/target:0;
 const inRange=step.type==='weigh'&&Math.abs(off)<=TOLERANCE;
 const over=step.type==='weigh'&&off>TOLERANCE;
 const totalDough=recipe.ingredients.reduce((s,i)=>s+i.grams,0)*batch;
 const pieces=recipe.pieces*batch,pieceWeight=Math.round(totalDough/pieces);
 const procMinutes=step.type==='process'?step.proc.minutes:0;
 const progress=step.type==='process'?Math.min(1,(elapsed[index]??0)/(procMinutes*60)):0;
 const procDone=step.type==='process'&&progress>=1;
 const stepDone=(i:number)=>{const s=steps[i];if(s.type==='weigh'){const tg=s.ing.grams*batch,p=poured[i]??0;return Math.abs(p-tg)/tg<=TOLERANCE}return (elapsed[i]??0)>=s.proc.minutes*60&&s.proc.checks.every((_,c)=>ticked[`${i}:${c}`])};
 const canAdvance=stepDone(index);
 const completed=steps.filter((_,i)=>stepDone(i)).length;

 function reset(nextRecipe=recipeId,nextBatch=batch){setRecipeId(nextRecipe);setBatch(nextBatch);setIndex(0);setPoured({});setElapsed({});setTicked({});setPouring(false);setRunning(false)}

 /* Hold-to-pour: grams climb while the button is held, slowing near the target like a careful pour. */
 const raf=useRef(0);
 useEffect(()=>{
  if(!pouring||step.type!=='weigh')return;
  let last=performance.now();
  const loop=(now:number)=>{
   const dt=Math.max(0,(now-last)/1000);last=now;
   setPoured(p=>{const g=p[index]??0;const remaining=target-g;const rate=remaining>target*.15?target/2.2:Math.max(target/9,1.5);return {...p,[index]:Math.round((g+rate*dt)*10)/10}});
   raf.current=requestAnimationFrame(loop);
  };
  raf.current=requestAnimationFrame(loop);
  return()=>cancelAnimationFrame(raf.current);
 },[pouring,index,target,step.type]);

 /* Process timer runs at 60× speed so a 50-minute proof takes 50 seconds in the demo. */
 useEffect(()=>{
  if(!running||step.type!=='process')return;
  const id=setInterval(()=>setElapsed(e=>{const v=Math.min(procMinutes*60,(e[index]??0)+6);if(v>=procMinutes*60)setRunning(false);return {...e,[index]:v}}),100);
  return()=>clearInterval(id);
 },[running,index,procMinutes,step.type]);

 useEffect(()=>{setPouring(false);setRunning(false)},[index]);

 const go=(d:number)=>setIndex(i=>Math.max(0,Math.min(steps.length-1,i+d)));
 const holdProps={
  onPointerDown:(e:React.PointerEvent)=>{e.currentTarget.setPointerCapture(e.pointerId);setPouring(true)},
  onPointerUp:()=>setPouring(false),onPointerCancel:()=>setPouring(false),onLostPointerCapture:()=>setPouring(false),
  onKeyDown:(e:React.KeyboardEvent)=>{if((e.key===' '||e.key==='Enter')&&!e.repeat){e.preventDefault();setPouring(true)}},
  onKeyUp:(e:React.KeyboardEvent)=>{if(e.key===' '||e.key==='Enter')setPouring(false)},
 };
 const mmss=(s:number)=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(Math.floor(s%60)).padStart(2,'0')}`;
 const pct=(b:Box)=>({left:`${b.x}%`,top:`${b.y}%`,width:`${b.w}%`,height:`${b.h}%`});

 /* Which camera frame to show: locate the ingredient first, then switch to the bowl once pouring starts. */
 const locating=step.type==='weigh'&&current===0&&!pouring;
 const photo=step.type==='weigh'?(locating?PHOTO.kitchen:PHOTO.bowls):({mix:PHOTO.mixer,knead:PHOTO.knead,proof:PHOTO.proof,divide:PHOTO.divide,finish:recipe.id==='soboro'?PHOTO.fry:PHOTO.bake})[step.proc.kind];
 const ingName=step.type==='weigh'?L(step.ing.name):'';

 const hudStatus=step.type==='weigh'
  ?(over?{tone:'bad',text:t(`Too much · remove about ${Math.round(current-target)} g`,`너무 많아요 · 약 ${Math.round(current-target)} g 덜어내세요`)}:inRange?{tone:'good',text:t('On target · within ±3%','목표 도달 · ±3% 이내')}:current>0?{tone:'info',text:t(`Keep pouring · ${Math.round(target-current)} g to go`,`계속 부으세요 · ${Math.round(target-current)} g 남음`)}:{tone:'info',text:t(`Pick up the ${ingName.toLowerCase()}`,`${ingName}을(를) 가져오세요`)})
  :(procDone?{tone:'good',text:t('Timer complete · confirm the checks','타이머 완료 · 체크리스트를 확인하세요')}:running?{tone:'info',text:t('In progress · watch the dough','진행 중 · 반죽 상태를 지켜보세요')}:{tone:'info',text:t('Start the timer when ready','준비되면 타이머를 시작하세요')});
 const stepTitle=(s:Step)=>s.type==='weigh'?L(s.ing.name):L(s.proc.title);

 return <>
  <PageTitle eyebrow={t('Bakery workspace · Trainee training simulator','베이커리 워크스페이스 · 수습 제빵사 교육 시뮬레이터')} title={t('See the bench through the trainee’s glasses.','수습 제빵사의 안경으로 작업대를 보세요.')}>{t('AI glasses guide a new baker step by step: what to pick up, how much to pour, and when the dough is ready. This is a simulated view with representative recipes. There is no real camera or computer vision.','AI 안경이 신입 제빵사에게 무엇을 집을지, 얼마나 부을지, 반죽이 언제 준비되는지 단계별로 안내합니다. 대표 레시피를 사용한 시뮬레이션 화면이며 실제 카메라나 컴퓨터 비전은 없습니다.')}</PageTitle>

  <div className="trainee-toolbar">
   <div className="chips">{recipes.map(r=><button key={r.id} className={r.id===recipeId?'selected':''} onClick={()=>reset(r.id,batch)}>{lang==='ko'?r.ko:r.name}<small>{lang==='ko'?r.name:r.ko}</small></button>)}</div>
   <label>{t('Batch','배치')}<select value={batch} onChange={e=>reset(recipeId,+e.target.value)}>{[1,2,3].map(b=><option key={b} value={b}>{t(`${recipes[0].pieces*b} pieces (×${b})`,`${recipes[0].pieces*b}개 (×${b})`)}</option>)}</select></label>
   <button className="trainee-reset" onClick={()=>reset()}><RotateCcw size={15}/>{t('Restart','처음부터')}</button>
  </div>

  <div className="trainee-layout">
   <section className="trainee-view" aria-label={t('Simulated AI glasses view','AI 안경 시뮬레이션 화면')}>
    <div className="glasses-frame">
     <div className="glasses-feed">
      <img key={photo.src} className={`feed-photo ${step.type==='process'&&step.proc.kind==='proof'&&running?'is-rising':''}`} src={`/assets/photos/${photo.src}`} alt={step.type==='weigh'?t(`Camera view: ${locating?'ingredients on the bench':'prep bowl on the scale'}`,`카메라 화면: ${locating?'작업대 위 재료':'저울 위 준비 볼'}`):t(`Camera view: ${L(step.proc.title)}`,`카메라 화면: ${L(step.proc.title)}`)}/>
      <div className="feed-grade" aria-hidden="true"/>

      {/* Object detection while locating the ingredient */}
      {locating&&step.type==='weigh'&&(Object.keys(zones) as Zone[]).map(z=>{const on=zoneOf[step.ing.station]===z;return <div key={z} className={`ar-box ${on?'is-target':''}`} style={pct(zones[z].box)}><span>{on?`${t('TAKE','가져오기')} · ${ingName}`:L(zones[z].name)}</span></div>})}
      {locating&&step.type==='weigh'&&<div className="ar-card ar-locate"><small>{t('NEXT INGREDIENT','다음 재료')}</small><b>{ingName}</b><span>{L(locationOf[step.ing.station])}</span></div>}

      {/* Bowl lock + live scale while pouring */}
      {step.type==='weigh'&&!locating&&<>
       <div className={`ar-box is-target is-bowl ${inRange?'is-good':over?'is-bad':''}`} style={pct(BOWL)}><span>{t('PREP BOWL · SCALE LINKED','준비 볼 · 저울 연결됨')}</span></div>
       {pouring&&<div className="ar-pour" style={{left:`${BOWL.x+BOWL.w/2}%`,top:'0%',height:`${BOWL.y+BOWL.h*.45}%`}} aria-hidden="true"/>}
       
      </>}

      {step.type==='weigh'&&!locating&&<div className="ar-card ar-scale">
       <svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="32" fill="none" stroke="#ffffff26" strokeWidth="7"/><circle cx="40" cy="40" r="32" fill="none" stroke={over?'#ff8a7a':'#8dffc0'} strokeWidth="7" strokeLinecap="round" strokeDasharray={`${Math.min(1,current/target)*201} 201`} transform="rotate(-90 40 40)"/><text x="40" y="45" textAnchor="middle">{Math.round(Math.min(999,current/target*100))}%</text></svg>
       <div><small>{t('SCALE','저울')}</small><b className={over?'bad':inRange?'good':''}>{Math.round(current)} g</b><small>{t('TARGET','목표')} {target} g · ±3%</small><small>{t('BAKER’S %','베이커스 %')} {(step.ing.grams/flour*100).toFixed(1)}%</small></div>
      </div>}

      {step.type==='process'&&<div className="ar-card ar-timer">
       <small>{L(step.proc.title).toUpperCase()}</small>
       <b>{mmss(Math.max(0,procMinutes*60-(elapsed[index]??0)))}</b>
       <span className="ar-bar"><span style={{width:`${progress*100}%`,background:'#8dffc0',opacity:procDone?1:.75}}/></span>
       <small>{step.proc.kind==='divide'?`${pieces} × ${pieceWeight} g`:step.proc.temp?L(step.proc.temp):t('Demo runs at 60× speed','데모는 60배속으로 진행')}</small>
      </div>}
      {step.type==='process'&&step.proc.kind==='divide'&&<div className="ar-card ar-pieces">{Array.from({length:Math.min(pieces,12)},(_,i)=>{const show=progress*Math.min(pieces,12)>i;const w=pieceWeight+((i*7)%5)-2;return <span key={i} className={show?'is-on':''}>{show?`${w} g`:'—'}</span>})}</div>}
      {step.type==='process'&&(step.proc.kind==='mix'||step.proc.kind==='knead')&&<div className="ar-box is-target is-soft" style={pct(step.proc.kind==='mix'?{x:18,y:36,w:17,h:20}:{x:40,y:52,w:30,h:30})}><span>{step.proc.kind==='mix'?t('Mixer · speed 1','믹서 · 1단'):t('Dough','반죽')}</span></div>}
      {step.type==='process'&&step.proc.kind==='divide'&&<><div className="ar-box is-target" style={pct({x:52,y:62,w:28,h:23})}><span>{t('Scale','저울')} · {pieceWeight} g</span></div></>}

      <div className="hud-top"><span className="hud-rec"/>{t('TRAINEE VIEW · STATION 2','수습 화면 · 2번 스테이션')}<span className="hud-step">{t('STEP','단계')} {index+1}/{steps.length}</span></div>
      <div className={`hud-status is-${hudStatus.tone}`}>{hudStatus.tone==='good'?<Check size={15}/>:hudStatus.tone==='bad'?<Info size={15}/>:<Sparkles size={15}/>}{hudStatus.text}</div>
      <span className="feed-credit">{t('Photo','사진')}: {photo.credit}</span>
     </div>
     <div className="hud-caption" key={`${index}-${lang}`}><Glasses size={16}/><span>{step.type==='weigh'?t(`Take the ${ingName.toLowerCase()} and pour ${target} g into the bowl. ${step.ing.tip[0]}`,`${ingName}을(를) 가져와 볼에 ${target} g 부으세요. ${step.ing.tip[1]}`):L(step.proc.say)}</span></div>
    </div>

    <div className="trainee-controls">
     <button onClick={()=>go(-1)} disabled={index===0}><ChevronLeft size={17}/>{t('Back','이전')}</button>
     {step.type==='weigh'?<>
      <button className={`trainee-pour ${pouring?'is-pouring':''}`} {...holdProps}><Hand size={17}/>{pouring?t('Pouring…','붓는 중…'):t('Hold to pour','누르고 있으면 붓기')}</button>
      <button className="trainee-secondary" onClick={()=>setPoured(p=>({...p,[index]:0}))} disabled={!current}><RotateCcw size={15}/>{t('Empty bowl','볼 비우기')}</button>
      <button className="trainee-secondary" onClick={()=>setPoured(p=>({...p,[index]:target}))}>{t('Auto-measure','자동 계량')}</button>
     </>:<button className="trainee-pour" onClick={()=>setRunning(r=>!r)} disabled={procDone}>{running?<><Pause size={17}/>{t('Pause','일시정지')}</>:<><Play size={17}/>{procDone?t('Timer done','타이머 완료'):(elapsed[index]??0)?t('Resume timer','타이머 계속'):t('Start timer','타이머 시작')}</>}</button>}
     <button className="trainee-next" onClick={()=>go(1)} disabled={!canAdvance||index===steps.length-1}>{t('Next','다음')}<ChevronRight size={17}/></button>
    </div>
    {step.type==='process'&&<div className="trainee-checks"><span><Timer size={15}/>{t('Glasses checklist','안경 체크리스트')}</span>{step.proc.checks.map((c,i)=><label key={c[0]}><input type="checkbox" disabled={!procDone} checked={!!ticked[`${index}:${i}`]} onChange={e=>setTicked(x=>({...x,[`${index}:${i}`]:e.target.checked}))}/>{L(c)}</label>)}{!procDone&&<small>{t('Checks unlock when the timer finishes.','타이머가 끝나면 체크할 수 있습니다.')}</small>}</div>}
   </section>

   <aside className="trainee-side">
    <div className="trainee-card">
     <div className="trainee-card-head"><h2>{lang==='ko'?recipe.ko:recipe.name}</h2><span>{t(`${completed}/${steps.length} done`,`${completed}/${steps.length} 완료`)}</span></div>
     <div className="trainee-progress"><span style={{width:`${completed/steps.length*100}%`}}/></div>
     <ol className="trainee-steps">{steps.map((s,i)=><li key={i}><button className={`${i===index?'is-current':''} ${stepDone(i)?'is-done':''}`} onClick={()=>setIndex(i)}><span className="trainee-dot">{stepDone(i)?<Check size={12}/>:i+1}</span><span>{stepTitle(s)}</span><small>{s.type==='weigh'?`${Math.round(s.ing.grams*batch)} g`:t(`${s.proc.minutes} min`,`${s.proc.minutes}분`)}</small></button></li>)}</ol>
    </div>
    <div className="trainee-card">
     <h3>{t('Mixing proportions','배합 비율')}</h3>
     <p className="trainee-note">{t('Baker’s percentage: every ingredient is measured relative to flour (flour = 100%).','베이커스 퍼센트: 모든 재료를 밀가루 대비 비율로 계량합니다 (밀가루 = 100%).')}</p>
     <table className="trainee-table"><thead><tr><th>{t('Ingredient','재료')}</th><th>{t('Grams','그램')}</th><th>%</th></tr></thead><tbody>{recipe.ingredients.map(i=><tr key={i.name[0]}><td>{L(i.name)}</td><td>{Math.round(i.grams*batch)}</td><td><span className="trainee-bar" style={{'--w':`${Math.min(100,i.grams/flour*100)}%`} as React.CSSProperties}/>{(i.grams/flour*100).toFixed(1)}</td></tr>)}</tbody><tfoot><tr><td>{t('Total dough','총 반죽')}</td><td>{totalDough}</td><td>{pieces} × {pieceWeight} g</td></tr></tfoot></table>
    </div>
    <p className="trainee-disclaimer"><Thermometer size={14}/>{t('Representative training recipes and stock photography for demonstration only. These are not Sungsimdang’s recipes or kitchens, and the glasses overlay is a simulation, not real detection.','데모용 대표 레시피와 참고 사진입니다. 성심당의 레시피나 주방이 아니며, 안경 오버레이는 실제 감지가 아닌 시뮬레이션입니다.')}</p>
   </aside>
  </div>
 </>;
}
