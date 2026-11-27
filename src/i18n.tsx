import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';

export type Language='en'|'ko';
type Ctx={lang:Language;setLang:(l:Language)=>void};
const LangContext=createContext<Ctx>({lang:'en',setLang:()=>{}});

function stored():Language{try{return localStorage.getItem('passport-language')==='ko'?'ko':'en'}catch{return 'en'}}

/** Single source of truth for the site language. Persisted per browser. */
export function LangProvider({children}:{children:ReactNode}){
 const [lang,setLang]=useState<Language>(stored);
 useEffect(()=>{document.documentElement.lang=lang;try{localStorage.setItem('passport-language',lang)}catch{/* preference lasts for this session */}},[lang]);
 return <LangContext.Provider value={{lang,setLang}}>{children}</LangContext.Provider>;
}

export function useLang(){
 const {lang,setLang}=useContext(LangContext);
 const t=(en:string,ko:string)=>lang==='ko'?ko:en;
 return {lang,setLang,t,tm:(m:string)=>translateMessage(m,lang)};
}

/* ---------- Shared vocabulary ---------- */
const words:Record<string,string>={
 // availability levels
 High:'높음',Moderate:'보통',Low:'낮음',
 // product categories
 Signature:'시그니처',Bread:'빵',Cake:'케이크','Bread Pass':'브레드 패스',All:'전체',
 // pass / waitlist statuses
 active:'사용 가능','picked-up':'수령 완료',expired:'만료',canceled:'취소',transferred:'양도됨',waiting:'대기 중',assigned:'배정됨',
 // kitchen
 Recommended:'추천됨',Approved:'승인됨','In Production':'생산 중',Completed:'생산 완료','Received by Store':'매장 입고 완료',
 'Pastry station':'페이스트리 스테이션','Bread oven':'제빵 오븐',
 // scenarios
 normal:'평상시',holiday:'공휴일',rain:'비 오는 날',ktx:'KTX 도착',
};
export const word=(w:string,lang:Language)=>lang==='ko'?words[w]??w:w;

const visitorKo:Record<string,string>={alex:'알렉스',mina:'미나',joon:'준',Alex:'알렉스',Mina:'미나',Joon:'준'};
export const visitorName=(v:{id:string;name:string},lang:Language)=>lang==='ko'?visitorKo[v.id]??v.name:v.name;

/** Name helpers for any record that carries `name` + `ko`. */
export const nameOf=(x:{name:string;ko:string},lang:Language)=>lang==='ko'?x.ko:x.name;
/** Secondary label: the other language, shown underneath. */
export const altName=(x:{name:string;ko:string},lang:Language)=>lang==='ko'?x.name:x.ko;

