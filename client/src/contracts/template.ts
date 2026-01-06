/**
 * Portfolio Template Contract Types
 * 
 * Templates are neutral, versioned starting configurations.
 * Users explicitly choose templates; the system never recommends.
 * 
 * HARD CONSTRAINTS:
 * - Templates are read-only and immutable
 * - No advice, recommendations, or nudging
 * - No rankings, popularity, or suggested templates
 * - Full transparency: templateId, version, hash visible
 */

// =============================================================================
// TEMPLATE TYPES
// =============================================================================

/**
 * Portfolio Template - a neutral, versioned starting configuration.
 * 
 * RULES:
 * - Templates are immutable once published
 * - Version is semantic (major.minor.patch)
 * - Description must be factual, non-advisory
 * - No recommendations or nudging language
 */
export interface PortfolioTemplate {
  /** Unique template identifier */
  readonly templateId: string;
  /** Semantic version (e.g., "1.0.0") */
  readonly version: string;
  /** Neutral name (no marketing language) */
  readonly name: string;
  /** Factual description (no advice or recommendations) */
  readonly description: string;
  /** Goal account structure defined by this template */
  readonly goalAccountStructure: readonly TemplateGoalAccount[];
  /** Required disclosures for this template */
  readonly disclosures: readonly TemplateDisclosure[];
  /** Cryptographic hash of template content */
  readonly templateHash: string;
  /** When this version was published */
  readonly publishedAt: string;
  /** Template status */
  readonly status: TemplateStatus;
  /** Jurisdiction this template is designed for */
  readonly jurisdiction: string;
}

/**
 * Goal Account structure within a template.
 * Defines the initial configuration, not recommendations.
 */
export interface TemplateGoalAccount {
  /** Identifier within the template */
  readonly accountKey: string;
  /** Neutral name */
  readonly name: string;
  /** Account type */
  readonly type: TemplateGoalAccountType;
  /** Risk profile (factual, not recommended) */
  readonly riskProfile: RiskProfile;
  /** Initial allocation percentages */
  readonly targetAllocation: readonly AllocationTarget[];
  /** Factual description */
  readonly description: string;
}

export type TemplateGoalAccountType = 
  | 'RETIREMENT'
  | 'SAVINGS'
  | 'HOME'
  | 'EDUCATION'
  | 'GENERAL';

export type RiskProfile = 
  | 'CONSERVATIVE'
  | 'BALANCED'
  | 'GROWTH'
  | 'AGGRESSIVE';

export interface AllocationTarget {
  /** Asset class */
  readonly assetClass: string;
  /** Target percentage (0-100) */
  readonly targetPercent: number;
}

/**
 * Disclosure required for template usage.
 */
export interface TemplateDisclosure {
  /** Disclosure identifier */
  readonly disclosureId: string;
  /** Disclosure type */
  readonly type: DisclosureType;
  /** Title */
  readonly title: string;
  /** Full disclosure text */
  readonly content: string;
  /** Whether acknowledgment is required */
  readonly requiresAcknowledgment: boolean;
}

export type DisclosureType = 
  | 'RISK_WARNING'
  | 'FEE_DISCLOSURE'
  | 'REGULATORY'
  | 'PRODUCT_INFORMATION'
  | 'GENERAL';

export type TemplateStatus = 'DRAFT' | 'PUBLISHED' | 'DEPRECATED';

// =============================================================================
// TEMPLATE INDEX
// =============================================================================

/**
 * List of available templates.
 * No ranking, no recommendations, no popularity metrics.
 */
export interface TemplateIndex {
  /** Available templates (unordered - UI must not imply preference) */
  readonly templates: readonly PortfolioTemplateSummary[];
  /** Total count */
  readonly totalCount: number;
}

/**
 * Summary view of a template for listing.
 */
export interface PortfolioTemplateSummary {
  readonly templateId: string;
  readonly version: string;
  readonly name: string;
  readonly description: string;
  readonly goalAccountCount: number;
  readonly jurisdiction: string;
  readonly status: TemplateStatus;
  readonly templateHash: string;
}

// =============================================================================
// TEMPLATE INSTANTIATION
// =============================================================================

/**
 * Parameters for creating a portfolio from a template.
 * This is an explicit user choice, not a recommendation.
 */
export interface CreatePortfolioFromTemplateParams {
  /** Client who will own the portfolio */
  readonly clientId: string;
  /** Template to use */
  readonly templateId: string;
  /** Specific version of the template */
  readonly templateVersion: string;
  /** Acknowledgment that disclosures were viewed */
  readonly disclosuresAcknowledged: boolean;
  /** Timestamp of acknowledgment */
  readonly acknowledgedAt: string;
}

/**
 * Result of portfolio instantiation.
 */
export interface CreatePortfolioFromTemplateResult {
  /** Created portfolio ID */
  readonly portfolioId: string;
  /** Template that was used */
  readonly templateId: string;
  /** Template version that was used */
  readonly templateVersion: string;
  /** Template hash at time of instantiation */
  readonly templateHash: string;
  /** Created goal account IDs */
  readonly goalAccountIds: readonly string[];
  /** Event ID for the instantiation */
  readonly eventId: string;
  /** Hash of the resulting portfolio state */
  readonly portfolioStateHash: string;
}

// =============================================================================
// TEMPLATE EVENTS (for Activity timeline)
// =============================================================================

export type TemplateEventType = 
  | 'TEMPLATE_VIEWED'
  | 'TEMPLATE_SELECTED'
  | 'DISCLOSURES_ACKNOWLEDGED'
  | 'PORTFOLIO_INSTANTIATED_FROM_TEMPLATE';

export interface TemplateEvent {
  readonly eventId: string;
  readonly eventType: TemplateEventType;
  readonly occurredAt: string;
  readonly actor: {
    readonly actorType: string;
    readonly actorId: string;
  };
  readonly templateId: string;
  readonly templateVersion: string;
  readonly templateHash: string;
  readonly portfolioId?: string;
  readonly portfolioStateHash?: string;
  readonly hash: string;
}

// =============================================================================
// PAGE PROPS
// =============================================================================

export interface TemplatesPageProps {
  readonly templates: TemplateIndex;
}

export interface TemplatePreviewPageProps {
  readonly template: PortfolioTemplate;
}
