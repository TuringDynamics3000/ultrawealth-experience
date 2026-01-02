/**
 * TuringOS — System View (Reveal Screen 1)
 * 
 * This is NOT a demo, NOT a walkthrough, NOT UI-led.
 * This is a SYSTEM REVEAL.
 * 
 * Audience: Institutional investors, a16z-style evaluators, senior technologists, regulators
 * 
 * Four zones:
 * 1. System Status (TOP) - liveness and authority
 * 2. Intent → Policy Compilation (CORE) - why this is not UI-led
 * 3. Ledger & State Invariants (STRUCTURAL PROOF) - correctness under complexity
 * 4. Proof, Replay & Evidence (KNOCKOUT) - irreversibility and proof
 */

import { Button } from "@/components/ui/button";

export default function SystemView() {
  return (
    <div className="min-h-screen bg-[#0a0c10] text-white">
      {/* System Header - Environment Label */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-white/80 text-sm font-medium tracking-wide">TuringOS</span>
            <span className="text-white/40 text-xs font-light tracking-wider">Deterministic Financial Operating System</span>
          </div>
          <span className="text-white/30 text-xs font-mono">System View</span>
        </div>
      </header>

      {/* Main Content - Four Zones */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        
        {/* ZONE 1 — SYSTEM STATUS */}
        <section className="space-y-4">
          <div className="text-white/40 text-xs font-mono uppercase tracking-widest">System Status</div>
          <div 
            className="p-6 rounded-lg"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-1">
                <div className="text-white/40 text-xs font-mono">System</div>
                <div className="text-white text-lg font-medium">TuringOS</div>
              </div>
              <div className="space-y-1">
                <div className="text-white/40 text-xs font-mono">Status</div>
                <div className="text-emerald-400 text-lg font-medium">System running</div>
              </div>
              <div className="space-y-1">
                <div className="text-white/40 text-xs font-mono">Evaluation</div>
                <div className="text-white text-lg font-medium">Active policies enforced</div>
              </div>
              <div className="space-y-1">
                <div className="text-white/40 text-xs font-mono">Timestamp</div>
                <div className="text-white/70 text-lg font-light">Last evaluated moments ago</div>
              </div>
            </div>
          </div>
        </section>

        {/* ZONE 2 — INTENT → POLICY COMPILATION */}
        <section className="space-y-4">
          <div className="text-white/40 text-xs font-mono uppercase tracking-widest">Intent → Policy Compilation</div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Intent Panel */}
            <div 
              className="p-6 rounded-lg"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
            >
              <div className="text-white/50 text-xs font-mono mb-4">Intent</div>
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-white/60 text-sm">Goal</span>
                  <span className="text-white text-base font-medium">Home Deposit</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-white/60 text-sm">Timeframe</span>
                  <span className="text-white text-base font-medium">2026</span>
                </div>
              </div>
            </div>

            {/* Compiled Policy Panel */}
            <div 
              className="p-6 rounded-lg"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <div className="text-white/50 text-xs font-mono mb-4">Compiled Policy <span className="text-white/40">(Client-authorised)</span></div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <span className="text-white/80 text-sm">Capital preservation bias</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <span className="text-white/80 text-sm">Liquidity floor enforced</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <span className="text-white/80 text-sm">Drawdown band constrained</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <span className="text-white/80 text-sm">Rebalance thresholds defined</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ZONE 3 — LEDGER & STATE INVARIANTS */}
        <section className="space-y-4">
          <div className="text-white/40 text-xs font-mono uppercase tracking-widest">Ledger & State Invariants</div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Ledger Model */}
            <div 
              className="p-6 rounded-lg"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
            >
              <div className="text-white/50 text-xs font-mono mb-4">Ledger Model</div>
              <div className="space-y-2">
                <div className="text-white/80 text-sm">Event-sourced</div>
                <div className="text-white/80 text-sm">Dual-entry enforced</div>
              </div>
            </div>

            {/* Base Currency & Sub-ledgers */}
            <div 
              className="p-6 rounded-lg"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
            >
              <div className="text-white/50 text-xs font-mono mb-4">Currency Structure</div>
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-white/60 text-sm">Base Currency</span>
                  <span className="text-white font-mono text-sm">AUD</span>
                </div>
                <div>
                  <span className="text-white/60 text-sm">Sub-ledgers</span>
                  <div className="flex gap-2 mt-1">
                    <span className="text-white/70 font-mono text-xs px-2 py-1 bg-white/5 rounded">AUD</span>
                    <span className="text-white/70 font-mono text-xs px-2 py-1 bg-white/5 rounded">USD</span>
                    <span className="text-white/70 font-mono text-xs px-2 py-1 bg-white/5 rounded">EUR</span>
                  </div>
                </div>
              </div>
            </div>

            {/* State Invariants */}
            <div 
              className="p-6 rounded-lg"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <div className="text-white/50 text-xs font-mono mb-4">State Invariants</div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />
                  <span className="text-white/80 text-sm">No orphan value</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />
                  <span className="text-white/80 text-sm">Conservation enforced</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />
                  <span className="text-white/80 text-sm">Reconciled state only</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Representative Event */}
          <div 
            className="p-4 rounded-lg max-w-md"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            <div className="text-white/40 text-xs font-mono mb-2">Event</div>
            <div className="text-white/70 text-sm">
              Recorded event · Contribution authorised by policy · Currency: USD · Normalised: AUD
            </div>
          </div>
        </section>

        {/* ZONE 4 — PROOF, REPLAY & EVIDENCE */}
        <section className="space-y-4">
          <div className="text-white/40 text-xs font-mono uppercase tracking-widest">Proof, Replay & Evidence</div>
          <div 
            className="p-6 rounded-lg"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <div className="text-white/50 text-xs font-mono mb-6">Decision Trace</div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div>
                  <div className="text-white/40 text-xs font-mono">Decision</div>
                  <div className="text-white text-base font-medium">Policy condition met — rebalance executed</div>
                </div>
                <div>
                  <div className="text-white/40 text-xs font-mono">Policy</div>
                  <div className="text-white/80 text-sm">Home Deposit Policy</div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-white/40 text-xs font-mono">State Before</div>
                  <div className="text-white/60 font-mono text-sm">Hash: a91c…</div>
                </div>
                <div>
                  <div className="text-white/40 text-xs font-mono">State After</div>
                  <div className="text-white/60 font-mono text-sm">Hash: f02b…</div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-white/40 text-xs font-mono">Outcome</div>
                  <div className="text-emerald-400 text-base font-medium">Recorded</div>
                </div>
                <div>
                  <div className="text-white/40 text-xs font-mono">Replay</div>
                  <div className="text-white/80 text-sm">Replayable</div>
                </div>
              </div>
            </div>

            {/* Export Action */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <Button
                variant="outline"
                className="text-white/70 border-white/20 hover:bg-white/5 hover:text-white font-mono text-sm"
              >
                Export Evidence Pack
              </Button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
