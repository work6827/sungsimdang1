import {useEffect,useMemo,useRef,useState} from 'react';
import {Glasses,ChevronLeft,ChevronRight,RotateCcw,Check,Hand,Timer,Thermometer,Info,Play,Pause,Sparkles} from 'lucide-react';
import {PageTitle} from './UI';
import './Trainee.css';

/* ---------- Representative training recipes (illustrative, not Sungsimdang recipes) ---------- */
type Station='flour'|'sugar'|'salt'|'yeast'|'milk'|'water'|'eggs'|'butter';
type Ingredient={station:Station;name:string;grams:number;tip:string};
type Process={kind:'mix'|'knead'|'proof'|'divide'|'finish';title:string;say:string;minutes:number;checks:string[];temp?:string};
type Recipe={id:string;name:string;ko:string;pieces:number;ingredients:Ingredient[];process:Process[]};

const recipes:Recipe[]=[
 {id:'soboro',name:'Soboro bun dough',ko:'소보로빵 반죽',pieces:12,ingredients:[
  {station:'flour',name:'Bread flour',grams:500,tip:'Scoop gently. Do not pack the flour into the scoop.'},
  {station:'sugar',name:'Sugar',grams:75,tip:'Keep sugar on the opposite side of the bowl from the yeast.'},
  {station:'salt',name:'Salt',grams:8,tip:'Small amount. Pour slowly, a few grams makes a big difference.'},
  {station:'yeast',name:'Instant yeast',grams:10,tip:'Add away from the salt. Salt touching yeast slows it down.'},
  {station:'eggs',name:'Whole egg',grams:50,tip:'About one large egg. Crack into a cup first to check for shell.'},
  {station:'milk',name:'Milk (cool)',grams:275,tip:'Cool milk keeps the final dough near 26 °C.'},
  {station:'butter',name:'Butter (soft)',grams:50,tip:'Add after the first mix so gluten can start forming.'},
 ],process:[
  {kind:'mix',title:'First mix',say:'Mixer on LOW. Combine until no dry flour remains.',minutes:3,checks:['No dry flour on the bowl walls','Butter not added yet']},
  {kind:'knead',title:'Knead to windowpane',say:'Add butter, then mixer on MEDIUM. Stop when the dough stretches thin without tearing.',minutes:8,checks:['Smooth, slightly tacky surface','Windowpane test passes'],temp:'Target dough temperature 26 °C'},
  {kind:'proof',title:'Bulk proof',say:'Cover the bowl. Proof until roughly doubled.',minutes:50,checks:['Dough roughly doubled','Finger poke springs back slowly'],temp:'Proofer 27 °C · 75% humidity'},
  {kind:'divide',title:'Divide & round',say:'Divide into equal pieces. The glasses check each piece on the scale.',minutes:10,checks:['All pieces within ±3 g','Seams tucked underneath']},
  {kind:'finish',title:'Top & fry',say:'Press into soboro crumble, final proof, then fry until deep golden.',minutes:8,checks:['Crumble covers the top evenly','Oil at 170 °C before frying'],temp:'Fryer 170 °C'},
 ]},
 {id:'salt',name:'Salt butter roll dough',ko:'소금빵 반죽',pieces:12,ingredients:[
  {station:'flour',name:'Bread flour',grams:500,tip:'Scoop gently. Do not pack the flour into the scoop.'},
  {station:'sugar',name:'Sugar',grams:40,tip:'Less sugar than sweet dough, so the crust stays crisp.'},
  {station:'salt',name:'Salt',grams:9,tip:'Small amount. Pour slowly, a few grams makes a big difference.'},
  {station:'yeast',name:'Instant yeast',grams:8,tip:'Add away from the salt.'},
  {station:'milk',name:'Milk',grams:150,tip:'Milk softens the crumb.'},
  {station:'water',name:'Water (cool)',grams:175,tip:'Use cool water if the kitchen is warm.'},
  {station:'butter',name:'Butter (soft)',grams:25,tip:'Most of the butter goes inside the roll later.'},
 ],process:[
  {kind:'mix',title:'First mix',say:'Mixer on LOW until the dough comes together.',minutes:3,checks:['No dry flour remaining']},
  {kind:'knead',title:'Knead',say:'Mixer on MEDIUM until smooth and elastic.',minutes:7,checks:['Dough pulls away from the bowl','Windowpane test passes'],temp:'Target dough temperature 25 °C'},
  {kind:'proof',title:'Rest',say:'Cover and rest so the dough relaxes before shaping.',minutes:40,checks:['Dough has relaxed and grown slightly']},
  {kind:'divide',title:'Divide & shape',say:'Divide equally. Roll each into a long teardrop around an 8 g butter stick.',minutes:15,checks:['All pieces within ±3 g','Butter fully wrapped inside']},
  {kind:'finish',title:'Salt & bake',say:'Sprinkle sea salt and bake until the bottom is crisp and golden.',minutes:13,checks:['Sea salt on every roll','Bottoms golden and crisp'],temp:'Oven 200 °C'},
 ]},
];

