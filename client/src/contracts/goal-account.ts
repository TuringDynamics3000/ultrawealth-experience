/**
 * Goal Account Contract Types
 * 
 * Imported from TuringCore-v3 canonical definitions.
 * UltraWealth consolidates visibility, not authority.
 * 
 * TERMINOLOGY CONSTRAINT:
 * - No "advice" - use "instruction", "execution", or "record"
 * - Self-directed flow: Goal → Instruction → Execution → Record
 */

// =============================================================================
// GOAL ACCOUNT TYPES
// =============================================================================

export type GoalType = 'retirement' | 'savings' | 'home' | 'education' | 'custom';

export type RiskProfile = 'conservative' | 'balanced' | 'growth';

export type GoalAccountStatus = 'draft' | 'saved' | 'active' | 'paused' | 'closed';

export interface GoalAccount {
  readonly id: string;
  readonly portfolioId: string;
  readonly name: string;
  readonly goalType: GoalType;
  readonly targetAmountCents: number;
  readonly targetDate: string;
  readonly clientReason?: string;
  readonly riskProfile: RiskProfile;
  readonly timeHorizonYears: number;
  readonly liquidityNeeds: 'low' | 'medium' | 'high';
  readonly expectedRange: {
    readonly lowCents: number;
    readonly highCents: number;
  };
  readonly feeEstimateAnnualCents: number;
  readonly status: GoalAccountStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface GoalAccountDetail extends GoalAccount {
  readonly holdingsSnapshot: HoldingsSnapshot;
  readonly performanceDeltas: PerformanceDeltas;
  readonly evidenceRefs: readonly EvidenceReference[];
  readonly stateHash: string;
}

// =============================================================================
// HOLDINGS SNAPSHOT
// =============================================================================

export interface HoldingsSnapshot {
  readonly snapshotAt: string;
  readonly totalValueCents: number;
  readonly holdings: readonly Holding[];
  readonly allocations: readonly Allocation[];
  readonly stateHash: string;
}

export interface Holding {
  readonly holdingId: string;
  readonly symbol: string;
  readonly name: string;
  readonly assetClass: string;
  readonly units: number;
  readonly pricePerUnitCents: number;
  readonly valueCents: number;
  readonly costBasisCents: number;
  readonly unrealizedGainCents: number;
  readonly weightPercent: number;
}

export interface Allocation {
  readonly assetClass: string;
  readonly targetPercent: number;
  readonly actualPercent: number;
  readonly driftPercent: number;
  readonly valueCents: number;
}

// =============================================================================
// PERFORMANCE DELTAS
// =============================================================================

export interface PerformanceDeltas {
  readonly periodStart: string;
  readonly periodEnd: string;
  readonly startValueCents: number;
  readonly endValueCents: number;
  readonly contributionsCents: number;
  readonly withdrawalsCents: number;
  readonly netFlowCents: number;
  readonly gainLossCents: number;
  readonly returnPercent: number;
  readonly benchmarkReturnPercent?: number;
  readonly evidenceRef: string;
}

// =============================================================================
// EVIDENCE REFERENCE
// =============================================================================

export interface EvidenceReference {
  readonly evidenceId: string;
  readonly evidenceType: EvidenceType;
  readonly description: string;
  readonly documentRef: string;
  readonly hash: string;
  readonly createdAt: string;
}

export type EvidenceType =
  | 'CONSENT_RECORD'
  | 'RISK_ASSESSMENT'
  | 'EXECUTION_CONFIRMATION'
  | 'STATEMENT'
  | 'POLICY_ACKNOWLEDGEMENT'
  | 'SYSTEM_GENERATED';

// =============================================================================
// RISK PROFILE ALLOCATIONS
// =============================================================================

export interface RiskAllocation {
  readonly label: string;
  readonly description: string;
  readonly allocation: readonly {
    readonly name: string;
    readonly percentage: number;
    readonly color: string;
  }[];
  readonly historicalDrawdown: string;
  readonly expectedReturn: {
    readonly low: number;
    readonly mid: number;
    readonly high: number;
  };
}

export const RISK_ALLOCATIONS: Record<RiskProfile, RiskAllocation> = {
  conservative: {
    label: 'Very steady',
    description: 'Lower risk, more stable returns. Best for shorter time horizons.',
    allocation: [
      { name: 'Australian Shares', percentage: 20, color: '#3B82F6' },
      { name: 'International Shares', percentage: 15, color: '#8B5CF6' },
      { name: 'Fixed Income', percentage: 45, color: '#10B981' },
      { name: 'Cash', percentage: 20, color: '#F59E0B' }
    ],
    historicalDrawdown: '-8% in worst year',
    expectedReturn: { low: 3, mid: 5, high: 7 }
  },
  balanced: {
    label: 'Balanced',
    description: 'A mix of growth and stability. Suitable for medium-term goals.',
    allocation: [
      { name: 'Australian Shares', percentage: 30, color: '#3B82F6' },
      { name: 'International Shares', percentage: 30, color: '#8B5CF6' },
      { name: 'Fixed Income', percentage: 30, color: '#10B981' },
      { name: 'Cash', percentage: 10, color: '#F59E0B' }
    ],
    historicalDrawdown: '-15% in worst year',
    expectedReturn: { low: 4, mid: 7, high: 10 }
  },
  growth: {
    label: 'Growth focused',
    description: 'Higher potential returns with more volatility. Best for long-term goals.',
    allocation: [
      { name: 'Australian Shares', percentage: 40, color: '#3B82F6' },
      { name: 'International Shares', percentage: 40, color: '#8B5CF6' },
      { name: 'Fixed Income', percentage: 15, color: '#10B981' },
      { name: 'Cash', percentage: 5, color: '#F59E0B' }
    ],
    historicalDrawdown: '-25% in worst year',
    expectedReturn: { low: 5, mid: 9, high: 13 }
  }
};

// =============================================================================
// GOAL ACCOUNT PROPS (for page rendering)
// =============================================================================

export interface GoalAccountPageProps {
  readonly goalAccount: GoalAccountDetail;
}
