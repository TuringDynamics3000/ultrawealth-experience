/**
 * WowTransitionGate Component
 * 
 * Clean black section with white reversed-out text.
 * No card. Bold typography. Simple.
 */

import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export function WowTransitionGate() {
  const [, setLocation] = useLocation();

  const handleSeeDemo = () => {
    setLocation("/demo");
  };

  return (
    <section className="w-full bg-black py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Heading - Bold, white on black */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
            Now see it work
          </h2>

          {/* Supporting line - White, slightly muted */}
          <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl">
            A short walkthrough, then the underlying artifacts.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Primary action - White button on black */}
            <Button
              onClick={handleSeeDemo}
              className="rounded-full px-8 py-6 text-lg bg-white text-black hover:bg-white/90 font-medium transition-colors"
            >
              See the demo
            </Button>

            {/* Secondary action - Subtle white text */}
            <button
              type="button"
              className="text-white/70 hover:text-white text-base font-medium underline underline-offset-4 transition-colors"
            >
              Under the Hood
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
