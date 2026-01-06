/**
 * Onboarding Contract Types
 * 
 * Aligned with TuringCore-v3 onboarding_v2 domain.
 * UltraWealth consolidates visibility, not authority.
 * 
 * RULES:
 * - Reuse existing onboarding_v2 fields
 * - No advice, recommendations, or suitability
 * - Explicit legal entity declaration
 * - Full event provenance
 */

// =============================================================================
// LEGAL ENTITY TYPES
// =============================================================================

/**
 * Supported legal entity types for onboarding.
 * Aligned with onboarding_v2 customer_type validation.
 */
export type LegalEntityType = 'INDIVIDUAL' | 'COMPANY' | 'TRUST' | 'SMSF';

/**
 * Jurisdiction codes supported by onboarding_v2.
 */
export type Jurisdiction = 'AU' | 'NZ' | 'UK' | 'US';

/**
 * Onboarding case status.
 */
export type OnboardingStatus =
  | 'DRAFT'
  | 'IN_PROGRESS'
  | 'PENDING_VERIFICATION'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'ABANDONED'
  | 'FINALISED';

// =============================================================================
// NATURAL PERSON
// =============================================================================

/**
 * Natural person type - used for individuals, directors, trustees, members.
 * Aligned with onboarding_v2 personal_info structure.
 */
export interface NaturalPerson {
  readonly personId: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly dateOfBirth: string; // ISO 8601 date
  readonly email: string;
  readonly phone?: string;
  readonly address?: Address;
  readonly taxResidency?: string; // Country code
  readonly tfn?: string; // Tax File Number (AU)
}

export interface Address {
  readonly streetAddress: string;
  readonly suburb: string;
  readonly state: string;
  readonly postcode: string;
  readonly country: string;
}

// =============================================================================
// RELATIONSHIP ROLES
// =============================================================================

/**
 * Relationship roles for control graph.
 * Aligned with onboarding_v2 relationship model.
 */
export type RelationshipRole =
  | 'DIRECTOR'
  | 'TRUSTEE'
  | 'MEMBER'
  | 'BENEFICIAL_OWNER'
  | 'AUTHORISED_REP'
  | 'APPOINTER'
  | 'SETTLOR';

/**
 * Relationship between a person and the legal entity.
 */
export interface OnboardingRelationship {
  readonly relationshipId: string;
  readonly personId: string;
  readonly role: RelationshipRole;
  readonly ownershipPercent?: number; // Only for BENEFICIAL_OWNER
  readonly votingPercent?: number;
  readonly appointedAt?: string; // ISO 8601 timestamp
  readonly isControllingPerson: boolean;
}

// =============================================================================
// TRUSTEE MODEL
// =============================================================================

/**
 * Trustee model for Trusts and SMSFs.
 */
export type TrusteeModel = 'INDIVIDUAL_TRUSTEES' | 'CORPORATE_TRUSTEE';

/**
 * Corporate trustee details (when trustee model is CORPORATE_TRUSTEE).
 */
export interface CorporateTrustee {
  readonly companyName: string;
  readonly abn: string;
  readonly acn?: string;
  readonly registeredAddress: Address;
}

// =============================================================================
// ENTITY-SPECIFIC STRUCTURES
// =============================================================================

/**
 * Individual entity structure.
 */
export interface IndividualEntity {
  readonly entityType: 'INDIVIDUAL';
  readonly primaryPerson: NaturalPerson;
}

/**
 * Company entity structure.
 */
export interface CompanyEntity {
  readonly entityType: 'COMPANY';
  readonly companyName: string;
  readonly abn: string;
  readonly acn?: string;
  readonly registeredAddress: Address;
  readonly directors: NaturalPerson[];
  readonly beneficialOwners: NaturalPerson[];
  readonly authorisedRepresentative?: NaturalPerson;
}

/**
 * Trust entity structure.
 */
export interface TrustEntity {
  readonly entityType: 'TRUST';
  readonly trustName: string;
  readonly abn: string;
  readonly trustType: string; // Discretionary, Unit, Hybrid, etc.
  readonly trusteeModel: TrusteeModel;
  readonly corporateTrustee?: CorporateTrustee;
  readonly individualTrustees?: NaturalPerson[];
  readonly appointer?: NaturalPerson;
  readonly settlor?: NaturalPerson;
  readonly authorisedRepresentative?: NaturalPerson;
}

/**
 * SMSF entity structure.
 */
export interface SMSFEntity {
  readonly entityType: 'SMSF';
  readonly fundName: string;
  readonly abn: string;
  readonly trusteeModel: TrusteeModel;
  readonly corporateTrustee?: CorporateTrustee;
  readonly individualTrustees?: NaturalPerson[];
  readonly members: NaturalPerson[];
  readonly authorisedRepresentative?: NaturalPerson;
}

/**
 * Union type for all entity structures.
 */
export type LegalEntity = IndividualEntity | CompanyEntity | TrustEntity | SMSFEntity;

// =============================================================================
// ONBOARDING CASE
// =============================================================================

