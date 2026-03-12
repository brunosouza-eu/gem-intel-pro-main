import React, { useEffect, useState, useMemo, useRef } from 'react';
import { ExchangeFloatingBar } from '@/components/ExchangeReferral';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGamification } from '@/contexts/GamificationContext';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimePrices } from '@/lib/realtimeService';
import { TokenSearchSelect } from '@/components/ui/TokenSearchSelect';
import { useAlerts } from '@/contexts/AlertContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useCreditGuard } from '@/hooks/useCreditGuard';
import { Label } from '@/components/ui/label';
import {
  Bell, Target, TrendingUp, AlertTriangle, Loader2, DollarSign,
  Trash2, BellRing, Crown, Coins, Sparkles, Plus, History,
  Bot, Zap, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// New components
import { AlertStatsHeader } from '@/components/alerts/AlertStatsHeader';
import { AlertCard } from '@/components/alerts/AlertCard';
import { CreateAlertForm } from '@/components/alerts/CreateAlertForm';
import { AlertTimeline } from '@/components/alerts/AlertTimeline';
import { AlertsTutorial } from '@/components/alerts/AlertsTutorial';

// ====== AI Alert Types (existing) ======
interface AIAlert {
  id: string;
  token_id: string;
  entry_zone: string | null;
  stop: string | null;
  targets: string | null;
  risk_reward: string | null;
  invalidation: string | null;
  volatility_note: string | null;
  created_at: string;
  created_by: string | null;
  tokens?: { name: string; ticker: string; };
}

interface Token {
  id: string;
  name: string;
  ticker: string;
}

const AlertsPage = () => {
  const { t, language } = useLanguage();
  const pt = language === 'pt';
  const { toast } = useToast();
  const { profile } = useGamification();
  const { checkAndUse, isVip, creditsAvailable, guardModals } = useCreditGuard();
  const { alerts: customAlerts, history, stats, toggleAlert, removeAlert, clearHistory, playAlertSound } = useAlerts();

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [aiAlerts, setAiAlerts] = useState<AIAlert[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedTokenId, setSelectedTokenId] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('my-alerts');
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token');

  // Price tracking for AI alerts
  const aiAlertTickers = useMemo(() =>
    [...new Set(aiAlerts.map(a => a.tokens?.ticker).filter(Boolean) as string[])],
    [aiAlerts]
  );
  const { getPrice } = useRealtimePrices(aiAlertTickers);
  const notifiedAiAlerts = useRef<Set<string>>(new Set());

  // ====== Helper Functions ======
  const parsePriceRange = (str: string | null): { min: number; max: number } | null => {
    if (!str) return null;
    const match = str.match(/\$?([\d.]+)(?:\s*-\s*\$?([\d.]+))?/);
    if (match) {
      const min = parseFloat(match[1]);
      const max = match[2] ? parseFloat(match[2]) : min;
      return { min, max };
    }
    return null;
  };

  const getPriceStatusClass = (ticker: string, alert: AIAlert): string => {
    const priceData = getPrice(ticker);
    if (!priceData) return 'text-muted-foreground';
    const currentPrice = priceData.price;
    const entry = parsePriceRange(alert.entry_zone);
    const stop = parsePriceRange(alert.stop);
    let targets: number[] = [];
    if (alert.targets) {
      try {
        const parsed = JSON.parse(alert.targets);
        if (Array.isArray(parsed)) {
          targets = parsed.map((t: string) => parseFloat(t.replace(/[$,]/g, ''))).filter(v => !isNaN(v));
        }
      } catch {
        const matches = alert.targets.match(/\$?([\d.]+)/g);
        if (matches) targets = matches.map(m => parseFloat(m.replace('$', '')));
      }
    }
    if (entry && currentPrice >= entry.min && currentPrice <= entry.max) return 'text-success bg-success/10 border-success/30';
    if (stop && currentPrice <= stop.min) return 'text-destructive bg-destructive/10 border-destructive/30';
    if (targets.length > 0 && currentPrice >= Math.max(...targets)) return 'text-primary bg-primary/10 border-primary/30';
    return 'text-foreground';
  };

  const parseTargets = (targets: string | null): string[] => {
    if (!targets) return [];
    try { return JSON.parse(targets); }
    catch { return targets.split(',').map(t => t.trim()); }
  };

  // ====== Data Fetching ======
  useEffect(() => {
    let currentUser: string | null = null;
    fetchData().then(uid => { currentUser = uid; });
    const channel = supabase
      .channel('alerts-page-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'alerts' },
        async (payload) => {
          const { data } = await supabase.from('alerts').select('*, tokens(name, ticker)').eq('id', payload.new.id).single();
          if (data && currentUser && data.created_by === currentUser) setAiAlerts(prev => [data, ...prev]);
        }
      )
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'alerts' },
        (payload) => { setAiAlerts(prev => prev.filter(a => a.id !== payload.old.id)); }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // ====== AI Alert Monitoring ======
  useEffect(() => {
    aiAlerts.forEach(alert => {
      const ticker = alert.tokens?.ticker;
      if (!ticker) return;

      const priceData = getPrice(ticker);
      if (!priceData) return;

      const currentPrice = priceData.price;
      const entry = parsePriceRange(alert.entry_zone);

      if (entry && currentPrice >= entry.min && currentPrice <= entry.max) {
        if (!notifiedAiAlerts.current.has(alert.id)) {
          notifiedAiAlerts.current.add(alert.id);

          playAlertSound('high');
          toast({
            title: `🤖 ${pt ? 'Alerta IA' : 'AI Alert'}: ${ticker}`,
            description: pt ? `Preço atual ($${currentPrice.toFixed(4)}) atingiu a Zona de Entrada (${alert.entry_zone})!` : `Current price ($${currentPrice.toFixed(4)}) reached Entry Zone (${alert.entry_zone})!`,
            className: "bg-blue-600 text-white border-blue-500",
            duration: 10000,
          });

          // Also trigger browser push notification if permitted
          if (Notification.permission === 'granted') {
            new Notification(`🤖 ${pt ? 'Alerta IA Gem Intel' : 'AI Alert Gem Intel'}: ${ticker}`, {
              body: pt ? `Preço atingiu a Zona de Entrada: $${currentPrice.toFixed(4)}` : `Price reached Entry Zone: $${currentPrice.toFixed(4)}`,
              icon: '/favicon.ico',
            });
          }
        }
      }
    });

    // We don't remove from set if it leaves the zone, 
    // to prevent spamming if it's bouncing around the edge.
  }, [aiAlerts, getPrice, playAlertSound, toast]);

  const fetchData = async (): Promise<string | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);

      let alertsQuery = supabase.from('alerts').select('*, tokens(name, ticker)').order('created_at', { ascending: false }).limit(20);
      if (user?.id) {
        alertsQuery = alertsQuery.eq('created_by', user.id);
      } else {
        // Fallback for unauthenticated
        alertsQuery = alertsQuery.eq('id', 'unauthenticated');
      }

      const [alertsRes, tokensRes] = await Promise.all([
        alertsQuery,
        supabase.from('tokens').select('id, name, ticker').order('name'),
      ]);

      if (alertsRes.data) setAiAlerts(alertsRes.data);
      if (tokensRes.data) {
        setTokens(tokensRes.data);
        // Auto-select token from URL param (e.g. from Trade Master)
        if (tokenFromUrl && tokensRes.data.length > 0) {
          const match = tokensRes.data.find(
            (t: Token) => t.ticker.toUpperCase() === tokenFromUrl.toUpperCase()
          );
          if (match) {
            setSelectedTokenId(match.id);
            setActiveTab('create');
          }
        }
      }

      return user?.id || null;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateAlert = async () => {
    if (!selectedTokenId) {
      toast({ title: pt ? 'Selecione um token' : 'Select a token', variant: 'destructive' });
      return;
    }
    if (!isVip) {
      const canProceed = await checkAndUse('create_alert');
      if (!canProceed) return;
    }
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-alert', { body: { token_id: selectedTokenId } });
      if (error) throw error;
      toast({ title: pt ? 'Alerta IA Gerado! 🤖' : 'AI Alert Generated! 🤖', description: pt ? 'Alerta estruturado criado com sucesso!' : 'Structured alert created successfully!' });
      fetchData();
    } catch (err: unknown) {
      const error = err as any;
      let errorMessage = pt ? 'Erro desconhecido' : 'Unknown error';
      if (error?.context?.body) {
        try {
          const body = typeof error.context.body === 'string' ? JSON.parse(error.context.body) : error.context.body;
          errorMessage = body?.error || JSON.stringify(body);
        } catch { errorMessage = String(error.context.body); }
      } else if (error?.message) { errorMessage = error.message; }
      toast({ title: pt ? 'Erro ao gerar alerta' : 'Failed to generate alert', description: errorMessage, variant: 'destructive' });
    } finally {
      setGenerating(false);
    }
  };

  const deleteAiAlert = async (alertId: string) => {
    try {
      // Atualização otimista (optimistic update) para remover da tela imediatamente
      setAiAlerts((prev) => prev.filter((a) => a.id !== alertId));

      const { error } = await supabase.from('alerts').delete().eq('id', alertId).select();
      if (error) {
        // Se der erro, tenta buscar os dados originais novamente
        fetchData();
        throw error;
      }
      toast({ title: pt ? 'Alerta removido' : 'Alert removed' });
    } catch (error: unknown) {
      toast({ title: pt ? 'Erro ao remover alerta' : 'Failed to remove alert', description: pt ? 'Houve um erro ou sem permissão.' : 'An error occurred or insufficient permissions.', variant: 'destructive' });
    }
  };

  // ====== Loading State ======
  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
        <div className="grid gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
        </div>
      </div>
    );
  }

  // Active custom alerts
  const activeAlerts = customAlerts.filter(a => a.isActive);
  const triggeredAlerts = customAlerts.filter(a => !a.isActive && a.triggeredAt);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ====== Hero Header ====== */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-blue-600 text-white">
            <Bell className="w-6 h-6" />
          </div>
          {pt ? 'Central de Alertas' : 'Alert Center'}
        </h1>
        <p className="text-muted-foreground">
          {pt ? 'Monitore preços, variações e receba notificações em tempo real' : 'Monitor prices, changes and receive real-time notifications'}
        </p>
      </div>

      {/* ====== Stats Header ====== */}
      <AlertStatsHeader stats={stats} />

      {/* ====== Tutorial ====== */}
      <AlertsTutorial />

      {/* ====== Tabs ====== */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-12 bg-muted/30 backdrop-blur-sm rounded-xl p-1">
          <TabsTrigger
            value="my-alerts"
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-md transition-all gap-2 text-xs sm:text-sm"
          >
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">{pt ? 'Meus Alertas' : 'My Alerts'}</span>
            <span className="sm:hidden">{pt ? 'Alertas' : 'Alerts'}</span>
            {activeAlerts.length > 0 && (
              <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary">
                {activeAlerts.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="ai-alerts"
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-md transition-all gap-2 text-xs sm:text-sm"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">{pt ? 'Alertas IA' : 'AI Alerts'}</span>
            <span className="sm:hidden">{pt ? 'IA' : 'AI'}</span>
            {aiAlerts.length > 0 && (
              <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-blue-600">
                {aiAlerts.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="create"
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-md transition-all gap-2 text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{pt ? 'Criar Alerta' : 'Create Alert'}</span>
            <span className="sm:hidden">{pt ? 'Criar' : 'New'}</span>
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-md transition-all gap-2 text-xs sm:text-sm"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">{pt ? 'Histórico' : 'History'}</span>
            <span className="sm:hidden">{pt ? 'Hist.' : 'Hist.'}</span>
            {history.length > 0 && (
              <Badge variant="outline" className="h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                {history.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ====== TAB: Meus Alertas ====== */}
        <TabsContent value="my-alerts" className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          {customAlerts.length === 0 ? (
            <Card className="glass">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-blue-600/20 mb-4 animate-pulse">
                  <Bell className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{pt ? 'Nenhum alerta personalizado' : 'No custom alerts'}</h3>
                <p className="text-muted-foreground text-center max-w-md text-sm mb-4">
                  {pt ? 'Crie alertas de preço, variação percentual e mais. Receba notificações instantâneas no navegador quando seus alvos forem atingidos.' : 'Create price alerts, percentage changes and more. Receive instant browser notifications when your targets are hit.'}
                </p>
                <Button
                  onClick={() => setActiveTab('create')}
                  className="bg-gradient-to-r from-primary to-blue-600 gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {pt ? 'Criar Primeiro Alerta' : 'Create First Alert'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {/* Active Alerts */}
              {activeAlerts.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Zap className="w-3 h-3 text-success" />
                    {pt ? 'Ativos' : 'Active'} ({activeAlerts.length})
                  </h3>
                  {activeAlerts.map(alert => (
                    <AlertCard key={alert.id} alert={alert} onToggle={toggleAlert} onDelete={removeAlert} />
                  ))}
                </div>
              )}

              {/* Triggered/Inactive Alerts */}
              {triggeredAlerts.length > 0 && (
                <div className="space-y-3 mt-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {pt ? 'Desativados / Disparados' : 'Deactivated / Triggered'} ({triggeredAlerts.length})
                  </h3>
                  {triggeredAlerts.map(alert => (
                    <AlertCard key={alert.id} alert={alert} onToggle={toggleAlert} onDelete={removeAlert} />
                  ))}
                </div>
              )}

              {/* Quick create button */}
              <div className="pt-4">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('create')}
                  className="w-full py-6 border-dashed border-2 hover:border-primary/50 transition-colors gap-2"
                >
                  <Plus className="w-5 h-5" />
                  {pt ? 'Criar Novo Alerta' : 'Create New Alert'}
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* ====== TAB: Alertas IA ====== */}
        <TabsContent value="ai-alerts" className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          {/* AI Alert Generator */}
          <Card className="glass border-blue-500/20">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-3 items-end">
                <div className="flex-1 space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Bot className="w-4 h-4 text-blue-400" />
                    {pt ? 'Gerar Alerta Estruturado com IA' : 'Generate Structured AI Alert'}
                  </Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    {pt ? 'A IA analisa o token e cria um alerta com zona de entrada, stop loss, alvos e R:R.' : 'AI analyzes the token and creates an alert with entry zone, stop loss, targets and R:R.'}
                  </p>
                  <TokenSearchSelect
                    tokens={tokens}
                    value={selectedTokenId}
                    onValueChange={setSelectedTokenId}
                    valueKey="id"
                    placeholder={pt ? 'Selecione o Token...' : 'Select Token...'}
                  />
                </div>
                <Button
                  onClick={generateAlert}
                  disabled={generating || !selectedTokenId || (!isVip && creditsAvailable < 5)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2 whitespace-nowrap"
                >
                  {generating ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> {pt ? 'Gerando...' : 'Generating...'}</>
                  ) : (!isVip && creditsAvailable < 5) ? (
                    <><Coins className="w-4 h-4" /> {pt ? 'Sem créditos' : 'No credits'}</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> {isVip ? (pt ? 'Gerar Alerta IA' : 'Generate AI Alert') : (pt ? 'Gerar Alerta IA (5)' : 'Generate AI Alert (5)')}</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Alerts List */}
          {aiAlerts.length === 0 ? (
            <Card className="glass">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="p-4 rounded-full bg-blue-500/10 mb-4">
                  <Bot className="w-12 h-12 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{pt ? 'Nenhum alerta IA ainda' : 'No AI alerts yet'}</h3>
                <p className="text-muted-foreground text-center max-w-md text-sm">
                  {pt ? 'Selecione um token e clique em "Gerar Alerta IA" para criar um alerta estruturado com zona de entrada, stop loss e alvos.' : 'Select a token and click "Generate AI Alert" to create a structured alert with entry zone, stop loss and targets.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {aiAlerts.map((alert) => {
                const targets = parseTargets(alert.targets);
                return (
                  <Card key={alert.id} className="glass hover:border-blue-500/30 transition-all border-l-4 border-l-blue-500">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Bot className="w-5 h-5 text-blue-400" />
                          {alert.tokens?.name || 'Token'}
                          <Badge variant="outline">{alert.tokens?.ticker}</Badge>
                          {alert.tokens?.ticker && (
                            <Badge
                              variant="secondary"
                              className={cn("ml-1 border transition-colors text-xs", getPriceStatusClass(alert.tokens.ticker, alert))}
                            >
                              {getPrice(alert.tokens.ticker)?.price
                                ? `$${getPrice(alert.tokens.ticker)!.price.toFixed(2)}`
                                : '—'}
                            </Badge>
                          )}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(alert.created_at).toLocaleDateString('pt-BR')}
                          </span>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{pt ? 'Remover Alerta IA' : 'Remove AI Alert'}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {pt ? 'Tem certeza que deseja remover este alerta? Esta ação não pode ser desfeita.' : 'Are you sure you want to remove this alert? This action cannot be undone.'}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{pt ? 'Cancelar' : 'Cancel'}</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteAiAlert(alert.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {pt ? 'Remover' : 'Remove'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{pt ? 'Zona de Entrada' : 'Entry Zone'}</p>
                          <p className="font-semibold text-success text-sm">{alert.entry_zone || '-'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{pt ? 'Stop Loss' : 'Stop Loss'}</p>
                          <p className="font-semibold text-destructive text-sm">{alert.stop || '-'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">R:R</p>
                          <p className="font-semibold text-primary text-sm">{alert.risk_reward || '-'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{pt ? 'Alvos' : 'Targets'}</p>
                          <div className="flex flex-wrap gap-1">
                            {targets.length > 0 ? targets.map((target, idx) => (
                              <Badge key={idx} variant="secondary" className="text-[10px]">
                                T{idx + 1}: {target}
                              </Badge>
                            )) : '-'}
                          </div>
                        </div>
                      </div>

                      {(alert.invalidation || alert.volatility_note) && (
                        <div className="border-t border-border/50 pt-3 mt-3 space-y-2">
                          {alert.invalidation && (
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
                              <p className="text-xs text-muted-foreground">{alert.invalidation}</p>
                            </div>
                          )}
                          {alert.volatility_note && (
                            <div className="flex items-start gap-2">
                              <TrendingUp className="w-3 h-3 text-blue-400 mt-0.5 shrink-0" />
                              <p className="text-xs text-muted-foreground">{alert.volatility_note}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ====== TAB: Criar Alerta ====== */}
        <TabsContent value="create" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <CreateAlertForm />
        </TabsContent>

        {/* ====== TAB: Histórico ====== */}
        <TabsContent value="history" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <AlertTimeline history={history} onClear={clearHistory} />
        </TabsContent>
      </Tabs>

      {/* Credit Guard Modals */}
      {guardModals}

      <ExchangeFloatingBar />
    </div>
  );
};

export default AlertsPage;