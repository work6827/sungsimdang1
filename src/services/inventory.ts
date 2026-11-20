import {products,Product} from '../data/catalog';
export type InventoryRecord={count:number;visible:number;backroom:number;at:number};
export type Inventory=Record<string,InventoryRecord>;
export const stockKey=(product:string,store:number)=>`${store}:${product}`;
export function seedInventory(at:number):Inventory{return Object.fromEntries(products.flatMap(p=>p.stock.map((count,store)=>[stockKey(p.id,store),{count,visible:Math.min(count,12),backroom:Math.max(0,count-12),at}])))}
export function shelfObservation(p:Product,store:number){const count=4+(products.indexOf(p)*3+store)%6;return {visible:count,confidence:store===1?74:82,reason:'Fixture-based overlay. Similar items, overlap and backroom stock are not detected.'};}
