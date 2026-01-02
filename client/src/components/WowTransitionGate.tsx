/**
 * WowTransitionGate Component
 * 
 * The intentional transition point on the UltraWealth WOW landing page.
 * Moves the viewer from emotional alignment → proof.
 * 
 * Primary audience: Investors
 * After seeing this section, an investor should think: "Okay. Show me the proof."
 * 
 * This is NOT a signup CTA, onboarding, or feature explanation.
 */

import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export function WowTransitionGate() {
  const [, setLocation] = useLocation();

  const handleSeeDemo = () => {
    setLocation("/demo");
  };

  return (
    <div className="w-full py-24 md:py-32 bg-[#F9F7F2]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#111827] tracking-tight mb-4">
            See it in action
          </h2>

          {/* Supporting line */}
          <p className="text-lg md:text-xl text-[#6F6A63] mb-10">
            A short walkthrough, then the underlying artifacts.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Primary action - Investor path */}
            <Button
              onClick={handleSeeDemo}
              className="rounded-full px-8 py-6 text-lg bg-[#111827] text-white hover:bg-[#111827]/90 font-medium transition-colors"
            >
              See the demo
            </Button>

            {/* Secondary action - Subtle */}
            <button
              type="button"
              className="text-[#6F6A63] hover:text-[#111827] text-base font-medium underline underline-offset-4 transition-colors"
            >
              View what's inside
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
