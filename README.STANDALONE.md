# UltraWealth — Standalone Mode

UltraWealth is a fully standalone client application that consumes
TuringOS as a replaceable upstream service.

## What Standalone Means

UltraWealth can:

- Boot without TuringOS
- Render UI independently
- Run in Docker without shared runtime
- Demonstrate intent ? decision flows without embedded governance
- Swap backend environments via configuration

UltraWealth does NOT:

- Embed decision logic
- Enforce policy locally
- Mutate state without an API
- Share runtime or code with TuringOS

## Run Modes

### Mode 1 — Standalone (No Backend)

\\\ash
NEXT_PUBLIC_TURINGOS_API=http://localhost:9999
npm run dev
\\\

### Mode 2 — Local TuringOS

\\\ash
NEXT_PUBLIC_TURINGOS_API=http://localhost:3000
npm run dev
\\\

### Mode 3 — Production Backend

\\\ash
NEXT_PUBLIC_TURINGOS_API=https://api.turingos.prod
\\\

## Architectural Boundary

UltraWealth communicates with TuringOS exclusively via HTTP
using a generated OpenAPI client.

This boundary is intentional and enforced.
