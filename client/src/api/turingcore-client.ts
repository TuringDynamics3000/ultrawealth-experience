/**
 * TuringCore API Client
 * 
 * Real HTTP client pointing at a running TuringCore API.
 * UI imports the interface, not the mock.
 * 
 * RULES:
 * - Real client by default, with a mockable seam
 * - A demo that isn't wired to a real core rots instantly
 * - Regulators will ask "is this real?" — answer must be "yes"
 */

import type {
  PortfolioSummary,
  PortfolioSnapshot,
  PortfolioChangeRecord,
} from '../contracts/portfolio';
import type {
  GoalAccountDetail,
} from '../contracts/goal-account';
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
  FiatCurrency,
  CryptoAsset,
  CryptoAction,
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
  SetThresholdRequest,
  SetThresholdResponse,
  ThresholdCategory,
  ThresholdChangeRequest,
  ThresholdNotification,
  FxCurrency,
} from '../contracts/threshold';

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface APIResponse<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: APIError;
  readonly meta?: {
    readonly timestamp: string;
    readonly requestId: string;
    readonly hash?: string;
  };
}

export interface APIError {
  readonly code: string;
  readonly message: string;
  readonly details?: Record<string, unknown>;
}

// =============================================================================
// CLIENT INTERFACE
// =============================================================================

export interface TuringCoreClient {
  // Portfolio Operations
  getPortfolio(portfolioId: string): Promise<APIResponse<PortfolioSummary>>;
  getPortfolioSnapshot(portfolioId: string): Promise<APIResponse<PortfolioSnapshot>>;
  listPortfolioChanges(portfolioId: string): Promise<APIResponse<PortfolioChangeRecord[]>>;

  // Goal Account Operations
  getGoalAccount(goalAccountId: string): Promise<APIResponse<GoalAccountDetail>>;
  listGoalAccounts(portfolioId: string): Promise<APIResponse<GoalAccountDetail[]>>;

  // Template Operations (Read-Only)
  listPortfolioTemplates(): Promise<APIResponse<TemplateIndex>>;
  getPortfolioTemplate(templateId: string, version: string): Promise<APIResponse<PortfolioTemplate>>;

  // Template Instantiation (Command)
  createPortfolioFromTemplate(params: CreatePortfolioFromTemplateParams): Promise<APIResponse<CreatePortfolioFromTemplateResult>>;

  // Activity Operations
  listEvents(params: ListEventsParams): Promise<APIResponse<ActivityStream>>;
  getEvent(eventId: string): Promise<APIResponse<ActivityEvent>>;

  // Report Operations
  listReports(portfolioId: string): Promise<APIResponse<ReportIndex>>;
  getReport(reportId: string): Promise<APIResponse<ReportSummary>>;
  getEvidenceBundle(bundleId: string): Promise<APIResponse<EvidenceBundleMetadata>>;

  // Control Operations
  triggerRebalance(params: RebalanceParams): Promise<APIResponse<ControlCommand>>;
  triggerPause(params: PauseParams): Promise<APIResponse<ControlCommand>>;
  triggerLock(params: LockParams): Promise<APIResponse<ControlCommand>>;
  triggerUnlock(params: UnlockParams): Promise<APIResponse<ControlCommand>>;
  triggerProofExport(params: ProofExportParams): Promise<APIResponse<ControlCommand>>;

  // System Proof Operations (Demo Only)
  getSystemProof(portfolioId: string): Promise<APIResponse<SystemProofBundle>>;

  // Authority Operations
  getAuthoritySet(userId: string): Promise<APIResponse<AuthoritySet>>;

  // Onboarding Operations (aligned with onboarding_v2)
  startOnboarding(params: StartOnboardingRequest): Promise<APIResponse<StartOnboardingResponse>>;
  getOnboardingCase(caseId: string): Promise<APIResponse<OnboardingCase>>;
  addPerson(params: AddPersonRequest): Promise<APIResponse<NaturalPerson>>;
  addRelationship(params: AddRelationshipRequest): Promise<APIResponse<OnboardingRelationship>>;
  finaliseOnboarding(params: FinaliseOnboardingRequest): Promise<APIResponse<FinaliseOnboardingResponse>>;
  listOnboardingEvents(caseId: string): Promise<APIResponse<OnboardingEvent[]>>;
  getOnboardingSummary(caseId: string): Promise<APIResponse<OnboardingSummary>>;

