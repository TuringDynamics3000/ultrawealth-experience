import { useState } from "react";
import { Link } from "wouter";

// Screen D — GOALS DASHBOARD (Revolut-inspired design)
// Route: /client/goals
// Purpose: Priority ordering + waterfall allocation

interface Goal {
  id: string;
  name: string;
  icon: string;
  targetAmount: number;
  currentValue: number;
  targetDate: string;
  status: 'within-range' | 'outside-range' | 'paused';
  rules: string[];
}

const initialGoals: Goal[] = [
  {
    id: 'goal-1',
    name: 'Home Deposit',
    icon: '🏠',
    targetAmount: 120000,
    currentValue: 47850,
    targetDate: '2026-12',
    status: 'within-range',
    rules: ['Max 40% per instrument', 'Drift ±5%'],
  },
  {
    id: 'goal-2',
    name: 'Safety Net',
    icon: '🛡️',
    targetAmount: 25000,
    currentValue: 18500,
    targetDate: '2025-06',
    status: 'within-range',
    rules: ['Max 25% per instrument', 'Drift ±3%'],
  },
  {
    id: 'goal-3',
    name: 'Europe Trip',
    icon: '✈️',
    targetAmount: 15000,
    currentValue: 7309,
    targetDate: '2025-09',
    status: 'outside-range',
    rules: ['Max 50% per instrument', 'Drift ±10%'],
  },
];

export default function GoalsDashboard() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [waterfallEnabled, setWaterfallEnabled] = useState(true);

  const formatDate = (dateStr: string) => {
    const [year, month] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-AU', { month: 'short', year: 'numeric' });
  };

  const moveGoal = (index: number, direction: 'up' | 'down') => {
    const newGoals = [...goals];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= goals.length) return;
    [newGoals[index], newGoals[newIndex]] = [newGoals[newIndex], newGoals[index]];
    setGoals(newGoals);
  };

  const totalValue = goals.reduce((sum, g) => sum + g.currentValue, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">U</span>
            </div>
          </div>
          <nav className="flex items-center gap-1">
            <Link href="/client" className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900">Home</Link>
            <Link href="/client/goals" className="px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-900">Goals</Link>
            <Link href="/client/trade" className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900">Trade</Link>
            <Link href="/client/activity" className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900">Activity</Link>
          </nav>
          <Link href="/client/goals/new" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 pb-24">
        
        {/* Summary Hero */}
        <div className="py-8 text-center">
          <p className="text-sm text-gray-500 mb-1">Total across goals</p>
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
            ${totalValue.toLocaleString('en-AU')}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            of ${totalTarget.toLocaleString('en-AU')} target
          </p>
        </div>

        {/* Waterfall Toggle */}
        <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Priority allocation</p>
              <p className="text-sm text-gray-500">Contributions go to highest priority first</p>
            </div>
            <button
              onClick={() => setWaterfallEnabled(!waterfallEnabled)}
              className={`relative w-12 h-7 rounded-full transition-colors ${
                waterfallEnabled ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  waterfallEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          
          {waterfallEnabled && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Allocation order</p>
              <div className="flex items-center gap-2 text-sm flex-wrap">
                {goals.map((goal, idx) => (
                  <span key={goal.id} className="flex items-center gap-1">
                    <span className="w-5 h-5 bg-gray-900 text-white rounded-full text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700">{goal.icon}</span>
                    {idx < goals.length - 1 && <span className="text-gray-300 mx-1">→</span>}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Goals List */}
        <div className="space-y-4">
          {goals.map((goal, idx) => {
            const progress = (goal.currentValue / goal.targetAmount) * 100;
            
            return (
              <div key={goal.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <Link href={`/client/goals/${goal.id}`}>
                  <div className="p-4">
                    {/* Header Row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                          {goal.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-gray-900 text-white rounded-full text-xs flex items-center justify-center font-medium">
                              {idx + 1}
                            </span>
                            <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                          </div>
                          <p className="text-sm text-gray-500">{formatDate(goal.targetDate)}</p>
                        </div>
                      </div>
                      
                      {/* Reorder Buttons */}
                      <div className="flex flex-col gap-1" onClick={(e) => e.preventDefault()}>
                        <button
                          onClick={(e) => { e.preventDefault(); moveGoal(idx, 'up'); }}
                          disabled={idx === 0}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            idx === 0 ? 'text-gray-200' : 'text-gray-400 hover:bg-gray-100 active:bg-gray-200'
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => { e.preventDefault(); moveGoal(idx, 'down'); }}
                          disabled={idx === goals.length - 1}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            idx === goals.length - 1 ? 'text-gray-200' : 'text-gray-400 hover:bg-gray-100 active:bg-gray-200'
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-end justify-between mb-2">
                        <span className="text-2xl font-bold text-gray-900">
                          ${goal.currentValue.toLocaleString('en-AU')}
                        </span>
                        <span className="text-sm text-gray-500">
                          of ${goal.targetAmount.toLocaleString('en-AU')}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gray-900 rounded-full transition-all"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Status & Rules */}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        goal.status === 'within-range' 
                          ? 'bg-gray-100 text-gray-700' 
                          : goal.status === 'outside-range'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {goal.status === 'within-range' && 'Within target range'}
                        {goal.status === 'outside-range' && 'Outside target range'}
                        {goal.status === 'paused' && 'Paused by rule'}
                      </span>
                      <span className="text-xs text-gray-400">{goal.rules.length} rules →</span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Add Goal Button */}
        <Link 
          href="/client/goals/new"
          className="mt-6 flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="font-medium">Add new goal</span>
        </Link>

      </main>

      {/* Bottom Disclaimer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-3 px-4">
        <p className="text-xs text-gray-400 text-center max-w-lg mx-auto">
          Self-directed execution platform · No advice provided · Governed by TuringOS
        </p>
      </div>
    </div>
  );
}
