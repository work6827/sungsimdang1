import {initialState,State} from './reservations';
const KEY='sungsimdang-passport-v3';
export function loadState():State{try{const raw=localStorage.getItem(KEY);if(!raw)return initialState();const s=JSON.parse(raw);if(s.version!==3||!s.inventory||!Array.isArray(s.inventoryUpdates)||!Array.isArray(s.acknowledgments)||!Array.isArray(s.passes)||!Array.isArray(s.waitlist)||!Array.isArray(s.stamps)||!Array.isArray(s.donations)||!Array.isArray(s.events)||!Number.isFinite(s.now)||!Number.isFinite(s.sequence)||!['alex','mina','joon'].includes(s.profile)||!['normal','holiday','rain','ktx'].includes(s.scenario))return initialState();return s;}catch{return initialState();}}
export function saveState(s:State){try{localStorage.setItem(KEY,JSON.stringify(s));return true}catch{return false}}
