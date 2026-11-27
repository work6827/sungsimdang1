import {product} from '../data/catalog';
import {forecast} from './forecast';
import type {State} from './reservations';
export type TaskStatus='Recommended'|'Approved'|'In Production'|'Completed'|'Received by Store';
export type KitchenTask={id:string;product:string;store:number;quantity:number;batchSize:number;leadMinutes:number;station:string;target:number;status:TaskStatus;reason:string};
export function productionPlan(s:State,id:string,store:number){
 const p=product(id),f=forecast(p,store,s.now,s.scenario,s),batchSize=p.category==='Cake'?6:12,leadMinutes=p.category==='Cake'?90:45;
 const station=p.category==='Cake'?'Pastry station':'Bread oven';
 const pending=s.tasks.filter(t=>t.product===id&&t.store===store&&t.status!=='Received by Store').reduce((n,t)=>n+t.quantity,0);
 const occupied=s.tasks.filter(t=>t.station===station&&['Approved','In Production'].includes(t.status)).reduce((n,t)=>n+t.quantity,0);
 const capacity=Math.max(0,48-occupied),target=s.now+leadMinutes*60000,hour=new Date(target+9*3600000).getUTCHours();
 const needed=Math.max(0,f.replenishment-pending),quantity=hour>=20||hour<9?0:Math.min(Math.floor(capacity/batchSize)*batchSize,Math.ceil(needed/batchSize)*batchSize);
 return {quantity,batchSize,leadMinutes,station,target,capacity,reason:hour>=20||hour<9?'Cannot finish within demo opening hours (09:00–20:00).':!capacity?'Station capacity is committed.':pending?'Pending production already covers some or all demand.':`${f.demand} expected sales over two hours; ${f.remaining} free units after ${f.allocated} reservations.`,pending};
}