/* ---------- Service-generated messages (toasts, event log, reasons) ---------- */
const exact:Record<string,string>={
 'Demo reset. All sample activity cleared.':'데모가 초기화되었습니다. 모든 샘플 활동이 삭제되었습니다.',
 'Saturday Demand Surge loaded at 10:20 KST. Review the Soboro shelf, then approve production.':'토요일 수요 급증 시나리오를 10:20 KST로 불러왔습니다. 소보로 진열대를 확인한 후 생산을 승인하세요.',
 'Enter a valid tenant count from 0 to 500.':'0에서 500 사이의 올바른 수량을 입력하세요.',
 'Hypothetical Hong Kong tenant updated independently.':'가상의 홍콩 테넌트가 별도로 업데이트되었습니다.',
 'Choose a valid production product and store.':'올바른 생산 상품과 매장을 선택하세요.',
 'Production recommendation saved. Staff approval is required.':'생산 추천이 저장되었습니다. 직원 승인이 필요합니다.',
 'Unknown kitchen task.':'알 수 없는 주방 작업입니다.',
 'Follow the production workflow in order.':'생산 단계를 순서대로 진행하세요.',
 'Insufficient station capacity or time before closing.':'스테이션 용량이 부족하거나 마감 전까지 시간이 부족합니다.',
 'Production lead time has not elapsed. Advance the demo clock to the target time.':'생산 소요 시간이 아직 지나지 않았습니다. 데모 시계를 목표 시간까지 앞당기세요.',
 'Unknown profile.':'알 수 없는 프로필입니다.',
 'Enter whole counts between 0 and 500 for a valid shelf.':'0에서 500 사이의 정수 수량을 입력하세요.',
 'Confirmed stock cannot be below allocated Bread Pass units. Review active passes first.':'확인된 재고는 브레드 패스에 배정된 수량보다 적을 수 없습니다. 먼저 사용 중인 패스를 확인하세요.',
 'Staff-confirmed inventory saved. Forecasts, kitchen recommendations and assistant answers recalculated.':'직원이 확인한 재고가 저장되었습니다. 예측, 주방 추천, 도우미 답변이 다시 계산되었습니다.',
 'Recommendation reviewed. No production order was placed.':'추천을 검토했습니다. 생산 주문은 실행되지 않았습니다.',
 'Choose a positive time advance.':'앞당길 시간을 양수로 선택하세요.',
 'Demo clock advanced. Expired passes and waiting visitors updated.':'데모 시계가 앞당겨졌습니다. 만료된 패스와 대기자가 업데이트되었습니다.',
 'Choose an eligible product, store and future pickup window.':'대상 상품, 매장, 이후 수령 시간을 선택하세요.',
 'Demo pickup windows run from 10:00 to 19:00 KST.':'데모 수령 시간은 10:00~19:00 KST입니다.',
 'One active reservation per visitor and product. Cancel your existing pass first.':'방문자 1인당 상품별로 하나의 예약만 가능합니다. 기존 패스를 먼저 취소하세요.',
 'You are already waiting for this product. Leave the waitlist first.':'이미 이 상품의 대기 명단에 있습니다. 먼저 대기를 취소하세요.',
 'No unallocated sample stock. Ask staff to review inventory.':'배정 가능한 샘플 재고가 없습니다. 직원에게 재고 확인을 요청하세요.',
 'This demo pickup slot is full. Join the waitlist.':'이 데모 수령 시간은 마감되었습니다. 대기 명단에 등록하세요.',
 'A slot is available. Reserve it directly.':'예약 가능한 시간이 있습니다. 바로 예약하세요.',
 'Added to the waitlist. The first eligible waiting visitor receives a released pass.':'대기 명단에 추가되었습니다. 패스가 풀리면 첫 번째 대기자에게 배정됩니다.',
 'This pass is no longer redeemable.':'이 패스는 더 이상 사용할 수 없습니다.',
 'Switch to the visitor who owns this pass.':'이 패스를 소유한 방문자로 전환하세요.',
 'This pass has already used its one official transfer.':'이 패스는 이미 1회 공식 양도를 사용했습니다.',
 'Choose another sample visitor.':'다른 샘플 방문자를 선택하세요.',
 'Recipient already has an active pass for this product.':'받는 사람이 이미 이 상품의 사용 가능한 패스를 가지고 있습니다.',
 'Pickup is only available inside the stated window. Use Demo Mode to advance time.':'수령은 지정된 시간 안에서만 가능합니다. 데모 모드에서 시간을 앞당기세요.',
 'QR token does not match this active pass.':'QR 토큰이 이 패스와 일치하지 않습니다.',
 'Demo phone code does not match this visitor.':'데모 휴대폰 코드가 이 방문자와 일치하지 않습니다.',
 'Pickup verified. One passport stamp awarded and your first-visit reward unlocked.':'수령이 확인되었습니다. 패스포트 스탬프 1개가 지급되고 첫 방문 혜택이 열렸습니다.',
 'No active waitlist entry found.':'활성화된 대기 신청을 찾을 수 없습니다.',
 'You left the waitlist.':'대기 명단에서 나왔습니다.',
 'Updated.':'업데이트되었습니다.',
 'Browser storage is unavailable. Your demo will last only for this session.':'브라우저 저장소를 사용할 수 없습니다. 데모는 이번 세션에서만 유지됩니다.',
 'Sellable stock and forecasts updated.':'판매 가능 재고와 예측이 업데이트되었습니다.',
 'Sellable stock unchanged.':'판매 가능 재고는 변경되지 않았습니다.',
 // forecast reasons
 'Holiday scenario: sample sales velocity is 40% higher.':'공휴일 시나리오: 샘플 판매 속도가 40% 높습니다.',
 'Rain scenario: sample foot traffic is 20% lower, an unvalidated assumption.':'비 오는 날 시나리오: 샘플 방문객이 20% 적다고 가정합니다(검증되지 않은 가정).',
 'KTX-arrival scenario: sample demand is 25% higher; no live train data.':'KTX 도착 시나리오: 샘플 수요가 25% 높습니다. 실시간 열차 데이터는 없습니다.',
 'Based on confirmed sample stock and hourly demand. Afternoon demand is 35% higher.':'확인된 샘플 재고와 시간대별 수요를 기준으로 합니다. 오후 수요가 35% 더 높습니다.',
 'Fixture-based overlay. Similar items, overlap and backroom stock are not detected.':'고정 데이터 기반 오버레이입니다. 비슷한 상품, 겹친 상품, 창고 재고는 감지되지 않습니다.',
 // kitchen reasons
 'Cannot finish within demo opening hours (09:00–20:00).':'데모 영업시간(09:00–20:00) 안에 완료할 수 없습니다.',
 'Station capacity is committed.':'스테이션 용량이 모두 사용 중입니다.',
 'Pending production already covers some or all demand.':'진행 중인 생산이 수요의 일부 또는 전부를 충족합니다.',
 'Beyond 3-day simulation':'3일 시뮬레이션 이후',
};
const patterns:[RegExp,(m:RegExpMatchArray)=>string][]=[
 [/^(.*) No additional feasible batch\.$/,m=>`${translateMessage(m[1],'ko')} 추가로 가능한 배치가 없습니다.`],
 [/^(KT-\d+): ([A-Za-z ]+)\. (.*)$/,m=>`${m[1]}: ${words[m[2]]??m[2]}. ${exact[m[3]]??m[3]}`],
 [/^Demo reservation confirmed: (\S+)$/,m=>`데모 예약이 확정되었습니다: ${m[1]}`],
 [/^Pass (canceled|expired)\. Any eligible waiting visitor has been reassigned\.$/,m=>`패스가 ${words[m[1]]}되었습니다. 대상 대기자가 있으면 새로 배정되었습니다.`],
 [/^Original invalidated\. (\S+) issued to (\w+); ₩1,000 demo donation recorded\. No money moved\.$/,m=>`기존 패스가 무효화되었습니다. ${visitorKo[m[2]]??m[2]}님에게 ${m[1]}이(가) 발급되었고 ₩1,000 데모 기부가 기록되었습니다. 실제 결제는 없습니다.`],
 [/^Waitlist (\S+) assigned to (\w+): (\S+)$/,m=>`대기 ${m[1]}이(가) ${visitorKo[m[2]]??m[2]}님에게 배정되었습니다: ${m[3]}`],
 [/^(SD-\d+) expired$/,m=>`${m[1]} 만료됨`],
 [/^(\d+) expected sales over two hours; (\d+) free units after (\d+) reservations\.$/,m=>`2시간 동안 예상 판매 ${m[1]}개, 예약 ${m[3]}개를 제외한 여유 재고 ${m[2]}개.`],
];
export function translateMessage(m:string,lang:Language):string{
 if(lang!=='ko'||!m)return m;
 if(exact[m])return exact[m];
 for(const [re,fn] of patterns){const hit=m.match(re);if(hit)return fn(hit);}
 return m;
}
