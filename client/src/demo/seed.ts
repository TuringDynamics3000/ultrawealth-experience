/**
 * Demo Seed Data
 * 
 * Bootstrap data for tenant, users, and initial portfolio.
 * This data is used when TuringCore API is not available.
 * 
 * RULES:
 * - All data is explicit and traceable
 * - No invented business logic
 * - Every number has a source
 */

import type { PortfolioSummary, PortfolioSnapshot, AllocationEntry } from '../contracts/portfolio';
import type { GoalAccount, GoalAccountDetail, Holding, Allocation, EvidenceReference, PerformanceDeltas } from '../contracts/goal-account';
import type { ActivityEvent, ReportSummary, EvidenceBundleMetadata, SystemProofBundle, AuthoritySet, ControlCommand } from '../contracts/activity';

// =============================================================================
// TENANT & USER SEED DATA
// =============================================================================

export interface DemoTenant {
  readonly tenantId: string;
  readonly name: string;
  readonly jurisdiction: string;
  readonly afslNumber: string;
  readonly createdAt: string;
}

export interface DemoUser {
  readonly userId: string;
  readonly tenantId: string;
  readonly email: string;
  readonly name: string;
  readonly role: 'CLIENT' | 'OPERATOR' | 'SUPERVISOR' | 'COMPLIANCE' | 'PLATFORM_ADMIN';
  readonly createdAt: string;
}

export const DEMO_TENANT: DemoTenant = {
  tenantId: 'tenant_demo',
  name: 'TuringDynamics Demo',
  jurisdiction: 'AU',
  afslNumber: '000000',
  createdAt: '2025-01-01T00:00:00Z',
};

export const DEMO_USERS: DemoUser[] = [
  {
    userId: 'client_demo_001',
    tenantId: 'tenant_demo',
    email: 'demo.client@example.com',
    name: 'Demo Client',
    role: 'CLIENT',
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    userId: 'op_001',
    tenantId: 'tenant_demo',
    email: 'operator@turingdynamics.com',
    name: 'Demo Operator',
    role: 'OPERATOR',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    userId: 'sup_001',
    tenantId: 'tenant_demo',
    email: 'supervisor@turingdynamics.com',
    name: 'Demo Supervisor',
    role: 'SUPERVISOR',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    userId: 'comp_001',
    tenantId: 'tenant_demo',
    email: 'compliance@turingdynamics.com',
    name: 'Demo Compliance Officer',
    role: 'COMPLIANCE',
    createdAt: '2025-01-01T00:00:00Z',
  },
];

// =============================================================================
// PORTFOLIO SEED DATA
// =============================================================================

export const DEMO_PORTFOLIO: PortfolioSummary = {
  portfolioId: 'pf_demo_001',
  tenantId: 'tenant_demo',
  clientId: 'client_demo_001',
  name: 'Primary Portfolio',
  status: 'active',
  totalValueCents: 15234567, // $152,345.67
  currency: 'AUD',
  goalAccountIds: ['ga_001', 'ga_002', 'ga_003'],
  stateHash: 'a7b3c9d2e5f8g1h4',
  createdAt: '2025-01-15T10:30:00Z',
  updatedAt: '2025-12-31T14:22:00Z',
};

export const DEMO_PORTFOLIO_SNAPSHOT: PortfolioSnapshot = {
  portfolioId: 'pf_demo_001',
  snapshotAt: '2025-12-31T14:22:00Z',
  totalValueCents: 15234567,
  stateHash: 'snap_a7b3c9d2e5f8g1h4',
  evidenceRef: 'evd_snap_001',
  allocations: [
    {
      assetClass: 'Australian Shares',
      percentage: 35.5,
      valueCents: 5408272,
      holdings: [],
    },
    {
      assetClass: 'International Shares',
      percentage: 32.8,
      valueCents: 4996938,
      holdings: [],
    },
    {
      assetClass: 'Fixed Income',
      percentage: 21.2,
      valueCents: 3229728,
      holdings: [],
    },
    {
      assetClass: 'Cash',
      percentage: 10.5,
      valueCents: 1599629,
      holdings: [],
    },
  ],
};

// =============================================================================
// GOAL ACCOUNT SEED DATA
// =============================================================================

