/**
 * Mock TuringCore Client
 * 
 * Uses seed data for demo mode when TuringCore API is unavailable.
 * Implements the same interface as the real client.
 */

import type { TuringCoreClient, APIResponse, ListEventsParams, RebalanceParams, PauseParams, LockParams, UnlockParams, ProofExportParams, FxConversionParams, FxQuoteParams, CryptoExecutionParams, CryptoQuoteParams, SetThresholdParams, RequestThresholdChangeParams, ApproveThresholdChangeParams, RejectThresholdChangeParams, ListThresholdNotificationsParams } from './turingcore-client';
import type {
  ThresholdConfig,
  ThresholdChangeEvent,
  ThresholdHistoryEntry,
  SetThresholdResponse,
  ThresholdCategory,
  ThresholdChangeRequest,
  ThresholdNotification,
  FxCurrency,
} from '../contracts/threshold';
import { DEFAULT_THRESHOLDS } from '../contracts/threshold';
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
import type { PortfolioSummary, PortfolioSnapshot, PortfolioChangeRecord } from '../contracts/portfolio';
import type { GoalAccountDetail } from '../contracts/goal-account';
import type { ActivityStream, ReportIndex, ReportSummary, EvidenceBundleMetadata, SystemProofBundle, ControlCommand, AuthoritySet, ActivityEvent } from '../contracts/activity';
import type { TemplateIndex, PortfolioTemplate, CreatePortfolioFromTemplateParams, CreatePortfolioFromTemplateResult } from '../contracts/template';
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
  OnboardingStatus,
  LegalEntityType,
  Jurisdiction,
  OnboardingConfirmation,
  RelationshipRole,
} from '../contracts/onboarding';
import { SEED_DATA } from '../demo/seed';
import { TEMPLATE_SEED_DATA } from '../demo/template-seed';
import {
  DEMO_CURRENCY_CONFIG,
  DEMO_FX_CONVERSIONS,
  DEMO_CRYPTO_EXECUTIONS,
  DEMO_CRYPTO_HOLDINGS,
  DEMO_FX_EVENTS,
  DEMO_CRYPTO_EVENTS,
  DEMO_FX_PROOFS,
  DEMO_CRYPTO_PROOFS,
  generateFxQuote,
  generateCryptoQuote,
} from '../demo/fx-crypto-seed';

// Mutable version of OnboardingCase for mock state
interface MutableOnboardingCase {
  caseId: string;
  tenantId: string;
  legalEntityType: LegalEntityType;
  jurisdiction: Jurisdiction;
  status: OnboardingStatus;
  createdAt: string;
  updatedAt: string;
  persons: NaturalPerson[];
  relationships: OnboardingRelationship[];
  confirmations: OnboardingConfirmation[];
  caseHash: string;
}

// Mock state for onboarding cases
const mockOnboardingCases = new Map<string, MutableOnboardingCase>();

// Mock state for threshold configurations
const mockThresholds = new Map<string, ThresholdConfig>();
const mockThresholdHistory: ThresholdHistoryEntry[] = [];
const mockThresholdEvents: ThresholdChangeEvent[] = [];
const mockThresholdChangeRequests = new Map<string, ThresholdChangeRequest>();
const mockThresholdNotifications: ThresholdNotification[] = [];

// Initialize default thresholds
function initializeDefaultThresholds() {
  const categories: ThresholdCategory[] = ['FX_CONVERSION', 'CRYPTO_BUY', 'CRYPTO_SELL', 'CRYPTO_TRANSFER'];
  const now = Date.now();
  
  categories.forEach((category, index) => {
    const thresholdId = `threshold-${category.toLowerCase()}-default`;
    mockThresholds.set(thresholdId, {
      thresholdId,
      category,
      currencyOrAsset: 'AUD',
      amount: DEFAULT_THRESHOLDS[category],
      unit: 'AUD',
      effectiveFrom: now - (30 * 24 * 60 * 60 * 1000), // 30 days ago
      setBy: 'system',
      setAt: now - (30 * 24 * 60 * 60 * 1000),
      isActive: true,
    });
  });
}

// Initialize on module load
initializeDefaultThresholds();

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function createSuccessResponse<T>(data: T): APIResponse<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: `mock_${Date.now()}`,
    },
  };
}

function createErrorResponse<T>(code: string, message: string): APIResponse<T> {
  return {
    success: false,
    error: { code, message },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: `mock_${Date.now()}`,
    },
  };
}

// Helper to get entity name from case
function getEntityName(onboardingCase: MutableOnboardingCase): string {
  // Fallback to first person if no entity set
  if (onboardingCase.persons.length > 0) {
    const p = onboardingCase.persons[0];
    return `${p.firstName} ${p.lastName}`;
  }
  return 'Unknown Entity';
}

// Helper to get unique roles
function getUniqueRoles(relationships: OnboardingRelationship[]): RelationshipRole[] {
  const roleSet = new Set<RelationshipRole>();
  for (const r of relationships) {
    roleSet.add(r.role);
  }
  return Array.from(roleSet);
}

