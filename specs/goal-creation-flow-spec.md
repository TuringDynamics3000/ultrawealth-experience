# UltraWealth Goal Creation & Client Experience Flow

**Status:** Draft for Review  
**Date:** 2026-01-02

---

## Purpose

Make the demo actually *do* something, not just *show* something.

Currently: Marketing story → System reveal (static)  
After this: Marketing story → **Client creates goal** → **Goal becomes policy** → **Client sees it working**

---

## The Flow (3 Screens)

### Screen 1: Goal Creation

**Route:** `/goals/new`

**What the client does:**
- Names their goal (free text, e.g., "Home Deposit")
- Sets a target amount (e.g., $100,000)
- Sets a target date (e.g., December 2026)
- Optionally: adds a photo/icon (lifestyle anchor)

**Design tone:**
- Clean, calm, private-bank feel
- No financial jargon
- One thing per step (wizard-style) or single form (your call)

**What happens on submit:**
- Goal is "compiled" into a policy
- Transition to Screen 2

---

### Screen 2: Policy Compilation Confirmation

**Route:** `/goals/[id]/compiled` (or modal/transition)

**What the client sees:**
- Their goal restated: "Home Deposit · $100,000 · December 2026"
- The compiled policy (human-readable):
  - "Allocate 40% of incoming funds to this goal"
  - "Rebalance if allocation drifts >5%"
  - "Pause contributions if emergency fund <$10,000"
- A confirmation: "This policy is now active."

**Design tone:**
- System-grade, but not intimidating
- The client should feel: "I authored this. The system will execute it."
- No "advice" language — this is **instruction**, not recommendation

**Key moment:**
- This is where the client understands: "My goal became a rule."

---

### Screen 3: Client Dashboard (Goal View)

**Route:** `/goals` or `/dashboard`

**What the client sees:**
- All their goals as cards (similar to carousel, but interactive)
- Each card shows:
  - Goal name
  - Progress (e.g., "$38,000 of $100,000 · 38% funded")
  - Status (e.g., "On track", "Ahead", "Behind")
  - Target date
  - Recent activity (e.g., "Contribution +$2,500 · Today 09:41")

**Interactions:**
- Click a goal → Goal Detail view
- Add new goal → Screen 1

**Design tone:**
- Calm, confident, no anxiety
- The client should feel: "Everything is on track. I don't need to manage this."

---

## Goal Detail View (Optional but recommended)

**Route:** `/goals/[id]`

**What the client sees:**
- Full goal card (larger)
- Progress chart (simple, not complex)
- Policy summary (what rules govern this goal)
- Activity feed (all contributions, allocations, rebalances)
- Option to edit goal or pause policy

**Key moment:**
- This is where the client can inspect the system working on their behalf

---

## How This Ties to TuringOS Reveal

**Current flow:**
Landing → "Enter the system" → System View (static, investor-grade)

**New flow option A (parallel paths):**
- Landing → "Enter the system" → System View (for investors/technical audience)
- Landing → "Get started" → Goal Creation → Dashboard (for clients)

**New flow option B (sequential):**
- Landing → "Get started" → Goal Creation → Dashboard
- Dashboard has a "View system internals" link → System View

**Recommendation:** Option B — the client experience is primary, system reveal is secondary (for those who want to inspect).

---

## Data Model (Simplified)

```
Goal {
  id: string
  name: string
  targetAmount: number
  targetDate: Date
  currentAmount: number
  status: "on_track" | "ahead" | "behind" | "paused"
  policy: Policy
  activities: Activity[]
}

Policy {
  allocationPercent: number
  rebalanceThreshold: number
  constraints: string[]
}

Activity {
  type: "contribution" | "allocation" | "rebalance" | "policy_update"
  amount: number
  timestamp: Date
  description: string
}
```

For the demo, this can be **mock data** — no backend required. We just need it to feel real.

---

## Open Questions for Your Review

1. **Wizard vs. Single Form** — Should goal creation be step-by-step or one screen?

2. **Policy Visibility** — How much of the compiled policy should the client see? Full constraints or simplified summary?

3. **Demo Data** — Should we pre-populate with the goals from the carousel (Home Deposit, Europe Trip, Retirement) or start fresh?

4. **"Get started" CTA** — Should the hero "Get started" button go to Goal Creation, or should we add a separate entry point?

5. **Mobile Priority** — Is this primarily desktop demo, or should mobile be equally polished?

---

## Success Criteria

After this is built, a viewer should be able to:

1. Create a goal with a name, amount, and date
2. See that goal become a policy (the "aha" moment)
3. View their goals on a dashboard with progress and status
4. Understand: "I define intent. The system executes. Everything is recorded."

This transforms the demo from **marketing** to **product**.

---

## Next Steps (pending your approval)

1. You review and mark up this spec
2. I implement Screen 1 (Goal Creation)
3. I implement Screen 2 (Policy Compilation)
4. I implement Screen 3 (Dashboard)
5. We connect the flow and test end-to-end
6. Tag and commit

---

**Awaiting your review.**