export const DEMO_GOAL_ACCOUNTS: GoalAccount[] = [
  {
    id: 'ga_001',
    portfolioId: 'pf_demo_001',
    name: 'Retirement Fund',
    goalType: 'retirement',
    targetAmountCents: 50000000, // $500,000
    targetDate: '2050-01-01',
    clientReason: 'Building long-term wealth for retirement',
    riskProfile: 'growth',
    timeHorizonYears: 25,
    liquidityNeeds: 'low',
    expectedRange: { lowCents: 45000000, highCents: 65000000 },
    feeEstimateAnnualCents: 175000, // $1,750
    status: 'active',
    createdAt: '2025-01-15T10:35:00Z',
    updatedAt: '2025-12-31T14:22:00Z',
  },
  {
    id: 'ga_002',
    portfolioId: 'pf_demo_001',
    name: 'Home Deposit',
    goalType: 'home',
    targetAmountCents: 10000000, // $100,000
    targetDate: '2028-06-01',
    clientReason: 'Saving for first home deposit',
    riskProfile: 'balanced',
    timeHorizonYears: 3,
    liquidityNeeds: 'medium',
    expectedRange: { lowCents: 9500000, highCents: 11500000 },
    feeEstimateAnnualCents: 35000, // $350
    status: 'active',
    createdAt: '2025-03-10T09:15:00Z',
    updatedAt: '2025-12-31T14:22:00Z',
  },
  {
    id: 'ga_003',
    portfolioId: 'pf_demo_001',
    name: 'Emergency Fund',
    goalType: 'savings',
    targetAmountCents: 2500000, // $25,000
    targetDate: '2026-12-31',
    clientReason: 'Building emergency savings buffer',
    riskProfile: 'conservative',
    timeHorizonYears: 1,
    liquidityNeeds: 'high',
    expectedRange: { lowCents: 2400000, highCents: 2600000 },
    feeEstimateAnnualCents: 8750, // $87.50
    status: 'active',
    createdAt: '2025-06-01T14:00:00Z',
    updatedAt: '2025-12-31T14:22:00Z',
  },
];

// =============================================================================
// GOAL ACCOUNT DETAIL SEED DATA
// =============================================================================

export const DEMO_GOAL_ACCOUNT_DETAILS: Record<string, GoalAccountDetail> = {
  'ga_001': {
    ...DEMO_GOAL_ACCOUNTS[0],
    stateHash: 'b8c4d0e6f2a9',
    holdingsSnapshot: {
      snapshotAt: '2025-12-31T14:22:00Z',
      totalValueCents: 8523400,
      stateHash: 'h1o2l3d4i5n6g7s8',
      holdings: [
        {
          holdingId: 'h_001',
          symbol: 'VAS',
          name: 'Vanguard Australian Shares ETF',
          assetClass: 'Australian Shares',
          units: 450,
          pricePerUnitCents: 9500,
          valueCents: 4275000,
          costBasisCents: 4050000,
          unrealizedGainCents: 225000,
          weightPercent: 50.15,
        },
        {
          holdingId: 'h_002',
          symbol: 'VGS',
          name: 'Vanguard MSCI Index International',
          assetClass: 'International Shares',
          units: 280,
          pricePerUnitCents: 11200,
          valueCents: 3136000,
          costBasisCents: 2940000,
          unrealizedGainCents: 196000,
          weightPercent: 36.79,
        },
        {
          holdingId: 'h_003',
          symbol: 'VAF',
          name: 'Vanguard Australian Fixed Interest',
          assetClass: 'Fixed Income',
          units: 100,
          pricePerUnitCents: 4800,
          valueCents: 480000,
          costBasisCents: 485000,
          unrealizedGainCents: -5000,
          weightPercent: 5.63,
        },
        {
          holdingId: 'h_004',
          symbol: 'CASH',
          name: 'Cash at Bank',
          assetClass: 'Cash',
          units: 1,
          pricePerUnitCents: 632400,
          valueCents: 632400,
          costBasisCents: 632400,
          unrealizedGainCents: 0,
          weightPercent: 7.42,
        },
      ],
      allocations: [
        { assetClass: 'Australian Shares', targetPercent: 40, actualPercent: 50.15, driftPercent: 10.15, valueCents: 4275000 },
        { assetClass: 'International Shares', targetPercent: 40, actualPercent: 36.79, driftPercent: -3.21, valueCents: 3136000 },
        { assetClass: 'Fixed Income', targetPercent: 15, actualPercent: 5.63, driftPercent: -9.37, valueCents: 480000 },
        { assetClass: 'Cash', targetPercent: 5, actualPercent: 7.42, driftPercent: 2.42, valueCents: 632400 },
      ],
    },
    performanceDeltas: {
      periodStart: '2025-01-01T00:00:00Z',
      periodEnd: '2025-12-31T23:59:59Z',
      startValueCents: 7500000,
      endValueCents: 8523400,
      contributionsCents: 600000,
      withdrawalsCents: 0,
      netFlowCents: 600000,
      gainLossCents: 423400,
      returnPercent: 5.65,
      benchmarkReturnPercent: 5.20,
      evidenceRef: 'evd_perf_2025',
    },
    evidenceRefs: [
      {
        evidenceId: 'evd_001',
        evidenceType: 'CONSENT_RECORD',
        description: 'Initial goal account consent',
        documentRef: '/docs/consent_ga_001.pdf',
        hash: 'c1o2n3s4e5n6t7',
        createdAt: '2025-01-15T10:35:00Z',
      },
      {
        evidenceId: 'evd_002',
        evidenceType: 'RISK_ASSESSMENT',
        description: 'Risk profile assessment',
        documentRef: '/docs/risk_ga_001.pdf',
        hash: 'r1i2s3k4a5s6s7',
        createdAt: '2025-01-15T10:30:00Z',
      },
      {
        evidenceId: 'evd_003',
        evidenceType: 'EXECUTION_CONFIRMATION',
        description: 'Initial investment execution',
        documentRef: '/docs/exec_ga_001.pdf',
        hash: 'e1x2e3c4u5t6e7',
        createdAt: '2025-01-16T09:00:00Z',
      },
    ],
  },
};

