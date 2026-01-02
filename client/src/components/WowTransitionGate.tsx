/**
 * WowTransitionGate Component
 * 
 * Clean black section with single callout button.
 * No other text. Simple. Bold.
 */

import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export function WowTransitionGate() {
  const [, setLocation] = useLocation();

  const handleEnterSystem = () => {
    setLocation("/demo");
  };

  return (
    <section className="w-full bg-black py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-center">
          <Button
            onClick={handleEnterSystem}
            className="rounded-full px-10 py-7 text-lg md:text-xl bg-white text-black hover:bg-white/90 font-medium transition-colors"
          >
            You're about to enter the system.
          </Button>
        </div>
      </div>
    </section>
  );
}
