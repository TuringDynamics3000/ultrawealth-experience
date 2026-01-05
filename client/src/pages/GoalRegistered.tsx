import { Link, useParams, useSearch } from "wouter";

export default function GoalRegistered() {
  const params = useParams<{ id: string }>();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  
  const goalName = searchParams.get("name") || "Home Deposit";
  const targetAmount = searchParams.get("amount") || "100000";
  const targetDate = searchParams.get("date") || "2026-12";
  const allocationPercent = searchParams.get("allocation") || "20";
  const driftTolerance = searchParams.get("drift") || "5";

  const formatDate = (dateStr: string) => {
    const [year, month] = dateStr.split("-");
    const monthNames = ["January", "February", "March", "April", "May", "June", 
                        "July", "August", "September", "October", "November", "December"];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const registrationTimestamp = new Date().toLocaleString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

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
      <main className="max-w-2xl mx-auto px-6 py-12">
        
        {/* Success State */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Rules registered</h1>
          <p className="text-neutral-600">
            Your execution rules are now active and will apply to future trades you place.
          </p>
        </div>

        {/* Goal Summary Card */}
        <section className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm text-neutral-500 mb-1">Goal</p>
              <h2 className="text-xl font-semibold text-neutral-900">{goalName}</h2>
            </div>
            <span className="px-3 py-1 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-full">
              Rules active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-neutral-500 mb-1">Target amount</p>
              <p className="text-lg font-medium text-neutral-900">
                ${parseInt(targetAmount).toLocaleString('en-AU')}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500 mb-1">Target date</p>
              <p className="text-lg font-medium text-neutral-900">
                {formatDate(targetDate)}
              </p>
            </div>
          </div>
        </section>

        {/* Registered Rules */}
        <section className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
          <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-4">Registered rules</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
              <div className="w-6 h-6 bg-neutral-200 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-neutral-600">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Maximum allocation: {allocationPercent}%</p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Up to {allocationPercent}% of incoming contributions may be allocated to this goal.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
              <div className="w-6 h-6 bg-neutral-200 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-neutral-600">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Drift tolerance: ±{driftTolerance}%</p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Rebalancing may be triggered if allocation drifts beyond this threshold.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
              <div className="w-6 h-6 bg-neutral-200 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-neutral-600">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Execution constraint</p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Rules apply only when you place trades or add funds. No automatic execution.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Explicit Disclaimer */}
        <div className="bg-neutral-900 text-white rounded-xl p-6 mb-8">
          <p className="text-sm font-medium mb-2">Self-directed execution</p>
          <p className="text-sm text-neutral-300">
            You author trades. These rules constrain execution. No advice is given. 
            All rule applications are recorded and provable via TuringOS.
          </p>
        </div>

        {/* Registration Details */}
        <div className="text-center text-xs text-neutral-400 mb-8">
          <p>Registered {registrationTimestamp}</p>
          <p className="font-mono mt-1">Rule ID: {params.id}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link 
            href="/client/trade"
            className="px-6 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors text-center"
          >
            Place a trade
          </Link>
          <Link 
            href="/client/goals"
            className="px-6 py-2.5 bg-white text-neutral-700 text-sm font-medium rounded-lg border border-neutral-300 hover:bg-neutral-50 transition-colors text-center"
          >
            View all goals
          </Link>
          <Link 
            href="/client"
            className="px-6 py-2.5 bg-white text-neutral-700 text-sm font-medium rounded-lg border border-neutral-300 hover:bg-neutral-50 transition-colors text-center"
          >
            Return to account
          </Link>
        </div>

      </main>
    </div>
  );
}