// =============================================================================
// ACTIVITY EVENT SEED DATA
// =============================================================================

export const DEMO_EVENTS: ActivityEvent[] = [
  {
    eventId: 'evt_001',
    eventType: 'CLIENT_ACTIVATED',
    eventVersion: 1,
    occurredAt: '2025-12-31T14:22:00Z',
    actor: { actorType: 'SYSTEM', actorId: 'system', role: 'SYSTEM' },
    tenantId: 'tenant_demo',
    portfolioId: 'pf_demo_001',
    source: { channel: 'system', jurisdiction: 'AU' },
    payload: { clientId: 'client_demo_001' },
    hash: 'h1a2s3h4_001',
  },
  {
    eventId: 'evt_002',
    eventType: 'PORTFOLIO_CREATED',
    eventVersion: 1,
    occurredAt: '2025-12-31T14:20:00Z',
    actor: { actorType: 'CLIENT', actorId: 'client_demo_001', sessionId: 'sess_001' },
    tenantId: 'tenant_demo',
    portfolioId: 'pf_demo_001',
    source: { channel: 'web', jurisdiction: 'AU' },
    payload: { portfolioName: 'Primary Portfolio' },
    hash: 'h1a2s3h4_002',
  },
  {
    eventId: 'evt_003',
    eventType: 'GOAL_ACCOUNT_CREATED',
    eventVersion: 1,
    occurredAt: '2025-12-31T14:18:00Z',
    actor: { actorType: 'CLIENT', actorId: 'client_demo_001', sessionId: 'sess_001' },
    tenantId: 'tenant_demo',
    portfolioId: 'pf_demo_001',
    goalAccountId: 'ga_001',
    source: { channel: 'web', jurisdiction: 'AU' },
    payload: { goalName: 'Retirement Fund', goalType: 'retirement' },
    hash: 'h1a2s3h4_003',
  },
  {
    eventId: 'evt_004',
    eventType: 'CONSENT_GIVEN',
    eventVersion: 1,
    occurredAt: '2025-12-31T14:15:00Z',
    actor: { actorType: 'CLIENT', actorId: 'client_demo_001', sessionId: 'sess_001' },
    tenantId: 'tenant_demo',
    source: { channel: 'web', jurisdiction: 'AU' },
    payload: { documentId: 'privacy_policy', version: '2026.1' },
    hash: 'h1a2s3h4_004',
  },
  {
    eventId: 'evt_005',
    eventType: 'KYC_RESULT_RECEIVED',
    eventVersion: 1,
    occurredAt: '2025-12-31T14:10:00Z',
    actor: { actorType: 'SYSTEM', actorId: 'kyc_provider', role: 'SYSTEM' },
    tenantId: 'tenant_demo',
    source: { channel: 'api', jurisdiction: 'AU' },
    payload: { status: 'verified', provider: 'greenid' },
    hash: 'h1a2s3h4_005',
  },
  {
    eventId: 'evt_006',
    eventType: 'REBALANCE_EXECUTED',
    eventVersion: 1,
    occurredAt: '2025-12-30T09:00:00Z',
    actor: { actorType: 'SYSTEM', actorId: 'rebalance_engine', role: 'SYSTEM' },
    tenantId: 'tenant_demo',
    portfolioId: 'pf_demo_001',
    goalAccountId: 'ga_001',
    source: { channel: 'system', jurisdiction: 'AU' },
    payload: { reason: 'Scheduled quarterly rebalance', tradeCount: 4 },
    hash: 'h1a2s3h4_006',
  },
  {
    eventId: 'evt_007',
    eventType: 'CONTRIBUTION_RECEIVED',
    eventVersion: 1,
    occurredAt: '2025-12-28T11:30:00Z',
    actor: { actorType: 'CLIENT', actorId: 'client_demo_001' },
    tenantId: 'tenant_demo',
    portfolioId: 'pf_demo_001',
    goalAccountId: 'ga_001',
    source: { channel: 'api', jurisdiction: 'AU' },
    payload: { amountCents: 50000, method: 'payid' },
    hash: 'h1a2s3h4_007',
  },
  {
    eventId: 'evt_008',
    eventType: 'SYSTEM_SNAPSHOT_CREATED',
    eventVersion: 1,
    occurredAt: '2025-12-27T00:00:00Z',
    actor: { actorType: 'SYSTEM', actorId: 'snapshot_service', role: 'SYSTEM' },
    tenantId: 'tenant_demo',
    portfolioId: 'pf_demo_001',
    source: { channel: 'system', jurisdiction: 'AU' },
    payload: { snapshotType: 'daily', portfolioValueCents: 8473400 },
    hash: 'h1a2s3h4_008',
  },
  {
    eventId: 'evt_009',
    eventType: 'POLICY_GATE_PASSED',
    eventVersion: 1,
    occurredAt: '2025-12-26T15:45:00Z',
    actor: { actorType: 'SYSTEM', actorId: 'policy_engine', role: 'SYSTEM' },
    tenantId: 'tenant_demo',
    portfolioId: 'pf_demo_001',
    source: { channel: 'system', jurisdiction: 'AU' },
    payload: { policyCode: 'REBAL-001', decision: 'APPROVED' },
    hash: 'h1a2s3h4_009',
  },
  {
    eventId: 'evt_010',
    eventType: 'LOCK_APPLIED',
    eventVersion: 1,
    occurredAt: '2025-12-20T10:00:00Z',
    actor: { actorType: 'OPERATOR', actorId: 'op_001', role: 'OPERATOR' },
    tenantId: 'tenant_demo',
    portfolioId: 'pf_demo_001',
    source: { channel: 'web', jurisdiction: 'AU' },
    payload: { lockType: 'SOFT', reason: 'Compliance review' },
    hash: 'h1a2s3h4_010',
  },
  // Template-related events
  {
    eventId: 'evt_011',
    eventType: 'TEMPLATE_SELECTED',
    eventVersion: 1,
    occurredAt: '2025-12-31T14:19:00Z',
    actor: { actorType: 'CLIENT', actorId: 'client_demo_001', sessionId: 'sess_001' },
    tenantId: 'tenant_demo',
    source: { channel: 'web', jurisdiction: 'AU' },
    payload: {
      templateId: 'tpl_balanced_growth',
      templateVersion: '1.0.0',
      templateHash: 'sha256:a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
      templateName: 'Balanced Growth',
    },
    hash: 'h1a2s3h4_011',
  },
  {
    eventId: 'evt_012',
    eventType: 'PORTFOLIO_INSTANTIATED_FROM_TEMPLATE',
    eventVersion: 1,
    occurredAt: '2025-12-31T14:19:30Z',
    actor: { actorType: 'CLIENT', actorId: 'client_demo_001', sessionId: 'sess_001' },
    tenantId: 'tenant_demo',
    portfolioId: 'pf_demo_001',
    source: { channel: 'web', jurisdiction: 'AU' },
    payload: {
      templateId: 'tpl_balanced_growth',
      templateVersion: '1.0.0',
      templateHash: 'sha256:a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
      portfolioName: 'Primary Portfolio',
      goalAccountsCreated: 3,
      disclosuresAcknowledged: ['disc_001', 'disc_002'],
    },
    hash: 'h1a2s3h4_012',
  },
  // Legal Entity Onboarding Events (aligned with onboarding_v2)
  {
    eventId: 'evt_013',
    eventType: 'ONBOARDING_CASE_CREATED',
    eventVersion: 1,
    occurredAt: '2025-12-31T14:00:00Z',
    actor: { actorType: 'CLIENT', actorId: 'client_demo_001', sessionId: 'sess_001' },
    tenantId: 'tenant_demo',
    source: { channel: 'web', jurisdiction: 'AU' },
    payload: {
      caseId: 'case_demo_001',
      legalEntityType: 'INDIVIDUAL',
      jurisdiction: 'AU',
    },
    hash: 'h1a2s3h4_013',
  },
  {
    eventId: 'evt_014',
    eventType: 'LEGAL_ENTITY_DECLARED',
    eventVersion: 1,
    occurredAt: '2025-12-31T14:01:00Z',
    actor: { actorType: 'CLIENT', actorId: 'client_demo_001', sessionId: 'sess_001' },
    tenantId: 'tenant_demo',
    source: { channel: 'web', jurisdiction: 'AU' },
    payload: {
      caseId: 'case_demo_001',
      legalEntityType: 'INDIVIDUAL',
      entityName: 'Demo Client',
    },
    hash: 'h1a2s3h4_014',
  },
  {
    eventId: 'evt_015',
    eventType: 'PERSON_ADDED',
    eventVersion: 1,
    occurredAt: '2025-12-31T14:02:00Z',
    actor: { actorType: 'CLIENT', actorId: 'client_demo_001', sessionId: 'sess_001' },
    tenantId: 'tenant_demo',
    source: { channel: 'web', jurisdiction: 'AU' },
    payload: {
      caseId: 'case_demo_001',
      personId: 'person_demo_001',
      firstName: 'Demo',
      lastName: 'Client',
      email: 'demo.client@example.com',
    },
    hash: 'h1a2s3h4_015',
  },
  {
    eventId: 'evt_016',
    eventType: 'CONFIRMATION_RECORDED',
    eventVersion: 1,
    occurredAt: '2025-12-31T14:03:00Z',
    actor: { actorType: 'CLIENT', actorId: 'client_demo_001', sessionId: 'sess_001' },
    tenantId: 'tenant_demo',
    source: { channel: 'web', jurisdiction: 'AU' },
    payload: {
      caseId: 'case_demo_001',
      confirmationType: 'IDENTITY_VERIFIED',
      confirmedBy: 'client_demo_001',
    },
    hash: 'h1a2s3h4_016',
  },
  {
    eventId: 'evt_017',
    eventType: 'ONBOARDING_FINALISED',
    eventVersion: 1,
    occurredAt: '2025-12-31T14:05:00Z',
    actor: { actorType: 'CLIENT', actorId: 'client_demo_001', sessionId: 'sess_001' },
    tenantId: 'tenant_demo',
    source: { channel: 'web', jurisdiction: 'AU' },
    payload: {
      caseId: 'case_demo_001',
      clientId: 'client_demo_001',
      portfolioId: 'pf_demo_001',
      legalEntityType: 'INDIVIDUAL',
      portfolioStateHash: 'state_demo_001',
    },
    hash: 'h1a2s3h4_017',
  },
  // FX Conversion Events
  {
    eventId: 'evt_018',
    eventType: 'FX_CONVERSION_REQUESTED',
    eventVersion: 1,
    occurredAt: '2025-12-31T15:00:00Z',
    actor: { actorType: 'OPERATOR', actorId: 'operator_demo_001', sessionId: 'sess_002' },
    tenantId: 'tenant_demo',
    portfolioId: 'portfolio-001',
    source: { channel: 'web', jurisdiction: 'AU' },
    payload: {
      requestId: 'fx_req_001',
      fromCurrency: 'AUD',
      toCurrency: 'USD',
      amount: 10000,
      reason: 'USD allocation rebalance',
    },
    hash: 'h1a2s3h4_018',
  },
  {
    eventId: 'evt_019',
    eventType: 'FX_RATE_QUOTED',
    eventVersion: 1,
    occurredAt: '2025-12-31T15:00:05Z',
    actor: { actorType: 'SYSTEM', actorId: 'system_fx_engine', sessionId: 'sys_001' },
    tenantId: 'tenant_demo',
    portfolioId: 'portfolio-001',
    source: { channel: 'system', jurisdiction: 'AU' },
    payload: {
      quoteId: 'fx_quote_001',
      fromCurrency: 'AUD',
      toCurrency: 'USD',
      rate: 0.6543,
      rateSource: 'RBA Mid-Market Rate',
      validUntil: '2025-12-31T15:00:35Z',
    },
    hash: 'h1a2s3h4_019',
  },
  {
    eventId: 'evt_020',
    eventType: 'FX_CONVERSION_EXECUTED',
    eventVersion: 1,
    occurredAt: '2025-12-31T15:00:15Z',
    actor: { actorType: 'OPERATOR', actorId: 'operator_demo_001', sessionId: 'sess_002' },
    tenantId: 'tenant_demo',
    portfolioId: 'portfolio-001',
    source: { channel: 'web', jurisdiction: 'AU' },
    payload: {
      conversionId: 'fx_conv_001',
      fromCurrency: 'AUD',
      toCurrency: 'USD',
      fromAmount: 10000,
      toAmount: 6543,
      rate: 0.6543,
      rateSource: 'RBA Mid-Market Rate',
      portfolioStateHash: 'state_fx_001',
    },
    hash: 'h1a2s3h4_020',
  },
  // Crypto Execution Events
  {
    eventId: 'evt_021',
    eventType: 'CRYPTO_EXECUTION_REQUESTED',
    eventVersion: 1,
    occurredAt: '2025-12-31T16:00:00Z',
    actor: { actorType: 'SUPERVISOR', actorId: 'supervisor_demo_001', sessionId: 'sess_003' },
    tenantId: 'tenant_demo',
    portfolioId: 'portfolio-001',
    source: { channel: 'web', jurisdiction: 'AU' },
    payload: {
      requestId: 'crypto_req_001',
      asset: 'BTC',
      action: 'BUY',
      quantity: 0.5,
      reason: 'Crypto allocation target',
    },
    hash: 'h1a2s3h4_021',
  },
  {
    eventId: 'evt_022',
    eventType: 'CRYPTO_PRICE_QUOTED',
    eventVersion: 1,
    occurredAt: '2025-12-31T16:00:05Z',
    actor: { actorType: 'SYSTEM', actorId: 'system_crypto_engine', sessionId: 'sys_002' },
    tenantId: 'tenant_demo',
    portfolioId: 'portfolio-001',
    source: { channel: 'system', jurisdiction: 'AU' },
    payload: {
      quoteId: 'crypto_quote_001',
      asset: 'BTC',
      quantity: 0.5,
      priceInAud: 145000,
      totalValueAud: 72500,
      priceSource: 'CoinGecko Aggregated',
      custodian: 'BitGo Custody',
      validUntil: '2025-12-31T16:00:35Z',
    },
    hash: 'h1a2s3h4_022',
  },
  {
    eventId: 'evt_023',
    eventType: 'CRYPTO_EXECUTION_COMPLETED',
    eventVersion: 1,
    occurredAt: '2025-12-31T16:00:20Z',
    actor: { actorType: 'SUPERVISOR', actorId: 'supervisor_demo_001', sessionId: 'sess_003' },
    tenantId: 'tenant_demo',
    portfolioId: 'portfolio-001',
    source: { channel: 'web', jurisdiction: 'AU' },
    payload: {
      executionId: 'crypto_exec_001',
      asset: 'BTC',
      action: 'BUY',
      quantity: 0.5,
      priceInAud: 145000,
      totalValueAud: 72500,
      priceSource: 'CoinGecko Aggregated',
      custodian: 'BitGo Custody',
      walletReference: 'vault_***_001',
      portfolioStateHash: 'state_crypto_001',
    },
    hash: 'h1a2s3h4_023',
  },
  // Threshold Configuration Events
  {
    eventId: 'evt_024',
    eventType: 'THRESHOLD_CHANGED',
    eventVersion: 1,
    occurredAt: '2025-12-31T17:00:00Z',
    actor: { actorType: 'SUPERVISOR', actorId: 'supervisor_demo_001', sessionId: 'sess_003' },
    tenantId: 'tenant_demo',
    source: { channel: 'web', jurisdiction: 'AU' },
    payload: {
      thresholdId: 'threshold_fx_001',
      category: 'FX_CONVERSION',
      currencyOrAsset: 'AUD',
      previousAmount: 50000,
      newAmount: 75000,
      unit: 'AUD',
    },
    hash: 'h1a2s3h4_024',
  },
  {
    eventId: 'evt_025',
    eventType: 'THRESHOLD_CHANGED',
    eventVersion: 1,
    occurredAt: '2025-12-31T17:05:00Z',
    actor: { actorType: 'COMPLIANCE', actorId: 'compliance_demo_001', sessionId: 'sess_004' },
    tenantId: 'tenant_demo',
    source: { channel: 'web', jurisdiction: 'AU' },
    payload: {
      thresholdId: 'threshold_crypto_buy_001',
      category: 'CRYPTO_BUY',
      currencyOrAsset: 'BTC',
      previousAmount: 50000,
      newAmount: 100000,
      unit: 'AUD',
    },
    hash: 'h1a2s3h4_025',
  },
];