/* Positions of each container on the bench, in the 800×450 scene. */
const stations:Record<Station,{x:number;y:number;w:number;h:number;label:string;fill:string}>={
 flour:{x:40,y:70,w:120,h:110,label:'FLOUR',fill:'#efe6d6'},
 sugar:{x:180,y:84,w:80,h:90,label:'SUGAR',fill:'#f6f2ea'},
 salt:{x:276,y:100,w:56,h:70,label:'SALT',fill:'#e9eef0'},
 yeast:{x:346,y:100,w:56,h:70,label:'YEAST',fill:'#e8d9b4'},
 milk:{x:420,y:66,w:70,h:110,label:'MILK',fill:'#fbfbf8'},
 water:{x:506,y:66,w:70,h:110,label:'WATER',fill:'#d8ebf3'},
 eggs:{x:596,y:96,w:120,h:70,label:'EGGS',fill:'#e9dcc4'},
 butter:{x:60,y:286,w:110,h:64,label:'BUTTER',fill:'#f4dd8a'},
};
const BOWL={x:400,y:330};
const TOLERANCE=.03;

type Step={type:'weigh';ing:Ingredient}|{type:'process';proc:Process};

export function Trainee(){
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
 const procDone=step.type==='process'&&(elapsed[index]??0)>=procMinutes*60;
 const stepDone=(i:number)=>{const s=steps[i];if(s.type==='weigh'){const t=s.ing.grams*batch,p=poured[i]??0;return Math.abs(p-t)/t<=TOLERANCE}return (elapsed[i]??0)>=s.proc.minutes*60&&s.proc.checks.every((_,c)=>ticked[`${i}:${c}`])};
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

 const hudStatus=step.type==='weigh'
  ?(over?{tone:'bad',text:`Too much · remove about ${Math.round(current-target)} g`}:inRange?{tone:'good',text:'On target · within ±3%'}:current>0?{tone:'info',text:`Keep pouring · ${Math.round(target-current)} g to go`}:{tone:'info',text:`Pick up the ${step.ing.name.toLowerCase()}`})
  :(procDone?{tone:'good',text:'Timer complete · confirm the checks'}:running?{tone:'info',text:'In progress · watch the dough'}:{tone:'info',text:'Start the timer when ready'});

 return <>
  <PageTitle eyebrow="Bakery workspace · Trainee training simulator" title="See the bench through the trainee’s glasses.">AI glasses guide a new baker step by step: what to pick up, how much to pour, and when the dough is ready. This is a simulated view with representative recipes. There is no real camera or computer vision.</PageTitle>

  <div className="trainee-toolbar">
   <div className="chips">{recipes.map(r=><button key={r.id} className={r.id===recipeId?'selected':''} onClick={()=>reset(r.id,batch)}>{r.name}<small>{r.ko}</small></button>)}</div>
   <label>Batch<select value={batch} onChange={e=>reset(recipeId,+e.target.value)}>{[1,2,3].map(b=><option key={b} value={b}>{recipes[0].pieces*b} pieces (×{b})</option>)}</select></label>
   <button className="trainee-reset" onClick={()=>reset()}><RotateCcw size={15}/>Restart</button>
  </div>

  <div className="trainee-layout">
   <section className="trainee-view" aria-label="Simulated AI glasses view">
    <div className="glasses-frame">
     <svg viewBox="0 0 800 450" className="glasses-scene" role="img" aria-label={step.type==='weigh'?`Bench with ${step.ing.name} highlighted and a bowl on the scale`:`Bench showing the ${step.proc.title} step`}>
      <defs>
       <linearGradient id="bench" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c9b79c"/><stop offset="1" stopColor="#a8916f"/></linearGradient>
       <radialGradient id="vignette" cx=".5" cy=".5" r=".75"><stop offset=".6" stopColor="#000" stopOpacity="0"/><stop offset="1" stopColor="#000" stopOpacity=".55"/></radialGradient>
       <radialGradient id="dough" cx=".4" cy=".35" r=".7"><stop offset="0" stopColor="#fff6e4"/><stop offset="1" stopColor="#e7cfa3"/></radialGradient>
      </defs>
      <rect width="800" height="450" fill="url(#bench)"/>
      {Array.from({length:9},(_,i)=><line key={i} x1="0" x2="800" y1={40+i*48} y2={44+i*48} stroke="#9a835f" strokeOpacity=".25"/>)}
      {/* Containers */}
      {(Object.keys(stations) as Station[]).map(k=>{const s=stations[k];const used=recipe.ingredients.some(i=>i.station===k);const active=step.type==='weigh'&&step.ing.station===k;return <g key={k} opacity={used?1:.35}>
       <rect x={s.x+4} y={s.y+6} width={s.w} height={s.h} rx="10" fill="#000" opacity=".18"/>
       <rect x={s.x} y={s.y} width={s.w} height={s.h} rx="10" fill={s.fill} stroke={active?'#ffd27a':'#8d7656'} strokeWidth={active?3:1.5}/>
       {k==='eggs'?[0,1,2].map(i=><ellipse key={i} cx={s.x+24+i*36} cy={s.y+38} rx="13" ry="16" fill="#f7ecd9" stroke="#c8b08a"/>):<rect x={s.x+8} y={s.y+8} width={s.w-16} height={14} rx="4" fill="#000" opacity=".06"/>}
       <text x={s.x+s.w/2} y={s.y+s.h-12} textAnchor="middle" className="tg-label">{s.label}</text>
      </g>})}
      {/* Scale + bowl */}
      {!(step.type==='process'&&(step.proc.kind==='divide'||step.proc.kind==='finish'))&&<g>
      <rect x={BOWL.x-110} y={BOWL.y+40} width="220" height="56" rx="12" fill="#3b3836"/>
      <rect x={BOWL.x-44} y={BOWL.y+58} width="88" height="26" rx="5" fill="#0f1a14"/>
      <text x={BOWL.x} y={BOWL.y+77} textAnchor="middle" className="scale-digits">{step.type==='weigh'?`${Math.round(current)} g`:'—'}</text>
      <ellipse cx={BOWL.x} cy={BOWL.y+30} rx="120" ry="22" fill="#000" opacity=".2"/>
      <path d={`M${BOWL.x-118} ${BOWL.y-30} Q${BOWL.x} ${BOWL.y+80} ${BOWL.x+118} ${BOWL.y-30} Z`} fill="#d6dade" stroke="#9aa1a8" strokeWidth="2"/>
      <ellipse cx={BOWL.x} cy={BOWL.y-30} rx="118" ry="26" fill="#eef0f2" stroke="#9aa1a8" strokeWidth="2"/>
      {step.type==='weigh'&&current>0&&<ellipse cx={BOWL.x} cy={BOWL.y-26} rx={Math.min(100,30+current/target*70)} ry={Math.min(20,6+current/target*14)} fill={stations[step.ing.station].fill} stroke="#00000022" className={pouring?'pour-wobble':''}/>}
      {step.type==='process'&&<ellipse cx={BOWL.x} cy={BOWL.y-24} rx={step.proc.kind==='proof'?70+Math.min(1,(elapsed[index]??0)/(procMinutes*60))*36:70} ry={step.proc.kind==='proof'?18+Math.min(1,(elapsed[index]??0)/(procMinutes*60))*8:18} fill="url(#dough)" className={running&&step.proc.kind!=='proof'?'dough-spin':''}/>}
      </g>}
      {/* Pour stream */}
      {step.type==='weigh'&&pouring&&<path d={`M${stations[step.ing.station].x+stations[step.ing.station].w/2} ${stations[step.ing.station].y+stations[step.ing.station].h} Q${(stations[step.ing.station].x+BOWL.x)/2} ${BOWL.y-120} ${BOWL.x} ${BOWL.y-34}`} fill="none" stroke={stations[step.ing.station].fill} strokeWidth="7" strokeLinecap="round" className="pour-stream"/>}
      {/* Divide view: dough pieces on a tray */}
      {step.type==='process'&&step.proc.kind==='divide'&&<g>{Array.from({length:Math.min(pieces,18)},(_,i)=>{const show=(elapsed[index]??0)/(procMinutes*60)*Math.min(pieces,18)>i;return <g key={i} opacity={show?1:.15}><circle cx={250+(i%9)*38} cy={250+Math.floor(i/9)*40} r="15" fill="url(#dough)" stroke="#c6a774"/>{show&&<text x={250+(i%9)*38} y={254+Math.floor(i/9)*40} textAnchor="middle" className="piece-g">{pieceWeight+((i*7)%5)-2}</text>}</g>})}</g>}
      {step.type==='process'&&step.proc.kind==='finish'&&<g><rect x="250" y="210" width="300" height="120" rx="14" fill="#2a2522"/><rect x="266" y="226" width="268" height="88" rx="8" fill={running||procDone?'#ff9d3a':'#4a3f37'} opacity={running?.85:procDone?.6:1} className={running?'oven-glow':''}/>{Array.from({length:6},(_,i)=><circle key={i} cx={296+i*42} cy="270" r="15" fill={procDone?'#b8742f':'#e6c48f'}/>)}</g>}
      <rect width="800" height="450" fill="url(#vignette)"/>

      {/* ---------- AR HUD ---------- */}
      {step.type==='weigh'&&(()=>{const s=stations[step.ing.station];const pad=10;return <g className="hud">
       <g className="hud-target">
        {[[s.x-pad,s.y-pad,1,1],[s.x+s.w+pad,s.y-pad,-1,1],[s.x-pad,s.y+s.h+pad,1,-1],[s.x+s.w+pad,s.y+s.h+pad,-1,-1]].map(([x,y,dx,dy],i)=><path key={i} d={`M${x} ${y+18*dy} V${y} H${x+18*dx}`} fill="none" stroke="#ffd27a" strokeWidth="3.5"/>)}
       </g>
       <g transform={`translate(${Math.min(640,s.x)} ${s.y+s.h+pad+10})`}>
        <rect width="150" height="26" rx="6" className="hud-chip"/>
        <text x="10" y="18" className="hud-chip-text">TAKE · {step.ing.name.toUpperCase()}</text>
       </g>
       {!current&&<path d={`M${s.x+s.w/2} ${s.y+s.h+50} Q${(s.x+BOWL.x)/2+40} ${BOWL.y-40} ${BOWL.x-60} ${BOWL.y-46}`} fill="none" stroke="#ffd27a" strokeWidth="2.5" strokeDasharray="7 7" className="hud-arrow" markerEnd=""/>}
      </g>})()}
      {step.type==='weigh'&&<g className="hud" transform={`translate(${BOWL.x+140} ${BOWL.y-90})`}>
       <rect width="150" height="132" rx="12" className="hud-panel"/>
       <circle cx="44" cy="52" r="30" fill="none" stroke="#ffffff22" strokeWidth="7"/>
       <circle cx="44" cy="52" r="30" fill="none" stroke={over?'#ff7a6b':inRange?'#7ee2a8':'#ffd27a'} strokeWidth="7" strokeLinecap="round" strokeDasharray={`${Math.min(1,current/target)*188.5} 188.5`} transform="rotate(-90 44 52)"/>
       <text x="44" y="57" textAnchor="middle" className="hud-big">{Math.round(Math.min(999,current/target*100))}%</text>
       <text x="86" y="40" className="hud-small">TARGET</text>
       <text x="86" y="58" className="hud-mid">{target} g</text>
       <text x="86" y="78" className="hud-small">BAKER’S %</text>
       <text x="86" y="96" className="hud-mid">{(step.ing.grams/flour*100).toFixed(1)}%</text>
       <text x="12" y="120" className="hud-small">±3% = {Math.round(target*(1-TOLERANCE))}–{Math.round(target*(1+TOLERANCE))} g</text>
      </g>}
      {step.type==='process'&&<g className="hud" transform="translate(600 210)">
       <rect width="180" height="118" rx="12" className="hud-panel"/>
       <text x="14" y="26" className="hud-small">{step.proc.title.toUpperCase()}</text>
       <text x="14" y="62" className="hud-big hud-timer">{mmss(Math.max(0,procMinutes*60-(elapsed[index]??0)))}</text>
       <rect x="14" y="76" width="152" height="6" rx="3" fill="#ffffff22"/>
       <rect x="14" y="76" width={152*Math.min(1,(elapsed[index]??0)/(procMinutes*60))} height="6" rx="3" fill={procDone?'#7ee2a8':'#ffd27a'}/>
       <text x="14" y="104" className="hud-small">{step.proc.kind==='divide'?`${pieces} × ${pieceWeight} g`:step.proc.temp?.replace(/^Target dough temperature /,'Dough ')??'Demo runs at 60× speed'}</text>
      </g>}
     </svg>

     {/* HUD chrome rendered in HTML so text stays crisp at every size */}
     <div className="hud-top"><span className="hud-rec"/>TRAINEE VIEW · STATION 2<span className="hud-step">STEP {index+1}/{steps.length}</span></div>
     <div className={`hud-status is-${hudStatus.tone}`}>{hudStatus.tone==='good'?<Check size={15}/>:hudStatus.tone==='bad'?<Info size={15}/>:<Sparkles size={15}/>}{hudStatus.text}</div>
     <div className="hud-caption" key={index}><Glasses size={16}/><span>{step.type==='weigh'?`Take the ${step.ing.name.toLowerCase()} and pour ${target} g into the bowl. ${step.ing.tip}`:step.proc.say}</span></div>
    </div>

    <div className="trainee-controls">
     <button onClick={()=>go(-1)} disabled={index===0}><ChevronLeft size={17}/>Back</button>
     {step.type==='weigh'?<>
      <button className={`trainee-pour ${pouring?'is-pouring':''}`} {...holdProps}><Hand size={17}/>{pouring?'Pouring…':'Hold to pour'}</button>
      <button className="trainee-secondary" onClick={()=>setPoured(p=>({...p,[index]:0}))} disabled={!current}><RotateCcw size={15}/>Empty bowl</button>
      <button className="trainee-secondary" onClick={()=>setPoured(p=>({...p,[index]:target}))}>Auto-measure</button>
     </>:<button className="trainee-pour" onClick={()=>setRunning(r=>!r)} disabled={procDone}>{running?<><Pause size={17}/>Pause</>:<><Play size={17}/>{procDone?'Timer done':(elapsed[index]??0)?'Resume timer':'Start timer'}</>}</button>}
     <button className="trainee-next" onClick={()=>go(1)} disabled={!canAdvance||index===steps.length-1}>Next<ChevronRight size={17}/></button>
    </div>
    {step.type==='process'&&<div className="trainee-checks"><span><Timer size={15}/>Glasses checklist</span>{step.proc.checks.map((c,i)=><label key={c}><input type="checkbox" disabled={!procDone} checked={!!ticked[`${index}:${i}`]} onChange={e=>setTicked(t=>({...t,[`${index}:${i}`]:e.target.checked}))}/>{c}</label>)}{!procDone&&<small>Checks unlock when the timer finishes.</small>}</div>}
   </section>

   <aside className="trainee-side">
    <div className="trainee-card">
     <div className="trainee-card-head"><h2>{recipe.name}</h2><span>{completed}/{steps.length} done</span></div>
     <div className="trainee-progress"><span style={{width:`${completed/steps.length*100}%`}}/></div>
     <ol className="trainee-steps">{steps.map((s,i)=><li key={i}><button className={`${i===index?'is-current':''} ${stepDone(i)?'is-done':''}`} onClick={()=>setIndex(i)}><span className="trainee-dot">{stepDone(i)?<Check size={12}/>:i+1}</span><span>{s.type==='weigh'?s.ing.name:s.proc.title}</span><small>{s.type==='weigh'?`${Math.round(s.ing.grams*batch)} g`:`${s.proc.minutes} min`}</small></button></li>)}</ol>
    </div>
    <div className="trainee-card">
     <h3>Mixing proportions</h3>
     <p className="trainee-note">Baker’s percentage: every ingredient is measured relative to flour (flour = 100%).</p>
     <table className="trainee-table"><thead><tr><th>Ingredient</th><th>Grams</th><th>%</th></tr></thead><tbody>{recipe.ingredients.map(i=><tr key={i.name}><td>{i.name}</td><td>{Math.round(i.grams*batch)}</td><td><span className="trainee-bar" style={{'--w':`${Math.min(100,i.grams/flour*100)}%`} as React.CSSProperties}/>{(i.grams/flour*100).toFixed(1)}</td></tr>)}</tbody><tfoot><tr><td>Total dough</td><td>{totalDough}</td><td>{pieces} × {pieceWeight} g</td></tr></tfoot></table>
    </div>
    <p className="trainee-disclaimer"><Thermometer size={14}/>Representative training recipes for demonstration only. These are not Sungsimdang’s recipes, and the glasses overlay is a simulation, not real detection.</p>
   </aside>
  </div>
 </>;
}