  // FX Conversion Operations (aligned with multi_currency domain)
  requestFxConversion(params: FxConversionParams): Promise<APIResponse<FxConversionRecord>>;
  getFxQuote(params: FxQuoteParams): Promise<APIResponse<FxRateQuote>>;
  listFxConversions(portfolioId: string): Promise<APIResponse<FxConversionRecord[]>>;
  getFxConversion(conversionId: string): Promise<APIResponse<FxConversionRecord>>;
  listFxEvents(portfolioId: string): Promise<APIResponse<FxEvent[]>>;
  getCurrencyConfiguration(): Promise<APIResponse<CurrencyConfiguration>>;
  getFxExecutionProofs(portfolioId: string): Promise<APIResponse<FxExecutionProof[]>>;

  // Crypto Execution Operations (custody-based, not FX)
  requestCryptoExecution(params: CryptoExecutionParams): Promise<APIResponse<CryptoExecutionRecord>>;
  getCryptoQuote(params: CryptoQuoteParams): Promise<APIResponse<CryptoPriceQuote>>;
  listCryptoExecutions(portfolioId: string): Promise<APIResponse<CryptoExecutionRecord[]>>;
  getCryptoExecution(executionId: string): Promise<APIResponse<CryptoExecutionRecord>>;
  listCryptoHoldings(portfolioId: string): Promise<APIResponse<CryptoHolding[]>>;
  listCryptoEvents(portfolioId: string): Promise<APIResponse<CryptoEvent[]>>;
  getCryptoExecutionProofs(portfolioId: string): Promise<APIResponse<CryptoExecutionProof[]>>;

  // Threshold Configuration Operations (dual-control limits)
  listThresholds(tenantId: string): Promise<APIResponse<ThresholdConfig[]>>;
  getThreshold(thresholdId: string): Promise<APIResponse<ThresholdConfig>>;
  setThreshold(params: SetThresholdParams): Promise<APIResponse<SetThresholdResponse>>;
  listThresholdHistory(category: ThresholdCategory): Promise<APIResponse<ThresholdHistoryEntry[]>>;
  listThresholdChangeEvents(tenantId: string): Promise<APIResponse<ThresholdChangeEvent[]>>;

  // Threshold Approval Workflow (for changes above magnitude limit)
  requestThresholdChange(params: RequestThresholdChangeParams): Promise<APIResponse<ThresholdChangeRequest>>;
  listPendingThresholdChanges(tenantId: string): Promise<APIResponse<ThresholdChangeRequest[]>>;
  approveThresholdChange(params: ApproveThresholdChangeParams): Promise<APIResponse<ThresholdChangeRequest>>;
  rejectThresholdChange(params: RejectThresholdChangeParams): Promise<APIResponse<ThresholdChangeRequest>>;

  // Threshold Notifications (for compliance)
  listThresholdNotifications(params: ListThresholdNotificationsParams): Promise<APIResponse<ThresholdNotification[]>>;
  markNotificationRead(notificationId: string): Promise<APIResponse<{ success: boolean }>>;
  getUnreadNotificationCount(tenantId: string): Promise<APIResponse<{ count: number }>>;
}

// =============================================================================
// PARAMETER TYPES
// =============================================================================

export interface ListEventsParams {
  readonly portfolioId?: string;
  readonly goalAccountId?: string;
  readonly eventTypes?: string[];
  readonly fromDate?: string;
  readonly toDate?: string;
  readonly pageSize?: number;
  readonly pageNumber?: number;
}

export interface RebalanceParams {
  readonly portfolioId: string;
  readonly goalAccountId?: string;
  readonly reason: string;
}

export interface PauseParams {
  readonly targetId: string;
  readonly targetType: 'PORTFOLIO' | 'GOAL_ACCOUNT';
  readonly reason: string;
}

