/**
 * Portfolio Contract Types
 * 
 * Imported from TuringCore-v3 canonical definitions.
 * UltraWealth consolidates visibility, not authority.
 * 
 * RULES:
 * - No invented data
 * - Every number is traceable
 * - Every action emits an event
 * - Every report has a hash
 */

// =============================================================================
// PORTFOLIO TYPES
// =============================================================================

export type PortfolioStatus = 'draft' | 'active' | 'paused' | 'closed';

export interface PortfolioSummary {
  readonly portfolioId: string;
  readonly tenantId: string;
  readonly clientId: string;
  readonly name: string;
  readonly status: PortfolioStatus;
  readonly totalValueCents: number;
  readonly currency: string;
  readonly goalAccountIds: readonly string[];
  readonly stateHash: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface PortfolioSnapshot {
  readonly portfolioId: string;
  readonly snapshotAt: string;
  readonly totalValueCents: number;
  readonly allocations: readonly AllocationEntry[];
  readonly stateHash: string;
  readonly evidenceRef: string;
}

export interface AllocationEntry {
  readonly assetClass: string;
  readonly percentage: number;
  readonly valueCents: number;
  readonly holdings: readonly HoldingEntry[];
}

export interface HoldingEntry {
  readonly holdingId: string;
  readonly symbol: string;
  readonly name: string;
  readonly units: number;
  readonly pricePerUnitCents: number;
  readonly valueCents: number;
  readonly costBasisCents: number;
  readonly unrealizedGainCents: number;
}

// =============================================================================
// PORTFOLIO CHANGE TYPES
// =============================================================================

export type PortfolioChangeType =
  | 'REBALANCE'
  | 'STRATEGY_SWITCH'
  | 'CONTRIBUTION'
  | 'WITHDRAWAL'
  | 'DRAWDOWN_CHANGE'
  | 'RISK_PROFILE_UPDATE'
  | 'EXCEPTION_HANDLING';

export interface ProposedChange {
  readonly changeId: string;
  readonly changeType: PortfolioChangeType;
  readonly fromAllocation?: Record<string, number>;
  readonly toAllocation?: Record<string, number>;
  readonly amountCents?: number;
  readonly rationale: string;
  readonly initiatedBy: 'CLIENT' | 'SYSTEM';
  readonly createdAt: string;
}

export interface PortfolioChangeRecord {
  readonly changeId: string;
  readonly portfolioId: string;
  readonly proposedChange: ProposedChange;
  readonly preChangeSnapshot: PortfolioSnapshot;
  readonly postChangeSnapshot?: PortfolioSnapshot;
  readonly consentVerified: boolean;
  readonly consentRef?: string;
  readonly policyGatePassed: boolean;
  readonly policyRef?: string;
  readonly executionStatus: 'PENDING' | 'EXECUTING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  readonly executionRef?: string;
  readonly createdAt: string;
  readonly completedAt?: string;
}

// =============================================================================
// PORTFOLIO PROPS (for page rendering)
// =============================================================================

export interface PortfolioPageProps {
  readonly portfolio: PortfolioSummary;
}
