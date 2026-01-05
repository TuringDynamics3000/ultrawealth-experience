import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Layout } from "@/components/Layout";
import { ArrowLeft } from "lucide-react";

export default function GoalBuilder() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  
  // Constraint states
  const [maxEquity, setMaxEquity] = useState(70);
  const [maxSingleETF, setMaxSingleETF] = useState(20);
  const [cryptoCap, setCryptoCap] = useState(10);
  const [driftTolerance, setDriftTolerance] = useState(5);
  const [volatilityTolerance, setVolatilityTolerance] = useState(50); // 0-100 slider
  
  // Goal metadata from previous screen
  const [goalName, setGoalName] = useState("Your Goal");

  useEffect(() => {
    const metadata = sessionStorage.getItem("goalMetadata");
    if (metadata) {
      const parsed = JSON.parse(metadata);
      setGoalName(parsed.name || "Your Goal");
    }
  }, []);

  // Derived facts (mechanical calculations)
  const minETFsRequired = Math.ceil(100 / maxSingleETF);
  const minEquity = Math.max(0, maxEquity - 20); // Range is maxEquity ± 20

  // Volatility slider adjusts constraints mechanically
  useEffect(() => {
    // Low volatility (0-33): Conservative
    // Medium volatility (34-66): Balanced
    // High volatility (67-100): Growth
    if (volatilityTolerance <= 33) {
      setMaxEquity(50);
      setCryptoCap(5);
    } else if (volatilityTolerance <= 66) {
      setMaxEquity(70);
      setCryptoCap(10);
    } else {
      setMaxEquity(90);
      setCryptoCap(15);
    }
  }, [volatilityTolerance]);

  const handleContinue = () => {
    // Store constraints in sessionStorage
    sessionStorage.setItem("goalConstraints", JSON.stringify({
      maxEquity,
      minEquity,
      maxSingleETF,
      cryptoCap,
      driftTolerance,
      minETFsRequired,
    }));
    
    // Navigate to Rule Registration
    setLocation(`/goals/${params.id}/registered`);
  };

  return (
    <Layout>
      <div className="max-w-[480px] mx-auto px-5 py-8 pb-32">
        
        {/* Back Navigation */}
        <button
          onClick={() => setLocation('/goals/new')}
          className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>

        {/* Page Title */}
        <h1 className="text-2xl font-bold text-black mb-2">
          Set your limits
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Define constraints for "{goalName}"
        </p>

        {/* ─────────────────────────────────────────────────────
            VOLATILITY TOLERANCE SLIDER (OPTIONAL CONTROL)
        ───────────────────────────────────────────────────── */}
        <div className="mb-8 p-5 bg-gray-50 rounded-2xl">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Volatility tolerance
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={volatilityTolerance}
            onChange={(e) => setVolatilityTolerance(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Lower</span>
            <span>Higher</span>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Adjusts limits below mechanically. Not a recommendation.
          </p>
        </div>

        {/* ─────────────────────────────────────────────────────
            CONSTRAINT AUTHORING
        ───────────────────────────────────────────────────── */}
        <div className="space-y-6 mb-8">
          
          {/* Max Equity % */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">
                Max equity %
              </label>
              <span className="text-sm font-semibold text-black">{maxEquity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={maxEquity}
              onChange={(e) => setMaxEquity(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Max Single ETF % */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">
                Max single ETF %
              </label>
              <span className="text-sm font-semibold text-black">{maxSingleETF}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              value={maxSingleETF}
              onChange={(e) => setMaxSingleETF(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>5%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Crypto Cap % */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">
                Crypto cap %
              </label>
              <span className="text-sm font-semibold text-black">{cryptoCap}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={cryptoCap}
              onChange={(e) => setCryptoCap(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0%</span>
              <span>50%</span>
            </div>
          </div>

          {/* Drift Tolerance */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">
                Drift tolerance
              </label>
              <span className="text-sm font-semibold text-black">±{driftTolerance}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={driftTolerance}
              onChange={(e) => setDriftTolerance(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>±1%</span>
              <span>±20%</span>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────
            DERIVED FACTS (FACTUAL, NOT JUDGEMENTAL)
        ───────────────────────────────────────────────────── */}
        <div className="mb-8 p-4 bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">
            Derived from your limits
          </p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Max single ETF</span>
              <span className="text-sm font-medium text-black">{maxSingleETF}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Minimum ETFs required</span>
              <span className="text-sm font-medium text-black">{minETFsRequired}</span>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────
            MANDATORY COPY
        ───────────────────────────────────────────────────── */}
        <div className="mb-8 py-4 border-t border-b border-gray-100">
          <p className="text-sm text-gray-600">
            These limits define how your investments may operate.
          </p>
          <p className="text-sm text-gray-600">
            They do not select investments.
          </p>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────
          PRIMARY ACTION (STICKY BOTTOM)
      ───────────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <div className="max-w-[480px] mx-auto">
          <button
            onClick={handleContinue}
            className="w-full py-4 rounded-full text-base font-semibold bg-black text-white hover:bg-gray-800 transition-all"
          >
            Register rules
          </button>
        </div>
      </div>
    </Layout>
  );
}
