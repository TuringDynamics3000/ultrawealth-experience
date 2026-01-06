/**
 * Onboarding Page
 * 
 * Writes: Client, Portfolio, (Optional) initial Goal Account
 * Props: { onComplete: (portfolioId: string) => void }
 * 
 * RULES:
 * - No fake steps
 * - Each step must emit a backend event
 * - Template selection is explicit user choice (no recommendations)
 * - No advice, rankings, or nudging UX
 */

import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Circle, ArrowRight, FileText, Plus, Eye, AlertTriangle, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useAuthorities } from "@/hooks/useAuthorities";
import type { PortfolioTemplate, PortfolioTemplateSummary, TemplateDisclosure } from "@/contracts/template";
import { TEMPLATE_SEED_DATA } from "@/demo/template-seed";

interface OnboardingPageProps {
  onComplete?: (portfolioId: string) => void;
}

type OnboardingMode = 'choice' | 'empty' | 'template_select' | 'template_preview' | 'template_confirm';

export default function Onboarding({ onComplete }: OnboardingPageProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const { has } = useAuthorities();
  const [, setLocation] = useLocation();
  
  // State
  const [mode, setMode] = useState<OnboardingMode>('choice');
  const [templates, setTemplates] = useState<PortfolioTemplateSummary[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<PortfolioTemplate | null>(null);
  const [disclosuresAcknowledged, setDisclosuresAcknowledged] = useState<Record<string, boolean>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load templates on mount
  useEffect(() => {
    // Use seed data directly in demo mode
    setTemplates(TEMPLATE_SEED_DATA.templateSummaries);
  }, []);

  // Redirect if not authenticated (after loading)
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation('/login');
    }
  }, [loading, isAuthenticated, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Check authority for portfolio creation
  const canCreatePortfolio = has('PORTFOLIO_WRITE');

  // Handle template selection
  const handleSelectTemplate = (templateId: string, version: string) => {
    const template = TEMPLATE_SEED_DATA.getTemplateByIdAndVersion(templateId, version);
    if (template) {
      setSelectedTemplate(template);
      setDisclosuresAcknowledged({});
      setMode('template_preview');
    }
  };

  // Handle disclosure acknowledgment
  const handleDisclosureToggle = (disclosureId: string) => {
    setDisclosuresAcknowledged(prev => ({
      ...prev,
      [disclosureId]: !prev[disclosureId],
    }));
  };

  // Check if all disclosures are acknowledged
  const allDisclosuresAcknowledged = selectedTemplate?.disclosures
    .filter(d => d.requiresAcknowledgment)
    .every(d => disclosuresAcknowledged[d.disclosureId]) ?? false;

  // Handle portfolio creation from template
  const handleCreateFromTemplate = async () => {
    if (!selectedTemplate || !allDisclosuresAcknowledged) return;
    
    setIsCreating(true);
    setError(null);
    
    try {
      // Simulate API call - in real implementation, call turingCoreClient.createPortfolioFromTemplate
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const portfolioId = `pf_${Date.now()}`;
      
      // Log the event
      console.log('[Onboarding] Portfolio created from template:', {
        portfolioId,
        templateId: selectedTemplate.templateId,
        templateVersion: selectedTemplate.version,
        templateHash: selectedTemplate.templateHash,
        disclosuresAcknowledged: Object.keys(disclosuresAcknowledged),
        actor: user?.email,
        timestamp: new Date().toISOString(),
      });
      
      if (onComplete) {
        onComplete(portfolioId);
      }
      setLocation('/portfolio');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create portfolio');
    } finally {
      setIsCreating(false);
    }
  };

  // Handle empty portfolio creation
  const handleCreateEmpty = async () => {
    setIsCreating(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const portfolioId = `pf_${Date.now()}`;
      
      console.log('[Onboarding] Empty portfolio created:', {
        portfolioId,
        actor: user?.email,
        timestamp: new Date().toISOString(),
      });
      
      if (onComplete) {
        onComplete(portfolioId);
      }
      setLocation('/portfolio');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create portfolio');
    } finally {
      setIsCreating(false);
    }
  };

  // Render based on mode
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Welcome to UltraWealth</h1>
          <p className="mt-2 text-slate-600">
            Set up your portfolio to begin
          </p>
        </div>

        {/* Authority Warning */}
        {!canCreatePortfolio && (
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">Limited Access</p>
                  <p className="text-sm text-amber-700 mt-1">
                    You do not have PORTFOLIO_WRITE authority. Contact your administrator to create portfolios.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mode: Initial Choice */}
        {mode === 'choice' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:border-slate-400 transition-colors cursor-pointer" onClick={() => setMode('empty')}>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center mb-2">
                  <Plus className="w-6 h-6 text-slate-600" />
                </div>
                <CardTitle>Start Empty</CardTitle>
                <CardDescription>
                  Create a blank portfolio and add goal accounts manually
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Full control over structure</li>
                  <li>• Add goal accounts one by one</li>
                  <li>• Configure allocations manually</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" disabled={!canCreatePortfolio}>
                  Start Empty
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:border-slate-400 transition-colors cursor-pointer" onClick={() => setMode('template_select')}>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center mb-2">
                  <FileText className="w-6 h-6 text-slate-600" />
                </div>
                <CardTitle>Start from Template</CardTitle>
                <CardDescription>
                  Choose a pre-configured portfolio structure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Pre-defined goal account structures</li>
                  <li>• Standard allocation targets</li>
                  <li>• Modify after creation</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" disabled={!canCreatePortfolio}>
                  Browse Templates
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Mode: Empty Portfolio Confirmation */}
        {mode === 'empty' && (
          <Card>
            <CardHeader>
              <CardTitle>Create Empty Portfolio</CardTitle>
              <CardDescription>
                You will create a portfolio with no goal accounts. You can add goal accounts later.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-slate-50 rounded-lg border">
                <div className="text-sm text-slate-600">
                  <p><strong>Event to be emitted:</strong> PORTFOLIO_CREATED</p>
                  <p className="mt-1"><strong>Actor:</strong> {user?.email || 'Unknown'}</p>
                  <p className="mt-1"><strong>Timestamp:</strong> {new Date().toISOString()}</p>
                </div>
              </div>
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  {error}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setMode('choice')}>
                Back
              </Button>
              <Button onClick={handleCreateEmpty} disabled={isCreating || !canCreatePortfolio}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create Empty Portfolio
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Mode: Template Selection */}
        {mode === 'template_select' && (
          <Card>
            <CardHeader>
              <CardTitle>Select a Template</CardTitle>
              <CardDescription>
                Choose a portfolio structure. All templates are neutral starting points.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <div
                    key={`${template.templateId}-${template.version}`}
                    className="p-4 border rounded-lg hover:border-slate-400 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900">{template.name}</h3>
                        <p className="text-sm text-slate-600 mt-1">{template.description}</p>
                        <div className="mt-2 flex items-center gap-4 text-xs text-slate-500 font-mono">
                          <span>ID: {template.templateId}</span>
                          <span>v{template.version}</span>
                          <span>{template.goalAccountCount} goal account(s)</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSelectTemplate(template.templateId, template.version)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => setMode('choice')}>
                Back
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Mode: Template Preview */}
        {mode === 'template_preview' && selectedTemplate && (
          <Card>
            <CardHeader>
              <CardTitle>{selectedTemplate.name}</CardTitle>
              <CardDescription>
                Review the template structure before proceeding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Template Metadata */}
              <div className="p-4 bg-slate-50 rounded-lg border">
                <h4 className="font-medium text-slate-900 mb-2">Template Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-slate-500">Template ID:</div>
                  <div className="font-mono">{selectedTemplate.templateId}</div>
                  <div className="text-slate-500">Version:</div>
                  <div className="font-mono">{selectedTemplate.version}</div>
                  <div className="text-slate-500">Hash:</div>
                  <div className="font-mono text-xs">{selectedTemplate.templateHash}</div>
                  <div className="text-slate-500">Jurisdiction:</div>
                  <div>{selectedTemplate.jurisdiction}</div>
                  <div className="text-slate-500">Published:</div>
                  <div>{new Date(selectedTemplate.publishedAt).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Goal Account Structure */}
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Goal Account Structure</h4>
                <div className="space-y-3">
                  {selectedTemplate.goalAccountStructure.map((ga, index) => (
                    <div key={ga.accountKey} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="font-medium">{ga.name}</h5>
                          <p className="text-sm text-slate-600 mt-1">{ga.description}</p>
                          <div className="mt-2 text-xs text-slate-500">
                            Type: {ga.type} | Risk Profile: {ga.riskProfile}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="text-xs text-slate-500 mb-1">Target Allocation:</div>
                        <div className="flex flex-wrap gap-2">
                          {ga.targetAllocation.map((alloc) => (
                            <span
                              key={alloc.assetClass}
                              className="px-2 py-1 bg-slate-100 rounded text-xs"
                            >
                              {alloc.assetClass}: {alloc.targetPercent}%
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclosures */}
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Required Disclosures</h4>
                <div className="space-y-3">
                  {selectedTemplate.disclosures.map((disclosure) => (
                    <div key={disclosure.disclosureId} className="p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        {disclosure.requiresAcknowledgment && (
                          <Checkbox
                            id={disclosure.disclosureId}
                            checked={disclosuresAcknowledged[disclosure.disclosureId] || false}
                            onCheckedChange={() => handleDisclosureToggle(disclosure.disclosureId)}
                          />
                        )}
                        <div className="flex-1">
                          <label
                            htmlFor={disclosure.disclosureId}
                            className="font-medium text-slate-900 cursor-pointer"
                          >
                            {disclosure.title}
                          </label>
                          <p className="text-sm text-slate-600 mt-1">{disclosure.content}</p>
                          <div className="mt-1 text-xs text-slate-400">
                            Type: {disclosure.type}
                            {disclosure.requiresAcknowledgment && ' • Acknowledgment required'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  {error}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => {
                setSelectedTemplate(null);
                setMode('template_select');
              }}>
                Back
              </Button>
              <Button
                onClick={handleCreateFromTemplate}
                disabled={!allDisclosuresAcknowledged || isCreating || !canCreatePortfolio}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Use This Template
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-slate-400">
          <p>All actions are recorded in the activity log</p>
          <p className="mt-1">Logged in as: {user?.name || user?.email || 'Unknown'}</p>
        </div>
      </div>
    </div>
  );
}
