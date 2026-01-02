/**
 * TuringOS — Business Model: Wedge → Platform
 * 
 * a16z-grade rewrite: institutional rent framing, proof as economic primitive,
 * why incumbents structurally lose.
 * 
 * Audience: Top-tier venture investors evaluating category-defining financial infrastructure.
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
        
        {/* PAGE TITLE & SUBTITLE */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
            From Product Revenue to Platform Rent
          </h1>
          <p className="text-white/50 text-lg font-light max-w-3xl">
            UltraWealth validates the kernel. The kernel extracts rent across every regulated product that requires deterministic proof.
          </p>
        </div>

        {/* DIAGRAM: Wedge → Kernel → Regulatory Gravity */}
        <section className="space-y-4">
          <div className="text-white/40 text-xs font-mono uppercase tracking-widest">Architecture</div>
          <div 
            className="p-8 rounded-lg"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.00) 100%)',
              border: '1px solid rgba(255,255,255,0.06)'
            }}
          >
            {/* Diagram Container */}
            <div className="relative">
              
              {/* Top: Wedge Product */}
              <div className="flex justify-center mb-6">
                <div 
                  className="px-6 py-3 rounded border text-center"
                  style={{ 
                    background: 'rgba(255,255,255,0.03)',
                    borderColor: 'rgba(255,255,255,0.15)'
                  }}
                >
                  <div className="text-white/40 text-xs font-mono mb-1">WEDGE PRODUCT</div>
                  <div className="text-white/80 text-sm font-medium">UltraWealth</div>
                </div>
              </div>

              {/* Arrow down */}
              <div className="flex justify-center mb-6">
                <div className="text-white/30 text-lg">↓</div>
              </div>

              {/* Center: The Kernel */}
              <div className="flex justify-center mb-6">
                <div 
                  className="px-10 py-6 rounded-lg border-2 text-center max-w-md"
                  style={{ 
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                    borderColor: 'rgba(255,255,255,0.20)'
                  }}
                >
                  <div className="text-white/50 text-xs font-mono mb-2">DETERMINISTIC DECISION & PROOF KERNEL</div>
                  <div className="text-white text-lg font-semibold">TuringOS</div>
                  <div className="text-white/40 text-xs mt-2">Policy → Execution → Evidence</div>
                </div>
              </div>

              {/* Arrow down */}
              <div className="flex justify-center mb-6">
                <div className="text-white/30 text-lg">↓</div>
              </div>

              {/* Proof Accumulation Layer */}
              <div className="flex justify-center mb-6">
                <div 
                  className="w-full max-w-lg px-6 py-4 rounded border text-center"
                  style={{ 
                    background: 'rgba(255,255,255,0.02)',
                    borderColor: 'rgba(255,255,255,0.10)'
                  }}
                >
                  <div className="text-white/40 text-xs font-mono mb-2">IRREVERSIBLE PROOF ACCUMULATION</div>
                  <div className="flex justify-center gap-4 text-white/50 text-xs">
                    <span>Decision hashes</span>
                    <span>·</span>
                    <span>State transitions</span>
                    <span>·</span>
                    <span>Evidence packs</span>
                  </div>
                </div>
              </div>

              {/* Arrows to anchors */}
              <div className="flex justify-center gap-8 mb-4">
                <div className="text-white/20 text-sm">↙</div>
                <div className="text-white/20 text-sm">↓</div>
                <div className="text-white/20 text-sm">↘</div>
              </div>

              {/* Bottom: Regulatory Anchors */}
              <div className="flex justify-center gap-4 flex-wrap">
                <div 
                  className="px-4 py-2 rounded text-center"
                  style={{ 
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  <div className="text-white/60 text-xs font-medium">Regulators</div>
                </div>
                <div 
                  className="px-4 py-2 rounded text-center"
                  style={{ 
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  <div className="text-white/60 text-xs font-medium">Auditors</div>
                </div>
                <div 
                  className="px-4 py-2 rounded text-center"
                  style={{ 
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  <div className="text-white/60 text-xs font-medium">Boards</div>
                </div>
              </div>

              {/* Legacy Systems - Blocked */}
              <div className="mt-8 pt-6 border-t border-white/5">
                <div className="flex items-center justify-center gap-4">
                  <div 
                    className="px-4 py-2 rounded text-center opacity-40"
                    style={{ 
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px dashed rgba(255,255,255,0.10)'
                    }}
                  >
                    <div className="text-white/40 text-xs">Legacy Systems</div>
                  </div>
                  <div className="text-red-400/60 text-xs font-mono">✕ NO MIGRATION PATH</div>
                  <div className="text-white/30 text-xs">Cannot recreate historical proof</div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* THE THESIS */}
        <section className="space-y-4">
          <div className="text-white/40 text-xs font-mono uppercase tracking-widest">The Thesis</div>
          <div 
            className="p-8 rounded-lg"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
              border: '1px solid rgba(255,255,255,0.10)'
            }}
          >
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <span className="w-1.5 h-1.5 rounded-full bg-white/50 mt-2.5 shrink-0" />
                <span className="text-white/90 text-lg">Proof is the unit of trust in regulated systems.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-1.5 h-1.5 rounded-full bg-white/50 mt-2.5 shrink-0" />
                <span className="text-white/90 text-lg">When proof is default, compliance cost becomes a by-product.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-1.5 h-1.5 rounded-full bg-white/50 mt-2.5 shrink-0" />
                <span className="text-white/90 text-lg">Switching costs are evidentiary. Leaving requires re-proving history.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* MONETIZATION STACK */}
        <section className="space-y-4">
          <div className="text-white/40 text-xs font-mono uppercase tracking-widest">Monetization Stack</div>
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Block 1: Kernel Retainer */}
            <div 
              className="p-6 rounded-lg space-y-4"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <div className="text-white font-semibold text-lg">Kernel Retainer</div>
              <div className="space-y-3">
                <div>
                  <div className="text-white/40 text-xs font-mono mb-1">What it represents</div>
                  <div className="text-white/70 text-sm">The cost of being inside the system of record. Removal breaks audit continuity.</div>
                </div>
                <div>
                  <div className="text-white/40 text-xs font-mono mb-1">Why it scales</div>
                  <div className="text-white/70 text-sm">Recurring revenue tied to institutional dependency, not feature usage.</div>
                </div>
              </div>
            </div>

            {/* Block 2: Decision Throughput */}
            <div 
              className="p-6 rounded-lg space-y-4"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <div className="text-white font-semibold text-lg">Decision Throughput</div>
              <div className="space-y-3">
                <div>
                  <div className="text-white/40 text-xs font-mono mb-1">What it represents</div>
                  <div className="text-white/70 text-sm">Revenue per policy-authorised execution. Increases as automation increases.</div>
                </div>
                <div>
                  <div className="text-white/40 text-xs font-mono mb-1">Why it scales</div>
                  <div className="text-white/70 text-sm">The opposite of SaaS margin compression. More automation means more revenue.</div>
                </div>
              </div>
            </div>

            {/* Block 3: Regulatory Surface Expansion */}
            <div 
              className="p-6 rounded-lg space-y-4"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <div className="text-white font-semibold text-lg">Regulatory Surface</div>
              <div className="space-y-3">
                <div>
                  <div className="text-white/40 text-xs font-mono mb-1">What it represents</div>
                  <div className="text-white/70 text-sm">Monetization of regulatory change. New rules, jurisdictions, and products expand spend automatically.</div>
                </div>
                <div>
                  <div className="text-white/40 text-xs font-mono mb-1">Why it scales</div>
                  <div className="text-white/70 text-sm">High margin. Expands with regulation, not customer acquisition.</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* COMPOUNDING MECHANISM */}
        <section className="space-y-4">
          <div className="text-white/40 text-xs font-mono uppercase tracking-widest">Compounding Mechanism</div>
          <div 
            className="p-8 rounded-lg"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)',
              border: '1px solid rgba(255,255,255,0.06)'
            }}
          >
            {/* 4-step institutional trap */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <span className="text-white/60 font-mono text-sm">1</span>
                </div>
                <span className="text-white/80 text-base">More products run on the kernel.</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <span className="text-white/60 font-mono text-sm">2</span>
                </div>
                <span className="text-white/80 text-base">More decisions execute. More proof accumulates.</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <span className="text-white/60 font-mono text-sm">3</span>
                </div>
                <span className="text-white/80 text-base">Regulators, auditors, and boards anchor to that proof.</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <span className="text-white/60 font-mono text-sm">4</span>
                </div>
                <span className="text-white/80 text-base">Exit cost exceeds licence cost. Switching requires re-proving history.</span>
              </div>
            </div>

            {/* Closing line */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-white/60 text-sm">
                Compounding continues even if customer growth slows.
              </p>
            </div>
          </div>
        </section>

        {/* WHY INCUMBENTS LOSE */}
        <section className="space-y-4">
          <div className="text-white/40 text-xs font-mono uppercase tracking-widest">Why Incumbents Lose</div>
          <div className="grid md:grid-cols-2 gap-6">
            
            <div 
              className="p-6 rounded-lg"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
            >
              <div className="text-white font-medium text-base mb-2">Architecture Debt</div>
              <div className="text-white/60 text-sm">Transactional systems cannot be retrofitted into deterministic proof engines.</div>
            </div>

            <div 
              className="p-6 rounded-lg"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
            >
              <div className="text-white font-medium text-base mb-2">Historical Proof Gap</div>
              <div className="text-white/60 text-sm">They cannot recreate years of decision evidence.</div>
            </div>

            <div 
              className="p-6 rounded-lg"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
            >
              <div className="text-white font-medium text-base mb-2">Regulatory Risk Asymmetry</div>
              <div className="text-white/60 text-sm">Migrating systems invalidates past compliance artefacts.</div>
            </div>

            <div 
              className="p-6 rounded-lg"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
            >
              <div className="text-white font-medium text-base mb-2">Economic Disincentives</div>
              <div className="text-white/60 text-sm">Their revenue models collapse if decisions become cheaper and automated.</div>
            </div>

          </div>
        </section>

        {/* ULTRAWEALTH POSITIONING */}
        <section className="space-y-4">
          <div className="text-white/40 text-xs font-mono uppercase tracking-widest">UltraWealth Positioning</div>
          <div 
            className="p-6 rounded-lg"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)',
              border: '1px solid rgba(255,255,255,0.06)'
            }}
          >
            <div className="space-y-4">
              <p className="text-white/80 text-base">
                UltraWealth is not the core business. It exists to generate real regulatory artefacts, validate kernel economics, and accelerate institutional sales.
              </p>
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
              <p className="text-white/50 text-sm pt-2">
                The kernel survives even if UltraWealth is spun out, sold, or shut down.
              </p>
            </div>
          </div>
        </section>

        {/* CLOSING ASSERTION */}
        <div className="pt-8 border-t border-white/10">
          <p className="text-white/70 text-base font-medium">
            TuringOS becomes the default decision system of record. Exiting requires re-proving institutional history.
          </p>
        </div>

      </main>
    </div>
  );
}
