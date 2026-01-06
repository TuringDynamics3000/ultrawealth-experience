/**
 * Portfolio Page
 * 
 * Reads: Portfolio summary, Goal Account list, Portfolio state hash
 * Props: { portfolio: PortfolioSummary }
 * 
 * RULES:
 * - Read-only. No actions.
 * - Prefer tables over charts
 * - Every number is traceable
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield, Hash, Clock, Wallet } from "lucide-react";
import { useLocation, Link } from "wouter";
import type { PortfolioSummary } from "@/contracts/portfolio";
import type { GoalAccount } from "@/contracts/goal-account";
import { SEED_DATA } from "@/demo/seed";

interface PortfolioPageProps {
  portfolio?: PortfolioSummary;
}

// Use centralized seed data - in production, this comes from TuringCore API
const DEMO_PORTFOLIO = SEED_DATA.portfolio;
const DEMO_GOAL_ACCOUNTS = SEED_DATA.goalAccounts;

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

export default function Portfolio({ portfolio = DEMO_PORTFOLIO }: PortfolioPageProps) {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  // Wait for auth to load before checking
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Loading portfolio...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    setLocation('/login');
    return null;
  }

  const goalAccounts = DEMO_GOAL_ACCOUNTS;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Wallet className="w-8 h-8 text-slate-700" />
            <h1 className="text-3xl font-bold text-slate-900">{portfolio.name}</h1>
            <Badge variant={portfolio.status === 'active' ? 'default' : 'secondary'}>
              {portfolio.status}
            </Badge>
          </div>
          <p className="text-slate-600">
            Read-only portfolio view. All data is traceable to source.
          </p>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Value</CardDescription>
              <CardTitle className="text-2xl">{formatCents(portfolio.totalValueCents)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-slate-500">Currency: {portfolio.currency}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Goal Accounts</CardDescription>
              <CardTitle className="text-2xl">{portfolio.goalAccountIds.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-slate-500">Active accounts</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Last Updated</CardDescription>
              <CardTitle className="text-lg">{formatDate(portfolio.updatedAt)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Hash className="w-3 h-3" />
                <span className="font-mono">{portfolio.stateHash}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goal Accounts Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Goal Accounts</CardTitle>
                <CardDescription>
                  All goal accounts in this portfolio
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Shield className="w-4 h-4" />
                <span>Read-only view</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Risk Profile</TableHead>
                  <TableHead className="text-right">Target</TableHead>
                  <TableHead>Target Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Annual Fee</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {goalAccounts.map((ga) => (
                  <TableRow key={ga.id}>
                    <TableCell>
                      <Link href={`/goal-accounts/${ga.id}`} className="text-blue-600 hover:underline font-medium">
                        {ga.name}
                      </Link>
                    </TableCell>
                    <TableCell className="capitalize">{ga.goalType}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {ga.riskProfile}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCents(ga.targetAmountCents)}
                    </TableCell>
                    <TableCell>{formatDate(ga.targetDate)}</TableCell>
                    <TableCell>
                      <Badge variant={ga.status === 'active' ? 'default' : 'secondary'}>
                        {ga.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-slate-600">
                      {formatCents(ga.feeEstimateAnnualCents)}
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
              <div className="font-medium text-slate-500">Portfolio ID</div>
              <div className="font-mono">{portfolio.portfolioId}</div>
            </div>
            <div>
              <div className="font-medium text-slate-500">Client ID</div>
              <div className="font-mono">{portfolio.clientId}</div>
            </div>
            <div>
              <div className="font-medium text-slate-500">Created</div>
              <div>{formatDate(portfolio.createdAt)}</div>
            </div>
            <div>
              <div className="font-medium text-slate-500">State Hash</div>
              <div className="font-mono">{portfolio.stateHash}</div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-slate-400">
          <Clock className="w-3 h-3 inline mr-1" />
          Data retrieved at {new Date().toISOString()}
        </div>
      </div>
    </div>
  );
}
