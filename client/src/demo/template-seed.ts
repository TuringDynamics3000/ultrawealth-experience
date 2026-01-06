/**
 * Portfolio Template Seed Data
 * 
 * Neutral, versioned starting configurations.
 * Users explicitly choose templates; the system never recommends.
 * 
 * HARD CONSTRAINTS:
 * - Templates are read-only and immutable
 * - No advice, recommendations, or nudging
 * - No rankings, popularity, or suggested templates
 * - Descriptions must be factual, non-advisory
 */

import type {
  PortfolioTemplate,
  PortfolioTemplateSummary,
  TemplateIndex,
  TemplateGoalAccount,
  TemplateDisclosure,
} from '../contracts/template';

// =============================================================================
// TEMPLATE DISCLOSURES (Required for all templates)
// =============================================================================

const STANDARD_DISCLOSURES: TemplateDisclosure[] = [
  {
    disclosureId: 'disc_risk_001',
    type: 'RISK_WARNING',
    title: 'Investment Risk',
    content: 'The value of investments can go down as well as up. Past performance is not a reliable indicator of future performance. You may receive back less than you invest.',
    requiresAcknowledgment: true,
  },
  {
    disclosureId: 'disc_fee_001',
    type: 'FEE_DISCLOSURE',
    title: 'Fee Structure',
    content: 'Fees are charged as a percentage of assets under management. Additional transaction costs may apply. See the Product Disclosure Statement for full fee details.',
    requiresAcknowledgment: true,
  },
  {
    disclosureId: 'disc_reg_001',
    type: 'REGULATORY',
    title: 'Regulatory Information',
    content: 'This service is provided under Australian Financial Services Licence. The information provided is general in nature and does not take into account your personal circumstances.',
    requiresAcknowledgment: true,
  },
];

// =============================================================================
// TEMPLATE 1: Single Goal - Retirement
// =============================================================================

const TEMPLATE_SINGLE_RETIREMENT: PortfolioTemplate = {
  templateId: 'tpl_single_retirement',
  version: '1.0.0',
  name: 'Single Goal - Retirement',
  description: 'A portfolio structure with one goal account configured for long-term retirement savings. Uses a growth-oriented allocation with Australian and international equities.',
  goalAccountStructure: [
    {
      accountKey: 'retirement',
      name: 'Retirement',
      type: 'RETIREMENT',
      riskProfile: 'GROWTH',
      targetAllocation: [
        { assetClass: 'Australian Shares', targetPercent: 40 },
        { assetClass: 'International Shares', targetPercent: 40 },
        { assetClass: 'Fixed Income', targetPercent: 15 },
        { assetClass: 'Cash', targetPercent: 5 },
      ],
      description: 'Long-term retirement savings with growth-oriented allocation.',
    },
  ],
  disclosures: STANDARD_DISCLOSURES,
  templateHash: 'tpl_h1a2s3h4_single_ret_v1',
  publishedAt: '2025-01-01T00:00:00Z',
  status: 'PUBLISHED',
  jurisdiction: 'AU',
};

// =============================================================================
// TEMPLATE 2: Dual Goal - Retirement + Home
// =============================================================================

const TEMPLATE_DUAL_RET_HOME: PortfolioTemplate = {
  templateId: 'tpl_dual_ret_home',
  version: '1.0.0',
  name: 'Dual Goal - Retirement and Home',
  description: 'A portfolio structure with two goal accounts: one for long-term retirement savings and one for medium-term home deposit savings.',
  goalAccountStructure: [
    {
      accountKey: 'retirement',
      name: 'Retirement',
      type: 'RETIREMENT',
      riskProfile: 'GROWTH',
      targetAllocation: [
        { assetClass: 'Australian Shares', targetPercent: 40 },
        { assetClass: 'International Shares', targetPercent: 40 },
        { assetClass: 'Fixed Income', targetPercent: 15 },
        { assetClass: 'Cash', targetPercent: 5 },
      ],
      description: 'Long-term retirement savings with growth-oriented allocation.',
    },
    {
      accountKey: 'home_deposit',
      name: 'Home Deposit',
      type: 'HOME',
      riskProfile: 'BALANCED',
      targetAllocation: [
        { assetClass: 'Australian Shares', targetPercent: 30 },
        { assetClass: 'International Shares', targetPercent: 20 },
        { assetClass: 'Fixed Income', targetPercent: 35 },
        { assetClass: 'Cash', targetPercent: 15 },
      ],
      description: 'Medium-term savings for home deposit with balanced allocation.',
    },
  ],
  disclosures: STANDARD_DISCLOSURES,
  templateHash: 'tpl_h1a2s3h4_dual_ret_home_v1',
  publishedAt: '2025-01-01T00:00:00Z',
  status: 'PUBLISHED',
  jurisdiction: 'AU',
};

// =============================================================================
// TEMPLATE 3: Triple Goal - Retirement + Home + Emergency
// =============================================================================

