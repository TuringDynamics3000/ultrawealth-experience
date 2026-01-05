import { Link, useParams } from "wouter";
import GoalPerformance from "@/components/GoalPerformance";

// Mock data for goals with full performance history
const goalsData: Record<string, {
  id: string;
  name: string;
  icon: string;
  currentValue: number;
  targetValue: number;
  targetDate: string;
  contributions: number;
  startDate: string;
  status: string;
  rules: string[];
  holdings: { ticker: string; name: string; units: number; price: number; value: number }[];
  history: { date: string; value: number }[];
  benchmarkReturn: number;
}> = {
  'goal-1': {
    id: 'goal-1',
    name: 'Home Deposit',
    icon: '🏠',
    currentValue: 47850.40,
    targetValue: 120000,
    targetDate: '2026-12-01',
    contributions: 42000,
    startDate: '2023-06-01',
    status: 'Within target range',
    rules: ['Max 40% per instrument', 'Drift ±5%'],
    holdings: [
      { ticker: 'VAS', name: 'Vanguard Australian Shares ETF', units: 180, price: 94.52, value: 17013.60 },
      { ticker: 'VGB', name: 'Vanguard Australian Fixed Interest', units: 440, price: 47.85, value: 21054.00 },
      { ticker: 'Cash', name: 'Settlement Account', units: 0, price: 0, value: 9782.80 },
    ],
    history: [
      { date: '2023-06-01', value: 5000 },
      { date: '2023-09-01', value: 12500 },
      { date: '2023-12-01', value: 18200 },
      { date: '2024-03-01', value: 24800 },
      { date: '2024-06-01', value: 31500 },
      { date: '2024-09-01', value: 38200 },
      { date: '2024-12-01', value: 43100 },
      { date: '2025-01-02', value: 47850.40 },
    ],
    benchmarkReturn: 12.4,
  },
  'goal-2': {
    id: 'goal-2',
    name: 'Safety Net',
    icon: '🛡️',
    currentValue: 18500,
    targetValue: 25000,
    targetDate: '2025-06-01',
    contributions: 17200,
    startDate: '2024-01-01',
    status: 'Within target range',
    rules: ['Max 25% per instrument', 'Drift ±3%'],
    holdings: [
      { ticker: 'VGB', name: 'Vanguard Australian Fixed Interest', units: 200, price: 47.85, value: 9570.00 },
      { ticker: 'Cash', name: 'Settlement Account', units: 0, price: 0, value: 8930.00 },
    ],
    history: [
      { date: '2024-01-01', value: 5000 },
      { date: '2024-04-01', value: 9500 },
      { date: '2024-07-01', value: 13200 },
      { date: '2024-10-01', value: 16800 },
      { date: '2025-01-02', value: 18500 },
    ],
    benchmarkReturn: 6.2,
  },
  'goal-3': {
    id: 'goal-3',
    name: 'Europe Trip',
    icon: '✈️',
    currentValue: 7309,
    targetValue: 15000,
    targetDate: '2025-09-01',
    contributions: 6500,
    startDate: '2024-03-01',
    status: 'Outside target range',
    rules: ['Max 50% per instrument', 'Drift ±10%'],
    holdings: [
      { ticker: 'VGS', name: 'Vanguard MSCI Intl Shares ETF', units: 35, price: 118.30, value: 4140.50 },
      { ticker: 'Cash', name: 'Settlement Account', units: 0, price: 0, value: 3168.50 },
    ],
    history: [
      { date: '2024-03-01', value: 2000 },
      { date: '2024-06-01', value: 3800 },
      { date: '2024-09-01', value: 5400 },
      { date: '2024-12-01', value: 6900 },
      { date: '2025-01-02', value: 7309 },
    ],
    benchmarkReturn: 14.8,
  },
};

