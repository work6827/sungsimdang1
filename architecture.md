# Service architecture

The two diagrams below distinguish the working browser prototype from a proposed production system. SVG renderings are supplied in `docs/diagrams/` after diagram verification.

![Rendered MVP architecture](docs/diagrams/architecture-1.svg)

![Rendered future production architecture](docs/diagrams/architecture-2.svg)

## Current functional MVP
```mermaid
flowchart TD
 Staff[Staff browser] --> Glasses[AI Glasses workflow simulator]
 Glasses --> Observation[Fixture shelf observations]
 Observation --> Confirm[Staff correction and backroom confirmation]
 Confirm --> Inventory[Shared confirmed inventory]
 Inventory --> Forecast[Deterministic Demand Brain]
 Forecast --> Sellout[Availability and sell-out estimates]
 Forecast --> Kitchen[Advisory kitchen recommendations]
 Kitchen --> Review[Manager acknowledgment]
 Visitor[Visitor browser] --> React[React pages and Router]
 React --> Catalog[Find Your Bread]
 React --> Agent[Multilingual intent assistant]
 Sellout --> Catalog
 Sellout --> Agent
 React --> Pass[Bread Pass service]
 Pass --> Allocation[Allocate or release inventory]
 Allocation --> Inventory
 Pass --> Waitlist[Expiry and FIFO waitlist]
 Pass --> Transfer[Controlled reassignment and demo donation]
 Pass --> Verify[Simulated QR and phone verification]
 Verify --> Pickup[Completed pickup and stock decrement]
 Pickup --> Ledger[Pilgrim Ledger stamp]
 Ledger --> Rewards[Proposed tourism reward]
 Inventory --> State[Shared React state]
 Pass --> State
 Ledger --> State
 Review --> State
 State <--> Storage[Versioned LocalStorage]
 State --> Business[Business dashboard]
```

All modules operate in one browser. “Staff” and “visitor” are demonstration roles, not access-controlled identities. The state service coordinates the modules; LocalStorage persists that state. There is no server database, trained AI, live camera, real SMS or blockchain.

## Proposed production architecture — not implemented
```mermaid
flowchart TD
 Customer[Customer application] --> API[Secure API backend]
 Wearable[Authorized wearable or shelf camera] --> CV[Computer vision service]
 CV --> Review[Staff review and correction]
 Review --> Inventory[Inventory and sales database]
 POS[POS and kitchen records] --> Inventory
 API --> Identity[Identity and reservation services]
 Identity --> Transactions[Atomic capacity and pass transactions]
 Transactions --> Inventory
 API --> Agent[Grounded multilingual AI service]
 Agent --> Forecast[Trained forecasting service]
 Forecast --> Inventory
 Calendar[Calendar and holiday data] --> Forecast
 KTX[Proposed KTX-related demand integration] -.-> Forecast
 Weather[Proposed weather integration] -.-> Forecast
 Trends[Proposed search and social signals] -.-> Forecast
 Forecast --> Kitchen[Human-reviewed kitchen planning]
 API --> Loyalty[Loyalty and credential service]
 Identity --> Loyalty
 Partners[Proposed tourism partners] -.-> Loyalty
 Credentials[Optional secure credentials or blockchain] -.-> Loyalty
 Inventory --> Analytics[Aggregated analytics dashboard]
 Loyalty --> Analytics
```

Future security boundary: authenticated API with authorization, atomic slot allocation, signed short-lived QR tokens, audited reassignment, verified identity provider, consent, retention policies and observability. Raw wearable images should be minimized and access restricted. Partner access and model use require separate agreements and evaluation. The diagram does not claim any existing POS, KTX, weather, tourism or blockchain integration.
