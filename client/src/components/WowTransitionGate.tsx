/**
 * WowTransitionGate Component
 * 
 * The Anchor Card is a PORTAL OBJECT, not a feature card.
 * 
 * Purpose:
 * - Restore visual energy at the Transition Gate
 * - Signal a threshold moment
 * - Bridge from story → system
 * - Prepare the viewer psychologically for inspection
 * 
 * If this card feels informational, it has failed.
 * 
 * Psychological effect: "I'm about to step into the real system."
 */

import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export function WowTransitionGate() {
  const [, setLocation] = useLocation();

  const handleSeeDemo = () => {
    setLocation("/demo");
  };

  return (
    <div className="w-full bg-white">
      {/* Layer 1: Pause Layer - Whitespace after Section 3 */}
      <div className="h-20 md:h-28" />

      {/* Layer 2: Anchor Card - Portal Object (NON-INTERACTIVE) */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-center">
          {/* 
            Anchor Card Geometry:
            - Width: ~480-560px (desktop)
            - Aspect ratio: portrait/soft-portrait
            - Border radius: large (match carousel cards - 32px)
            - Elevation: subtle shadow
            - Background: abstracted/architectural texture
            
            This is the DOMINANT visual object in this section.
            Must feel like a continuation of the carousel, not a new component family.
          */}
          <div 
            className="relative w-full max-w-[520px] aspect-[3/4] rounded-[32px] overflow-hidden shadow-xl"
            aria-hidden="true"
          >
            {/* 
              Background Treatment: Soft System Motif
              - Light layered planes with depth cue
              - No diagrams, no technical symbols
              - Architectural, less human focus than carousel
              - "System context" feeling
            */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#f8f7f4] via-[#f0ede6] to-[#e8e4db]" />
            
            {/* Subtle depth layers - soft system motif */}
            <div className="absolute inset-0">
              {/* Layered planes for depth */}
              <div className="absolute top-[15%] left-[10%] w-[80%] h-[70%] bg-white/60 rounded-3xl shadow-sm" />
              <div className="absolute top-[20%] left-[15%] w-[70%] h-[60%] bg-white/80 rounded-2xl shadow-md" />
              <div className="absolute top-[25%] left-[20%] w-[60%] h-[50%] bg-white rounded-xl shadow-lg" />
            </div>

            {/* Content Container - Minimal & Symbolic */}
            <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
              
              {/* Top micro-label (optional) - Small, muted, not interactive */}
              <div>
                <span className="text-[#6F6A63]/60 text-xs font-medium tracking-widest uppercase">
                  Primary goal
                </span>
              </div>

              {/* Center: Primary Signal (ONE ONLY) - Symbolic status, not data */}
              <div className="flex flex-col items-center text-center">
                <div className="text-[#111827] font-semibold text-3xl md:text-4xl tracking-tight">
                  On track
                </div>
                
                {/* Sub-signal - Hints at liveness, not mechanics */}
                <div className="text-[#6F6A63]/70 text-sm mt-3">
                  Updated moments ago
                </div>
              </div>

              {/* Bottom spacer */}
              <div />
            </div>
          </div>
        </div>
      </div>

      {/* Layer 3: Decision Layer - CTA */}
      <div className="container mx-auto px-4 md:px-6 py-14 md:py-20">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          {/* Heading - Short, calm, decisive */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#111827] tracking-tight mb-4">
            Now see it work
          </h2>

          {/* Supporting line - One sentence only */}
          <p className="text-lg md:text-xl text-[#6F6A63] mb-10">
            A short walkthrough, then the underlying artifacts.
          </p>

          {/* Actions - Primary must be visually dominant */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Primary action */}
            <Button
              onClick={handleSeeDemo}
              className="rounded-full px-8 py-6 text-lg bg-[#111827] text-white hover:bg-[#111827]/90 font-medium transition-colors"
            >
              See the demo
            </Button>

            {/* Secondary action (optional) - Subtle */}
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
