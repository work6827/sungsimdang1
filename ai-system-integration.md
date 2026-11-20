# Integrated AI workflow

All implemented “AI” features are simulations or deterministic rules. The useful demonstration is the shared data flow, not a claim of trained models.

1. ShelfObservationSimulator returns a deterministic visible count and overlay fixture.
2. Staff confirms visible and backroom quantities in Operations Center.
3. InventoryService stores one timestamped record per product/store.
4. DemandForecastService integrates hourly sample velocity, calendar and scenario effects; subtracts active reserved units; derives free inventory, availability and sell-out.
5. Kitchen advice compares free inventory with two-hour demand plus buffer. Acknowledgment is recorded; no production is executed.
6. Find Your Bread and VisitorAssistantService call the same forecast function. Chat answers retain the asked product/store/time and are recomputed against current shared state; they are not frozen historical records.
7. ReservationService validates eligibility, ownership limits and one-unit stock allocation. Waitlist assignment respects released capacity and eligible visitors.
8. Pickup validates the token, sample phone code and time window; consumes one unit and makes the pass terminal.
9. Pilgrim Ledger creates one stamp per pass. Rewards are derived from stamp count.
10. Business Dashboard derives counts and totals from these same records.

## Inventory accounting
A snapshot represents physical units at a specified demo time. Forecast walk-in demand consumes only the unallocated balance. Active passes protect reserved units from walk-in forecasts. Reservation reduces free units by one; transfer changes ownership without changing allocation; cancellation/expiry releases the unit; pickup decrements physical stock by one and removes the active allocation. A staff correction below active allocations is rejected for review.

No reorders are actually made. No real inventory is held. One slot per product/store/window is a classroom capacity assumption. Forecasts do not reconstruct past snapshots: dates earlier than the current record are flagged. Scenario changes apply the chosen scenario from the latest snapshot onward; this is a what-if analysis, not historical replay.

## Persistence and boundaries
React context holds the current state; LocalStorage saves schema version 3 in this browser. Reset restores fixed 20 November 2026 10:00 KST data. Different browsers do not share reservations. Browser storage and sample identities are editable; there is no production authorization, multi-device synchronization or concurrency guarantee. The clock does not run in wall time. Advancing it sweeps expiration and reassignment immediately.

Future integration: authenticated backend services, atomic database transactions, POS/kitchen reconciliation, secure wearable ingestion, trained forecast models, grounded model-based assistant and optional verifiable credentials. See architecture.md.
