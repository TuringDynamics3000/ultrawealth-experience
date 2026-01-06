/**
 * Activity Contract Types
 * 
 * Imported from TuringCore-v3 canonical definitions.
 * UltraWealth consolidates visibility, not authority.
 * 
 * RULES:
 * - No filtering magic - this is an audit surface
 * - Every event has actor, timestamp, and type
 * - Events are ordered and immutable
 */

// =============================================================================
// ACTIVITY EVENT TYPES
// =============================================================================

export type ActivityEventType =
  // Onboarding Events
  | 'ONBOARDING_STARTED'
  | 'GOAL_ACCOUNT_DRAFT_CREATED'
  | 'STRATEGY_PREVIEW_GENERATED'
  | 'GOAL_ACCOUNT_SAVED'
  | 'ACCOUNT_LITE_CREATED'
  | 'DISCLOSURE_VIEWED'
  | 'CONSENT_GIVEN'
  | 'KYC_STARTED'
  | 'KYC_RESULT_RECEIVED'
  | 'BANK_ACCOUNT_LINKED'
  | 'INITIAL_DEPOSIT_RECEIVED'
  | 'CLIENT_ACTIVATED'
  // Portfolio Events
  | 'PORTFOLIO_CREATED'
  | 'PORTFOLIO_UPDATED'
  | 'PORTFOLIO_PAUSED'
  | 'PORTFOLIO_RESUMED'
  // Goal Account Events
  | 'GOAL_ACCOUNT_CREATED'
  | 'GOAL_ACCOUNT_ACTIVATED'
  | 'GOAL_ACCOUNT_PAUSED'
  | 'GOAL_ACCOUNT_CLOSED'
  // Execution Events
  | 'REBALANCE_REQUESTED'
  | 'REBALANCE_APPROVED'
  | 'REBALANCE_EXECUTED'
  | 'REBALANCE_FAILED'
  | 'CONTRIBUTION_RECEIVED'
  | 'WITHDRAWAL_REQUESTED'
  | 'WITHDRAWAL_EXECUTED'
  // Control Events
  | 'LOCK_APPLIED'
  | 'LOCK_REMOVED'
  | 'PROOF_EXPORT_TRIGGERED'
  | 'POLICY_GATE_PASSED'
  | 'POLICY_GATE_FAILED'
  // Template Events
  | 'TEMPLATE_SELECTED'
  | 'PORTFOLIO_INSTANTIATED_FROM_TEMPLATE'
  // Legal Entity Onboarding Events (aligned with onboarding_v2)
  | 'ONBOARDING_CASE_CREATED'
  | 'LEGAL_ENTITY_DECLARED'
  | 'PERSON_ADDED'
  | 'RELATIONSHIP_ADDED'
  | 'CONFIRMATION_RECORDED'
  | 'ONBOARDING_FINALISED'
  // FX Conversion Events
  | 'FX_CONVERSION_REQUESTED'
  | 'FX_RATE_QUOTED'
  | 'FX_CONVERSION_EXECUTED'
  | 'FX_CONVERSION_REJECTED'
  // Crypto Execution Events
  | 'CRYPTO_EXECUTION_REQUESTED'
  | 'CRYPTO_PRICE_QUOTED'
  | 'CRYPTO_EXECUTION_COMPLETED'
  | 'CRYPTO_EXECUTION_REJECTED'
  | 'CRYPTO_EXECUTION_FAILED'
  // Threshold Events
  | 'THRESHOLD_CHANGED'
  | 'THRESHOLD_CREATED'
  // System Events
  | 'SYSTEM_SNAPSHOT_CREATED'
  | 'SYSTEM_HASH_COMPUTED'
  | 'EVIDENCE_BUNDLE_CREATED';

export type ActorType = 'CLIENT' | 'SYSTEM' | 'OPERATOR' | 'SUPERVISOR' | 'COMPLIANCE';

// =============================================================================
// ACTIVITY EVENT
// =============================================================================

export interface ActivityEvent {
  readonly eventId: string;
  readonly eventType: ActivityEventType;
  readonly eventVersion: number;
  readonly occurredAt: string;
  readonly actor: Actor;
  readonly tenantId: string;
  readonly portfolioId?: string;
  readonly goalAccountId?: string;
  readonly source: EventSource;
  readonly payload: Record<string, unknown>;
  readonly hash: string;
}

export interface Actor {
  readonly actorType: ActorType;
  readonly actorId: string;
  readonly sessionId?: string;
  readonly role?: string;
}

export interface EventSource {
  readonly channel: 'web' | 'mobile' | 'api' | 'system';
  readonly deviceFingerprint?: string;
  readonly ipAddress?: string;
  readonly jurisdiction: string;
}

// =============================================================================
// ACTIVITY STREAM
// =============================================================================

export interface ActivityStream {
  readonly events: readonly ActivityEvent[];
  readonly totalCount: number;
  readonly pageSize: number;
  readonly pageNumber: number;
  readonly hasMore: boolean;
  readonly streamHash: string;
}