// =============================================================================
// REPORT SEED DATA
// =============================================================================

export const DEMO_REPORTS: ReportSummary[] = [
  {
    reportId: 'rpt_001',
    reportType: 'SNAPSHOT',
    title: 'Q4 2025 Portfolio Snapshot',
    periodStart: '2025-10-01T00:00:00Z',
    periodEnd: '2025-12-31T23:59:59Z',
    generatedAt: '2026-01-01T00:15:00Z',
    hash: 'snap_h1a2s3h4',
    evidenceBundleId: 'evb_001',
  },
  {
    reportId: 'rpt_002',
    reportType: 'DELTA',
    title: 'December 2025 Performance Report',
    periodStart: '2025-12-01T00:00:00Z',
    periodEnd: '2025-12-31T23:59:59Z',
    generatedAt: '2026-01-01T00:10:00Z',
    hash: 'delta_h5b6c7d8',
    evidenceBundleId: 'evb_002',
  },
  {
    reportId: 'rpt_003',
    reportType: 'ANNUAL_STATEMENT',
    title: '2025 Annual Statement',
    periodStart: '2025-01-01T00:00:00Z',
    periodEnd: '2025-12-31T23:59:59Z',
    generatedAt: '2026-01-01T00:20:00Z',
    hash: 'annual_e9f0g1h2',
    evidenceBundleId: 'evb_003',
  },
  {
    reportId: 'rpt_004',
    reportType: 'TAX_SUMMARY',
    title: 'FY2025 Tax Summary',
    periodStart: '2024-07-01T00:00:00Z',
    periodEnd: '2025-06-30T23:59:59Z',
    generatedAt: '2025-07-15T00:00:00Z',
    hash: 'tax_i3j4k5l6',
    evidenceBundleId: 'evb_004',
  },
  {
    reportId: 'rpt_005',
    reportType: 'AUDIT_TRAIL',
    title: 'Q4 2025 Audit Trail Export',
    periodStart: '2025-10-01T00:00:00Z',
    periodEnd: '2025-12-31T23:59:59Z',
    generatedAt: '2026-01-01T00:25:00Z',
    hash: 'audit_m7n8o9p0',
    evidenceBundleId: 'evb_005',
  },
];

