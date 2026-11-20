# Requirements — Sungsimdang Passport

Status: approved input is the supplied master prompt. The named business-plan DOCX is absent; exact proposal conformity remains unverified. No primary research has been conducted.

## User stories and acceptance criteria

| ID | Requirement | Acceptance |
|---|---|---|
| R1 | Discover bakery products | 12 products, 3 stores; English/Korean search, category, date/time filters and details |
| R2 | Reduce visit uncertainty | deterministic store/date/time/scenario estimates; alternatives and uncalibrated uncertainty notice |
| R3 | Reserve fairly | 3 profiles; one active account/item reservation; one demo slot per item/store/window; unique QR token |
| R4 | Handle no-shows | simulated clock expires passes at window end; oldest eligible waiting visitor receives a fresh window |
| R5 | Official transfer | invalidate original first; one transfer maximum per pass lineage; recipient duplicate checks; recorded simulated ₩1,000 donation |
| R6 | Verify pickup | exact current token and profile-specific demo phone code; only during pickup window; one stamp per pickup |
| R7 | Reward visits | profile-bound history, stamps and proposed reward at first stamp; no blockchain claim |
| R8 | Assist visitors | English/Korean/Japanese curated answers; explicit scripted assistant label |
| R9 | Demonstrate business | shared-state reservations, expiry, queues, donations, stamps and observed demo repeat activity; allocation recommendations |
| R10 | Classroom controls | switch profiles, advance time, demand scenarios and reset; LocalStorage persistence |
| R11 | Presentation | nine routes, responsive premium bakery design, accessible controls, no asserted product prices |
| R12 | Academic work | research/specs/design/tasks/traceability, diagrams, testing and limitations |

All inventory, capacity, forecast probabilities, demand signals, pickup rules, offers and fees are illustrative assumptions. No payments, live identity, inventory API, trained AI, or blockchain are implemented.

## Combined specification extension — Know Before You Go

The second supplied specification extends, rather than replaces, the original strategy. Central message: “Know Before You Go.” Philosophy: “We keep the queue and remove the wasted trip.” All five components remain in scope: staff glasses workflow, Demand Brain, multilingual guidance, Bread Pass and Pilgrim Ledger.

| ID | Added acceptance requirement |
|---|---|
| R13 | Staff can scan a fixture shelf, see overlays/confidence, correct visible count, enter separately verified backroom stock and submit |
| R14 | Shared confirmed inventory changes remaining stock, availability, sell-out estimate and replenishment suggestion |
| R15 | Forecast considers deterministic hourly velocity, weekends, weather and KTX-arrival scenarios |
| R16 | Assistant handles English/Korean/Japanese intents and uses the same current product/store/time forecast; no invented quantities |
| R17 | Operations Center separates observation, forecast and kitchen views; acknowledgment does not execute production |
| R18 | Reservations allocate one unit; canceled/expired passes release allocation; pickup consumes one unit; transfer preserves allocation |
| R19 | Business dashboard reports inventory updates and simulated shortage risk; no forecast-accuracy claim without held-out evaluation |
| R20 | Five-minute demo connects observation → correction → forecast → assistant → reservation → pickup → stamp → reward → dashboard |

Scope reconciliation: Home uses the new exact headline and subheadline. Dedicated assistant and operations routes are added; How It Works is retained. The assignment deliverable summary uses simple English and three sections: technology choice, core functions/components, architecture. Kiro is not available here; Kiro-style requirements/design/tasks artifacts provide the requested spec-driven workflow without claiming use of that IDE.
