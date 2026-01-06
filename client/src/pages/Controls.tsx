/**
 * Controls Page
 * 
 * Writes: Rebalance command, Pause/lock command, Proof export trigger
 * Props: { permissions: AuthoritySet }
 * 
 * RULES:
 * - Everything gated by AUTHORITIES (not roles)
 * - Everything logged
 * - All commands emit events
 * - Pages remain readable unless explicitly forbidden
 * - Actions disabled/hidden if authority missing
 */

import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { 
  Shield, 
  RefreshCw, 
  Pause, 
  Lock, 
  Unlock, 
  Download, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Hash,
  XCircle
} from "lucide-react";
import { useLocation } from "wouter";
import type { AuthoritySet, ControlCommand } from "@/contracts/activity";
import { SEED_DATA } from "@/demo/seed";
import { useAuthorities, AUTHORITY_DESCRIPTIONS } from "@/hooks/useAuthorities";
import type { Authority } from "@/api/execution-context";
import { DualControlPanel } from "@/components/DualControlPanel";
import { FxCryptoPanel } from "@/components/FxCryptoPanel";
import { ThresholdConfigPanel } from "@/components/ThresholdConfigPanel";
import { ThresholdApprovalQueue } from "@/components/ThresholdApprovalQueue";

interface ControlsPageProps {
  permissions?: AuthoritySet;
}

// Use centralized seed data - in production, this comes from TuringCore API
const DEMO_PERMISSIONS = SEED_DATA.authoritySet;
const DEMO_COMMAND_LOG = SEED_DATA.commandLog;

function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getStatusBadgeVariant(status: string): 'default' | 'secondary' | 'outline' | 'destructive' {
  switch (status) {
    case 'EXECUTED': return 'default';
    case 'APPROVED': return 'default';
    case 'PENDING': return 'secondary';
    case 'REJECTED': return 'destructive';
    case 'FAILED': return 'destructive';
    default: return 'outline';
  }
}

function getCommandIcon(type: string) {
  switch (type) {
    case 'REBALANCE': return <RefreshCw className="w-4 h-4" />;
    case 'PAUSE': return <Pause className="w-4 h-4" />;
    case 'LOCK': return <Lock className="w-4 h-4" />;
    case 'UNLOCK': return <Unlock className="w-4 h-4" />;
    case 'PROOF_EXPORT': return <Download className="w-4 h-4" />;
    default: return null;
  }
}

// Map command types to required authorities
const COMMAND_AUTHORITY_MAP: Record<string, Authority> = {
  'REBALANCE': 'CONTROL_REBALANCE',
  'PAUSE': 'CONTROL_PAUSE',
  'LOCK': 'CONTROL_LOCK',
  'UNLOCK': 'CONTROL_UNLOCK',
  'PROOF_EXPORT': 'CONTROL_PROOF_EXPORT',
};