// =============================================================================
// EVIDENCE BUNDLE SEED DATA
// =============================================================================

export const DEMO_EVIDENCE_BUNDLES: EvidenceBundleMetadata[] = [
  {
    bundleId: 'evb_001',
    createdAt: '2026-01-01T00:15:00Z',
    documentCount: 5,
    totalSizeBytes: 2456789,
    hash: 'bundle_q1r2s3t4',
    documents: [
      { documentId: 'doc_001', documentType: 'SNAPSHOT_DATA', hash: 'd1o2c3_001' },
      { documentId: 'doc_002', documentType: 'HOLDINGS_LIST', hash: 'd1o2c3_002' },
      { documentId: 'doc_003', documentType: 'ALLOCATION_SUMMARY', hash: 'd1o2c3_003' },
      { documentId: 'doc_004', documentType: 'PRICE_SOURCES', hash: 'd1o2c3_004' },
      { documentId: 'doc_005', documentType: 'CALCULATION_LOG', hash: 'd1o2c3_005' },
    ],
  },
  {
    bundleId: 'evb_002',
    createdAt: '2026-01-01T00:10:00Z',
    documentCount: 4,
    totalSizeBytes: 1234567,
    hash: 'bundle_u5v6w7x8',
    documents: [
      { documentId: 'doc_006', documentType: 'PERFORMANCE_DATA', hash: 'd1o2c3_006' },
      { documentId: 'doc_007', documentType: 'TRANSACTION_LOG', hash: 'd1o2c3_007' },
      { documentId: 'doc_008', documentType: 'BENCHMARK_DATA', hash: 'd1o2c3_008' },
      { documentId: 'doc_009', documentType: 'RETURN_CALCULATION', hash: 'd1o2c3_009' },
    ],
  },
];