export function createMockClient(): TuringCoreClient {
  return {
    // Portfolio Operations
    async getPortfolio(portfolioId: string): Promise<APIResponse<PortfolioSummary>> {
      await delay(100);
      if (portfolioId === SEED_DATA.portfolio.portfolioId) {
        return createSuccessResponse(SEED_DATA.portfolio);
      }
      return createErrorResponse('NOT_FOUND', `Portfolio ${portfolioId} not found`);
    },

    async getPortfolioSnapshot(portfolioId: string): Promise<APIResponse<PortfolioSnapshot>> {
      await delay(100);
      if (portfolioId === SEED_DATA.portfolio.portfolioId) {
        return createSuccessResponse(SEED_DATA.portfolioSnapshot);
      }
      return createErrorResponse('NOT_FOUND', `Portfolio ${portfolioId} not found`);
    },

    async listPortfolioChanges(portfolioId: string): Promise<APIResponse<PortfolioChangeRecord[]>> {
      await delay(100);
      // Return empty array for demo
      return createSuccessResponse([]);
    },

    // Template Operations (Read-Only)
    async listPortfolioTemplates(): Promise<APIResponse<TemplateIndex>> {
      await delay(100);
      return createSuccessResponse(TEMPLATE_SEED_DATA.templateIndex);
    },

    async getPortfolioTemplate(templateId: string, version: string): Promise<APIResponse<PortfolioTemplate>> {
      await delay(100);
      const template = TEMPLATE_SEED_DATA.getTemplateByIdAndVersion(templateId, version);
      if (template) {
        return createSuccessResponse(template);
      }
      return createErrorResponse('NOT_FOUND', `Template ${templateId} version ${version} not found`);
    },

    // Template Instantiation (Command)
    async createPortfolioFromTemplate(params: CreatePortfolioFromTemplateParams): Promise<APIResponse<CreatePortfolioFromTemplateResult>> {
      await delay(200);
      const template = TEMPLATE_SEED_DATA.getTemplateByIdAndVersion(params.templateId, params.templateVersion);
      if (!template) {
        return createErrorResponse('NOT_FOUND', `Template ${params.templateId} version ${params.templateVersion} not found`);
      }
      if (!params.disclosuresAcknowledged) {
        return createErrorResponse('DISCLOSURES_NOT_ACKNOWLEDGED', 'Disclosures must be acknowledged before instantiation');
      }
      // Simulate portfolio creation
      const portfolioId = `pf_${Date.now()}`;
      const goalAccountIds = template.goalAccountStructure.map((_, i) => `ga_${Date.now()}_${i}`);
      const result: CreatePortfolioFromTemplateResult = {
        portfolioId,
        templateId: params.templateId,
        templateVersion: params.templateVersion,
        templateHash: template.templateHash,
        goalAccountIds,
        eventId: `evt_${Date.now()}`,
        portfolioStateHash: `state_${Date.now()}`,
      };
      return createSuccessResponse(result);
    },

    // Goal Account Operations
    async getGoalAccount(goalAccountId: string): Promise<APIResponse<GoalAccountDetail>> {
      await delay(100);
      const detail = SEED_DATA.goalAccountDetails[goalAccountId];
      if (detail) {
        return createSuccessResponse(detail);
      }
      // Return first goal account with basic detail if not found
      const ga = SEED_DATA.goalAccounts.find(g => g.id === goalAccountId);
      if (ga) {
        return createSuccessResponse({
          ...ga,
          stateHash: 'mock_hash',
          holdingsSnapshot: {
            snapshotAt: new Date().toISOString(),
            totalValueCents: 0,
            stateHash: 'mock_holdings_hash',
            holdings: [],
            allocations: [],
          },
          performanceDeltas: {
            periodStart: '2025-01-01T00:00:00Z',
            periodEnd: new Date().toISOString(),
            startValueCents: 0,
            endValueCents: 0,
            contributionsCents: 0,
            withdrawalsCents: 0,
            netFlowCents: 0,
            gainLossCents: 0,
            returnPercent: 0,
            evidenceRef: 'mock_evd',
          },
          evidenceRefs: [],
        });
      }
      return createErrorResponse('NOT_FOUND', `Goal account ${goalAccountId} not found`);
    },

    async listGoalAccounts(portfolioId: string): Promise<APIResponse<GoalAccountDetail[]>> {
      await delay(100);
      const accounts = SEED_DATA.goalAccounts.filter(ga => ga.portfolioId === portfolioId);
      const details = accounts.map(ga => {
        const detail = SEED_DATA.goalAccountDetails[ga.id];
        if (detail) return detail;
        return {
          ...ga,
          stateHash: 'mock_hash',
          holdingsSnapshot: {
            snapshotAt: new Date().toISOString(),
            totalValueCents: 0,
            stateHash: 'mock_holdings_hash',
            holdings: [],
            allocations: [],
          },
          performanceDeltas: {
            periodStart: '2025-01-01T00:00:00Z',
            periodEnd: new Date().toISOString(),
            startValueCents: 0,
            endValueCents: 0,
            contributionsCents: 0,
            withdrawalsCents: 0,
            netFlowCents: 0,
            gainLossCents: 0,
            returnPercent: 0,
            evidenceRef: 'mock_evd',
          },
          evidenceRefs: [],
        };
      });
      return createSuccessResponse(details);
    },

    // Activity Operations
    async listEvents(params: ListEventsParams): Promise<APIResponse<ActivityStream>> {
      await delay(100);
      let events = [...SEED_DATA.events];
      
      if (params.portfolioId) {
        events = events.filter(e => e.portfolioId === params.portfolioId);
      }
      if (params.goalAccountId) {
        events = events.filter(e => e.goalAccountId === params.goalAccountId);
      }
      if (params.eventTypes && params.eventTypes.length > 0) {
        events = events.filter(e => params.eventTypes!.includes(e.eventType));
      }

      const pageSize = params.pageSize || 20;
      const pageNumber = params.pageNumber || 1;
      const start = (pageNumber - 1) * pageSize;
      const paged = events.slice(start, start + pageSize);

      return createSuccessResponse({
        events: paged,
        totalCount: events.length,
        pageSize,
        pageNumber,
        hasMore: start + pageSize < events.length,
        streamHash: `stream_${Date.now()}`,
      });
    },

    async getEvent(eventId: string): Promise<APIResponse<ActivityEvent>> {
      await delay(100);
      const event = SEED_DATA.events.find(e => e.eventId === eventId);
      if (event) {
        return createSuccessResponse(event);
      }
      return createErrorResponse('NOT_FOUND', `Event ${eventId} not found`);
    },

    // Report Operations
    async listReports(portfolioId: string): Promise<APIResponse<ReportIndex>> {
      await delay(100);
      return createSuccessResponse({
        reports: SEED_DATA.reports,
        totalCount: SEED_DATA.reports.length,
      });
    },

    async getReport(reportId: string): Promise<APIResponse<ReportSummary>> {
      await delay(100);
      const report = SEED_DATA.reports.find(r => r.reportId === reportId);
      if (report) {
        return createSuccessResponse(report);
      }
      return createErrorResponse('NOT_FOUND', `Report ${reportId} not found`);
    },

    async getEvidenceBundle(bundleId: string): Promise<APIResponse<EvidenceBundleMetadata>> {
      await delay(100);
      const bundle = SEED_DATA.evidenceBundles.find(b => b.bundleId === bundleId);
      if (bundle) {
        return createSuccessResponse(bundle);
      }
      return createErrorResponse('NOT_FOUND', `Evidence bundle ${bundleId} not found`);
    },

    // Control Operations
    async triggerRebalance(params: RebalanceParams): Promise<APIResponse<ControlCommand>> {
      await delay(200);
      const command: ControlCommand = {
        commandId: `cmd_${Date.now()}`,
        commandType: 'REBALANCE',
        targetId: params.goalAccountId || params.portfolioId,
        targetType: params.goalAccountId ? 'GOAL_ACCOUNT' : 'PORTFOLIO',
        issuedBy: { actorType: 'SUPERVISOR', actorId: 'mock_user', role: 'SUPERVISOR' },
        issuedAt: new Date().toISOString(),
        status: 'PENDING',
        requiresDualControl: false,
        hash: `hash_${Date.now()}`,
      };
      return createSuccessResponse(command);
    },

    async triggerPause(params: PauseParams): Promise<APIResponse<ControlCommand>> {
      await delay(200);
      const command: ControlCommand = {
        commandId: `cmd_${Date.now()}`,
        commandType: 'PAUSE',
        targetId: params.targetId,
        targetType: params.targetType,
        issuedBy: { actorType: 'OPERATOR', actorId: 'mock_user', role: 'OPERATOR' },
        issuedAt: new Date().toISOString(),
        status: 'PENDING',
        requiresDualControl: false,
        hash: `hash_${Date.now()}`,
      };
      return createSuccessResponse(command);
    },

    async triggerLock(params: LockParams): Promise<APIResponse<ControlCommand>> {
      await delay(200);
      const command: ControlCommand = {
        commandId: `cmd_${Date.now()}`,
        commandType: 'LOCK',
        targetId: params.targetId,
        targetType: params.targetType,
        issuedBy: { actorType: 'COMPLIANCE', actorId: 'mock_user', role: 'COMPLIANCE' },
        issuedAt: new Date().toISOString(),
        status: 'PENDING',
        requiresDualControl: false,
        hash: `hash_${Date.now()}`,
      };
      return createSuccessResponse(command);
    },

    async triggerUnlock(params: UnlockParams): Promise<APIResponse<ControlCommand>> {
      await delay(200);
      const command: ControlCommand = {
        commandId: `cmd_${Date.now()}`,
        commandType: 'UNLOCK',
        targetId: params.targetId,
        targetType: params.targetType,
        issuedBy: { actorType: 'SUPERVISOR', actorId: 'mock_user', role: 'SUPERVISOR' },
        issuedAt: new Date().toISOString(),
        status: 'PENDING',
        requiresDualControl: true,
        hash: `hash_${Date.now()}`,
      };
      return createSuccessResponse(command);
    },

    async triggerProofExport(params: ProofExportParams): Promise<APIResponse<ControlCommand>> {
      await delay(200);
      const command: ControlCommand = {
        commandId: `cmd_${Date.now()}`,
        commandType: 'PROOF_EXPORT',
        targetId: params.portfolioId,
        targetType: 'PORTFOLIO',
        issuedBy: { actorType: 'COMPLIANCE', actorId: 'mock_user', role: 'COMPLIANCE' },
        issuedAt: new Date().toISOString(),
        status: 'PENDING',
        requiresDualControl: false,
        hash: `hash_${Date.now()}`,
      };
      return createSuccessResponse(command);
    },

    // System Proof Operations
    async getSystemProof(portfolioId: string): Promise<APIResponse<SystemProofBundle>> {
      await delay(100);
      return createSuccessResponse(SEED_DATA.systemProof);
    },

    // Authority Operations
    async getAuthoritySet(userId: string): Promise<APIResponse<AuthoritySet>> {
      await delay(100);
      return createSuccessResponse(SEED_DATA.authoritySet);
    },

    // Onboarding Operations (aligned with onboarding_v2)
    async startOnboarding(params: StartOnboardingRequest): Promise<APIResponse<StartOnboardingResponse>> {
      await delay(200);
      const caseId = `case_${Date.now()}`;
      // Store in mock state
      mockOnboardingCases.set(caseId, {
        caseId,
        tenantId: 'tenant_demo',
        legalEntityType: params.legalEntityType,
        jurisdiction: params.jurisdiction,
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        persons: [],
        relationships: [],
        confirmations: [],
        caseHash: `hash_${Date.now()}`,
      });
      return createSuccessResponse({
        caseId,
        status: 'DRAFT',
      });
    },

    async getOnboardingCase(caseId: string): Promise<APIResponse<OnboardingCase>> {
      await delay(100);
      const onboardingCase = mockOnboardingCases.get(caseId);
      if (onboardingCase) {
        return createSuccessResponse(onboardingCase as OnboardingCase);
      }
      return createErrorResponse('NOT_FOUND', `Onboarding case ${caseId} not found`);
    },

    async addPerson(params: AddPersonRequest): Promise<APIResponse<NaturalPerson>> {
      await delay(150);
      const onboardingCase = mockOnboardingCases.get(params.caseId);
      if (!onboardingCase) {
        return createErrorResponse('NOT_FOUND', `Onboarding case ${params.caseId} not found`);
      }
      const person: NaturalPerson = {
        personId: `person_${Date.now()}`,
        ...params.person,
      };
      onboardingCase.persons.push(person);
      onboardingCase.updatedAt = new Date().toISOString();
      return createSuccessResponse(person);
    },

    async addRelationship(params: AddRelationshipRequest): Promise<APIResponse<OnboardingRelationship>> {
      await delay(150);
      const onboardingCase = mockOnboardingCases.get(params.caseId);
      if (!onboardingCase) {
        return createErrorResponse('NOT_FOUND', `Onboarding case ${params.caseId} not found`);
      }
      const relationship: OnboardingRelationship = {
        relationshipId: `rel_${Date.now()}`,
        personId: params.personId,
        role: params.role,
        ownershipPercent: params.ownershipPercent,
        votingPercent: params.votingPercent,
        isControllingPerson: params.isControllingPerson,
      };
      onboardingCase.relationships.push(relationship);
      onboardingCase.updatedAt = new Date().toISOString();
      return createSuccessResponse(relationship);
    },

    async finaliseOnboarding(params: FinaliseOnboardingRequest): Promise<APIResponse<FinaliseOnboardingResponse>> {
      await delay(300);
      const onboardingCase = mockOnboardingCases.get(params.caseId);
      if (!onboardingCase) {
        return createErrorResponse('NOT_FOUND', `Onboarding case ${params.caseId} not found`);
      }
      // Add confirmations
      for (const conf of params.confirmations) {
        onboardingCase.confirmations.push({
          confirmationId: `conf_${Date.now()}`,
          type: conf.type,
          confirmedAt: new Date().toISOString(),
          confirmedBy: 'demo_user',
        });
      }
      onboardingCase.status = 'FINALISED';
      onboardingCase.updatedAt = new Date().toISOString();
      
      const clientId = `client_${Date.now()}`;
      const portfolioId = `pf_${Date.now()}`;
      const portfolioStateHash = `state_${Date.now()}`;
      
      return createSuccessResponse({
        caseId: params.caseId,
        clientId,
        portfolioId,
        status: 'FINALISED',
        portfolioStateHash,
      });
    },

    async listOnboardingEvents(caseId: string): Promise<APIResponse<OnboardingEvent[]>> {
      await delay(100);
      // Return mock onboarding events
      const events: OnboardingEvent[] = [
        {
          eventId: `evt_onb_${caseId}_001`,
          eventType: 'ONBOARDING_CASE_CREATED',
          eventVersion: 1,
          occurredAt: new Date().toISOString(),
          actor: { actorType: 'CLIENT', actorId: 'demo_user' },
          tenantId: 'tenant_demo',
          caseId,
          payload: {},
          hash: `hash_evt_${Date.now()}`,
        },
      ];
      return createSuccessResponse(events);
    },

    async getOnboardingSummary(caseId: string): Promise<APIResponse<OnboardingSummary>> {
      await delay(100);
      const onboardingCase = mockOnboardingCases.get(caseId);
      if (!onboardingCase) {
        return createErrorResponse('NOT_FOUND', `Onboarding case ${caseId} not found`);
      }
      const controllingPersons = onboardingCase.relationships.filter(r => r.isControllingPerson);
      const authorisedRep = onboardingCase.relationships.find(r => r.role === 'AUTHORISED_REP');
      const authorisedRepPerson = authorisedRep 
        ? onboardingCase.persons.find(p => p.personId === authorisedRep.personId)
        : undefined;
      
      const summary: OnboardingSummary = {
        caseId,
        legalEntityType: onboardingCase.legalEntityType,
        jurisdiction: onboardingCase.jurisdiction,
        entityName: getEntityName(onboardingCase),
        controllingPersonsCount: controllingPersons.length,
        controllingPersonRoles: getUniqueRoles(controllingPersons),
        authorisedRepresentative: authorisedRepPerson ? {
          name: `${authorisedRepPerson.firstName} ${authorisedRepPerson.lastName}`,
          personId: authorisedRepPerson.personId,
        } : undefined,
        finalisedAt: onboardingCase.status === 'FINALISED' ? onboardingCase.updatedAt : undefined,
      };
      return createSuccessResponse(summary);
    },

    // FX Conversion Operations
    async requestFxConversion(params: FxConversionParams): Promise<APIResponse<FxConversionRecord>> {
      await delay(300);
      if (params.fromCurrency === params.toCurrency) {
        return createErrorResponse('INVALID_REQUEST', 'fromCurrency and toCurrency must be different');
      }
      const quote = generateFxQuote(params.fromCurrency, params.toCurrency, params.amount);
      const record: FxConversionRecord = {
        conversionId: `fx-conv-${Date.now()}`,
        portfolioId: params.portfolioId,
        fromCurrency: params.fromCurrency,
        toCurrency: params.toCurrency,
        fromAmount: params.amount,
        toAmount: Math.round(params.amount * quote.rate * 100) / 100,
        rate: quote.rate,
        rateSource: quote.rateSource,
        status: params.amount >= 50000 ? 'PENDING_APPROVAL' : 'EXECUTED',
        requestedBy: 'demo-user-001',
        requestedAt: new Date().toISOString(),
        quotedAt: quote.quotedAt,
        executedAt: params.amount >= 50000 ? undefined : new Date().toISOString(),
        executedBy: params.amount >= 50000 ? undefined : 'demo-user-001',
        reason: params.reason,
        dualControlRequired: params.amount >= 50000,
        authorityScope: ['PORTFOLIO_CONTROL'],
        executionMode: 'DEMO',
        portfolioStateHash: `fx-state-${Date.now()}`,
      };
      return createSuccessResponse(record);
    },

    async getFxQuote(params: FxQuoteParams): Promise<APIResponse<FxRateQuote>> {
      await delay(100);
      if (params.fromCurrency === params.toCurrency) {
        return createErrorResponse('INVALID_REQUEST', 'fromCurrency and toCurrency must be different');
      }
      const quote = generateFxQuote(params.fromCurrency, params.toCurrency, params.amount);
      return createSuccessResponse(quote);
    },

    async listFxConversions(portfolioId: string): Promise<APIResponse<FxConversionRecord[]>> {
      await delay(100);
      const conversions = DEMO_FX_CONVERSIONS.filter(c => c.portfolioId === portfolioId || portfolioId === 'portfolio-001');
      return createSuccessResponse(conversions);
    },

    async getFxConversion(conversionId: string): Promise<APIResponse<FxConversionRecord>> {
      await delay(100);
      const conversion = DEMO_FX_CONVERSIONS.find(c => c.conversionId === conversionId);
      if (!conversion) {
        return createErrorResponse('NOT_FOUND', `FX conversion ${conversionId} not found`);
      }
      return createSuccessResponse(conversion);
    },

    async listFxEvents(portfolioId: string): Promise<APIResponse<FxEvent[]>> {
      await delay(100);
      const events = DEMO_FX_EVENTS.filter(e => e.portfolioId === portfolioId || portfolioId === 'portfolio-001');
      return createSuccessResponse(events);
    },

    async getCurrencyConfiguration(): Promise<APIResponse<CurrencyConfiguration>> {
      await delay(50);
      return createSuccessResponse(DEMO_CURRENCY_CONFIG);
    },

    async getFxExecutionProofs(portfolioId: string): Promise<APIResponse<FxExecutionProof[]>> {
      await delay(100);
      return createSuccessResponse(DEMO_FX_PROOFS);
    },

    // Crypto Execution Operations
    async requestCryptoExecution(params: CryptoExecutionParams): Promise<APIResponse<CryptoExecutionRecord>> {
      await delay(300);
      const quote = generateCryptoQuote(params.asset, params.quantity);
      const totalValue = params.quantity * quote.priceInAud;
      const record: CryptoExecutionRecord = {
        executionId: `crypto-exec-${Date.now()}`,
        portfolioId: params.portfolioId,
        asset: params.asset,
        action: params.action,
        quantity: params.quantity,
        priceInAud: quote.priceInAud,
        totalValueAud: totalValue,
        priceSource: quote.priceSource,
        custodian: 'BitGo Custody',
        walletReference: params.action === 'TRANSFER' && params.destinationWallet 
          ? params.destinationWallet.slice(0, 6) + '***' + params.destinationWallet.slice(-4)
          : params.asset === 'BTC' ? 'bc1q***7k9m' : '0x8f***3a2b',
        status: totalValue >= 50000 ? 'PENDING_APPROVAL' : 'COMPLETED',
        requestedBy: 'demo-user-001',
        requestedAt: new Date().toISOString(),
        quotedAt: quote.quotedAt,
        executedAt: totalValue >= 50000 ? undefined : new Date().toISOString(),
        executedBy: totalValue >= 50000 ? undefined : 'demo-user-001',
        reason: params.reason,
        dualControlRequired: totalValue >= 50000,
        authorityScope: ['PORTFOLIO_CONTROL'],
        executionMode: 'DEMO',
        portfolioStateHash: `crypto-state-${Date.now()}`,
      };
      return createSuccessResponse(record);
    },

    async getCryptoQuote(params: CryptoQuoteParams): Promise<APIResponse<CryptoPriceQuote>> {
      await delay(100);
      const quote = generateCryptoQuote(params.asset, params.quantity);
      return createSuccessResponse(quote);
    },

    async listCryptoExecutions(portfolioId: string): Promise<APIResponse<CryptoExecutionRecord[]>> {
      await delay(100);
      const executions = DEMO_CRYPTO_EXECUTIONS.filter(e => e.portfolioId === portfolioId || portfolioId === 'portfolio-001');
      return createSuccessResponse(executions);
    },

    async getCryptoExecution(executionId: string): Promise<APIResponse<CryptoExecutionRecord>> {
      await delay(100);
      const execution = DEMO_CRYPTO_EXECUTIONS.find(e => e.executionId === executionId);
      if (!execution) {
        return createErrorResponse('NOT_FOUND', `Crypto execution ${executionId} not found`);
      }
      return createSuccessResponse(execution);
    },

    async listCryptoHoldings(portfolioId: string): Promise<APIResponse<CryptoHolding[]>> {
      await delay(100);
      return createSuccessResponse(DEMO_CRYPTO_HOLDINGS);
    },

    async listCryptoEvents(portfolioId: string): Promise<APIResponse<CryptoEvent[]>> {
      await delay(100);
      const events = DEMO_CRYPTO_EVENTS.filter(e => e.portfolioId === portfolioId || portfolioId === 'portfolio-001');
      return createSuccessResponse(events);
    },

    async getCryptoExecutionProofs(portfolioId: string): Promise<APIResponse<CryptoExecutionProof[]>> {
      await delay(100);
      return createSuccessResponse(DEMO_CRYPTO_PROOFS);
    },

    // Threshold Configuration Operations
    async listThresholds(_tenantId: string): Promise<APIResponse<ThresholdConfig[]>> {
      await delay(100);
      return createSuccessResponse(Array.from(mockThresholds.values()));
    },

    async getThreshold(thresholdId: string): Promise<APIResponse<ThresholdConfig>> {
      await delay(100);
      const threshold = mockThresholds.get(thresholdId);
      if (!threshold) {
        return createErrorResponse('NOT_FOUND', `Threshold ${thresholdId} not found`);
      }
      return createSuccessResponse(threshold);
    },

    async setThreshold(params: SetThresholdParams): Promise<APIResponse<SetThresholdResponse>> {
      await delay(200);
      const now = Date.now();
      const thresholdId = `threshold-${params.category.toLowerCase()}-${params.currencyOrAsset.toLowerCase()}`;
      
      // Get existing threshold for this category
      const existing = Array.from(mockThresholds.values()).find(
        t => t.category === params.category && t.isActive
      );
      const previousAmount = existing?.amount ?? null;
      
      // Deactivate old threshold if exists
      if (existing) {
        mockThresholds.set(existing.thresholdId, {
          ...existing,
          isActive: false,
        });
        
        // Add to history
        mockThresholdHistory.push({
          thresholdId: existing.thresholdId,
          category: existing.category,
          currencyOrAsset: existing.currencyOrAsset,
          amount: existing.amount,
          setBy: existing.setBy,
          setAt: existing.setAt,
          supersededAt: now,
          eventId: `evt-threshold-${now}`,
        });
      }
      
      // Create new threshold
      const newThreshold: ThresholdConfig = {
        thresholdId,
        category: params.category,
        currencyOrAsset: params.currencyOrAsset as 'AUD' | 'USD' | 'GBP' | 'EUR' | 'BTC' | 'ETH',
        amount: params.amount,
        unit: 'AUD',
        effectiveFrom: now,
        setBy: 'demo-user-001',
        setAt: now,
        isActive: true,
      };
      mockThresholds.set(thresholdId, newThreshold);
      
      // Create change event
      const eventId = `evt-threshold-${now}`;
      mockThresholdEvents.push({
        eventId,
        eventType: 'THRESHOLD_CHANGED',
        thresholdId,
        category: params.category,
        currencyOrAsset: params.currencyOrAsset as 'AUD' | 'USD' | 'GBP' | 'EUR' | 'BTC' | 'ETH',
        previousAmount,
        newAmount: params.amount,
        actor: 'demo-user-001',
        actorAuthorities: ['SYSTEM_ADMIN'],
        timestamp: now,
        executionMode: 'DEMO',
      });
      
      return createSuccessResponse({
        thresholdId,
        previousAmount,
        newAmount: params.amount,
        effectiveFrom: now,
        eventId,
      });
    },

    async listThresholdHistory(category: ThresholdCategory): Promise<APIResponse<ThresholdHistoryEntry[]>> {
      await delay(100);
      const history = mockThresholdHistory.filter(h => h.category === category);
      return createSuccessResponse(history);
    },

    async listThresholdChangeEvents(_tenantId: string): Promise<APIResponse<ThresholdChangeEvent[]>> {
      await delay(100);
      return createSuccessResponse(mockThresholdEvents);
    },

    // Threshold Approval Workflow (for changes above magnitude limit)
    async requestThresholdChange(params: RequestThresholdChangeParams): Promise<APIResponse<ThresholdChangeRequest>> {
      await delay(200);
      const now = Date.now();
      const requestId = `req-threshold-${now}`;
      
      // Get current threshold for this category
      const existing = Array.from(mockThresholds.values()).find(
        t => t.category === params.category && t.currencyOrAsset === params.currencyOrAsset && t.isActive
      ) || Array.from(mockThresholds.values()).find(
        t => t.category === params.category && t.isActive
      );
      const currentAmount = existing?.amount ?? 0;
      
      // Calculate magnitude
      const magnitudePercent = currentAmount === 0 
        ? 100 
        : Math.abs((params.newAmount - currentAmount) / currentAmount) * 100;
      const requiresApproval = magnitudePercent >= 25;
      
      const request: ThresholdChangeRequest = {
        requestId,
        category: params.category,
        currencyOrAsset: params.currencyOrAsset,
        currentAmount,
        newAmount: params.newAmount,
        magnitudePercent,
        requiresApproval,
        requestedBy: 'demo-user-001',
        requestedAt: now,
        status: requiresApproval ? 'PENDING' : 'APPROVED',
        approvedBy: requiresApproval ? null : 'demo-user-001',
        approvedAt: requiresApproval ? null : now,
        rejectedBy: null,
        rejectedAt: null,
        rejectionReason: null,
        expiresAt: now + (24 * 60 * 60 * 1000), // 24 hours
      };
      
      mockThresholdChangeRequests.set(requestId, request);
      
      // Create event
      mockThresholdEvents.push({
        eventId: `evt-threshold-req-${now}`,
        eventType: 'THRESHOLD_CHANGE_REQUESTED',
        thresholdId: existing?.thresholdId ?? `threshold-${params.category.toLowerCase()}-pending`,
        requestId,
        category: params.category,
        currencyOrAsset: params.currencyOrAsset,
        previousAmount: currentAmount,
        newAmount: params.newAmount,
        magnitudePercent,
        actor: 'demo-user-001',
        actorAuthorities: ['SYSTEM_ADMIN'],
        timestamp: now,
        executionMode: 'DEMO',
      });
      
      // Create notification for compliance
      mockThresholdNotifications.push({
        notificationId: `notif-${now}`,
        type: 'THRESHOLD_CHANGE_PENDING',
        category: params.category,
        currencyOrAsset: params.currencyOrAsset,
        threshold: params.newAmount,
        requestId,
        actor: 'demo-user-001',
        timestamp: now,
        isRead: false,
        targetRoles: ['SUPERVISOR', 'COMPLIANCE'],
      });
      
      // If doesn't require approval, auto-apply
      if (!requiresApproval) {
        // Apply the threshold change immediately
        const thresholdId = `threshold-${params.category.toLowerCase()}-${params.currencyOrAsset.toLowerCase()}`;
        const newThreshold: ThresholdConfig = {
          thresholdId,
          category: params.category,
          currencyOrAsset: params.currencyOrAsset,
          amount: params.newAmount,
          unit: 'AUD',
          effectiveFrom: now,
          setBy: 'demo-user-001',
          setAt: now,
          isActive: true,
        };
        mockThresholds.set(thresholdId, newThreshold);
      }
      
      return createSuccessResponse(request);
    },

    async listPendingThresholdChanges(_tenantId: string): Promise<APIResponse<ThresholdChangeRequest[]>> {
      await delay(100);
      const pending = Array.from(mockThresholdChangeRequests.values()).filter(
        r => r.status === 'PENDING'
      );
      return createSuccessResponse(pending);
    },

    async approveThresholdChange(params: ApproveThresholdChangeParams): Promise<APIResponse<ThresholdChangeRequest>> {
      await delay(200);
      const request = mockThresholdChangeRequests.get(params.requestId);
      if (!request) {
        return createErrorResponse('NOT_FOUND', `Threshold change request ${params.requestId} not found`);
      }
      if (request.status !== 'PENDING') {
        return createErrorResponse('INVALID_STATE', `Request is already ${request.status}`);
      }
      
      const now = Date.now();
      const updatedRequest: ThresholdChangeRequest = {
        ...request,
        status: 'APPROVED',
        approvedBy: 'demo-supervisor-001',
        approvedAt: now,
      };
      mockThresholdChangeRequests.set(params.requestId, updatedRequest);
      
      // Apply the threshold change
      const thresholdId = `threshold-${request.category.toLowerCase()}-${request.currencyOrAsset.toLowerCase()}`;
      const newThreshold: ThresholdConfig = {
        thresholdId,
        category: request.category,
        currencyOrAsset: request.currencyOrAsset,
        amount: request.newAmount,
        unit: 'AUD',
        effectiveFrom: now,
        setBy: request.requestedBy,
        setAt: now,
        isActive: true,
      };
      mockThresholds.set(thresholdId, newThreshold);
      
      // Create approval event
      mockThresholdEvents.push({
        eventId: `evt-threshold-approve-${now}`,
        eventType: 'THRESHOLD_CHANGE_APPROVED',
        thresholdId,
        requestId: params.requestId,
        category: request.category,
        currencyOrAsset: request.currencyOrAsset,
        previousAmount: request.currentAmount,
        newAmount: request.newAmount,
        magnitudePercent: request.magnitudePercent,
        actor: 'demo-supervisor-001',
        actorAuthorities: ['SYSTEM_ADMIN', 'DUAL_CONTROL_APPROVER'],
        timestamp: now,
        executionMode: 'DEMO',
      });
      
      // Create notification
      mockThresholdNotifications.push({
        notificationId: `notif-approve-${now}`,
        type: 'THRESHOLD_CHANGE_APPROVED',
        category: request.category,
        currencyOrAsset: request.currencyOrAsset,
        threshold: request.newAmount,
        requestId: params.requestId,
        actor: 'demo-supervisor-001',
        timestamp: now,
        isRead: false,
        targetRoles: ['SUPERVISOR', 'COMPLIANCE'],
      });
      
      return createSuccessResponse(updatedRequest);
    },

    async rejectThresholdChange(params: RejectThresholdChangeParams): Promise<APIResponse<ThresholdChangeRequest>> {
      await delay(200);
      const request = mockThresholdChangeRequests.get(params.requestId);
      if (!request) {
        return createErrorResponse('NOT_FOUND', `Threshold change request ${params.requestId} not found`);
      }
      if (request.status !== 'PENDING') {
        return createErrorResponse('INVALID_STATE', `Request is already ${request.status}`);
      }
      
      const now = Date.now();
      const updatedRequest: ThresholdChangeRequest = {
        ...request,
        status: 'REJECTED',
        rejectedBy: 'demo-supervisor-001',
        rejectedAt: now,
        rejectionReason: params.reason,
      };
      mockThresholdChangeRequests.set(params.requestId, updatedRequest);
      
      // Create rejection event
      mockThresholdEvents.push({
        eventId: `evt-threshold-reject-${now}`,
        eventType: 'THRESHOLD_CHANGE_REJECTED',
        thresholdId: `threshold-${request.category.toLowerCase()}-pending`,
        requestId: params.requestId,
        category: request.category,
        currencyOrAsset: request.currencyOrAsset,
        previousAmount: request.currentAmount,
        newAmount: request.newAmount,
        magnitudePercent: request.magnitudePercent,
        actor: 'demo-supervisor-001',
        actorAuthorities: ['SYSTEM_ADMIN', 'DUAL_CONTROL_APPROVER'],
        timestamp: now,
        executionMode: 'DEMO',
        rejectionReason: params.reason,
      });
      
      // Create notification
      mockThresholdNotifications.push({
        notificationId: `notif-reject-${now}`,
        type: 'THRESHOLD_CHANGE_REJECTED',
        category: request.category,
        currencyOrAsset: request.currencyOrAsset,
        threshold: request.newAmount,
        requestId: params.requestId,
        actor: 'demo-supervisor-001',
        timestamp: now,
        isRead: false,
        targetRoles: ['SUPERVISOR', 'COMPLIANCE'],
      });
      
      return createSuccessResponse(updatedRequest);
    },

    // Threshold Notifications (for compliance)
    async listThresholdNotifications(params: ListThresholdNotificationsParams): Promise<APIResponse<ThresholdNotification[]>> {
      await delay(100);
      let notifications = [...mockThresholdNotifications];
      
      if (params.unreadOnly) {
        notifications = notifications.filter(n => !n.isRead);
      }
      if (params.types && params.types.length > 0) {
        notifications = notifications.filter(n => params.types!.includes(n.type));
      }
      if (params.limit) {
        notifications = notifications.slice(0, params.limit);
      }
      
      // Sort by timestamp descending
      notifications.sort((a, b) => b.timestamp - a.timestamp);
      
      return createSuccessResponse(notifications);
    },

    async markNotificationRead(notificationId: string): Promise<APIResponse<{ success: boolean }>> {
      await delay(100);
      const notification = mockThresholdNotifications.find(n => n.notificationId === notificationId);
      if (!notification) {
        return createErrorResponse('NOT_FOUND', `Notification ${notificationId} not found`);
      }
      notification.isRead = true;
      return createSuccessResponse({ success: true });
    },

    async getUnreadNotificationCount(_tenantId: string): Promise<APIResponse<{ count: number }>> {
      await delay(50);
      const count = mockThresholdNotifications.filter(n => !n.isRead).length;
      return createSuccessResponse({ count });
    },
  };
}

// Export singleton mock client
export const mockClient = createMockClient();
