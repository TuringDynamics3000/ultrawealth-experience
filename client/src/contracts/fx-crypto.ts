/**
 * FX and Crypto Contracts
 * 
 * Aligned with TuringCore-v3 multi_currency domain.
 * FX = fiat-to-fiat conversion workflow
 * Crypto = custody-based asset execution (not FX, not cash)
 * 
 * All actions are explicit, authority-gated, event-sourced, and provable.
 */

// =============================================================================
// CANONICAL MODEL
// =============================================================================

/** Base currency for all valuations */
export const BASE_CURRENCY = 'AUD' as const;

/** Supported fiat currencies */
export const SUPPORTED_FIAT_CURRENCIES = ['AUD', 'USD', 'GBP', 'EUR'] as const;
export type FiatCurrency = typeof SUPPORTED_FIAT_CURRENCIES[number];

/** Supported crypto assets */
export const SUPPORTED_CRYPTO_ASSETS = ['BTC', 'ETH'] as const;
export type CryptoAsset = typeof SUPPORTED_CRYPTO_ASSETS[number];

/** Asset types */
export type AssetType = 'FIAT' | 'SECURITY' | 'CRYPTO';

// =============================================================================
// FX CONVERSION TYPES
// =============================================================================

/** FX conversion request command */
export interface FxConversionRequest {
  requestId: string;
  portfolioId: string;
  fromCurrency: FiatCurrency;
  toCurrency: FiatCurrency;
  amount: number;
  requestedBy: string;
  requestedAt: string;
  reason?: string;
}

/** FX rate quote */
export interface FxRateQuote {
  quoteId: string;
  fromCurrency: FiatCurrency;
  toCurrency: FiatCurrency;
  fromAmount: number;
  toAmount: number;
  rate: number;
  rateSource: string;
  quotedAt: string;
  validUntil: string;
}

/** FX conversion execution result */
export interface FxConversionResult {
  conversionId: string;
  requestId: string;
  fromCurrency: FiatCurrency;
  toCurrency: FiatCurrency;
  fromAmount: number;
  toAmount: number;
  rate: number;
  rateSource: string;
  executedAt: string;
  executedBy: string;
  authorityScope: string[];
  executionMode: 'DEMO' | 'LIVE';
  portfolioStateHash: string;
}

/** FX conversion status */
export type FxConversionStatus = 
  | 'REQUESTED'
  | 'QUOTED'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'EXECUTED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'FAILED';

/** FX conversion record (full lifecycle) */
export interface FxConversionRecord {
  conversionId: string;
  portfolioId: string;
  fromCurrency: FiatCurrency;
  toCurrency: FiatCurrency;
  fromAmount: number;
  toAmount?: number;
  rate?: number;
  rateSource?: string;
  status: FxConversionStatus;
  requestedBy: string;
  requestedAt: string;
  quotedAt?: string;
  executedAt?: string;
  executedBy?: string;
  reason?: string;
  dualControlRequired: boolean;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  authorityScope: string[];
  executionMode: 'DEMO' | 'LIVE';
  portfolioStateHash?: string;
}

// =============================================================================
// CRYPTO EXECUTION TYPES
// =============================================================================

/** Crypto execution action */
export type CryptoAction = 'BUY' | 'SELL' | 'TRANSFER';

/** Crypto execution request command */
export interface CryptoExecutionRequest {
  requestId: string;
  portfolioId: string;
  asset: CryptoAsset;
  action: CryptoAction;
  quantity: number;
  requestedBy: string;
  requestedAt: string;
  reason?: string;
  destinationWallet?: string; // For TRANSFER action
}

/** Crypto price quote */
export interface CryptoPriceQuote {
  quoteId: string;
  asset: CryptoAsset;
  quantity: number;
  priceInAud: number;
  totalValueAud: number;
  priceSource: string;
  custodian: string;
  quotedAt: string;
  validUntil: string;
}

/** Crypto execution result */
export interface CryptoExecutionResult {
  executionId: string;
  requestId: string;
  asset: CryptoAsset;
  action: CryptoAction;
  quantity: number;
  priceInAud: number;
  totalValueAud: number;
  priceSource: string;
  custodian: string;
  walletReference: string; // Masked for security
  executedAt: string;
  executedBy: string;
  authorityScope: string[];
  executionMode: 'DEMO' | 'LIVE';
  portfolioStateHash: string;
}

/** Crypto execution status */
export type CryptoExecutionStatus = 
  | 'REQUESTED'
  | 'QUOTED'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'EXECUTING'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'FAILED';

/** Crypto execution record (full lifecycle) */
export interface CryptoExecutionRecord {
  executionId: string;
  portfolioId: string;
  asset: CryptoAsset;
  action: CryptoAction;
  quantity: number;
  priceInAud?: number;
  totalValueAud?: number;
  priceSource?: string;
  custodian?: string;
  walletReference?: string;
  status: CryptoExecutionStatus;
  requestedBy: string;
  requestedAt: string;
  quotedAt?: string;
  executedAt?: string;
  executedBy?: string;
  reason?: string;
  dualControlRequired: boolean;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  authorityScope: string[];
  executionMode: 'DEMO' | 'LIVE';
  portfolioStateHash?: string;
}

