/**
 * Goal Account Detail Page
 * 
 * Reads: Goal Account config, Holdings snapshot, Performance deltas, Evidence references
 * Props: { goalAccount: GoalAccountDetail }
 * 
 * Route: /goal-accounts/[goalAccountId]
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Hash, FileText, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useLocation, Link } from "wouter";
import type { GoalAccountDetail, Holding, Allocation, EvidenceReference, PerformanceDeltas } from "@/contracts/goal-account";
import { SEED_DATA } from "@/demo/seed";

interface GoalAccountDetailPageProps {
  goalAccountId?: string;
}

// Use centralized seed data - in production, this comes from TuringCore API
const DEMO_GOAL_ACCOUNT = SEED_DATA.goalAccountDetails['ga_001']!;

function formatCents(cents: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

function GainIndicator({ value }: { value: number }) {
  if (value > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
  if (value < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
  return <Minus className="w-4 h-4 text-slate-400" />;
}

export default function GoalAccountDetailPage({ goalAccountId }: GoalAccountDetailPageProps) {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  // Wait for auth to load before checking
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Loading goal account...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    setLocation('/login');
    return null;
  }

  // In production, fetch based on goalAccountId
  const goalAccount = DEMO_GOAL_ACCOUNT;
  const { holdingsSnapshot, performanceDeltas, evidenceRefs } = goalAccount;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container max-w-6xl">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/portfolio">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900">{goalAccount.name}</h1>
            <Badge variant={goalAccount.status === 'active' ? 'default' : 'secondary'}>
              {goalAccount.status}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {goalAccount.riskProfile}
            </Badge>
          </div>
          <p className="text-slate-600">{goalAccount.clientReason}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Current Value</CardDescription>
              <CardTitle className="text-xl">{formatCents(holdingsSnapshot.totalValueCents)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Target</CardDescription>
              <CardTitle className="text-xl">{formatCents(goalAccount.targetAmountCents)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>YTD Return</CardDescription>
              <CardTitle className={`text-xl ${performanceDeltas.returnPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercent(performanceDeltas.returnPercent)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Target Date</CardDescription>
              <CardTitle className="text-xl">{formatDate(goalAccount.targetDate)}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Holdings Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Holdings Snapshot</CardTitle>
            <CardDescription>
              As of {formatDate(holdingsSnapshot.snapshotAt)} | Hash: {holdingsSnapshot.stateHash}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Asset Class</TableHead>
                  <TableHead className="text-right">Units</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">Gain/Loss</TableHead>
                  <TableHead className="text-right">Weight</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holdingsSnapshot.holdings.map((holding) => (
                  <TableRow key={holding.holdingId}>
                    <TableCell className="font-mono font-medium">{holding.symbol}</TableCell>
                    <TableCell>{holding.name}</TableCell>
                    <TableCell>{holding.assetClass}</TableCell>
                    <TableCell className="text-right font-mono">{holding.units.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono">{formatCents(holding.pricePerUnitCents)}</TableCell>
                    <TableCell className="text-right font-mono">{formatCents(holding.valueCents)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <GainIndicator value={holding.unrealizedGainCents} />
                        <span className={`font-mono ${holding.unrealizedGainCents >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCents(holding.unrealizedGainCents)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">{holding.weightPercent.toFixed(2)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Allocation Drift Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Allocation vs Target</CardTitle>
            <CardDescription>
              Current allocation drift from target strategy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset Class</TableHead>
                  <TableHead className="text-right">Target %</TableHead>
                  <TableHead className="text-right">Actual %</TableHead>
                  <TableHead className="text-right">Drift</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holdingsSnapshot.allocations.map((alloc) => (
                  <TableRow key={alloc.assetClass}>
                    <TableCell className="font-medium">{alloc.assetClass}</TableCell>
                    <TableCell className="text-right font-mono">{alloc.targetPercent.toFixed(2)}%</TableCell>
                    <TableCell className="text-right font-mono">{alloc.actualPercent.toFixed(2)}%</TableCell>
                    <TableCell className="text-right">
                      <span className={`font-mono ${Math.abs(alloc.driftPercent) > 5 ? 'text-amber-600 font-medium' : 'text-slate-600'}`}>
                        {formatPercent(alloc.driftPercent)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono">{formatCents(alloc.valueCents)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Performance Deltas */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Performance Deltas</CardTitle>
            <CardDescription>
              Period: {formatDate(performanceDeltas.periodStart)} to {formatDate(performanceDeltas.periodEnd)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-500">Start Value</div>
                <div className="text-lg font-mono">{formatCents(performanceDeltas.startValueCents)}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-500">End Value</div>
                <div className="text-lg font-mono">{formatCents(performanceDeltas.endValueCents)}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-500">Net Contributions</div>
                <div className="text-lg font-mono">{formatCents(performanceDeltas.netFlowCents)}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-500">Investment Gain/Loss</div>
                <div className={`text-lg font-mono ${performanceDeltas.gainLossCents >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCents(performanceDeltas.gainLossCents)}
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <Hash className="w-3 h-3" />
              <span>Evidence Ref: {performanceDeltas.evidenceRef}</span>
            </div>
          </CardContent>
        </Card>

        {/* Evidence References */}
        <Card>
          <CardHeader>
            <CardTitle>Evidence References</CardTitle>
            <CardDescription>
              Supporting documentation and audit trail
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Hash</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evidenceRefs.map((evidence) => (
                  <TableRow key={evidence.evidenceId}>
                    <TableCell>
                      <Badge variant="outline">{evidence.evidenceType.replace(/_/g, ' ')}</Badge>
                    </TableCell>
                    <TableCell>{evidence.description}</TableCell>
                    <TableCell>{formatDate(evidence.createdAt)}</TableCell>
                    <TableCell className="font-mono text-xs">{evidence.hash}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <FileText className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Metadata Footer */}
        <div className="mt-6 p-4 bg-slate-100 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-600">
            <div>
              <div className="font-medium text-slate-500">Goal Account ID</div>
              <div className="font-mono">{goalAccount.id}</div>
            </div>
            <div>
              <div className="font-medium text-slate-500">Portfolio ID</div>
              <div className="font-mono">{goalAccount.portfolioId}</div>
            </div>
            <div>
              <div className="font-medium text-slate-500">Created</div>
              <div>{formatDate(goalAccount.createdAt)}</div>
            </div>
            <div>
              <div className="font-medium text-slate-500">State Hash</div>
              <div className="font-mono">{goalAccount.stateHash}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
