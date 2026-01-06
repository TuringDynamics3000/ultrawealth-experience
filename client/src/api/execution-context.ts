/**
 * Execution Context
 * 
 * Propagated on all API requests to TuringCore.
 * Contains tenant, user, authorities, and execution mode.
 * 
 * RULES:
 * - All requests must include this context
 * - UI code must NOT know which client is in use
 * - Fail loudly on missing context
 * - Gate on AUTHORITIES, not roles
 * - Roles are labels, authorities are truth
 */

// =============================================================================
// EXECUTION MODE
// =============================================================================

export type ExecutionMode = 'DEMO' | 'LIVE';

// =============================================================================
// ROLE TYPES
// =============================================================================

/**
 * Role types for labeling users.
 * IMPORTANT: Roles are labels only. Gate on AUTHORITIES, not roles.
 */
export type Role = 'CLIENT' | 'OPERATOR' | 'SUPERVISOR' | 'COMPLIANCE';

// =============================================================================
// AUTHORITY TYPES (for RBAC)
// =============================================================================

/**
 * Authority types for gating functionality.
 * Gate on authorities, NOT roles.
 */
export type Authority =
  // Portfolio authorities
  | 'PORTFOLIO_READ'
  | 'PORTFOLIO_WRITE'
  | 'PORTFOLIO_CONTROL'
  // Goal Account authorities
  | 'GOAL_ACCOUNT_READ'
  | 'GOAL_ACCOUNT_WRITE'
  | 'GOAL_ACCOUNT_CONTROL'
  // Report authorities
  | 'REPORT_READ'
  | 'REPORT_GENERATE'
  | 'REPORT_DOWNLOAD'
  // Activity authorities
  | 'ACTIVITY_READ'
  // Control authorities
  | 'CONTROL_REBALANCE'
  | 'CONTROL_PAUSE'
  | 'CONTROL_LOCK'
  | 'CONTROL_UNLOCK'
  | 'CONTROL_PROOF_EXPORT'
  // System authorities
  | 'SYSTEM_PROOF_READ'
  | 'SYSTEM_ADMIN'
  // Dual-control authorities
  | 'DUAL_CONTROL_APPROVER';

// =============================================================================
// ROLE-BASED AUTHORITY PRESETS (LOCKED)
// =============================================================================

/**
 * Canonical role → authority mappings.
 * 
 * RULES:
 * - Map role → authorities at login/session creation ONLY
 * - UI continues to call hasAuthority()
 * - Do NOT branch UI logic on role
 * - Do NOT duplicate components per role
 * - Do NOT hide data instead of disabling actions
 * 
 * Roles are labels. Authorities remain truth.
 */
export const ROLE_PRESETS: Record<Role, readonly Authority[]> = {
  CLIENT: [
    'PORTFOLIO_READ',
    'GOAL_ACCOUNT_READ',
    'REPORT_READ',
    'ACTIVITY_READ',
  ],

  OPERATOR: [
    'PORTFOLIO_READ',
    'PORTFOLIO_WRITE',
    'GOAL_ACCOUNT_READ',
    'GOAL_ACCOUNT_WRITE',
    'REPORT_READ',
    'REPORT_GENERATE',
    'ACTIVITY_READ',
    'CONTROL_PAUSE',
  ],

  SUPERVISOR: [
    'PORTFOLIO_READ',
    'PORTFOLIO_WRITE',
    'PORTFOLIO_CONTROL',
    'GOAL_ACCOUNT_READ',
    'GOAL_ACCOUNT_WRITE',
    'GOAL_ACCOUNT_CONTROL',
    'REPORT_READ',
    'REPORT_GENERATE',
    'REPORT_DOWNLOAD',
    'ACTIVITY_READ',
    'CONTROL_REBALANCE',
    'CONTROL_PAUSE',
    'CONTROL_PROOF_EXPORT',
    'SYSTEM_PROOF_READ',
    'SYSTEM_ADMIN',
    'DUAL_CONTROL_APPROVER',
  ],

  COMPLIANCE: [
    'PORTFOLIO_READ',
    'GOAL_ACCOUNT_READ',
    'REPORT_READ',
    'REPORT_DOWNLOAD',
    'ACTIVITY_READ',
    'CONTROL_LOCK',
    'CONTROL_UNLOCK',
    'SYSTEM_PROOF_READ',
    'SYSTEM_ADMIN',
    'DUAL_CONTROL_APPROVER',
  ],
} as const;