// =============================================================================
// CRYPTO HOLDING TYPES
// =============================================================================

/** Crypto holding in portfolio */
export interface CryptoHolding {
  asset: CryptoAsset;
  quantity: number;
  costBasisAud: number;
  currentPriceAud: number;
  currentValueAud: number;
  unrealizedGainLossAud: number;
  custodian: string;
  walletReference: string; // Masked
  lastPriceUpdate: string;
  priceSource: string;
}

// =============================================================================
// FX EVENT TYPES (for Activity timeline)
// =============================================================================

export type FxEventType = 
  | 'FX_CONVERSION_REQUESTED'
  | 'FX_RATE_QUOTED'
  | 'FX_CONVERSION_PENDING_APPROVAL'
  | 'FX_CONVERSION_APPROVED'
  | 'FX_CONVERSION_REJECTED'
  | 'FX_CONVERSION_EXECUTED'
  | 'FX_CONVERSION_FAILED'
  | 'FX_CONVERSION_CANCELLED';

export interface FxEvent {
  eventId: string;
  eventType: FxEventType;
  conversionId: string;
  portfolioId: string;
  fromCurrency: FiatCurrency;
  toCurrency: FiatCurrency;
  amount: number;
  rate?: number;
  rateSource?: string;
  actor: string;
  actorType: 'USER' | 'SYSTEM' | 'AGENT';
  timestamp: string;
  authorityScope: string[];
  executionMode: 'DEMO' | 'LIVE';
  eventHash: string;
}

// =============================================================================
// CRYPTO EVENT TYPES (for Activity timeline)
// =============================================================================

export type CryptoEventType = 
  | 'CRYPTO_EXECUTION_REQUESTED'
  | 'CRYPTO_PRICE_QUOTED'
  | 'CRYPTO_EXECUTION_PENDING_APPROVAL'
  | 'CRYPTO_EXECUTION_APPROVED'
  | 'CRYPTO_EXECUTION_REJECTED'
  | 'CRYPTO_EXECUTION_COMPLETED'
  | 'CRYPTO_EXECUTION_FAILED'
  | 'CRYPTO_EXECUTION_CANCELLED';

export interface CryptoEvent {
  eventId: string;
  eventType: CryptoEventType;
  executionId: string;
  portfolioId: string;
  asset: CryptoAsset;
  action: CryptoAction;
  quantity: number;
  priceInAud?: number;
  priceSource?: string;
  custodian?: string;
  actor: string;
  actorType: 'USER' | 'SYSTEM' | 'AGENT';
  timestamp: string;
  authorityScope: string[];
  executionMode: 'DEMO' | 'LIVE';
  eventHash: string;
}

// =============================================================================
// SYSTEM PROOF TYPES
// =============================================================================

/** Currency configuration for System Proof */
export interface CurrencyConfiguration {
  baseCurrency: FiatCurrency;
  supportedFiatCurrencies: FiatCurrency[];
  supportedCryptoAssets: CryptoAsset[];
  valuationMode: 'EXPLICIT_FX_AND_PRICE_EVENTS_ONLY';
}

/** FX execution proof for System Proof */
export interface FxExecutionProof {
  conversionId: string;
  fromCurrency: FiatCurrency;
  toCurrency: FiatCurrency;
  fromAmount: number;
  toAmount: number;
  rate: number;
  rateSource: string;
  timestamps: {
    requested: string;
    quoted: string;
    executed: string;
  };
  actor: string;
  authorityScope: string[];
  executionMode: 'DEMO' | 'LIVE';
  portfolioStateHashBefore: string;
  portfolioStateHashAfter: string;
}

/** Crypto custody and execution proof for System Proof */
export interface CryptoExecutionProof {
  executionId: string;
  asset: CryptoAsset;
  action: CryptoAction;
  quantity: number;
  priceInAud: number;
  priceSource: string;
  custodian: string;
  executionResult: 'SUCCESS' | 'FAILED';
  timestamps: {
    requested: string;
    quoted: string;
    executed: string;
  };
  actor: string;
  authorityScope: string[];
  executionMode: 'DEMO' | 'LIVE';
  portfolioStateHashBefore: string;
  portfolioStateHashAfter: string;
}

/** Integrity statements for System Proof */
export interface IntegrityStatements {
  noImplicitConversion: string;
  explicitExecutionOnly: string;
  fullProvenance: string;
  cryptoNotCash: string;
  fxNotCrypto: string;
}

// =============================================================================
// DUAL-CONTROL THRESHOLDS
// =============================================================================

/** Thresholds for dual-control approval */
export const FX_DUAL_CONTROL_THRESHOLD_AUD = 50000;
export const CRYPTO_DUAL_CONTROL_THRESHOLD_AUD = 25000;

/** Check if FX conversion requires dual control */
export function fxRequiresDualControl(amountAud: number): boolean {
  return amountAud >= FX_DUAL_CONTROL_THRESHOLD_AUD;
}

/** Check if crypto execution requires dual control */
export function cryptoRequiresDualControl(valueAud: number): boolean {
  return valueAud >= CRYPTO_DUAL_CONTROL_THRESHOLD_AUD;
}
