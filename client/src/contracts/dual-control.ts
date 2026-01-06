/**
 * Dual-Control Workflow Contracts
 * 
 * Types for two-person approval workflow.
 * Actions marked dualControlRequired: true require approval before execution.
 * 
 * RULES:
 * - Requester cannot approve their own request
 * - Only SUPERVISOR or COMPLIANCE can approve
 * - Requests expire after 24 hours
 * - All requests/approvals logged in Activity
 */

import type { Authority } from '../api/execution-context';

// =============================================================================
// DUAL-CONTROL STATUS
// =============================================================================

export type DualControlStatus = 
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CANCELLED';

// =============================================================================
// DUAL-CONTROL ACTION
// =============================================================================

export type DualControlAction = 
  | 'UNLOCK'
  | 'FORCE_REBALANCE'
  | 'OVERRIDE_LIMIT'
  | 'EMERGENCY_PAUSE';

// =============================================================================
// DUAL-CONTROL REQUEST
// =============================================================================

export interface DualControlRequest {
  /** Unique request identifier */
  readonly requestId: string;
  /** Action being requested */
  readonly action: DualControlAction;
  /** Target entity (portfolio, goal account, etc.) */
  readonly targetId: string;
  /** Target entity type */
  readonly targetType: 'PORTFOLIO' | 'GOAL_ACCOUNT' | 'SYSTEM';
  /** User who requested the action */
  readonly requestedBy: string;
  /** User's role at time of request */
  readonly requestedByRole: string;
  /** Timestamp of request */
  readonly requestedAt: string;
  /** Reason for request (required) */
  readonly reason: string;
  /** Current status */
  readonly status: DualControlStatus;
  /** User who approved/rejected (if applicable) */
  readonly reviewedBy?: string;
  /** Reviewer's role at time of review */
  readonly reviewedByRole?: string;
  /** Timestamp of review */
  readonly reviewedAt?: string;
  /** Review comment */
  readonly reviewComment?: string;
  /** Expiry timestamp (24 hours from request) */
  readonly expiresAt: string;
  /** Authority required to approve */
  readonly requiredAuthority: Authority;
}

// =============================================================================
// DUAL-CONTROL COMMAND
// =============================================================================

export interface DualControlRequestCommand {
  /** Action to request */
  action: DualControlAction;
  /** Target entity ID */
  targetId: string;
  /** Target entity type */
  targetType: 'PORTFOLIO' | 'GOAL_ACCOUNT' | 'SYSTEM';
  /** Reason for request */
  reason: string;
}

export interface DualControlReviewCommand {
  /** Request ID to review */
  requestId: string;
  /** Approve or reject */
  decision: 'APPROVE' | 'REJECT';
  /** Review comment */
  comment?: string;
}

// =============================================================================
// DUAL-CONTROL EVENTS
// =============================================================================

export type DualControlEventType =
  | 'DUAL_CONTROL_REQUESTED'
  | 'DUAL_CONTROL_APPROVED'
  | 'DUAL_CONTROL_REJECTED'
  | 'DUAL_CONTROL_EXPIRED'
  | 'DUAL_CONTROL_CANCELLED'
  | 'DUAL_CONTROL_EXECUTED';

// =============================================================================
// ACTION METADATA
// =============================================================================

export interface DualControlActionMetadata {
  /** Action identifier */
  action: DualControlAction;
  /** Human-readable label */
  label: string;
  /** Description of what the action does */
  description: string;
  /** Authority required to request */
  requestAuthority: Authority;
  /** Authority required to approve */
  approveAuthority: Authority;
  /** Risk level for display */
  riskLevel: 'HIGH' | 'CRITICAL';
}

export const DUAL_CONTROL_ACTIONS: Record<DualControlAction, DualControlActionMetadata> = {
  UNLOCK: {
    action: 'UNLOCK',
    label: 'Unlock Portfolio',
    description: 'Remove compliance lock from portfolio or goal account',
    requestAuthority: 'CONTROL_LOCK',
    approveAuthority: 'CONTROL_UNLOCK',
    riskLevel: 'HIGH',
  },
  FORCE_REBALANCE: {
    action: 'FORCE_REBALANCE',
    label: 'Force Rebalance',
    description: 'Execute rebalance outside normal schedule',
    requestAuthority: 'CONTROL_REBALANCE',
    approveAuthority: 'PORTFOLIO_CONTROL',
    riskLevel: 'HIGH',
  },
  OVERRIDE_LIMIT: {
    action: 'OVERRIDE_LIMIT',
    label: 'Override Limit',
    description: 'Temporarily override trading or allocation limits',
    requestAuthority: 'PORTFOLIO_CONTROL',
    approveAuthority: 'PORTFOLIO_CONTROL',
    riskLevel: 'CRITICAL',
  },
  EMERGENCY_PAUSE: {
    action: 'EMERGENCY_PAUSE',
    label: 'Emergency Pause',
    description: 'Immediately halt all trading activity',
    requestAuthority: 'CONTROL_PAUSE',
    approveAuthority: 'PORTFOLIO_CONTROL',
    riskLevel: 'CRITICAL',
  },
};
