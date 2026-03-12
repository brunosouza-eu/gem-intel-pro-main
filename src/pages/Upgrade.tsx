import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMonetization } from '@/contexts/MonetizationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Check, X, Crown, Zap, Shield, LineChart, MessageSquare,
  Bell, Coins, Star, ChevronDown, ChevronUp, Rocket,
  ArrowRight, ShieldCheck, HelpCircle, Sparkles
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import CreditPackageCard, { CreditPackage } from '@/components/monetization/CreditPackageCard';
import { cn } from '@/lib/utils';

// ─── Hotmart Checkout URLs ──────────────────────────────────────────
// Replace these with your actual Hotmart product checkout URLs
const HOTMART_URLS = {
  pro_monthly: 'https://pay.hotmart.com/I104826499B?off=66pn89ja&checkoutMode=6',
  pro_annual: 'https://pay.hotmart.com/I104826499B?off=mcw7ajf5&checkoutMode=6',
  elite_monthly: 'https://pay.hotmart.com/I104826499B?off=8rkh4vnv&checkoutMode=6',
  elite_annual: 'https://pay.hotmart.com/I104826499B?off=qg9w13pa&checkoutMode=6',
};

// ─── Price config per language ──────────────────────────────────────
const PRICING = {
  pt: {
    currency: 'R$',
    pro: { monthly: 47, annual: 397 },
    elite: { monthly: 97, annual: 797 },
  },
  en: {
    currency: '$',
    pro: { monthly: 9, annual: 79 },
    elite: { monthly: 19, annual: 159 },
  },
  es: {
    currency: '$',
    pro: { monthly: 9, annual: 79 },
    elite: { monthly: 19, annual: 159 },
  },
};