/**
 * Get authorities for a given role.
 */
export function getAuthoritiesForRole(role: Role): readonly Authority[] {
  return ROLE_PRESETS[role];
}

// =============================================================================
// EXECUTION CONTEXT
// =============================================================================

export interface ExecutionContext {
  /** Tenant identifier */
  readonly tenantId: string;
  /** User identifier */
  readonly userId: string;
  /** User's role (label only - gate on authorities) */
  readonly role?: Role;
  /** Granted authorities for this user */
  readonly authorities: readonly Authority[];
  /** Execution mode (DEMO or LIVE) */
  readonly executionMode: ExecutionMode;
  /** Session identifier for audit trail */
  readonly sessionId?: string;
  /** Synthetic identity flag (true in DEMO mode) */
  readonly isSyntheticIdentity: boolean;
}

// =============================================================================
// CONTEXT VALIDATION
// =============================================================================

export function validateExecutionContext(ctx: ExecutionContext): void {
  if (!ctx.tenantId) {
    throw new Error('ExecutionContext: tenantId is required');
  }
  if (!ctx.userId) {
    throw new Error('ExecutionContext: userId is required');
  }
  if (!ctx.executionMode) {
    throw new Error('ExecutionContext: executionMode is required');
  }
  if (!Array.isArray(ctx.authorities)) {
    throw new Error('ExecutionContext: authorities must be an array');
  }
}

// =============================================================================
// AUTHORITY HELPERS
// =============================================================================

/**
 * Check if context has a specific authority.
 */
export function hasAuthority(ctx: ExecutionContext, authority: Authority): boolean {
  return ctx.authorities.includes(authority);
}

/**
 * Check if context has ALL specified authorities.
 */
export function hasAllAuthorities(ctx: ExecutionContext, authorities: Authority[]): boolean {
  return authorities.every(auth => ctx.authorities.includes(auth));
}

/**
 * Check if context has ANY of the specified authorities.
 */
export function hasAnyAuthority(ctx: ExecutionContext, authorities: Authority[]): boolean {
  return authorities.some(auth => ctx.authorities.includes(auth));
}

// =============================================================================
// DEMO CONTEXT
// =============================================================================

/**
 * Default authorities granted in DEMO mode.
 * Supervisor-level visibility for demonstration purposes.
 */
export const DEMO_AUTHORITIES: Authority[] = [
  'PORTFOLIO_READ',
  'PORTFOLIO_WRITE',
  'PORTFOLIO_CONTROL',
  'GOAL_ACCOUNT_READ',
  'GOAL_ACCOUNT_WRITE',
  'GOAL_ACCOUNT_CONTROL',
  'REPORT_READ',
  'REPORT_GENERATE',
  'REPORT_DOWNLOAD',
  'ACTIVITY_READ',
  'CONTROL_REBALANCE',
  'CONTROL_PAUSE',
  'CONTROL_LOCK',
  'CONTROL_UNLOCK',
  'CONTROL_PROOF_EXPORT',
  'SYSTEM_PROOF_READ',
  'SYSTEM_ADMIN',
  'DUAL_CONTROL_APPROVER',
];

/**
 * Create a demo execution context.
 * Uses SUPERVISOR role preset with all demo authorities.
 */
export function createDemoContext(): ExecutionContext {
  return {
    tenantId: 'tenant_demo',
    userId: 'demo_user_001',
    role: 'SUPERVISOR',
    authorities: DEMO_AUTHORITIES,
    executionMode: 'DEMO',
    sessionId: `demo_session_${Date.now()}`,
    isSyntheticIdentity: true,
  };
}

/**
 * Create an execution context from a role.
 * Maps role → authorities at creation time.
 */
export function createContextFromRole(
  tenantId: string,
  userId: string,
  role: Role,
  executionMode: ExecutionMode = 'LIVE',
): ExecutionContext {
  return {
    tenantId,
    userId,
    role,
    authorities: [...ROLE_PRESETS[role]],
    executionMode,
    sessionId: `session_${Date.now()}`,
    isSyntheticIdentity: false,
  };
}