/**
 * Onboarding case representing the full onboarding state.
 * Aligned with onboarding_v2 application model.
 */
export interface OnboardingCase {
  readonly caseId: string;
  readonly tenantId: string;
  readonly legalEntityType: LegalEntityType;
  readonly jurisdiction: Jurisdiction;
  readonly status: OnboardingStatus;
  readonly createdAt: string; // ISO 8601 timestamp
  readonly updatedAt: string;
  readonly entity?: LegalEntity;
  readonly persons: NaturalPerson[];
  readonly relationships: OnboardingRelationship[];
  readonly confirmations: OnboardingConfirmation[];
  readonly caseHash: string;
}

/**
 * Confirmation record for explicit acknowledgments.
 */
export interface OnboardingConfirmation {
  readonly confirmationId: string;
  readonly type: 'INFORMATION_CORRECT' | 'TERMS_ACCEPTED' | 'DISCLOSURE_ACKNOWLEDGED';
  readonly confirmedAt: string;
  readonly confirmedBy: string; // Person ID or actor ID
}

// =============================================================================
// ONBOARDING EVENTS
// =============================================================================

/**
 * Onboarding event types aligned with onboarding_v2/events.py.
 */
export type OnboardingEventType =
  // Case lifecycle
  | 'ONBOARDING_CASE_CREATED'
  | 'LEGAL_ENTITY_DECLARED'
  | 'PERSON_ADDED'
  | 'RELATIONSHIP_ADDED'
  | 'CONFIRMATION_RECORDED'
  | 'ONBOARDING_FINALISED'
  // Verification (from onboarding_v2)
  | 'IDENTITY_VERIFICATION_STARTED'
  | 'IDENTITY_VERIFICATION_COMPLETED'
  | 'IDENTITY_VERIFICATION_FAILED'
  | 'BUSINESS_VERIFICATION_STARTED'
  | 'BUSINESS_VERIFICATION_COMPLETED'
  | 'BUSINESS_VERIFICATION_FAILED'
  // Outcome
  | 'CLIENT_CREATED'
  | 'PORTFOLIO_CREATED'
  | 'PORTFOLIO_CREATED_FROM_TEMPLATE';

/**
 * Onboarding event structure.
 */
export interface OnboardingEvent {
  readonly eventId: string;
  readonly eventType: OnboardingEventType;
  readonly eventVersion: number;
  readonly occurredAt: string;
  readonly actor: OnboardingActor;
  readonly tenantId: string;
  readonly caseId: string;
  readonly payload: Record<string, unknown>;
  readonly hash: string;
}

export interface OnboardingActor {
  readonly actorType: 'CLIENT' | 'SYSTEM' | 'OPERATOR';
  readonly actorId: string;
  readonly sessionId?: string;
}

// =============================================================================
// API REQUEST/RESPONSE TYPES
// =============================================================================

/**
 * Request to start onboarding.
 */
export interface StartOnboardingRequest {
  readonly legalEntityType: LegalEntityType;
  readonly jurisdiction: Jurisdiction;
  readonly workflowTemplateId?: string;
}

/**
 * Response from starting onboarding.
 */
export interface StartOnboardingResponse {
  readonly caseId: string;
  readonly status: OnboardingStatus;
}

/**
 * Request to add a person to the case.
 */
export interface AddPersonRequest {
  readonly caseId: string;
  readonly person: Omit<NaturalPerson, 'personId'>;
}

/**
 * Request to add a relationship.
 */
export interface AddRelationshipRequest {
  readonly caseId: string;
  readonly personId: string;
  readonly role: RelationshipRole;
  readonly ownershipPercent?: number;
  readonly votingPercent?: number;
  readonly isControllingPerson: boolean;
}

/**
 * Request to finalise onboarding.
 */
export interface FinaliseOnboardingRequest {
  readonly caseId: string;
  readonly confirmations: Array<{
    type: OnboardingConfirmation['type'];
  }>;
  readonly templateId?: string; // Optional: create portfolio from template
  readonly templateVersion?: string;
}

/**
 * Response from finalising onboarding.
 */
export interface FinaliseOnboardingResponse {
  readonly caseId: string;
  readonly clientId: string;
  readonly portfolioId: string;
  readonly status: 'FINALISED';
  readonly portfolioStateHash: string;
}

// =============================================================================
// ONBOARDING SUMMARY (for System Proof)
// =============================================================================

/**
 * Summary of onboarding for System Proof display.
 */
export interface OnboardingSummary {
  readonly caseId: string;
  readonly legalEntityType: LegalEntityType;
  readonly jurisdiction: Jurisdiction;
  readonly entityName: string;
  readonly controllingPersonsCount: number;
  readonly controllingPersonRoles: RelationshipRole[];
  readonly authorisedRepresentative?: {
    readonly name: string;
    readonly personId: string;
  };
  readonly finalisedAt?: string;
  readonly finalisedBy?: string;
  readonly resultingClientId?: string;
  readonly resultingPortfolioId?: string;
  readonly portfolioStateHash?: string;
}