const Upgrade = () => {
  const { user, profile } = useAuth();
  const { credits } = useMonetization();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const pricing = PRICING[language] || PRICING.en;
  const ts = (key: string) => String(t(key as any) || key);

  // Fetch credit packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data, error } = await supabase
          .from('credit_packages' as any)
          .select('*')
          .order('price', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setPackages(data as unknown as CreditPackage[]);
        } else {
          setPackages([
            { id: '1', name: 'Recarga Rápida', credits: 30, price: 9.90, popular: false, desc: '+ Bônus: Curso Trade Master' },
            { id: '2', name: 'Recarga Turbo', credits: 100, price: 24.90, popular: true, desc: '+ Bônus: Curso Trade Master' },
          ]);
        }
      } catch (err) {
        console.error('Error fetching packages:', err);
        setPackages([
          { id: '1', name: 'Recarga Rápida', credits: 30, price: 9.90, popular: false, desc: '+ Bônus: Curso Trade Master' },
          { id: '2', name: 'Recarga Turbo', credits: 100, price: 24.90, popular: true, desc: '+ Bônus: Curso Trade Master' },
        ]);
      } finally {
        setLoadingPackages(false);
      }
    };
    fetchPackages();
  }, []);

  const handlePlanSubscribe = (planId: 'pro' | 'elite') => {
    const key = `${planId}_${isAnnual ? 'annual' : 'monthly'}` as keyof typeof HOTMART_URLS;
    const url = HOTMART_URLS[key];

    toast({
      title: ts('redirectingPayment'),
      description: ts('hotmartRedirect'),
    });

    window.open(url, '_blank');
  };

  const handlePurchaseCredits = async (pkg: CreditPackage) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    let url = '';
    if (pkg.credits === 30) url = 'https://pay.hotmart.com/A104828828D?off=f7eld6ze';
    else if (pkg.credits === 100) url = 'https://pay.hotmart.com/A104828828D?off=g0shftr1';

    if (url) {
      toast({
        title: ts('redirectingPayment'),
        description: `${pkg.name} — ${pricing.currency} ${pkg.price.toFixed(2)}`,
      });
      window.open(url, '_blank');
    }
  };

  // ─── Format price ─────────────────────────────────────────────────
  const formatPrice = (value: number) => {
    if (language === 'pt') {
      return `${pricing.currency} ${value}`;
    }
    return `${pricing.currency}${value}`;
  };

  const getMonthlyEquivalent = (annualPrice: number) => {
    const monthly = Math.round(annualPrice / 12);
    return formatPrice(monthly);
  };

  const getDiscount = (monthly: number, annual: number) => {
    return Math.round(100 - (annual / (monthly * 12)) * 100);
  };

  // ─── Plan configurations ──────────────────────────────────────────
  const plans = [
    {
      id: 'free',
      name: ts('planFreeName'),
      price: formatPrice(0),
      period: ts('perMonth'),
      description: ts('planFreeDesc'),
      icon: Zap,
      iconColor: 'text-slate-400',
      gradientFrom: 'from-slate-500/10',
      gradientTo: 'to-slate-600/5',
      features: [
        { text: ts('feat_free_1'), included: true },
        { text: ts('feat_free_2'), included: true },
        { text: ts('feat_free_3'), included: true },
        { text: ts('feat_free_4'), included: true },
        { text: ts('feat_free_5'), included: false },
        { text: ts('feat_free_6'), included: false },
        { text: ts('feat_free_7'), included: false },
      ],
      current: profile?.plan === 'free',
      buttonText: profile?.plan === 'free' ? ts('currentPlanBtn') : ts('downgradeBtn'),
      buttonVariant: 'outline' as const,
      action: () => { },
    },
    {
      id: 'pro',
      name: ts('planProName'),
      price: isAnnual
        ? formatPrice(pricing.pro.annual)
        : formatPrice(pricing.pro.monthly),
      period: isAnnual ? ts('perYear') : ts('perMonth'),
      monthlyEquiv: isAnnual ? getMonthlyEquivalent(pricing.pro.annual) : null,
      description: ts('planProDesc'),
      icon: Rocket,
      iconColor: 'text-primary',
      gradientFrom: 'from-primary/10',
      gradientTo: 'to-emerald-500/5',
      features: [
        { text: ts('feat_pro_1'), included: true },
        { text: ts('feat_pro_2'), included: true },
        { text: ts('feat_pro_3'), included: true },
        { text: ts('feat_pro_4'), included: true },
        { text: ts('feat_pro_5'), included: true },
        { text: ts('feat_pro_6'), included: true },
        { text: ts('feat_pro_7'), included: false },
      ],
      current: profile?.plan === 'pro',
      popular: true,
      buttonText: profile?.plan === 'pro' ? ts('currentPlanBtn') : ts('subscribePro'),
      buttonVariant: 'default' as const,
      action: () => handlePlanSubscribe('pro'),
    },
    {
      id: 'elite',
      name: ts('planEliteName'),
      price: isAnnual
        ? formatPrice(pricing.elite.annual)
        : formatPrice(pricing.elite.monthly),
      period: isAnnual ? ts('perYear') : ts('perMonth'),
      monthlyEquiv: isAnnual ? getMonthlyEquivalent(pricing.elite.annual) : null,
      description: ts('planEliteDesc'),
      icon: Crown,
      iconColor: 'text-amber-400',
      gradientFrom: 'from-amber-500/10',
      gradientTo: 'to-yellow-500/5',
      features: [
        { text: ts('feat_elite_1'), included: true },
        { text: ts('feat_elite_2'), included: true },
        { text: ts('feat_elite_3'), included: true },
        { text: ts('feat_elite_4'), included: true },
        { text: ts('feat_elite_5'), included: true },
        { text: ts('feat_elite_6'), included: true },
        { text: ts('feat_elite_7'), included: true },
      ],
      current: profile?.plan === 'elite',
      buttonText: profile?.plan === 'elite' ? ts('currentPlanBtn') : ts('subscribeElite'),
      buttonVariant: 'secondary' as const,
      action: () => handlePlanSubscribe('elite'),
    },
  ];

  const proDiscount = getDiscount(pricing.pro.monthly, pricing.pro.annual);
  const eliteDiscount = getDiscount(pricing.elite.monthly, pricing.elite.annual);

  // ─── FAQ data ─────────────────────────────────────────────────────
  const faqs = [
    { q: ts('faqQ1'), a: ts('faqA1') },
    { q: ts('faqQ2'), a: ts('faqA2') },
    { q: ts('faqQ3'), a: ts('faqA3') },
  ];

  // ─── Credit costs ─────────────────────────────────────────────────
  const creditCosts = [
    { label: 'Consulta ao Chat IA (Oráculo)', cost: 2 },
    { label: ts('cost_analysis'), cost: 1 },
    { label: ts('cost_guru'), cost: 3 },
    { label: 'Criar Alerta IA Avançado', cost: 2 },
    { label: 'Análise Trade Master', cost: 1 },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* ── Hero Header ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-card border-b border-border/50 py-16 mb-10">
        {/* Animated gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-amber-500/8 animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Gem Intel Pro
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-primary via-emerald-400 to-amber-400 leading-tight">
            {ts('upgradeTitle')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {ts('upgradeSubtitle')}
          </p>

          {/* Current Balance */}
          <div className="mt-8 inline-flex items-center gap-3 bg-secondary/50 backdrop-blur-md px-6 py-3 rounded-full border border-primary/20 shadow-lg shadow-primary/5">
            <Coins className="w-5 h-5 text-yellow-500" />
            <span className="text-lg font-medium">{ts('currentBalance')}:</span>
            <span className="text-2xl font-bold text-yellow-500">{credits}</span>
            <span className="text-sm text-muted-foreground">{ts('creditsLabel')}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <Tabs defaultValue="plans" className="space-y-10">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-2 p-1.5 bg-secondary/50 backdrop-blur-sm rounded-xl">
              <TabsTrigger value="plans" className="text-lg py-2.5 rounded-lg data-[state=active]:shadow-md transition-all">
                {ts('monthlyPlans')}
              </TabsTrigger>
              <TabsTrigger value="credits" className="text-lg py-2.5 rounded-lg data-[state=active]:shadow-md transition-all">
                {ts('buyCreditsTab')}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ── Plans Tab ─────────────────────────────────────────── */}
          <TabsContent value="plans" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-500">

            {/* Annual/Monthly Toggle */}
            <div className="flex justify-center mb-10">
              <div className="inline-flex items-center gap-3 bg-secondary/30 backdrop-blur-sm px-6 py-3 rounded-full border border-border/50">
                <span className={cn(
                  "text-sm font-semibold transition-colors",
                  !isAnnual ? "text-foreground" : "text-muted-foreground"
                )}>
                  {ts('monthly')}
                </span>
                <button
                  onClick={() => setIsAnnual(!isAnnual)}
                  className={cn(
                    "relative w-14 h-7 rounded-full transition-all duration-300",
                    isAnnual
                      ? "bg-gradient-to-r from-primary to-emerald-500 shadow-lg shadow-primary/30"
                      : "bg-muted-foreground/30"
                  )}
                >
                  <div className={cn(
                    "absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300",
                    isAnnual ? "translate-x-7" : "translate-x-0.5"
                  )} />
                </button>
                <span className={cn(
                  "text-sm font-semibold transition-colors",
                  isAnnual ? "text-foreground" : "text-muted-foreground"
                )}>
                  {ts('annual')}
                </span>
                {isAnnual && (
                  <span className="ml-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold animate-in zoom-in-95 duration-300 border border-emerald-500/30">
                    {ts('savePercent').replace('{pct}', String(Math.max(proDiscount, eliteDiscount)))}
                  </span>
                )}
              </div>
            </div>

            {/* Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {plans.map((plan) => {
                const Icon = plan.icon;
                return (
                  <Card
                    key={plan.id}
                    className={cn(
                      "relative flex flex-col transition-all duration-500 group",
                      plan.popular
                        ? 'border-primary/60 shadow-xl shadow-primary/10 scale-[1.03] z-10 bg-gradient-to-b from-card via-card to-primary/5'
                        : 'border-border/50 hover:border-primary/30 bg-card/50 hover:shadow-lg hover:-translate-y-1',
                      plan.current && 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-background'
                    )}
                  >
                    {/* Popular badge */}
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-emerald-500 text-white px-5 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-primary/30 flex items-center gap-1.5 whitespace-nowrap">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {ts('mostPopularBadge')}
                      </div>
                    )}

                    {/* Current badge */}
                    {plan.current && (
                      <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-bl-lg text-xs font-bold border-l border-b border-emerald-500/20">
                        {ts('currentPlanLabel')}
                      </div>
                    )}

                    <CardHeader className="text-center pt-10 pb-2">
                      {/* Plan Icon */}
                      <div className={cn(
                        "mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110",
                        `bg-gradient-to-br ${plan.gradientFrom} ${plan.gradientTo}`
                      )}>
                        <Icon className={cn("w-7 h-7", plan.iconColor)} />
                      </div>

                      <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>

                      <div className="mt-4 flex items-baseline justify-center gap-1">
                        <span className="text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                          {plan.price}
                        </span>
                        <span className="text-muted-foreground text-lg">{plan.period}</span>
                      </div>

                      {/* Monthly equivalent for annual */}
                      {'monthlyEquiv' in plan && plan.monthlyEquiv && isAnnual && (
                        <p className="mt-1 text-sm text-emerald-400 font-medium">
                          ≈ {plan.monthlyEquiv}{ts('perMonth')}
                        </p>
                      )}

                      <CardDescription className="mt-3 text-sm">{plan.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1 px-6">
                      <Separator className="my-4 opacity-50" />
                      <ul className="space-y-3.5 text-sm">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            {feature.included ? (
                              <div className="p-1 rounded-full bg-emerald-500/15 text-emerald-500 shrink-0">
                                <Check className="w-3.5 h-3.5" strokeWidth={3} />
                              </div>
                            ) : (
                              <div className="p-1 rounded-full bg-muted/50 text-muted-foreground/40 shrink-0">
                                <X className="w-3.5 h-3.5" />
                              </div>
                            )}
                            <span className={cn(
                              "transition-colors",
                              feature.included ? 'text-foreground' : 'text-muted-foreground/40 line-through'
                            )}>
                              {feature.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter className="px-6 pb-6">
                      {plan.id === 'free' ? (
                        <Button
                          className="w-full h-12 text-base font-bold"
                          variant="outline"
                          disabled={plan.current}
                        >
                          {plan.buttonText}
                        </Button>
                      ) : plan.id === 'pro' ? (
                        <Button
                          className={cn(
                            "w-full h-12 text-base font-bold transition-all duration-300",
                            "bg-gradient-to-r from-primary to-emerald-500 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]",
                            plan.current && "opacity-50"
                          )}
                          onClick={plan.action}
                          disabled={plan.current}
                        >
                          <span className="flex items-center gap-2">
                            {plan.current ? plan.buttonText : (
                              <>
                                {plan.buttonText}
                                <ArrowRight className="w-4 h-4" />
                              </>
                            )}
                          </span>
                        </Button>
                      ) : (
                        <Button
                          className={cn(
                            "w-full h-12 text-base font-bold transition-all duration-300",
                            "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-black hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98]",
                            plan.current && "opacity-50"
                          )}
                          onClick={plan.action}
                          disabled={plan.current}
                        >
                          <span className="flex items-center gap-2">
                            <Crown className="w-4 h-4" />
                            {plan.buttonText}
                          </span>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            {/* ── Guarantee Section ────────────────────────────────── */}
            <div className="mt-16 max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                <ShieldCheck className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{ts('guaranteeTitle')}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto">
                {ts('guaranteeDesc')}
              </p>
            </div>

            {/* ── FAQ Section ─────────────────────────────────────── */}
            <div className="mt-16 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
                <HelpCircle className="w-6 h-6 text-primary" />
                {ts('faqTitle')}
              </h3>

              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "rounded-xl border transition-all duration-300",
                      openFaq === idx
                        ? "border-primary/30 bg-primary/5 shadow-md"
                        : "border-border/50 bg-card/50 hover:border-primary/20"
                    )}
                  >
                    <button
                      className="w-full flex items-center justify-between p-5 text-left"
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    >
                      <span className="font-semibold text-base pr-4">{faq.q}</span>
                      {openFaq === idx ? (
                        <ChevronUp className="w-5 h-5 text-primary shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                      )}
                    </button>
                    {openFaq === idx && (
                      <div className="px-5 pb-5 text-muted-foreground leading-relaxed animate-in fade-in-0 slide-in-from-top-1 duration-200">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ── Credits Tab ────────────────────────────────────────── */}
          <TabsContent value="credits" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-3">{ts('creditPackTitle')}</h2>
              <p className="text-muted-foreground">
                {ts('creditPackDesc')}
              </p>
            </div>

            {loadingPackages ? (
              <div className="flex justify-center items-center h-40">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {packages.map((pkg) => (
                  <CreditPackageCard
                    key={pkg.id}
                    pkg={pkg}
                    onPurchase={handlePurchaseCredits}
                    isLoading={purchasing === pkg.id}
                  />
                ))}
              </div>
            )}

            {/* Credit costs info */}
            <div className="mt-12 max-w-3xl mx-auto bg-secondary/20 rounded-xl p-6 border border-border/50 backdrop-blur-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                {ts('whatCanIDo')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {creditCosts.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-background/50 border border-border/30">
                    <span>{item.label}</span>
                    <Badge variant="secondary" className="font-bold">
                      {item.cost} {item.cost === 1 ? ts('creditUnit') : ts('creditUnitPlural')}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Upgrade;
