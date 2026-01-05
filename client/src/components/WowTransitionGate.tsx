/**
 * WowTransitionGate Component — SYSTEM REVEAL GATE
 * 
 * This is NOT a demo CTA. This is a SYSTEM REVEAL.
 * 
 * Object = system
 * Action = deliberate entry
 * 
 * The viewer is crossing a boundary, not being invited to "try" anything.
 * 
 * MICRO-ADJUSTMENTS APPLIED:
 * - Increased top margin (+28px)
 * - Increased spacing below card (+14px)
 * - Increased bottom padding (+24px)
 * - Reduced card radius (32px → 24px)
 * - Flattened elevation (reduced blur/offset)
 * - Increased "System running" weight (medium → semibold)
 * - Reduced "System running" tracking (-0.01em)
 * - Decreased "Last evaluated" weight (light → extralight)
 * - Increased CTA weight
 * - CTA radius matches card (24px)
 */

import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export function WowTransitionGate() {
  const [, setLocation] = useLocation();

  const handleEnterSystem = () => {
    setLocation("/client");
  };

  return (
    <div className="w-full bg-white">
      {/* Layer 1: PAUSE LAYER - Increased top margin (+28px) */}
      <div className="h-32 md:h-40" />

      {/* Layer 2: SYSTEM ANCHOR CARD */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center">
          {/* 
            Dark, systemic, glass-like card
            - Reduced radius: 32px → 24px (more infrastructural)
            - Flattened elevation (mounted, not floating)
          */}
          <div 
            className="relative w-full max-w-[580px] aspect-[3/4] overflow-hidden"
            style={{
              borderRadius: '24px',
              background: 'linear-gradient(180deg, rgba(6,8,10,0.97) 0%, rgba(10,13,18,0.98) 40%, rgba(12,16,22,0.97) 100%)',
              boxShadow: '0 6px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)'
            }}
            aria-hidden="true"
          >
            {/* Glass reflection - top highlight */}
            <div 
              className="absolute inset-x-0 top-0 h-2/5"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 40%, transparent 100%)',
                borderRadius: '24px 24px 0 0'
              }}
            />

            {/* Glass reflection - diagonal sheen */}
            <div 
              className="absolute inset-0"
              style={{
                borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%, rgba(255,255,255,0.02) 100%)'
              }}
            />

            {/* Inner glow for depth */}
            <div 
              className="absolute inset-[1px]"
              style={{
                borderRadius: '23px',
                boxShadow: 'inset 0 0 80px rgba(255,255,255,0.02)'
              }}
            />

            {/* Content Container */}
            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between z-10">
              
              {/* Top-left: TuringOS branding */}
              <div className="flex flex-col gap-1">
                <span className="text-white/60 text-xs md:text-sm font-medium tracking-wide">
                  TuringOS
                </span>
                <span className="text-white/35 text-[10px] md:text-xs font-light tracking-wider">
                  Deterministic Financial Operating System
                </span>
              </div>

              {/* Center: Primary signal - System status */}
              {/* Weight increased: medium → semibold */}
              {/* Tracking reduced: -0.01em */}
              <div className="flex flex-col items-center text-center">
                <div 
                  className="text-white font-semibold text-5xl md:text-6xl lg:text-7xl"
                  style={{ letterSpacing: '-0.01em' }}
                >
                  System running
                </div>
              </div>

              {/* Bottom: System hint */}
              {/* Weight decreased: light → extralight (font-extralight = 200) */}
              <div className="flex justify-center">
                <span className="text-white/40 text-sm md:text-base font-extralight">
                  Last evaluated moments ago
                </span>
              </div>
            </div>

            {/* Subtle bottom glow */}
            <div 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-48"
              style={{
                background: 'radial-gradient(ellipse at center bottom, rgba(255,255,255,0.03) 0%, transparent 70%)'
              }}
            />
          </div>

          {/* Layer 3: ENTRY ACTION */}
          {/* Increased spacing: +14px below card, +6px above CTA */}
          {/* Weight increased, radius matches card (24px) */}
          <div className="mt-16 md:mt-20">
            <Button
              onClick={handleEnterSystem}
              className="px-12 py-7 text-lg bg-[#111827] text-white hover:bg-[#0a0f18] font-semibold transition-colors tracking-wide"
              style={{ borderRadius: '24px' }}
            >
              Enter the system
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom spacing - Increased by +24px */}
      <div className="h-32 md:h-40" />
    </div>
  );
}
