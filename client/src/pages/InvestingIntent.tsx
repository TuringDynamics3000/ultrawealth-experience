import { useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";

type IntentOption = "long-term" | "specific-goal" | "surplus" | null;

interface Template {
  id: string;
  name: string;
  description: string;
  rules: string[];
  image: string;
}

const TEMPLATES: Template[] = [
  {
    id: "broad-market",
    name: "Broad Market",
    description: "Diversified exposure across major asset classes",
    rules: ["Equities: 60–70%", "Bonds: 20–30%", "Cash: 5–10%", "Max single position: 10%"],
    image: "/images/template-broad-market.png",
  },
  {
    id: "growth-tilted",
    name: "Growth-Tilted",
    description: "Higher equity allocation for capital appreciation",
    rules: ["Equities: 80–90%", "Bonds: 5–15%", "Cash: 0–5%", "Max single position: 15%"],
    image: "/images/template-growth-tilted.png",
  },
  {
    id: "income-tilted",
    name: "Income-Tilted",
    description: "Emphasis on dividend and interest-bearing assets",
    rules: ["Equities: 40–50%", "Bonds: 40–50%", "Cash: 5–10%", "Min yield: 3%"],
    image: "/images/template-income-tilted.png",
  },
  {
    id: "defensive-tilted",
    name: "Defensive-Tilted",
    description: "Lower volatility with capital preservation focus",
    rules: ["Equities: 30–40%", "Bonds: 40–50%", "Cash: 15–25%", "Max drawdown trigger: 10%"],
    image: "/images/template-defensive-tilted.png",
  },
  {
    id: "all-equity",
    name: "All Equity",
    description: "100% equity exposure across markets",
    rules: ["Equities: 100%", "Bonds: 0%", "Cash: 0%", "Max single position: 10%"],
    image: "/images/template-all-equity.png",
  },
  {
    id: "balanced",
    name: "Balanced",
    description: "Equal weight between growth and stability",
    rules: ["Equities: 50%", "Bonds: 40%", "Cash: 10%", "Rebalance trigger: ±5%"],
    image: "/images/template-balanced.png",
  },
  {
    id: "conservative",
    name: "Conservative",
    description: "Stability-first with minimal equity exposure",
    rules: ["Equities: 20–30%", "Bonds: 50–60%", "Cash: 15–25%", "Max volatility: 8%"],
    image: "/images/template-conservative.png",
  },
  {
    id: "high-growth",
    name: "High Growth",
    description: "Aggressive equity tilt for long-term growth",
    rules: ["Equities: 90–100%", "Bonds: 0–10%", "Cash: 0%", "Small-cap min: 20%"],
    image: "/images/template-high-growth.png",
  },
  {
    id: "esg-focused",
    name: "ESG-Focused",
    description: "Sustainable and responsible investment criteria",
    rules: ["ESG-rated only", "Exclusions: Tobacco, Weapons", "Equities: 60–70%", "Bonds: 25–35%"],
    image: "/images/template-esg-focused.png",
  },
  {
    id: "dividend-growth",
    name: "Dividend Growth",
    description: "Companies with consistent dividend increases",
    rules: ["Dividend growers only", "Min 5yr growth: 5%", "Equities: 80–90%", "Bonds: 10–20%"],
    image: "/images/template-dividend-growth.png",
  },
];

export default function InvestingIntent() {
  const [, setLocation] = useLocation();
  const [selectedIntent, setSelectedIntent] = useState<IntentOption>(null);
  const [selectedGoal, setSelectedGoal] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  const [expandedRules, setExpandedRules] = useState<string | null>(null);

  const intentOptions = [
    { id: "long-term" as const, label: "Build long-term wealth" },
    { id: "specific-goal" as const, label: "Save for a specific goal" },
    { id: "surplus" as const, label: "Invest surplus cash" },
  ];

  const existingGoals = [
    { id: "home-deposit", label: "Home Deposit" },
    { id: "retirement", label: "Retirement" },
    { id: "emergency", label: "Safety Net" },
  ];

  const displayedTemplates = showAllTemplates ? TEMPLATES : TEMPLATES.slice(0, 4);

  const handleContinue = () => {
    // Store selected template in sessionStorage for later screens
    if (selectedTemplate) {
      sessionStorage.setItem("selectedTemplate", selectedTemplate);
    } else {
      sessionStorage.removeItem("selectedTemplate");
    }

    // Store selected intent
    sessionStorage.setItem("selectedIntent", selectedIntent || "");

    if (selectedIntent === "specific-goal") {
      if (selectedGoal) {
        // Existing goal - go to its builder
        setLocation(`/goals/${selectedGoal}/builder`);
      } else {
        // New goal - go to goal creation first
        setLocation('/goals/new');
      }
    } else if (selectedIntent === "surplus") {
      // For surplus cash, ask how much first
      setLocation('/invest/surplus-amount');
    } else if (selectedIntent === "long-term") {
      // For long-term wealth, go directly to builder
      sessionStorage.setItem("goalMetadata", JSON.stringify({
        name: "Long-term Wealth",
        targetAmount: "",
        targetDate: "",
        template: null,
      }));
      setLocation('/goals/long-term/builder');
    } else {
      // No intent selected, shouldn't happen but fallback
      setLocation('/goals/new');
    }
  };

  const toggleRules = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedRules(expandedRules === templateId ? null : templateId);
  };

  return (
    <Layout>
      <div className="max-w-[480px] mx-auto px-5 py-8">
        
        {/* Back Navigation */}
        <button
          onClick={() => setLocation('/')}
          className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>

        {/* Page Title */}
        <h1 className="text-2xl font-bold text-black mb-8">
          What are you investing for?
        </h1>

        {/* Section A: Intent Options */}
        <div className="space-y-3 mb-8">
          {intentOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedIntent(option.id)}
              className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                selectedIntent === option.id
                  ? "border-black bg-gray-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedIntent === option.id ? "border-black" : "border-gray-300"
                }`}>
                  {selectedIntent === option.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-black" />
                  )}
                </div>
                <span className="text-base font-medium text-black">{option.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Optional Goal Selection - Only show when specific-goal selected */}
        {selectedIntent === "specific-goal" && (
          <div className="mb-8 p-4 bg-gray-50 rounded-2xl">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">Optional</p>
            
            {/* Select existing goal */}
            <div className="mb-3">
              <select
                value={selectedGoal}
                onChange={(e) => setSelectedGoal(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 text-base bg-white focus:outline-none focus:border-black transition-colors"
              >
                <option value="">Select existing goal</option>
                {existingGoals.map((goal) => (
                  <option key={goal.id} value={goal.id}>{goal.label}</option>
                ))}
              </select>
            </div>

            {/* Create new goal */}
            <button
              onClick={() => setLocation('/goals/new')}
              className="w-full p-3 rounded-xl border border-gray-200 text-base text-gray-600 hover:border-black hover:text-black transition-colors text-left"
            >
              Create a new goal
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-100 my-8" />

        {/* Section B: Starting Setups (OPTIONAL) */}
        <div className="mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-4">
            Choose a starting setup (optional)
          </p>

          {/* Template Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {displayedTemplates.map((template) => (
              <div key={template.id} className="flex flex-col">
                <button
                  onClick={() => setSelectedTemplate(selectedTemplate === template.id ? null : template.id)}
                  className={`rounded-2xl border-2 text-left transition-all overflow-hidden ${
                    selectedTemplate === template.id
                      ? "border-black"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {/* Image Header */}
                  <div className="relative h-24 w-full overflow-hidden">
                    <img 
                      src={template.image} 
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    {/* Selection indicator */}
                    {selectedTemplate === template.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Text Content */}
                  <div className="p-3">
                    <p className="text-sm font-semibold text-black mb-1">{template.name}</p>
                    <p className="text-xs text-gray-500 leading-snug">{template.description}</p>
                  </div>
                </button>
                
                {/* View Rules Toggle */}
                <button
                  onClick={(e) => toggleRules(template.id, e)}
                  className="mt-2 text-xs text-gray-500 hover:text-black transition-colors flex items-center gap-1 px-1"
                >
                  {expandedRules === template.id ? (
                    <>Hide rules <ChevronUp className="w-3 h-3" /></>
                  ) : (
                    <>View rules <ChevronDown className="w-3 h-3" /></>
                  )}
                </button>

                {/* Expanded Rules */}
                {expandedRules === template.id && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-xl">
                    <ul className="space-y-1">
                      {template.rules.map((rule, idx) => (
                        <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                          <span className="text-gray-400">•</span>
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* View All Link */}
          {!showAllTemplates && (
            <button
              onClick={() => setShowAllTemplates(true)}
              className="text-sm text-gray-500 hover:text-black transition-colors underline"
            >
              View all setups ({TEMPLATES.length})
            </button>
          )}
          {showAllTemplates && (
            <button
              onClick={() => setShowAllTemplates(false)}
              className="text-sm text-gray-500 hover:text-black transition-colors underline"
            >
              Show fewer
            </button>
          )}
        </div>

        {/* Mandatory Copy */}
        <div className="mb-8 p-4 bg-gray-50 rounded-2xl">
          <p className="text-sm text-gray-600 leading-relaxed">
            These are starting configurations generated by the system.
            <br />
            You may adopt one, modify it, or ignore it.
          </p>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selectedIntent}
          className={`w-full py-4 rounded-full text-base font-semibold transition-all ${
            selectedIntent
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </Layout>
  );
}
