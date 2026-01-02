/**
 * HowItWorksFlow Component
 * 
 * A mental-model section that communicates how UltraWealth works day-to-day.
 * The user should think: "I don't need to manage this. It just stays on track."
 * 
 * This section must feel like a deep breath — calm, declarative, plain language.
 */

interface FlowStep {
  label: string;
  description: string;
}

const FLOW_STEPS: FlowStep[] = [
  {
    label: "Money in",
    description: "Your income arrives as usual.",
  },
  {
    label: "Goals update",
    description: "Your goals stay on track automatically.",
  },
  {
    label: "Portfolio adjusts",
    description: "Everything stays aligned behind the scenes.",
  },
];

export function HowItWorksFlow() {
  return (
    <div className="w-full py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Centered horizontal flow */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16">
          {FLOW_STEPS.map((step, index) => (
            <div key={step.label} className="flex items-center gap-8 md:gap-12 lg:gap-16">
              {/* Step content */}
              <div className="flex flex-col items-center text-center max-w-[200px]">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#111827] tracking-tight mb-3">
                  {step.label}
                </h3>
                <p className="text-base md:text-lg text-[#6F6A63] leading-relaxed">
                  {step.description}
                </p>
              </div>
              
              {/* Arrow separator (not after last item) */}
              {index < FLOW_STEPS.length - 1 && (
                <span 
                  className="hidden md:block text-3xl lg:text-4xl text-[#D1D5DB] font-light select-none" 
                  aria-hidden="true"
                >
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
