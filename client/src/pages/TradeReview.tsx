import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Check, X } from "lucide-react";

interface GoalConstraints {
  maxEquity: number;
  minEquity: number;
  maxSingleETF: number;
  cryptoCap: number;
  driftTolerance: number;
  minETFsRequired: number;
}

export default function TradeReview() {
  const [, setLocation] = useLocation();
  const [consentChecked, setConsentChecked] = useState(false);
  const [constraints, setConstraints] = useState<GoalConstraints | null>(null);

  useEffect(() => {
    // Retrieve constraints from sessionStorage
    const storedConstraints = sessionStorage.getItem("goalConstraints");
    if (storedConstraints) {
      setConstraints(JSON.parse(storedConstraints));
    }
  }, []);

  // Mock order data
  const orderData = {
    side: "Buy",
    quantity: 25,
    instrument: "VAS",
    instrumentType: "ETF", // "Block" or "ETF"
    orderType: "Market",
    estimatedTotal: "$2,540",
  };

  // Current portfolio state (mock)
  const currentETFCount = 2; // VAS and IOO

  // Rule enforcement checks
  const getRuleChecks = () => {
    if (!constraints) {
      return [
        { label: "Sufficient cash", passed: true },
        { label: "No rules registered", passed: true, info: true },
      ];
    }

    const checks = [
      { 
        label: "Sufficient cash", 
        passed: true 
      },
      { 
        label: "Allocation within limits", 
        passed: true 
      },
      { 
        label: "ETF concentration respected", 
        passed: true,
        detail: `Max ${constraints.maxSingleETF}% per ETF`
      },
      { 
        label: "Minimum ETF count satisfied", 
        passed: currentETFCount >= constraints.minETFsRequired,
        detail: currentETFCount >= constraints.minETFsRequired 
          ? `${currentETFCount} ETFs (min: ${constraints.minETFsRequired})`
          : `${currentETFCount} ETFs (requires ${constraints.minETFsRequired})`
      },
    ];

    return checks;
  };

  const policyChecks = getRuleChecks();
  const allChecksPassed = policyChecks.every(check => check.passed);
  const canSubmit = allChecksPassed && consentChecked;

  // Get blocked reason
  const getBlockedReason = () => {
    const failedCheck = policyChecks.find(check => !check.passed);
    if (!failedCheck) return null;

    if (failedCheck.label === "Minimum ETF count satisfied" && constraints) {
      return {
        message: `This order would result in ${currentETFCount} ETFs.`,
        rule: `Your rules require at least ${constraints.minETFsRequired}.`,
        resolution: [
          "Add additional ETFs",
          "Update your rules"
        ]
      };
    }

    return {
      message: "This order cannot be executed.",
      rule: failedCheck.label,
      resolution: ["Modify your order", "Update your rules"]
    };
  };

  const blockedReason = getBlockedReason();

  const handleSubmitOrder = () => {
    // Navigate to order status
    setLocation('/orders/839204');
  };

  return (
    <Layout>
      <div className="max-w-[480px] mx-auto px-5 py-8 pb-32">
        
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-black mb-8">
          Review order
        </h1>

        {/* ─────────────────────────────────────────────────────
            EXACT CLIENT INSTRUCTION
        ───────────────────────────────────────────────────── */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">
            Your instruction
          </p>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Action</span>
              <span className="text-base font-semibold text-black">
                {orderData.side} {orderData.quantity} units
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Instrument</span>
              <span className="text-base font-medium text-black">{orderData.instrument}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Type</span>
              <span className="text-base text-black">{orderData.instrumentType}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Order type</span>
              <span className="text-base text-black">{orderData.orderType}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Estimated total</span>
                <span className="text-lg font-semibold text-black">{orderData.estimatedTotal}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────
            RULES APPLIED (ENFORCEMENT)
        ───────────────────────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">
            Rules applied
          </p>
          <div className="space-y-3">
            {policyChecks.map((check, index) => (
              <div key={index} className="flex items-start gap-3">
                {check.passed ? (
                  <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                )}
                <div>
                  <span className={`text-base ${check.passed ? 'text-black' : 'text-gray-800'}`}>
                    {check.label}
                  </span>
                  {check.detail && (
                    <p className="text-sm text-gray-500 mt-0.5">{check.detail}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────
            BLOCKED MESSAGE (IF ANY CHECK FAILS)
        ───────────────────────────────────────────────────── */}
        {blockedReason && (
          <div className="bg-gray-100 rounded-2xl p-5 mb-6">
            <p className="text-sm font-medium text-gray-800 mb-1">
              ✕ {blockedReason.message}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              {blockedReason.rule}
            </p>
            
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
              How to resolve
            </p>
            <ul className="space-y-1">
              {blockedReason.resolution.map((item, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="text-gray-400">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-100 my-6" />

        {/* ─────────────────────────────────────────────────────
            MANDATORY CONSENT CHECKBOX
        ───────────────────────────────────────────────────── */}
        <div className="mb-8">
          <button
            onClick={() => setConsentChecked(!consentChecked)}
            disabled={!allChecksPassed}
            className={`flex items-start gap-3 w-full text-left ${!allChecksPassed ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
              consentChecked ? 'bg-black border-black' : 'border-gray-300'
            }`}>
              {consentChecked && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
            </div>
            <span className="text-base text-gray-700">
              I confirm that I am placing this order at my direction.
            </span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────
          PRIMARY ACTION (STICKY BOTTOM)
      ───────────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <div className="max-w-[480px] mx-auto">
          <button
            onClick={handleSubmitOrder}
            disabled={!canSubmit}
            className={`w-full py-4 rounded-full text-base font-semibold transition-all ${
              canSubmit
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Submit order
          </button>
        </div>
      </div>
    </Layout>
  );
}
