# UltraWealth Demo Walkthrough

## Overview

This demo showcases a regulated financial audit and control interface built on TuringCore-v3 contracts. The interface is designed for compliance officers, supervisors, and operators who need to verify portfolio state, review audit trails, and execute controlled operations.

**Core Principle**: UltraWealth consolidates visibility, not authority.

## Terminology

Per regulatory requirements, this system uses specific terminology:

| Avoid | Use Instead |
|-------|-------------|
| Advice | Instruction |
| Recommend | Execute |
| Suggest | Record |

The self-directed flow is: **Goal → Instruction → Execution → Record**

## Page Map

### 1. Login (`/login`)

**Purpose**: Authenticate users with tenant-scoped credentials.

**Data In**:
- Tenant identifier
- User credentials (via TuringDynamics OAuth)

**Data Out**:
- Auth token
- Authority/role claims

**Events Emitted**: None (pre-auth)

---

### 2. Onboarding (`/onboarding`)

**Purpose**: Create new client, portfolio, and optional initial goal account.

**Data Written**:
- Client record
- Portfolio record
- (Optional) Goal Account draft

**Events Emitted**:
- `ONBOARDING_STARTED`
- `GOAL_ACCOUNT_DRAFT_CREATED`
- `STRATEGY_PREVIEW_GENERATED`
- `GOAL_ACCOUNT_SAVED`
- `CLIENT_ACTIVATED`

---

### 3. Portfolio (`/portfolio`)

**Purpose**: Read-only view of portfolio summary and goal accounts.

**Data Read**:
- Portfolio summary
- Goal Account list
- Portfolio state hash

**Display Rules**:
- Tables preferred over charts
- Every number traceable to source
- No actions available (read-only)

---

### 4. Goal Account Detail (`/goal-accounts/[id]`)

**Purpose**: Detailed view of a single goal account.

**Data Read**:
- Goal Account configuration
- Holdings snapshot
- Performance deltas
- Evidence references

**Key Fields**:
- Holdings with cost basis and unrealized gains
- Allocation drift from target
- Period performance with benchmark comparison
- Evidence bundle references

---

### 5. Activity (`/activity`)

**Purpose**: Audit surface showing ordered event stream.

**Data Read**:
- Ordered event stream
- Actor/timestamp/event type for each event

**Display Rules**:
- No filtering (this is an audit surface)
- Every event shows:
  - Timestamp
  - Event type
  - Actor (type + ID)
  - Channel
  - Target (portfolio/goal account)
  - Hash

---

### 6. Reports (`/reports`)

**Purpose**: Access snapshot and delta reports with evidence.

**Data Read**:
- Report index
- Snapshot reports
- Delta reports
- Evidence bundle metadata

**Key Fields**:
- Report hash
- Evidence bundle ID
- Document hashes within bundles

---

### 7. Controls (`/controls`)

**Purpose**: Execute gated commands with full audit logging.

**Available Commands**:
- **Rebalance**: Trigger portfolio rebalancing
- **Pause**: Temporarily pause portfolio activity
- **Lock**: Apply compliance lock
- **Unlock**: Remove compliance lock (dual control required)
- **Proof Export**: Export evidence bundle for audit

**Rules**:
- All commands gated by authority matrix
- All commands logged to event stream
- Dual control required for sensitive operations

**Events Emitted**:
- `REBALANCE_REQUESTED` / `REBALANCE_EXECUTED`
- `LOCK_APPLIED` / `LOCK_REMOVED`
- `PROOF_EXPORT_TRIGGERED`

---

### 8. System Proof (`/system-proof`) - Demo Only

**Purpose**: Expose internal proof mechanisms for demonstration.

**Data Read**:
- Replay receipts
- Event hash chain
- Notarisation status

**Note**: This page is only visible in demo mode. In production, these mechanisms operate behind the scenes.

---

## Data Flow

```
TuringCore API
     │
     ▼
turingcore-client.ts (API Client)
     │
     ▼
contracts/*.ts (Type Definitions)
     │
     ▼
pages/*.tsx (UI Components)
```

## Verification Checklist

For each page, verify:

- [ ] Renders real backend data (or demo seed data)
- [ ] Every number is traceable to source
- [ ] Every action emits an event
- [ ] Every report has a hash
- [ ] A regulator could ask "why?" and the UI can point to proof

## Demo Seed Data

