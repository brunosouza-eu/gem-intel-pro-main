import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';

const UpdatePasswordPage = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Check if user has a valid recovery session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      // If no session exists (user didn't come from email link), redirect to auth
      if (!session) {
        navigate('/auth');
      }
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: language === 'pt' ? 'Senhas não coincidem' : 'Passwords do not match',
        description: language === 'pt' 
          ? 'Por favor, verifique se as senhas são iguais.' 
          : 'Please make sure the passwords match.',
        variant: 'destructive'
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: language === 'pt' ? 'Senha muito curta' : 'Password too short',
        description: language === 'pt' 
          ? 'A senha deve ter pelo menos 6 caracteres.' 
          : 'Password must be at least 6 characters.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setSuccess(true);
      toast({
        title: language === 'pt' ? 'Senha atualizada!' : 'Password updated!',
        description: language === 'pt' 
          ? 'Sua senha foi alterada com sucesso.' 
          : 'Your password has been changed successfully.'
      });

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error: any) {
      toast({
        title: language === 'pt' ? 'Erro ao atualizar senha' : 'Error updating password',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass text-center">
          <CardContent className="pt-8 pb-8">
            <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              {language === 'pt' ? 'Senha Atualizada!' : 'Password Updated!'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'pt' 
                ? 'Redirecionando para o dashboard...' 
                : 'Redirecting to dashboard...'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {language === 'pt' ? 'Nova Senha' : 'New Password'}
          </CardTitle>
          <CardDescription>
            {language === 'pt' 
              ? 'Digite sua nova senha abaixo' 
              : 'Enter your new password below'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">
                {language === 'pt' ? 'Nova Senha' : 'New Password'}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {language === 'pt' ? 'Confirmar Senha' : 'Confirm Password'}
              </Label>
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-info"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {language === 'pt' ? 'Atualizando...' : 'Updating...'}
                </>
              ) : (
                language === 'pt' ? 'Atualizar Senha' : 'Update Password'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatePasswordPage;