export interface LockParams {
  readonly targetId: string;
  readonly targetType: 'PORTFOLIO' | 'GOAL_ACCOUNT';
  readonly reason: string;
  readonly lockType: 'SOFT' | 'HARD';
}

export interface UnlockParams {
  readonly targetId: string;
  readonly targetType: 'PORTFOLIO' | 'GOAL_ACCOUNT';
  readonly reason: string;
}

export interface ProofExportParams {
  readonly portfolioId: string;
  readonly fromDate: string;
  readonly toDate: string;
  readonly includeEventHashes: boolean;
  readonly includeReplayReceipts: boolean;
}

// FX Conversion Parameters
export interface FxConversionParams {
  readonly portfolioId: string;
  readonly fromCurrency: FiatCurrency;
  readonly toCurrency: FiatCurrency;
  readonly amount: number;
  readonly reason?: string;
}

export interface FxQuoteParams {
  readonly fromCurrency: FiatCurrency;
  readonly toCurrency: FiatCurrency;
  readonly amount: number;
}

// Crypto Execution Parameters
export interface CryptoExecutionParams {
  readonly portfolioId: string;
  readonly asset: CryptoAsset;
  readonly action: CryptoAction;
  readonly quantity: number;
  readonly reason?: string;
  readonly destinationWallet?: string; // For TRANSFER action
}

export interface CryptoQuoteParams {
  readonly asset: CryptoAsset;
  readonly quantity: number;
}

// Threshold Configuration Parameters
export interface SetThresholdParams {
  readonly tenantId: string;
  readonly category: ThresholdCategory;
  readonly currencyOrAsset: string;
  readonly amount: number;
}

// Threshold Approval Workflow Parameters
export interface RequestThresholdChangeParams {
  readonly tenantId: string;
  readonly category: ThresholdCategory;
  readonly currencyOrAsset: FxCurrency | CryptoAsset;
  readonly newAmount: number;
  readonly reason?: string;
}

export interface ApproveThresholdChangeParams {
  readonly requestId: string;
  readonly approverComment?: string;
}

export interface RejectThresholdChangeParams {
  readonly requestId: string;
  readonly reason: string;
}

// Threshold Notification Parameters
export interface ListThresholdNotificationsParams {
  readonly tenantId: string;
  readonly unreadOnly?: boolean;
  readonly types?: string[];
  readonly limit?: number;
}

// =============================================================================
// CLIENT FACTORY
// =============================================================================

export interface TuringCoreClientConfig {
  readonly baseUrl: string;
  readonly tenantId: string;
  readonly apiKey?: string;
  readonly timeout?: number;
}

/**
 * Create a TuringCore API client instance.
 * In production, this connects to the real TuringCore API.
 * For demo/local dev, use createMockClient() instead.
 */
