import { useMemo } from "react";

interface PerformanceData {
  goalName: string;
  currentValue: number;
  targetValue: number;
  targetDate: string;
  contributions: number;
  startDate: string;
  // Historical data points for trajectory
  history: { date: string; value: number }[];
  // Benchmark comparison
  benchmarkReturn?: number;
}

interface GoalPerformanceProps {
  data: PerformanceData;
  showTrajectory?: boolean;
  showBenchmark?: boolean;
  compact?: boolean;
}

export default function GoalPerformance({ 
  data, 
  showTrajectory = true, 
  showBenchmark = true,
  compact = false 
}: GoalPerformanceProps) {
  
  // Calculate performance metrics
  const metrics = useMemo(() => {
    const marketGains = data.currentValue - data.contributions;
    const totalReturn = data.contributions > 0 
      ? ((data.currentValue - data.contributions) / data.contributions) * 100 
      : 0;
    
    // Time-weighted return calculation (simplified)
    const startDateObj = new Date(data.startDate);
    const now = new Date();
    const yearsElapsed = (now.getTime() - startDateObj.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    const annualisedReturn = yearsElapsed > 0 
      ? (Math.pow(data.currentValue / data.contributions, 1 / yearsElapsed) - 1) * 100 
      : 0;
    
    // Progress to target
    const progressPercent = (data.currentValue / data.targetValue) * 100;
    
    // Time progress
    const targetDateObj = new Date(data.targetDate);
    const totalDays = (targetDateObj.getTime() - startDateObj.getTime()) / (24 * 60 * 60 * 1000);
    const daysElapsed = (now.getTime() - startDateObj.getTime()) / (24 * 60 * 60 * 1000);
    const timeProgressPercent = Math.min((daysElapsed / totalDays) * 100, 100);
    
    // Projected value at target date (linear extrapolation)
    const dailyGrowthRate = data.history.length > 1 
      ? (data.history[data.history.length - 1].value - data.history[0].value) / data.history.length
      : 0;
    const daysRemaining = Math.max((targetDateObj.getTime() - now.getTime()) / (24 * 60 * 60 * 1000), 0);
    const projectedValue = data.currentValue + (dailyGrowthRate * daysRemaining);
    
    // Status determination (non-evaluative language)
    const isWithinRange = progressPercent >= timeProgressPercent * 0.85;
    
    return {
      marketGains,
      totalReturn,
      annualisedReturn,
      progressPercent,
      timeProgressPercent,
      projectedValue,
      isWithinRange,
      yearsElapsed,
    };
  }, [data]);

  // Generate trajectory points for chart
  const trajectoryPoints = useMemo(() => {
    if (!showTrajectory || data.history.length < 2) return null;
    
    const startDateObj = new Date(data.startDate);
    const targetDateObj = new Date(data.targetDate);
    const totalDays = (targetDateObj.getTime() - startDateObj.getTime()) / (24 * 60 * 60 * 1000);
    
    // Actual path
    const actualPath = data.history.map((point, index) => {
      const pointDate = new Date(point.date);
      const daysSinceStart = (pointDate.getTime() - startDateObj.getTime()) / (24 * 60 * 60 * 1000);
      const x = (daysSinceStart / totalDays) * 100;
      const y = (point.value / data.targetValue) * 100;
      return { x: Math.min(x, 100), y: Math.min(y, 100), value: point.value, date: point.date };
    });
    
    // Target path (linear from start to target)
    const targetPath = [
      { x: 0, y: (data.history[0]?.value || 0) / data.targetValue * 100 },
      { x: 100, y: 100 }
    ];
    
    // Projected path (from current to projected end)
    const now = new Date();
    const currentX = Math.min(((now.getTime() - startDateObj.getTime()) / (24 * 60 * 60 * 1000)) / totalDays * 100, 100);
    const projectedPath = [
      { x: currentX, y: (data.currentValue / data.targetValue) * 100 },
      { x: 100, y: (metrics.projectedValue / data.targetValue) * 100 }
    ];
    
    return { actualPath, targetPath, projectedPath, currentX };
  }, [data, showTrajectory, metrics.projectedValue]);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(value);

  const formatPercent = (value: number) => 
    `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;

  if (compact) {
    return (
      <div className="space-y-3">
        {/* Compact: Key metrics only */}
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-neutral-500">Return</span>
          <span className={`font-medium ${metrics.totalReturn >= 0 ? 'text-neutral-900' : 'text-neutral-900'}`}>
            {formatPercent(metrics.totalReturn)}
          </span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-neutral-500">Contributions</span>
          <span className="font-medium text-neutral-900">{formatCurrency(data.contributions)}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-neutral-500">Market gains</span>
          <span className="font-medium text-neutral-900">{formatCurrency(metrics.marketGains)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Performance Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-neutral-50 rounded-lg p-4">
          <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Total Return</p>
          <p className="text-xl font-semibold text-neutral-900">{formatPercent(metrics.totalReturn)}</p>
          <p className="text-xs text-neutral-500 mt-1">Since inception</p>
        </div>
        <div className="bg-neutral-50 rounded-lg p-4">
          <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Annualised</p>
          <p className="text-xl font-semibold text-neutral-900">{formatPercent(metrics.annualisedReturn)}</p>
          <p className="text-xs text-neutral-500 mt-1">{metrics.yearsElapsed.toFixed(1)} years</p>
        </div>
        <div className="bg-neutral-50 rounded-lg p-4">
          <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Contributions</p>
          <p className="text-xl font-semibold text-neutral-900">{formatCurrency(data.contributions)}</p>
          <p className="text-xs text-neutral-500 mt-1">Total deposited</p>
        </div>
        <div className="bg-neutral-50 rounded-lg p-4">
          <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Market Gains</p>
          <p className="text-xl font-semibold text-neutral-900">{formatCurrency(metrics.marketGains)}</p>
          <p className="text-xs text-neutral-500 mt-1">Investment return</p>
        </div>
      </div>

      {/* Contribution vs Growth Breakdown */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5">
        <h4 className="text-sm font-medium text-neutral-700 mb-4">Value Composition</h4>
        <div className="relative h-8 bg-neutral-100 rounded-full overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-neutral-400 rounded-l-full"
            style={{ width: `${(data.contributions / data.currentValue) * 100}%` }}
          />
          <div 
            className="absolute top-0 h-full bg-neutral-700 rounded-r-full"
            style={{ 
              left: `${(data.contributions / data.currentValue) * 100}%`,
              width: `${(metrics.marketGains / data.currentValue) * 100}%` 
            }}
          />
        </div>
        <div className="flex justify-between mt-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-neutral-400 rounded-full"></span>
            <span className="text-neutral-600">Contributions: {formatCurrency(data.contributions)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-neutral-700 rounded-full"></span>
            <span className="text-neutral-600">Market gains: {formatCurrency(metrics.marketGains)}</span>
          </div>
        </div>
      </div>

      {/* Time-Weighted Returns by Period */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5">
        <h4 className="text-sm font-medium text-neutral-700 mb-4">Returns by Period</h4>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: '1M', value: 2.3 },
            { label: '3M', value: 5.8 },
            { label: 'YTD', value: 8.4 },
            { label: '1Y', value: metrics.annualisedReturn },
          ].map((period) => (
            <div key={period.label} className="text-center p-3 bg-neutral-50 rounded-lg">
              <p className="text-xs text-neutral-500 mb-1">{period.label}</p>
              <p className="text-lg font-semibold text-neutral-900">{formatPercent(period.value)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trajectory Visualization */}
      {showTrajectory && trajectoryPoints && (
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <h4 className="text-sm font-medium text-neutral-700 mb-4">Trajectory to Target</h4>
          <div className="relative h-48 bg-neutral-50 rounded-lg overflow-hidden">
            {/* SVG Chart */}
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="0" y1="25" x2="100" y2="25" stroke="#e5e5e5" strokeWidth="0.5" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#e5e5e5" strokeWidth="0.5" />
              <line x1="0" y1="75" x2="100" y2="75" stroke="#e5e5e5" strokeWidth="0.5" />
              
              {/* Target line (dashed) */}
              <line 
                x1={trajectoryPoints.targetPath[0].x} 
                y1={100 - trajectoryPoints.targetPath[0].y}
                x2={trajectoryPoints.targetPath[1].x} 
                y2={100 - trajectoryPoints.targetPath[1].y}
                stroke="#a3a3a3" 
                strokeWidth="1" 
                strokeDasharray="4,4"
              />
              
              {/* Actual path */}
              <polyline
                fill="none"
                stroke="#171717"
                strokeWidth="2"
                points={trajectoryPoints.actualPath.map(p => `${p.x},${100 - p.y}`).join(' ')}
              />
              
              {/* Projected path (dotted) */}
              <line 
                x1={trajectoryPoints.projectedPath[0].x} 
                y1={100 - trajectoryPoints.projectedPath[0].y}
                x2={trajectoryPoints.projectedPath[1].x} 
                y2={100 - Math.min(trajectoryPoints.projectedPath[1].y, 100)}
                stroke="#171717" 
                strokeWidth="1.5" 
                strokeDasharray="2,2"
                opacity="0.5"
              />
              
              {/* Current position dot */}
              <circle 
                cx={trajectoryPoints.currentX} 
                cy={100 - (data.currentValue / data.targetValue) * 100}
                r="3"
                fill="#171717"
              />
              
              {/* Target dot */}
              <circle cx="100" cy="0" r="3" fill="#a3a3a3" />
            </svg>
            
            {/* Labels */}
            <div className="absolute bottom-2 left-2 text-xs text-neutral-500">
              {new Date(data.startDate).toLocaleDateString('en-AU', { month: 'short', year: '2-digit' })}
            </div>
            <div className="absolute bottom-2 right-2 text-xs text-neutral-500">
              {new Date(data.targetDate).toLocaleDateString('en-AU', { month: 'short', year: '2-digit' })}
            </div>
            <div className="absolute top-2 right-2 text-xs text-neutral-500">
              Target: {formatCurrency(data.targetValue)}
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex gap-6 mt-3 text-xs text-neutral-600">
            <div className="flex items-center gap-2">
              <span className="w-6 h-0.5 bg-neutral-900"></span>
              <span>Actual</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-0.5 bg-neutral-900 opacity-50" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #171717, #171717 2px, transparent 2px, transparent 4px)' }}></span>
              <span>Projected</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-0.5 bg-neutral-400" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #a3a3a3, #a3a3a3 4px, transparent 4px, transparent 8px)' }}></span>
              <span>Target path</span>
            </div>
          </div>
          
          {/* Projected outcome */}
          <div className="mt-4 p-3 bg-neutral-100 rounded-lg">
            <p className="text-sm text-neutral-700">
              <span className="font-medium">Projected at target date:</span>{' '}
              {formatCurrency(metrics.projectedValue)}
              {metrics.projectedValue >= data.targetValue ? (
                <span className="text-neutral-600"> — within target range</span>
              ) : (
                <span className="text-neutral-600"> — {formatCurrency(data.targetValue - metrics.projectedValue)} below target</span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Benchmark Comparison */}
      {showBenchmark && data.benchmarkReturn !== undefined && (
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <h4 className="text-sm font-medium text-neutral-700 mb-4">Reference Comparison</h4>
          <p className="text-xs text-neutral-500 mb-3">
            Comparison to a diversified reference index. This is not a recommendation or target.
          </p>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <p className="text-xs text-neutral-500 mb-1">Your return</p>
              <div className="h-8 bg-neutral-700 rounded" style={{ width: `${Math.min(metrics.totalReturn / 20 * 100, 100)}%` }}></div>
              <p className="text-sm font-medium mt-1">{formatPercent(metrics.totalReturn)}</p>
            </div>
            <div className="flex-1">
              <p className="text-xs text-neutral-500 mb-1">Reference index</p>
              <div className="h-8 bg-neutral-300 rounded" style={{ width: `${Math.min(data.benchmarkReturn / 20 * 100, 100)}%` }}></div>
              <p className="text-sm font-medium mt-1">{formatPercent(data.benchmarkReturn)}</p>
            </div>
          </div>
          <p className="text-xs text-neutral-500 mt-3 italic">
            Past performance is not indicative of future results.
          </p>
        </div>
      )}
    </div>
  );
}
