import { useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { ArrowLeft } from "lucide-react";

const GOAL_TEMPLATES = [
  { id: "safety-net", label: "Safety Net" },
  { id: "home-deposit", label: "Home Deposit" },
  { id: "retirement", label: "Retirement" },
  { id: "education", label: "Education" },
  { id: "major-purchase", label: "Major Purchase" },
];

export default function GoalCreation() {
  const [, setLocation] = useLocation();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetMonth, setTargetMonth] = useState("");
  const [targetYear, setTargetYear] = useState("");

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    // Pre-fill goal name based on template
    const template = GOAL_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setGoalName(template.label);
    }
  };

  const handleContinue = () => {
    // Store goal metadata in sessionStorage
    sessionStorage.setItem("goalMetadata", JSON.stringify({
      name: goalName,
      targetAmount,
      targetDate: `${targetMonth}/${targetYear}`,
      template: selectedTemplate,
    }));
    
    // Navigate to Goal Builder (constraint authoring)
    const goalId = selectedTemplate || "custom";
    setLocation(`/goals/${goalId}/builder`);
  };

  // Allow "Work in progress" - only require goal name
  const isFormValid = goalName.trim().length > 0;

  return (
    <Layout>
      <div className="max-w-[480px] mx-auto px-5 py-8">
        
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
          Create a goal
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Define what you're saving for. You can update this anytime.
        </p>

        {/* Goal Templates */}
        <div className="mb-8">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">
            Common goals (optional)
          </p>
          <div className="flex flex-wrap gap-2">
            {GOAL_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTemplate === template.id
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-8" />

        {/* Goal Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Goal name
          </label>
          <input
            type="text"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            placeholder="Enter goal name"
            className="w-full p-4 rounded-xl border border-gray-200 text-base focus:outline-none focus:border-black transition-colors"
          />
        </div>

        {/* Target Amount */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target amount <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="text"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="0"
              className="w-full p-4 pl-8 rounded-xl border border-gray-200 text-base focus:outline-none focus:border-black transition-colors"
            />
          </div>
        </div>

        {/* Target Date */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target date <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={targetMonth}
              onChange={(e) => setTargetMonth(e.target.value.replace(/[^0-9]/g, '').slice(0, 2))}
              placeholder="MM"
              maxLength={2}
              className="w-20 p-4 rounded-xl border border-gray-200 text-base text-center focus:outline-none focus:border-black transition-colors"
            />
            <span className="flex items-center text-gray-400">/</span>
            <input
              type="text"
              value={targetYear}
              onChange={(e) => setTargetYear(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
              placeholder="YYYY"
              maxLength={4}
              className="w-28 p-4 rounded-xl border border-gray-200 text-base text-center focus:outline-none focus:border-black transition-colors"
            />
          </div>
        </div>

        {/* Info Note */}
        <div className="mb-8 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-600">
            You can leave amount and date blank to start. This creates a "work in progress" goal.
          </p>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!isFormValid}
          className={`w-full py-4 rounded-full text-base font-semibold transition-all ${
            isFormValid
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
