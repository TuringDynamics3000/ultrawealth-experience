import { useState } from "react";
import { Link, useLocation } from "wouter";

// Screen B — GOAL CREATION (PROMPTED AUTHORSHIP)
// Route: /client/goals/new
// Purpose: help clients identify goals without advice

// Goal Library - prompts for common goal types
const goalLibrary = [
  { 
    id: 'safety-net', 
    name: 'Safety Net', 
    icon: '🛡️',
    description: 'Funds for unexpected expenses',
    defaultAmount: 25000,
    defaultMonths: 12,
  },
  { 
    id: 'home-deposit', 
    name: 'Home Deposit', 
    icon: '🏠',
    description: 'Saving for property purchase',
    defaultAmount: 120000,
    defaultMonths: 36,
  },
  { 
    id: 'retirement', 
    name: 'Retirement', 
    icon: '🌅',
    description: 'Long-term wealth accumulation',
    defaultAmount: 1000000,
    defaultMonths: 240,
  },
  { 
    id: 'education', 
    name: 'Education', 
    icon: '🎓',
    description: 'Funding education expenses',
    defaultAmount: 50000,
    defaultMonths: 48,
  },
  { 
    id: 'major-purchase', 
    name: 'Major Purchase', 
    icon: '🚗',
    description: 'Vehicle, renovation, or large item',
    defaultAmount: 40000,
    defaultMonths: 24,
  },
  { 
    id: 'travel', 
    name: 'Travel', 
    icon: '✈️',
    description: 'Holiday or travel fund',
    defaultAmount: 15000,
    defaultMonths: 18,
  },
  { 
    id: 'custom', 
    name: 'Custom Goal', 
    icon: '✏️',
    description: 'Define your own goal',
    defaultAmount: 10000,
    defaultMonths: 12,
  },
];

