/**
 * HTTP-Backed TuringCore Client
 * 
 * Real HTTP client that connects to TuringCore-v3 API.
 * Used when DEMO_MODE=false.
 * 
 * RULES:
 * - Propagates ExecutionContext on all requests
 * - Fails loudly on API errors (no silent fallbacks)
 * - UI code must NOT know which client is in use
 */

import type {
  TuringCoreClient,
  APIResponse,
  APIError,
  ListEventsParams,
  RebalanceParams,
  PauseParams,
  LockParams,
  UnlockParams,
  ProofExportParams,
  FxConversionParams,
  FxQuoteParams,
  CryptoExecutionParams,
  CryptoQuoteParams,
  RequestThresholdChangeParams,
  ApproveThresholdChangeParams,
  RejectThresholdChangeParams,
  ListThresholdNotificationsParams,
} from './turingcore-client';
import type {
  PortfolioSummary,
  PortfolioSnapshot,
  PortfolioChangeRecord,
} from '../contracts/portfolio';
import type { GoalAccountDetail } from '../contracts/goal-account';
import type {
  ActivityEvent,
  ActivityStream,
  ReportIndex,
  ReportSummary,
  EvidenceBundleMetadata,
  SystemProofBundle,
  ControlCommand,
  AuthoritySet,
} from '../contracts/activity';
import type {
  TemplateIndex,
  PortfolioTemplate,
  CreatePortfolioFromTemplateParams,
  CreatePortfolioFromTemplateResult,
} from '../contracts/template';
import type {
  OnboardingCase,
  OnboardingEvent,
  OnboardingSummary,
  StartOnboardingRequest,
  StartOnboardingResponse,
  AddPersonRequest,
  AddRelationshipRequest,
  FinaliseOnboardingRequest,
  FinaliseOnboardingResponse,
  NaturalPerson,
  OnboardingRelationship,
} from '../contracts/onboarding';
import type {
  FxConversionRecord,
  FxRateQuote,
  CryptoExecutionRecord,
  CryptoPriceQuote,
  CryptoHolding,
  FxEvent,
  CryptoEvent,
  CurrencyConfiguration,
  FxExecutionProof,
  CryptoExecutionProof,
} from '../contracts/fx-crypto';
import type {
  ThresholdConfig,
  ThresholdChangeEvent,
  ThresholdHistoryEntry,
  SetThresholdResponse,
  ThresholdCategory,
  ThresholdChangeRequest,
  ThresholdNotification,
} from '../contracts/threshold';
import type { SetThresholdParams } from './turingcore-client';
import type { ExecutionContext } from './execution-context';
import { validateExecutionContext } from './execution-context';

// =============================================================================
// HTTP CLIENT CONFIG
// =============================================================================

export interface HttpClientConfig {
  readonly baseUrl: string;
  readonly timeout?: number;
}

// =============================================================================
// HTTP CLIENT IMPLEMENTATION
// =============================================================================

