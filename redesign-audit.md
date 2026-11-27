# Sungsimdang Passport redesign audit

## Original findings

The React/Vite app already connected inventory, deterministic forecasts, multilingual assistant responses, reservations and passport stamps. Those working modules were preserved. The interface relied on SVG bread illustrations, a decorative passport hero, serif interface headings, very small labels and an illustrated shelf simulator. Kitchen recommendations could only be acknowledged; they had no approval, production or receipt lifecycle. There was no independent Hong Kong tenant demonstration.

## Visual changes

- Warm white, chocolate, caramel and thin-border design system; contemporary sans-serif interface typography with Korean system-font fallbacks.
- Photographic hero and immediate product/store/arrival planner, with forecasts labeled as simulations.
- Locally optimized WebP bakery, food, kitchen and authentic Daejeon photography. Category images are explicitly representative, not actual Sungsimdang product photographs. Sources and licenses: [image credits](public/assets/photos/credits.md).
- Separate visitor, bakery operations and business experiences; clearer cards, digital tickets and passport layouts.
- Photographic simulated shelf view with a restrained bounding box, readable analytics charts and accessible tabular data.
- Subtle entrance transitions, photograph zoom on hover, button feedback, conversation/task entry and modal transitions. No animation library, loops, cartoon characters or WordPress. Reduced-motion preferences disable animation; content remains visible if observers are unavailable.
- Mobile header and card layout corrections at 320px, 390px and tablet sizes.

## Functional changes

- Typed persistent kitchen tasks: Recommended → Approved → In Production → Completed → Received by Store. Reject skipped transitions and duplicate receipt; enforce elapsed lead time and station capacity.
- Recommendations account for free inventory after reservations, two-hour demand, pending supply, batch size, lead time, capacity and demo closing time. Completion does not change sellable stock; receipt does.
- Deterministic Saturday Demand Surge at 10:20 with seven Fried Soboro units and approximately 40 minutes to depletion. Shelf scan, confirmation, production, receipt and assistant use the same state.
- Distinguish shelf observations, backroom stock, reservations, work in progress and incoming completed production.
- Forecast charts include projected depletion, hourly demand, explicitly simulated observed sales and store risk. Corrected sell-out calculation to use depletion rather than one remaining unit.
- Added isolated, persisted Bakehouse demo counts, Hong Kong store configurations, HKD settings and English/Traditional Chinese UI. Official product/store source links are displayed. The compact tenant forecast remains an illustrative constant-demand calculation.
- Preserve existing v3 reservations and passport data while adding task/tenant fields. Validate inventory snapshots on load and invalid assistant URL parameters.

## Preserved features

Twelve-product discovery, three stores, visitor profiles, English/Korean/Japanese assistant, QR passes, 30-minute expiry, duplicate prevention, FIFO reassignment, cancellation, controlled transfer, simulated donations, verified pickup, passport stamps, proposed rewards, analytics, scenario controls and reset remain available.

## Verification

Executed successfully during this redesign:

- `npm test`: 22 service tests, including production ordering, elapsed lead time, receipt-only inventory changes, duplicate receipt, pending supply, closing time, station capacity, Saturday determinism and tenant isolation.
- `npm run build`: TypeScript and Vite production build.
- `tests/browser.mjs`: inventory correction, shared assistant forecasts, all three assistant languages, discovery filters, reservation/transfer/pickup/reward persistence, ten routes at 390px, reset and no page exceptions.
- `tests/lifecycle-browser.mjs`: expiry, waitlist reassignment, cancellation, scenario/profile controls, modal Escape and keyboard skip link.
- `tests/redesign-browser.mjs`: full Saturday scan → approval → timed production → completion → receipt → assistant journey; refreshed task persistence; tenant isolation and Traditional Chinese; responsive checks at 320/768/1440px. No page exceptions.
- Chrome screenshot review led to corrections for the mobile last-card layout, narrow-screen header and chart animation. Screenshots are in `docs/screenshots/`.

The production-preview launch for `tests/production-smoke.mjs` was rejected by automatic approval review due to an account usage limit. That separate production-server smoke test was not run. Development-browser verification above succeeded. The final motion polish and the first-screen bread photograph were subsequently checked in Chrome using `tests/photo-preview.mjs`: all homepage images loaded on desktop and mobile without runtime errors. Current captures are `docs/screenshots/photo-redesign-desktop.png` and `docs/screenshots/photo-redesign-mobile.png`. The local preview was verified to serve the WebP images with HTTP 200; no hosted deployment has been performed.

## Remaining limits

This is a browser-local academic prototype, not a production system. No live computer vision, generative AI, stock feed, trained/calibrated prediction, real identity verification, payment or partner agreement is claimed. Tenant record separation is not authorization or production security. Product-specific approved photography is still required for commercial launch. Existing catalog/store combinations are examples, not verified current assortment. Historical observations are not reconstructed; demand scenarios are illustrative. Kitchen station and lead-time assumptions are fixtures. A backend with durable transactions, roles, audit logs, live stock integration and validated demand data is needed for real deployment.

## Product-photo follow-up

Replaced category-level image reuse with a product-ID image manifest in `src/data/productPhotos.ts`. All twelve catalog products now use distinct photo files; product detail dialogs and homepage cards use the same per-product mapping. Added source/author/license credits, including CC BY 2.0 attribution for the historical fried-soboro photograph, and an accessible Photo credits link in the footer. Representative substitutions remain explicitly labeled. `npm run build` and `tests/product-photos.mjs` passed: twelve loaded unique image sources, matching detail imagery and no 390px overflow.
