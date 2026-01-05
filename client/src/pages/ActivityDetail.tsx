import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Download, ArrowLeft } from "lucide-react";

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

export default function ActivityDetail() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve selected template from sessionStorage
    const template = sessionStorage.getItem("selectedTemplate");
    setSelectedTemplate(template);
  }, []);

  // Mock activity detail data
  const activityData = {
    whatYouDid: "Buy 25 units of ETF A",
    rulesApplied: [
      "Maximum allocation: 40%",
      "Drift tolerance: ±5%",
    ],
    whatHappened: {
      status: "Order filled @ $101.60",
      brokerage: "$9.50",
      timestamp: "10:41 AM",
    },
    record: {
      recordId: "ACT-839204",
      ledgerRef: "0xA91F…C22E",
      replayId: "RPL-77291",
    },
  };

  const handleDownload = () => {
    // In real app, would trigger download of record
    alert("Download record");
  };

  const handleBack = () => {
    setLocation('/activity');
  };

  return (
    <Layout>
      <div className="max-w-[480px] mx-auto px-5 py-8">
        
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Activity
        </button>

        {/* Page Title */}
        <h1 className="text-2xl font-bold text-black mb-8">
          Trade details
        </h1>

        {/* Section: What you did */}
        <div className="mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
            What you did
          </p>
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-base text-black flex items-start gap-2">
              <span className="text-gray-400">•</span>
              {activityData.whatYouDid}
            </p>
          </div>
        </div>

        {/* Section: Selected template (if any) */}
        {selectedTemplate && (
          <div className="mb-6">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
              Starting setup used
            </p>
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-base text-black flex items-start gap-2">
                <span className="text-gray-400">•</span>
                {TEMPLATE_NAMES[selectedTemplate]}
              </p>
            </div>
          </div>
        )}

        {/* Section: Rules applied */}
        <div className="mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
            Rules applied
          </p>
          <div className="bg-gray-50 rounded-2xl p-4">
            <ul className="space-y-2">
              {activityData.rulesApplied.map((rule, index) => (
                <li key={index} className="text-base text-black flex items-start gap-2">
                  <span className="text-gray-400">•</span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section: What happened */}
        <div className="mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
            What happened
          </p>
          <div className="bg-gray-50 rounded-2xl p-4">
            <ul className="space-y-2">
              <li className="text-base text-black flex items-start gap-2">
                <span className="text-gray-400">•</span>
                {activityData.whatHappened.status}
              </li>
              <li className="text-base text-black flex items-start gap-2">
                <span className="text-gray-400">•</span>
                Brokerage: {activityData.whatHappened.brokerage}
              </li>
              <li className="text-base text-black flex items-start gap-2">
                <span className="text-gray-400">•</span>
                Timestamp: {activityData.whatHappened.timestamp}
              </li>
            </ul>
          </div>
        </div>

        {/* Section: Record */}
        <div className="mb-8">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
            Record
          </p>
          <div className="bg-gray-50 rounded-2xl p-4">
            <ul className="space-y-2">
              <li className="text-base text-black flex items-start gap-2">
                <span className="text-gray-400">•</span>
                Record ID: <span className="font-mono text-sm">{activityData.record.recordId}</span>
              </li>
              <li className="text-base text-black flex items-start gap-2">
                <span className="text-gray-400">•</span>
                Ledger reference: <span className="font-mono text-sm">{activityData.record.ledgerRef}</span>
              </li>
              <li className="text-base text-black flex items-start gap-2">
                <span className="text-gray-400">•</span>
                Replay ID: <span className="font-mono text-sm">{activityData.record.replayId}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-6" />

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="w-full py-4 rounded-full text-base font-semibold bg-black text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Download record
        </button>
      </div>
    </Layout>
  );
}