// =============================================================================
// REPORT TYPES
// =============================================================================

export interface ReportIndex {
  readonly reports: readonly ReportSummary[];
  readonly totalCount: number;
}

export interface ReportSummary {
  readonly reportId: string;
  readonly reportType: ReportType;
  readonly title: string;
  readonly periodStart: string;
  readonly periodEnd: string;
  readonly generatedAt: string;
  readonly hash: string;
  readonly evidenceBundleId: string;
  /** 
   * Direct download URL for the report artefact.
   * In DEMO mode: undefined (simulated download)
   * In LIVE mode: Pre-signed S3 URL from TuringCore API
   */
  readonly downloadUrl?: string;
}

export type ReportType =
  | 'SNAPSHOT'
  | 'DELTA'
  | 'ANNUAL_STATEMENT'
  | 'TAX_SUMMARY'
  | 'AUDIT_TRAIL';

export interface SnapshotReport extends ReportSummary {
  readonly reportType: 'SNAPSHOT';
  readonly portfolioValueCents: number;
  readonly goalAccountCount: number;
  readonly allocations: readonly {
    readonly assetClass: string;
    readonly percentage: number;
    readonly valueCents: number;
  }[];
}

export interface DeltaReport extends ReportSummary {
  readonly reportType: 'DELTA';
  readonly startValueCents: number;
  readonly endValueCents: number;
  readonly netFlowCents: number;
  readonly gainLossCents: number;
  readonly returnPercent: number;
  readonly eventCount: number;
}

export interface EvidenceBundleMetadata {
  readonly bundleId: string;
  readonly createdAt: string;
  readonly documentCount: number;
  readonly totalSizeBytes: number;
  readonly hash: string;
  readonly documents: readonly {
    readonly documentId: string;
    readonly documentType: string;
    readonly hash: string;
  }[];
  /** 
   * Direct download URL for the evidence bundle.
   * In DEMO mode: undefined (simulated download)
   * In LIVE mode: Pre-signed S3 URL from TuringCore API
   */
  readonly downloadUrl?: string;
}

// =============================================================================
// SYSTEM PROOF TYPES (Demo Only)
// =============================================================================

export interface SystemProofBundle {
  readonly bundleId: string;
  readonly createdAt: string;
  readonly replayReceipts: readonly ReplayReceipt[];
  readonly eventHashes: readonly EventHash[];
  readonly notarisationStatus: NotarisationStatus;
  readonly bundleHash: string;
}

export interface ReplayReceipt {
  readonly receiptId: string;
  readonly eventId: string;
  readonly replayedAt: string;
  readonly resultHash: string;
  readonly verified: boolean;
}

export interface EventHash {
  readonly eventId: string;
  readonly eventType: ActivityEventType;
  readonly occurredAt: string;
  readonly hash: string;
  readonly previousHash: string;
  readonly chainPosition: number;
}

export type NotarisationStatus = 'PENDING' | 'SUBMITTED' | 'CONFIRMED' | 'FAILED';

// =============================================================================
// AUTHORITY TYPES (for Controls page)
// =============================================================================

export type Role = 'OPERATOR' | 'SUPERVISOR' | 'COMPLIANCE' | 'PLATFORM_ADMIN';

export type DecisionType = 'PAYMENT' | 'LIMIT_OVERRIDE' | 'AML_EXCEPTION' | 'POLICY_CHANGE';

export interface AuthoritySet {
  readonly role: Role;
  readonly permissions: readonly Permission[];
  readonly matrixVersion: string;
  readonly matrixHash: string;
}

export interface Permission {
  readonly decisionType: DecisionType;
  readonly allowed: boolean;
  readonly dualControlRequired: boolean;
  readonly policyCode: string;
}

// =============================================================================
// CONTROL COMMAND TYPES
// =============================================================================

export type ControlCommandType =
  | 'REBALANCE'
  | 'PAUSE'
  | 'LOCK'
  | 'UNLOCK'
  | 'PROOF_EXPORT';

export interface ControlCommand {
  readonly commandId: string;
  readonly commandType: ControlCommandType;
  readonly targetId: string;
  readonly targetType: 'PORTFOLIO' | 'GOAL_ACCOUNT';
  readonly issuedBy: Actor;
  readonly issuedAt: string;
  readonly status: 'PENDING' | 'APPROVED' | 'EXECUTED' | 'REJECTED' | 'FAILED';
  readonly requiresDualControl: boolean;
  readonly approvedBy?: Actor;
  readonly approvedAt?: string;
  readonly executedAt?: string;
  readonly eventRef?: string;
  readonly hash: string;
}

// =============================================================================
// PAGE PROPS
// =============================================================================

export interface ActivityPageProps {
  readonly events: readonly ActivityEvent[];
}

export interface ReportsPageProps {
  readonly reports: ReportIndex;
}

export interface ControlsPageProps {
  readonly permissions: AuthoritySet;
}

export interface SystemProofPageProps {
  readonly proof: SystemProofBundle;
}
