import {product,stores} from '../data/catalog';
import {productPhotos} from '../data/productPhotos';
import {productionPlan,TaskStatus} from '../services/kitchen';
import {formatTime,formatClock} from '../services/forecast';
import {useDemo} from './State';
import {useLang,nameOf,word} from '../i18n';
import {ChefHat,Flame,Timer,PackageCheck,ClipboardCheck,CircleDashed} from 'lucide-react';
import './Kitchen.css';
const columns:[TaskStatus,typeof ChefHat][]=[['Recommended',CircleDashed],['Approved',ClipboardCheck],['In Production',Flame],['Completed',ChefHat],['Received by Store',PackageCheck]];
export function Kitchen({id,store}:{id:string;store:number}){
 const {state,act}=useDemo(),{lang,t,tm}=useLang(),plan=productionPlan(state,id,store);
 const next:Partial<Record<TaskStatus,TaskStatus>>={'Recommended':'Approved','Approved':'In Production','In Production':'Completed','Completed':'Received by Store'};
 const labels:Partial<Record<TaskStatus,string>>={'Recommended':t('Approve production','생산 승인'),'Approved':t('Start production','생산 시작'),'In Production':t('Complete production','생산 완료'),'Completed':t('Confirm Store Receipt','매장 입고 확인')};
 const used=48-plan.capacity;
 return <section className="panel section kitchen-ops">
  <figure className="kitchen-photo"><img src="/assets/photos/baker-workstation.webp" alt={t('Representative baker preparing dough at a commercial workstation','작업대에서 반죽을 준비하는 제빵사 참고 이미지')} loading="lazy"/><figcaption>{t('Representative bakery workplace · Pexels · not Sungsimdang staff','참고용 베이커리 작업장 · Pexels · 성심당 직원이 아닙니다')}</figcaption></figure>
  <span className="eyebrow">{t('Kitchen operations · simulated production','주방 운영 · 생산 시뮬레이션')}</span><h2>{t('From recommendation to receipt','추천부터 입고까지')}</h2><p>{t('Approval → production → completion → store receipt. Only confirmed receipt adds sellable inventory.','승인 → 생산 → 완료 → 매장 입고. 입고가 확인되어야만 판매 가능 재고가 늘어납니다.')}</p>

  <div className="kds-plan">
   <div className="kds-plan-main"><img src={`/assets/photos/${productPhotos[id].src}`} alt=""/><div><span className="eyebrow">{t('Next batch suggestion','다음 배치 추천')}</span><h3>{t(`${plan.quantity} units recommended`,`${plan.quantity}개 생산 추천`)}</h3><p>{nameOf(product(id),lang)} · {nameOf(stores[store],lang)}</p><p className="micro">{tm(plan.reason)}</p></div></div>
   <dl className="kds-stats">
    <div><dt>{t('Batch size','배치 크기')}</dt><dd>{plan.batchSize}</dd></div>
    <div><dt>{t('Lead time','소요 시간')}</dt><dd>{plan.leadMinutes}{t(' min','분')}</dd></div>
    <div><dt>{t('Earliest completion','가장 빠른 완료')}</dt><dd>{formatClock(plan.target)}</dd></div>
    <div><dt>{t('Pending supply','대기 중인 공급')}</dt><dd>{plan.pending}</dd></div>
    <div className="kds-capacity"><dt>{word(plan.station,lang)} · {t('capacity','용량')}</dt><dd><span className="kds-meter"><span style={{width:`${used/48*100}%`}}/></span>{used} / 48</dd></div>
   </dl>
   <button className="primary" disabled={!plan.quantity} onClick={()=>act({type:'recommend',product:id,store})}>{t('Create production recommendation','생산 추천 만들기')}</button>
  </div>

  <div className="kds-board" role="list" aria-label={t('Production board','생산 보드')}>
   {columns.map(([status,Icon])=>{const tasks=state.tasks.filter(x=>x.status===status);return <div className={`kds-col kds-${status.replace(/\s+/g,'-').toLowerCase()}`} key={status} role="listitem">
    <div className="kds-col-head"><Icon size={15}/>{word(status,lang)}<span>{tasks.length}</span></div>
    {tasks.map(task=>{const start=task.target-task.leadMinutes*60000,pct=task.status==='In Production'?Math.max(0,Math.min(1,(state.now-start)/(task.target-start))):task.status==='Recommended'||task.status==='Approved'?0:1,late=task.status==='In Production'&&state.now<task.target;return <article className="kds-ticket" key={task.id}>
     <div className="kds-ticket-head"><code>{task.id}</code><span>{word(task.station,lang)}</span></div>
     <div className="kds-ticket-body"><img src={`/assets/photos/${productPhotos[task.product].src}`} alt=""/><div><b>{nameOf(product(task.product),lang)}</b><span className="kds-qty">× {task.quantity}</span><small>{nameOf(stores[task.store],lang)}</small></div></div>
     <div className="kds-time"><Timer size={13}/>{t('Target','목표')} {formatClock(task.target)}<span>{t('Batch','배치')} {task.batchSize}</span></div>
     {task.status==='In Production'&&<span className="kds-meter is-live"><span style={{width:`${pct*100}%`}}/></span>}
     <p className="kds-reason">{tm(task.reason)}</p>
     {next[task.status]&&<button className="primary" disabled={late} onClick={()=>act({type:'task',id:task.id,status:next[task.status]!})}>{labels[task.status]}</button>}
     {late&&<button onClick={()=>act({type:'advance',minutes:(task.target-state.now)/60000})}>{t('Demo: advance to completion','데모: 완료 시간으로 이동')}</button>}
    </article>})}
    {!tasks.length&&<p className="kds-empty">—</p>}
   </div>})}
  </div>
  {!state.tasks.length&&<p className="empty">{t('No production tasks. Create a recommendation when additional stock is needed.','생산 작업이 없습니다. 추가 재고가 필요하면 추천을 만드세요.')}</p>}
  <p className="micro">{t('Simulated kitchen display. Times use the demo clock','시뮬레이션 주방 디스플레이입니다. 시간은 데모 시계 기준')}: {formatTime(state.now,lang)} KST</p>
 </section>
}
