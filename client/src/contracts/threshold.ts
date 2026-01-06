/**
 * Threshold Configuration Contracts
 * 
 * Defines dual-control thresholds for FX and Crypto transactions.
 * Thresholds determine when transactions require two-person approval.
 * 
 * All threshold changes are logged with actor and timestamp for audit trail.
 */

// Authority type for threshold context (string-based for audit trail)
export type Authority = 
  | 'PORTFOLIO_VIEW'
  | 'PORTFOLIO_CONTROL'
  | 'SYSTEM_ADMIN'
  | 'COMPLIANCE_READ'
  | 'COMPLIANCE_WRITE'
  | 'DUAL_CONTROL_APPROVER';

/**
 * Categories of transactions that can have dual-control thresholds
 */
export type ThresholdCategory = 
  | 'FX_CONVERSION'
  | 'CRYPTO_BUY'
  | 'CRYPTO_SELL'
  | 'CRYPTO_TRANSFER';

/**
 * Supported currencies for FX thresholds
 */
export type FxCurrency = 'AUD' | 'USD' | 'GBP' | 'EUR';

// Import CryptoAsset from fx-crypto to avoid duplicate exports
import type { CryptoAsset } from './fx-crypto';
export type { CryptoAsset as ThresholdCryptoAsset };

/**
 * Threshold configuration for a specific category and currency/asset
 */
export interface ThresholdConfig {
  /** Unique identifier for this threshold configuration */
  thresholdId: string;
  
  /** Category of transaction this threshold applies to */
  category: ThresholdCategory;
  
  /** Currency (for FX) or asset (for Crypto) this threshold applies to */
  currencyOrAsset: FxCurrency | CryptoAsset;
  
  /** Amount above which dual-control is required */
  amount: number;
  
  /** Unit for the amount (currency code or asset symbol) */
  unit: string;
  
  /** When this threshold became effective */
  effectiveFrom: number;
  
  /** User who set this threshold */
  setBy: string;
  
  /** Timestamp when threshold was set */
  setAt: number;
  
  /** Whether this threshold is currently active */
  isActive: boolean;
}

/**
 * Request to set a new threshold
 */
export interface SetThresholdRequest {
  category: ThresholdCategory;
  currencyOrAsset: FxCurrency | CryptoAsset;
  amount: number;
}

/**
 * Response from setting a threshold
 */
export interface SetThresholdResponse {
  thresholdId: string;
  previousAmount: number | null;
  newAmount: number;
  effectiveFrom: number;
  eventId: string;
}

/**
 * Status of a threshold change request
 */
export type ThresholdChangeStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

/**
 * Threshold change request for dual-control approval workflow
 */
export interface ThresholdChangeRequest {
  requestId: string;
  category: ThresholdCategory;
  currencyOrAsset: FxCurrency | CryptoAsset;
  currentAmount: number;
  newAmount: number;
  magnitudePercent: number; // Percentage change from current
  requiresApproval: boolean; // True if magnitude exceeds limit
  requestedBy: string;
  requestedAt: number;
  status: ThresholdChangeStatus;
  approvedBy: string | null;
  approvedAt: number | null;
  rejectedBy: string | null;
  rejectedAt: number | null;
  rejectionReason: string | null;
  expiresAt: number;
}

/**
 * Magnitude limit for threshold changes requiring approval (25%)
 */
export const THRESHOLD_CHANGE_MAGNITUDE_LIMIT = 25;

/**
 * Expiry time for threshold change requests (24 hours)
 */
export const THRESHOLD_CHANGE_REQUEST_EXPIRY_MS = 24 * 60 * 60 * 1000;

/**
 * Threshold change event for audit trail
 */
export interface ThresholdChangeEvent {
  eventId: string;
  eventType: 'THRESHOLD_CHANGED' | 'THRESHOLD_CHANGE_REQUESTED' | 'THRESHOLD_CHANGE_APPROVED' | 'THRESHOLD_CHANGE_REJECTED';
  thresholdId: string;
  requestId?: string; // For approval workflow events
  category: ThresholdCategory;
  currencyOrAsset: FxCurrency | CryptoAsset;
  previousAmount: number | null;
  newAmount: number;
  magnitudePercent?: number;
  actor: string;
  actorAuthorities: Authority[];
  timestamp: number;
  executionMode: 'DEMO' | 'LIVE';
  rejectionReason?: string;
}

/**
 * Threshold history entry
 */
export interface ThresholdHistoryEntry {
  thresholdId: string;
  category: ThresholdCategory;
  currencyOrAsset: FxCurrency | CryptoAsset;
  amount: number;
  setBy: string;
  setAt: number;
  supersededAt: number | null;
  eventId: string;
}

/**
 * Default threshold values (used when no threshold is configured)
 * These are intentionally conservative to ensure dual-control by default
 */
export const DEFAULT_THRESHOLDS: Record<ThresholdCategory, number> = {
  FX_CONVERSION: 10000,      // AUD 10,000
  CRYPTO_BUY: 5000,          // AUD 5,000 equivalent
  CRYPTO_SELL: 5000,         // AUD 5,000 equivalent
  CRYPTO_TRANSFER: 2500,     // AUD 2,500 equivalent
};

/**
 * Category display names
 */
