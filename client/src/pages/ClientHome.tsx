import { Link } from "wouter";

// Screen A — ACCOUNT OVERVIEW (Revolut-inspired design)
// Route: /client
// Purpose: Holdings-first view with large balance hero

export default function ClientHome() {
  // Mock data
  const totalValue = 73659.20;
  const totalReturn = 7159.20;
  const returnPercent = 10.8;
  
  const holdings = [
    { symbol: 'VAS', name: 'Vanguard Australian Shares', units: 250, price: 94.52, value: 23630, change: +2.3 },
    { symbol: 'VGS', name: 'Vanguard International Shares', units: 180, price: 118.30, value: 21294, change: +1.8 },
    { symbol: 'VGB', name: 'Vanguard Australian Bonds', units: 300, price: 47.85, value: 14355, change: -0.2 },
    { symbol: 'GOLD', name: 'Perth Mint Gold', units: 5, price: 295.60, value: 1478, change: +0.5 },
  ];
  
  const cashBalance = 12902.20;
  
  const recentActivity = [
    { type: 'buy', instrument: 'VAS', units: 15, value: 1417.80, time: 'Today, 10:32' },
    { type: 'deposit', amount: 2000, time: 'Yesterday' },
    { type: 'sell', instrument: 'VGB', units: 20, value: 957.00, time: '2 days ago' },
  ];

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
            <Link href="/client" className="px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-900">Home</Link>
            <Link href="/client/goals" className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900">Goals</Link>
            <Link href="/client/trade" className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900">Trade</Link>
            <Link href="/client/activity" className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900">Activity</Link>
          </nav>
          <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 pb-24">
        
        {/* Balance Hero */}
        <div className="py-8 text-center">
          <p className="text-sm text-gray-500 mb-1">Total value</p>
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
            ${totalValue.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
          </h1>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full">
            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span className="text-sm font-medium text-emerald-700">
              ${totalReturn.toLocaleString('en-AU')} ({returnPercent}%)
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Link 
            href="/client/trade"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Trade
          </Link>
          <Link 
            href="/client/goals/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            New goal
          </Link>
          <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
        </div>

        {/* Holdings Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Holdings</h2>
            <span className="text-xs text-gray-400">{holdings.length} instruments</span>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {holdings.map((holding, idx) => (
              <div 
                key={holding.symbol}
                className={`flex items-center justify-between p-4 ${idx !== holdings.length - 1 ? 'border-b border-gray-50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{holding.symbol.slice(0, 2)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{holding.symbol}</p>
                    <p className="text-sm text-gray-500">{holding.units} units</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${holding.value.toLocaleString('en-AU')}</p>
                  <p className={`text-sm ${holding.change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {holding.change >= 0 ? '+' : ''}{holding.change}%
                  </p>
                </div>
              </div>
            ))}
            
            {/* Cash */}
            <div className="flex items-center justify-between p-4 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">$</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Cash</p>
                  <p className="text-sm text-gray-500">Settlement account</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">${cashBalance.toLocaleString('en-AU')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent activity</h2>
            <Link href="/client/activity" className="text-xs text-blue-600 font-medium">See all</Link>
          </div>
          
          <div className="space-y-3">
            {recentActivity.map((activity, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    activity.type === 'buy' ? 'bg-emerald-100' :
                    activity.type === 'sell' ? 'bg-red-100' :
                    'bg-blue-100'
                  }`}>
                    {activity.type === 'buy' && (
                      <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    )}
                    {activity.type === 'sell' && (
                      <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    )}
                    {activity.type === 'deposit' && (
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {activity.type === 'buy' && `Buy ${activity.instrument}`}
                      {activity.type === 'sell' && `Sell ${activity.instrument}`}
                      {activity.type === 'deposit' && 'Deposit'}
                    </p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    activity.type === 'buy' ? 'text-gray-900' :
                    activity.type === 'sell' ? 'text-emerald-600' :
                    'text-emerald-600'
                  }`}>
                    {activity.type === 'buy' && `-$${activity.value?.toLocaleString('en-AU')}`}
                    {activity.type === 'sell' && `+$${activity.value?.toLocaleString('en-AU')}`}
                    {activity.type === 'deposit' && `+$${activity.amount?.toLocaleString('en-AU')}`}
                  </p>
                  {activity.units && (
                    <p className="text-sm text-gray-500">{activity.units} units</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Goals Summary Card */}
        <Link href="/client/goals" className="block mb-8">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Your goals</h3>
              <span className="text-sm text-gray-400">3 active</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">🏠 Home Deposit</span>
                <span className="font-medium">40%</span>
              </div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: '40%' }} />
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-400">View all goals →</p>
          </div>
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