const TEMPLATE_TRIPLE: PortfolioTemplate = {
  templateId: 'tpl_triple_standard',
  version: '1.0.0',
  name: 'Triple Goal - Retirement, Home, Emergency',
  description: 'A portfolio structure with three goal accounts covering long-term retirement, medium-term home deposit, and short-term emergency savings.',
  goalAccountStructure: [
    {
      accountKey: 'retirement',
      name: 'Retirement',
      type: 'RETIREMENT',
      riskProfile: 'GROWTH',
      targetAllocation: [
        { assetClass: 'Australian Shares', targetPercent: 40 },
        { assetClass: 'International Shares', targetPercent: 40 },
        { assetClass: 'Fixed Income', targetPercent: 15 },
        { assetClass: 'Cash', targetPercent: 5 },
      ],
      description: 'Long-term retirement savings with growth-oriented allocation.',
    },
    {
      accountKey: 'home_deposit',
      name: 'Home Deposit',
      type: 'HOME',
      riskProfile: 'BALANCED',
      targetAllocation: [
        { assetClass: 'Australian Shares', targetPercent: 30 },
        { assetClass: 'International Shares', targetPercent: 20 },
        { assetClass: 'Fixed Income', targetPercent: 35 },
        { assetClass: 'Cash', targetPercent: 15 },
      ],
      description: 'Medium-term savings for home deposit with balanced allocation.',
    },
    {
      accountKey: 'emergency',
      name: 'Emergency Fund',
      type: 'SAVINGS',
      riskProfile: 'CONSERVATIVE',
      targetAllocation: [
        { assetClass: 'Fixed Income', targetPercent: 40 },
        { assetClass: 'Cash', targetPercent: 60 },
      ],
      description: 'Short-term emergency savings with conservative allocation.',
    },
  ],
  disclosures: STANDARD_DISCLOSURES,
  templateHash: 'tpl_h1a2s3h4_triple_v1',
  publishedAt: '2025-01-01T00:00:00Z',
  status: 'PUBLISHED',
  jurisdiction: 'AU',
};

// =============================================================================
// TEMPLATE 4: Conservative Single Goal
// =============================================================================

const TEMPLATE_CONSERVATIVE: PortfolioTemplate = {
  templateId: 'tpl_conservative_single',
  version: '1.0.0',
  name: 'Single Goal - Conservative',
  description: 'A portfolio structure with one goal account using a conservative allocation focused on capital preservation.',
  goalAccountStructure: [
    {
      accountKey: 'savings',
      name: 'Savings',
      type: 'SAVINGS',
      riskProfile: 'CONSERVATIVE',
      targetAllocation: [
        { assetClass: 'Australian Shares', targetPercent: 15 },
        { assetClass: 'International Shares', targetPercent: 10 },
        { assetClass: 'Fixed Income', targetPercent: 50 },
        { assetClass: 'Cash', targetPercent: 25 },
      ],
      description: 'Conservative allocation focused on capital preservation.',
    },
  ],
  disclosures: STANDARD_DISCLOSURES,
  templateHash: 'tpl_h1a2s3h4_conservative_v1',
  publishedAt: '2025-01-01T00:00:00Z',
  status: 'PUBLISHED',
  jurisdiction: 'AU',
};

// =============================================================================
// TEMPLATE INDEX (No ranking, no recommendations)
// =============================================================================

export const DEMO_TEMPLATES: PortfolioTemplate[] = [
  TEMPLATE_SINGLE_RETIREMENT,
  TEMPLATE_DUAL_RET_HOME,
  TEMPLATE_TRIPLE,
  TEMPLATE_CONSERVATIVE,
];

export const DEMO_TEMPLATE_SUMMARIES: PortfolioTemplateSummary[] = DEMO_TEMPLATES.map(t => ({
  templateId: t.templateId,
  version: t.version,
  name: t.name,
  description: t.description,
  goalAccountCount: t.goalAccountStructure.length,
  jurisdiction: t.jurisdiction,
  status: t.status,
  templateHash: t.templateHash,
}));

export const DEMO_TEMPLATE_INDEX: TemplateIndex = {
  templates: DEMO_TEMPLATE_SUMMARIES,
  totalCount: DEMO_TEMPLATE_SUMMARIES.length,
};

// =============================================================================
// TEMPLATE LOOKUP FUNCTIONS
// =============================================================================

export function getTemplateById(templateId: string): PortfolioTemplate | undefined {
  return DEMO_TEMPLATES.find(t => t.templateId === templateId);
}

export function getTemplateByIdAndVersion(templateId: string, version: string): PortfolioTemplate | undefined {
  return DEMO_TEMPLATES.find(t => t.templateId === templateId && t.version === version);
}

// =============================================================================
// EXPORT
// =============================================================================

export const TEMPLATE_SEED_DATA = {
  templates: DEMO_TEMPLATES,
  templateSummaries: DEMO_TEMPLATE_SUMMARIES,
  templateIndex: DEMO_TEMPLATE_INDEX,
  getTemplateById,
  getTemplateByIdAndVersion,
};

export default TEMPLATE_SEED_DATA;
