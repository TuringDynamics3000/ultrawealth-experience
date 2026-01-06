/**
 * System Proof Page (Demo Only)
 * 
 * Reads: Replay receipts, Event hashes, Notarisation status, Execution context
 * Props: { proof: SystemProofBundle }
 * 
 * RULES:
 * - Hidden unless DEMO_MODE=true
 * - Shows internal proof mechanisms
 * - DEMO_MODE explicitly visible
 * - Synthetic identity declared when used
 * - Granted authorities listed
 * - All traceability visible
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Shield, 
  Hash, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Link as LinkIcon,
  AlertTriangle,
  Eye,
  User,
  Building,
  Key,
  Server
} from "lucide-react";
import { useLocation } from "wouter";
import type { SystemProofBundle, NotarisationStatus } from "@/contracts/activity";
import { SEED_DATA } from "@/demo/seed";
import { useAuthorities, AUTHORITY_DESCRIPTIONS, ROLE_DESCRIPTIONS } from "@/hooks/useAuthorities";
import { isDemoMode, getExecutionMode } from "@/api";

interface SystemProofPageProps {
  proof?: SystemProofBundle;
}

// Use centralized seed data - in production, this comes from TuringCore API
const DEMO_PROOF = SEED_DATA.systemProof;

function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function getNotarisationBadge(status: NotarisationStatus) {
  switch (status) {
    case 'CONFIRMED':
      return <Badge className="bg-green-600">Confirmed</Badge>;
    case 'SUBMITTED':
      return <Badge variant="secondary">Submitted</Badge>;
    case 'PENDING':
      return <Badge variant="outline">Pending</Badge>;
    case 'FAILED':
      return <Badge variant="destructive">Failed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function SystemProof({ proof = DEMO_PROOF }: SystemProofPageProps) {
  const { isAuthenticated, loading, user } = useAuth();
  const [, setLocation] = useLocation();
  const { 
    authorities,
    role,
    executionMode, 
    isSyntheticIdentity, 
    tenantId, 
    userId,
    context 
  } = useAuthorities();

  // Wait for auth to load before checking
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Loading system proof...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    setLocation('/login');
    return null;
  }

  const verifiedCount = proof.replayReceipts.filter(r => r.verified).length;
  const totalReceipts = proof.replayReceipts.length;
  const demoMode = isDemoMode();

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container max-w-6xl">
        {/* Demo Warning */}
        <Alert className="mb-8 border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Demo Mode Only</AlertTitle>
          <AlertDescription className="text-amber-700">
            This page is only visible in demo mode. It exposes internal proof mechanisms
            that would normally be hidden from end users.
          </AlertDescription>
        </Alert>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="w-8 h-8 text-slate-700" />
            <h1 className="text-3xl font-bold text-slate-900">System Proof</h1>
            <Badge variant="outline">Demo Only</Badge>
          </div>
          <p className="text-slate-600">
            Replay receipts, event hashes, and notarisation status for audit verification
          </p>
        </div>

        {/* Execution Context Card - NEW */}
        <Card className="mb-8 border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Server className="w-5 h-5" />
              Execution Context
            </CardTitle>
            <CardDescription className="text-blue-700">
              Current session identity and execution mode
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Identity Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Identity</span>
                  {isSyntheticIdentity && (
                    <Badge variant="outline" className="border-amber-500 text-amber-700 bg-amber-50">
                      SYNTHETIC
                    </Badge>
                  )}
                </div>
                <div className="pl-6 space-y-2 text-sm">
                  <div>
                    <span className="text-slate-500">User ID:</span>{' '}
                    <span className="font-mono">{userId || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Display Name:</span>{' '}
                    <span>{user?.name || user?.email || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Email:</span>{' '}
                    <span>{user?.email || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Role Label:</span>{' '}
                    {role ? (
                      <Badge variant="outline" className="border-blue-400 text-blue-700">
                        {role}
                      </Badge>
                    ) : (
                      <span className="text-slate-400">N/A</span>
                    )}
                    <span className="text-xs text-slate-400 ml-2">
                      (display only - gate on authorities)
                    </span>
                  </div>
                  {role && ROLE_DESCRIPTIONS[role] && (
                    <div className="text-xs text-slate-500 pl-0">
                      {ROLE_DESCRIPTIONS[role]}
                    </div>
                  )}
                </div>
              </div>

              {/* Tenant Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Tenant</span>
                </div>
                <div className="pl-6 space-y-2 text-sm">
                  <div>
                    <span className="text-slate-500">Tenant ID:</span>{' '}
                    <span className="font-mono">{tenantId || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Execution Mode:</span>{' '}
                    <Badge 
                      variant={executionMode === 'DEMO' ? 'secondary' : 'default'}
                      className={executionMode === 'DEMO' ? 'bg-amber-100 text-amber-800' : ''}
                    >
                      {executionMode}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-slate-500">DEMO_MODE Flag:</span>{' '}
                    <span className="font-mono">{demoMode ? 'true' : 'false'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Synthetic Identity Warning */}
            {isSyntheticIdentity && (
              <Alert className="mt-4 border-amber-300 bg-amber-100">
                <AlertTriangle className="h-4 w-4 text-amber-700" />
                <AlertTitle className="text-amber-800">Synthetic Identity Active</AlertTitle>
                <AlertDescription className="text-amber-700">
                  This session is using a synthetic (demo) identity. Actions are simulated and 
                  will not affect production systems. All operations are logged with synthetic 
                  identity markers.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Granted Authorities Card - NEW */}
        <Card className="mb-8 border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <Key className="w-5 h-5" />
              Granted Authorities
            </CardTitle>
            <CardDescription className="text-green-700">
              Permissions granted to the current session ({authorities.length} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Authority</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {authorities.map((auth) => (
                  <TableRow key={auth}>
                    <TableCell className="font-mono text-sm">{auth}</TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {AUTHORITY_DESCRIPTIONS[auth] || 'No description'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm">Granted</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Legal Entity Information Card - NEW */}
        <Card className="mb-8 border-2 border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <Building className="w-5 h-5" />
              Legal Entity Information
            </CardTitle>
            <CardDescription className="text-purple-700">
              Onboarding entity structure and controlling persons
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Entity Details */}
              <div className="space-y-4">
                <div className="font-medium text-purple-900">Entity Details</div>
                <div className="pl-4 space-y-2 text-sm">
                  <div>
                    <span className="text-slate-500">Legal Entity Type:</span>{' '}
                    <Badge variant="outline" className="border-purple-400 text-purple-700">
                      INDIVIDUAL
                    </Badge>
                  </div>
                  <div>
                    <span className="text-slate-500">Jurisdiction:</span>{' '}
                    <span className="font-mono">AU</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Onboarding Case ID:</span>{' '}
                    <span className="font-mono">case_demo_001</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Finalised At:</span>{' '}
                    <span>31 Dec 2025, 14:05:00</span>
                  </div>
                </div>
              </div>

              {/* Controlling Persons */}
              <div className="space-y-4">
                <div className="font-medium text-purple-900">Controlling Persons</div>
                <div className="pl-4 space-y-2 text-sm">
                  <div className="p-3 bg-white rounded border border-purple-200">
                    <div className="font-medium">Demo Client</div>
                    <div className="text-slate-500 text-xs mt-1">
                      Role: Account Holder (Individual)
                    </div>
                    <div className="text-slate-500 text-xs">
                      Person ID: person_demo_001
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FX Conversion Proof */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="font-medium text-blue-900">FX Conversion Proof</div>
                <Badge className="bg-blue-600">Fiat-to-Fiat</Badge>
              </div>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500">From Currency:</span>{' '}
                    <span className="font-mono">AUD</span>
                  </div>
                  <div>
                    <span className="text-slate-500">To Currency:</span>{' '}
                    <span className="font-mono">USD</span>
                  </div>
                  <div>
                    <span className="text-slate-500">From Amount:</span>{' '}
                    <span className="font-mono">$10,000.00</span>
                  </div>
                  <div>
                    <span className="text-slate-500">To Amount:</span>{' '}
                    <span className="font-mono">$6,543.00</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Exchange Rate:</span>{' '}
                    <span className="font-mono">0.6543</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Rate Source:</span>{' '}
                    <span>RBA Mid-Market Rate</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Executed At:</span>{' '}
                    <span>31 Dec 2025, 15:00:15</span>
                  </div>
                  <div>
                    <span className="text-slate-500">State Hash:</span>{' '}
                    <span className="font-mono text-xs">state_fx_001</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-blue-200">
                  <div className="text-xs text-blue-700">
                    Actor: operator_demo_001 | Authority: PORTFOLIO_CONTROL | Mode: {executionMode}
                  </div>
                </div>
              </div>
            </div>

            {/* Crypto Execution Proof */}
            <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="font-medium text-orange-900">Crypto Execution Proof</div>
                <Badge className="bg-orange-600">Custody-Based</Badge>
              </div>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500">Asset:</span>{' '}
                    <span className="font-mono">BTC</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Action:</span>{' '}
                    <span className="font-mono">BUY</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Quantity:</span>{' '}
                    <span className="font-mono">0.5 BTC</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Price (AUD):</span>{' '}
                    <span className="font-mono">$145,000.00</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Total Value (AUD):</span>{' '}
                    <span className="font-mono">$72,500.00</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Price Source:</span>{' '}
                    <span>CoinGecko Aggregated</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Custodian:</span>{' '}
                    <span>BitGo Custody</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Wallet Reference:</span>{' '}
                    <span className="font-mono text-xs">vault_***_001</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Executed At:</span>{' '}
                    <span>31 Dec 2025, 16:00:20</span>
                  </div>
                  <div>
                    <span className="text-slate-500">State Hash:</span>{' '}
                    <span className="font-mono text-xs">state_crypto_001</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-orange-200">
                  <div className="text-xs text-orange-700">
                    Actor: supervisor_demo_001 | Authority: PORTFOLIO_CONTROL | Mode: {executionMode}
                  </div>
                </div>
              </div>
            </div>

            {/* Currency Configuration */}
            <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="font-medium text-slate-900 mb-3">Currency Configuration</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Base Currency:</span>{' '}
                  <span className="font-mono">AUD</span>
                </div>
                <div>
                  <span className="text-slate-500">Supported Fiat:</span>{' '}
                  <span className="font-mono">AUD, USD, GBP, EUR</span>
                </div>
                <div>
                  <span className="text-slate-500">Valuation Mode:</span>{' '}
                  <span>Explicit Price Facts</span>
                </div>
                <div>
                  <span className="text-slate-500">Implicit Conversion:</span>{' '}
                  <span className="text-red-600 font-medium">DISABLED</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-600">
                <strong>Integrity Statement:</strong> No implicit FX or crypto conversions. All executions require explicit user action with authority verification. Full provenance maintained for all price facts.
              </div>
            </div>

            {/* Threshold Configuration */}
            <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="font-medium text-purple-900">Dual-Control Threshold Configuration</div>
                <Badge className="bg-purple-600">Authority-Gated</Badge>
              </div>
              <div className="space-y-3 text-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Threshold (AUD)</TableHead>
                      <TableHead>Last Modified</TableHead>
                      <TableHead>Modified By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono text-xs">FX_CONVERSION</TableCell>
                      <TableCell className="font-mono">$75,000</TableCell>
                      <TableCell className="text-xs">31 Dec 2025, 17:00:00</TableCell>
                      <TableCell className="text-xs">supervisor_demo_001</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">CRYPTO_BUY</TableCell>
                      <TableCell className="font-mono">$100,000</TableCell>
                      <TableCell className="text-xs">31 Dec 2025, 17:05:00</TableCell>
                      <TableCell className="text-xs">compliance_demo_001</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">CRYPTO_SELL</TableCell>
                      <TableCell className="font-mono">$50,000</TableCell>
                      <TableCell className="text-xs">—</TableCell>
                      <TableCell className="text-xs text-slate-400">System Default</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">CRYPTO_TRANSFER</TableCell>
                      <TableCell className="font-mono">$25,000</TableCell>
                      <TableCell className="text-xs">—</TableCell>
                      <TableCell className="text-xs text-slate-400">System Default</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div className="pt-2 border-t border-purple-200">
                  <div className="text-xs text-purple-700">
                    Required Authority: SYSTEM_ADMIN | Mode: {executionMode}
                  </div>
                </div>
              </div>
            </div>

            {/* Onboarding Event Trail */}
            <div className="mt-6">
              <div className="font-medium text-purple-900 mb-3">Onboarding Event Trail</div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Hash</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono text-xs">ONBOARDING_CASE_CREATED</TableCell>
                    <TableCell className="text-xs">31 Dec 2025, 14:00:00</TableCell>
                    <TableCell className="font-mono text-xs">h1a2s3h4_013</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-xs">LEGAL_ENTITY_DECLARED</TableCell>
                    <TableCell className="text-xs">31 Dec 2025, 14:01:00</TableCell>
                    <TableCell className="font-mono text-xs">h1a2s3h4_014</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-xs">PERSON_ADDED</TableCell>
                    <TableCell className="text-xs">31 Dec 2025, 14:02:00</TableCell>
                    <TableCell className="font-mono text-xs">h1a2s3h4_015</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-xs">CONFIRMATION_RECORDED</TableCell>
                    <TableCell className="text-xs">31 Dec 2025, 14:03:00</TableCell>
                    <TableCell className="font-mono text-xs">h1a2s3h4_016</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-xs">ONBOARDING_FINALISED</TableCell>
                    <TableCell className="text-xs">31 Dec 2025, 14:05:00</TableCell>
                    <TableCell className="font-mono text-xs">h1a2s3h4_017</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Bundle ID</CardDescription>
              <CardTitle className="text-lg font-mono">{proof.bundleId}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Notarisation</CardDescription>
              <CardTitle className="text-lg">
                {getNotarisationBadge(proof.notarisationStatus)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Replay Verification</CardDescription>
              <CardTitle className="text-lg text-green-600">
                {verifiedCount}/{totalReceipts} Verified
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Event Chain</CardDescription>
              <CardTitle className="text-lg">{proof.eventHashes.length} Events</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Bundle Hash */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Bundle Integrity
            </CardTitle>
            <CardDescription>
              Cryptographic proof of bundle contents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-slate-900 rounded-lg">
              <div className="text-xs text-slate-400 mb-1">Bundle Hash</div>
              <div className="font-mono text-green-400 text-lg break-all">
                {proof.bundleHash}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Created:</span>{' '}
                {formatDateTime(proof.createdAt)}
              </div>
              <div>
                <span className="text-slate-500">Status:</span>{' '}
                {getNotarisationBadge(proof.notarisationStatus)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Replay Receipts */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Replay Receipts</CardTitle>
            <CardDescription>
              Verification that events can be deterministically replayed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt ID</TableHead>
                  <TableHead>Event ID</TableHead>
                  <TableHead>Replayed At</TableHead>
                  <TableHead>Result Hash</TableHead>
                  <TableHead>Verified</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proof.replayReceipts.map((receipt) => (
                  <TableRow key={receipt.receiptId}>
                    <TableCell className="font-mono text-sm">{receipt.receiptId}</TableCell>
                    <TableCell className="font-mono text-sm">{receipt.eventId}</TableCell>
                    <TableCell className="text-sm">{formatDateTime(receipt.replayedAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs font-mono text-slate-500">
                        <Hash className="w-3 h-3" />
                        {receipt.resultHash}
                      </div>
                    </TableCell>
                    <TableCell>
                      {receipt.verified ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-sm">Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600">
                          <XCircle className="w-4 h-4" />
                          <span className="text-sm">Failed</span>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Event Hash Chain */}
        <Card>
          <CardHeader>
            <CardTitle>Event Hash Chain</CardTitle>
            <CardDescription>
              Linked hash chain proving event ordering and integrity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead>Event ID</TableHead>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Occurred At</TableHead>
                  <TableHead>Hash</TableHead>
                  <TableHead>Previous Hash</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proof.eventHashes.map((event, index) => (
                  <TableRow key={event.eventId}>
                    <TableCell>
                      <Badge variant="outline">{event.chainPosition}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{event.eventId}</TableCell>
                    <TableCell className="text-sm">
                      {event.eventType.replace(/_/g, ' ')}
                    </TableCell>
                    <TableCell className="text-sm">{formatDateTime(event.occurredAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs font-mono text-green-600">
                        <Hash className="w-3 h-3" />
                        {event.hash}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs font-mono text-slate-500">
                        {index === 0 ? (
                          <span className="text-slate-400">Genesis</span>
                        ) : (
                          <>
                            <LinkIcon className="w-3 h-3" />
                            {event.previousHash}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 p-4 bg-slate-100 rounded-lg">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>System proof generated at {formatDateTime(proof.createdAt)}</span>
            </div>
            <div className="font-mono">
              Bundle: {proof.bundleId} | Mode: {executionMode}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