export const THRESHOLD_CATEGORY_LABELS: Record<ThresholdCategory, string> = {
  FX_CONVERSION: 'FX Conversion',
  CRYPTO_BUY: 'Crypto Buy',
  CRYPTO_SELL: 'Crypto Sell',
  CRYPTO_TRANSFER: 'Crypto Transfer',
};

/**
 * Category descriptions
 */
export const THRESHOLD_CATEGORY_DESCRIPTIONS: Record<ThresholdCategory, string> = {
  FX_CONVERSION: 'Fiat-to-fiat currency conversion transactions',
  CRYPTO_BUY: 'Cryptocurrency purchase transactions',
  CRYPTO_SELL: 'Cryptocurrency sale transactions',
  CRYPTO_TRANSFER: 'Cryptocurrency transfer between wallets/custodians',
};

/**
 * Check if an amount exceeds the threshold for dual-control
 */
export function requiresDualControl(
  category: ThresholdCategory,
  amountInAud: number,
  thresholds: ThresholdConfig[]
): boolean {
  const threshold = thresholds.find(
    t => t.category === category && t.isActive
  );
  
  const limit = threshold?.amount ?? DEFAULT_THRESHOLDS[category];
  return amountInAud > limit;
}

/**
 * Get the effective threshold for a category, optionally for a specific currency/asset
 */
export function getEffectiveThreshold(
  category: ThresholdCategory,
  thresholds: ThresholdConfig[],
  currencyOrAsset?: string
): number {
  // If currency/asset specified, try to find a specific threshold first
  if (currencyOrAsset) {
    const specificThreshold = thresholds.find(
      t => t.category === category && t.currencyOrAsset === currencyOrAsset && t.isActive
    );
    if (specificThreshold) {
      return specificThreshold.amount;
    }
  }
  
  // Fall back to category default
  const categoryThreshold = thresholds.find(
    t => t.category === category && t.isActive
  );
  
  return categoryThreshold?.amount ?? DEFAULT_THRESHOLDS[category];
}

/**
 * Get the effective threshold for a specific category and currency/asset
 * Matches by currency/asset first, then falls back to category default
 */
export function getEffectiveThresholdForCurrency(
  category: ThresholdCategory,
  currencyOrAsset: FxCurrency | CryptoAsset,
  thresholds: ThresholdConfig[]
): number {
  // First try to find a threshold for this specific currency/asset
  const specificThreshold = thresholds.find(
    t => t.category === category && t.currencyOrAsset === currencyOrAsset && t.isActive
  );
  
  if (specificThreshold) {
    return specificThreshold.amount;
  }
  
  // Fall back to category default (any currency/asset)
  const categoryThreshold = thresholds.find(
    t => t.category === category && t.isActive
  );
  
  return categoryThreshold?.amount ?? DEFAULT_THRESHOLDS[category];
}

/**
 * Calculate the magnitude of a threshold change as a percentage
 */
export function calculateMagnitudePercent(currentAmount: number, newAmount: number): number {
  if (currentAmount === 0) {
    return 100; // Any change from 0 is 100%
  }
  return Math.abs((newAmount - currentAmount) / currentAmount) * 100;
}

/**
 * Check if a threshold change requires approval based on magnitude
 */
export function requiresThresholdApproval(currentAmount: number, newAmount: number): boolean {
  const magnitude = calculateMagnitudePercent(currentAmount, newAmount);
  return magnitude >= THRESHOLD_CHANGE_MAGNITUDE_LIMIT;
}

// =============================================================================
// NOTIFICATION TYPES
// =============================================================================

/**
 * Types of threshold-related notifications
 */
export type ThresholdNotificationType = 
  | 'THRESHOLD_APPROACHING'    // Transaction approaching threshold (e.g., 80%)
  | 'THRESHOLD_EXCEEDED'       // Transaction exceeded threshold
  | 'THRESHOLD_CHANGED'        // Threshold configuration was changed
  | 'THRESHOLD_CHANGE_PENDING' // Threshold change request awaiting approval
  | 'THRESHOLD_CHANGE_APPROVED' // Threshold change request was approved
  | 'THRESHOLD_CHANGE_REJECTED'; // Threshold change request was rejected

/**
 * Threshold notification for compliance
 */
export interface ThresholdNotification {
  notificationId: string;
  type: ThresholdNotificationType;
  category: ThresholdCategory;
  currencyOrAsset: FxCurrency | CryptoAsset;
  threshold: number;
  transactionAmount?: number; // For approaching/exceeded notifications
  percentOfThreshold?: number; // For approaching notifications
  requestId?: string; // For approval workflow notifications
  actor: string;
  timestamp: number;
  isRead: boolean;
  targetRoles: ('SUPERVISOR' | 'COMPLIANCE')[];
}

/**
 * Threshold approaching warning level (80% of threshold)
 */
export const THRESHOLD_APPROACHING_PERCENT = 80;

/**
 * Check if a transaction is approaching the threshold
 */
export function isApproachingThreshold(
  amount: number,
  threshold: number
): { approaching: boolean; percentOfThreshold: number } {
  const percentOfThreshold = (amount / threshold) * 100;
  return {
    approaching: percentOfThreshold >= THRESHOLD_APPROACHING_PERCENT && percentOfThreshold < 100,
    percentOfThreshold
  };
}
