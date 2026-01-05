import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { Layout } from "@/components/Layout";
import { Check, ArrowLeft } from "lucide-react";

// Template names mapping
const TEMPLATE_NAMES: Record<string, string> = {
  "broad-market": "Broad Market",
  "growth-tilted": "Growth-Tilted",
  "income-tilted": "Income-Tilted",
  "defensive-tilted": "Defensive-Tilted",
  "all-equity": "All Equity",
  "balanced": "Balanced",
  "conservative": "Conservative",
  "high-growth": "High Growth",
  "esg-focused": "ESG-Focused",
  "dividend-growth": "Dividend Growth",
};

interface GoalMetadata {
  name: string;
  targetAmount: string;
  targetDate: string;
  template: string | null;
}

interface GoalConstraints {
  maxEquity: number;
  minEquity: number;
  maxSingleETF: number;
  cryptoCap: number;
  driftTolerance: number;
  minETFsRequired: number;
}

export default function RuleRegistration() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [goalMetadata, setGoalMetadata] = useState<GoalMetadata | null>(null);
  const [constraints, setConstraints] = useState<GoalConstraints>({
    maxEquity: 70,
    minEquity: 50,
    maxSingleETF: 20,
    cryptoCap: 10,
    driftTolerance: 5,
    minETFsRequired: 5,
  });

  useEffect(() => {
    // Retrieve selected template from sessionStorage
    const template = sessionStorage.getItem("selectedTemplate");
    setSelectedTemplate(template);

    // Retrieve goal metadata
    const metadata = sessionStorage.getItem("goalMetadata");
    if (metadata) {
      setGoalMetadata(JSON.parse(metadata));
    }

    // Retrieve constraints from Goal Builder
    const storedConstraints = sessionStorage.getItem("goalConstraints");
    if (storedConstraints) {
      setConstraints(JSON.parse(storedConstraints));
    }
  }, []);

  // Derive diversification level (FACTUAL, NOT JUDGEMENTAL)
  const getDiversificationLevel = (): string => {
    if (constraints.minETFsRequired >= 10) return "Broad";
    if (constraints.minETFsRequired >= 5) return "Moderate";
    return "Concentrated";
  };

  return (
    <Layout>
      <div className="max-w-[480px] mx-auto px-5 py-8 pb-32">
        
        {/* Back Navigation */}
        <button
          onClick={() => setLocation(`/goals/${params.id}/builder`)}
          className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center">
            <Check className="w-8 h-8 text-white" strokeWidth={3} />
          </div>
        </div>

        {/* Page Title */}
        <h1 className="text-2xl font-bold text-black text-center mb-2">
          Your goal-based account is active
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          Rules registered and ready to enforce
        </p>

        {/* Goal Summary Card */}
        {goalMetadata && (
          <div className="bg-gray-50 rounded-2xl p-5 mb-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">Goal</p>
            <p className="text-lg font-semibold text-black mb-1">
              {goalMetadata.name}
            </p>
            {(goalMetadata.targetAmount || goalMetadata.targetDate) && (
              <p className="text-sm text-gray-600">
                {goalMetadata.targetAmount && `$${parseInt(goalMetadata.targetAmount).toLocaleString()}`}
                {goalMetadata.targetAmount && goalMetadata.targetDate && " · "}
                {goalMetadata.targetDate && goalMetadata.targetDate}
              </p>
            )}
          </div>
        )}

        {/* Selected Template (if any) */}
        {selectedTemplate && (
          <div className="bg-gray-50 rounded-2xl p-5 mb-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
              Starting setup
            </p>
            <p className="text-base font-medium text-black">
              {TEMPLATE_NAMES[selectedTemplate] || selectedTemplate}
            </p>
          </div>
        )}

        {/* Registered Execution Rules */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">
            Registered execution rules
          </p>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-gray-600">Equities</span>
              <span className="text-sm font-medium text-black">{constraints.minEquity}–{constraints.maxEquity}%</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-gray-600">Cryptoassets</span>
              <span className="text-sm font-medium text-black">0–{constraints.cryptoCap}%</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-gray-600">Max single ETF</span>
              <span className="text-sm font-medium text-black">{constraints.maxSingleETF}%</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-gray-600">Drift tolerance</span>
              <span className="text-sm font-medium text-black">±{constraints.driftTolerance}%</span>
            </div>
          </div>
        </div>

        {/* Derived Characteristics (FACTUAL, NOT JUDGEMENTAL) */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-8">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">
            Derived characteristics
          </p>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-gray-600">Diversification level</span>
              <span className="text-sm font-medium text-black">{getDiversificationLevel()}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-gray-600">Minimum ETFs required</span>
              <span className="text-sm font-medium text-black">{constraints.minETFsRequired}</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-8" />

        {/* Explicit Authorship Block (MANDATORY COPY) */}
        <div className="mb-8">
          <p className="text-sm text-gray-600 leading-relaxed">
            You authored these rules.
            <br />
            They constrain how your trades are applied.
            <br />
            No advice is given.
          </p>
        </div>
      </div>

      {/* Primary Action (Sticky Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <div className="max-w-[480px] mx-auto">
          <button
            onClick={() => setLocation('/portfolio')}
            className="w-full py-4 rounded-full text-base font-semibold bg-black text-white hover:bg-gray-800 transition-colors"
          >
            View portfolio
          </button>
        </div>
      </div>
    </Layout>
  );
}
