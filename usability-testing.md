# Verification and usability plan

## Separate software verification from customer evidence
Automated checks can establish that code behaves as designed. They cannot prove customer desirability, privacy acceptance, real forecast accuracy, real counting accuracy, fair allocation or commercial value. No field sessions, interviews or survey results have been completed or fabricated.

## Moderated usability procedure
Recruit 5–8 diverse users for 20–30-minute sessions, including a local regular, tourist and international visitor if feasible. Obtain consent, explain the academic demo, and use neutral tasks without teaching the interface. Allow think-aloud comments. A separate staff/manager session should test the operations workflow if access is granted.

Tasks:
1. Find a named bakery product and explain its availability estimate.
2. Compare stores and choose a visit date/time.
3. Ask the assistant about stock in a selected language.
4. Reserve an eligible product and find its QR/pass window.
5. Explain what happens at expiration; demonstrate waitlist assignment.
6. Perform an official transfer and explain the donation simulation.
7. Verify pickup with the sample code.
8. Find the resulting stamp and unlock a proposed reward.
9. As staff, simulate a shelf scan, correct visible/backroom counts and identify the changed forecast.
10. As manager, review a replenishment suggestion and explain that acknowledgment does not place an order.

Measure completion (unassisted/assisted/failed), time, navigation errors, prediction comprehension, perceived usefulness/trust, reservation clarity, fairness concerns, satisfaction and willingness to try a real service. Ask open-ended follow-ups before ratings. Do not treat stated intent as actual adoption.

## AI-extension evaluations
- Glasses: staged permissioned scenes, independent human ground truth, count MAE, correction rate, update time, workload and privacy acceptance. Fixture overlays cannot establish accuracy.
- Forecasting: chronological holdout sales/stock data, sell-out error in minutes, calibration by probability bin, and decision usefulness. No accuracy metric is displayed because no held-out experiment is implemented.
- Assistant: a multilingual test set with expected intents and exact shared-service values; compare numeric consistency, ambiguity handling, language quality and user comprehension. Native-speaker review remains pending.

## Original future pilot, preserved
Two-week pilot at two stores, with and without availability information; before/after resale-listing monitoring; exit surveys on first-choice misses; opt-in 60-day return panel; 20 local regular interviews; review whether tourists displace local customers. Target 30% fewer first-choice misses, 50% fewer observed resale listings and +15 percentage points return intent. These are unachieved targets. Note seasonality, selection bias, censored sales, demand changes and inability to infer causality from a simple before/after comparison.

## Automated checks
Critical logic tests in `src/services/core.test.ts` cover unique/duplicate reservations, capacity, FIFO reassignment, expiry boundaries, transfer invalidation and limits, identity/QR/code/time checks, exactly-one stamp, reset, deterministic forecasts, inventory correction, zero stock, conservation of allocation, demand scenarios, multilingual service consistency and idempotent manager review.

`tests/browser.mjs` exercises the visible workflow: staff correction, kitchen acknowledgment, assistant languages, search/filter, QR rendering, duplicate block, official transfer, donation, pickup, stamp/reward, reload persistence, all nine mobile routes, reset and browser exceptions. It also verifies homepage images load.

Software execution results are recorded in `docs/verification.md` after final runs. Browser captures are in `docs/screenshots/`. Accessibility review includes semantic labels, visible focus, native modal focus behavior, reduced-motion styling, chart text alternatives, keyboard navigation and responsive overflow checks; this is not a full WCAG certification.

## Feedback template
Participant code | date/language/category | task | time | outcome | navigation errors | observed behavior | exact quote (with permission) | interpretation | severity | proposed change | retest result. Keep hypothetical recommendations separate from actual observations.
