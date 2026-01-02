/**
 * TuringOS — Business Opportunity Screen
 * 
 * Gated investor reveal screen for a16z-style investors.
 * 
 * This screen makes the viewer conclude:
 * "UltraWealth is a wedge. TuringOS is a platform. The business compounds."
 * 
 * Three zones:
 * 1. The Thesis (inevitability panel)
 * 2. Monetization Stack (3-layer cards)
 * 3. Compounding Mechanism (the moat, visualized)
 */

export default function BusinessOpportunity() {
  return (
    <div className="min-h-screen bg-[#0a0c10] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-white/80 text-sm font-medium tracking-wide">TuringOS</span>
            <span className="text-white/40 text-xs font-light tracking-wider">Deterministic Financial Operating System</span>
          </div>
          <span className="text-white/30 text-xs font-mono">Business Model</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        
        {/* Screen Title */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
            Business Model: Wedge → Platform
          </h1>
          <p className="text-white/50 text-lg font-light max-w-2xl">
            UltraWealth proves the kernel; TuringOS monetizes across many regulated products.
          </p>
        </div>

        {/* ZONE 1 — THE THESIS */}
        <section className="space-y-4">
          <div className="text-white/40 text-xs font-mono uppercase tracking-widest">The Thesis</div>
          <div 
            className="p-8 rounded-lg"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
              border: '1px solid rgba(255,255,255,0.10)'
            }}
          >
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <span className="w-1.5 h-1.5 rounded-full bg-white/50 mt-2.5 shrink-0" />
                <span className="text-white/90 text-lg">Proof becomes the primitive.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-1.5 h-1.5 rounded-full bg-white/50 mt-2.5 shrink-0" />
                <span className="text-white/90 text-lg">Compliance cost per decision collapses when proof is default.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-1.5 h-1.5 rounded-full bg-white/50 mt-2.5 shrink-0" />
                <span className="text-white/90 text-lg">Once embedded, switching costs become institutional.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* ZONE 2 — MONETIZATION STACK */}
        <section className="space-y-4">
          <div className="text-white/40 text-xs font-mono uppercase tracking-widest">Monetization Stack</div>
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Card A — Kernel Subscription */}
            <div 
              className="p-6 rounded-lg space-y-4"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <div className="text-white font-semibold text-lg">Kernel Subscription</div>
              <div className="space-y-3">
                <div>
                  <div className="text-white/40 text-xs font-mono mb-1">What is charged</div>
                  <div className="text-white/70 text-sm">Per institution / per tenant deployment</div>
                </div>
                <div>
                  <div className="text-white/40 text-xs font-mono mb-1">Why it scales</div>
                  <div className="text-white/70 text-sm">Recurring base revenue tied to operational dependency</div>
                </div>
              </div>
            </div>

            {/* Card B — Proof & Decision Usage */}
            <div 
              className="p-6 rounded-lg space-y-4"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <div className="text-white font-semibold text-lg">Proof & Decision Usage</div>
              <div className="space-y-3">
                <div>
                  <div className="text-white/40 text-xs font-mono mb-1">What is charged</div>
                  <div className="text-white/70 text-sm">Per decision / workflow execution / evidence pack export</div>
                </div>
                <div>
                  <div className="text-white/40 text-xs font-mono mb-1">Why it scales</div>
                  <div className="text-white/70 text-sm">Directly increases with automation throughput</div>
                </div>
              </div>
            </div>

            {/* Card C — Risk & Compliance Overlays */}
            <div 
              className="p-6 rounded-lg space-y-4"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <div className="text-white font-semibold text-lg">Risk & Compliance Overlays</div>
              <div className="space-y-3">
                <div>
                  <div className="text-white/40 text-xs font-mono mb-1">What is charged</div>
                  <div className="text-white/70 text-sm">Audit exports, policy packs, regulator reporting, monitoring</div>
                </div>
                <div>
                  <div className="text-white/40 text-xs font-mono mb-1">Why it scales</div>
                  <div className="text-white/70 text-sm">High margin; expands as more regulated products run on the kernel</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ZONE 3 — COMPOUNDING MECHANISM */}
        <section className="space-y-4">
          <div className="text-white/40 text-xs font-mono uppercase tracking-widest">Compounding Mechanism</div>
          <div 
            className="p-8 rounded-lg"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)',
              border: '1px solid rgba(255,255,255,0.06)'
            }}
          >
            {/* Compounding Loop - 4 nodes */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
              {/* Node 1 */}
              <div className="flex flex-col items-center text-center px-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
                  <span className="text-white/60 font-mono text-sm">1</span>
                </div>
                <span className="text-white/80 text-sm font-medium">More tenants/products</span>
              </div>
              
              {/* Arrow */}
              <div className="hidden md:block text-white/30 text-2xl px-2">→</div>
              <div className="md:hidden text-white/30 text-2xl py-1">↓</div>
              
              {/* Node 2 */}
              <div className="flex flex-col items-center text-center px-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
                  <span className="text-white/60 font-mono text-sm">2</span>
                </div>
                <span className="text-white/80 text-sm font-medium">More decisions executed</span>
              </div>
              
              {/* Arrow */}
              <div className="hidden md:block text-white/30 text-2xl px-2">→</div>
              <div className="md:hidden text-white/30 text-2xl py-1">↓</div>
              
              {/* Node 3 */}
              <div className="flex flex-col items-center text-center px-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
                  <span className="text-white/60 font-mono text-sm">3</span>
                </div>
                <span className="text-white/80 text-sm font-medium">More proof/evidence generated</span>
              </div>
              
              {/* Arrow */}
              <div className="hidden md:block text-white/30 text-2xl px-2">→</div>
              <div className="md:hidden text-white/30 text-2xl py-1">↓</div>
              
              {/* Node 4 */}
              <div className="flex flex-col items-center text-center px-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
                  <span className="text-white/60 font-mono text-sm">4</span>
                </div>
                <span className="text-white/80 text-sm font-medium max-w-[140px]">Higher switching costs & higher margin overlays</span>
              </div>
            </div>

            {/* Loop back indicator */}
            <div className="mt-6 flex justify-center">
              <div className="text-white/20 text-sm font-mono">↻ compounds</div>
            </div>

            {/* Explicit line */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-white/70 text-base text-center italic">
                "UltraWealth is the wedge tenant; the kernel monetizes across the constellation."
              </p>
            </div>
          </div>
        </section>

        {/* UltraWealth Positioning */}
        <section className="space-y-4">
          <div className="text-white/40 text-xs font-mono uppercase tracking-widest">UltraWealth Positioning</div>
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm">
              Wedge tenant
            </span>
            <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm">
              Reference implementation
            </span>
            <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm">
              Proof of kernel economics
            </span>
          </div>
        </section>

        {/* Boundary Note */}
        <div className="pt-8 border-t border-white/10">
          <p className="text-white/40 text-sm font-light">
            Execution rails are delegated; authority and evidence remain in TuringOS.
          </p>
        </div>

      </main>
    </div>
  );
}