// =============================================================================
// AUTHORITY SEED DATA
// =============================================================================

export const DEMO_AUTHORITY_SET: AuthoritySet = {
  role: 'SUPERVISOR',
  permissions: [
    { decisionType: 'PAYMENT', allowed: true, dualControlRequired: false, policyCode: 'PAY-004' },
    { decisionType: 'LIMIT_OVERRIDE', allowed: false, dualControlRequired: true, policyCode: 'LIM-002' },
    { decisionType: 'AML_EXCEPTION', allowed: false, dualControlRequired: true, policyCode: 'AML-007' },
    { decisionType: 'POLICY_CHANGE', allowed: false, dualControlRequired: true, policyCode: 'GOV-001' },
  ],
  matrixVersion: '2025-02-18',
  matrixHash: 'auth_m1a2t3r4i5x6',
};

// =============================================================================
// SYSTEM PROOF SEED DATA
// =============================================================================

export const DEMO_SYSTEM_PROOF: SystemProofBundle = {
  bundleId: 'spb_demo_001',
  createdAt: '2026-01-01T00:30:00Z',
  bundleHash: 'bundle_z9y8x7w6v5u4t3s2r1',
  notarisationStatus: 'CONFIRMED',
  replayReceipts: [
    { receiptId: 'rr_001', eventId: 'evt_001', replayedAt: '2026-01-01T00:25:00Z', resultHash: 'replay_a1b2c3d4', verified: true },
    { receiptId: 'rr_002', eventId: 'evt_002', replayedAt: '2026-01-01T00:25:01Z', resultHash: 'replay_e5f6g7h8', verified: true },
    { receiptId: 'rr_003', eventId: 'evt_003', replayedAt: '2026-01-01T00:25:02Z', resultHash: 'replay_i9j0k1l2', verified: true },
    { receiptId: 'rr_004', eventId: 'evt_004', replayedAt: '2026-01-01T00:25:03Z', resultHash: 'replay_m3n4o5p6', verified: true },
    { receiptId: 'rr_005', eventId: 'evt_005', replayedAt: '2026-01-01T00:25:04Z', resultHash: 'replay_q7r8s9t0', verified: true },
  ],
  eventHashes: [
    { eventId: 'evt_001', eventType: 'CLIENT_ACTIVATED', occurredAt: '2025-12-31T14:22:00Z', hash: 'h1a2s3h4_001', previousHash: '0000000000000000', chainPosition: 1 },
    { eventId: 'evt_002', eventType: 'PORTFOLIO_CREATED', occurredAt: '2025-12-31T14:20:00Z', hash: 'h1a2s3h4_002', previousHash: 'h1a2s3h4_001', chainPosition: 2 },
    { eventId: 'evt_003', eventType: 'GOAL_ACCOUNT_CREATED', occurredAt: '2025-12-31T14:18:00Z', hash: 'h1a2s3h4_003', previousHash: 'h1a2s3h4_002', chainPosition: 3 },
    { eventId: 'evt_004', eventType: 'CONSENT_GIVEN', occurredAt: '2025-12-31T14:15:00Z', hash: 'h1a2s3h4_004', previousHash: 'h1a2s3h4_003', chainPosition: 4 },
    { eventId: 'evt_005', eventType: 'KYC_RESULT_RECEIVED', occurredAt: '2025-12-31T14:10:00Z', hash: 'h1a2s3h4_005', previousHash: 'h1a2s3h4_004', chainPosition: 5 },
    { eventId: 'evt_006', eventType: 'REBALANCE_EXECUTED', occurredAt: '2025-12-30T09:00:00Z', hash: 'h1a2s3h4_006', previousHash: 'h1a2s3h4_005', chainPosition: 6 },
  ],
};

