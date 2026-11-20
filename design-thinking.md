# Design Thinking — evidence before features

No interviews, surveys, observations or field results have been collected. Personas below are provisional design tools, not research participants.

## Empathize: stakeholders and provisional empathy maps

| Stakeholder / persona | Task and possible need | Thinks / feels — assumption | Does / says — to investigate |
|---|---|---|---|
| Domestic tourist, “Weekend planner” | Coordinate travel and first-choice purchase | Concern about a wasted journey | Checks social posts; asks friends about timing |
| Local resident, “Regular neighbor” | Buy everyday favorites without displacement | Values fair treatment of locals | Chooses familiar store and usual time |
| International visitor, “First visit” | Understand products, directions and collection | Uncertain about Korean names and rules | Uses translation and transit tools |
| Limited-product buyer, “Special occasion” | Obtain a seasonal product for a planned event | Dislikes resale markups; wants clarity | Watches availability announcements |
| Bakery enthusiast, “City explorer” | Combine food with local experiences | Interested in discovery, not necessarily rewards | Saves places for a day trip |
| Staff, “Busy counter colleague” | Track shelf stock while serving customers | May dislike camera burden or repeated corrections | Counts/restocks using existing procedures, to verify |
| Manager, “Production planner” | Match batches to demand without waste | Needs useful advice and retained control | Reviews sales/production signals, actual practices unknown |

## Define

Customer journey: decide to visit → research product → select store/transport → arrive/queue → find stock → purchase → explore → consider return. Possible pain is uncertainty before travel; queues alone are not assumed to be the main problem.

Staff journey: observe shelf → distinguish products → reconcile backroom/POS → correct count → communicate shortage → restock. A wearable is useful only if it reduces effort without compromising privacy or service.

Manager journey: review stock and demand → compare stores → check kitchen capacity → decide batch allocation → monitor outcomes. Advice must be auditable and optional.

Jobs to be done:
- When planning a bakery trip, help me judge the chance of finding my product so I can choose a sensible time and store.
- When serving customers, help me report a shortage with little extra work.
- When planning production, help me identify actionable shortages without confusing visible stock with all inventory.

Problem statement: visitors may lack reliable information early enough to change a trip. The severity remains unvalidated.

How might we provide useful uncertainty without false certainty? How might we allocate limited passes fairly to residents and tourists? How might staff confirm stock without filming customers? How might a verified visit encourage exploration without collecting unnecessary personal data?

## Transparent prioritization

Ratings below are team hypotheses, not measured scores. High benefit is not proof of demand.

| Problem | Frequency/severity hypothesis | Business relevance | Alternatives | Feasibility/cost/data | Fairness | Priority |
|---|---|---|---|---|---|---|
| Product uncertainty | Frequency unknown; potentially high travel cost | High | Calls/social posts | Mock feasible; real inventory partnership needed | Information available to all | First |
| Resale | Incidence unknown | Medium–high | Purchase limits | Pass demo easy; identity enforcement costly | Allocation needs resident review | Required |
| One-time visits | Frequency unknown | Medium | Loyalty/tourism guides | Stamps easy; causal effect unproven | Avoid coercive benefits | Required |
| Inventory counting burden | Workload unknown | High if real | Manual/POS | Glasses integration and data labeling costly | Employee/customer privacy | Simulator only |

## Ideate

| Option | Desirability hypothesis | Feasibility / viability | Impact–effort | MoSCoW |
|---|---|---|---|---|
| Hourly availability / sell-out | Helps planning | Needs reliable stock in production | High / medium | Must |
| Inventory visibility / correction | Enables trustworthy advice | Staff confirmation required | High / medium | Must |
| Store comparison | Offers a useful alternative | Shared forecast service | High / low | Must |
| Queue estimates | May help some visitors | No queue data | Unknown / high | Could, deferred |
| Limited reservations | May reduce uncertainty/resale | Strong production identity needed | High / high | Must demo |
| Waitlist / official transfer | Recovers unused capacity | Clear state transitions | Medium / medium | Must |
| Notifications | May help time-sensitive visitors | No background service | Medium / medium | Could, deferred |
| Multilingual assistance | Helps unfamiliar visitors | Curated intents feasible | High / medium | Must |
| Stamps / tourism offers | Return effect unproven | Local simulation simple | Unknown / low | Must demo |
| Wearable recognition | Reduces effort only if accurate | No dataset/hardware access | Unknown / high | Must simulator, real CV deferred |

## Prototype
Nine routes, shared state, staff correction and customer discovery. All AI functions are simulations or intent rules. Visual placeholders are original illustrations. No fake reviews, product prices or field statistics.

## Test
Use the tasks and measures in usability-testing.md. Compare an availability-first layout against a reservation-first alternative only after baseline evidence. Record actual observations separately from recommendations. Revisit scope if the initial information hypothesis is rejected.

## Assumption register
A1: first-choice misses are common enough to matter. A2: estimates change planning. A3: visitors understand uncertainty. A4: staff can keep observations current. A5: cameras are acceptable and safe. A6: pass rules reduce resale without excluding locals. A7: rewards influence return intent. A8: operators will pay for SaaS. A9: forecast signals can be obtained lawfully and reliably. A10: total stock can be reconciled with POS and kitchen records. Validate each through interviews, task tests, operational trials and data access assessment; none is confirmed.