export function createHttpClient(
  config: HttpClientConfig,
  context: ExecutionContext
): TuringCoreClient {
  // Validate context on client creation
  validateExecutionContext(context);

  const { baseUrl, timeout = 30000 } = config;

  // Build headers with context propagation
  const buildHeaders = (): Record<string, string> => ({
    'Content-Type': 'application/json',
    'X-Tenant-ID': context.tenantId,
    'X-User-ID': context.userId,
    'X-Execution-Mode': context.executionMode,
    'X-Session-ID': context.sessionId || '',
    'X-Synthetic-Identity': context.isSyntheticIdentity ? 'true' : 'false',
    'X-Authorities': context.authorities.join(','),
  });

  /**
   * Make HTTP request with context propagation.
   * Fails loudly on errors - no silent fallbacks.
   */
  async function request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<APIResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${baseUrl}${path}`, {
        method,
        headers: buildHeaders(),
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        // Fail loudly - throw error for non-2xx responses
        const error: APIError = {
          code: data.code || `HTTP_${response.status}`,
          message: data.message || `HTTP ${response.status}: ${response.statusText}`,
          details: data.details,
        };
        
        // Log error for audit trail
        console.error('[TuringCore HTTP Client] API Error:', {
          method,
          path,
          status: response.status,
          error,
          context: {
            tenantId: context.tenantId,
            userId: context.userId,
            executionMode: context.executionMode,
          },
        });

        return {
          success: false,
          error,
          meta: {
            timestamp: new Date().toISOString(),
            requestId: response.headers.get('X-Request-ID') || '',
          },
        };
      }

      return {
        success: true,
        data: data.data || data,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: response.headers.get('X-Request-ID') || '',
          hash: data.hash,
        },
      };
    } catch (error) {
      clearTimeout(timeoutId);

      // Fail loudly on network errors
      const apiError: APIError = {
        code: error instanceof Error && error.name === 'AbortError' 
          ? 'TIMEOUT' 
          : 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Network error',
      };

      console.error('[TuringCore HTTP Client] Network Error:', {
        method,
        path,
        error: apiError,
        context: {
          tenantId: context.tenantId,
          userId: context.userId,
          executionMode: context.executionMode,
        },
      });

      return {
        success: false,
        error: apiError,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: '',
        },
      };
    }
  }

  return {
    // Portfolio Operations
    getPortfolio: (portfolioId) =>
      request<PortfolioSummary>('GET', `/api/v1/portfolios/${portfolioId}`),
    getPortfolioSnapshot: (portfolioId) =>
      request<PortfolioSnapshot>('GET', `/api/v1/portfolios/${portfolioId}/snapshot`),
    listPortfolioChanges: (portfolioId) =>
      request<PortfolioChangeRecord[]>('GET', `/api/v1/portfolios/${portfolioId}/changes`),

    // Goal Account Operations
    getGoalAccount: (goalAccountId) =>
      request<GoalAccountDetail>('GET', `/api/v1/goal-accounts/${goalAccountId}`),
    listGoalAccounts: (portfolioId) =>
      request<GoalAccountDetail[]>('GET', `/api/v1/portfolios/${portfolioId}/goal-accounts`),

    // Template Operations (Read-Only)
    listPortfolioTemplates: () =>
      request<TemplateIndex>('GET', `/api/v1/templates`),
    getPortfolioTemplate: (templateId: string, version: string) =>
      request<PortfolioTemplate>('GET', `/api/v1/templates/${templateId}/versions/${version}`),

    // Template Instantiation (Command)
    createPortfolioFromTemplate: (params: CreatePortfolioFromTemplateParams) =>
      request<CreatePortfolioFromTemplateResult>('POST', `/api/v1/portfolios/from-template`, params),

    // Activity Operations
    listEvents: (params: ListEventsParams) => {
      const queryParams = new URLSearchParams();
      if (params.portfolioId) queryParams.set('portfolioId', params.portfolioId);
      if (params.goalAccountId) queryParams.set('goalAccountId', params.goalAccountId);
      if (params.eventTypes) queryParams.set('eventTypes', params.eventTypes.join(','));
      if (params.fromDate) queryParams.set('fromDate', params.fromDate);
      if (params.toDate) queryParams.set('toDate', params.toDate);
      if (params.pageSize) queryParams.set('pageSize', params.pageSize.toString());
      if (params.pageNumber) queryParams.set('pageNumber', params.pageNumber.toString());
      return request<ActivityStream>('GET', `/api/v1/events?${queryParams.toString()}`);
    },
    getEvent: (eventId) =>
      request<ActivityEvent>('GET', `/api/v1/events/${eventId}`),

    // Report Operations
    listReports: (portfolioId) =>
      request<ReportIndex>('GET', `/api/v1/portfolios/${portfolioId}/reports`),
    getReport: (reportId) =>
      request<ReportSummary>('GET', `/api/v1/reports/${reportId}`),
    getEvidenceBundle: (bundleId) =>
      request<EvidenceBundleMetadata>('GET', `/api/v1/evidence-bundles/${bundleId}`),

    // Control Operations
    triggerRebalance: (params: RebalanceParams) =>
      request<ControlCommand>('POST', `/api/v1/controls/rebalance`, params),
    triggerPause: (params: PauseParams) =>
      request<ControlCommand>('POST', `/api/v1/controls/pause`, params),
    triggerLock: (params: LockParams) =>
      request<ControlCommand>('POST', `/api/v1/controls/lock`, params),
    triggerUnlock: (params: UnlockParams) =>
      request<ControlCommand>('POST', `/api/v1/controls/unlock`, params),
    triggerProofExport: (params: ProofExportParams) =>
      request<ControlCommand>('POST', `/api/v1/controls/proof-export`, params),

    // System Proof Operations
    getSystemProof: (portfolioId) =>
      request<SystemProofBundle>('GET', `/api/v1/portfolios/${portfolioId}/system-proof`),

    // Authority Operations
    getAuthoritySet: (userId) =>
      request<AuthoritySet>('GET', `/api/v1/authority/${userId}`),

    // Onboarding Operations (aligned with onboarding_v2)
    startOnboarding: (params: StartOnboardingRequest) =>
      request<StartOnboardingResponse>('POST', `/api/v2/applications/start`, {
        customer_type: params.legalEntityType.toLowerCase(),
        jurisdiction: params.jurisdiction,
        workflow_template_id: params.workflowTemplateId || 'default',
      }),
    getOnboardingCase: (caseId: string) =>
      request<OnboardingCase>('GET', `/api/v2/applications/${caseId}`),
    addPerson: (params: AddPersonRequest) =>
      request<NaturalPerson>('POST', `/api/v2/applications/${params.caseId}/persons`, params.person),
    addRelationship: (params: AddRelationshipRequest) =>
      request<OnboardingRelationship>('POST', `/api/v2/applications/${params.caseId}/relationships`, {
        personId: params.personId,
        role: params.role,
        ownershipPercent: params.ownershipPercent,
        votingPercent: params.votingPercent,
        isControllingPerson: params.isControllingPerson,
      }),
    finaliseOnboarding: (params: FinaliseOnboardingRequest) =>
      request<FinaliseOnboardingResponse>('POST', `/api/v2/applications/${params.caseId}/finalise`, {
        confirmations: params.confirmations,
        templateId: params.templateId,
        templateVersion: params.templateVersion,
      }),
    listOnboardingEvents: (caseId: string) =>
      request<OnboardingEvent[]>('GET', `/api/v2/applications/${caseId}/events`),
    getOnboardingSummary: (caseId: string) =>
      request<OnboardingSummary>('GET', `/api/v2/applications/${caseId}/summary`),

    // FX Conversion Operations (aligned with multi_currency domain)
    requestFxConversion: (params: FxConversionParams) =>
      request<FxConversionRecord>('POST', `/api/v1/fx/conversions`, params),
    getFxQuote: (params: FxQuoteParams) => {
      const queryParams = new URLSearchParams();
      queryParams.set('fromCurrency', params.fromCurrency);
      queryParams.set('toCurrency', params.toCurrency);
      queryParams.set('amount', params.amount.toString());
      return request<FxRateQuote>('GET', `/api/v1/fx/quote?${queryParams.toString()}`);
    },
    listFxConversions: (portfolioId: string) =>
      request<FxConversionRecord[]>('GET', `/api/v1/portfolios/${portfolioId}/fx/conversions`),
    getFxConversion: (conversionId: string) =>
      request<FxConversionRecord>('GET', `/api/v1/fx/conversions/${conversionId}`),
    listFxEvents: (portfolioId: string) =>
      request<FxEvent[]>('GET', `/api/v1/portfolios/${portfolioId}/fx/events`),
    getCurrencyConfiguration: () =>
      request<CurrencyConfiguration>('GET', `/api/v1/fx/configuration`),
    getFxExecutionProofs: (portfolioId: string) =>
      request<FxExecutionProof[]>('GET', `/api/v1/portfolios/${portfolioId}/fx/proofs`),

    // Crypto Execution Operations (custody-based, not FX)
    requestCryptoExecution: (params: CryptoExecutionParams) =>
      request<CryptoExecutionRecord>('POST', `/api/v1/crypto/executions`, params),
    getCryptoQuote: (params: CryptoQuoteParams) => {
      const queryParams = new URLSearchParams();
      queryParams.set('asset', params.asset);
      queryParams.set('quantity', params.quantity.toString());
      return request<CryptoPriceQuote>('GET', `/api/v1/crypto/quote?${queryParams.toString()}`);
    },
    listCryptoExecutions: (portfolioId: string) =>
      request<CryptoExecutionRecord[]>('GET', `/api/v1/portfolios/${portfolioId}/crypto/executions`),
    getCryptoExecution: (executionId: string) =>
      request<CryptoExecutionRecord>('GET', `/api/v1/crypto/executions/${executionId}`),
    listCryptoHoldings: (portfolioId: string) =>
      request<CryptoHolding[]>('GET', `/api/v1/portfolios/${portfolioId}/crypto/holdings`),
    listCryptoEvents: (portfolioId: string) =>
      request<CryptoEvent[]>('GET', `/api/v1/portfolios/${portfolioId}/crypto/events`),
    getCryptoExecutionProofs: (portfolioId: string) =>
      request<CryptoExecutionProof[]>('GET', `/api/v1/portfolios/${portfolioId}/crypto/proofs`),

    // Threshold Configuration Operations (dual-control limits)
    listThresholds: (tenantId: string) =>
      request<ThresholdConfig[]>('GET', `/api/v1/tenants/${tenantId}/thresholds`),
    getThreshold: (thresholdId: string) =>
      request<ThresholdConfig>('GET', `/api/v1/thresholds/${thresholdId}`),
    setThreshold: (params: SetThresholdParams) =>
      request<SetThresholdResponse>('POST', `/api/v1/tenants/${params.tenantId}/thresholds`, {
        category: params.category,
        currencyOrAsset: params.currencyOrAsset,
        amount: params.amount,
      }),
    listThresholdHistory: (category: ThresholdCategory) =>
      request<ThresholdHistoryEntry[]>('GET', `/api/v1/thresholds/history?category=${category}`),
    listThresholdChangeEvents: (tenantId: string) =>
      request<ThresholdChangeEvent[]>('GET', `/api/v1/tenants/${tenantId}/thresholds/events`),

    // Threshold Approval Workflow (for changes above magnitude limit)
    requestThresholdChange: (params: RequestThresholdChangeParams) =>
      request<ThresholdChangeRequest>('POST', `/api/v1/tenants/${params.tenantId}/thresholds/change-requests`, {
        category: params.category,
        currencyOrAsset: params.currencyOrAsset,
        newAmount: params.newAmount,
        reason: params.reason,
      }),
    listPendingThresholdChanges: (tenantId: string) =>
      request<ThresholdChangeRequest[]>('GET', `/api/v1/tenants/${tenantId}/thresholds/change-requests?status=PENDING`),
    approveThresholdChange: (params: ApproveThresholdChangeParams) =>
      request<ThresholdChangeRequest>('POST', `/api/v1/thresholds/change-requests/${params.requestId}/approve`, {
        comment: params.approverComment,
      }),
    rejectThresholdChange: (params: RejectThresholdChangeParams) =>
      request<ThresholdChangeRequest>('POST', `/api/v1/thresholds/change-requests/${params.requestId}/reject`, {
        reason: params.reason,
      }),

    // Threshold Notifications (for compliance)
    listThresholdNotifications: (params: ListThresholdNotificationsParams) => {
      const queryParams = new URLSearchParams();
      if (params.unreadOnly) queryParams.set('unreadOnly', 'true');
      if (params.types) queryParams.set('types', params.types.join(','));
      if (params.limit) queryParams.set('limit', params.limit.toString());
      return request<ThresholdNotification[]>('GET', `/api/v1/tenants/${params.tenantId}/thresholds/notifications?${queryParams.toString()}`);
    },
    markNotificationRead: (notificationId: string) =>
      request<{ success: boolean }>('POST', `/api/v1/thresholds/notifications/${notificationId}/read`),
    getUnreadNotificationCount: (tenantId: string) =>
      request<{ count: number }>('GET', `/api/v1/tenants/${tenantId}/thresholds/notifications/unread-count`),
  };
}