The demo includes pre-populated data in `demo/seed.ts`:

- **Tenant**: TuringDynamics Demo (AU jurisdiction)
- **Users**: Client, Operator, Supervisor, Compliance Officer
- **Portfolio**: Primary Portfolio with 3 goal accounts
- **Goal Accounts**:
  - Retirement Fund (growth profile)
  - Home Deposit (balanced profile)
  - Emergency Fund (conservative profile)
- **Events**: 10 sample events showing various event types
- **Reports**: 5 sample reports with evidence bundles

## API Client Methods

The `turingcore-client.ts` provides these methods:

| Method | Purpose |
|--------|---------|
| `getPortfolio(id)` | Fetch portfolio summary |
| `getGoalAccount(id)` | Fetch goal account detail |
| `listEvents(params)` | Fetch activity event stream |
| `triggerRebalance(params)` | Execute rebalance command |
| `triggerPause(params)` | Execute pause command |
| `triggerLock(params)` | Execute lock command |
| `triggerUnlock(params)` | Execute unlock command |
| `triggerProofExport(params)` | Export proof bundle |

## Regulatory Compliance

This interface is designed to support:

- **AFSL Requirements**: Full audit trail of all actions
- **SOC 2**: Event immutability and hash verification
- **GDPR**: Data traceability and evidence references
- **MiFID II**: Best execution evidence and reporting

## Environment Configuration

### DEMO_MODE (Default: true)

When `DEMO_MODE=true`:
- Uses mock client with seed data
- Synthetic identity injected for authentication
- Role switcher available in navigation
- All operations simulated, not executed against live systems

When `DEMO_MODE=false`:
- Uses HTTP client connecting to TuringCore API
- Real authentication required
- Role determined by actual user permissions
- Operations execute against live systems

### VITE_TURINGCORE_API_URL

Base URL for TuringCore API endpoints. Required when `DEMO_MODE=false`.

```bash
# Example configuration
VITE_TURINGCORE_API_URL=https://api.turingcore.example.com
DEMO_MODE=false
```

### API Endpoints

The HTTP client expects these TuringCore endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/portfolios/{id}` | GET | Fetch portfolio summary |
| `/api/v1/goal-accounts/{id}` | GET | Fetch goal account detail |
| `/api/v1/events` | GET | List activity events |
| `/api/v1/commands/rebalance` | POST | Trigger rebalance |
| `/api/v1/commands/pause` | POST | Trigger pause |
| `/api/v1/commands/lock` | POST | Apply lock |
| `/api/v1/commands/unlock` | POST | Remove lock |
| `/api/v1/reports` | GET | List reports |
| `/api/v1/reports/{id}/download` | GET | Download report |
| `/api/v2/applications/start` | POST | Start onboarding case |
| `/api/v2/applications/{id}` | GET | Get onboarding case |
| `/api/v1/templates` | GET | List portfolio templates |
| `/api/v1/templates/{id}` | GET | Get template detail |

## Role Switcher (Demo Only)

In DEMO_MODE, a role switcher dropdown appears in the navigation bar. This allows demonstrating how different roles see different authority levels:

| Role | Authorities |
|------|-------------|
| CLIENT | PORTFOLIO_READ, GOAL_ACCOUNT_READ |
| OPERATOR | PORTFOLIO_READ, PORTFOLIO_WRITE, GOAL_ACCOUNT_READ, GOAL_ACCOUNT_WRITE, CONTROL_REBALANCE, CONTROL_PAUSE |
| SUPERVISOR | All OPERATOR authorities + CONTROL_LOCK, CONTROL_UNLOCK, REPORT_READ |
| COMPLIANCE | All authorities including SYSTEM_PROOF_READ, CONTROL_PROOF_EXPORT |

## Dual-Control Workflow

Certain high-risk actions require two-person approval:

| Action | Risk Level | Required Authority |
|--------|------------|--------------------|
| UNLOCK | CRITICAL | CONTROL_UNLOCK |
| FORCE_REBALANCE | HIGH | PORTFOLIO_CONTROL |
| OVERRIDE_LIMIT | HIGH | PORTFOLIO_CONTROL |

The requester cannot approve their own request. All dual-control events are logged to the Activity timeline.

## Next Steps

1. ~~Connect to real TuringCore API~~ (HTTP client ready)
2. Implement real-time event streaming
3. Add PDF export for reports
4. Integrate with external notarisation service
