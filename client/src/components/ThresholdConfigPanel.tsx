/**
 * Threshold Configuration Panel
 * 
 * Allows SUPERVISOR/COMPLIANCE users to configure dual-control thresholds
 * for FX and Crypto transactions.
 * 
 * RULES:
 * - Authority-gated (SYSTEM_ADMIN required)
 * - All changes logged with actor and timestamp
 * - Thresholds are per-category, not global
 * - No default thresholds that bypass dual-control
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Settings, AlertTriangle, CheckCircle2, XCircle, Clock, Hash, Edit2, History } from "lucide-react";
import { useAuthorities } from "@/hooks/useAuthorities";
import { useTuringCoreClient } from "@/hooks/useTuringCoreClient";
import type { 
  ThresholdConfig, 
  ThresholdCategory, 
  ThresholdChangeEvent,
  ThresholdHistoryEntry,
  FxCurrency,
} from "@/contracts/threshold";
import { 
  DEFAULT_THRESHOLDS, 
  THRESHOLD_CATEGORY_LABELS, 
  THRESHOLD_CATEGORY_DESCRIPTIONS,
  THRESHOLD_CHANGE_MAGNITUDE_LIMIT,
  calculateMagnitudePercent,
  requiresThresholdApproval,
} from "@/contracts/threshold";
import type { CryptoAsset } from "@/contracts/fx-crypto";

interface ThresholdConfigPanelProps {
  tenantId?: string;
  onThresholdChange?: (event: ThresholdChangeEvent) => void;
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

export function ThresholdConfigPanel({ 
  tenantId = 'tenant-001',
  onThresholdChange 
}: ThresholdConfigPanelProps) {
  const { has, executionMode, isSyntheticIdentity } = useAuthorities();
  const client = useTuringCoreClient();
  
  const [thresholds, setThresholds] = useState<ThresholdConfig[]>([]);
  const [thresholdHistory, setThresholdHistory] = useState<ThresholdHistoryEntry[]>([]);
  const [changeEvents, setChangeEvents] = useState<ThresholdChangeEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ThresholdCategory | null>(null);
  const [selectedCurrencyOrAsset, setSelectedCurrencyOrAsset] = useState<FxCurrency | CryptoAsset>('AUD');
  const [newAmount, setNewAmount] = useState<string>('');
  const [saving, setSaving] = useState(false);

  // Check authority
  const canEditThresholds = has('SYSTEM_ADMIN');

  // Load thresholds on mount
  useEffect(() => {
    loadThresholds();
  }, [tenantId]);

  async function loadThresholds() {
    setLoading(true);
    try {
      const response = await client.listThresholds(tenantId);
      if (response.success && response.data) {
        setThresholds(response.data.filter((t: ThresholdConfig) => t.isActive));
      }
      
      const eventsResponse = await client.listThresholdChangeEvents(tenantId);
      if (eventsResponse.success && eventsResponse.data) {
        setChangeEvents(eventsResponse.data);
      }
    } catch (error) {
      toast.error('Failed to load thresholds');
    } finally {
      setLoading(false);
    }
  }

  function getThresholdForCategory(category: ThresholdCategory): number {
    const threshold = thresholds.find(t => t.category === category && t.isActive);
    return threshold?.amount ?? DEFAULT_THRESHOLDS[category];
  }

  function getThresholdConfig(category: ThresholdCategory): ThresholdConfig | undefined {
    return thresholds.find(t => t.category === category && t.isActive);
  }

  async function handleSaveThreshold() {
    if (!selectedCategory || !newAmount) return;
    
    const amount = parseFloat(newAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Invalid amount', {
        description: 'Amount must be a positive number',
      });
      return;
    }

    const currentAmount = getThresholdForCategory(selectedCategory);
    const needsApproval = requiresThresholdApproval(currentAmount, amount);
    const magnitudePercent = calculateMagnitudePercent(currentAmount, amount);

    setSaving(true);
    try {
      if (needsApproval) {
        // Use approval workflow for large changes
        const response = await client.requestThresholdChange({
          tenantId,
          category: selectedCategory,
          currencyOrAsset: selectedCurrencyOrAsset,
          newAmount: amount,
        });

        if (response.success && response.data) {
          if (response.data.status === 'PENDING') {
            toast.info('Threshold change submitted for approval', {
              description: `Change of ${magnitudePercent.toFixed(1)}% requires dual-control approval`,
            });
          } else {
            toast.success('Threshold updated', {
              description: `${THRESHOLD_CATEGORY_LABELS[selectedCategory]} threshold set to ${formatCurrency(amount)}`,
            });
          }
          
          await loadThresholds();
          setEditDialogOpen(false);
          setSelectedCategory(null);
          setNewAmount('');
        } else {
          toast.error('Failed to submit threshold change', {
            description: response.error?.message || 'Unknown error',
          });
        }
      } else {
        // Direct update for small changes
        const response = await client.setThreshold({
          tenantId,
          category: selectedCategory,
          currencyOrAsset: selectedCurrencyOrAsset,
          amount,
        });

        if (response.success && response.data) {
          toast.success('Threshold updated', {
            description: `${THRESHOLD_CATEGORY_LABELS[selectedCategory]} threshold set to ${formatCurrency(amount)}`,
          });
          
          await loadThresholds();
          
          if (onThresholdChange) {
            const event: ThresholdChangeEvent = {
              eventId: response.data.eventId,
              eventType: 'THRESHOLD_CHANGED',
              thresholdId: response.data.thresholdId,
              category: selectedCategory,
              currencyOrAsset: selectedCurrencyOrAsset,
              previousAmount: response.data.previousAmount,
              newAmount: response.data.newAmount,
              actor: 'current-user',
              actorAuthorities: ['SYSTEM_ADMIN'],
              timestamp: response.data.effectiveFrom,
              executionMode: executionMode,
            };
            onThresholdChange(event);
          }
          
          setEditDialogOpen(false);
          setSelectedCategory(null);
          setNewAmount('');
        } else {
          toast.error('Failed to update threshold', {
            description: response.error?.message || 'Unknown error',
          });
        }
      }
    } catch (error) {
      toast.error('Failed to update threshold');
    } finally {
      setSaving(false);
    }
  }

  function openEditDialog(category: ThresholdCategory) {
    setSelectedCategory(category);
    setNewAmount(getThresholdForCategory(category).toString());
    // Set default currency/asset based on category
    if (category === 'FX_CONVERSION') {
      setSelectedCurrencyOrAsset('AUD');
    } else {
      setSelectedCurrencyOrAsset('BTC');
    }
    setEditDialogOpen(true);
  }

  // Get available currencies/assets for a category
  function getCurrencyOptions(category: ThresholdCategory): (FxCurrency | CryptoAsset)[] {
    if (category === 'FX_CONVERSION') {
      return ['AUD', 'USD', 'GBP', 'EUR'];
    }
    return ['BTC', 'ETH'];
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Dual-Control Thresholds
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-slate-500">Loading thresholds...</div>
        </CardContent>
      </Card>
    );
  }

  const categories: ThresholdCategory[] = ['FX_CONVERSION', 'CRYPTO_BUY', 'CRYPTO_SELL', 'CRYPTO_TRANSFER'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Dual-Control Thresholds
        </CardTitle>
        <CardDescription>
          Configure transaction amounts that require two-person approval
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Authority Warning */}
        {!canEditThresholds && (
          <Alert className="mb-4 border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">View Only</AlertTitle>
            <AlertDescription className="text-amber-700">
              You do not have SYSTEM_ADMIN authority to modify thresholds.
            </AlertDescription>
          </Alert>
        )}

        {/* Execution Mode Info */}
        {executionMode === 'DEMO' && (
          <Alert className="mb-4 border-blue-200 bg-blue-50">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Demo Mode</AlertTitle>
            <AlertDescription className="text-blue-700">
              {isSyntheticIdentity && 'Using synthetic identity. '}
              Threshold changes will be simulated.
            </AlertDescription>
          </Alert>
        )}

        {/* Thresholds Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Threshold (AUD)</TableHead>
              <TableHead>Set By</TableHead>
              <TableHead>Effective From</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => {
              const config = getThresholdConfig(category);
              const amount = getThresholdForCategory(category);
              const isDefault = !config;
              
              return (
                <TableRow key={category}>
                  <TableCell>
                    <div className="font-medium">{THRESHOLD_CATEGORY_LABELS[category]}</div>
                    {isDefault && (
                      <Badge variant="outline" className="text-xs mt-1">Default</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {THRESHOLD_CATEGORY_DESCRIPTIONS[category]}
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium">
                    {formatCurrency(amount)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {config ? (
                      <span className="text-slate-600">{config.setBy}</span>
                    ) : (
                      <span className="text-slate-400">System Default</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {config ? (
                      <span className="text-slate-600">{formatDateTime(config.effectiveFrom)}</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(category)}
                      disabled={!canEditThresholds}
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Change History */}
        {changeEvents.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <History className="w-4 h-4" />
                Recent Changes
              </h4>
              <Button variant="ghost" size="sm" onClick={() => setHistoryDialogOpen(true)}>
                View All
              </Button>
            </div>
            <div className="space-y-2">
              {changeEvents.slice(0, 3).map((event) => (
                <div 
                  key={event.eventId} 
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg text-sm"
                >
                  <div>
                    <span className="font-medium">{THRESHOLD_CATEGORY_LABELS[event.category]}</span>
                    <span className="text-slate-500 mx-2">→</span>
                    <span className="font-mono">{formatCurrency(event.newAmount)}</span>
                    {event.previousAmount !== null && (
                      <span className="text-slate-400 ml-2">
                        (was {formatCurrency(event.previousAmount)})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-slate-500">
                    <span>{event.actor}</span>
                    <span>{formatDateTime(event.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Threshold</DialogTitle>
              <DialogDescription>
                {selectedCategory && (
                  <>
                    Set the dual-control threshold for {THRESHOLD_CATEGORY_LABELS[selectedCategory]}.
                    Transactions above this amount will require two-person approval.
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Currency/Asset Selector */}
              {selectedCategory && (
                <div className="space-y-2">
                  <Label htmlFor="currency">
                    {selectedCategory === 'FX_CONVERSION' ? 'Currency' : 'Asset'}
                  </Label>
                  <Select
                    value={selectedCurrencyOrAsset}
                    onValueChange={(value) => setSelectedCurrencyOrAsset(value as FxCurrency | CryptoAsset)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getCurrencyOptions(selectedCategory).map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500">
                    Set a specific threshold for this {selectedCategory === 'FX_CONVERSION' ? 'currency' : 'asset'}.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="amount">Threshold Amount (AUD equivalent)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="1000"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="Enter amount in AUD"
                />
                <p className="text-xs text-slate-500">
                  Transactions above this amount will require dual-control approval.
                </p>
              </div>
              
              {/* Magnitude Warning */}
              {selectedCategory && newAmount && (() => {
                const currentAmount = getThresholdForCategory(selectedCategory);
                const proposedAmount = parseFloat(newAmount);
                if (!isNaN(proposedAmount) && proposedAmount > 0) {
                  const magnitude = calculateMagnitudePercent(currentAmount, proposedAmount);
                  const needsApproval = requiresThresholdApproval(currentAmount, proposedAmount);
                  
                  if (needsApproval) {
                    return (
                      <Alert className="border-amber-500/50 bg-amber-500/10">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <AlertTitle className="text-amber-500">Approval Required</AlertTitle>
                        <AlertDescription className="text-amber-500/80">
                          This change ({magnitude.toFixed(1)}% magnitude) exceeds the {THRESHOLD_CHANGE_MAGNITUDE_LIMIT}% limit
                          and will require dual-control approval from another authorized user.
                        </AlertDescription>
                      </Alert>
                    );
                  }
                }
                return null;
              })()}
              
              {selectedCategory && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    This change will be logged with your identity and timestamp.
                    Current threshold: {formatCurrency(getThresholdForCategory(selectedCategory))}
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveThreshold} disabled={saving}>
                {saving ? 'Saving...' : 'Save Threshold'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* History Dialog */}
        <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Threshold Change History</DialogTitle>
              <DialogDescription>
                Complete audit trail of threshold configuration changes
              </DialogDescription>
            </DialogHeader>
            
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Previous</TableHead>
                    <TableHead>New</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Mode</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {changeEvents.map((event) => (
                    <TableRow key={event.eventId}>
                      <TableCell className="font-medium">
                        {THRESHOLD_CATEGORY_LABELS[event.category]}
                      </TableCell>
                      <TableCell className="font-mono">
                        {event.previousAmount !== null 
                          ? formatCurrency(event.previousAmount) 
                          : '—'}
                      </TableCell>
                      <TableCell className="font-mono">
                        {formatCurrency(event.newAmount)}
                      </TableCell>
                      <TableCell>{event.actor}</TableCell>
                      <TableCell className="text-sm">
                        {formatDateTime(event.timestamp)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={event.executionMode === 'DEMO' ? 'secondary' : 'default'}>
                          {event.executionMode}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setHistoryDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Footer */}
        <div className="mt-6 p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>All threshold changes are immutably logged</span>
            </div>
            <div className="flex items-center gap-2">
              {canEditThresholds ? (
                <><CheckCircle2 className="w-3 h-3 text-green-600" /><span className="text-green-600">SYSTEM_ADMIN granted</span></>
              ) : (
                <><XCircle className="w-3 h-3 text-slate-400" /><span>Requires: SYSTEM_ADMIN</span></>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