export default function Controls({ permissions = DEMO_PERMISSIONS }: ControlsPageProps) {
  const { isAuthenticated, user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [commandLog] = useState<ControlCommand[]>(DEMO_COMMAND_LOG);
  
  // Use authority-based access control
  const { has, authorities, executionMode, isSyntheticIdentity, context } = useAuthorities();

  // Wait for auth to load before checking
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Loading controls...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    setLocation('/login');
    return null;
  }

  const handleCommand = (commandType: string) => {
    const requiredAuthority = COMMAND_AUTHORITY_MAP[commandType];
    
    // Double-check authority before executing
    if (requiredAuthority && !has(requiredAuthority)) {
      toast.error(`Insufficient authority`, {
        description: `Required: ${AUTHORITY_DESCRIPTIONS[requiredAuthority]}`,
      });
      return;
    }

    // In production, this would call the TuringCore API
    toast.info(`Command "${commandType}" would be issued and logged`, {
      description: `Authority: ${requiredAuthority} | Mode: ${executionMode}`,
    });
  };

  // Check if user has authority for a command
  const canExecute = (commandType: string): boolean => {
    const requiredAuthority = COMMAND_AUTHORITY_MAP[commandType];
    if (!requiredAuthority) return false;
    return has(requiredAuthority);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-slate-700" />
            <h1 className="text-3xl font-bold text-slate-900">Controls</h1>
          </div>
          <p className="text-slate-600">
            Gated commands for portfolio management. Everything is logged.
          </p>
        </div>

        {/* Execution Context Info */}
        {executionMode === 'DEMO' && (
          <Alert className="mb-4 border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Demo Mode</AlertTitle>
            <AlertDescription className="text-amber-700">
              {isSyntheticIdentity && 'Using synthetic identity. '}
              Commands will be simulated, not executed against live systems.
            </AlertDescription>
          </Alert>
        )}

        {/* Authority Info */}
        <Alert className="mb-8">
          <Shield className="h-4 w-4" />
          <AlertTitle>Authority Matrix</AlertTitle>
          <AlertDescription>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Your Role:</span>{' '}
                <Badge>{permissions.role}</Badge>
              </div>
              <div>
                <span className="text-slate-500">Matrix Version:</span>{' '}
                <span className="font-mono">{permissions.matrixVersion}</span>
              </div>
              <div>
                <span className="text-slate-500">Matrix Hash:</span>{' '}
                <span className="font-mono text-xs">{permissions.matrixHash}</span>
              </div>
              <div>
                <span className="text-slate-500">User:</span>{' '}
                <span>{user?.name || user?.email}</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        {/* Granted Authorities */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Granted Authorities</CardTitle>
            <CardDescription>
              Actions are gated by authorities, not roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {authorities.map((auth) => (
                <Badge key={auth} variant="outline" className="font-mono text-xs">
                  {auth}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Control Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Rebalance */}
          <Card className={!canExecute('REBALANCE') ? 'opacity-60' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Rebalance
              </CardTitle>
              <CardDescription>
                Trigger portfolio rebalancing to target allocation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => handleCommand('REBALANCE')}
                disabled={!canExecute('REBALANCE')}
              >
                Trigger Rebalance
              </Button>
              <div className="mt-2 text-xs flex items-center gap-1">
                {canExecute('REBALANCE') ? (
                  <><CheckCircle2 className="w-3 h-3 text-green-600" /><span className="text-green-600">CONTROL_REBALANCE granted</span></>
                ) : (
                  <><XCircle className="w-3 h-3 text-slate-400" /><span className="text-slate-500">Requires: CONTROL_REBALANCE</span></>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pause */}
          <Card className={!canExecute('PAUSE') ? 'opacity-60' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pause className="w-5 h-5" />
                Pause
              </CardTitle>
              <CardDescription>
                Temporarily pause portfolio activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleCommand('PAUSE')}
                disabled={!canExecute('PAUSE')}
              >
                Pause Portfolio
              </Button>
              <div className="mt-2 text-xs flex items-center gap-1">
                {canExecute('PAUSE') ? (
                  <><CheckCircle2 className="w-3 h-3 text-green-600" /><span className="text-green-600">CONTROL_PAUSE granted</span></>
                ) : (
                  <><XCircle className="w-3 h-3 text-slate-400" /><span className="text-slate-500">Requires: CONTROL_PAUSE</span></>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Lock */}
          <Card className={!canExecute('LOCK') ? 'opacity-60' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Lock
              </CardTitle>
              <CardDescription>
                Apply compliance lock to prevent changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleCommand('LOCK')}
                disabled={!canExecute('LOCK')}
              >
                Apply Lock
              </Button>
              <div className="mt-2 text-xs flex items-center gap-1">
                {canExecute('LOCK') ? (
                  <><CheckCircle2 className="w-3 h-3 text-green-600" /><span className="text-green-600">CONTROL_LOCK granted</span></>
                ) : (
                  <><XCircle className="w-3 h-3 text-slate-400" /><span className="text-slate-500">Requires: CONTROL_LOCK</span></>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Unlock */}
          <Card className={!canExecute('UNLOCK') ? 'opacity-60' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Unlock className="w-5 h-5" />
                Unlock
              </CardTitle>
              <CardDescription>
                Remove compliance lock (dual control required)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleCommand('UNLOCK')}
                disabled={!canExecute('UNLOCK')}
              >
                Request Unlock
              </Button>
              <div className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Dual control required
              </div>
              <div className="mt-1 text-xs flex items-center gap-1">
                {canExecute('UNLOCK') ? (
                  <><CheckCircle2 className="w-3 h-3 text-green-600" /><span className="text-green-600">CONTROL_UNLOCK granted</span></>
                ) : (
                  <><XCircle className="w-3 h-3 text-slate-400" /><span className="text-slate-500">Requires: CONTROL_UNLOCK</span></>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Proof Export */}
          <Card className={!canExecute('PROOF_EXPORT') ? 'opacity-60' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Proof Export
              </CardTitle>
              <CardDescription>
                Export evidence bundle for audit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleCommand('PROOF_EXPORT')}
                disabled={!canExecute('PROOF_EXPORT')}
              >
                Export Proof Bundle
              </Button>
              <div className="mt-2 text-xs flex items-center gap-1">
                {canExecute('PROOF_EXPORT') ? (
                  <><CheckCircle2 className="w-3 h-3 text-green-600" /><span className="text-green-600">CONTROL_PROOF_EXPORT granted</span></>
                ) : (
                  <><XCircle className="w-3 h-3 text-slate-400" /><span className="text-slate-500">Requires: CONTROL_PROOF_EXPORT</span></>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FX & Crypto Execution */}
        <FxCryptoPanel 
          portfolioId="portfolio-001" 
          onActionComplete={() => {
            toast.success('Action completed', {
              description: 'Event logged to activity stream',
            });
          }}
        />

        {/* Threshold Configuration */}
        <div className="mb-8">
          <ThresholdConfigPanel 
            tenantId="tenant-001"
            onThresholdChange={(event) => {
              toast.success('Threshold updated', {
                description: `${event.category} threshold changed to ${event.newAmount} AUD`,
              });
            }}
          />
        </div>

        {/* Threshold Approval Queue */}
        <div className="mb-8">
          <ThresholdApprovalQueue 
            tenantId="tenant-001"
            onApprovalComplete={() => {
              // Refresh threshold config panel would happen via state management
            }}
          />
        </div>

        {/* Dual-Control Approvals */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Dual-Control Approvals
            </CardTitle>
            <CardDescription>
              Actions requiring two-person approval before execution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DualControlPanel />
          </CardContent>
        </Card>

        {/* Command Log */}
        <Card>
          <CardHeader>
            <CardTitle>Command Log</CardTitle>
            <CardDescription>
              All control commands are logged with full audit trail
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Command</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Issued By</TableHead>
                  <TableHead>Issued At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dual Control</TableHead>
                  <TableHead>Hash</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commandLog.map((cmd) => (
                  <TableRow key={cmd.commandId}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getCommandIcon(cmd.commandType)}
                        <span className="font-medium">{cmd.commandType}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-mono">{cmd.targetId}</div>
                        <div className="text-xs text-slate-500">{cmd.targetType}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <Badge variant="outline">{cmd.issuedBy.actorType}</Badge>
                        <div className="text-xs text-slate-500 font-mono mt-1">
                          {cmd.issuedBy.actorId}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDateTime(cmd.issuedAt)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(cmd.status)}>
                        {cmd.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {cmd.requiresDualControl ? (
                        <div className="flex items-center gap-1 text-amber-600">
                          <AlertTriangle className="w-3 h-3" />
                          <span className="text-xs">Required</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-slate-400">
                          <CheckCircle2 className="w-3 h-3" />
                          <span className="text-xs">No</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs font-mono text-slate-500">
                        <Hash className="w-3 h-3" />
                        {cmd.hash}
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
              <span>All commands are immutably logged to the event stream</span>
            </div>
            <div className="font-mono">
              Authority matrix version: {permissions.matrixVersion}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
