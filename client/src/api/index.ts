/**
 * TuringCore API Client Index
 * 
 * Runtime client selection:
 * - DEMO_MODE=true → mock client with seed data
 * - DEMO_MODE=false → HTTP client connecting to real TuringCore API
 * 
 * RULES:
 * - UI code must NOT know which client is in use
 * - All requests propagate ExecutionContext
 * - Fail loudly on API errors
 */

export * from './turingcore-client';
export * from './mock-client';
export * from './http-client';
export * from './execution-context';

import type { TuringCoreClient } from './turingcore-client';
import { createMockClient } from './mock-client';
import { createHttpClient, type HttpClientConfig } from './http-client';
import { 
  type ExecutionContext, 
  type ExecutionMode,
  type Role,
  createDemoContext,
  DEMO_AUTHORITIES,
  ROLE_PRESETS,
  getAuthoritiesForRole,
} from './execution-context';

// =============================================================================
// RUNTIME CONFIGURATION
// =============================================================================

/**
 * Check if DEMO_MODE is enabled.
 * Reads from environment variable or defaults to true.
 */
export function isDemoMode(): boolean {
  // Check Vite environment variable
  const envValue = import.meta.env.VITE_DEMO_MODE;
  if (envValue === 'false' || envValue === false) {
    return false;
  }
  // Default to true for safety
  return true;
}

/**
 * Get current execution mode.
 */
export function getExecutionMode(): ExecutionMode {
  return isDemoMode() ? 'DEMO' : 'LIVE';
}

// =============================================================================
// CLIENT SINGLETON
// =============================================================================

let clientInstance: TuringCoreClient | null = null;
let currentContext: ExecutionContext | null = null;

/**
 * Get the TuringCore API client.
 * Automatically selects mock or HTTP client based on DEMO_MODE.
 * 
 * @param context - Optional execution context (uses demo context in DEMO_MODE)
 */
export function getClient(context?: ExecutionContext): TuringCoreClient {
  const demoMode = isDemoMode();
  
  // In DEMO mode, use mock client with demo context
  if (demoMode) {
    if (!clientInstance) {
      currentContext = context || createDemoContext();
      clientInstance = createMockClient();
      console.log('[TuringCore Client] Initialized in DEMO mode with mock client');
    }
    return clientInstance;
  }

  // In LIVE mode, require execution context
  const ctx = context || currentContext;
  if (!ctx) {
    throw new Error(
      '[TuringCore Client] ExecutionContext required in LIVE mode. ' +
      'Call initializeClient() with context first.'
    );
  }

  // Create HTTP client if not exists or context changed
  if (!clientInstance || ctx !== currentContext) {
    const config: HttpClientConfig = {
      baseUrl: import.meta.env.VITE_TURINGCORE_API_URL || 'http://localhost:3001',
      timeout: 30000,
    };
    currentContext = ctx;
    clientInstance = createHttpClient(config, ctx);
    console.log('[TuringCore Client] Initialized in LIVE mode with HTTP client', {
      baseUrl: config.baseUrl,
      tenantId: ctx.tenantId,
      userId: ctx.userId,
    });
  }

  return clientInstance;
}

/**
 * Initialize the client with execution context.
 * Must be called before getClient() in LIVE mode.
 */
export function initializeClient(context: ExecutionContext): TuringCoreClient {
  // Reset client to force re-creation with new context
  clientInstance = null;
  currentContext = context;
  return getClient(context);
}

/**
 * Get the current execution context.
 */
export function getCurrentContext(): ExecutionContext | null {
  if (!currentContext && isDemoMode()) {
    currentContext = createDemoContext();
  }
  return currentContext;
}

/**
 * Reset the client (useful for testing or context changes).
 */
export function resetClient(): void {
  clientInstance = null;
  currentContext = null;
}

/**
 * Switch the current role in DEMO_MODE.
 * Re-maps authorities from ROLE_PRESETS.
 * 
 * @param role - The new role to switch to
 * @returns The updated execution context
 */
export function switchRole(role: Role): ExecutionContext {
  if (!isDemoMode()) {
    throw new Error('[TuringCore Client] Role switching is only available in DEMO_MODE');
  }

  const authorities = getAuthoritiesForRole(role);
  const newContext: ExecutionContext = {
    tenantId: currentContext?.tenantId || 'tenant_demo',
    userId: currentContext?.userId || 'user_demo_supervisor',
    authorities,
    executionMode: 'DEMO',
    role,
    isSyntheticIdentity: true,
  };

  currentContext = newContext;
  
  // Log role switch for audit trail
  console.log('[TuringCore Client] Role switched', {
    role,
    authorities: authorities.length,
    timestamp: new Date().toISOString(),
  });

  return newContext;
}

/**
 * Get the current role.
 */
export function getCurrentRole(): Role {
  return currentContext?.role || 'SUPERVISOR';
}

// =============================================================================
// RE-EXPORTS FOR CONVENIENCE
// =============================================================================

export { 
  DEMO_AUTHORITIES, 
  createDemoContext,
  ROLE_PRESETS,
  getAuthoritiesForRole,
  type Role,
};

export default getClient;
