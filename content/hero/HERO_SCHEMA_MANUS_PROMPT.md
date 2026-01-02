# UltraWealth — Hero Schema Generation Prompt
## Public Experience Contract (Authoritative)

---

## ROLE (NON-NEGOTIABLE)

You are acting as a **contract author**, not a designer, marketer, or frontend engineer.

Your task is to define the **strict JSON Schema** that governs what the UltraWealth homepage hero is allowed to display.

This schema is a **regulatory and narrative control mechanism**.

It exists to prevent:
- accidental banking semantics
- performance claims
- advice implications
- balance / returns leakage
- marketing drift over time

If something is ambiguous, you must **constrain it**, not explain it.

---

## CONTEXT

UltraWealth is a **goal-first wealth platform**.

It is:
- not a bank
- not a trading app
- not a performance marketing product
- not an advice service at the homepage layer

The homepage hero must communicate:
- direction
- calm confidence
- goal progress

It must **not** communicate:
- spendability
- optimisation
- market timing
- returns
- recommendations

---

## FOUNDATIONAL PRINCIPLE (LOCKED)

The hero is governed by this immutable principle:

> **Goals first. Money follows.**

If any data element undermines this principle, it must be disallowed.

---

## YOUR TASK

Generate a **JSON Schema** (`schemas/hero.schema.json`) that defines:

1. The only allowed **top-level hero fields**
2. The only allowed **numeric semantics**
3. The only allowed **status language**
4. Explicit **forbidden concepts**, both structural and lexical
5. Example data that demonstrates *correct* usage

This schema will be enforced in CI and used by frontend components.

---

## REQUIRED STRUCTURE

The schema MUST:

- Use JSON Schema draft 2020-12
- Set `additionalProperties: false` everywhere
- Be conservative by default
- Prefer enums and consts over free strings
- Treat numbers as dangerous unless explicitly justified

---

## REQUIRED SECTIONS (MANDATORY)

### 1. Contract Metadata
Include:
- `$schema`
- `$id`
- `title`
- `description`
- `version` (locked to `1.0.0`)

This is a **public contract**, not an internal type.

---

### 2. Headline (LOCKED)

The hero headline MUST:
- Exist
- Be immutable
- Match exactly:

Goals first. Money follows.

---

### 3. Subheading (CONSTRAINED)

The subheading:
- Must be a single sentence
- Must be neutral and descriptive
- Must not imply advice, performance, or intelligence
- Must not reference balances, returns, or markets

Enforce via:
- length bounds
- sentence pattern
- descriptive wording

---

### 4. Primary CTA (LOCKED)

The primary CTA:
- Must exist
- Must have label = `Get started`
- Must not deep-link into product internals

---

### 5. Hero Card (CORE OBJECT)

The hero card represents **goal progress**, not money.

It MUST include:
- a top label (`Primary Goal`)
- a progress metric
- a secondary CTA (`View goals`)

It MUST NOT include:
- balances
- portfolio value
- net worth
- returns
- performance vs benchmark

---

### 6. Progress Metric (CRITICAL)

Allowed:
- integer percentage (0–100)
- directional status (`On track`, `Ahead`, `Behind`)
- optional target year (YYYY only)

Forbidden:
- decimals
- currency totals
- growth language

---

### 7. Optional Event Cue (CAUSE → EFFECT ONLY)

If present, it must:
- be past-tense
- be neutral
- show system action

Allowed examples:
- `Income allocated`
- `Contribution recorded`
- `Automatic rebalance completed`

Dollar values allowed **only** for single contributions.

---

### 8. Explicitly Forbidden Concepts

The schema MUST mechanically block:
- balance
- net worth
- portfolio value
- returns
- performance
- benchmark
- spendable cash
- profit
- gains
- AI claims
- advice language

---

## OUTPUT REQUIREMENTS

You must output:
1. A complete `hero.schema.json`
2. At least one valid example object
3. Zero explanatory prose outside the schema itself

This schema is **law**, not guidance.

---

## END OF PROMPT