// =============================================================================
// COMMAND LOG SEED DATA
// =============================================================================

export const DEMO_COMMAND_LOG: ControlCommand[] = [
  {
    commandId: 'cmd_001',
    commandType: 'REBALANCE',
    targetId: 'ga_001',
    targetType: 'GOAL_ACCOUNT',
    issuedBy: { actorType: 'SUPERVISOR', actorId: 'sup_001', role: 'SUPERVISOR' },
    issuedAt: '2025-12-30T09:00:00Z',
    status: 'EXECUTED',
    requiresDualControl: false,
    executedAt: '2025-12-30T09:05:00Z',
    eventRef: 'evt_006',
    hash: 'cmd_h1a2s3h4_001',
  },
  {
    commandId: 'cmd_002',
    commandType: 'LOCK',
    targetId: 'pf_demo_001',
    targetType: 'PORTFOLIO',
    issuedBy: { actorType: 'OPERATOR', actorId: 'op_001', role: 'OPERATOR' },
    issuedAt: '2025-12-20T10:00:00Z',
    status: 'EXECUTED',
    requiresDualControl: false,
    executedAt: '2025-12-20T10:01:00Z',
    eventRef: 'evt_010',
    hash: 'cmd_h1a2s3h4_002',
  },
  {
    commandId: 'cmd_003',
    commandType: 'UNLOCK',
    targetId: 'pf_demo_001',
    targetType: 'PORTFOLIO',
    issuedBy: { actorType: 'SUPERVISOR', actorId: 'sup_001', role: 'SUPERVISOR' },
    issuedAt: '2025-12-22T14:30:00Z',
    status: 'EXECUTED',
    requiresDualControl: false,
    approvedBy: { actorType: 'COMPLIANCE', actorId: 'comp_001', role: 'COMPLIANCE' },
    approvedAt: '2025-12-22T14:35:00Z',
    executedAt: '2025-12-22T14:36:00Z',
    eventRef: 'evt_011',
    hash: 'cmd_h1a2s3h4_003',
  },
  {
    commandId: 'cmd_004',
    commandType: 'PROOF_EXPORT',
    targetId: 'pf_demo_001',
    targetType: 'PORTFOLIO',
    issuedBy: { actorType: 'COMPLIANCE', actorId: 'comp_001', role: 'COMPLIANCE' },
    issuedAt: '2025-12-31T16:00:00Z',
    status: 'PENDING',
    requiresDualControl: false,
    hash: 'cmd_h1a2s3h4_004',
  },
];

// =============================================================================
// EXPORT ALL SEED DATA
// =============================================================================

export const SEED_DATA = {
  tenant: DEMO_TENANT,
  users: DEMO_USERS,
  portfolio: DEMO_PORTFOLIO,
  portfolioSnapshot: DEMO_PORTFOLIO_SNAPSHOT,
  goalAccounts: DEMO_GOAL_ACCOUNTS,
  goalAccountDetails: DEMO_GOAL_ACCOUNT_DETAILS,
  events: DEMO_EVENTS,
  reports: DEMO_REPORTS,
  evidenceBundles: DEMO_EVIDENCE_BUNDLES,
  authoritySet: DEMO_AUTHORITY_SET,
  systemProof: DEMO_SYSTEM_PROOF,
  commandLog: DEMO_COMMAND_LOG,
};

export default SEED_DATA;
