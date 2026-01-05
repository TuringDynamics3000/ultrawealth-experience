import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { useAccount } from "@/contexts/AccountContext";
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";

interface GoalConstraints {
  maxEquity: number;
  minEquity: number;
  maxSingleETF: number;
  cryptoCap: number;
  driftTolerance: number;
  minETFsRequired: number;
}

interface GoalMetadata {
  name: string;
  targetAmount: string;
  targetDate: string;
  template: string | null;
}

export default function Portfolio() {
  const [, setLocation] = useLocation();
  const { context, setContext, cash } = useAccount();
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [exposureExpanded, setExposureExpanded] = useState(false);
  const [constraints, setConstraints] = useState<GoalConstraints | null>(null);
  const [goalMetadata, setGoalMetadata] = useState<GoalMetadata | null>(null);

  useEffect(() => {
    // Retrieve constraints from sessionStorage
    const storedConstraints = sessionStorage.getItem("goalConstraints");
    if (storedConstraints) {
      setConstraints(JSON.parse(storedConstraints));
    }

    // Retrieve goal metadata from sessionStorage
    const storedMetadata = sessionStorage.getItem("goalMetadata");
    if (storedMetadata) {
      setGoalMetadata(JSON.parse(storedMetadata));
    }
  }, []);

  const contextLabel = context === "personal" ? "Personal" : "Business";
  
  // Use the target amount from goal metadata if available, otherwise use default cash
  const surplusCashAmount = sessionStorage.getItem("surplusCashAmount");
  const targetAmount = goalMetadata?.targetAmount 
    ? parseFloat(goalMetadata.targetAmount) 
    : surplusCashAmount 
      ? parseFloat(surplusCashAmount)
      : null;

  // Calculate available cash based on goal
  const availableCash = targetAmount || (context === "personal" ? cash.personal : cash.business);

  // If user has set up a goal, show portfolio based on their target amount
  // Otherwise show default mock data
  const hasGoal = goalMetadata && goalMetadata.name;

  // Calculate holdings based on target amount (for demo purposes)
  // In a real app, this would come from actual portfolio data
  const calculateHoldings = () => {
    if (!targetAmount || !constraints) {
      // Default mock holdings
      return {
        crypto: [
          { symbol: "BTC", quantity: "0.25", value: 16875 },
          { symbol: "ETH", quantity: "3.00", value: 9600 },
        ],
        equities: [
          { symbol: "VAS", quantity: "120 units", value: 12300 },
          { symbol: "IOO", quantity: "80 units", value: 8900 },
        ],
        totalValue: 46095,
        cashBalance: availableCash,
      };
    }

    // For a new goal, start with all cash (no holdings yet)
    return {
      crypto: [],
      equities: [],
      totalValue: targetAmount,
      cashBalance: targetAmount,
    };
  };

  const holdings = calculateHoldings();

  // Calculate current exposure
  const calculateExposure = () => {
    const total = holdings.totalValue;
    if (total === 0) return { equities: 0, crypto: 0, cash: 100 };

    const equityValue = holdings.equities.reduce((sum, h) => sum + h.value, 0);
    const cryptoValue = holdings.crypto.reduce((sum, h) => sum + h.value, 0);
    const cashValue = holdings.cashBalance;

    return {
      equities: Math.round((equityValue / total) * 100),
      crypto: Math.round((cryptoValue / total) * 100),
      cash: Math.round((cashValue / total) * 100),
    };
  };

  const currentExposure = calculateExposure();

  // Check exposure vs rules
  const getExposureStatus = (current: number, min: number, max: number): "within" | "outside" => {
    if (current >= min && current <= max) return "within";
    return "outside";
  };

  // Goal status based on exposure vs rules
  const getGoalStatus = (): string => {
    if (!constraints) return "No rules registered";
    
    const equityStatus = getExposureStatus(currentExposure.equities, constraints.minEquity, constraints.maxEquity);
    const cryptoStatus = getExposureStatus(currentExposure.crypto, 0, constraints.cryptoCap);
    
    if (equityStatus === "within" && cryptoStatus === "within") {
      return "Within target range";
    }
    return "Outside target range";
  };

  const goal = {
    name: goalMetadata?.name || "No goal set",
    targetAmount: goalMetadata?.targetAmount || targetAmount?.toLocaleString() || "",
    status: getGoalStatus(),
    priority: "#1 (Time-based)",
  };

  return (
    <Layout>
      <div className="max-w-[480px] mx-auto px-5 py-8 pb-32">
        
        {/* Back Navigation */}
        <button
          onClick={() => setLocation('/')}
          className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Home</span>
        </button>

        {/* ─────────────────────────────────────────────────────
            SECTION 1 — PORTFOLIO ANCHOR (PRIMARY)
        ───────────────────────────────────────────────────── */}
        <div className="mb-10">
          {/* Title with Context Selector */}
          <div className="flex items-center gap-2 mb-6">
            <h1 className="text-2xl font-bold text-black">Portfolio</h1>
            <div className="relative">
              <button
                onClick={() => setShowContextMenu(!showContextMenu)}
                className="flex items-center gap-1 text-gray-500 hover:text-black transition-colors"
              >
                <span className="text-base">({contextLabel}</span>
                <ChevronDown className="w-4 h-4" />
                <span className="text-base">)</span>
              </button>
              
              {showContextMenu && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[140px] z-50">
                  <button
                    onClick={() => { setContext("personal"); setShowContextMenu(false); }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${context === "personal" ? "font-medium" : ""}`}
                  >
                    Personal
                  </button>
                  <button
                    onClick={() => { setContext("business"); setShowContextMenu(false); }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${context === "business" ? "font-medium" : ""}`}
                  >
                    Business
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Total Portfolio Value */}
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Total portfolio value</p>
            <p className="text-4xl font-bold text-black">
              ${holdings.totalValue.toLocaleString()}
            </p>
          </div>

          {/* Available Cash */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Available cash</p>
            <p className="text-2xl font-semibold text-black">
              ${holdings.cashBalance.toLocaleString()}
            </p>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────
            SECTION 2 — HOLDINGS (GROUPED BY ASSET CLASS)
        ───────────────────────────────────────────────────── */}
        <div className="mb-8">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-4">
            Holdings
          </p>

          {holdings.crypto.length === 0 && holdings.equities.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-6 text-center">
              <p className="text-sm text-gray-500 mb-2">No holdings yet</p>
              <p className="text-xs text-gray-400">
                Your cash is ready to invest. Place a trade to get started.
              </p>
            </div>
          ) : (
            <>
              {/* Cryptoassets */}
              {holdings.crypto.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
                    Cryptoassets
                  </p>
                  <div className="space-y-3">
                    {holdings.crypto.map((holding) => (
                      <div key={holding.symbol} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-black">{holding.symbol}</span>
                          <span className="text-sm text-gray-500">{holding.quantity}</span>
                        </div>
                        <span className="text-black">${holding.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Equities */}
              {holdings.equities.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
                    Equities
                  </p>
                  <div className="space-y-3">
                    {holdings.equities.map((holding) => (
                      <div key={holding.symbol} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-black">{holding.symbol}</span>
                          <span className="text-sm text-gray-500">{holding.quantity}</span>
                        </div>
                        <span className="text-black">${holding.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ─────────────────────────────────────────────────────
            SECTION 3 — EXPOSURE VS RULES (COLLAPSIBLE)
        ───────────────────────────────────────────────────── */}
        <div className="mb-8">
          <button
            onClick={() => setExposureExpanded(!exposureExpanded)}
            className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wide font-medium mb-4"
          >
            <span>Exposure vs Rules</span>
            {exposureExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {exposureExpanded && constraints && (
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
              {/* Equities */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Equities</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{currentExposure.equities}%</span>
                  <span className="text-xs text-gray-400">
                    (rule: {constraints.minEquity}–{constraints.maxEquity}%)
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    getExposureStatus(currentExposure.equities, constraints.minEquity, constraints.maxEquity) === "within"
                      ? "bg-gray-100 text-gray-600"
                      : "bg-gray-200 text-gray-700"
                  }`}>
                    {getExposureStatus(currentExposure.equities, constraints.minEquity, constraints.maxEquity) === "within"
                      ? "Within"
                      : "Outside"}
                  </span>
                </div>
              </div>

              {/* Crypto */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cryptoassets</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{currentExposure.crypto}%</span>
                  <span className="text-xs text-gray-400">
                    (rule: 0–{constraints.cryptoCap}%)
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    getExposureStatus(currentExposure.crypto, 0, constraints.cryptoCap) === "within"
                      ? "bg-gray-100 text-gray-600"
                      : "bg-gray-200 text-gray-700"
                  }`}>
                    {getExposureStatus(currentExposure.crypto, 0, constraints.cryptoCap) === "within"
                      ? "Within"
                      : "Outside"}
                  </span>
                </div>
              </div>

              {/* Cash */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cash</span>
                <span className="text-sm text-gray-600">{currentExposure.cash}%</span>
              </div>
            </div>
          )}

          {exposureExpanded && !constraints && (
            <p className="text-sm text-gray-500 pl-1">
              No rules registered yet.{" "}
              <button 
                onClick={() => setLocation('/goals/new')}
                className="text-black underline"
              >
                Create a goal
              </button>
            </p>
          )}
        </div>

        {/* ─────────────────────────────────────────────────────
            SECTION 4 — GOALS & RULES
        ───────────────────────────────────────────────────── */}
        <div className="mb-8">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-4">
            Goals & Rules
          </p>

          {hasGoal ? (
            <div className="border border-gray-200 rounded-2xl p-4">
              <p className="font-semibold text-black mb-3">{goal.name}</p>
              {goal.targetAmount && (
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Target</span>
                  <span className="text-sm text-gray-700">${goal.targetAmount}</span>
                </div>
              )}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Status</span>
                <span className="text-sm text-gray-700">{goal.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Priority</span>
                <span className="text-sm text-gray-700">{goal.priority}</span>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-6 text-center">
              <p className="text-sm text-gray-500 mb-2">No goals set</p>
              <button 
                onClick={() => setLocation('/goals/new')}
                className="text-sm text-black underline"
              >
                Create a goal
              </button>
            </div>
          )}

          {hasGoal && (
            <button
              onClick={() => setLocation('/goals/new')}
              className="text-sm text-gray-500 hover:text-black transition-colors mt-3"
            >
              Create new goal →
            </button>
          )}
        </div>

        {/* ─────────────────────────────────────────────────────
            SECTION 5 — PRIMARY ACTIONS (STICKY BOTTOM)
        ───────────────────────────────────────────────────── */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
          <div className="max-w-[480px] mx-auto space-y-3">
            <button
              onClick={() => setLocation('/trade')}
              className="w-full py-4 bg-black text-white rounded-full text-base font-semibold hover:bg-gray-800 transition-colors"
            >
              Place trade
            </button>
            <button
              onClick={() => setLocation('/activity')}
              className="w-full py-4 bg-white text-black border border-gray-200 rounded-full text-base font-semibold hover:bg-gray-50 transition-colors"
            >
              View activity
            </button>
          </div>
        </div>

      </div>
    </Layout>
  );
}
