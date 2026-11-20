# Software verification record — 20 November 2026

## Passed
- TypeScript compilation and Vite production build.
- 16 automated critical-logic tests. These include 144 deterministic product/store/scenario combinations, reservation limits, expiry, FIFO waiting, transfers, donation records, identity checks, inventory conservation and exactly-one stamp.
- Desktop browser journey at 1440 × 1000: inventory correction, kitchen acknowledgment, current-stock assistant answer, Korean/Japanese responses, Korean product search, category filtering, QR rendering, duplicate reservation rejection, official transfer, donation, pickup, stamp and reward.
- Additional mobile browser checks: automatic expiry after a 30-minute clock advance, waitlist assignment, cancellation, demand scenario, profile switching, product details, Escape-to-close and keyboard skip link.
- Browser reload preserves current demo data.
- Mobile overflow checks at 390 × 844 for all nine routes, including a populated passport.
- Reset clears passes, stamps and inventory updates.
- Homepage SVG images load with nonzero dimensions; no page exceptions in the full journey.
- Production-build smoke test: all nine routes load, all route images render and no runtime exceptions.
- Three Mermaid diagrams rendered successfully to standalone SVG.
- Final dependency audit: 0 known vulnerabilities in the installed dependency tree at the time of the check. This is not a security guarantee.

## Defects found and resolved
- Standalone SVGs lacked their XML namespace; browser rendering failed. Added the namespace and an image-loading assertion.
- Populated passport grid used content minimum widths that overflowed on mobile. Changed grid constraints and verified all mobile routes.
- An initial test ran while dependency upgrades were unfinished; rerun after installation passed. No product change was needed.
- Browser language selector used an overly strict test locator; corrected the locator and verified both language changes.

## Verification boundaries
No customer field study, real image recognition, live stock reconciliation, trained-model evaluation, actual SMS/payment/blockchain, partner agreement or production identity security was tested. No forecast accuracy is claimed. Korean/Japanese responses are curated translations and still need native-speaker usability review. Accessibility received basic keyboard/semantic/responsive checks, not a full assistive-technology audit or WCAG certification. The original DOCX remains unavailable, so exact proposal conformity remains pending.

Browser screenshots are saved in `docs/screenshots/`. Commands and scripts are documented in README.md and tests/.