export function createTuringCoreClient(config: TuringCoreClientConfig): TuringCoreClient {
  const { baseUrl, tenantId, apiKey, timeout = 30000 } = config;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Tenant-ID': tenantId,
  };

  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

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
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: data.code || 'API_ERROR',
            message: data.message || 'An error occurred',
            details: data.details,
          },
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
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network error',
        },
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
      request('GET', `/api/v1/portfolios/${portfolioId}`),
    getPortfolioSnapshot: (portfolioId) =>
      request('GET', `/api/v1/portfolios/${portfolioId}/snapshot`),
    listPortfolioChanges: (portfolioId) =>
      request('GET', `/api/v1/portfolios/${portfolioId}/changes`),

    // Goal Account Operations
    getGoalAccount: (goalAccountId) =>
      request('GET', `/api/v1/goal-accounts/${goalAccountId}`),
    listGoalAccounts: (portfolioId) =>
      request('GET', `/api/v1/portfolios/${portfolioId}/goal-accounts`),

    // Template Operations (Read-Only)
    listPortfolioTemplates: () =>
      request('GET', `/api/v1/templates`),
    getPortfolioTemplate: (templateId, version) =>
      request('GET', `/api/v1/templates/${templateId}/versions/${version}`),

    // Template Instantiation (Command)
    createPortfolioFromTemplate: (params) =>
      request('POST', `/api/v1/portfolios/from-template`, params),

    // Activity Operations
    listEvents: (params) => {
      const queryParams = new URLSearchParams();
      if (params.portfolioId) queryParams.set('portfolioId', params.portfolioId);
      if (params.goalAccountId) queryParams.set('goalAccountId', params.goalAccountId);
      if (params.eventTypes) queryParams.set('eventTypes', params.eventTypes.join(','));
      if (params.fromDate) queryParams.set('fromDate', params.fromDate);
      if (params.toDate) queryParams.set('toDate', params.toDate);
      if (params.pageSize) queryParams.set('pageSize', params.pageSize.toString());
      if (params.pageNumber) queryParams.set('pageNumber', params.pageNumber.toString());
      return request('GET', `/api/v1/events?${queryParams.toString()}`);
    },
    getEvent: (eventId) =>
      request('GET', `/api/v1/events/${eventId}`),

    // Report Operations
    listReports: (portfolioId) =>
      request('GET', `/api/v1/portfolios/${portfolioId}/reports`),
    getReport: (reportId) =>
      request('GET', `/api/v1/reports/${reportId}`),
    getEvidenceBundle: (bundleId) =>
      request('GET', `/api/v1/evidence-bundles/${bundleId}`),

    // Control Operations
    triggerRebalance: (params) =>
      request('POST', `/api/v1/controls/rebalance`, params),
    triggerPause: (params) =>
      request('POST', `/api/v1/controls/pause`, params),
    triggerLock: (params) =>
      request('POST', `/api/v1/controls/lock`, params),
    triggerUnlock: (params) =>
      request('POST', `/api/v1/controls/unlock`, params),
    triggerProofExport: (params) =>
      request('POST', `/api/v1/controls/proof-export`, params),

    // System Proof Operations
    getSystemProof: (portfolioId) =>
      request('GET', `/api/v1/portfolios/${portfolioId}/system-proof`),

    // Authority Operations
    getAuthoritySet: (userId) =>
      request('GET', `/api/v1/authority/${userId}`),

    // Onboarding Operations (aligned with onboarding_v2)
    startOnboarding: (params) =>
      request('POST', `/api/v2/applications/start`, {
        customer_type: params.legalEntityType.toLowerCase(),
        jurisdiction: params.jurisdiction,
        workflow_template_id: params.workflowTemplateId || 'default',
      }),
    getOnboardingCase: (caseId) =>
      request('GET', `/api/v2/applications/${caseId}`),
    addPerson: (params) =>
      request('POST', `/api/v2/applications/${params.caseId}/persons`, params.person),
    addRelationship: (params) =>
      request('POST', `/api/v2/applications/${params.caseId}/relationships`, {
        personId: params.personId,
        role: params.role,
        ownershipPercent: params.ownershipPercent,
        votingPercent: params.votingPercent,
        isControllingPerson: params.isControllingPerson,
      }),
    finaliseOnboarding: (params) =>
      request('POST', `/api/v2/applications/${params.caseId}/finalise`, {
        confirmations: params.confirmations,
        templateId: params.templateId,
        templateVersion: params.templateVersion,
      }),
    listOnboardingEvents: (caseId) =>
      request('GET', `/api/v2/applications/${caseId}/events`),
    getOnboardingSummary: (caseId) =>
      request('GET', `/api/v2/applications/${caseId}/summary`),

    // FX Conversion Operations (aligned with multi_currency domain)
    requestFxConversion: (params) =>
      request('POST', `/api/v1/fx/conversions`, params),
    getFxQuote: (params) => {
      const queryParams = new URLSearchParams();
      queryParams.set('fromCurrency', params.fromCurrency);
      queryParams.set('toCurrency', params.toCurrency);
      queryParams.set('amount', params.amount.toString());
      return request('GET', `/api/v1/fx/quote?${queryParams.toString()}`);
    },
    listFxConversions: (portfolioId) =>
      request('GET', `/api/v1/portfolios/${portfolioId}/fx/conversions`),
    getFxConversion: (conversionId) =>
      request('GET', `/api/v1/fx/conversions/${conversionId}`),
    listFxEvents: (portfolioId) =>
      request('GET', `/api/v1/portfolios/${portfolioId}/fx/events`),
    getCurrencyConfiguration: () =>
      request('GET', `/api/v1/fx/configuration`),
    getFxExecutionProofs: (portfolioId) =>
      request('GET', `/api/v1/portfolios/${portfolioId}/fx/proofs`),

    // Crypto Execution Operations (custody-based, not FX)
    requestCryptoExecution: (params) =>
      request('POST', `/api/v1/crypto/executions`, params),
    getCryptoQuote: (params) => {
      const queryParams = new URLSearchParams();
      queryParams.set('asset', params.asset);
      queryParams.set('quantity', params.quantity.toString());
      return request('GET', `/api/v1/crypto/quote?${queryParams.toString()}`);
    },
    listCryptoExecutions: (portfolioId) =>
      request('GET', `/api/v1/portfolios/${portfolioId}/crypto/executions`),
    getCryptoExecution: (executionId) =>
      request('GET', `/api/v1/crypto/executions/${executionId}`),
    listCryptoHoldings: (portfolioId) =>
      request('GET', `/api/v1/portfolios/${portfolioId}/crypto/holdings`),
    listCryptoEvents: (portfolioId) =>
      request('GET', `/api/v1/portfolios/${portfolioId}/crypto/events`),
    getCryptoExecutionProofs: (portfolioId) =>
      request('GET', `/api/v1/portfolios/${portfolioId}/crypto/proofs`),

    // Threshold Configuration Operations (dual-control limits)
    listThresholds: (tenantId) =>
      request('GET', `/api/v1/tenants/${tenantId}/thresholds`),
    getThreshold: (thresholdId) =>
      request('GET', `/api/v1/thresholds/${thresholdId}`),
    setThreshold: (params) =>
      request('POST', `/api/v1/tenants/${params.tenantId}/thresholds`, {
        category: params.category,
        currencyOrAsset: params.currencyOrAsset,
        amount: params.amount,
      }),
    listThresholdHistory: (category) =>
      request('GET', `/api/v1/thresholds/history?category=${category}`),
    listThresholdChangeEvents: (tenantId) =>
      request('GET', `/api/v1/tenants/${tenantId}/thresholds/events`),

    // Threshold Approval Workflow (for changes above magnitude limit)
    requestThresholdChange: (params) =>
      request('POST', `/api/v1/tenants/${params.tenantId}/thresholds/change-requests`, {
        category: params.category,
        currencyOrAsset: params.currencyOrAsset,
        newAmount: params.newAmount,
        reason: params.reason,
      }),
    listPendingThresholdChanges: (tenantId) =>
      request('GET', `/api/v1/tenants/${tenantId}/thresholds/change-requests?status=PENDING`),
    approveThresholdChange: (params) =>
      request('POST', `/api/v1/thresholds/change-requests/${params.requestId}/approve`, {
        comment: params.approverComment,
      }),
    rejectThresholdChange: (params) =>
      request('POST', `/api/v1/thresholds/change-requests/${params.requestId}/reject`, {
        reason: params.reason,
      }),

    // Threshold Notifications (for compliance)
    listThresholdNotifications: (params) => {
      const queryParams = new URLSearchParams();
      if (params.unreadOnly) queryParams.set('unreadOnly', 'true');
      if (params.types) queryParams.set('types', params.types.join(','));
      if (params.limit) queryParams.set('limit', params.limit.toString());
      return request('GET', `/api/v1/tenants/${params.tenantId}/thresholds/notifications?${queryParams.toString()}`);
    },
    markNotificationRead: (notificationId) =>
      request('POST', `/api/v1/thresholds/notifications/${notificationId}/read`),
    getUnreadNotificationCount: (tenantId) =>
      request('GET', `/api/v1/tenants/${tenantId}/thresholds/notifications/unread-count`),
  };
}
