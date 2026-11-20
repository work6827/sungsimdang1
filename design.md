# Technical and experience design

Availability-first information architecture: Home, Find Your Bread, Bakery Assistant, Bread Pass, My Passport, Explore Daejeon, How It Works, Operations Center, Business Dashboard. Global classroom drawer provides profile, clock and scenario control. All routes use one React context state persisted with schema version 3 in LocalStorage.

Palette: cream #F8F3EA, chocolate #493026, caramel #B77B48, gold #C6A46B, white. Serif display typography, neutral body text, local illustrated placeholders explicitly distinguished from product photography, generous cards and restrained transitions. Mobile navigation wraps, cards collapse, dialogs scroll and focus remains visible.

## Domain invariants

Reservation lifecycle: active → picked-up | canceled | expired | transferred. Terminal passes never reactivate. Queue entries: waiting → assigned | canceled. One active reservation per profile/product across stores. One slot per product/store/window is a presentation assumption. Release on expiry/cancellation assigns FIFO to an eligible waiter. On expiry, reassignment creates a new 30-minute pickup window beginning at simulated now. Transfers preserve the original window and increment lineage transfer count. One transfer per lineage. Pickup needs matching current profile, exact QR payload and sample phone code and now within window. Stamp IDs are derived from unique pass IDs and cannot duplicate.

Forecast is a bounded deterministic heuristic, not calibrated probability or machine learning. Date weekday, visit hour, opening inventory, selected scenario and store demand multiplier are explicit inputs. No claim of confidence interval coverage; displayed range is a sensitivity band.

## Implementation boundaries

src/data: typed fixtures. src/services: forecasting, pure reservation transitions, persistence. src/components: UI and context. src/App.tsx: route views. Business dashboard derives its metrics from the same state; proposed model and demo observations remain distinct.

## Shared operational model

Inventory is a confirmed snapshot `{count, visible, backroom, at}` per store/product. Visible shelf observation is a fixture-based estimate, never complete stock. Staff must separately confirm visible and backroom quantities; their sum creates a new timestamped stock snapshot. Forecast integrates deterministic hourly sales velocity from that snapshot to the requested time and subtracts active allocated units. A request earlier than the snapshot uses its current count and is flagged as historical, not reconstructed history. Same input state always returns the same result.

Availability is a heuristic score based on free stock relative to near-term demand; zero free stock means 0%. Sell-out is the first simulated minute cumulative demand reaches free inventory. Kitchen suggestions cover a two-hour demand horizon plus a small buffer. Recommendations require review; acknowledgment records review only.

Reserve allocates one unit only if current free stock is positive. Pickup deducts one unit from the current stock snapshot and removes its allocation; expiration/cancellation releases allocation. Staff updates below existing active allocations are rejected. No production or inventory transfer is automatically executed. Fixed simulated clock deliberately advances only through controls; advancing it performs no-show expiry and FIFO eligible reassignment.
