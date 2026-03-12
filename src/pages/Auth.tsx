import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Globe, Eye, EyeOff, ArrowLeft, ShieldAlert } from 'lucide-react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { z } from 'zod';

// Login schema — backwards compatible (6 chars min)
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

// Signup schema — stronger requirements
const signupSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/[0-9]/, 'Senha deve conter pelo menos 1 número')
    .regex(/[a-zA-Z]/, 'Senha deve conter pelo menos 1 letra'),
});

const emailSchema = z.object({
  email: z.string().email('Email inválido'),
});

// Cooldown in seconds between signups
const SIGNUP_COOLDOWN_SECONDS = 60;

type AuthMode = 'login' | 'signup' | 'reset';

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [signupCooldown, setSignupCooldown] = useState(0);
  const [captchaToken, setCaptchaToken] = useState<string>('');

  const { signIn, signInWithGoogle, signUp, resetPassword, user } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Check for existing signup cooldown on mount
  useEffect(() => {
    const lastSignup = localStorage.getItem('last_signup_timestamp');
    if (lastSignup) {
      const elapsed = Math.floor((Date.now() - parseInt(lastSignup, 10)) / 1000);
      const remaining = SIGNUP_COOLDOWN_SECONDS - elapsed;
      if (remaining > 0) {
        setSignupCooldown(remaining);
      }
    }
  }, []);

  // Countdown timer for signup cooldown
  useEffect(() => {
    if (signupCooldown <= 0) return;
    const timer = setInterval(() => {
      setSignupCooldown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [signupCooldown]);

  const validate = () => {
    try {
      if (mode === 'reset') {
        emailSchema.parse({ email });
      } else if (mode === 'signup') {
        signupSchema.parse({ email, password });
      } else {
        loginSchema.parse({ email, password });
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { email?: string; password?: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0] === 'email') fieldErrors.email = err.message;
          if (err.path[0] === 'password') fieldErrors.password = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    // Block signup if cooldown is active
    if (mode === 'signup' && signupCooldown > 0) {
      toast({
        title: '⏳ Aguarde',
        description: `Tente novamente em ${signupCooldown} segundos.`,
        variant: 'destructive',
      });
      return;
    }

    if (mode === 'signup' && import.meta.env.VITE_PUBLIC_HCAPTCHA_SITE_KEY && !captchaToken) {
      toast({
        title: 'Verificação Necessária',
        description: 'Por favor, complete o CAPTCHA para continuar.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'reset') {
        const { error } = await resetPassword(email);
        if (error) {
          toast({
            title: t('resetPasswordError') as string,
            description: error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: t('resetPasswordSuccess') as string,
          });
          setMode('login');
        }
      } else {
        const { error } = mode === 'login'
          ? await signIn(email, password)
          : await signUp(email, password, captchaToken);

        if (error) {
          toast({
            title: mode === 'login' ? t('loginError') as string : t('signUpError') as string,
            description: error.message,
            variant: 'destructive',
          });
        } else {
          // Set signup cooldown
          if (mode === 'signup') {
            localStorage.setItem('last_signup_timestamp', Date.now().toString());
            setSignupCooldown(SIGNUP_COOLDOWN_SECONDS);
          }

          toast({
            title: mode === 'login' ? t('loginSuccess') as string : t('signUpSuccess') as string,
          });
          navigate('/dashboard');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    if (language === 'pt') setLanguage('en');
    else if (language === 'en') setLanguage('es');
    else setLanguage('pt');
  };

  const getTitle = () => {
    if (mode === 'reset') return t('resetPassword');
    return t('appName');
  };

  const getDescription = () => {
    if (mode === 'reset') return t('resetPasswordDesc');
    if (mode === 'login') {
      if (language === 'pt') return 'Entre para acessar suas análises';
      if (language === 'es') return 'Inicia sesión para acceder a tus análisis';
      return 'Sign in to access your analysis';
    }
    if (language === 'pt') return 'Crie sua conta e comece agora';
    if (language === 'es') return 'Crea tu cuenta y comienza ahora';
    return 'Create your account and get started';
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-info/5 rounded-full blur-3xl" />

      {/* Language toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleLanguage}
        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
      >
        <Globe className="w-5 h-5" />
      </Button>

      <Card className="w-full max-w-md glass-strong animate-scale-in relative z-10">
        <CardHeader className="text-center">
          {mode === 'reset' ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMode('login')}
              className="absolute left-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              {t('backToLogin')}
            </Button>
          ) : null}
          <div className="text-5xl mb-4">💎</div>
          <CardTitle className="text-3xl font-bold text-gradient">
            {getTitle()}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {getDescription()}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="bg-muted/50 border-border"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {mode !== 'reset' && (
              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-muted/50 border-border pr-10"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
                {mode === 'signup' && (
                  <p className="text-[10px] text-muted-foreground">
                    Mínimo 8 caracteres, com pelo menos 1 letra e 1 número
                  </p>
                )}
              </div>
            )}

            {mode === 'login' && (
              <button
                type="button"
                onClick={() => setMode('reset')}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                {t('forgotPassword')}
              </button>
            )}

            {mode !== 'reset' && (
              <>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    setIsLoading(true);
                    const { error } = await signInWithGoogle();
                    if (error) {
                      toast({
                        title: 'Google Login Failed',
                        description: error.message,
                        variant: 'destructive',
                      });
                      setIsLoading(false);
                    }
                  }}
                  className="w-full mb-4 bg-white text-black hover:bg-gray-100 border-gray-200"
                  disabled={isLoading}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </Button>
              </>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              disabled={isLoading || (mode === 'signup' && signupCooldown > 0)}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {mode === 'reset'
                ? t('sendResetLink')
                : mode === 'login'
                  ? t('login')
                  : signupCooldown > 0
                    ? `Aguarde ${signupCooldown}s`
                    : t('signUp')}
            </Button>
          </form>

          {/* Anti-abuse warning — only on signup */}
          {mode === 'signup' && (
            <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-400/90 leading-relaxed">
                <strong>Segurança:</strong> Contas duplicadas ou criadas com emails falsos serão <strong>permanentemente banidas</strong>. Utilizamos verificação avançada para proteger nossa comunidade.
              </p>
            </div>
          )}

          {mode === 'signup' && import.meta.env.VITE_PUBLIC_HCAPTCHA_SITE_KEY && (
              <div className="mt-4 flex justify-center">
                  <HCaptcha
                    sitekey={import.meta.env.VITE_PUBLIC_HCAPTCHA_SITE_KEY}
                    onVerify={(token) => setCaptchaToken(token)}
                    theme="dark"
                  />
              </div>
          )}

          {mode !== 'reset' && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {mode === 'login' ? t('noAccount') : t('hasAccount')}{' '}
                <span className="font-medium text-primary">
                  {mode === 'login' ? t('signUp') : t('login')}
                </span>
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;