/**
 * WowTransitionGate Component (Revised)
 * 
 * The intentional transition point on the UltraWealth WOW landing page.
 * Now includes a Demo Preview Card as a visual anchor - a portal from story to proof.
 * 
 * Three layers:
 * 1. Pause Layer - White space, clear separation
 * 2. Anchor Object - Demo Preview Card (symbolic, not informative)
 * 3. Decision Layer - CTA heading and buttons
 * 
 * After seeing this section, the viewer should think: "Okay. Show me the proof."
 */

import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Clock } from "lucide-react";

export function WowTransitionGate() {
  const [, setLocation] = useLocation();

  const handleSeeDemo = () => {
    setLocation("/demo");
  };

  return (
    <div className="w-full bg-white">
      {/* Layer 1: Pause Layer - White space separation */}
      <div className="h-16 md:h-24" />

      {/* Layer 2: Anchor Object - Demo Preview Card */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-center">
          {/* Demo Preview Card - Symbolic portal to the system */}
          <div 
            className="relative w-full max-w-md h-[320px] md:h-[380px] rounded-[32px] overflow-hidden shadow-2xl cursor-pointer group transition-transform duration-300 hover:-translate-y-2"
            onClick={handleSeeDemo}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSeeDemo()}
            aria-label="Enter the demo"
          >
            {/* Abstract architectural background - muted, premium feel */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]" />
            
            {/* Subtle geometric pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl transform -translate-x-1/4 translate-y-1/4" />
            </div>

            {/* Content Container */}
            <div className="absolute inset-0 p-8 flex flex-col justify-between">
              
              {/* Top Section */}
              <div className="flex flex-col gap-2">
                <span className="text-white/60 text-xs font-medium tracking-widest uppercase">
                  Primary Goal
                </span>
                
                {/* Status - Neutral, symbolic */}
                <div className="text-white font-semibold text-3xl md:text-4xl tracking-tight mt-2">
                  On track
                </div>
                
                <div className="text-white/50 text-lg font-medium">
                  Target 2029
                </div>
              </div>

              {/* Bottom Section */}
              <div className="flex flex-col gap-4">
                {/* System hint pill */}
                <div className="self-start">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 flex items-center gap-2 text-white/70 text-sm">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Updated moments ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hover overlay - subtle glow effect */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
          </div>
        </div>
      </div>

      {/* Layer 3: Decision Layer - CTA */}
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#111827] tracking-tight mb-4">
            Now see it work
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

      {/* Bottom spacing */}
      <div className="h-8 md:h-12" />
    </div>
  );
}
