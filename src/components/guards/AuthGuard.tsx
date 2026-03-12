import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthGuardProps {
  children: React.ReactNode;
  requirePro?: boolean;
  requireAdmin?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requirePro = false, requireAdmin = false }) => {
  const { user, loading, isPro, isBlocked, blockedReason, signOut } = useAuth();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(requireAdmin);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!requireAdmin || !user) {
        setCheckingAdmin(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        setIsAdmin(!!data);
      } catch {
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    };

    if (user && requireAdmin) {
      checkAdmin();
    } else {
      setCheckingAdmin(false);
    }
  }, [user, requireAdmin]);

  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Block check - show blocked screen
  if (isBlocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mx-auto">
            <Ban className="w-10 h-10 text-destructive" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Conta Suspensa</h1>
            <p className="text-muted-foreground mt-2">
              Sua conta foi temporariamente suspensa pelo administrador.
            </p>
            {blockedReason && (
              <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-left">
                <p className="text-sm font-medium text-destructive">Motivo:</p>
                <p className="text-sm text-muted-foreground mt-1">{blockedReason}</p>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Entre em contato com o suporte para mais informações.
          </p>
          <Button variant="outline" onClick={signOut} className="gap-2">
            Sair
          </Button>
        </div>
      </div>
    );
  }

  if (requirePro && !isPro) {
    return <Navigate to="/upgrade" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
