# UltraWealth — Forbidden Patterns
## Public Experience Guardrails (Authoritative)

This document defines **patterns, language, and concepts that are explicitly forbidden**
in the UltraWealth public experience layer.

These rules exist to:
- protect regulatory posture
- preserve goal-first positioning
- prevent banking / trading semantics
- avoid advice or performance implications

If a proposed change conflicts with this file, **the change is wrong**.

---

## 1. Banking & Account Semantics (FORBIDDEN)

UltraWealth must **not** present itself as a bank or transaction account.

Do NOT show or reference:
- account balances
- available cash
- spendable amounts
- wallets
- transaction feeds
- deposits / withdrawals
- cards or payment rails

❌ Examples:
- “Your balance”
- “Cash available”
- “Withdraw funds”

---

## 2. Performance & Returns Language (FORBIDDEN)

The public experience must not imply investment performance or optimisation.

Do NOT show or reference:
- returns (absolute or percentage)
- performance vs benchmark
- gains / profits
- yield
- alpha
- beating the market
- outperformance

❌ Examples:
- “Up 8.2%”
- “Outperform the market”
- “Maximise returns”

---

## 3. Net Worth & Portfolio Totals (FORBIDDEN)

Aggregated wealth framing is explicitly disallowed at the public layer.

Do NOT show or reference:
- net worth
- total portfolio value
- assets under management
- consolidated balances

❌ Examples:
- “Your portfolio is worth”
- “Total invested”

---

## 4. Advice & Recommendation Framing (FORBIDDEN)

UltraWealth must not appear to give personal or general financial advice
on the homepage or public screens.

Do NOT use:
- “we recommend”
- “you should”
- “best investment”
- “personalised advice”
- “tailored recommendations”

❌ Examples:
- “We recommend this strategy”
- “The best way to invest”

---

## 5. AI, Prediction & Intelligence Claims (FORBIDDEN)

AI capability must **not** be marketed or implied at the public experience layer.

Do NOT reference:
- AI-driven decisions
- predictive models
- forecasts
- optimisation engines
- machine learning
- automation framed as intelligence

❌ Examples:
- “AI-powered investing”
- “Predictive allocation engine”

---

## 6. Product & Asset Promotion (FORBIDDEN)

The public experience must remain **product-agnostic**.

Do NOT mention:
- ETFs
- funds
- asset classes
- securities
- tickers
- specific investment products

❌ Examples:
- “Invest in ETFs”
- “Diversify across assets”

---

## 7. Language Style Violations (FORBIDDEN)

Avoid hype, urgency, or persuasion tactics.

Do NOT use:
- fear-based language
- urgency (“don’t miss out”)
- gamification
- lifestyle promises

❌ Examples:
- “Secure your future now”
- “Don’t fall behind”

---

## 8. What IS Allowed (Clarification)

The public experience **may** reference:
- goals
- progress (directional, non-monetary)
- structure
- rules
- evidence
- auditability
- calm system behaviour

This distinction is deliberate.

---

## Enforcement

- This file is **binding**
- CI will eventually enforce these rules
- PRs that violate these patterns should be rejected without debate

If there is uncertainty, default to **removal**, not explanation.

---

## END OF DOCUMENT
