/**
 * Threshold Approval Queue
 * 
 * Displays pending threshold change requests that require dual-control approval.
 * Only SUPERVISOR/COMPLIANCE users can approve or reject changes.
 * 
 * RULES:
 * - Authority-gated (SYSTEM_ADMIN + DUAL_CONTROL_APPROVER required)
 * - Shows magnitude of change and reason for approval requirement
 * - Rejection requires a reason
 * - All actions logged with actor and timestamp
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowUp, 
  ArrowDown, 
  User,
  Shield,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useAuthorities } from "@/hooks/useAuthorities";
import { useTuringCoreClient } from "@/hooks/useTuringCoreClient";
import type { 
  ThresholdChangeRequest,
  ThresholdCategory,
} from "@/contracts/threshold";
import { 
  THRESHOLD_CATEGORY_LABELS,
  THRESHOLD_CHANGE_MAGNITUDE_LIMIT,
} from "@/contracts/threshold";

interface ThresholdApprovalQueueProps {
  tenantId?: string;
  onApprovalComplete?: () => void;
}

function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

function getTimeRemaining(expiresAt: number): string {
  const now = Date.now();
  const remaining = expiresAt - now;
  
  if (remaining <= 0) return 'Expired';
  
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  }
  return `${minutes}m remaining`;
}

export function ThresholdApprovalQueue({ 
  tenantId = 'tenant-001',
  onApprovalComplete 
}: ThresholdApprovalQueueProps) {
  const { has, executionMode, isSyntheticIdentity } = useAuthorities();
  const client = useTuringCoreClient();
  
  const [pendingRequests, setPendingRequests] = useState<ThresholdChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ThresholdChangeRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  // Check authority - need SYSTEM_ADMIN and DUAL_CONTROL_APPROVER to approve
  const canApprove = has('SYSTEM_ADMIN') && has('DUAL_CONTROL_APPROVER');
  const canView = has('SYSTEM_ADMIN');

  // Load pending requests on mount
  useEffect(() => {
    loadPendingRequests();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(loadPendingRequests, 30000);
    return () => clearInterval(interval);
  }, [tenantId]);

  async function loadPendingRequests() {
    try {
      const response = await client.listPendingThresholdChanges(tenantId);
      if (response.success && response.data) {
        // Filter out expired requests
        const now = Date.now();
        const active = response.data.filter(r => r.expiresAt > now);
        setPendingRequests(active);
      }
    } catch (error) {
      console.error('Failed to load pending threshold changes:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(request: ThresholdChangeRequest) {
    if (!canApprove) {
      toast.error('Insufficient authority', {
        description: 'You need DUAL_CONTROL_APPROVER authority to approve threshold changes',
      });
      return;
    }

    setProcessing(true);
    try {
      const response = await client.approveThresholdChange({
        requestId: request.requestId,
      });

      if (response.success) {
        toast.success('Threshold change approved', {
          description: `${THRESHOLD_CATEGORY_LABELS[request.category]} threshold updated to ${formatCurrency(request.newAmount)}`,
        });
        
        await loadPendingRequests();
        onApprovalComplete?.();
      } else {
        toast.error('Failed to approve', {
          description: response.error?.message || 'Unknown error',
        });
      }
    } catch (error) {
      toast.error('Failed to approve threshold change');
    } finally {
      setProcessing(false);
    }
  }

  function openRejectDialog(request: ThresholdChangeRequest) {
    setSelectedRequest(request);
    setRejectionReason('');
    setRejectDialogOpen(true);
  }

  async function handleReject() {
    if (!selectedRequest || !rejectionReason.trim()) {
      toast.error('Rejection reason required');
      return;
    }

    if (!canApprove) {
      toast.error('Insufficient authority', {
        description: 'You need DUAL_CONTROL_APPROVER authority to reject threshold changes',
      });
      return;
    }

    setProcessing(true);
    try {
      const response = await client.rejectThresholdChange({
        requestId: selectedRequest.requestId,
        reason: rejectionReason.trim(),
      });

      if (response.success) {
        toast.success('Threshold change rejected', {
          description: `${THRESHOLD_CATEGORY_LABELS[selectedRequest.category]} change request rejected`,
        });
        
        setRejectDialogOpen(false);
        setSelectedRequest(null);
        setRejectionReason('');
        await loadPendingRequests();
        onApprovalComplete?.();
      } else {
        toast.error('Failed to reject', {
          description: response.error?.message || 'Unknown error',
        });
      }
    } catch (error) {
      toast.error('Failed to reject threshold change');
    } finally {
      setProcessing(false);
    }
  }

  // Don't render if user doesn't have view authority
  if (!canView) {
    return null;
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pending Threshold Changes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            Loading pending requests...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (pendingRequests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pending Threshold Changes
          </CardTitle>
          <CardDescription>
            Threshold changes above {THRESHOLD_CHANGE_MAGNITUDE_LIMIT}% require dual-control approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 mb-4 text-green-500" />
            <p>No pending threshold changes</p>
            <p className="text-sm mt-1">All threshold change requests have been processed</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            Pending Threshold Changes
            <Badge variant="secondary" className="ml-2">
              {pendingRequests.length} pending
            </Badge>
          </CardTitle>
          <CardDescription>
            Threshold changes above {THRESHOLD_CHANGE_MAGNITUDE_LIMIT}% require dual-control approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Demo mode warning */}
          {executionMode === 'DEMO' && (
            <Alert className="mb-4 border-amber-500/50 bg-amber-500/10">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertTitle className="text-amber-500">Demo Mode</AlertTitle>
              <AlertDescription className="text-amber-500/80">
                Approvals in demo mode are simulated. In production, a different authorized user would need to approve.
              </AlertDescription>
            </Alert>
          )}

          {/* Authority warning */}
          {!canApprove && (
            <Alert className="mb-4 border-red-500/50 bg-red-500/10">
              <Shield className="h-4 w-4 text-red-500" />
              <AlertTitle className="text-red-500">View Only</AlertTitle>
              <AlertDescription className="text-red-500/80">
                You need DUAL_CONTROL_APPROVER authority to approve or reject threshold changes.
              </AlertDescription>
            </Alert>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Current</TableHead>
                <TableHead>Proposed</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingRequests.map((request) => {
                const isIncrease = request.newAmount > request.currentAmount;
                const changePercent = request.currentAmount === 0 
                  ? 100 
                  : ((request.newAmount - request.currentAmount) / request.currentAmount) * 100;
                
                return (
                  <TableRow key={request.requestId}>
                    <TableCell>
                      <div className="font-medium">
                        {THRESHOLD_CATEGORY_LABELS[request.category]}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {request.currencyOrAsset}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">
                      {formatCurrency(request.currentAmount)}
                    </TableCell>
                    <TableCell className="font-mono font-medium">
                      {formatCurrency(request.newAmount)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={isIncrease ? "default" : "destructive"}
                        className="flex items-center gap-1 w-fit"
                      >
                        {isIncrease ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {formatPercent(changePercent)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{request.requestedBy}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDateTime(request.requestedAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-amber-500">
                        {getTimeRemaining(request.expiresAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-500 border-green-500/50 hover:bg-green-500/10"
                          onClick={() => handleApprove(request)}
                          disabled={!canApprove || processing}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500 border-red-500/50 hover:bg-red-500/10"
                          onClick={() => openRejectDialog(request)}
                          disabled={!canApprove || processing}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              Reject Threshold Change
            </DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this threshold change request.
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4 bg-muted/50">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <div className="font-medium">
                      {THRESHOLD_CATEGORY_LABELS[selectedRequest.category]}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Currency/Asset:</span>
                    <div className="font-medium">{selectedRequest.currencyOrAsset}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Current Amount:</span>
                    <div className="font-mono">{formatCurrency(selectedRequest.currentAmount)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Proposed Amount:</span>
                    <div className="font-mono font-medium">{formatCurrency(selectedRequest.newAmount)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Requested By:</span>
                    <div>{selectedRequest.requestedBy}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Magnitude:</span>
                    <Badge variant="destructive">
                      {formatPercent(selectedRequest.magnitudePercent)}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rejection-reason">Rejection Reason *</Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Enter the reason for rejecting this threshold change..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  This reason will be logged in the audit trail.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={processing || !rejectionReason.trim()}
            >
              {processing ? 'Rejecting...' : 'Reject Change'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