export default function GoalDetail() {
  const params = useParams<{ id: string }>();
  const goalId = params.id || 'goal-1';
  const goal = goalsData[goalId];

  if (!goal) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Goal not found</p>
          <Link href="/client/goals" className="text-gray-900 underline mt-2 inline-block">
            Back to goals
          </Link>
        </div>
      </div>
    );
  }

  const progress = (goal.currentValue / goal.targetValue) * 100;
  const marketGains = goal.currentValue - goal.contributions;
  const contributionPercent = (goal.contributions / goal.currentValue) * 100;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/client/goals" className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <span className="font-semibold text-gray-900">{goal.name}</span>
          <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 pb-24">
        
        {/* Hero */}
        <div className="py-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
            {goal.icon}
          </div>
          <p className="text-sm text-gray-500 mb-1">Current value</p>
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
            ${goal.currentValue.toLocaleString('en-AU', { maximumFractionDigits: 0 })}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            of ${goal.targetValue.toLocaleString('en-AU')} by {new Date(goal.targetDate).toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })}
          </p>
          
          {/* Progress Bar */}
          <div className="mt-6 px-4">
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gray-900 rounded-full transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>{progress.toFixed(0)}% of target</span>
              <span className={`font-medium px-2 py-0.5 rounded-full ${
                goal.status === 'Within target range' 
                  ? 'bg-gray-100 text-gray-700' 
                  : 'bg-amber-50 text-amber-700'
              }`}>
                {goal.status}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mb-6">
          <Link href={`/client/trade?goal=${goal.id}`} className="flex-1 py-3 bg-gray-900 text-white text-center font-semibold rounded-xl">
            Add funds
          </Link>
          <Link href="/client/activity" className="flex-1 py-3 bg-gray-100 text-gray-900 text-center font-semibold rounded-xl">
            View history
          </Link>
        </div>

        {/* Performance Component */}
        <div className="mb-4">
          <GoalPerformance
            data={{
              goalName: goal.name,
              currentValue: goal.currentValue,
              targetValue: goal.targetValue,
              targetDate: goal.targetDate,
              contributions: goal.contributions,
              startDate: goal.startDate,
              history: goal.history,
              benchmarkReturn: goal.benchmarkReturn,
            }}
            showTrajectory={true}
            showBenchmark={true}
          />
        </div>

        {/* Value Composition Card */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <h3 className="font-semibold text-gray-900 mb-3">Value composition</h3>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden flex">
            <div 
              className="h-full bg-gray-400"
              style={{ width: `${contributionPercent}%` }}
            />
            <div 
              className="h-full bg-gray-900"
              style={{ width: `${100 - contributionPercent}%` }}
            />
          </div>
          <div className="flex justify-between mt-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
              <span className="text-gray-600">Contributions</span>
              <span className="font-semibold text-gray-900">${goal.contributions.toLocaleString('en-AU')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-gray-900 rounded-full"></span>
              <span className="text-gray-600">Gains</span>
              <span className="font-semibold text-gray-900">${marketGains.toLocaleString('en-AU', { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>

        {/* Holdings */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <h3 className="font-semibold text-gray-900 mb-4">Holdings</h3>
          <div className="space-y-3">
            {goal.holdings.map((holding) => (
              <div key={holding.ticker} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <span className="text-xs font-bold text-gray-700">{holding.ticker.substring(0, 3)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{holding.ticker}</p>
                    <p className="text-xs text-gray-500">
                      {holding.units > 0 ? `${holding.units} units @ $${holding.price.toFixed(2)}` : 'Settlement'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${holding.value.toLocaleString('en-AU', { maximumFractionDigits: 0 })}</p>
                  <p className="text-xs text-gray-500">{((holding.value / goal.currentValue) * 100).toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rules */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <h3 className="font-semibold text-gray-900 mb-3">Your rules</h3>
          <div className="space-y-2">
            {goal.rules.map((rule, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {rule}
              </div>
            ))}
          </div>
          <button className="mt-3 text-sm font-medium text-gray-900 hover:underline">
            Edit rules →
          </button>
        </div>

        {/* Reference Comparison */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Reference comparison</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Your return</span>
            <span className="font-semibold text-gray-900">
              +{(((goal.currentValue - goal.contributions) / goal.contributions) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">Reference index</span>
            <span className="font-medium text-gray-500">+{goal.benchmarkReturn}%</span>
          </div>
          <p className="text-xs text-gray-400">
            Past performance is not indicative of future results.
          </p>
        </div>

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
