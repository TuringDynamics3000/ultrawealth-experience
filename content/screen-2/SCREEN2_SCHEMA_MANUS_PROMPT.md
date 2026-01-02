# UltraWealth — Screen 2 Schema Generation Prompt
## Trust + Mechanism Bridge Contract (Authoritative)

---

## ROLE (NON-NEGOTIABLE)

You are acting as a **public experience contract author**.

You are NOT designing UI.
You are NOT writing marketing copy.
You are NOT explaining features.

Your task is to define the **strict JSON Schema** governing what the **first scroll-down section (Screen 2)** of the UltraWealth homepage may contain.

This schema exists to permanently enforce:
- clarity of mechanism
- trust-first positioning
- regulatory safety
- resistance to feature creep

---

## CONTEXT

Screen 2 sits **immediately below the hero** on the same page.

Its purpose is to convert:
> “I like this” → “I understand and trust this”

It must answer, in one scroll:
1. How does money follow goals?
2. Do I stay in control?
3. Can I verify what happened and why?

---

## FOUNDATIONAL RULE

Screen 2 is a **bridge**, not a destination.

It must never become:
- a feature grid
- a product catalogue
- an AI pitch
- a performance explanation
- an advice surface

---

## YOUR TASK

Generate a **JSON Schema** (`schemas/screen2.schema.json`) that defines:

1. The only allowed **section structure**
2. The mandatory **three-pillar narrative**
3. The only allowed **language categories**
4. Explicitly forbidden concepts
5. Example data demonstrating correct usage

This schema will be enforced in CI and consumed by rendering components.

---

## REQUIRED STRUCTURE (MANDATORY)

The schema MUST enforce the following top-level structure:

- sectionTitle
- pillars (exactly three)
- supportingVisual
- primaryCta

No additional sections allowed.

---

## SECTION TITLE (CONSTRAINED)

The section title:
- must exist
- must explain *mechanism*, not marketing
- must not reference AI, performance, or optimisation

Examples of semantic intent (do not copy):
- “How money follows goals”
- “How UltraWealth works”

---

## PILLARS (LOCKED TO THREE)

The section MUST contain **exactly three pillars**, in this order:

1. Organise
2. Orchestrate
3. Prove

Each pillar MUST contain:
- a fixed heading
- a single-sentence description

---

### Pillar 1 — ORGANISE

Heading MUST be exactly:

Goals, not accounts

Description:
- explains goal-based structuring
- no asset names
- no balances
- no products

---

### Pillar 2 — ORCHESTRATE

Heading MUST be exactly:

Automatic allocation

Description:
- explains rule-based movement
- no optimisation claims
- no performance language
- no dollar outcomes

---

### Pillar 3 — PROVE

Heading MUST be exactly:

Evidence by default

Description:
- explains verifiability and auditability
- no legal jargon
- no blockchain evangelism
- no trust marketing claims

---

## SUPPORTING VISUAL (NON-NUMERIC)

The supporting visual:
- MUST be a flow representation
- MUST include: Income → Goal Accounts → Portfolio
- MUST NOT include numbers, charts, axes, or asset prices

Allow only descriptive labels.

---

## PRIMARY CTA (LOCKED)

The CTA MUST:
- exist
- have label = `Create your first goal`
- link to onboarding only

No secondary CTAs allowed at this level.

---

## EXPLICITLY FORBIDDEN CONCEPTS

The schema MUST mechanically prevent:

- balances
- net worth
- returns
- benchmarks
- asset names
- performance metrics
- AI claims
- recommendations
- advice language

This must be enforced structurally, not just in comments.

---

## OUTPUT REQUIREMENTS

You must output:
1. A complete `screen2.schema.json`
2. At least one valid example object
3. No explanatory prose outside the schema

This schema is a **long-lived public contract**.

---

## FINAL CHECK

Ask before outputting:

> “Could this schema allow Screen 2 to drift into a feature list or performance explanation?”

If yes, tighten it.

---

## END OF PROMPT
