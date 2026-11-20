import {products,visitors} from '../data/catalog';
import {Scenario,allocated,grossStock} from './forecast';
import {Inventory,seedInventory,stockKey} from './inventory';
export type Pass={id:string;token:string;profile:string;product:string;store:number;start:number;end:number;status:'active'|'picked-up'|'expired'|'canceled'|'transferred';transfers:number;parent?:string};
export type Wait={id:string;profile:string;product:string;store:number;start:number;status:'waiting'|'assigned'|'canceled'};
export type Stamp={id:string;pass:string;profile:string;store:number;at:number};
export type State={version:3;inventory:Inventory;inventoryUpdates:{product:string;store:number;visible:number;backroom:number;at:number}[];acknowledgments:string[];now:number;profile:string;scenario:Scenario;sequence:number;passes:Pass[];waitlist:Wait[];stamps:Stamp[];donations:{pass:string;amount:number;at:number}[];events:string[]};
export const initialState=():State=>({version:3,inventory:seedInventory(Date.parse('2026-11-20T10:00:00+09:00')),inventoryUpdates:[],acknowledgments:[],now:Date.parse('2026-11-20T10:00:00+09:00'),profile:'alex',scenario:'normal',sequence:1000,passes:[],waitlist:[],stamps:[],donations:[],events:[]});
export type Action={type:'reserve'|'join';product:string;store:number;start:number}|{type:'cancel'|'expire';id:string}|{type:'transfer';id:string;recipient:string}|{type:'pickup';id:string;token:string;code:string}|{type:'advance';minutes:number}|{type:'profile';id:string}|{type:'scenario';scenario:Scenario}|{type:'leave';id:string}|{type:'reset'}|{type:'inventory';product:string;store:number;visible:number;backroom:number}|{type:'acknowledge';key:string};
const duplicate=(s:State,profile:string,product:string)=>s.passes.some(p=>p.profile===profile&&p.product===product&&p.status==='active');
const occupied=(s:State,product:string,store:number,start:number)=>s.passes.some(p=>p.product===product&&p.store===store&&['active','picked-up'].includes(p.status)&&p.start<start+1800000&&p.end>start);
function issue(s:State,profile:string,product:string,store:number,start:number,transfers=0,parent?:string){const id=`SD-${++s.sequence}`;const p:Pass={id,token:`DEMO:${id}:${profile}`,profile,product,store,start,end:start+1800000,status:'active',transfers,parent};s.passes.push(p);return p;}
function reassign(s:State,old:Pass){const start=Math.max(s.now,old.start);if(occupied(s,old.product,old.store,start)||grossStock(s,products.find(p=>p.id===old.product)!,old.store)-allocated(s,old.product,old.store)<1)return;const w=s.waitlist.find(w=>w.status==='waiting'&&w.product===old.product&&w.store===old.store&&w.start===old.start&&!duplicate(s,w.profile,w.product));if(w){w.status='assigned';const p=issue(s,w.profile,w.product,w.store,start);s.events.unshift(`Waitlist ${w.id} assigned to ${w.profile}: ${p.id}`);}}
function sweep(s:State){const expired=s.passes.filter(p=>p.status==='active'&&p.end<=s.now);for(const p of expired){p.status='expired';s.events.unshift(`${p.id} expired`);}expired.forEach(p=>reassign(s,p));}
export function transition(state:State,a:Action):{state:State;message:string}{
 if(a.type==='reset')return {state:initialState(),message:'Demo reset. All sample activity cleared.'};
 const s:State=structuredClone(state);sweep(s);
 const fail=(message:string)=>({state:s,message});let message='Updated.';
 if(a.type==='profile'){if(!visitors.some(v=>v.id===a.id))return fail('Unknown profile.');s.profile=a.id;}
 if(a.type==='scenario')s.scenario=a.scenario;
 if(a.type==='inventory'){
  if(!products.some(p=>p.id===a.product)||![0,1,2].includes(a.store)||![a.visible,a.backroom].every(n=>Number.isInteger(n)&&n>=0&&n<=500))return fail('Enter whole counts between 0 and 500 for a valid shelf.');
  if(a.visible+a.backroom<allocated(s,a.product,a.store))return fail('Confirmed stock cannot be below allocated Bread Pass units. Review active passes first.');
  s.inventory[stockKey(a.product,a.store)]={count:a.visible+a.backroom,visible:a.visible,backroom:a.backroom,at:s.now};
  s.inventoryUpdates.push({product:a.product,store:a.store,visible:a.visible,backroom:a.backroom,at:s.now});message='Staff-confirmed inventory saved. Forecasts, kitchen recommendations and assistant answers recalculated.';
 }
 if(a.type==='acknowledge'){if(!s.acknowledgments.includes(a.key))s.acknowledgments.push(a.key);message='Recommendation reviewed. No production order was placed.';}

 if(a.type==='advance'){if(!Number.isFinite(a.minutes)||a.minutes<=0)return fail('Choose a positive time advance.');s.now+=a.minutes*60000;sweep(s);message='Demo clock advanced. Expired passes and waiting visitors updated.';}
 if(a.type==='reserve'||a.type==='join'){
  if(!products.some(p=>p.id===a.product&&p.limited)||![0,1,2].includes(a.store)||!Number.isFinite(a.start)||a.start<s.now)return fail('Choose an eligible product, store and future pickup window.');
  const h=new Date(a.start+9*3600000).getUTCHours();if(h<10||h>19)return fail('Demo pickup windows run from 10:00 to 19:00 KST.');
  if(duplicate(s,s.profile,a.product))return fail('One active reservation per visitor and product. Cancel your existing pass first.');
  if(s.waitlist.some(w=>w.profile===s.profile&&w.product===a.product&&w.status==='waiting'))return fail('You are already waiting for this product. Leave the waitlist first.');
  const full=occupied(s,a.product,a.store,a.start);
  if(a.type==='reserve'){if(grossStock(s,products.find(p=>p.id===a.product)!,a.store)-allocated(s,a.product,a.store)<1)return fail('No unallocated sample stock. Ask staff to review inventory.');if(full)return fail('This demo pickup slot is full. Join the waitlist.');const p=issue(s,s.profile,a.product,a.store,a.start);message=`Demo reservation confirmed: ${p.id}`;}
  else{if(!full)return fail('A slot is available. Reserve it directly.');s.waitlist.push({id:`WL-${++s.sequence}`,profile:s.profile,product:a.product,store:a.store,start:a.start,status:'waiting'});message='Added to the waitlist. The first eligible waiting visitor receives a released pass.';}
 }
 if(['cancel','expire','transfer','pickup'].includes(a.type)&&'id' in a){
  const p=s.passes.find(p=>p.id===a.id);if(!p||p.status!=='active')return fail('This pass is no longer redeemable.');
  if(p.profile!==s.profile)return fail('Switch to the visitor who owns this pass.');
  if(a.type==='cancel'||a.type==='expire'){p.status=a.type==='cancel'?'canceled':'expired';reassign(s,p);message=`Pass ${p.status}. Any eligible waiting visitor has been reassigned.`;}
  if(a.type==='transfer'){
   if(p.transfers>=1)return fail('This pass has already used its one official transfer.');
   if(!visitors.some(v=>v.id===a.recipient)||a.recipient===p.profile)return fail('Choose another sample visitor.');
   if(duplicate(s,a.recipient,p.product))return fail('Recipient already has an active pass for this product.');
   p.status='transferred';const replacement=issue(s,a.recipient,p.product,p.store,p.start,p.transfers+1,p.id);
   s.waitlist.filter(w=>w.profile===a.recipient&&w.product===p.product&&w.status==='waiting').forEach(w=>w.status='canceled');
   s.donations.push({pass:replacement.id,amount:1000,at:s.now});message=`Original invalidated. ${replacement.id} issued to ${a.recipient}; ₩1,000 demo donation recorded. No money moved.`;
  }
  if(a.type==='pickup'){
   if(s.now<p.start||s.now>=p.end)return fail('Pickup is only available inside the stated window. Use Demo Mode to advance time.');
   if(a.token!==p.token)return fail('QR token does not match this active pass.');
   if(a.code!==visitors.find(v=>v.id===p.profile)!.code)return fail('Demo phone code does not match this visitor.');
   const item=products.find(x=>x.id===p.product)!;const key=stockKey(p.product,p.store);const updated=Math.max(0,grossStock(s,item,p.store)-1);s.inventory[key]={...s.inventory[key],count:updated,at:s.now};p.status='picked-up';if(!s.stamps.some(st=>st.pass===p.id))s.stamps.push({id:`STAMP-${p.id}`,pass:p.id,profile:p.profile,store:p.store,at:s.now});message='Pickup verified. One passport stamp awarded and your first-visit reward unlocked.';
  }
 }
 if(a.type==='leave'){const w=s.waitlist.find(w=>w.id===a.id&&w.profile===s.profile&&w.status==='waiting');if(!w)return fail('No active waitlist entry found.');w.status='canceled';message='You left the waitlist.';}
 s.events.unshift(message);s.events=s.events.slice(0,60);return {state:s,message};
}
