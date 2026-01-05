import { useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { useAccount } from "@/contexts/AccountContext";
import { ArrowRight, Check } from "lucide-react";

type TransferContext = "personal" | "business";

export default function Transfer() {
  const [, setLocation] = useLocation();
  const { cash } = useAccount();
  const [source, setSource] = useState<TransferContext>("personal");
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"form" | "review" | "success">("form");

  const destination: TransferContext = source === "personal" ? "business" : "personal";
  const sourceCash = source === "personal" ? cash.personal : cash.business;
  const sourceLabel = source === "personal" ? "Personal" : "Business";
  const destinationLabel = destination === "personal" ? "Personal" : "Business";

  const amountNum = parseFloat(amount) || 0;
  const isValidAmount = amountNum > 0 && amountNum <= sourceCash;

  const handleSwap = () => {
    setSource(destination);
  };

  const handleReview = () => {
    if (isValidAmount) {
      setStep("review");
    }
  };

  const handleSubmit = () => {
    // In production, this would call an API
    setStep("success");
  };

  if (step === "success") {
    return (
      <Layout>
        <div className="max-w-[480px] mx-auto px-5 py-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-2xl font-bold text-black mb-2">
              Transfer initiated
            </h1>
            <p className="text-gray-500 mb-8">
              ${amountNum.toLocaleString()} from {sourceLabel} to {destinationLabel}
            </p>

            <div className="bg-gray-50 rounded-2xl p-4 mb-8 text-left">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">
                Activity record
              </p>
              <p className="text-sm text-gray-700">
                Transfer initiated by you · {sourceLabel} → {destinationLabel}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setLocation('/portfolio')}
                className="w-full py-4 rounded-full text-base font-semibold bg-black text-white hover:bg-gray-800 transition-colors"
              >
                Back to portfolio
              </button>
              <button
                onClick={() => setLocation('/activity')}
                className="w-full py-4 rounded-full text-base font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                View activity
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (step === "review") {
    return (
      <Layout>
        <div className="max-w-[480px] mx-auto px-5 py-8">
          <h1 className="text-2xl font-bold text-black mb-8">
            Review transfer
          </h1>

          <div className="bg-gray-50 rounded-2xl p-5 mb-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">From</span>
                <span className="text-base font-medium text-black">{sourceLabel}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">To</span>
                <span className="text-base font-medium text-black">{destinationLabel}</span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Amount</span>
                  <span className="text-xl font-bold text-black">${amountNum.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 my-6" />

          <p className="text-sm text-gray-500 mb-6">
            This transfer is initiated by you. Funds will be moved between your accounts.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleSubmit}
              className="w-full py-4 rounded-full text-base font-semibold bg-black text-white hover:bg-gray-800 transition-colors"
            >
              Confirm transfer
            </button>
            <button
              onClick={() => setStep("form")}
              className="w-full py-4 rounded-full text-base font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-[480px] mx-auto px-5 py-8">
        
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-black mb-8">
          Transfer
        </h1>

        {/* Source / Destination */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            {/* Source */}
            <div className="flex-1 bg-gray-50 rounded-2xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                From
              </p>
              <p className="text-lg font-semibold text-black">{sourceLabel}</p>
              <p className="text-sm text-gray-500">${sourceCash.toLocaleString()} available</p>
            </div>

            {/* Swap Button */}
            <button
              onClick={handleSwap}
              className="w-10 h-10 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              <ArrowRight className="w-5 h-5 text-white" />
            </button>

            {/* Destination */}
            <div className="flex-1 bg-gray-50 rounded-2xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                To
              </p>
              <p className="text-lg font-semibold text-black">{destinationLabel}</p>
              <p className="text-sm text-gray-500">
                ${(destination === "personal" ? cash.personal : cash.business).toLocaleString()} balance
              </p>
            </div>
          </div>
        </div>

        {/* Amount */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">$</span>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
              placeholder="0"
              className="w-full p-4 pl-10 rounded-2xl border border-gray-200 text-2xl font-semibold focus:outline-none focus:border-black transition-colors"
            />
          </div>
          {amountNum > sourceCash && (
            <p className="text-sm text-red-500 mt-2">
              Amount exceeds available cash
            </p>
          )}
        </div>

        {/* Quick Amount Buttons */}
        <div className="flex gap-2 mb-8">
          {[1000, 5000, 10000].map((quickAmount) => (
            <button
              key={quickAmount}
              onClick={() => setAmount(quickAmount.toString())}
              disabled={quickAmount > sourceCash}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                quickAmount <= sourceCash
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-gray-50 text-gray-300 cursor-not-allowed"
              }`}
            >
              ${quickAmount.toLocaleString()}
            </button>
          ))}
          <button
            onClick={() => setAmount(sourceCash.toString())}
            className="flex-1 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Max
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-6" />

        {/* Info */}
        <p className="text-sm text-gray-500 mb-6">
          Transfers between your Personal and Business accounts are processed instantly.
        </p>

        {/* Review Button */}
        <button
          onClick={handleReview}
          disabled={!isValidAmount}
          className={`w-full py-4 rounded-full text-base font-semibold transition-all ${
            isValidAmount
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          Review transfer
        </button>
      </div>
    </Layout>
  );
}
