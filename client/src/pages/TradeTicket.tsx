import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { useAccount } from "@/contexts/AccountContext";
import { ChevronDown, ArrowLeft } from "lucide-react";

type OrderSide = "buy" | "sell";
type OrderType = "market" | "limit";
type FundingMethod = "cash" | "inpl";

export default function TradeTicket() {
  const [, setLocation] = useLocation();
  const { context, setContext, cash } = useAccount();
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [side, setSide] = useState<OrderSide | null>(null);
  const [instrument, setInstrument] = useState("");
  const [quantity, setQuantity] = useState("");
  const [orderType, setOrderType] = useState<OrderType | null>(null);
  const [limitPrice, setLimitPrice] = useState("");
  const [fundingMethod, setFundingMethod] = useState<FundingMethod>("cash");

  // Get available cash based on goal or context
  const surplusCashAmount = sessionStorage.getItem("surplusCashAmount");
  const goalMetadata = sessionStorage.getItem("goalMetadata");
  const parsedGoalMetadata = goalMetadata ? JSON.parse(goalMetadata) : null;
  
  const targetAmount = parsedGoalMetadata?.targetAmount 
    ? parseFloat(parsedGoalMetadata.targetAmount) 
    : surplusCashAmount 
      ? parseFloat(surplusCashAmount)
      : null;

  const currentCash = targetAmount || (context === "personal" ? cash.personal : cash.business);
  const contextLabel = context === "personal" ? "Personal" : "Business";

  const brokerage = 9.50;
  const estimatedPrice = 101.60; // Mock price
  const estimatedTotal = quantity ? (parseInt(quantity) * estimatedPrice + brokerage) : 0;

  // Check if user has insufficient cash
  const insufficientCash = estimatedTotal > currentCash;

  const isFormValid = side && instrument && quantity && fundingMethod && (orderType === "market" || (orderType === "limit" && limitPrice));

  const handleReviewOrder = () => {
    if (isFormValid) {
      // Store trade data in session for review screen
      sessionStorage.setItem("tradeData", JSON.stringify({
        side,
        instrument,
        quantity,
        orderType,
        limitPrice,
        fundingMethod,
        estimatedTotal,
        brokerage,
      }));
      setLocation('/trade/review');
    }
  };

  return (
    <Layout>
      <div className="max-w-[480px] mx-auto px-5 py-8 pb-32">
        
        {/* Back Navigation */}
        <button
          onClick={() => setLocation('/portfolio')}
          className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>

        {/* ─────────────────────────────────────────────────────
            SECTION 1 — TRADE CONTEXT (PRIMARY ANCHOR)
        ───────────────────────────────────────────────────── */}
        <div className="mb-8">
          {/* Title with Context Selector */}
          <div className="flex items-center gap-2 mb-4">
            <h1 className="text-2xl font-bold text-black">Place trade</h1>
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
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg py-2 min-w-[160px] z-50">
                  <button
                    onClick={() => { setContext("personal"); setShowContextMenu(false); }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${context === "personal" ? "font-semibold text-black" : "text-gray-600"}`}
                  >
                    Personal
                  </button>
                  <button
                    onClick={() => { setContext("business"); setShowContextMenu(false); }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${context === "business" ? "font-semibold text-black" : "text-gray-600"}`}
                  >
                    Business
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Available Cash */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Available cash</p>
            <p className="text-2xl font-semibold text-black">
              ${currentCash.toLocaleString()}
            </p>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────
            SECTION 2 — TRADE INSTRUCTION (CLIENT AUTHORS THIS)
        ───────────────────────────────────────────────────── */}
        <div className="mb-8">
          <h2 className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-4">
            Trade details
          </h2>

          {/* Side */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Side
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setSide("buy")}
                className={`flex-1 py-3 rounded-xl text-base font-medium border-2 transition-all ${
                  side === "buy"
                    ? "border-black bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setSide("sell")}
                className={`flex-1 py-3 rounded-xl text-base font-medium border-2 transition-all ${
                  side === "sell"
                    ? "border-black bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                Sell
              </button>
            </div>
          </div>

          {/* Instrument */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instrument
            </label>
            <input
              type="text"
              value={instrument}
              onChange={(e) => setInstrument(e.target.value)}
              placeholder="Search by ticker or name"
              className="w-full p-4 rounded-xl border border-gray-200 text-base focus:outline-none focus:border-black transition-colors"
            />
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder=""
                className="w-28 p-4 rounded-xl border border-gray-200 text-base focus:outline-none focus:border-black transition-colors text-center"
              />
              <span className="text-gray-500">units</span>
            </div>
          </div>

          {/* Order Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order type
            </label>
            <div className="space-y-3">
              <button
                onClick={() => setOrderType("market")}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  orderType === "market"
                    ? "border-black bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    orderType === "market" ? "border-black" : "border-gray-300"
                  }`}>
                    {orderType === "market" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-black" />
                    )}
                  </div>
                  <span className="text-base text-black">Market</span>
                </div>
              </button>

              <div>
                <button
                  onClick={() => setOrderType("limit")}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    orderType === "limit"
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      orderType === "limit" ? "border-black" : "border-gray-300"
                    }`}>
                      {orderType === "limit" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-black" />
                      )}
                    </div>
                    <span className="text-base text-black">Limit</span>
                    {orderType === "limit" && (
                      <div className="ml-auto flex items-center">
                        <span className="text-gray-500 mr-1">$</span>
                        <input
                          type="text"
                          value={limitPrice}
                          onChange={(e) => {
                            e.stopPropagation();
                            setLimitPrice(e.target.value.replace(/[^0-9.]/g, ''));
                          }}
                          onClick={(e) => e.stopPropagation()}
                          placeholder="0.00"
                          className="w-24 p-2 rounded-lg border border-gray-200 text-base focus:outline-none focus:border-black transition-colors text-right"
                        />
                      </div>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Estimated Costs */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">
              Estimated costs
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Brokerage</span>
                <span className="text-sm text-black">${brokerage.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total</span>
                <span className="text-sm font-medium text-black">
                  {estimatedTotal > 0 ? `$${estimatedTotal.toFixed(2)}` : '$—'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────
            SECTION 3 — FUNDING METHOD (INPL APPEARS HERE)
        ───────────────────────────────────────────────────── */}
        {side === "buy" && estimatedTotal > 0 && (
          <div className="mb-8">
            <h2 className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-4">
              How would you like to fund this trade?
            </h2>

            <div className="space-y-3">
              {/* Pay Now Option */}
              <button
                onClick={() => setFundingMethod("cash")}
                disabled={insufficientCash}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  fundingMethod === "cash"
                    ? "border-black bg-gray-50"
                    : insufficientCash
                      ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                      : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    fundingMethod === "cash" ? "border-black" : "border-gray-300"
                  }`}>
                    {fundingMethod === "cash" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-black" />
                    )}
                  </div>
                  <div>
                    <span className="text-base text-black font-medium">Pay now</span>
                    <p className="text-sm text-gray-500 mt-1">Use available cash</p>
                    {insufficientCash && (
                      <p className="text-sm text-gray-400 mt-1">Insufficient cash available</p>
                    )}
                  </div>
                </div>
              </button>

              {/* INPL Option */}
              <button
                onClick={() => setFundingMethod("inpl")}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  fundingMethod === "inpl"
                    ? "border-black bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    fundingMethod === "inpl" ? "border-black" : "border-gray-300"
                  }`}>
                    {fundingMethod === "inpl" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-black" />
                    )}
                  </div>
                  <div>
                    <span className="text-base text-black font-medium">Invest now, pay later</span>
                    <p className="text-sm text-gray-500 mt-1">
                      Use your portfolio line of credit
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Repayments are scheduled from future contributions. Your rules still apply.
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────
            SECTION 4 — EXECUTION DISCIPLINE (MANDATORY COPY)
        ───────────────────────────────────────────────────── */}
        <div className="mb-8 py-4 border-t border-b border-gray-100">
          <p className="text-sm text-gray-600">
            This trade is placed at your direction.
          </p>
          <p className="text-sm text-gray-600">
            The system will apply your rules and execute if permitted.
          </p>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────
          SECTION 5 — PRIMARY ACTION (STICKY BOTTOM)
      ───────────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <div className="max-w-[480px] mx-auto">
          <button
            onClick={handleReviewOrder}
            disabled={!isFormValid}
            className={`w-full py-4 rounded-full text-base font-semibold transition-all ${
              isFormValid
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Review order
          </button>
        </div>
      </div>
    </Layout>
  );
}
