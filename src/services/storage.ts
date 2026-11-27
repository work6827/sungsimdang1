import {initialState,State} from './reservations';
const KEY='sungsimdang-passport-v3';
export function loadState():State{
 try{
  const raw=localStorage.getItem(KEY);if(!raw)return initialState();const s=JSON.parse(raw),seed=initialState();
  if(s.version!==3||!s.inventory||!['inventoryUpdates','acknowledgments','passes','waitlist','stamps','donations','events'].every(k=>Array.isArray(s[k]))||!Number.isFinite(s.now)||!Number.isFinite(s.sequence)||!['alex','mina','joon'].includes(s.profile)||!['normal','holiday','rain','ktx'].includes(s.scenario))return seed;
  if(!Object.keys(seed.inventory).every(k=>{const r=s.inventory[k];return r&&['count','visible','backroom','at'].every(f=>Number.isFinite(r[f])&&r[f]>=0)}))return seed;
  // Migrate existing v3 reservations and passports without resetting their records.
  s.tasks=Array.isArray(s.tasks)?s.tasks:[];
  if(!s.tasks.every((t:State['tasks'][number])=>t&&seed.inventory[`${t.store}:${t.product}`]&&Number.isFinite(t.quantity)&&t.quantity>0&&Number.isFinite(t.target)&&Number.isFinite(t.leadMinutes)&&['Recommended','Approved','In Production','Completed','Received by Store'].includes(t.status)))s.tasks=[];
  s.tenantStock={...seed.tenantStock,...s.tenantStock};
  for(const key of Object.keys(seed.tenantStock))if(!Number.isInteger(s.tenantStock[key])||s.tenantStock[key]<0||s.tenantStock[key]>500)s.tenantStock[key]=seed.tenantStock[key];
  return s;
 }catch{return initialState()}
}
export function saveState(s:State){try{localStorage.setItem(KEY,JSON.stringify(s));return true}catch{return false}}
