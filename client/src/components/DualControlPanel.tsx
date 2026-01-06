/**
 * DualControlPanel Component
 * 
 * UI for two-person approval workflow.
 * Shows pending requests and allows approval/rejection.
 * 
 * RULES:
 * - Requester cannot approve their own request
 * - Only users with appropriate authority can approve
 * - All actions logged in Activity
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Shield,
  User,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import { useAuthorities } from '@/hooks/useAuthorities';
import { 
  type DualControlRequest, 
  type DualControlAction,
  type DualControlStatus,
  DUAL_CONTROL_ACTIONS,
} from '@/contracts/dual-control';
import { getCurrentContext } from '@/api';
import { toast } from 'sonner';

// =============================================================================
// DEMO SEED DATA
// =============================================================================

const DEMO_PENDING_REQUESTS: DualControlRequest[] = [
  {
    requestId: 'dcr_001',
    action: 'UNLOCK',
    targetId: 'ga_001',
    targetType: 'GOAL_ACCOUNT',
    requestedBy: 'user_operator_001',
    requestedByRole: 'OPERATOR',
    requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    reason: 'Client requested access to locked funds for emergency medical expenses. Documentation verified.',
    status: 'PENDING',
    expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(), // 22 hours from now
    requiredAuthority: 'CONTROL_UNLOCK',
  },
  {
    requestId: 'dcr_002',
    action: 'FORCE_REBALANCE',
    targetId: 'portfolio_001',
    targetType: 'PORTFOLIO',
    requestedBy: 'user_supervisor_002',
    requestedByRole: 'SUPERVISOR',
    requestedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
    reason: 'Market volatility requires immediate rebalancing to maintain target allocation.',
    status: 'PENDING',
    expiresAt: new Date(Date.now() + 23.5 * 60 * 60 * 1000).toISOString(),
    requiredAuthority: 'PORTFOLIO_CONTROL',
  },
];

const DEMO_HISTORY: DualControlRequest[] = [
  {
    requestId: 'dcr_000',
    action: 'UNLOCK',
    targetId: 'ga_002',
    targetType: 'GOAL_ACCOUNT',
    requestedBy: 'user_operator_001',
    requestedByRole: 'OPERATOR',
    requestedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    reason: 'Client inheritance settlement requires fund access.',
    status: 'APPROVED',
    reviewedBy: 'user_compliance_001',
    reviewedByRole: 'COMPLIANCE',
    reviewedAt: new Date(Date.now() - 47 * 60 * 60 * 1000).toISOString(),
    reviewComment: 'Documentation verified. Approved per policy DC-2024-001.',
    expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    requiredAuthority: 'CONTROL_UNLOCK',
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getStatusBadge(status: DualControlStatus) {
  switch (status) {
    case 'PENDING':
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    case 'APPROVED':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" />Approved</Badge>;
    case 'REJECTED':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
    case 'EXPIRED':
      return <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200"><Clock className="w-3 h-3 mr-1" />Expired</Badge>;
    case 'CANCELLED':
      return <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
  }
}

function getRiskBadge(riskLevel: 'HIGH' | 'CRITICAL') {
  if (riskLevel === 'CRITICAL') {
    return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Critical</Badge>;
  }
  return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200"><AlertTriangle className="w-3 h-3 mr-1" />High Risk</Badge>;
}

function formatTimeAgo(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  return `${diffDays} days ago`;
}

function formatTimeRemaining(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  if (diffMs <= 0) return 'Expired';
  
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffHours > 0) return `${diffHours}h ${diffMins}m remaining`;
  return `${diffMins}m remaining`;
}

// =============================================================================
// REQUEST CARD COMPONENT
// =============================================================================

interface RequestCardProps {
  request: DualControlRequest;
  canApprove: boolean;
  isSelf: boolean;
  onApprove: (requestId: string, comment: string) => void;
  onReject: (requestId: string, comment: string) => void;
}

function RequestCard({ request, canApprove, isSelf, onApprove, onReject }: RequestCardProps) {
  const [comment, setComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const actionMeta = DUAL_CONTROL_ACTIONS[request.action];

  const handleApprove = async () => {
    if (!comment.trim()) {
      toast.error('Review comment is required');
      return;
    }
    setIsProcessing(true);
    await onApprove(request.requestId, comment);
    setIsProcessing(false);
  };

  const handleReject = async () => {
    if (!comment.trim()) {
      toast.error('Rejection reason is required');
      return;
    }
    setIsProcessing(true);
    await onReject(request.requestId, comment);
    setIsProcessing(false);
  };

  return (
    <Card className={`${request.status === 'PENDING' ? 'border-amber-200' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {actionMeta.label}
              {getRiskBadge(actionMeta.riskLevel)}
            </CardTitle>
            <CardDescription className="mt-1">
              {actionMeta.description}
            </CardDescription>
          </div>
          {getStatusBadge(request.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Request Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <User className="w-4 h-4" />
            <span>Requested by: <strong>{request.requestedBy}</strong> ({request.requestedByRole})</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-4 h-4" />
            <span>{formatTimeAgo(request.requestedAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Shield className="w-4 h-4" />
            <span>Target: {request.targetType} ({request.targetId})</span>
          </div>
          {request.status === 'PENDING' && (
            <div className="flex items-center gap-2 text-amber-600">
              <Clock className="w-4 h-4" />
              <span>{formatTimeRemaining(request.expiresAt)}</span>
            </div>
          )}
        </div>

        {/* Reason */}
        <div className="bg-slate-50 p-3 rounded-md">
          <div className="flex items-start gap-2">
            <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-700">Reason</p>
              <p className="text-sm text-slate-600 mt-1">{request.reason}</p>
            </div>
          </div>
        </div>

        {/* Review Section (for pending requests) */}
        {request.status === 'PENDING' && (
          <div className="border-t pt-4">
            {isSelf ? (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                <p className="text-sm text-amber-700">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  You cannot approve your own request. Another authorized user must review.
                </p>
              </div>
            ) : !canApprove ? (
              <div className="bg-slate-50 border border-slate-200 rounded-md p-3">
                <p className="text-sm text-slate-600">
                  <Shield className="w-4 h-4 inline mr-1" />
                  You do not have authority to approve this request. Required: {request.requiredAuthority}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Textarea
                  placeholder="Enter review comment (required)..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleApprove}
                    disabled={isProcessing || !comment.trim()}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleReject}
                    disabled={isProcessing || !comment.trim()}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Review Result (for completed requests) */}
        {request.reviewedBy && (
          <div className="border-t pt-4">
            <div className="bg-slate-50 p-3 rounded-md">
              <p className="text-sm font-medium text-slate-700">
                Reviewed by {request.reviewedBy} ({request.reviewedByRole})
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {request.reviewedAt && formatTimeAgo(request.reviewedAt)}
              </p>
              {request.reviewComment && (
                <p className="text-sm text-slate-600 mt-2">{request.reviewComment}</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function DualControlPanel() {
  const { has, userId, role } = useAuthorities();
  const [pendingRequests, setPendingRequests] = useState<DualControlRequest[]>(DEMO_PENDING_REQUESTS);
  const [history, setHistory] = useState<DualControlRequest[]>(DEMO_HISTORY);
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');

  const handleApprove = async (requestId: string, comment: string) => {
    const context = getCurrentContext();
    const request = pendingRequests.find(r => r.requestId === requestId);
    if (!request) return;

    // Update request status
    const updatedRequest: DualControlRequest = {
      ...request,
      status: 'APPROVED',
      reviewedBy: context?.userId || 'unknown',
      reviewedByRole: context?.role || 'unknown',
      reviewedAt: new Date().toISOString(),
      reviewComment: comment,
    };

    // Move to history
    setPendingRequests(prev => prev.filter(r => r.requestId !== requestId));
    setHistory(prev => [updatedRequest, ...prev]);

    toast.success(`Request ${requestId} approved`, {
      description: `Action: ${DUAL_CONTROL_ACTIONS[request.action].label}`,
    });

    // Log event
    console.log('[DualControl] Request approved', {
      requestId,
      action: request.action,
      reviewedBy: context?.userId,
      reviewedByRole: context?.role,
      comment,
      timestamp: new Date().toISOString(),
    });
  };

  const handleReject = async (requestId: string, comment: string) => {
    const context = getCurrentContext();
    const request = pendingRequests.find(r => r.requestId === requestId);
    if (!request) return;

    // Update request status
    const updatedRequest: DualControlRequest = {
      ...request,
      status: 'REJECTED',
      reviewedBy: context?.userId || 'unknown',
      reviewedByRole: context?.role || 'unknown',
      reviewedAt: new Date().toISOString(),
      reviewComment: comment,
    };

    // Move to history
    setPendingRequests(prev => prev.filter(r => r.requestId !== requestId));
    setHistory(prev => [updatedRequest, ...prev]);

    toast.error(`Request ${requestId} rejected`, {
      description: `Action: ${DUAL_CONTROL_ACTIONS[request.action].label}`,
    });

    // Log event
    console.log('[DualControl] Request rejected', {
      requestId,
      action: request.action,
      reviewedBy: context?.userId,
      reviewedByRole: context?.role,
      comment,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Dual-Control Approvals</h2>
          <p className="text-sm text-slate-600 mt-1">
            Actions requiring two-person approval before execution
          </p>
        </div>
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          {pendingRequests.length} Pending
        </Badge>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            activeTab === 'pending'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
          onClick={() => setActiveTab('pending')}
        >
          Pending ({pendingRequests.length})
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            activeTab === 'history'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
          onClick={() => setActiveTab('history')}
        >
          History ({history.length})
        </button>
      </div>

      {/* Request List */}
      <div className="space-y-4">
        {activeTab === 'pending' && (
          <>
            {pendingRequests.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-lg">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-slate-600">No pending approval requests</p>
              </div>
            ) : (
              pendingRequests.map(request => (
                <RequestCard
                  key={request.requestId}
                  request={request}
                  canApprove={has(request.requiredAuthority)}
                  isSelf={request.requestedBy === userId}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))
            )}
          </>
        )}

        {activeTab === 'history' && (
          <>
            {history.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-lg">
                <Clock className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600">No approval history</p>
              </div>
            ) : (
              history.map(request => (
                <RequestCard
                  key={request.requestId}
                  request={request}
                  canApprove={false}
                  isSelf={false}
                  onApprove={() => {}}
                  onReject={() => {}}
                />
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default DualControlPanel;
