import {useState} from 'react';
import {ScanText,Trash2,ArrowUpToLine,CheckCheck,ShieldCheck,Thermometer,TriangleAlert,Clock} from 'lucide-react';
import {useDemo} from './State';
import {product} from '../data/catalog';
import {productPhotos} from '../data/productPhotos';
import {formatTime,formatClock} from '../services/forecast';
import {useLang} from '../i18n';
import './Quality.css';

type Tx=[string,string];
type Box={x:number;y:number;w:number;h:number};
type Lot={id:string;name:Tx;short?:Tx;kind:'ingredient'|'product';product?:string;location:Tx;lot:string;made:string;expires:string;qty:Tx;source:'ocr'|'log';box?:Box;yearMissing?:boolean};

const H=3600000;
/* Fixture lots. Dates are KST; the demo clock starts 20 Nov 2026, 10:00. */
const lots:Lot[]=[
 {id:'milk',short:['Milk','우유'],name:['Milk · PURA Light Start 2 L','우유 · PURA 라이트 스타트 2 L'],kind:'ingredient',location:['Walk-in fridge · Shelf 1','워크인 냉장고 · 1단'],lot:'CH7A111',made:'2026-04-20T08:00',expires:'2026-05-04T23:59',qty:['2 L','2 L'],source:'ocr',yearMissing:true,box:{x:36,y:1,w:27,h:81}},
 {id:'flour',short:['Flour','밀가루'],name:['Plain flour 1 kg','중력분 1 kg'],kind:'ingredient',location:['Dry store · Bin B2','건조 창고 · B2'],lot:'F-2231',made:'2026-09-14T00:00',expires:'2027-03-14T23:59',qty:['6 bags','6봉'],source:'log',box:{x:1,y:17,w:35,h:75}},
 {id:'sugar',short:['Sugar','설탕'],name:['White sugar 2 kg','백설탕 2 kg'],kind:'ingredient',location:['Dry store · Bin B4','건조 창고 · B4'],lot:'S-0912',made:'2026-08-01T00:00',expires:'2028-01-31T23:59',qty:['4 bags','4봉'],source:'log',box:{x:63,y:16,w:34,h:50}},
 {id:'butter',short:['Butter','버터'],name:['Unsalted butter 250 g','무염 버터 250 g'],kind:'ingredient',location:['Walk-in fridge · Shelf 2','워크인 냉장고 · 2단'],lot:'B-7710',made:'2026-10-25T00:00',expires:'2026-11-22T23:59',qty:['9 blocks','9개'],source:'log',box:{x:55,y:66,w:17,h:26}},
 {id:'eggs',short:['Eggs','달걀'],name:['Eggs (large)','달걀 (특란)'],kind:'ingredient',location:['Walk-in fridge · Shelf 2','워크인 냉장고 · 2단'],lot:'E-3302',made:'2026-11-06T00:00',expires:'2026-11-21T23:59',qty:['60 eggs','60개'],source:'log',box:{x:21,y:83,w:39,h:17}},
 {id:'bp',short:['Baking powder','베이킹파우더'],name:['Baking powder','베이킹파우더'],kind:'ingredient',location:['Dry store · Shelf A','건조 창고 · A단'],lot:'BP-118',made:'2026-02-10T00:00',expires:'2027-08-31T23:59',qty:['3 tubs','3통'],source:'log',box:{x:71,y:64,w:26,h:36}},
 {id:'p-soboro',name:['Fried Soboro · display batch','튀김소보로 · 진열 배치'],kind:'product',product:'soboro',location:['Main Store · Display 1','본점 · 진열대 1'],lot:'KB-1120-07',made:'2026-11-20T07:00',expires:'2026-11-20T20:00',qty:['48 pcs','48개'],source:'log'},
 {id:'p-salt',name:['Salt Butter Bread · display batch','소금빵 · 진열 배치'],kind:'product',product:'salt',location:['Main Store · Display 2','본점 · 진열대 2'],lot:'KB-1120-06',made:'2026-11-20T06:30',expires:'2026-11-20T16:00',qty:['30 pcs','30개'],source:'log'},
 {id:'p-strawberry',name:['Strawberry Siru Cake','딸기시루'],kind:'product',product:'strawberry',location:['Cake fridge · Rack 1','케이크 냉장고 · 1번 랙'],lot:'KC-1119-03',made:'2026-11-19T06:00',expires:'2026-11-20T22:00',qty:['8 cakes','8개'],source:'log'},
 {id:'p-milk',name:['Pure Milk Roll','순수롤'],kind:'product',product:'milk',location:['Cake fridge · Rack 2','케이크 냉장고 · 2번 랙'],lot:'KC-1118-05',made:'2026-11-18T06:00',expires:'2026-11-20T12:00',qty:['6 rolls','6개'],source:'log'},
 {id:'p-mango',name:['Mango Siru Cake','망고시루'],kind:'product',product:'mango',location:['Cake fridge · Rack 3','케이크 냉장고 · 3번 랙'],lot:'KC-1118-02',made:'2026-11-18T06:00',expires:'2026-11-19T22:00',qty:['2 cakes','2개'],source:'log'},
];
const at=(s:string)=>Date.parse(`${s}:00+09:00`);
const yearOf=(ms:number)=>new Date(ms+9*H).getUTCFullYear();
type Status='expired'|'now'|'soon'|'ok'|'check';
function statusOf(l:Lot,now:number,confirmed:boolean):Status{
 if(l.yearMissing&&!confirmed)return 'check';
 const left=at(l.expires)-now;
 if(left<=0)return 'expired';
 if(left<=6*H)return 'now';
 if(left<=48*H)return 'soon';
 return 'ok';
}
const OCR:Box={x:39.5,y:36.5,w:21,h:4.5};

