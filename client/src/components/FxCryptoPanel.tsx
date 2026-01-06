/**
 * FX & Crypto Execution Panel
 * 
 * Authority-gated UI for FX conversions and crypto executions.
 * All actions are explicit, logged, and require PORTFOLIO_CONTROL authority.
 * 
 * RULES:
 * - No implicit execution
 * - No auto-netting or conversion
 * - Dual-control above thresholds
 * - Full provenance on all actions
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, ArrowRightLeft, Bitcoin, CheckCircle, Clock, DollarSign, Shield } from 'lucide-react';
import { useAuthorities } from '@/hooks/useAuthorities';
import { getClient } from '@/api';
import type { FiatCurrency, CryptoAsset, FxRateQuote, CryptoPriceQuote, FxConversionRecord, CryptoExecutionRecord } from '@/contracts/fx-crypto';
import type { ThresholdConfig, ThresholdCategory } from '@/contracts/threshold';
import { DEFAULT_THRESHOLDS, getEffectiveThreshold } from '@/contracts/threshold';

const FIAT_CURRENCIES: FiatCurrency[] = ['AUD', 'USD', 'GBP', 'EUR'];
const CRYPTO_ASSETS: CryptoAsset[] = ['BTC', 'ETH'];
const CRYPTO_ACTIONS = ['BUY', 'SELL', 'TRANSFER'] as const;

// Default threshold for dual-control requirement (used when API unavailable)
const DEFAULT_DUAL_CONTROL_THRESHOLD = 50000;

interface FxCryptoPanelProps {
  portfolioId: string;
  onActionComplete?: () => void;
}

export function FxCryptoPanel({ portfolioId, onActionComplete }: FxCryptoPanelProps) {
  const { has, authorities } = useAuthorities();
  const canControl = has('PORTFOLIO_CONTROL');
  // Note: DUAL_CONTROL_APPROVE would be checked via dual-control workflow

  // Threshold State - loaded from API
  const [thresholds, setThresholds] = useState<ThresholdConfig[]>([]);
  const [thresholdsLoaded, setThresholdsLoaded] = useState(false);

  // FX State
  const [fxFromCurrency, setFxFromCurrency] = useState<FiatCurrency>('AUD');
  const [fxToCurrency, setFxToCurrency] = useState<FiatCurrency>('USD');
  const [fxAmount, setFxAmount] = useState<string>('');
  const [fxReason, setFxReason] = useState<string>('');
  const [fxQuote, setFxQuote] = useState<FxRateQuote | null>(null);
  const [fxLoading, setFxLoading] = useState(false);
  const [fxResult, setFxResult] = useState<FxConversionRecord | null>(null);
  const [fxError, setFxError] = useState<string | null>(null);

  // Crypto State
  const [cryptoAsset, setCryptoAsset] = useState<CryptoAsset>('BTC');
  const [cryptoAction, setCryptoAction] = useState<typeof CRYPTO_ACTIONS[number]>('BUY');
  const [cryptoQuantity, setCryptoQuantity] = useState<string>('');
  const [cryptoReason, setCryptoReason] = useState<string>('');
  const [cryptoDestination, setCryptoDestination] = useState<string>('');
  const [cryptoQuote, setCryptoQuote] = useState<CryptoPriceQuote | null>(null);
  const [cryptoLoading, setCryptoLoading] = useState(false);
  const [cryptoResult, setCryptoResult] = useState<CryptoExecutionRecord | null>(null);
  const [cryptoError, setCryptoError] = useState<string | null>(null);

  const client = getClient();

  // Load thresholds on mount
  useEffect(() => {
    async function loadThresholds() {
      try {
        const response = await client.listThresholds('tenant-001');
        if (response.success && response.data) {
          setThresholds(response.data.filter((t: ThresholdConfig) => t.isActive));
        }
      } catch (error) {
        console.error('Failed to load thresholds:', error);
      } finally {
        setThresholdsLoaded(true);
      }
    }
    loadThresholds();
  }, []);

  // Get threshold for a category, optionally for a specific currency/asset
  function getThreshold(category: ThresholdCategory, currencyOrAsset?: string): number {
    return getEffectiveThreshold(category, thresholds, currencyOrAsset);
  }

  // FX Handlers
  const handleGetFxQuote = async () => {
    if (!fxAmount || parseFloat(fxAmount) <= 0) {
      setFxError('Please enter a valid amount');
      return;
    }
    if (fxFromCurrency === fxToCurrency) {
      setFxError('From and To currencies must be different');
      return;
    }

    setFxLoading(true);
    setFxError(null);
    setFxQuote(null);

    try {
      const response = await client.getFxQuote({
        fromCurrency: fxFromCurrency,
        toCurrency: fxToCurrency,
        amount: parseFloat(fxAmount),
      });

      if (response.success && response.data) {
        setFxQuote(response.data);
      } else {
        setFxError(response.error?.message || 'Failed to get FX quote');
      }
    } catch (err) {
      setFxError('Failed to get FX quote');
    } finally {
      setFxLoading(false);
    }
  };

  const handleRequestFxConversion = async () => {
    if (!fxQuote || !fxAmount) return;

    setFxLoading(true);
    setFxError(null);

    try {
      const response = await client.requestFxConversion({
        portfolioId,
        fromCurrency: fxFromCurrency,
        toCurrency: fxToCurrency,
        amount: parseFloat(fxAmount),
        reason: fxReason || undefined,
      });

      if (response.success && response.data) {
        setFxResult(response.data);
        setFxQuote(null);
        setFxAmount('');
        setFxReason('');
        onActionComplete?.();
      } else {
        setFxError(response.error?.message || 'Failed to request FX conversion');
      }
    } catch (err) {
      setFxError('Failed to request FX conversion');
    } finally {
      setFxLoading(false);
    }
  };

  // Crypto Handlers
  const handleGetCryptoQuote = async () => {
    if (!cryptoQuantity || parseFloat(cryptoQuantity) <= 0) {
      setCryptoError('Please enter a valid quantity');
      return;
    }

    setCryptoLoading(true);
    setCryptoError(null);
    setCryptoQuote(null);

    try {
      const response = await client.getCryptoQuote({
        asset: cryptoAsset,
        quantity: parseFloat(cryptoQuantity),
      });

      if (response.success && response.data) {
        setCryptoQuote(response.data);
      } else {
        setCryptoError(response.error?.message || 'Failed to get crypto quote');
      }
    } catch (err) {
      setCryptoError('Failed to get crypto quote');
    } finally {
      setCryptoLoading(false);
    }
  };

  const handleRequestCryptoExecution = async () => {
    if (!cryptoQuote || !cryptoQuantity) return;

    if (cryptoAction === 'TRANSFER' && !cryptoDestination) {
      setCryptoError('Destination wallet is required for transfers');
      return;
    }

    setCryptoLoading(true);
    setCryptoError(null);

    try {
      const response = await client.requestCryptoExecution({
        portfolioId,
        asset: cryptoAsset,
        action: cryptoAction,
        quantity: parseFloat(cryptoQuantity),
        reason: cryptoReason || undefined,
        destinationWallet: cryptoAction === 'TRANSFER' ? cryptoDestination : undefined,
      });

      if (response.success && response.data) {
        setCryptoResult(response.data);
        setCryptoQuote(null);
        setCryptoQuantity('');
        setCryptoReason('');
        setCryptoDestination('');
        onActionComplete?.();
      } else {
        setCryptoError(response.error?.message || 'Failed to request crypto execution');
      }
    } catch (err) {
      setCryptoError('Failed to request crypto execution');
    } finally {
      setCryptoLoading(false);
    }
  };

  const fxAmountNum = parseFloat(fxAmount) || 0;
  const cryptoValueAud = cryptoQuote ? cryptoQuote.totalValueAud : 0;
  
  // Get dynamic thresholds from configuration (per-currency/asset)
  const fxThreshold = getThreshold('FX_CONVERSION', fxFromCurrency);
  const cryptoBuyThreshold = getThreshold('CRYPTO_BUY', cryptoAsset);
  const cryptoSellThreshold = getThreshold('CRYPTO_SELL', cryptoAsset);
  const cryptoTransferThreshold = getThreshold('CRYPTO_TRANSFER', cryptoAsset);
  
  // Determine which crypto threshold to use based on action
  const getCryptoThresholdForAction = () => {
    switch (cryptoAction) {
      case 'BUY': return cryptoBuyThreshold;
      case 'SELL': return cryptoSellThreshold;
      case 'TRANSFER': return cryptoTransferThreshold;
      default: return cryptoBuyThreshold;
    }
  };
  
  const fxRequiresDualControl = fxAmountNum >= fxThreshold;
  const cryptoRequiresDualControl = cryptoValueAud >= getCryptoThresholdForAction();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5" />
          FX & Crypto Execution
        </CardTitle>
        <CardDescription>
          Explicit, authority-gated execution for currency conversions and crypto operations.
          All actions are logged with full provenance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="fx" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="fx" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              FX Conversion
            </TabsTrigger>
            <TabsTrigger value="crypto" className="flex items-center gap-2">
              <Bitcoin className="h-4 w-4" />
              Crypto Execution
            </TabsTrigger>
          </TabsList>

          {/* FX Conversion Tab */}
          <TabsContent value="fx" className="space-y-4 mt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fx-from">From Currency</Label>
                <Select value={fxFromCurrency} onValueChange={(v) => setFxFromCurrency(v as FiatCurrency)}>
                  <SelectTrigger id="fx-from">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FIAT_CURRENCIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fx-to">To Currency</Label>
                <Select value={fxToCurrency} onValueChange={(v) => setFxToCurrency(v as FiatCurrency)}>
                  <SelectTrigger id="fx-to">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FIAT_CURRENCIES.filter((c) => c !== fxFromCurrency).map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fx-amount">Amount ({fxFromCurrency})</Label>
                <Input
                  id="fx-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={fxAmount}
                  onChange={(e) => setFxAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fx-reason">Reason (optional)</Label>
              <Textarea
                id="fx-reason"
                value={fxReason}
                onChange={(e) => setFxReason(e.target.value)}
                placeholder="Reason for conversion..."
                rows={2}
              />
            </div>

            {fxRequiresDualControl && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <Shield className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-amber-700">
                  Dual-control required: Amount exceeds ${fxThreshold.toLocaleString()} threshold
                </span>
              </div>
            )}

            {fxQuote && (
              <div className="p-4 bg-muted rounded-md space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rate:</span>
                  <span className="font-mono">{fxQuote.rate.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Source:</span>
                  <span className="font-mono text-sm">{fxQuote.rateSource}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">You receive:</span>
                  <span className="font-semibold">{fxQuote.toAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {fxToCurrency}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Quoted at:</span>
                  <span>{new Date(fxQuote.quotedAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Valid until:</span>
                  <span>{new Date(fxQuote.validUntil).toLocaleString()}</span>
                </div>
              </div>
            )}

            {fxResult && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md space-y-2">
                <div className="flex items-center gap-2 text-green-700">
                  {fxResult.status === 'EXECUTED' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                  <span className="font-medium">
                    {fxResult.status === 'EXECUTED' ? 'Conversion Executed' : 'Pending Approval'}
                  </span>
                </div>
                <div className="text-sm text-green-600">
                  Conversion ID: <span className="font-mono">{fxResult.conversionId}</span>
                </div>
                <div className="text-sm text-green-600">
                  {fxResult.fromAmount.toLocaleString()} {fxResult.fromCurrency} → {(fxResult.toAmount ?? 0).toLocaleString()} {fxResult.toCurrency}
                </div>
              </div>
            )}

            {fxError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{fxError}</span>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleGetFxQuote}
                disabled={!canControl || fxLoading || !fxAmount}
              >
                Get Quote
              </Button>
              <Button
                onClick={handleRequestFxConversion}
                disabled={!canControl || fxLoading || !fxQuote}
              >
                {fxRequiresDualControl ? 'Request Approval' : 'Execute Conversion'}
              </Button>
            </div>

            {!canControl && (
              <p className="text-sm text-muted-foreground">
                PORTFOLIO_CONTROL authority required to execute FX conversions.
              </p>
            )}
          </TabsContent>

          {/* Crypto Execution Tab */}
          <TabsContent value="crypto" className="space-y-4 mt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="crypto-asset">Asset</Label>
                <Select value={cryptoAsset} onValueChange={(v) => setCryptoAsset(v as CryptoAsset)}>
                  <SelectTrigger id="crypto-asset">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CRYPTO_ASSETS.map((a) => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="crypto-action">Action</Label>
                <Select value={cryptoAction} onValueChange={(v) => setCryptoAction(v as typeof CRYPTO_ACTIONS[number])}>
                  <SelectTrigger id="crypto-action">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CRYPTO_ACTIONS.map((a) => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="crypto-quantity">Quantity ({cryptoAsset})</Label>
                <Input
                  id="crypto-quantity"
                  type="number"
                  min="0"
                  step="0.00000001"
                  value={cryptoQuantity}
                  onChange={(e) => setCryptoQuantity(e.target.value)}
                  placeholder="0.00000000"
                />
              </div>
            </div>

            {cryptoAction === 'TRANSFER' && (
              <div className="space-y-2">
                <Label htmlFor="crypto-destination">Destination Wallet</Label>
                <Input
                  id="crypto-destination"
                  value={cryptoDestination}
                  onChange={(e) => setCryptoDestination(e.target.value)}
                  placeholder={cryptoAsset === 'BTC' ? 'bc1q...' : '0x...'}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="crypto-reason">Reason (optional)</Label>
              <Textarea
                id="crypto-reason"
                value={cryptoReason}
                onChange={(e) => setCryptoReason(e.target.value)}
                placeholder="Reason for execution..."
                rows={2}
              />
            </div>

            {cryptoRequiresDualControl && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <Shield className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-amber-700">
                  Dual-control required: Value exceeds ${getCryptoThresholdForAction().toLocaleString()} AUD threshold
                </span>
              </div>
            )}

            {cryptoQuote && (
              <div className="p-4 bg-muted rounded-md space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price per {cryptoAsset}:</span>
                  <span className="font-mono">${cryptoQuote.priceInAud.toLocaleString()} AUD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Source:</span>
                  <span className="font-mono text-sm">{cryptoQuote.priceSource}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Custodian:</span>
                  <span className="font-mono text-sm">{cryptoQuote.custodian}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Value:</span>
                  <span className="font-semibold">${cryptoQuote.totalValueAud.toLocaleString()} AUD</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Quoted at:</span>
                  <span>{new Date(cryptoQuote.quotedAt).toLocaleString()}</span>
                </div>
              </div>
            )}

            {cryptoResult && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md space-y-2">
                <div className="flex items-center gap-2 text-green-700">
                  {cryptoResult.status === 'COMPLETED' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                  <span className="font-medium">
                    {cryptoResult.status === 'COMPLETED' ? 'Execution Completed' : 'Pending Approval'}
                  </span>
                </div>
                <div className="text-sm text-green-600">
                  Execution ID: <span className="font-mono">{cryptoResult.executionId}</span>
                </div>
                <div className="text-sm text-green-600">
                  {cryptoResult.action} {cryptoResult.quantity} {cryptoResult.asset} @ ${(cryptoResult.priceInAud ?? 0).toLocaleString()} AUD
                </div>
              </div>
            )}

            {cryptoError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{cryptoError}</span>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleGetCryptoQuote}
                disabled={!canControl || cryptoLoading || !cryptoQuantity}
              >
                Get Quote
              </Button>
              <Button
                onClick={handleRequestCryptoExecution}
                disabled={!canControl || cryptoLoading || !cryptoQuote}
              >
                {cryptoRequiresDualControl ? 'Request Approval' : `Execute ${cryptoAction}`}
              </Button>
            </div>

            {!canControl && (
              <p className="text-sm text-muted-foreground">
                PORTFOLIO_CONTROL authority required to execute crypto operations.
              </p>
            )}
          </TabsContent>
        </Tabs>

        {/* Authority Info */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Authority scope:</span>
            <div className="flex gap-1">
              {authorities.map((auth) => (
                <Badge key={auth} variant="outline" className="text-xs">
                  {auth}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
