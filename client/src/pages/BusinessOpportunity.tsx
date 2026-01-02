/**
 * TuringOS — Business Model
 * 
 * This is not a marketing page.
 * This is not a pricing explainer.
 * This is an economic proof rendered visually.
 * 
 * Design principles:
 * - Single argument, not sections
 * - Kernel dominance
 * - Irreversibility over motion
 * - Institutional tone
 * - No decoration
 * 
 * Success criterion: A senior investor can accurately summarise the 
 * business model without narration.
 */

import InstitutionalGravityDiagram from "@/components/InstitutionalGravityDiagram";

export default function BusinessOpportunity() {
  return (
    <div className="min-h-screen bg-[#0a0c10] text-white">
      {/* Header — minimal */}
      <header className="border-b border-white/8 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-white/70 text-sm font-medium tracking-wide">TuringOS</span>
            <span className="text-white/30 text-xs tracking-wider">Deterministic Financial Operating System</span>
          </div>
          <span className="text-white/20 text-xs font-mono">Business Model</span>
        </div>
      </header>

      {/* Main Content — single continuous argument */}
      <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        
        {/* HEADLINE & SUBLINE — calm, confident, final */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
            From Software Revenue to Institutional Rent
          </h1>
          <p className="text-white/40 text-lg max-w-3xl">
            UltraWealth is a wedge tenant. The kernel extracts rent across every regulated product that requires deterministic proof.
          </p>
        </div>

        {/* DIAGRAM — the economic proof */}
        <div 
          className="rounded-lg overflow-hidden"
          style={{
            border: '1px solid rgba(255,255,255,0.05)'
          }}
        >
          <InstitutionalGravityDiagram />
        </div>

        {/* PROOF STRUCTURE — single continuous argument */}
        <div className="space-y-10 pt-4">
          
          {/* Statement 1: What the kernel does */}
          <div className="max-w-3xl">
            <p className="text-white/80 text-base leading-relaxed">
              The kernel executes policy-authorised decisions and generates non-reproducible proof. 
              Every automated decision increases proof density. Proof density compounds institutional dependency.
            </p>
          </div>

          {/* Statement 2: How rent is extracted */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-white/90 font-medium">Kernel Retainer</div>
              <div className="text-white/50 text-sm">
                The cost of remaining inside the system of record. Removal breaks audit continuity.
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-white/90 font-medium">Decision Throughput</div>
              <div className="text-white/50 text-sm">
                Revenue per policy-authorised execution. Automation increases throughput. Throughput increases rent.
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-white/90 font-medium">Regulatory Surface</div>
              <div className="text-white/50 text-sm">
                New rules, jurisdictions, and products expand spend. Regulatory change is monetized, not absorbed.
              </div>
            </div>
          </div>

          {/* Statement 3: Why this compounds */}
          <div 
            className="p-6 rounded-lg max-w-3xl"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            <div className="space-y-4">
              <div className="text-white/70 text-sm">
                More products run on the kernel. More decisions execute. More proof accumulates.
              </div>
              <div className="text-white/70 text-sm">
                Regulators, auditors, and boards anchor to that proof.
              </div>
              <div className="text-white/90 text-sm font-medium">
                Exit cost exceeds licence cost. Switching requires re-proving institutional history.
              </div>
            </div>
          </div>

          {/* Statement 4: Why incumbents lose — structural, not competitive */}
          <div className="space-y-4">
            <div className="text-white/30 text-xs font-mono uppercase tracking-widest">Structural failure</div>
            <div className="grid md:grid-cols-2 gap-4 max-w-3xl">
              <div className="text-white/50 text-sm">
                <span className="text-white/70">Architecture debt.</span> Transactional systems cannot be retrofitted into deterministic proof engines.
              </div>
              <div className="text-white/50 text-sm">
                <span className="text-white/70">Historical proof gap.</span> They cannot recreate years of decision evidence.
              </div>
              <div className="text-white/50 text-sm">
                <span className="text-white/70">Regulatory risk.</span> Migrating systems invalidates past compliance artefacts.
              </div>
              <div className="text-white/50 text-sm">
                <span className="text-white/70">Economic disincentive.</span> Their revenue models collapse if decisions become automated.
              </div>
            </div>
          </div>

        </div>

        {/* CLOSING — factual, final */}
        <div className="pt-8 border-t border-white/5">
          <p className="text-white/60 text-base">
            TuringOS becomes the default system of record for regulated decisions. 
            Exiting requires re-proving institutional history. 
            <span className="text-white/80 font-medium"> At this point, exit ceases to be a rational option.</span>
          </p>
        </div>

      </main>
    </div>
  );
}