export default function GoalCreate() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<'select' | 'define'>('select');
  const [selectedGoal, setSelectedGoal] = useState<typeof goalLibrary[0] | null>(null);
  
  // Form state
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [allocationPercent, setAllocationPercent] = useState("40");
  const [driftTolerance, setDriftTolerance] = useState("5");
  const [isWorkInProgress, setIsWorkInProgress] = useState(false);

  const handleSelectGoal = (goal: typeof goalLibrary[0]) => {
    setSelectedGoal(goal);
    setGoalName(goal.id === 'custom' ? '' : goal.name);
    setTargetAmount(goal.defaultAmount.toString());
    
    // Calculate default target date
    const date = new Date();
    date.setMonth(date.getMonth() + goal.defaultMonths);
    setTargetDate(date.toISOString().slice(0, 7)); // YYYY-MM format
    
    setStep('define');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const goalId = `GOAL-${Date.now()}`;
    const params = new URLSearchParams({
      name: goalName,
      amount: targetAmount,
      date: targetDate,
      allocation: allocationPercent,
      drift: driftTolerance,
      wip: isWorkInProgress ? '1' : '0',
    });
    setLocation(`/client/goals/${goalId}/registered?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/client" className="text-lg font-semibold text-neutral-900">UltraWealth</Link>
            <span className="text-xs text-neutral-400 border-l border-neutral-200 pl-3">
              Self-directed trading · Governed by TuringOS
            </span>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/client" className="text-neutral-500 hover:text-neutral-900">Account</Link>
            <Link href="/client/goals" className="text-neutral-900 font-medium">Goals</Link>
            <Link href="/client/trade" className="text-neutral-500 hover:text-neutral-900">Trade</Link>
            <Link href="/client/activity" className="text-neutral-500 hover:text-neutral-900">Activity</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        
        {step === 'select' ? (
          <>
            {/* Goal Library Selection */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Create a goal</h1>
              <p className="text-neutral-600">
                Select a goal type to get started. You can change the details later.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {goalLibrary.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleSelectGoal(goal)}
                  className="text-left p-5 bg-white border border-neutral-200 rounded-xl hover:border-neutral-400 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">{goal.icon}</span>
                    <div>
                      <p className="font-medium text-neutral-900">{goal.name}</p>
                      <p className="text-sm text-neutral-500 mt-1">{goal.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="text-center">
              <Link href="/client/goals" className="text-sm text-neutral-500 hover:text-neutral-700">
                ← Back to goals
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Goal Definition Form */}
            <div className="mb-8">
              <button 
                onClick={() => setStep('select')}
                className="text-sm text-neutral-500 hover:text-neutral-700 mb-4 flex items-center gap-1"
              >
                ← Change goal type
              </button>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{selectedGoal?.icon}</span>
                <h1 className="text-2xl font-semibold text-neutral-900">Define your goal</h1>
              </div>
              <p className="text-neutral-600">
                These inputs define rules that constrain execution.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Goal Details Section */}
              <section className="bg-white rounded-xl border border-neutral-200 p-6">
                <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-6">Goal details</h2>
                
                <div className="space-y-5">
                  <div>
                    <label htmlFor="goalName" className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Goal name
                    </label>
                    <input
                      type="text"
                      id="goalName"
                      value={goalName}
                      onChange={(e) => setGoalName(e.target.value)}
                      placeholder="e.g., Home Deposit 2027"
                      required
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                    />
                    <p className="text-xs text-neutral-400 mt-1.5">You can change this later.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="targetAmount" className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Target amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">$</span>
                        <input
                          type="number"
                          id="targetAmount"
                          value={targetAmount}
                          onChange={(e) => setTargetAmount(e.target.value)}
                          placeholder="100,000"
                          required
                          min="1"
                          className="w-full pl-8 pr-4 py-2.5 border border-neutral-300 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                        />
                      </div>
                      <p className="text-xs text-neutral-400 mt-1.5">You can change this later.</p>
                    </div>

                    <div>
                      <label htmlFor="targetDate" className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Target date
                      </label>
                      <input
                        type="month"
                        id="targetDate"
                        value={targetDate}
                        onChange={(e) => setTargetDate(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                      />
                      <p className="text-xs text-neutral-400 mt-1.5">You can change this later.</p>
                    </div>
                  </div>

                  {/* Work in Progress Toggle */}
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="workInProgress"
                      checked={isWorkInProgress}
                      onChange={(e) => setIsWorkInProgress(e.target.checked)}
                      className="w-4 h-4 text-neutral-900 border-neutral-300 rounded focus:ring-neutral-900"
                    />
                    <label htmlFor="workInProgress" className="text-sm text-neutral-700">
                      Mark as "Work in progress" (still refining this goal)
                    </label>
                  </div>
                </div>
              </section>

              {/* Execution Rules Section */}
              <section className="bg-white rounded-xl border border-neutral-200 p-6">
                <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-2">Execution rules</h2>
                <p className="text-sm text-neutral-500 mb-6">
                  These rules constrain how your trades are applied. You place trades. The system enforces rules.
                </p>
                
                <div className="space-y-5">
                  <div>
                    <label htmlFor="allocationPercent" className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Maximum allocation per instrument
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        id="allocationPercent"
                        value={allocationPercent}
                        onChange={(e) => setAllocationPercent(e.target.value)}
                        min="10"
                        max="100"
                        step="5"
                        className="flex-1 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-sm font-medium text-neutral-900 w-12 text-right">{allocationPercent}%</span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1.5">
                      No single instrument may exceed {allocationPercent}% of this goal's value.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="driftTolerance" className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Drift tolerance
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        id="driftTolerance"
                        value={driftTolerance}
                        onChange={(e) => setDriftTolerance(e.target.value)}
                        min="1"
                        max="20"
                        step="1"
                        className="flex-1 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-sm font-medium text-neutral-900 w-12 text-right">±{driftTolerance}%</span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1.5">
                      You will be notified if allocation drifts beyond this threshold.
                    </p>
                  </div>
                </div>
              </section>

              {/* Authorship Block */}
              <div className="bg-neutral-100 rounded-lg p-4 border border-neutral-200">
                <p className="text-sm text-neutral-700">
                  <span className="font-medium">You author trades. These rules constrain execution. No advice is given.</span>
                </p>
                <p className="text-xs text-neutral-500 mt-2">
                  Rules become active upon registration and apply to future trades you place.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4">
                <Link 
                  href="/client/goals"
                  className="text-sm text-neutral-500 hover:text-neutral-700"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={!goalName || !targetAmount || !targetDate}
                  className="px-6 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Register rules
                </button>
              </div>

            </form>
          </>
        )}

      </main>
    </div>
  );
}
