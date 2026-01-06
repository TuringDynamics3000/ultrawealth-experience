/**
 * Templates Page
 * 
 * Read-only view of available portfolio templates.
 * No instantiation actions on this page - use Onboarding for that.
 * 
 * RULES:
 * - Read-only display only
 * - No recommendations, rankings, or nudging
 * - Authority-gated (PORTFOLIO_READ)
 * - Templates are immutable and versioned
 */

import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye, FileText, Loader2, AlertTriangle, Lock } from "lucide-react";
import { useLocation, Link } from "wouter";
import { useAuthorities, AuthorityGate } from "@/hooks/useAuthorities";
import type { PortfolioTemplate, PortfolioTemplateSummary } from "@/contracts/template";
import { TEMPLATE_SEED_DATA } from "@/demo/template-seed";

export default function Templates() {
  const { user, isAuthenticated, loading } = useAuth();
  const { has, executionMode } = useAuthorities();
  const [, setLocation] = useLocation();
  
  // State
  const [templates, setTemplates] = useState<PortfolioTemplateSummary[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<PortfolioTemplate | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Load templates on mount
  useEffect(() => {
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

  // Check authority
  const canViewTemplates = has('PORTFOLIO_READ');

  // Handle template preview
  const handlePreview = (templateId: string, version: string) => {
    const template = TEMPLATE_SEED_DATA.getTemplateByIdAndVersion(templateId, version);
    if (template) {
      setSelectedTemplate(template);
      setIsPreviewOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/portfolio">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Portfolio
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Portfolio Templates</h1>
                <p className="text-sm text-slate-500">Read-only template catalog</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={executionMode === 'DEMO' ? 'secondary' : 'default'}>
                {executionMode}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Authority Warning */}
        {!canViewTemplates && (
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">Access Restricted</p>
                  <p className="text-sm text-amber-700 mt-1">
                    You do not have PORTFOLIO_READ authority to view templates.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <AuthorityGate authority="PORTFOLIO_READ" fallback={null}>
          {/* Info Banner */}
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Read-Only View</p>
                  <p className="text-sm text-blue-700 mt-1">
                    This page displays available templates for reference. To create a portfolio from a template, 
                    use the <Link href="/onboarding" className="underline">Onboarding</Link> flow.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Templates Table */}
          <Card>
            <CardHeader>
              <CardTitle>Available Templates</CardTitle>
              <CardDescription>
                {templates.length} template(s) available. Templates are versioned and immutable.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Goal Accounts</TableHead>
                    <TableHead>Jurisdiction</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={`${template.templateId}-${template.version}`}>
                      <TableCell className="font-mono text-xs">{template.templateId}</TableCell>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>v{template.version}</TableCell>
                      <TableCell>{template.goalAccountCount}</TableCell>
                      <TableCell>{template.jurisdiction}</TableCell>
                      <TableCell>
                        <Badge variant={template.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                          {template.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePreview(template.templateId, template.version)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Template Hash Reference */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Template Hashes</CardTitle>
              <CardDescription>
                Immutable content hashes for audit and verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Content Hash</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={`hash-${template.templateId}-${template.version}`}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>v{template.version}</TableCell>
                      <TableCell className="font-mono text-xs">{template.templateHash}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </AuthorityGate>
      </main>

      {/* Template Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedTemplate && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTemplate.name}</DialogTitle>
                <DialogDescription>
                  Template details and structure (read-only)
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
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
                    <div className="text-slate-500">Status:</div>
                    <div>
                      <Badge variant={selectedTemplate.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                        {selectedTemplate.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Description</h4>
                  <p className="text-sm text-slate-600">{selectedTemplate.description}</p>
                </div>

                {/* Goal Account Structure */}
                <div>
                  <h4 className="font-medium text-slate-900 mb-3">Goal Account Structure</h4>
                  <div className="space-y-3">
                    {selectedTemplate.goalAccountStructure.map((ga) => (
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
                  <div className="space-y-2">
                    {selectedTemplate.disclosures.map((disclosure) => (
                      <div key={disclosure.disclosureId} className="p-3 border rounded-lg">
                        <div className="flex items-start gap-2">
                          <Lock className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium text-sm">{disclosure.title}</div>
                            <p className="text-xs text-slate-600 mt-1">{disclosure.content}</p>
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

                {/* Read-Only Notice */}
                <div className="p-3 bg-slate-100 rounded-lg text-center text-sm text-slate-600">
                  <Lock className="w-4 h-4 inline-block mr-1" />
                  This is a read-only view. To use this template, go to{' '}
                  <Link href="/onboarding" className="text-blue-600 underline">
                    Onboarding
                  </Link>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t bg-white mt-8">
        <div className="container py-4 text-center text-xs text-slate-400">
          <p>Templates are immutable and versioned. All usage is recorded in the activity log.</p>
          <p className="mt-1">Logged in as: {user?.name || user?.email || 'Unknown'}</p>
        </div>
      </footer>
    </div>
  );
}
