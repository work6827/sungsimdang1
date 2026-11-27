import {Product,stores} from '../data/catalog';
import {stockKey} from './inventory';
import type {State} from './reservations';
export type Scenario='normal'|'holiday'|'rain'|'ktx';
const MINUTE=60000;
export function velocity(p:Product,store:number,at:number,scenario:Scenario){const d=new Date(at+9*3600000),h=d.getUTCHours(),weekend=[0,6].includes(d.getUTCDay());if(h<9||h>=20)return 0;const time=h>=13&&h<17?1.35:h>=17?.8:1;return p.demand*stores[store].factor*time*(weekend?1.12:1)*(scenario==='holiday'?1.4:scenario==='rain'?.8:scenario==='ktx'?1.25:1);}
export function demandBetween(p:Product,store:number,from:number,to:number,scenario:Scenario){let sum=0;for(let t=from;t<to;){const end=Math.min(to,Math.floor(t/3600000)*3600000+3600000);sum+=velocity(p,store,t,scenario)*(end-t)/3600000;t=end;}return sum;}
export function allocated(s:State,p:string,store:number){return s.passes.filter(r=>r.product===p&&r.store===store&&r.status==='active').length;}
export function grossStock(s:State,p:Product,store:number,at=s.now){const r=s.inventory[stockKey(p.id,store)];return Math.max(allocated(s,p.id,store),r.count-demandBetween(p,store,r.at,Math.max(r.at,at),s.scenario));}
export function forecast(p:Product,store:number,at:number,scenario:Scenario,state?:State){
 const fallbackAt=Date.parse('2026-11-20T10:00:00+09:00');const r=state?.inventory[stockKey(p.id,store)]??{count:p.stock[store],at:fallbackAt};
 const reserved=state?allocated(state,p.id,store):0,start=r.at,free=Math.max(0,r.count-reserved),used=demandBetween(p,store,start,Math.max(start,at),scenario),remaining=Math.max(0,free-used);
 const demand=demandBetween(p,store,at,at+2*3600000,scenario);const odds=remaining<1?0:Math.min(98,Math.round(remaining/Math.max(1,demand*1.4)*95));
 let soldOut:number|null=null;if(free<1)soldOut=start;else{let left=free;for(let t=start;t<start+3*86400000;t+=MINUTE){left-=velocity(p,store,t,scenario)/60;if(left<=0){soldOut=t+MINUTE;break;}}}
 const replenishment=Math.max(0,Math.ceil(demand+Math.max(2,p.demand*.3)-remaining));
 return {odds,remaining:Math.floor(remaining),confirmed:r.count,allocated:reserved,demand:Math.ceil(demand),replenishment,soldOut,historical:at<r.at,level:odds>=70?'High':odds>=40?'Moderate':'Low',range:[Math.max(0,odds-12),Math.min(100,odds+12)],reason:scenario==='holiday'?'Holiday scenario: sample sales velocity is 40% higher.':scenario==='rain'?'Rain scenario: sample foot traffic is 20% lower, an unvalidated assumption.':scenario==='ktx'?'KTX-arrival scenario: sample demand is 25% higher; no live train data.':'Based on confirmed sample stock and hourly demand. Afternoon demand is 35% higher.'};
}
export function kstDate(t:number){return new Date(t+9*3600000).toISOString().slice(0,10)}
export function atKst(date:string,hour:string){return Date.parse(`${date}T${hour}:00+09:00`)}
export function formatTime(t:number,lang:'en'|'ko'='en'){return new Intl.DateTimeFormat(lang==='ko'?'ko-KR':'en-GB',{timeZone:'Asia/Seoul',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(t)}
/** Clock time only (HH:MM, KST). */
export function formatClock(t:number){return new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(t)}
export function sellOutLabel(t:number|null,lang:'en'|'ko'='en'){return t===null?(lang==='ko'?'3일 시뮬레이션 이후':'Beyond 3-day simulation'):`${formatTime(t,lang)} KST`}
