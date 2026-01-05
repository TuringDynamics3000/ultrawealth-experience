import { useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { ArrowLeft } from "lucide-react";

export default function SurplusCashAmount() {
  const [, setLocation] = useLocation();
  const [amount, setAmount] = useState("");

  const handleContinue = () => {
    // Store the surplus cash amount
    sessionStorage.setItem("surplusCashAmount", amount);
    sessionStorage.setItem("goalMetadata", JSON.stringify({
      name: "Surplus Cash",
      targetAmount: amount,
      targetDate: "",
      template: null,
    }));
    setLocation("/goals/surplus/builder");
  };

  const formatCurrency = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");
    if (!numericValue) return "";
    // Format with commas
    return parseInt(numericValue).toLocaleString();
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    setAmount(rawValue);
  };

  const displayAmount = amount ? formatCurrency(amount) : "";

  // Quick amount buttons
  const quickAmounts = [5000, 10000, 25000, 50000, 100000];

  const isValid = amount && parseInt(amount) >= 1000;

  return (
    <Layout>
      <div className="max-w-[480px] mx-auto px-5 py-8 pb-32">
        
        {/* Back Navigation */}
        <button
          onClick={() => setLocation('/invest')}
          className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>

        {/* Page Title */}
        <h1 className="text-2xl font-bold text-black mb-2">
          How much are you investing?
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Enter the amount of surplus cash you want to put to work.
        </p>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-semibold text-gray-400">
              $
            </span>
            <input
              type="text"
              value={displayAmount}
              onChange={handleAmountChange}
              placeholder="0"
              className="w-full pl-10 pr-4 py-4 text-2xl font-semibold text-black border border-gray-200 rounded-2xl focus:outline-none focus:border-black transition-colors"
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">Minimum $1,000</p>
        </div>

        {/* Quick Amount Buttons */}
        <div className="mb-8">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">
            Quick select
          </p>
          <div className="flex flex-wrap gap-2">
            {quickAmounts.map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  amount === quickAmount.toString()
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                ${quickAmount.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Info Note */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-8">
          <p className="text-sm text-gray-600">
            This amount will be used to calculate your allocation limits. 
            You can adjust this later.
          </p>
        </div>

        {/* Sticky Bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
          <div className="max-w-[480px] mx-auto">
            <button
              onClick={handleContinue}
              disabled={!isValid}
              className={`w-full py-4 rounded-full text-base font-semibold transition-all ${
                isValid
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        </div>

      </div>
    </Layout>
  );
}
