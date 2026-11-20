# Technology selection — simple, practical choices

This is a two-week university MVP, not a production deployment inside a bakery. We select technologies for the customer task, not because they sound innovative. Cost ratings are planning judgments; no hardware purchase quote or commercial API price has been verified. The implemented demo requires no paid API, physical glasses, SMS or payment service.

## 1. Staff smart glasses and inventory

| Option | What it can do | Cost / effort | Reliability, usability and privacy | Decision |
|---|---|---|---|---|
| Manual stock confirmation | Staff enter shelf and backroom counts | Existing device; low software effort, recurring labor | Human error possible; no camera needed; easy to correct | MVP input and future fallback |
| POS-based tracking | Track recorded sales against starting stock/production | Integration and data-access cost | Does not directly observe misplaced items or unrecorded waste; requires reconciliation | Future essential input |
| Consumer AI glasses | Camera/audio interaction in a wearable form | Hardware purchase plus integration; verify current price and access | Consumer features do not establish suitability for store inventory; battery, data access and worker consent need tests | Not required for MVP |
| Enterprise smart glasses | Hands-free workflow and enterprise deployment options | Higher procurement, support and integration effort; obtain a quote | Potential work-oriented fit; still requires safety, accessibility and privacy testing | Future comparison candidate |
| Phone or fixed-camera computer vision | Detect/localize objects with a trained model | Device plus labeled images/model integration | Occlusion, similar products and lighting can cause errors; avoid filming people | Compare against glasses before choosing hardware |
| Glasses workflow simulator | Show fixture overlays, correction and shared stock updates | No hardware or inference fees; low–medium effort | Demonstrates interaction only, not recognition performance | Selected MVP |

Vuzix’s M400 page is an example of enterprise wearable hardware; it does not prove bakery counting accuracy. Ray-Ban’s official glasses catalog provides a consumer category example, but accessible page content did not establish a suitable inventory API. No specific device price is asserted. [Vuzix M400](https://www.vuzix.com/products/m400-smart-glasses), [Ray-Ban official catalog](https://www.ray-ban.com/usa/ray-ban-meta-ai-glasses).

Google’s MediaPipe Object Detector accepts image/video input and returns object detections. The team would still need a suitable bakery dataset and evaluation; a general detector is not evidence that these twelve products can be counted reliably. Real recognition is technically possible without a paid inference API, but collecting labeled, permissioned shelf images is outside this practicum. [Google object detector documentation](https://developers.google.com/edge/mediapipe/solutions/vision/object_detector).

## 2. Demand forecasting

| Approach | Functionality / data | Cost and difficulty | MVP suitability |
|---|---|---|---|
| Deterministic rules | Inventory, hourly sales rate, scenario multipliers | No training cost; easy to inspect | Selected; explicitly not trained AI |
| Statistical baseline | Seasonal averages, exponential smoothing, time-series baselines | Low compute; needs enough consistent sales history | Good first production benchmark |
| Machine learning regression | Combine sales with calendar/weather/arrival signals | Medium data engineering and validation cost | Future, after evidence of improvement over baseline |
| More complex time-series models | Learn temporal patterns and covariates | Higher data/maintenance requirements | Defer until sufficient store/product history exists |

Time-series forecasting is a problem family, not a separate technology that automatically beats statistics or ML. Stockouts censor demand: recorded sales may underestimate what people wanted. A future evaluation should use chronological holdouts, measure sell-out-time error and probability calibration, and compare against simple baselines. Forecasting literature emphasizes limits and uncertainty; our ±12-point display is only an illustrative sensitivity range, not a validated interval. [Forecasting: Principles and Practice](https://otexts.com/fpp3/intro.html).

Selected calculation: confirmed stock minus active pass allocations minus accumulated sample sales; time of day, weekend and holiday/rain/KTX scenarios change sales rate. Sell-out is the first simulated minute less than one free unit remains. Kitchen advice targets two-hour demand plus a small buffer. No real forecasting accuracy is claimed.

## 3. Multilingual visitor guidance and generative AI

| Approach | Functionality | Cost / feasibility | Reliability and choice |
|---|---|---|---|
| Curated intent rules | Recognize product, store, preference and time questions; fill answers from the same forecast | No API cost; manageable for three languages | Selected; limited intent coverage, explicit fallback |
| Retrieval-based assistant | Find approved facts and answer from them | Index/curation cost, medium integration | Future useful for product rules and tourism information |
| Generative AI with tools/retrieval | Flexible wording, discovery and explanations | Inference/hosting cost; secure backend and evaluation required | Optional future layer, not business-rule authority |

The model must never invent stock, guarantee availability, issue passes directly or change allocation rules. Production answers should obtain numeric results from typed services, use approved retrieval for facts, state uncertainty, and decline unsupported questions. Human language review remains necessary. NIST’s AI risk framework is a useful evaluation reference; it does not certify this MVP. [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework).

## 4. Bread Pass and identity

| Technology | Benefit | Cost / difficulty / limitation | Selection |
|---|---|---|---|
| Database reservation transaction | Atomic capacity and ownership enforcement | Conventional backend and operational cost | Future foundation |
| QR token | Portable machine-readable reference | Low cost; copied QR alone proves no identity | Real QR generation, simulated checking in MVP |
| Identity credential / phone verification | Bind redemption to a verified account | Provider, consent, abuse and recovery work | Sample profiles/codes now; production provider later |
| Blockchain pass | Potential portable verifiable ownership | Higher key/recovery, privacy, revocation and fee complexity | Explain concept; not necessary for this demo |

Production needs authorization and secure transaction handling, not just QR graphics. [OWASP Authentication guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html). W3C verifiable credentials describe an issuer/holder/verifier model; adopting such credentials does not require us to claim that local browser data is blockchain. [W3C Verifiable Credentials 2.0](https://www.w3.org/TR/vc-data-model-2.0/).

## 5. Passport and application stack

A conventional loyalty database can record visits, prevent duplicate rewards and support revocation with lower implementation complexity. Digital stamps are a presentation of these records. Blockchain-backed ownership may support portability later, but requires user benefit, privacy and recovery validation. MVP: profile-bound LocalStorage stamps, not tokens or blockchain assets.

React + TypeScript provide typed interactive components; React Router separates pages; Vite supports local development/build; Tailwind and CSS implement the design; Recharts renders shared-state charts; qrcode.react generates QR SVGs. No proprietary service is needed to run locally. React’s guidance supports sharing common state between coordinated views. [React state guidance](https://react.dev/learn/managing-state), [Vite guide](https://vite.dev/guide/). The project intentionally pins its own tested major versions; current documentation may describe newer releases.

## Recommended production progression
Start with manual/POS-confirmed inventory and a measured forecasting baseline. Pilot staff observation with a phone or camera before buying glasses. Add authenticated transactional passes and a conventional loyalty backend. Consider learned models, wearable hardware or portable credentials only when measured benefits justify their costs. Review privacy requirements separately in Korea, Japan and Europe; no legal compliance certification is claimed.

Sources reviewed 20 November 2026. All selection ratings are our design judgments. No interviews or procurement tests were performed.
