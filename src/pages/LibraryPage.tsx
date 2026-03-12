import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  BookOpen, Target, Shield, BookMarked, TrendingUp, Coins, BarChart3,
  Clock, Percent, DollarSign, Activity, Layers, HelpCircle, Zap, Bell,
  Bot, Eye, ArrowRight, CheckCircle2, Newspaper, Search, ExternalLink,
  Crosshair, LayoutDashboard, MessageSquare, Circle, Users, Crown,
  Brain, Flame, AlertTriangle, Calculator, ArrowUpDown, Wallet,
  RefreshCw, Loader2, Trophy, ChevronRight, Sparkles, Radio
} from 'lucide-react';
import { fetchCryptoNews, getNewsCategories, CryptoNewsItem } from '@/lib/cryptoNewsService';

const LibraryPage = () => {
  const { t, language } = useLanguage();
  const pt = language === 'pt';

  // ── News State ──
  const [news, setNews] = useState<CryptoNewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsFilter, setNewsFilter] = useState('Todos');
  const [glossarySearch, setGlossarySearch] = useState('');

  const loadNews = useCallback(async () => {
    setNewsLoading(true);
    try {
      const data = await fetchCryptoNews();
      setNews(data);
    } finally {
      setNewsLoading(false);
    }
  }, []);

  useEffect(() => { loadNews(); }, [loadNews]);

  // Auto-refresh every 5 min
  useEffect(() => {
    const interval = setInterval(loadNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadNews]);

  const filteredNews = newsFilter === 'Todos' ? news : news.filter(n => n.category === newsFilter);
  const categories = getNewsCategories();

  // ── Glossary ──
  const glossary = [
    { term: 'ATH (All-Time High)', def: pt ? 'Preço máximo histórico do ativo.' : 'Highest price ever reached by the asset.' },
    { term: 'ATL (All-Time Low)', def: pt ? 'Preço mínimo histórico do ativo.' : 'Lowest price ever reached by the asset.' },
    { term: 'Airdrop', def: pt ? 'Distribuição gratuita de tokens para carteiras elegíveis.' : 'Free distribution of tokens to eligible wallets.' },
    { term: 'Altseason', def: pt ? 'Período onde altcoins superam o desempenho do Bitcoin.' : 'Period where altcoins outperform Bitcoin.' },
    { term: 'Bridge', def: pt ? 'Protocolo que conecta duas blockchains para transferência de ativos.' : 'Protocol connecting two blockchains for asset transfer.' },
    { term: 'Burn', def: pt ? 'Destruição permanente de tokens para reduzir o supply.' : 'Permanent destruction of tokens to reduce supply.' },
    { term: 'CEX', def: pt ? 'Exchange centralizada (ex: Binance, Coinbase).' : 'Centralized exchange (e.g., Binance, Coinbase).' },
    { term: 'DAO', def: pt ? 'Organização Autônoma Descentralizada governada por smart contracts.' : 'Decentralized Autonomous Organization governed by smart contracts.' },
    { term: 'DCA (Dollar Cost Averaging)', def: pt ? 'Estratégia de comprar em intervalos regulares, independente do preço.' : 'Strategy of buying at regular intervals regardless of price.' },
    { term: 'DEX', def: pt ? 'Exchange descentralizada (ex: Uniswap, Raydium).' : 'Decentralized exchange (e.g., Uniswap, Raydium).' },
    { term: 'DYOR', def: pt ? 'Faça sua própria pesquisa. Nunca invista com base apenas em terceiros.' : 'Do Your Own Research. Never invest based solely on others.' },
    { term: 'FDV (Fully Diluted Valuation)', def: pt ? 'Valor de mercado com todos os tokens emitidos. FDV = Preço × Supply máximo.' : 'Market value with all tokens issued. FDV = Price × Max supply.' },
    { term: 'Farm / Yield Farming', def: pt ? 'Fornecer liquidez a protocolos DeFi em troca de recompensas.' : 'Providing liquidity to DeFi protocols in exchange for rewards.' },
    { term: 'Gas', def: pt ? 'Taxa paga para executar transações na blockchain.' : 'Fee paid to execute transactions on the blockchain.' },
    { term: 'Halving', def: pt ? 'Redução pela metade da recompensa de mineração do Bitcoin (~4 anos).' : 'Halving of Bitcoin mining reward (~every 4 years).' },
    { term: 'HODL', def: pt ? 'Segurar o ativo por longo prazo, sem vender em quedas.' : 'Hold the asset long-term without selling during dips.' },
    { term: 'Leverage (Alavancagem)', def: pt ? 'Operar com capital emprestado para amplificar ganhos (e perdas).' : 'Trading with borrowed capital to amplify gains (and losses).' },
    { term: 'Liquidation', def: pt ? 'Fechamento forçado da posição ao atingir margem mínima.' : 'Forced position closure when margin minimum is reached.' },
    { term: 'Market Cap', def: pt ? 'Capitalização de mercado. Market Cap = Preço × Tokens em circulação.' : 'Market capitalization. Market Cap = Price × Circulating supply.' },
    { term: 'Narrativa', def: pt ? 'Tema em destaque no mercado (IA, RWA, Gaming) que atrai capital.' : 'Trending theme (AI, RWA, Gaming) attracting capital.' },
    { term: 'OTC (Over-The-Counter)', def: pt ? 'Negociação direta entre partes, fora de exchanges.' : 'Direct trading between parties, outside exchanges.' },
    { term: 'Rug Pull', def: pt ? 'Golpe onde desenvolvedores abandonam o projeto levando os fundos.' : 'Scam where developers abandon the project taking the funds.' },
    { term: 'Slippage', def: pt ? 'Diferença entre preço esperado e executado. Maior em baixa liquidez.' : 'Difference between expected and executed price.' },
    { term: 'Smart Contract', def: pt ? 'Programa auto-executável na blockchain com regras pré-definidas.' : 'Self-executing program on blockchain with predefined rules.' },
    { term: 'Staking', def: pt ? 'Travar tokens para validar transações e receber recompensas.' : 'Locking tokens to validate transactions and earn rewards.' },
    { term: 'Tokenomics', def: pt ? 'Economia do token: distribuição, inflação, utilidade e queima.' : 'Token economics: distribution, inflation, utility and burn.' },
    { term: 'TVL (Total Value Locked)', def: pt ? 'Valor total depositado em um protocolo DeFi.' : 'Total value deposited in a DeFi protocol.' },
    { term: 'Unlocks', def: pt ? 'Liberação programada de tokens bloqueados. Pode criar pressão de venda.' : 'Scheduled release of locked tokens. Can create selling pressure.' },
    { term: 'Wallet', def: pt ? 'Carteira digital para armazenar e gerenciar criptoativos.' : 'Digital wallet to store and manage crypto assets.' },
    { term: 'Whale', def: pt ? 'Grande detentor de tokens que pode influenciar o preço.' : 'Large token holder who can influence price.' },
  ];

  const filteredGlossary = glossarySearch
    ? glossary.filter(g => g.term.toLowerCase().includes(glossarySearch.toLowerCase()) || g.def.toLowerCase().includes(glossarySearch.toLowerCase()))
    : glossary;

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* ───── Header ───── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            {pt ? 'Biblioteca Pro' : 'Pro Library'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {pt ? 'Seu centro de conhecimento completo para crypto trading' : 'Your complete knowledge hub for crypto trading'}
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white gap-1.5 py-1 px-3 animate-pulse">
          <Radio className="w-3 h-3" /> LIVE
        </Badge>
      </div>

      {/* ───── Tabs ───── */}
      <Tabs defaultValue="news" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto">
          <TabsTrigger value="news" className="gap-1.5 text-xs sm:text-sm py-2.5">
            <Newspaper className="w-4 h-4" />
            <span className="hidden sm:inline">{pt ? 'Notícias' : 'News'}</span>
            <span className="sm:hidden">📰</span>
          </TabsTrigger>
          <TabsTrigger value="howto" className="gap-1.5 text-xs sm:text-sm py-2.5">
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">{pt ? 'Tutoriais' : 'Tutorials'}</span>
            <span className="sm:hidden">🎓</span>
          </TabsTrigger>
          <TabsTrigger value="method" className="gap-1.5 text-xs sm:text-sm py-2.5">
            <Brain className="w-4 h-4" />
            <span className="hidden sm:inline">{pt ? 'Método' : 'Method'}</span>
            <span className="sm:hidden">🧠</span>
          </TabsTrigger>
          <TabsTrigger value="risk" className="gap-1.5 text-xs sm:text-sm py-2.5">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">{pt ? 'Risco' : 'Risk'}</span>
            <span className="sm:hidden">🛡️</span>
          </TabsTrigger>
          <TabsTrigger value="glossary" className="gap-1.5 text-xs sm:text-sm py-2.5">
            <BookMarked className="w-4 h-4" />
            <span className="hidden sm:inline">{pt ? 'Glossário' : 'Glossary'}</span>
            <span className="sm:hidden">📖</span>
          </TabsTrigger>
          <TabsTrigger value="strategies" className="gap-1.5 text-xs sm:text-sm py-2.5">
            <Trophy className="w-4 h-4" />
            <span className="hidden sm:inline">{pt ? 'Estratégias' : 'Strategies'}</span>
            <span className="sm:hidden">🏆</span>
          </TabsTrigger>
        </TabsList>

        {/* ═══════════════════ TAB 1: NOTÍCIAS ═══════════════════ */}
        <TabsContent value="news" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-primary" />
              {pt ? 'Notícias em Tempo Real' : 'Real-Time News'}
            </h2>
            <Button variant="outline" size="sm" onClick={loadNews} disabled={newsLoading} className="gap-1.5">
              <RefreshCw className={`w-4 h-4 ${newsLoading ? 'animate-spin' : ''}`} />
              {pt ? 'Atualizar' : 'Refresh'}
            </Button>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <Badge
                key={cat}
                variant={newsFilter === cat ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => setNewsFilter(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>

          {newsLoading && news.length === 0 ? (
            <div className="text-center py-16">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary mb-3" />
              <p className="text-muted-foreground">{pt ? 'Carregando notícias...' : 'Loading news...'}</p>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>{pt ? 'Nenhuma notícia encontrada' : 'No news found'}</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredNews.slice(0, 20).map((item) => (
                <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer"
                  className="group block">
                  <Card className="h-full glass hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 overflow-hidden">
                    <CardContent className="p-4 flex gap-4">
                      {item.thumb_2x && (
                        <img src={item.thumb_2x} alt="" className="w-20 h-20 rounded-lg object-cover shrink-0 bg-muted" loading="lazy" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{item.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-[10px] py-0">{item.category}</Badge>
                          <span className="text-[10px] text-muted-foreground">{item.source}</span>
                          <span className="text-[10px] text-muted-foreground">• {item.timeAgo}</span>
                          <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ═══════════════════ TAB 2: TUTORIAIS ═══════════════════ */}
        <TabsContent value="howto" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                icon: <LayoutDashboard className="w-7 h-7" />, title: 'Dashboard', color: 'text-blue-400', desc: pt ? 'Visão geral do mercado com dados em tempo real, balanço Bull/Bear e tokens em destaque.' : 'Market overview with real-time data, Bull/Bear balance and featured tokens.',
                steps: pt ? ['Dominância BTC e sentimento geral', 'Top Gainer e Top Loser do dia', 'Alertas ativos com preço ao vivo', 'Quick links para todas as ferramentas'] : ['BTC dominance and market sentiment', 'Top Gainer and Top Loser of the day', 'Active alerts with live prices', 'Quick links to all tools'],
                tips: pt ? ['Use como ponto de partida diário', 'O balanço Bull/Bear mostra o sentimento real'] : ['Use as daily starting point', 'Bull/Bear balance shows real sentiment']
              },
              {
                icon: <Target className="w-7 h-7" />, title: pt ? 'Radar de Gemas' : 'Gem Radar', color: 'text-emerald-400', desc: pt ? 'Caçador de tokens com Score de Assimetria. Filtre por status: Observação, Acumulação, Gatilho, Em Andamento.' : 'Token hunter with Asymmetry Score. Filter by status: Observation, Accumulation, Trigger, In Progress.',
                steps: pt ? ['Observação — Monitorando, sem setup', 'Acumulação — Zona de compra, bom para DCA', 'Gatilho — Pronto para entrada', 'Em Andamento — Operação ativa'] : ['Observation — Monitoring, no setup', 'Accumulation — Buy zone, good for DCA', 'Trigger — Ready for entry', 'In Progress — Active trade'],
                tips: pt ? ['Ative auto-refresh para tempo real', 'Clique no card para análise detalhada', 'Use filtros para encontrar tokens'] : ['Enable auto-refresh for real-time', 'Click card for detailed analysis', 'Use filters to find tokens']
              },
              {
                icon: <Zap className="w-7 h-7" />, title: 'Trade Master', color: 'text-cyan-400', desc: pt ? 'Análise técnica profissional com 50+ indicadores, Market Pulse em tempo real e GURU de IA.' : 'Professional technical analysis with 50+ indicators, real-time Market Pulse and AI GURU.',
                steps: pt ? ['Score 80-100% — ELITE, alta probabilidade', 'Score 60-79% — FORTE, boa oportunidade', 'Score 40-59% — MÉDIO, aguardar', 'Score 0-39% — NÃO ENTRAR'] : ['Score 80-100% — ELITE, high probability', 'Score 60-79% — STRONG, good opportunity', 'Score 40-59% — MEDIUM, wait', 'Score 0-39% — DO NOT ENTER'],
                tips: pt ? ['Consulte o GURU para IA', 'Market Pulse mostra sinais ao vivo', 'Combine com gestão de risco'] : ['Consult GURU for AI', 'Market Pulse shows live signals', 'Combine with risk management']
              },
              {
                icon: <Crosshair className="w-7 h-7" />, title: 'Sniper Pro', color: 'text-red-400', desc: pt ? 'Sinais em tempo real para Day Trade e Swing Trade. Entradas calculadas com análise técnica avançada.' : 'Real-time signals for Day Trade and Swing Trade. Entries calculated with advanced technical analysis.',
                steps: pt ? ['Sinais LONG e SHORT em tempo real', 'Score de confiança por sinal', 'Calculadora de lucro integrada', 'Alvos e stop loss automáticos'] : ['Real-time LONG and SHORT signals', 'Confidence score per signal', 'Built-in profit calculator', 'Automatic targets and stop loss'],
                tips: pt ? ['Opere apenas sinais com score alto', 'Sempre use stop loss', 'Realize parciais nos alvos'] : ['Only trade high-score signals', 'Always use stop loss', 'Take partials at targets']
              },
              {
                icon: <Bell className="w-7 h-7" />, title: pt ? 'Alertas' : 'Alerts', color: 'text-amber-400', desc: pt ? 'Sistema de alertas com notificação sonora e visual. Crie alertas de preço, % de variação e volume.' : 'Alert system with sound and visual notification. Create price, % change and volume alerts.',
                steps: pt ? ['Zona de Entrada — Faixa ideal para compra', 'Stop Loss — Saída se invalidar', 'Alvos T1-T3 — Realizar parciais', 'R:R — Relação risco/retorno'] : ['Entry Zone — Ideal buy range', 'Stop Loss — Exit if invalidated', 'Targets T1-T3 — Take partials', 'R:R — Risk/reward ratio'],
                tips: pt ? ['Nunca entre sem stop loss', 'Busque R:R mínimo de 2:1', 'Alerta sonoro avisa em tempo real'] : ['Never enter without stop loss', 'Aim for minimum 2:1 R:R', 'Sound alert notifies in real-time']
              },
              {
                icon: <MessageSquare className="w-7 h-7" />, title: pt ? 'Oráculo de IA' : 'AI Oracle', color: 'text-purple-400', desc: pt ? 'Chat com IA especialista em crypto. Peça análises completas, planos estratégicos e operações estruturadas.' : 'Chat with crypto specialist AI. Request full analyses, strategic plans and structured operations.',
                steps: pt ? ['Análise técnica de qualquer token', 'Planos de trade estruturados', 'Visão macro do mercado', 'Comparação entre projetos'] : ['Technical analysis of any token', 'Structured trade plans', 'Market macro view', 'Project comparisons'],
                tips: pt ? ['Use como segunda opinião', 'Peça análises com alvos e stop', 'A IA analisa dados em tempo real'] : ['Use as second opinion', 'Ask analyses with targets and stop', 'AI analyzes real-time data']
              },
              {
                icon: <Circle className="w-7 h-7" />, title: 'Bubble Gem', color: 'text-pink-400', desc: pt ? 'Visualização interativa de bolhas. Tamanho = market cap, cor = variação. Arraste, clique e explore.' : 'Interactive bubble visualization. Size = market cap, color = change. Drag, click and explore.',
                steps: pt ? ['Bolhas verdes = subindo', 'Bolhas vermelhas = caindo', 'Tamanho = capitalização', 'Clique = detalhes do token'] : ['Green bubbles = rising', 'Red bubbles = falling', 'Size = market cap', 'Click = token details'],
                tips: pt ? ['Arraste as bolhas para explorar', 'Clique para ver popup com dados', 'Use para visão rápida do mercado'] : ['Drag bubbles to explore', 'Click to see data popup', 'Use for quick market overview']
              },
              {
                icon: <Users className="w-7 h-7" />, title: pt ? 'Comunidade' : 'Community', color: 'text-orange-400', desc: pt ? 'Compartilhe análises, discuta com outros traders e acompanhe insights da comunidade.' : 'Share analyses, discuss with other traders and follow community insights.',
                steps: pt ? ['Crie posts com suas análises', 'Comente e interaja', 'Upload de avatar personalizado', 'Acompanhe os melhores traders'] : ['Create posts with your analyses', 'Comment and interact', 'Custom avatar upload', 'Follow top traders'],
                tips: pt ? ['Compartilhe seus setups', 'Aprenda com a comunidade', 'Seja respeitoso nas discussões'] : ['Share your setups', 'Learn from the community', 'Be respectful in discussions']
              },
            ].map((guide, idx) => (
              <Card key={idx} className="glass overflow-hidden hover:border-primary/30 transition-all duration-300 group">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className={`${guide.color} p-2 rounded-xl bg-current/10 transition-transform group-hover:scale-110`}>{guide.icon}</div>
                    <div>
                      <CardTitle className="text-lg">{guide.title}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">{guide.desc}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="space-y-1.5">
                    {guide.steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <ChevronRight className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{step}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border/50 pt-2 space-y-1">
                    <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">{pt ? 'Dicas Pro' : 'Pro Tips'}</p>
                    {guide.tips.map((tip, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                        {tip}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ═══════════════════ TAB 3: MÉTODO ═══════════════════ */}
        <TabsContent value="method" className="space-y-6">
          <Card className="glass border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Brain className="w-5 h-5" /> {pt ? 'Método Gem Intel — Score de Assimetria' : 'Gem Intel Method — Asymmetry Score'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{pt ? 'Nossa metodologia proprietária identifica oportunidades de investimento em criptoativos com alto potencial de retorno e risco controlado.' : 'Our proprietary methodology identifies crypto investment opportunities with high return potential and controlled risk.'}</p>
              {[
                { icon: <BarChart3 className="w-5 h-5" />, title: pt ? 'Estrutura Técnica' : 'Technical Structure', w: '20%', desc: pt ? 'Análise de preço, suportes, resistências e padrões. Acumulação, breakout ou distribuição.' : 'Price analysis, supports, resistances and patterns.' },
                { icon: <TrendingUp className="w-5 h-5" />, title: pt ? 'Narrativa do Ciclo' : 'Cycle Narrative', w: '25%', desc: pt ? 'Narrativas emergentes (IA, RWA, DeFi, Gaming). Ativos alinhados com narrativas fortes valorizam mais.' : 'Emerging narratives (AI, RWA, DeFi, Gaming). Aligned assets appreciate more.' },
                { icon: <Activity className="w-5 h-5" />, title: pt ? 'Liquidez e Volume' : 'Liquidity & Volume', w: '20%', desc: pt ? 'Volume de negociação e profundidade. Liquidez saudável permite entradas/saídas sem slippage.' : 'Trading volume and depth. Healthy liquidity allows entries/exits without slippage.' },
                { icon: <Coins className="w-5 h-5" />, title: 'Tokenomics & Unlocks', w: '20%', desc: pt ? 'Distribuição de tokens, unlocks e pressão de venda futura.' : 'Token distribution, unlocks and future selling pressure.' },
                { icon: <Layers className="w-5 h-5" />, title: pt ? 'Potencial de Expansão' : 'Expansion Potential', w: '15%', desc: pt ? 'Market cap vs FDV e comparação com projetos similares.' : 'Market cap vs FDV and comparison with similar projects.' },
              ].map((p, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted/80 transition-colors">
                  <div className="text-primary">{p.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1"><h4 className="font-semibold">{p.title}</h4><Badge variant="outline">{p.w}</Badge></div>
                    <p className="text-sm text-muted-foreground">{p.desc}</p>
                  </div>
                </div>
              ))}

              {/* Score Interpretation */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6">
                {[
                  { range: '80-100', label: 'ELITE', color: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' },
                  { range: '60-79', label: pt ? 'FORTE' : 'STRONG', color: 'bg-blue-500/20 border-blue-500/40 text-blue-400' },
                  { range: '40-59', label: pt ? 'MÉDIO' : 'MEDIUM', color: 'bg-amber-500/20 border-amber-500/40 text-amber-400' },
                  { range: '0-39', label: pt ? 'FRACO' : 'WEAK', color: 'bg-red-500/20 border-red-500/40 text-red-400' },
                ].map((s, i) => (
                  <div key={i} className={`p-3 rounded-xl border text-center ${s.color}`}>
                    <p className="text-lg font-bold font-mono">{s.range}</p>
                    <p className="text-xs font-semibold">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm">{pt ? 'Fluxo ideal: Radar (encontrar) → Trade Master (analisar) → Alertas (monitorar) → Oráculo (validar) → Operar!' : 'Ideal flow: Radar (find) → Trade Master (analyze) → Alerts (monitor) → Oracle (validate) → Trade!'}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════════════ TAB 4: GESTÃO DE RISCO ═══════════════════ */}
        <TabsContent value="risk" className="space-y-6">
          {[
            { icon: <Percent className="w-5 h-5" />, title: pt ? 'Regra do 1-2%' : '1-2% Rule', content: pt ? 'Nunca arrisque mais de 1-2% do capital total por operação. Com R$10.000, seu risco máximo é R$100-200 por trade. Isso garante que mesmo uma sequência de perdas não destrua sua conta.' : 'Never risk more than 1-2% of total capital per trade. With $10,000, max risk is $100-200 per trade.' },
            { icon: <Target className="w-5 h-5" />, title: pt ? 'Risco x Retorno (R:R)' : 'Risk x Reward (R:R)', content: pt ? 'Busque sempre R:R mínimo de 1:3. Se arrisca R$100, seu alvo deve ser R$300+. Com R:R de 1:3, você pode acertar apenas 30% dos trades e ainda ser lucrativo.' : 'Always aim for minimum 1:3 R:R. With 1:3 R:R, you can win only 30% of trades and still be profitable.' },
            { icon: <Shield className="w-5 h-5" />, title: 'Stop Loss', content: pt ? 'Defina SEMPRE o stop antes de entrar. O stop deve estar em ponto técnico relevante (suporte, resistência), não em valor arbitrário. Sem stop = sem controle.' : 'ALWAYS set stop before entering. Stop must be at relevant technical point, not arbitrary value.' },
            { icon: <DollarSign className="w-5 h-5" />, title: 'Position Sizing', content: pt ? 'Tamanho da posição = Risco Máximo / (Entrada - Stop). Ex: Risco R$100, Entrada R$50, Stop R$48 → Posição = R$100 / R$2 = 50 tokens.' : 'Position Size = Max Risk / (Entry - Stop). Ex: Risk $100, Entry $50, Stop $48 → Position = $100 / $2 = 50 tokens.' },
            { icon: <Clock className="w-5 h-5" />, title: pt ? 'Parciais Inteligentes' : 'Smart Partials', content: pt ? 'T1: Realize 30% do lucro. T2: Realize mais 40%. T3: Deixe 30% correr com trailing stop. Assim você garante lucro mesmo que o preço recue.' : 'T1: Take 30% profit. T2: Take 40% more. T3: Let 30% ride with trailing stop.' },
            { icon: <AlertTriangle className="w-5 h-5" />, title: pt ? 'Viés Psicológico' : 'Psychological Bias', content: pt ? 'FOMO (medo de perder), revenge trading (operar por raiva após perda), e overtrading são os maiores inimigos. Tenha disciplina e siga seu plano.' : 'FOMO, revenge trading, and overtrading are the biggest enemies. Have discipline and follow your plan.' },
            { icon: <ArrowUpDown className="w-5 h-5" />, title: pt ? 'Alavancagem' : 'Leverage', content: pt ? 'Iniciantes: máximo 2-3x. Intermediários: até 5x. Avançados: até 10x com gestão rígida. NUNCA use 20-100x sem experiência — a liquidação é quase certa.' : 'Beginners: max 2-3x. Intermediate: up to 5x. Advanced: up to 10x with strict management. NEVER use 20-100x.' },
            { icon: <Wallet className="w-5 h-5" />, title: pt ? 'Diversificação' : 'Diversification', content: pt ? 'Não coloque mais de 20% do portfólio em um único ativo. Distribua entre BTC (40%), ETH (20%), Altcoins large cap (20%) e micro caps (20%).' : 'Don\'t put more than 20% in a single asset. Distribute between BTC (40%), ETH (20%), Large caps (20%), Micro caps (20%).' },
          ].map((section, idx) => (
            <Card key={idx} className="glass hover:border-primary/20 transition-all">
              <CardContent className="p-5 flex gap-4">
                <div className="text-primary bg-primary/10 p-2.5 rounded-xl h-fit">{section.icon}</div>
                <div>
                  <h4 className="font-bold mb-1">{section.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* ═══════════════════ TAB 5: GLOSSÁRIO ═══════════════════ */}
        <TabsContent value="glossary" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={pt ? 'Buscar termo...' : 'Search term...'}
              value={glossarySearch}
              onChange={e => setGlossarySearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="grid gap-2">
            {filteredGlossary.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-muted/50 hover:bg-muted/80 transition-colors">
                <h4 className="font-semibold text-primary text-sm">{item.term}</h4>
                <p className="text-sm text-muted-foreground mt-0.5">{item.def}</p>
              </div>
            ))}
            {filteredGlossary.length === 0 && (
              <p className="text-center text-muted-foreground py-8">{pt ? 'Nenhum termo encontrado' : 'No terms found'}</p>
            )}
          </div>
        </TabsContent>

        {/* ═══════════════════ TAB 6: ESTRATÉGIAS ═══════════════════ */}
        <TabsContent value="strategies" className="space-y-6">
          {[
            {
              icon: <Flame className="w-6 h-6" />, title: 'Scalping', color: 'border-l-red-500', time: pt ? '1-15 min' : '1-15 min',
              desc: pt ? 'Operações ultra-rápidas buscando pequenos movimentos. Requer alta concentração e execução veloz.' : 'Ultra-fast trades seeking small movements. Requires high focus and fast execution.',
              when: pt ? 'Mercado com alta volatilidade e volume. Ideal para quem tem tempo integral.' : 'High volatility and volume market. Ideal for full-time traders.',
              indicators: 'VWAP, Orderbook, Tape Reading, 1min candles',
              risk: pt ? 'Alto — muitas operações, custos de taxa acumulam' : 'High — many trades, fee costs accumulate'
            },
            {
              icon: <Zap className="w-6 h-6" />, title: 'Day Trade', color: 'border-l-amber-500', time: pt ? '15min - 1 dia' : '15min - 1 day',
              desc: pt ? 'Abre e fecha posição no mesmo dia. Não carregar posição para o dia seguinte.' : 'Open and close position same day. Never carry positions overnight.',
              when: pt ? 'Dias de notícias importantes, rompimentos de suporte/resistência.' : 'Important news days, support/resistance breakouts.',
              indicators: 'RSI, MACD, Bollinger, EMA 9/21, Volume',
              risk: pt ? 'Médio-Alto — requer disciplina e stop loss rigoroso' : 'Medium-High — requires discipline and strict stop loss'
            },
            {
              icon: <TrendingUp className="w-6 h-6" />, title: 'Swing Trade', color: 'border-l-cyan-500', time: pt ? '2-14 dias' : '2-14 days',
              desc: pt ? 'Capturar movimentos de tendência em dias a semanas. A estratégia mais equilibrada entre risco e retorno.' : 'Capture trend movements over days to weeks. Most balanced strategy.',
              when: pt ? 'Tendências claras no 4H/Diário, após pullbacks em suportes fortes.' : 'Clear 4H/Daily trends, after pullbacks to strong supports.',
              indicators: 'EMA 21/50/200, Ichimoku, SuperTrend, ADX, Fibonacci',
              risk: pt ? 'Médio — bom para quem tem emprego e não pode acompanhar 24h' : 'Medium — good for employed traders who can\'t monitor 24h'
            },
            {
              icon: <Crown className="w-6 h-6" />, title: 'Position Trade', color: 'border-l-purple-500', time: pt ? '2 semanas - 6 meses' : '2 weeks - 6 months',
              desc: pt ? 'Investimento de médio prazo baseado em fundamentos e ciclo de mercado.' : 'Medium-term investment based on fundamentals and market cycle.',
              when: pt ? 'Início de tendências macro, após capitulação do mercado.' : 'Start of macro trends, after market capitulation.',
              indicators: 'Semanal/Mensal, Market Cap, TVL, Tokenomics, Narrativas',
              risk: pt ? 'Baixo-Médio — requer paciência e convicção' : 'Low-Medium — requires patience and conviction'
            },
            {
              icon: <ArrowUpDown className="w-6 h-6" />, title: 'DCA (Dollar Cost Averaging)', color: 'border-l-emerald-500', time: pt ? 'Contínuo' : 'Ongoing',
              desc: pt ? 'Comprar valores fixos em intervalos regulares (semanal/mensal). Suaviza a volatilidade e elimina o viés emocional.' : 'Buy fixed amounts at regular intervals. Smooths volatility and eliminates emotional bias.',
              when: pt ? 'Sempre — funciona em qualquer fase do mercado. Ideal para holding de longo prazo.' : 'Always — works in any market phase. Ideal for long-term holding.',
              indicators: pt ? 'Não precisa de indicadores técnicos. Foco em fundamentos.' : 'No technical indicators needed. Focus on fundamentals.',
              risk: pt ? 'Baixo — a estratégia mais segura para iniciantes' : 'Low — the safest strategy for beginners'
            },
          ].map((s, idx) => (
            <Card key={idx} className={`glass border-l-4 ${s.color} hover:shadow-lg transition-all`}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-primary">{s.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{s.title}</h3>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                  <Badge variant="outline" className="shrink-0">{s.time}</Badge>
                </div>
                <div className="grid sm:grid-cols-3 gap-3 mt-3">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">{pt ? 'Quando Usar' : 'When to Use'}</p>
                    <p className="text-xs">{s.when}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">{pt ? 'Indicadores' : 'Indicators'}</p>
                    <p className="text-xs">{s.indicators}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">{pt ? 'Nível de Risco' : 'Risk Level'}</p>
                    <p className="text-xs">{s.risk}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default LibraryPage;
