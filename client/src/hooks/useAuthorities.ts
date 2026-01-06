/**
 * useAuthorities Hook
 * 
 * Provides authority-based access control for UI components.
 * Gate on authorities, NOT roles.
 * 
 * RULES:
 * - Do NOT branch on roles (CLIENT / OPERATOR / SUPERVISOR / COMPLIANCE)
 * - Gate functionality strictly via authorities
 * - Pages remain readable unless explicitly forbidden
 * - Actions (buttons, links, exports) disabled/hidden if authority missing
 * - Roles are labels only - displayed in System Proof for traceability
 */

import { useMemo, useState, useEffect } from 'react';
import { 
  getCurrentContext, 
  type Authority,
  type Role,
  hasAuthority,
  hasAllAuthorities,
  hasAnyAuthority,
  isDemoMode,
  type ExecutionContext,
} from '../api';

// =============================================================================
// HOOK RETURN TYPE
// =============================================================================

export interface UseAuthoritiesResult {
  /** All granted authorities */
  readonly authorities: readonly Authority[];
  /** User's role label (for display only - do NOT gate on this) */
  readonly role: Role | undefined;
  /** Check if a specific authority is granted */
  readonly has: (authority: Authority) => boolean;
  /** Check if ALL specified authorities are granted */
  readonly hasAll: (authorities: Authority[]) => boolean;
  /** Check if ANY of the specified authorities are granted */
  readonly hasAny: (authorities: Authority[]) => boolean;
  /** Current execution mode */
  readonly executionMode: 'DEMO' | 'LIVE';
  /** Whether using synthetic identity */
  readonly isSyntheticIdentity: boolean;
  /** Current tenant ID */
  readonly tenantId: string;
  /** Current user ID */
  readonly userId: string;
  /** Full execution context */
  readonly context: ExecutionContext | null;
}

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

/**
 * Hook to access and check authorities.
 * Use this to gate UI actions based on granted authorities.
 * 
 * @example
 * ```tsx
 * const { has, hasAny, role } = useAuthorities();
 * 
 * // Gate a button (correct - uses authority)
 * <Button disabled={!has('CONTROL_REBALANCE')}>
 *   Trigger Rebalance
 * </Button>
 * 
 * // Conditionally render (correct - uses authority)
 * {has('REPORT_DOWNLOAD') && <DownloadButton />}
 * 
 * // Display role label (correct - for traceability only)
 * <span>Role: {role}</span>
 * 
 * // WRONG - do NOT gate on role
 * // if (role === 'SUPERVISOR') { ... }
 * ```
 */
export function useAuthorities(): UseAuthoritiesResult {
  // Use state to trigger re-render on role change
  const [roleVersion, setRoleVersion] = useState(0);
  
  // Listen for role change events
  useEffect(() => {
    const handleRoleChange = () => {
      setRoleVersion(v => v + 1);
    };
    
    window.addEventListener('role-changed', handleRoleChange);
    return () => window.removeEventListener('role-changed', handleRoleChange);
  }, []);
  
  const context = getCurrentContext();
  
  return useMemo(() => {
    if (!context) {
      // Return empty authorities if no context
      return {
        authorities: [],
        role: undefined,
        has: () => false,
        hasAll: () => false,
        hasAny: () => false,
        executionMode: isDemoMode() ? 'DEMO' : 'LIVE',
        isSyntheticIdentity: false,
        tenantId: '',
        userId: '',
        context: null,
      };
    }

    return {
      authorities: context.authorities,
      role: context.role,
      has: (authority: Authority) => hasAuthority(context, authority),
      hasAll: (authorities: Authority[]) => hasAllAuthorities(context, authorities),
      hasAny: (authorities: Authority[]) => hasAnyAuthority(context, authorities),
      executionMode: context.executionMode,
      isSyntheticIdentity: context.isSyntheticIdentity,
      tenantId: context.tenantId,
      userId: context.userId,
      context,
    };
  }, [context, roleVersion]);
}

// =============================================================================
// AUTHORITY GATE COMPONENT
// =============================================================================

export interface AuthorityGateProps {
  /** Required authority to show children */
  authority?: Authority;
  /** Required authorities (ALL must be granted) */
  authorities?: Authority[];
  /** Required authorities (ANY must be granted) */
  anyOf?: Authority[];
  /** Content to show when authorized */
  children: React.ReactNode;
  /** Fallback content when not authorized (default: null) */
  fallback?: React.ReactNode;
}

/**
 * Component to conditionally render based on authorities.
 * 
 * @example
 * ```tsx
 * <AuthorityGate authority="CONTROL_REBALANCE">
 *   <RebalanceButton />
 * </AuthorityGate>
 * 
 * <AuthorityGate 
 *   anyOf={['REPORT_READ', 'REPORT_GENERATE']}
 *   fallback={<AccessDenied />}
 * >
 *   <ReportsSection />
 * </AuthorityGate>
 * ```
 */
export function AuthorityGate({
  authority,
  authorities,
  anyOf,
  children,
  fallback = null,
}: AuthorityGateProps): React.ReactNode {
  const { has, hasAll, hasAny } = useAuthorities();

  // Check single authority
  if (authority && !has(authority)) {
    return fallback;
  }

  // Check all authorities
  if (authorities && authorities.length > 0 && !hasAll(authorities)) {
    return fallback;
  }

  // Check any authority
  if (anyOf && anyOf.length > 0 && !hasAny(anyOf)) {
    return fallback;
  }

  return children;
}

// =============================================================================
// ROLE DESCRIPTIONS (for UI display only)
// =============================================================================

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  CLIENT: 'Portfolio owner with read-only access to their accounts',
  OPERATOR: 'Operations staff with portfolio management capabilities',
  SUPERVISOR: 'Senior staff with control and proof export capabilities',
  COMPLIANCE: 'Compliance officer with lock/unlock and audit capabilities',
};

// =============================================================================
// AUTHORITY DESCRIPTIONS (for UI display)
// =============================================================================

export const AUTHORITY_DESCRIPTIONS: Record<Authority, string> = {
  PORTFOLIO_READ: 'View portfolio information',
  PORTFOLIO_WRITE: 'Modify portfolio settings',
  PORTFOLIO_CONTROL: 'Execute portfolio control commands',
  GOAL_ACCOUNT_READ: 'View goal account information',
  GOAL_ACCOUNT_WRITE: 'Modify goal account settings',
  GOAL_ACCOUNT_CONTROL: 'Execute goal account control commands',
  REPORT_READ: 'View reports',
  REPORT_GENERATE: 'Generate new reports',
  REPORT_DOWNLOAD: 'Download report files',
  ACTIVITY_READ: 'View activity stream',
  CONTROL_REBALANCE: 'Trigger rebalance operations',
  CONTROL_PAUSE: 'Pause portfolio/goal account activity',
  CONTROL_LOCK: 'Apply compliance locks',
  CONTROL_UNLOCK: 'Remove compliance locks',
  CONTROL_PROOF_EXPORT: 'Export proof bundles',
  SYSTEM_PROOF_READ: 'View system proof information',
  SYSTEM_ADMIN: 'Configure system settings and thresholds',
  DUAL_CONTROL_APPROVER: 'Approve dual-control transactions and threshold changes',
};

export default useAuthorities;
