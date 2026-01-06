# README.md

\# UltraWealth Experience (Prototype)



A high-fidelity \*\*experience prototype\*\* for UltraWealth’s goal-based investing and execution flows.



This repository exists to demonstrate \*\*user experience, interaction patterns, and product intent\*\* — \*\*not\*\* to operate as a production financial system.



> \*\*Status:\*\* Prototype / Demo  

> \*\*Data persistence:\*\* Client-side only  

> \*\*Backend:\*\* Minimal static server for demos



---



\## What this is (and is not)



\### This \*is\*

\- A UX / experience layer

\- A demo environment for investor and partner discussions

\- A sandbox for goal-based investing concepts

\- A narrative surface for system-governed investing



\### This is \*not\*

\- A system of record

\- A brokerage, custody, or settlement platform

\- A lending or credit engine

\- A regulatory or compliance implementation

\- A production application



All balances, trades, allocations, timelines, and credit concepts are \*\*simulated and illustrative only\*\*.



---



\## Architectural intent



Think of this repository as:



> \*\*The cockpit, not the engine.\*\*



It shows:

\- How goals are created and constrained

\- How portfolios are viewed and reasoned about

\- How trades \*would\* be reviewed and explained

\- How system rules \*surface\* to the user



It does \*\*not\*\* contain:

\- Ledger logic

\- Enforcement engines

\- Risk decisioning

\- Capital movement

\- Audit or regulatory machinery



Those live elsewhere in the TuringDynamics platform.



---



\## Repository layout



```text

.

├── client/                 # Vite + React frontend (experience layer)

│   ├── index.html

│   └── src/

│       ├── pages/          # Route-level UX flows

│       ├── components/     # Shared UI components

│       ├── contexts/       # Demo-level state containers

│       └── main.tsx        # App bootstrap

├── server/

│   └── index.ts            # Minimal Express static host (demo only)

├── specs/                  # Product thinking and UX notes

├── patches/                # Prototype dependency patches

├── vite.config.tsTechnology stack



React + TypeScript



Vite



Tailwind CSS



shadcn/ui + Radix UI primitives



wouter (routing)



Express (static production-style host)



This stack is optimised for clarity and iteration, not production hardening.



Local development

Requirements



Node.js 20+



pnpm (standardised)



This repository intentionally standardises on pnpm.

Do not reintroduce npm lockfiles.



Install

pnpm install



Run (development)

pnpm dev



Build \& run (demo / production-like)

pnpm build

pnpm start





build compiles the frontend and bundles the demo server



start serves static assets only



State \& data model



Client-side only (e.g. sessionStorage)



No authentication



No persistence



No real execution or settlement



No capital movement



This is intentional.



Contribution guidelines



Keep scope explicit



Avoid introducing execution semantics



Do not imply production readiness



Prefer clarity over completeness



Treat this repo as experience-only



If a change implies “real money”, it belongs elsewhere.



Final note



If you are looking for:



where money moves



where rules are enforced



where ledgers reconcile



where audits are produced



You are in the wrong repository — by design.



This is the experience surface, not the financial engine.





---





