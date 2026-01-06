/**
 * Login Page
 * 
 * Data in: tenant identifier, user credentials
 * Data out: auth token, authority/role claims
 * Props: { onLoginSuccess: (session) => void }
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Shield } from "lucide-react";

interface LoginPageProps {
  onLoginSuccess?: (session: { userId: string; role: string }) => void;
}

export default function Login({ onLoginSuccess }: LoginPageProps) {
  const { isAuthenticated, user, loading } = useAuth();

  // If already authenticated, trigger callback
  if (isAuthenticated && user && onLoginSuccess) {
    onLoginSuccess({ userId: user.openId, role: user.role });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl">UltraWealth</CardTitle>
          <CardDescription>
            Regulated financial audit and control interface
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-slate-500 text-center">
            Sign in to access your portfolio and audit trail
          </div>
          <Button
            className="w-full"
            onClick={() => window.location.href = getLoginUrl()}
          >
            Sign in with TuringDynamics
          </Button>
          <div className="text-xs text-slate-400 text-center">
            All actions are logged and auditable
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