export function Quality(){
 const {state}=useDemo(),{lang,t}=useLang();
 const L=(x:Tx)=>lang==='ko'?x[1]:x[0];
 const [scanning,setScanning]=useState(false),[scanned,setScanned]=useState(false);
 const [discarded,setDiscarded]=useState<{id:string;at:number}[]>([]),[fifo,setFifo]=useState<string[]>([]),[confirmed,setConfirmed]=useState<string[]>([]);
 const [filter,setFilter]=useState<'all'|'ingredient'|'product'>('all');
 const now=state.now;
 const active=lots.filter(l=>!discarded.some(d=>d.id===l.id));
 const st=(l:Lot)=>statusOf(l,now,confirmed.includes(l.id));
 const rank:Record<Status,number>={expired:0,check:1,now:2,soon:3,ok:4};
 const rows=active.filter(l=>filter==='all'||l.kind===filter).sort((a,b)=>rank[st(a)]-rank[st(b)]||at(a.expires)-at(b.expires));
 const counts={expired:active.filter(l=>st(l)==='expired').length,due:active.filter(l=>['now','soon'].includes(st(l))&&at(l.expires)-now<=24*H).length,check:active.filter(l=>st(l)==='check').length};
 const nextUp=active.filter(l=>at(l.expires)>now).sort((a,b)=>at(a.expires)-at(b.expires))[0];
 const label:Record<Status,Tx>={expired:['Expired','유통기한 지남'],now:['Use now','즉시 사용'],soon:['Use soon','곧 만료'],ok:['OK','양호'],check:['Confirm date','날짜 확인 필요']};
 const left=(l:Lot)=>{const ms=at(l.expires)-now,abs=Math.abs(ms),d=Math.floor(abs/86400000),h=Math.floor(abs%86400000/H),m=Math.floor(abs%H/60000);const span=d?t(`${d}d ${h}h`,`${d}일 ${h}시간`):h?t(`${h}h ${m}m`,`${h}시간 ${m}분`):t(`${m}m`,`${m}분`);return ms<=0?t(`${span} ago`,`${span} 지남`):t(`in ${span}`,`${span} 남음`)};
 function scan(){if(scanning)return;setScanned(false);setScanning(true);const done=()=>{setScanning(false);setScanned(true)};if(matchMedia('(prefers-reduced-motion: reduce)').matches)done();else setTimeout(done,1500)}
 const visible=active.filter(l=>l.box);
 const milk=lots[0],milkStatus=st(milk);

 return <section className="panel section qc">
  <span className="eyebrow">{t('Quality control · food safety','품질 관리 · 식품 안전')}</span>
  <h2>{t('Catch expiring stock before it reaches a customer.','유통기한이 임박한 재고를 고객에게 가기 전에 잡아내세요.')}</h2>
  <p>{t('Staff glasses read printed date labels, and every lot is checked against the demo clock. Expired items are pulled, items close to expiry move to the front (first in, first out).','직원 안경이 인쇄된 날짜 라벨을 읽고, 모든 로트를 데모 시계와 비교합니다. 유통기한이 지난 상품은 폐기하고, 임박한 상품은 앞으로 옮깁니다 (선입선출).')}</p>

  <div className="qc-kpis">
   <div className={counts.expired?'is-bad':''}><TriangleAlert size={18}/><span>{t('Expired · pull now','유통기한 지남 · 즉시 회수')}</span><b>{counts.expired}</b></div>
   <div className={counts.due?'is-warn':''}><Clock size={18}/><span>{t('Due within 24 h','24시간 내 만료')}</span><b>{counts.due}</b></div>
   <div className={counts.check?'is-warn':''}><ScanText size={18}/><span>{t('Labels to confirm','확인 필요한 라벨')}</span><b>{counts.check}</b></div>
   <div><ShieldCheck size={18}/><span>{t('Next expiry','다음 만료')}</span><b className="qc-small">{nextUp?`${L(nextUp.name).split(' · ')[0]} · ${formatClock(at(nextUp.expires))}`:'—'}</b></div>
   <div className="is-good"><Thermometer size={18}/><span>{t('Cold storage','냉장 보관')}</span><b className="qc-small">{t('Walk-in 3.4 °C · Cake 2.8 °C','워크인 3.4 °C · 케이크 2.8 °C')}</b></div>
  </div>

  <div className="qc-scan">
   <div className="qc-feed">
    <img src="/assets/photos/training/ingredients.webp" alt={t('Ingredient shelf seen through staff glasses','직원 안경으로 본 재료 선반')}/>
    <div className="qc-grade" aria-hidden="true"/>
    <div className="qc-top"><span><span className="qc-rec"/>{t('STAFF GLASSES · DATE LABEL SCAN','직원 안경 · 날짜 라벨 스캔')}</span><span>{formatClock(now)} KST</span></div>
    {scanning&&<div className="qc-sweep" aria-hidden="true"/>}
    {!scanned&&!scanning&&<div className="qc-idle">{t('Look at the shelf and scan date labels','선반을 보고 날짜 라벨을 스캔하세요')}</div>}
    {scanned&&<>
     {visible.map(l=>{const s=st(l);return <div key={l.id} className={`qc-box is-${s} ${l.box!.y<8?'label-in':''}`} style={{left:`${l.box!.x}%`,top:`${l.box!.y}%`,width:`${l.box!.w}%`,height:`${l.box!.h}%`}}><span>{L(l.short!)} · {L(label[s])}</span></div>})}
     {!discarded.some(d=>d.id==='milk')&&<div className="qc-ocr" style={{left:`${OCR.x}%`,top:`${OCR.y}%`,width:`${OCR.w}%`,height:`${OCR.h}%`}}><span>OCR · “BEST BEFORE 04 MAY” · LOT CH7A111 · 91%</span></div>}
    </>}
    <span className="qc-credit">{t('Photo','사진')}: pfctdayelise · CC BY-SA 2.5</span>
   </div>
   <div className="qc-read">
    <h3>{t('Label read-out','라벨 판독 결과')}</h3>
    {!scanned?<p className="micro">{t('Run a scan to read the printed dates on the shelf. Items whose dates are not visible are matched to the receiving log.','스캔을 실행해 선반의 인쇄된 날짜를 읽으세요. 날짜가 보이지 않는 상품은 입고 기록과 대조합니다.')}</p>:<>
     {discarded.some(d=>d.id==='milk')?<p className="micro">{t('Milk lot CH7A111 was removed from the shelf.','우유 로트 CH7A111은 선반에서 회수되었습니다.')}</p>:<div className={`qc-read-card is-${milkStatus}`}>
      <small>{t('Printed text','인쇄된 문구')}</small><code>BEST BEFORE 04 MAY · CH7A111</code>
      <small>{t('Parsed date','해석된 날짜')}</small><b>{t('4 May — year not printed','5월 4일 — 연도 미표기')}</b>
      <p>{milkStatus==='check'?t('The label has no year. The system will not guess: confirm the year from the receiving log before this lot can be used.','라벨에 연도가 없습니다. 시스템은 추측하지 않습니다. 입고 기록에서 연도를 확인해야 이 로트를 사용할 수 있습니다.'):t(`Confirmed as 4 May 2026 from the receiving log: expired ${left(milk).replace(/ ago| 지남/,'')} ago.`,`입고 기록으로 2026년 5월 4일 확인: ${left(milk).replace(/ ago| 지남/,'')} 전에 만료되었습니다.`)}</p>
      {milkStatus==='check'?<button className="primary" onClick={()=>setConfirmed(c=>[...c,'milk'])}><CheckCheck size={15}/>{t('Confirm year from receiving log (2026)','입고 기록으로 연도 확인 (2026)')}</button>:milkStatus==='expired'&&<button className="primary qc-danger" onClick={()=>setDiscarded(d=>[...d,{id:'milk',at:now}])}><Trash2 size={15}/>{t('Pull and log as waste','회수 후 폐기 기록')}</button>}
     </div>}
     <p className="micro">{t('Other items: dates from the receiving log, matched by product detection.','기타 상품: 상품 인식으로 대조한 입고 기록의 날짜입니다.')}</p>
    </>}
    <button className="qc-scan-btn" disabled={scanning} onClick={scan}><ScanText size={16}/>{scanning?t('Reading labels…','라벨 판독 중…'):scanned?t('Scan again','다시 스캔'):t('Scan date labels','날짜 라벨 스캔')}</button>
   </div>
  </div>

  <div className="qc-register-head"><h3>{t('Expiry register','유통기한 관리 대장')}</h3><div className="chips">{([['all',['All','전체']],['ingredient',['Ingredients','재료']],['product',['Finished goods','완제품']]] as ['all'|'ingredient'|'product',Tx][]).map(([k,x])=><button key={k} className={filter===k?'selected':''} onClick={()=>setFilter(k)}>{L(x)}</button>)}</div></div>
  <div className="table-scroll"><table className="qc-table"><thead><tr><th>{t('Item','품목')}</th><th>{t('Lot · location','로트 · 위치')}</th><th>{t('Expires','만료')}</th><th>{t('Status','상태')}</th><th>{t('Action','조치')}</th></tr></thead><tbody>
   {rows.map(l=>{const s=st(l);return <tr key={l.id} className={`is-${s}`}>
    <td><div className="qc-item">{l.product?<img src={`/assets/photos/${productPhotos[l.product].src}`} alt=""/>:<span className="qc-ing">{L(l.name).slice(0,1)}</span>}<div><b>{l.product?(lang==='ko'?product(l.product).ko:product(l.product).name):L(l.name)}</b><small>{L(l.qty)} · {l.source==='ocr'?t('date read by OCR','OCR로 날짜 판독'):t('receiving / bake log','입고·생산 기록')}{fifo.includes(l.id)?t(' · moved to front',' · 앞으로 이동됨'):''}</small></div></div></td>
    <td><code>{l.lot}</code><small>{L(l.location)}</small></td>
    <td><b>{l.yearMissing&&!confirmed.includes(l.id)?t('4 May (year?)','5월 4일 (연도?)'):yearOf(at(l.expires))!==yearOf(now)?new Intl.DateTimeFormat(lang==='ko'?'ko-KR':'en-GB',{timeZone:'Asia/Seoul',year:'numeric',month:'short',day:'numeric'}).format(at(l.expires)):formatTime(at(l.expires),lang)}</b><small>{l.yearMissing&&!confirmed.includes(l.id)?t('needs confirmation','확인 필요'):left(l)}</small></td>
    <td><span className={`qc-pill is-${s}`}>{L(label[s])}</span></td>
    <td className="qc-actions">{s==='expired'&&<button className="qc-danger" onClick={()=>setDiscarded(d=>[...d,{id:l.id,at:now}])}><Trash2 size={14}/>{t('Discard','폐기')}</button>}
     {(s==='now'||s==='soon')&&!fifo.includes(l.id)&&<button onClick={()=>setFifo(f=>[...f,l.id])}><ArrowUpToLine size={14}/>{t('Move to front','앞으로 이동')}</button>}
     {s==='check'&&<button onClick={()=>setConfirmed(c=>[...c,l.id])}><CheckCheck size={14}/>{t('Confirm year','연도 확인')}</button>}
     {s==='ok'&&<span className="micro">—</span>}
     {(s==='now'||s==='soon')&&fifo.includes(l.id)&&<span className="micro">{t('Front of shelf','선반 앞쪽')}</span>}</td>
   </tr>})}
  </tbody></table></div>

  <div className="qc-waste"><h3>{t('Waste log','폐기 기록')}</h3>{discarded.length?<ul>{discarded.map(d=>{const l=lots.find(x=>x.id===d.id)!;return <li key={d.id}><Trash2 size={14}/><span>{l.product?(lang==='ko'?product(l.product).ko:product(l.product).name):L(l.name)}</span><code>{l.lot}</code><span>{L(l.qty)}</span><span>{formatTime(d.at,lang)} KST</span></li>})}</ul>:<p className="micro">{t('Nothing discarded yet. Discarded lots are recorded here with time and lot number for traceability.','아직 폐기된 항목이 없습니다. 폐기한 로트는 추적을 위해 시간과 로트 번호와 함께 여기에 기록됩니다.')}</p>}</div>
  <p className="micro">{t('Simulated OCR and fixture lots for demonstration. Supports HACCP-style record keeping (lot traceability, first-in-first-out, discard logs), but it is not a certified food safety system. Advance the demo clock to watch items move from OK to Use soon to Expired.','데모용 OCR 시뮬레이션과 고정 로트 데이터입니다. 로트 추적, 선입선출, 폐기 기록 등 HACCP 방식의 기록 관리를 지원하지만 인증된 식품 안전 시스템은 아닙니다. 데모 시계를 앞당기면 상품 상태가 양호 → 곧 만료 → 유통기한 지남으로 바뀌는 것을 볼 수 있습니다.')}</p>
 </section>;
}
