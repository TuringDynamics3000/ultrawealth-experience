/**
 * FX and Crypto Seed Data
 * 
 * Demo data for FX conversions and crypto executions.
 * All data is explicit, traceable, and provable.
 */

import type {
  FiatCurrency,
  CryptoAsset,
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
import {
  BASE_CURRENCY,
  SUPPORTED_FIAT_CURRENCIES,
  SUPPORTED_CRYPTO_ASSETS,
} from '../contracts/fx-crypto';

// =============================================================================
// CURRENCY CONFIGURATION
// =============================================================================

export const DEMO_CURRENCY_CONFIG: CurrencyConfiguration = {
  baseCurrency: BASE_CURRENCY,
  supportedFiatCurrencies: [...SUPPORTED_FIAT_CURRENCIES],
  supportedCryptoAssets: [...SUPPORTED_CRYPTO_ASSETS],
  valuationMode: 'EXPLICIT_FX_AND_PRICE_EVENTS_ONLY',
};

// =============================================================================
// FX RATE DATA
// =============================================================================

export const DEMO_FX_RATES: Record<string, number> = {
  'AUD/USD': 0.6523,
  'AUD/GBP': 0.5142,
  'AUD/EUR': 0.5987,
  'USD/AUD': 1.5331,
  'USD/GBP': 0.7883,
  'USD/EUR': 0.9178,
  'GBP/AUD': 1.9448,
  'GBP/USD': 1.2686,
  'GBP/EUR': 1.1643,
  'EUR/AUD': 1.6703,
  'EUR/USD': 1.0896,
  'EUR/GBP': 0.8589,
};

export function getDemoFxRate(from: FiatCurrency, to: FiatCurrency): number {
  if (from === to) return 1;
  const key = `${from}/${to}`;
  return DEMO_FX_RATES[key] || 1;
}

// =============================================================================
// CRYPTO PRICE DATA
// =============================================================================

export const DEMO_CRYPTO_PRICES: Record<CryptoAsset, number> = {
  BTC: 152340.00, // AUD
  ETH: 5890.00,   // AUD
};

export function getDemoCryptoPrice(asset: CryptoAsset): number {
  return DEMO_CRYPTO_PRICES[asset] || 0;
}

// =============================================================================
// FX CONVERSION RECORDS
// =============================================================================

export const DEMO_FX_CONVERSIONS: FxConversionRecord[] = [
  {
    conversionId: 'fx-conv-001',
    portfolioId: 'portfolio-001',
    fromCurrency: 'AUD',
    toCurrency: 'USD',
    fromAmount: 10000,
    toAmount: 6523,
    rate: 0.6523,
    rateSource: 'RBA Mid-Market Rate',
    status: 'EXECUTED',
    requestedBy: 'demo-user-001',
    requestedAt: '2025-12-15T09:00:00Z',
    quotedAt: '2025-12-15T09:00:05Z',
    executedAt: '2025-12-15T09:00:10Z',
    executedBy: 'demo-user-001',
    reason: 'USD allocation for international holdings',
    dualControlRequired: false,
    authorityScope: ['PORTFOLIO_CONTROL'],
    executionMode: 'DEMO',
    portfolioStateHash: 'fx-state-hash-001',
  },
  {
    conversionId: 'fx-conv-002',
    portfolioId: 'portfolio-001',
    fromCurrency: 'AUD',
    toCurrency: 'GBP',
    fromAmount: 75000,
    toAmount: 38565,
    rate: 0.5142,
    rateSource: 'RBA Mid-Market Rate',
    status: 'EXECUTED',
    requestedBy: 'demo-user-001',
    requestedAt: '2025-12-20T14:30:00Z',
    quotedAt: '2025-12-20T14:30:05Z',
    executedAt: '2025-12-20T14:35:00Z',
    executedBy: 'demo-supervisor-001',
    reason: 'GBP allocation for UK property fund',
    dualControlRequired: true,
    approvedBy: 'demo-supervisor-001',
    approvedAt: '2025-12-20T14:34:00Z',
    authorityScope: ['PORTFOLIO_CONTROL'],
    executionMode: 'DEMO',
    portfolioStateHash: 'fx-state-hash-002',
  },
];

// =============================================================================
// CRYPTO EXECUTION RECORDS
// =============================================================================

export const DEMO_CRYPTO_EXECUTIONS: CryptoExecutionRecord[] = [
  {
    executionId: 'crypto-exec-001',
    portfolioId: 'portfolio-001',
    asset: 'BTC',
    action: 'BUY',
    quantity: 0.5,
    priceInAud: 152340.00,
    totalValueAud: 76170.00,
    priceSource: 'CoinGecko Aggregated',
    custodian: 'BitGo Custody',
    walletReference: 'bc1q***7k9m',
    status: 'COMPLETED',
    requestedBy: 'demo-user-001',
    requestedAt: '2025-12-18T10:00:00Z',
    quotedAt: '2025-12-18T10:00:05Z',
    executedAt: '2025-12-18T10:05:00Z',
    executedBy: 'demo-supervisor-001',
    reason: 'BTC allocation per instruction',
    dualControlRequired: true,
    approvedBy: 'demo-supervisor-001',
    approvedAt: '2025-12-18T10:04:00Z',
    authorityScope: ['PORTFOLIO_CONTROL'],
    executionMode: 'DEMO',
    portfolioStateHash: 'crypto-state-hash-001',
  },
  {
    executionId: 'crypto-exec-002',
    portfolioId: 'portfolio-001',
    asset: 'ETH',
    action: 'BUY',
    quantity: 2.0,
    priceInAud: 5890.00,
    totalValueAud: 11780.00,
    priceSource: 'CoinGecko Aggregated',
    custodian: 'BitGo Custody',
    walletReference: '0x8f***3a2b',
    status: 'COMPLETED',
    requestedBy: 'demo-user-001',
    requestedAt: '2025-12-19T11:30:00Z',
    quotedAt: '2025-12-19T11:30:05Z',
    executedAt: '2025-12-19T11:32:00Z',
    executedBy: 'demo-user-001',
    reason: 'ETH allocation per instruction',
    dualControlRequired: false,
    authorityScope: ['PORTFOLIO_CONTROL'],
    executionMode: 'DEMO',
    portfolioStateHash: 'crypto-state-hash-002',
  },
];

// =============================================================================
// CRYPTO HOLDINGS
// =============================================================================

export const DEMO_CRYPTO_HOLDINGS: CryptoHolding[] = [
  {
    asset: 'BTC',
    quantity: 0.5,
    costBasisAud: 76170.00,
    currentPriceAud: 152340.00,
    currentValueAud: 76170.00,
    unrealizedGainLossAud: 0,
    custodian: 'BitGo Custody',
    walletReference: 'bc1q***7k9m',
    lastPriceUpdate: '2025-12-31T00:00:00Z',
    priceSource: 'CoinGecko Aggregated',
  },
  {
    asset: 'ETH',
    quantity: 2.0,
    costBasisAud: 11780.00,
    currentPriceAud: 5890.00,
    currentValueAud: 11780.00,
    unrealizedGainLossAud: 0,
    custodian: 'BitGo Custody',
    walletReference: '0x8f***3a2b',
    lastPriceUpdate: '2025-12-31T00:00:00Z',
    priceSource: 'CoinGecko Aggregated',
  },
];

// =============================================================================
// FX EVENTS
// =============================================================================

export const DEMO_FX_EVENTS: FxEvent[] = [
  {
    eventId: 'fx-event-001',
    eventType: 'FX_CONVERSION_REQUESTED',
    conversionId: 'fx-conv-001',
    portfolioId: 'portfolio-001',
    fromCurrency: 'AUD',
    toCurrency: 'USD',
    amount: 10000,
    actor: 'demo-user-001',
    actorType: 'USER',
    timestamp: '2025-12-15T09:00:00Z',
    authorityScope: ['PORTFOLIO_CONTROL'],
    executionMode: 'DEMO',
    eventHash: 'fx-evt-hash-001',
  },
  {
    eventId: 'fx-event-002',
    eventType: 'FX_RATE_QUOTED',
    conversionId: 'fx-conv-001',
    portfolioId: 'portfolio-001',
    fromCurrency: 'AUD',
    toCurrency: 'USD',
    amount: 10000,
    rate: 0.6523,
    rateSource: 'RBA Mid-Market Rate',
    actor: 'SYSTEM',
    actorType: 'SYSTEM',
    timestamp: '2025-12-15T09:00:05Z',
    authorityScope: [],
    executionMode: 'DEMO',
    eventHash: 'fx-evt-hash-002',
  },
  {
    eventId: 'fx-event-003',
    eventType: 'FX_CONVERSION_EXECUTED',
    conversionId: 'fx-conv-001',
    portfolioId: 'portfolio-001',
    fromCurrency: 'AUD',
    toCurrency: 'USD',
    amount: 10000,
    rate: 0.6523,
    rateSource: 'RBA Mid-Market Rate',
    actor: 'demo-user-001',
    actorType: 'USER',
    timestamp: '2025-12-15T09:00:10Z',
    authorityScope: ['PORTFOLIO_CONTROL'],
    executionMode: 'DEMO',
    eventHash: 'fx-evt-hash-003',
  },
  {
    eventId: 'fx-event-004',
    eventType: 'FX_CONVERSION_REQUESTED',
    conversionId: 'fx-conv-002',
    portfolioId: 'portfolio-001',
    fromCurrency: 'AUD',
    toCurrency: 'GBP',
    amount: 75000,
    actor: 'demo-user-001',
    actorType: 'USER',
    timestamp: '2025-12-20T14:30:00Z',
    authorityScope: ['PORTFOLIO_CONTROL'],
    executionMode: 'DEMO',
    eventHash: 'fx-evt-hash-004',
  },
  {
    eventId: 'fx-event-005',
    eventType: 'FX_CONVERSION_PENDING_APPROVAL',
    conversionId: 'fx-conv-002',
    portfolioId: 'portfolio-001',
    fromCurrency: 'AUD',
    toCurrency: 'GBP',
    amount: 75000,
    actor: 'SYSTEM',
    actorType: 'SYSTEM',
    timestamp: '2025-12-20T14:30:10Z',
    authorityScope: [],
    executionMode: 'DEMO',
    eventHash: 'fx-evt-hash-005',
  },
  {
    eventId: 'fx-event-006',
    eventType: 'FX_CONVERSION_APPROVED',
    conversionId: 'fx-conv-002',
    portfolioId: 'portfolio-001',
    fromCurrency: 'AUD',
    toCurrency: 'GBP',
    amount: 75000,
    actor: 'demo-supervisor-001',
    actorType: 'USER',
    timestamp: '2025-12-20T14:34:00Z',
    authorityScope: ['PORTFOLIO_CONTROL', 'DUAL_CONTROL_APPROVE'],
    executionMode: 'DEMO',
    eventHash: 'fx-evt-hash-006',
  },
  {
    eventId: 'fx-event-007',
    eventType: 'FX_CONVERSION_EXECUTED',
    conversionId: 'fx-conv-002',
    portfolioId: 'portfolio-001',
    fromCurrency: 'AUD',
    toCurrency: 'GBP',
    amount: 75000,
    rate: 0.5142,
    rateSource: 'RBA Mid-Market Rate',
    actor: 'demo-supervisor-001',
    actorType: 'USER',
    timestamp: '2025-12-20T14:35:00Z',
    authorityScope: ['PORTFOLIO_CONTROL'],
    executionMode: 'DEMO',
    eventHash: 'fx-evt-hash-007',
  },
];

// =============================================================================
// CRYPTO EVENTS
// =============================================================================

export const DEMO_CRYPTO_EVENTS: CryptoEvent[] = [
  {
    eventId: 'crypto-event-001',
    eventType: 'CRYPTO_EXECUTION_REQUESTED',
    executionId: 'crypto-exec-001',
    portfolioId: 'portfolio-001',
    asset: 'BTC',
    action: 'BUY',
    quantity: 0.5,
    actor: 'demo-user-001',
    actorType: 'USER',
    timestamp: '2025-12-18T10:00:00Z',
    authorityScope: ['PORTFOLIO_CONTROL'],
    executionMode: 'DEMO',
    eventHash: 'crypto-evt-hash-001',
  },
  {
    eventId: 'crypto-event-002',
    eventType: 'CRYPTO_PRICE_QUOTED',
    executionId: 'crypto-exec-001',
    portfolioId: 'portfolio-001',
    asset: 'BTC',
    action: 'BUY',
    quantity: 0.5,
    priceInAud: 152340.00,
    priceSource: 'CoinGecko Aggregated',
    custodian: 'BitGo Custody',
    actor: 'SYSTEM',
    actorType: 'SYSTEM',
    timestamp: '2025-12-18T10:00:05Z',
    authorityScope: [],
    executionMode: 'DEMO',
    eventHash: 'crypto-evt-hash-002',
  },
  {
    eventId: 'crypto-event-003',
    eventType: 'CRYPTO_EXECUTION_PENDING_APPROVAL',
    executionId: 'crypto-exec-001',
    portfolioId: 'portfolio-001',
    asset: 'BTC',
    action: 'BUY',
    quantity: 0.5,
    priceInAud: 152340.00,
    actor: 'SYSTEM',
    actorType: 'SYSTEM',
    timestamp: '2025-12-18T10:00:10Z',
    authorityScope: [],
    executionMode: 'DEMO',
    eventHash: 'crypto-evt-hash-003',
  },
  {
    eventId: 'crypto-event-004',
    eventType: 'CRYPTO_EXECUTION_APPROVED',
    executionId: 'crypto-exec-001',
    portfolioId: 'portfolio-001',
    asset: 'BTC',
    action: 'BUY',
    quantity: 0.5,
    actor: 'demo-supervisor-001',
    actorType: 'USER',
    timestamp: '2025-12-18T10:04:00Z',
    authorityScope: ['PORTFOLIO_CONTROL', 'DUAL_CONTROL_APPROVE'],
    executionMode: 'DEMO',
    eventHash: 'crypto-evt-hash-004',
  },
  {
    eventId: 'crypto-event-005',
    eventType: 'CRYPTO_EXECUTION_COMPLETED',
    executionId: 'crypto-exec-001',
    portfolioId: 'portfolio-001',
    asset: 'BTC',
    action: 'BUY',
    quantity: 0.5,
    priceInAud: 152340.00,
    priceSource: 'CoinGecko Aggregated',
    custodian: 'BitGo Custody',
    actor: 'demo-supervisor-001',
    actorType: 'USER',
    timestamp: '2025-12-18T10:05:00Z',
    authorityScope: ['PORTFOLIO_CONTROL'],
    executionMode: 'DEMO',
    eventHash: 'crypto-evt-hash-005',
  },
  {
    eventId: 'crypto-event-006',
    eventType: 'CRYPTO_EXECUTION_REQUESTED',
    executionId: 'crypto-exec-002',
    portfolioId: 'portfolio-001',
    asset: 'ETH',
    action: 'BUY',
    quantity: 2.0,
    actor: 'demo-user-001',
    actorType: 'USER',
    timestamp: '2025-12-19T11:30:00Z',
    authorityScope: ['PORTFOLIO_CONTROL'],
    executionMode: 'DEMO',
    eventHash: 'crypto-evt-hash-006',
  },
  {
    eventId: 'crypto-event-007',
    eventType: 'CRYPTO_EXECUTION_COMPLETED',
    executionId: 'crypto-exec-002',
    portfolioId: 'portfolio-001',
    asset: 'ETH',
    action: 'BUY',
    quantity: 2.0,
    priceInAud: 5890.00,
    priceSource: 'CoinGecko Aggregated',
    custodian: 'BitGo Custody',
    actor: 'demo-user-001',
    actorType: 'USER',
    timestamp: '2025-12-19T11:32:00Z',
    authorityScope: ['PORTFOLIO_CONTROL'],
    executionMode: 'DEMO',
    eventHash: 'crypto-evt-hash-007',
  },
];

// =============================================================================
// FX EXECUTION PROOFS
// =============================================================================

export const DEMO_FX_PROOFS: FxExecutionProof[] = [
  {
    conversionId: 'fx-conv-001',
    fromCurrency: 'AUD',
    toCurrency: 'USD',
    fromAmount: 10000,
    toAmount: 6523,
    rate: 0.6523,
    rateSource: 'RBA Mid-Market Rate',
    timestamps: {
      requested: '2025-12-15T09:00:00Z',
      quoted: '2025-12-15T09:00:05Z',
      executed: '2025-12-15T09:00:10Z',
    },
    actor: 'demo-user-001',
    authorityScope: ['PORTFOLIO_CONTROL'],
    executionMode: 'DEMO',
    portfolioStateHashBefore: 'state-hash-pre-fx-001',
    portfolioStateHashAfter: 'fx-state-hash-001',
  },
  {
    conversionId: 'fx-conv-002',
    fromCurrency: 'AUD',
    toCurrency: 'GBP',
    fromAmount: 75000,
    toAmount: 38565,
    rate: 0.5142,
    rateSource: 'RBA Mid-Market Rate',
    timestamps: {
      requested: '2025-12-20T14:30:00Z',
      quoted: '2025-12-20T14:30:05Z',
      executed: '2025-12-20T14:35:00Z',
    },
    actor: 'demo-supervisor-001',
    authorityScope: ['PORTFOLIO_CONTROL'],
    executionMode: 'DEMO',
    portfolioStateHashBefore: 'state-hash-pre-fx-002',
    portfolioStateHashAfter: 'fx-state-hash-002',
  },
];

// =============================================================================
// CRYPTO EXECUTION PROOFS
// =============================================================================

export const DEMO_CRYPTO_PROOFS: CryptoExecutionProof[] = [
  {
    executionId: 'crypto-exec-001',
    asset: 'BTC',
    action: 'BUY',
    quantity: 0.5,
    priceInAud: 152340.00,
    priceSource: 'CoinGecko Aggregated',
    custodian: 'BitGo Custody',
    executionResult: 'SUCCESS',
    timestamps: {
      requested: '2025-12-18T10:00:00Z',
      quoted: '2025-12-18T10:00:05Z',
      executed: '2025-12-18T10:05:00Z',
    },
    actor: 'demo-supervisor-001',
    authorityScope: ['PORTFOLIO_CONTROL'],
    executionMode: 'DEMO',
    portfolioStateHashBefore: 'state-hash-pre-crypto-001',
    portfolioStateHashAfter: 'crypto-state-hash-001',
  },
  {
    executionId: 'crypto-exec-002',
    asset: 'ETH',
    action: 'BUY',
    quantity: 2.0,
    priceInAud: 5890.00,
    priceSource: 'CoinGecko Aggregated',
    custodian: 'BitGo Custody',
    executionResult: 'SUCCESS',
    timestamps: {
      requested: '2025-12-19T11:30:00Z',
      quoted: '2025-12-19T11:30:05Z',
      executed: '2025-12-19T11:32:00Z',
    },
    actor: 'demo-user-001',
    authorityScope: ['PORTFOLIO_CONTROL'],
    executionMode: 'DEMO',
    portfolioStateHashBefore: 'state-hash-pre-crypto-002',
    portfolioStateHashAfter: 'crypto-state-hash-002',
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function generateFxQuote(
  fromCurrency: FiatCurrency,
  toCurrency: FiatCurrency,
  amount: number
): FxRateQuote {
  const rate = getDemoFxRate(fromCurrency, toCurrency);
  const now = new Date();
  const validUntil = new Date(now.getTime() + 30000); // 30 seconds

  return {
    quoteId: `fx-quote-${Date.now()}`,
    fromCurrency,
    toCurrency,
    fromAmount: amount,
    toAmount: Math.round(amount * rate * 100) / 100,
    rate,
    rateSource: 'RBA Mid-Market Rate',
    quotedAt: now.toISOString(),
    validUntil: validUntil.toISOString(),
  };
}

export function generateCryptoQuote(
  asset: CryptoAsset,
  quantity: number
): CryptoPriceQuote {
  const priceInAud = getDemoCryptoPrice(asset);
  const now = new Date();
  const validUntil = new Date(now.getTime() + 30000); // 30 seconds

  return {
    quoteId: `crypto-quote-${Date.now()}`,
    asset,
    quantity,
    priceInAud,
    totalValueAud: Math.round(quantity * priceInAud * 100) / 100,
    priceSource: 'CoinGecko Aggregated',
    custodian: 'BitGo Custody',
    quotedAt: now.toISOString(),
    validUntil: validUntil.toISOString(),
  };
}
