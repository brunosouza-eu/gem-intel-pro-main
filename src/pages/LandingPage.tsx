
/**
 * 🚀 Gem Intel Pro — Landing Page
 * Página de vendas completa e extremamente persuasiva.
 * Estrutura: Hero → Problema → Ferramentas (showcase detalhado) → Como Funciona → Números → Planos → FAQ → Garantia → CTA
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { ExchangeBanner } from '@/components/ExchangeReferral';
import DynamicBackground from '@/components/landing/DynamicBackground';
import InstallPWAButton from '@/components/pwa/InstallPWAButton';
import CryptoTicker from '@/components/landing/CryptoTicker';
import { Cross } from 'lucide-react'; // Adding Cross icon if available or using Sparkles/Star
import FloatingTools from '@/components/landing/FloatingTools';
import GlowingCard from '@/components/landing/GlowingCard';
import {
    Sparkles, ArrowRight, Shield, Bot, BarChart3, Zap, Target, Flame,
    MessageSquare, Bell, TrendingUp, ChevronDown, ChevronUp, Check, X,
    Crown, Rocket, Star, Eye, Activity, Wifi, Brain, Lock, Users,
    Clock, ChevronRight, Play, ShieldCheck, Gem, ArrowUpRight,
    Radar, Crosshair, CircleDot, LineChart, Layers, AlertTriangle,
    Search, CandlestickChart, ScanLine, Gauge, Radio, RefreshCw,
    Timer, Siren, Volume2, LayoutGrid, MonitorSmartphone, Coins
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════

const AnimatedNumber: React.FC<{ end: number; duration?: number; suffix?: string; prefix?: string }> = ({
    end, duration = 2000, suffix = '', prefix = ''
}) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !hasAnimated.current) {
                hasAnimated.current = true;
                const startTime = Date.now();
                const animate = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    setCount(Math.floor(eased * end));
                    if (progress < 1) requestAnimationFrame(animate);
                };
                animate();
            }
        }, { threshold: 0.3 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end, duration]);

    return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

const FaqItem: React.FC<{ q: string; a: string; open: boolean; onClick: () => void }> = ({ q, a, open, onClick }) => (
    <div className={cn(
        'rounded-2xl border transition-all duration-300 overflow-hidden',
        open ? 'border-emerald-500/30 bg-emerald-500/5 shadow-lg shadow-emerald-500/5' : 'border-white/5 bg-white/[0.02] hover:border-white/10'
    )}>
        <button className="w-full flex items-center justify-between p-5 sm:p-6 text-left" onClick={onClick}>
            <span className="font-semibold text-base sm:text-lg pr-4">{q}</span>
            {open ? <ChevronUp className="w-5 h-5 text-emerald-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-white/30 shrink-0" />}
        </button>
        <div className={cn('px-5 sm:px-6 transition-all duration-300 overflow-hidden', open ? 'pb-5 sm:pb-6 max-h-[500px] opacity-100' : 'max-h-0 opacity-0')}>
            <p className="text-white/60 leading-relaxed text-sm sm:text-base">{a}</p>
        </div>
    </div>
);

// ─── Tool Showcase Section ──────────────────────────────────────
const ToolShowcase: React.FC<{
    title: string;
    subtitle: string;
    desc: string;
    highlights: string[];
    icon: React.ElementType;
    color: string;
    bgGradient: string;
    borderColor: string;
    imgSrc: string;
    reverse?: boolean;
    badge?: string;
    badgeColor?: string;
}> = ({ title, subtitle, desc, highlights, icon: Icon, color, bgGradient, borderColor, imgSrc, reverse, badge, badgeColor }) => (
    <div className={cn(
        'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center py-16 sm:py-20',
        reverse && 'lg:[direction:rtl]'
    )}>
        {/* Text Side */}
        <div className={cn('space-y-6', reverse && 'lg:[direction:ltr]')}>
            <div className="flex items-center gap-3 flex-wrap">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', bgGradient)}>
                    <Icon className={cn('w-6 h-6', color)} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black">{title}</h3>
                {badge && (
                    <span className={cn('text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide', badgeColor)}>
                        {badge}
                    </span>
                )}
            </div>
            <p className={cn('text-sm font-medium tracking-wide uppercase', color)}>{subtitle}</p>
            <p className="text-white/60 text-base sm:text-lg leading-relaxed">{desc}</p>
            <ul className="space-y-3">
                {highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <div className={cn('p-1 rounded-full mt-0.5 shrink-0', bgGradient)}>
                            <Check className={cn('w-3 h-3', color)} strokeWidth={3} />
                        </div>
                        <span className="text-white/70 text-sm">{h}</span>
                    </li>
                ))}
            </ul>
        </div>

        {/* Image Side */}
        <div className={cn('relative group', reverse && 'lg:[direction:ltr]')}>
            <div className={cn('absolute -inset-4 rounded-3xl opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-40', bgGradient)} />
            <div className={cn('relative rounded-2xl border overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]', borderColor)}>
                <img
                    src={imgSrc}
                    alt={title}
                    className="w-full h-auto object-cover object-top"
                    loading="lazy"
                />
                {/* Overlay gradient for polish */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
        </div>
    </div>
);

// ═══════════════════════════════════════════════════════════════════
// MAIN LANDING PAGE
// ═══════════════════════════════════════════════════════════════════
const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [isAnnual, setIsAnnual] = useState(false);
    const [pricingTab, setPricingTab] = useState<'plans' | 'credits'>('plans');

    useEffect(() => {
        if (user) navigate('/dashboard', { replace: true });
    }, [user, navigate]);

    const goToAuth = () => navigate('/auth');

    // ─── TOOL DATA ──────────────────────────────────────────────────
    const tools = [
        {
            title: 'Radar',
            subtitle: 'Escaneamento inteligente de mercado',
            desc: 'O Radar monitora mais de 240 criptomoedas em tempo real e atribui um Score de confiança de 0 a 100 para cada uma. Ele organiza as moedas em fases do ciclo de mercado — Observação, Acumulação, Gatilho e Ativo — para que você saiba exatamente em que momento cada moeda está.',
            highlights: [
                '240+ tokens analisados com score de confiança em tempo real',
                'Classificação automática: Observação → Acumulação → Gatilho → Ativo',
                'Filtros por variação 24h, score, nome e fase',
                'Resumo visual do mercado: quantas em alta, em baixa, volume total',
                'Atualização automática — você nunca perde uma oportunidade',
            ],
            icon: Radar, color: 'text-cyan-400', bgGradient: 'bg-cyan-500/10', borderColor: 'border-cyan-500/20',
            imgSrc: '/screenshots/radar.jpeg',
            badge: 'Grátis', badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        },
        {
            title: 'Trade Master',
            subtitle: 'Gráficos profissionais com indicadores técnicos',
            desc: 'O Trade Master é o seu centro de análise técnica completo. Gráficos TradingView integrados com EMA 21, EMA 50 e EMA 200 ativados com um clique. Veja as tendências de 288 tokens com sinais de compra e venda gerados automaticamente, tudo em tempo real.',
            highlights: [
                'Gráficos TradingView integrados — profissionais e interativos',
                'EMAs 21, 50 e 200 com toggle rápido',
                'Timeframes de 1 minuto a 1 dia com um clique',
                '31 sinais de compra e 47 de venda identificados automaticamente',
                'Pulse: indicador visual de oportunidades em tempo real',
            ],
            icon: CandlestickChart, color: 'text-amber-400', bgGradient: 'bg-amber-500/10', borderColor: 'border-amber-500/20',
            imgSrc: '/screenshots/trademaster.jpeg',
            badge: 'Pro', badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
            reverse: true,
        },
        {
            title: 'Sniper Pro',
            subtitle: 'Sinais de entrada com precisão cirúrgica',
            desc: 'O Sniper Pro gera sinais de entrada e saída baseados em análise técnica avançada. Cada sinal vem com preço de entrada, stop loss, 3 alvos de take profit, e o número exato de confluências técnicas que sustentam a operação. Sem achismo — tudo calculado.',
            highlights: [
                '139 sinais ativos com direção LONG ou SHORT',
                'Classificação A+, A, B+ por força do sinal',
                'Entrada, Stop Loss e 3 Take Profits calculados automaticamente',
                'Até 10+ confluências técnicas por sinal (MACD, RSI, EMA, Volume...)',
                '3 modos: Sniper (entradas longas), Day Trade e Swing',
                'Filtro "Na Zona" — mostra apenas sinais com entrada no preço atual',
            ],
            icon: Crosshair, color: 'text-rose-400', bgGradient: 'bg-rose-500/10', borderColor: 'border-rose-500/20',
            imgSrc: '/screenshots/sniper.jpeg',
            badge: 'Elite', badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
        },
        {
            title: 'Central de Alertas',
            subtitle: 'Nunca mais perca uma oportunidade',
            desc: 'Configure alertas personalizados para qualquer criptomoeda. Alerta de alta, queda, preço-alvo ou variação percentual — você escolhe. Quando o mercado mover, o sistema te avisa instantaneamente. Também conta com Alertas IA gerados automaticamente.',
            highlights: [
                'Alertas de preço-alvo, variação percentual, alta e queda',
                'Alertas IA — o sistema cria alertas automaticamente baseado nos sinais',
                'Monitoramento 24/7 — mesmo quando você não está olhando',
                'Histórico completo de alertas disparados',
                'Presets prontos: Dump Alert, Pump Alert, e mais',
            ],
            icon: Bell, color: 'text-orange-400', bgGradient: 'bg-orange-500/10', borderColor: 'border-orange-500/20',
            imgSrc: '/screenshots/alertas.jpeg',
            badge: 'Grátis', badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
            reverse: true,
        },
        {
            title: 'Oráculo do Mercado',
            subtitle: 'Seu consultor de investimentos com IA',
            desc: 'Converse com uma inteligência artificial especializada em criptomoedas. Peça análises técnicas completas, planos de operação com entrada e stop, cenários macro do mercado, ou tire qualquer dúvida. É como ter um analista sênior disponível 24 horas.',
            highlights: [
                'Análise técnica e fundamental de elite com dados em tempo real',
                'Peça planos de operação completos com entrada, stop e 3 alvos',
                '"Qual o cenário macro atual do BTC?" — e ela te responde com dados',
                'Perguntas sugeridas para você começar rapidamente',
                '50+ anos de expertise em análise de mercado condensados em IA',
            ],
            icon: Brain, color: 'text-purple-400', bgGradient: 'bg-purple-500/10', borderColor: 'border-purple-500/20',
            imgSrc: '/screenshots/chat.jpeg',
            badge: 'Pro', badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        },
        {
            title: 'Bubble Gem',
            subtitle: 'O mercado inteiro em uma tela',
            desc: 'Visualize o sentimento e o fluxo financeiro do ecossistema cripto inteiro através de bolhas interativas. Encontre anomalias, volume atípico e oportunidades antes de todos só de bater o olho na tela.',
            highlights: [
                'Visualização intuitiva em áreas de bolhas dinâmicas',
                'Diferenciação clara e visual entre alta verde e baixa vermelha',
                'Tamanho das bolhas indica relevância e volume do momento',
                'Identifica com clareza os outliers e narrativas do mercado',
            ],
            icon: CircleDot, color: 'text-indigo-400', bgGradient: 'bg-indigo-500/10', borderColor: 'border-indigo-500/20',
            imgSrc: '/screenshots/bubble.jpeg',
            badge: 'Grátis', badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
            reverse: true,
        },
        {
            title: 'Comunidade VIP',
            subtitle: 'Traders de sucesso operando juntos',
            desc: 'A jornada cripto não precisa ser solitária. Acesse nossa área exclusiva para assinantes para fazer networking, colar com quem tem resultado, tirar dúvidas ao vivo e discutir as melhores teses de investimento.',
            highlights: [
                'Espaço exclusivo para assinantes Elite interagirem',
                'Suporte direto da equipe Gem Intel e analistas focados',
                'Networking diário com traders experientes que vivem do mercado',
                'Insights de mercado e call de operações exclusivas da comunidade'
            ],
            icon: Users, color: 'text-blue-400', bgGradient: 'bg-blue-500/10', borderColor: 'border-blue-500/20',
            imgSrc: '/screenshots/comunidade.jpeg',
            badge: 'Elite', badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
        },
        {
            title: 'Biblioteca Alpha',
            subtitle: 'O seu arsenal de conhecimento prático',
            desc: 'Um acervo organizado com estratégias validadas, tutoriais de uso avançado da plataforma, e guias essenciais sobre gerenciamento de risco e capital. O material definitivo para quem trata trading como negócio.',
            highlights: [
                'Tutoriais em vídeo passo-a-passo de cada ferramenta do sistema',
                'Aulas e guias sobre gerenciamento de risco inquebrável',
                'Bibliotecas de price action e análise técnica moderna',
                'Material de apoio constante para maximizar seu uso da IA'
            ],
            icon: Layers, color: 'text-pink-400', bgGradient: 'bg-pink-500/10', borderColor: 'border-pink-500/20',
            imgSrc: '/screenshots/biblioteca.jpeg',
            badge: 'Pro', badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
            reverse: true,
        },
    ];

    const stats = [
        { label: 'Tokens Monitorados', value: 240, suffix: '+', icon: Eye },
        { label: 'Análises por Dia', value: 2400, suffix: '+', icon: BarChart3 },
        { label: 'Confluências Técnicas', value: 15, suffix: '+', icon: Target },
        { label: 'Atualização de Preço', value: 1, suffix: 's', icon: Wifi },
    ];

    const plans = [
        {
            id: 'free', name: 'Grátis',
            price: 'R$ 0', period: '/mês',
            desc: 'Explore as ferramentas e sinta o poder da plataforma',
            icon: Zap, color: 'text-slate-400', gradient: 'from-slate-500/10 to-slate-600/5',
            features: [
                { text: 'Radar completo (240+ tokens)', included: true },
                { text: 'Bubble Gem interativo', included: true },
                { text: 'Comunidade & Biblioteca Alpha', included: true },
                { text: 'Alertas básicos (manuais)', included: true },
                { text: '5 créditos/dia (~2 consultas IA)', included: true },
                { text: 'Trade Master completo', included: false },
                { text: 'Sniper Pro — sinais de entrada', included: false },
                { text: 'Curso Trade Master (R$9,90 avulso)', included: false },
            ],
            cta: 'Comece Grátis', ctaStyle: 'bg-white/10 hover:bg-white/15 text-white border border-white/10',
            action: goToAuth
        },
        {
            id: 'pro', name: 'Pro',
            price: isAnnual ? 'R$ 397' : 'R$ 47',
            period: isAnnual ? '/ano' : '/mês',
            monthlyEquiv: isAnnual ? '≈ R$ 33/mês' : null,
            savings: isAnnual ? 'Economia de R$ 167' : null,
            desc: 'Para traders que querem operar com vantagem real',
            icon: Rocket, color: 'text-emerald-400', gradient: 'from-emerald-500/10 to-cyan-500/5',
            popular: true,
            features: [
                { text: 'Tudo do plano Grátis', included: true },
                { text: '20 créditos/dia (~10 consultas IA)', included: true },
                { text: 'Trade Master completo', included: true },
                { text: 'Sniper Pro — sinais de entrada', included: true },
                { text: 'Alertas IA automáticos', included: true },
                { text: 'Análise Guru Premium', included: true },
                { text: 'Curso Trade Master incluso', included: true },
                { text: 'Gem Hunter & AutoPilot (em breve · Beta)', included: true },
            ],
            cta: 'Assinar Pro', ctaStyle: 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:shadow-lg hover:shadow-emerald-500/25 text-black font-bold',
            action: () => window.open(isAnnual ? 'https://pay.hotmart.com/I104826499B?off=mcw7ajf5&checkoutMode=6' : 'https://pay.hotmart.com/I104826499B?off=66pn89ja&checkoutMode=6', '_blank')
        },
        {
            id: 'elite', name: 'Elite',
            price: isAnnual ? 'R$ 797' : 'R$ 97',
            period: isAnnual ? '/ano' : '/mês',
            monthlyEquiv: isAnnual ? '≈ R$ 66/mês' : null,
            savings: isAnnual ? 'Economia de R$ 367' : null,
            desc: 'Acesso total, sem limites, sem fricção',
            icon: Crown, color: 'text-amber-400', gradient: 'from-amber-500/10 to-yellow-500/5',
            features: [
                { text: 'Tudo do plano Pro', included: true },
                { text: 'Créditos ilimitados — use à vontade', included: true },
                { text: 'Chat IA ilimitado', included: true },
                { text: 'Alertas Avançados ilimitados', included: true },
                { text: 'Suporte VIP 24/7 prioritário', included: true },
                { text: 'Gem Hunter & AutoPilot (em breve · Beta)', included: true },
                { text: 'Curso Trade Master incluso', included: true },
                { text: 'Acesso antecipado a novos recursos', included: true },
            ],
            cta: 'Assinar Elite', ctaStyle: 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:shadow-lg hover:shadow-amber-500/25 text-black font-bold',
            action: () => window.open(isAnnual ? 'https://pay.hotmart.com/I104826499B?off=qg9w13pa&checkoutMode=6' : 'https://pay.hotmart.com/I104826499B?off=8rkh4vnv&checkoutMode=6', '_blank')
        },
    ];

    const creditPacks = [
        { name: 'Recarga Rápida', credits: 30, price: 9.90, desc: '+ Bônus: Curso Trade Master', url: 'https://pay.hotmart.com/A104828828D?off=f7eld6ze' },
        { name: 'Recarga Turbo', credits: 100, price: 24.90, popular: true, desc: '+ Bônus: Curso Trade Master', url: 'https://pay.hotmart.com/A104828828D?off=g0shftr1' },
    ];

    const creditCosts = [
        { label: 'Consulta ao Chat IA (Oráculo)', cost: 2 },
        { label: 'Análise Técnica Detalhada', cost: 1 },
        { label: 'Análise Guru Premium', cost: 3 },
        { label: 'Criar Alerta IA Avançado', cost: 2 },
        { label: 'Análise Trade Master', cost: 1 },
    ];

    const faqs = [
        { q: 'Preciso saber sobre trading para usar?', a: 'Não! O Gem Intel foi feito para ser simples. O Radar mostra as oportunidades, o Sniper diz quando entrar, e o AutoPilot opera automaticamente. Você só precisa acompanhar. Até quem nunca operou cripto consegue usar.' },
        { q: 'O bot opera com dinheiro real?', a: 'Não. O AutoPilot usa Paper Trading — simula operações com preços reais da Binance, mas sem usar seu dinheiro. É perfeito para aprender e testar estratégias sem nenhum risco financeiro.' },
        { q: 'Posso cancelar a qualquer momento?', a: 'Sim! Sem contrato, sem multa, sem burocracia. Cancele quando quiser e continue usando até o fim do período pago. Zero complicação.' },
        { q: 'Os sinais são de verdade?', a: 'Sim! Todos os sinais são gerados em tempo real por análise técnica avançada (MACD, RSI, EMA, Bollinger, Volume, suporte/resistência) com dados ao vivo da Binance. Nada de sinais falsos ou atrasados.' },
        { q: 'Funciona no celular?', a: 'Sim! A plataforma é 100% responsiva e funciona em qualquer navegador — no computador, tablet ou celular. Sem necessidade de instalar nada.' },
        { q: 'É seguro? Meus dados estão protegidos?', a: 'Totalmente. Usamos autenticação segura com criptografia, e nunca pedimos acesso à sua conta de exchange. Seu dinheiro fica sempre e exclusivamente com você.' },
    ];

    // ═════════════════════════════════════════════════════════════════
    // RENDER
    // ═════════════════════════════════════════════════════════════════
    return (
        <div className="min-h-screen bg-[hsl(222,47%,6%)] text-white overflow-hidden">

            {/* ═══ HERO ════════════════════════════════════════════════ */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-10 pb-20">
                {/* NOVO FUNDO DINÂMICO INTERATIVO */}
                <DynamicBackground />
                
                {/* Gradientes globais extras sutis para integrar o fundo */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
                    <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-black/60 to-transparent" />
                    <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[hsl(222,47%,6%)] to-transparent" />
                </div>

                {/* Nav */}
                <nav className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-8 lg:px-16 py-5 z-20">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Gem className="w-5 h-5 text-black" />
                        </div>
                        <span className="text-xl font-extrabold tracking-tight">Gem Intel</span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">PRO</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Hide PWA button on mobile header to save space */}
                        <InstallPWAButton className="hidden sm:flex" />
                        <button onClick={goToAuth} className="text-sm text-white/60 hover:text-white transition-colors px-2 sm:px-4 py-2">Entrar</button>
                        <button onClick={goToAuth} className="text-sm font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 text-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95">
                            Comece Grátis
                        </button>
                    </div>
                </nav>

                <div className="relative z-10 max-w-5xl mx-auto text-center mt-16 sm:mt-20">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm mb-12 backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                        <span className="text-white/80"><span className="text-emerald-400 font-bold">240+ tokens</span> monitorados em tempo real</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight mb-8 drop-shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150 fill-mode-both">
                        <span className="block text-white">Domine o Mercado,</span>
                        <span className="block bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent pb-2">Sem Esforço.</span>
                    </h1>

                    <p className="text-xl sm:text-2xl text-white/50 max-w-3xl mx-auto leading-relaxed mb-12 drop-shadow-md animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300 fill-mode-both">
                        Sua inteligência artificial cripto pessoal. Radar de oportunidades, robô automático, sinais de alta precisão e <strong className="text-white">11 ferramentas premium</strong>.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-14 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-500 fill-mode-both">
                        <button onClick={goToAuth} className="group relative w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-black text-lg sm:text-xl px-10 py-5 rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(52,211,153,0.5)]">
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                            <span className="relative z-10 flex items-center gap-2">
                                Comece Grátis Agora
                                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                            </span>
                        </button>
                        {/* Removido o botão Conheça as Ferramentas e adicionado o InstallPWAButton com estilo grande integrado */}
                        <InstallPWAButton className="group w-full sm:w-auto flex items-center justify-center gap-3 text-white/70 hover:text-white font-semibold text-lg sm:text-xl px-10 py-5 rounded-2xl border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all shadow-xl [&>svg]:w-6 [&>svg]:h-6 [&>svg]:text-emerald-400 [&>svg]:group-hover:scale-110 [&>svg]:transition-transform" />
                    </div>
                    
                    {/* ONDA DE FERRAMENTAS FLUTUANTES (ANIMAÇÃO CSS) */}
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700 fill-mode-both">
                        <FloatingTools />
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/30 mt-8">
                        <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Sem cartão de crédito</span>
                        <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Dados 100% seguros</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Setup em 30 segundos</span>
                    </div>

                    {/* Exchange referral */}
                    <ExchangeBanner className="max-w-lg mx-auto mt-10" />
                </div>

                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce z-20">
                    <ChevronDown className="w-6 h-6 text-white/40" />
                </div>
            </section>
            
            {/* TICKER DE CRIPTO INIFINITO */}
            <div className="relative z-20 -mt-px">
                 <CryptoTicker />
            </div>

            {/* ═══ PROBLEMA ════════════════════════════════════════════ */}
            <section className="py-20 sm:py-28 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-8">
                        ⚠️ O problema que todo trader enfrenta
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight">
                        Enquanto você analisa <span className="text-red-400">1 moeda</span>,
                        <br />o mercado move <span className="text-emerald-400">100</span>.
                    </h2>
                    <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed mb-12">
                        Horas olhando gráficos, lendo notícias, tentando adivinhar o momento certo...
                        enquanto as melhores oportunidades passam direto.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                        {[
                            { emoji: '😰', title: 'Medo de errar', desc: 'Analisar sozinho sem confiança se a entrada está certa' },
                            { emoji: '⏰', title: 'Falta de tempo', desc: 'Impossível acompanhar o mercado 24 horas por dia' },
                            { emoji: '📉', title: 'Perdeu a entrada', desc: 'Quando você vê o sinal, a moeda já subiu 20%' },
                        ].map((pain, i) => (
                            <div key={i} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                                <div className="text-4xl mb-3">{pain.emoji}</div>
                                <h4 className="font-bold mb-1">{pain.title}</h4>
                                <p className="text-sm text-white/40">{pain.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ FERRAMENTAS — SHOWCASE DETALHADO ════════════════════ */}
            <section id="tools" className="px-4 sm:px-6 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent pointer-events-none" />
                <div className="max-w-6xl mx-auto relative">
                    <div className="text-center pt-20 sm:pt-28 pb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
                            <Sparkles className="w-4 h-4" /> Conheça cada ferramenta
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
                            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">11 ferramentas profissionais</span>
                            <br />em uma plataforma
                        </h2>
                        <p className="text-lg text-white/50 max-w-2xl mx-auto">
                            Cada ferramenta foi desenhada para resolver um problema real do trader.
                            Veja em detalhe o que cada uma faz por você.
                        </p>
                    </div>

                    {/* Per-tool showcases with alternating layout */}
                    <div className="divide-y divide-white/5">
                        {tools.map((tool, i) => (
                            <ToolShowcase key={i} {...tool} />
                        ))}
                    </div>

                    {/* Gem Hunter — Special BETA Showcase */}
                    <div className="py-16 sm:py-20 max-w-5xl mx-auto">
                        <GlowingCard glowColor="amber">
                            <div className="p-8 sm:p-12 relative">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

                                {/* BETA Banner */}
                                <div className="relative flex items-center justify-center mb-8">
                                    <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-sm font-bold animate-pulse">
                                        🔒 BETA · Acesso Antecipado — Em breve disponível para todos os assinantes
                                    </div>
                                </div>

                                <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <div className="w-14 h-14 rounded-xl bg-amber-500/15 flex items-center justify-center">
                                                <Flame className="w-7 h-7 text-amber-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl sm:text-3xl font-black">💎 Gem Hunter</h3>
                                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                                                        🚧 EM BREVE · BETA
                                                    </span>
                                                    <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                                                        ⚠️ FASE DE TESTES
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-amber-400 text-sm font-medium tracking-wide uppercase">Em fase de testes — será liberado em breve para assinantes</p>
                                        <p className="text-white/60 text-base sm:text-lg leading-relaxed">
                                            O Gem Hunter é o radar definitivo para quem quer entrar <strong className="text-white/80">antes de todo mundo</strong>.
                                            Monitora tokens recém-lançados na Solana, Base e Ethereum com Score de Potencial,
                                            análise de risco e links diretos para os melhores Snipe Bots do mercado.
                                            <strong className="text-amber-400"> Compre gemas antes de listarem na Binance.</strong>
                                        </p>
                                        <ul className="space-y-3">
                                            {[
                                                'Score de Potencial 0-100: saiba quais gemas têm mais chances de explodir',
                                                'Status em tempo real: Trending 📈, Hot 🔥, New Launch 🚀, Hidden Gem 💎',
                                                'Análise de Risco por token (Médio → Extremo) com alertas visuais',
                                                'Links diretos para Trojan Bot, Banana Gun e Maestro para snipe instantâneo',
                                                'Filtros por rede: Solana, Base e Ethereum com barra de busca',
                                                'Ordenação por Score, Volume 24h, Variação e Market Cap',
                                            ].map((h, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <div className="p-1 rounded-full bg-amber-500/15 mt-0.5 shrink-0">
                                                        <Check className="w-3 h-3 text-amber-400" strokeWidth={3} />
                                                    </div>
                                                    <span className="text-white/70 text-sm">{h}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        {/* Beta warning box */}
                                        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex items-start gap-3 mt-6">
                                            <span className="text-xl">⚠️</span>
                                            <div>
                                                <p className="text-red-400 text-xs font-bold uppercase tracking-wide mb-1">Aviso Importante — Ferramenta em Beta</p>
                                                <p className="text-white/50 text-xs leading-relaxed">
                                                    O Gem Hunter e o AutoPilot Bot estão atualmente em <strong className="text-white/70">fase de testes (Beta)</strong> e serão liberados em breve para todos os assinantes após aprovação interna. Assinantes terão acesso prioritário no lançamento.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative group perspective">
                                        <div className="absolute -inset-4 rounded-3xl bg-amber-500/10 opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-700" />
                                        <div className="relative w-full rounded-2xl border border-amber-500/20 overflow-hidden shadow-2xl group-hover:scale-[1.03] transition-transform duration-700 group-hover:shadow-[0_0_50px_rgba(245,158,11,0.2)] bg-[#0A0F1C]">
                                            <video 
                                                autoPlay 
                                                muted 
                                                loop 
                                                playsInline 
                                                poster="/screenshots/gem-hunter.png"
                                                className="w-full h-auto object-contain"
                                            >
                                                <source src="/videos/gem-hunter.mp4" type="video/mp4" />
                                                <img src="/screenshots/gem-hunter.png" alt="Gem Hunter Beta" className="w-full h-auto object-contain" loading="lazy" />
                                            </video>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </GlowingCard>
                    </div>

                    {/* AutoPilot Bot — Special Showcase */}
                    <div className="py-16 sm:py-20 max-w-5xl mx-auto">
                        <GlowingCard glowColor="emerald">
                            <div className="p-8 sm:p-12 relative">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                                <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <div className="w-14 h-14 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                                                <Bot className="w-7 h-7 text-emerald-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl sm:text-3xl font-black">AutoPilot Bot</h3>
                                                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                                                    🚧 EM BREVE · BETA
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-emerald-400 text-sm font-medium tracking-wide uppercase">Em fase final de testes — em breve disponível</p>
                                        <p className="text-white/60 text-base sm:text-lg leading-relaxed">
                                            O AutoPilot é como ter um trader profissional operando pra você enquanto você dorme.
                                            Ele analisa os sinais do Sniper Pro, abre posições automaticamente com stop loss e take profit,
                                            e acompanha os preços <strong className="text-white/80">em tempo real via WebSocket</strong>.
                                        </p>
                                        <ul className="space-y-3">
                                            {[
                                                'Abre e fecha trades sozinho baseado em sinais reais',
                                                'Stop Loss, Take Profit e proteção anti-dump automáticos',
                                                'Preços atualizados a cada 1 segundo via WebSocket da Binance',
                                                'Paper Trading — simula sem risco usando preços reais',
                                                'Indicador visual LIVE com P&L atualizado em tempo real',
                                                'Funciona 24/7 mesmo quando você não está olhando',
                                            ].map((h, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <div className="p-1 rounded-full bg-emerald-500/15 mt-0.5 shrink-0">
                                                        <Check className="w-3 h-3 text-emerald-400" strokeWidth={3} />
                                                    </div>
                                                    <span className="text-white/70 text-sm">{h}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="relative group perspective">
                                        <div className="absolute -inset-4 rounded-3xl bg-emerald-500/10 opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-700" />
                                        <div className="relative w-full rounded-2xl border border-emerald-500/20 overflow-hidden shadow-2xl group-hover:scale-[1.03] transition-transform duration-700 group-hover:shadow-[0_0_50px_rgba(52,211,153,0.2)] bg-[#0A0F1C]">
                                            <video 
                                                autoPlay 
                                                muted 
                                                loop 
                                                playsInline 
                                                poster="/screenshots/autopilot.jpeg"
                                                className="w-full h-auto object-contain"
                                            >
                                                <source src="/videos/autopilot.mp4" type="video/mp4" />
                                                <img src="/screenshots/autopilot.jpeg" alt="AutoPilot Bot" className="w-full h-auto object-contain" loading="lazy" />
                                            </video>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </GlowingCard>
                    </div>
                </div>
            </section>

            {/* ═══ COMO FUNCIONA ═══════════════════════════════════════ */}
            <section className="py-20 sm:py-28 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-black mb-4">Simples como <span className="text-emerald-400">1, 2, 3</span></h2>
                        <p className="text-lg text-white/50 max-w-lg mx-auto">Mesmo que você nunca tenha operado cripto, vai entender tudo em minutos.</p>
                    </div>
                    <div className="space-y-10 max-w-xl mx-auto">
                        {[
                            { n: 1, t: 'Crie sua conta grátis', d: 'Leva 30 segundos. Só precisa de email e senha. Sem cartão, sem compromisso, sem enrolação.' },
                            { n: 2, t: 'O Radar encontra as oportunidades', d: 'A IA analisa 241+ moedas e te mostra as melhores: com score, fase do ciclo e direção do mercado.' },
                            { n: 3, t: 'Acompanhe ou deixe no automático', d: 'Use os sinais do Sniper pra operar manualmente, ou ative o AutoPilot e ele opera 24/7 pra você.' },
                        ].map((step, i) => (
                            <React.Fragment key={i}>
                                {i > 0 && <div className="ml-6 w-px h-10 bg-gradient-to-b from-emerald-500/30 to-transparent" />}
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-lg font-black text-black shrink-0 shadow-lg shadow-emerald-500/20">{step.n}</div>
                                    <div><h4 className="text-lg font-bold mb-1">{step.t}</h4><p className="text-white/50 text-sm leading-relaxed">{step.d}</p></div>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ NÚMEROS ═════════════════════════════════════════════ */}
            <section className="py-20 sm:py-28 px-4 sm:px-6 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.02] to-transparent pointer-events-none" />
                <div className="max-w-5xl mx-auto relative">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl sm:text-4xl font-black mb-4">Números que <span className="text-cyan-400">impressionam</span></h2>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                        {stats.map((s, i) => (
                            <div key={i} className="text-center p-6 sm:p-8 rounded-2xl border border-white/5 bg-white/[0.02]">
                                <s.icon className="w-8 h-8 mx-auto mb-4 text-cyan-400/80" />
                                <div className="text-3xl sm:text-4xl font-black text-white mb-1"><AnimatedNumber end={s.value} suffix={s.suffix} /></div>
                                <p className="text-sm text-white/40">{s.label}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                        {['🤖 IA operando 24/7', '📊 Dados reais da Binance', '🔒 Sem acesso à sua exchange', '📱 Funciona no celular'].map((b, i) => (
                            <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/5 text-sm text-white/60">{b}</div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ INSPIRAÇÃO & PROPÓSITO ══════════════════════════════ */}
            <section className="py-20 sm:py-28 px-4 sm:px-6 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-2xl shadow-amber-500/20 mb-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                        <Sparkles className="w-10 h-10 text-black" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6">
                        Um Ecossistema com <span className="text-amber-400">Propósito Inabalável</span>
                    </h2>
                    <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed italic mb-10">
                        "Consagre ao Senhor tudo o que você faz, e os seus planos serão bem-sucedidos." — Provérbios 16:3
                    </p>
                    <div className="max-w-2xl mx-auto p-8 rounded-3xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Sparkles className="w-24 h-24 text-amber-500" />
                        </div>
                        <p className="text-lg text-white/80 leading-relaxed">
                            Mais do que código e algoritmos, o <strong>Gem Intel Pro</strong> nasceu da fé e da busca pela excelência. 
                            Acreditamos que a tecnologia deve servir para prosperar com integridade e sabedoria. 
                            Toda a honra e toda a glória sejam dadas ao nosso Senhor Jesus Cristo.
                        </p>
                        <div className="mt-8 flex items-center justify-center gap-2 text-amber-500/60 font-black tracking-widest text-[10px] uppercase">
                            <div className="h-px w-8 bg-amber-500/20" />
                            Inspirado por Ele • Desenvolvido para Você
                            <div className="h-px w-8 bg-amber-500/20" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ PLANOS & CRÉDITOS ════════════════════════════════════ */}
            <section id="pricing" className="py-20 sm:py-28 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-6">
                            <Star className="w-4 h-4 fill-current" /> Planos & Créditos
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">Escolha seu <span className="bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">plano</span></h2>
                        <p className="text-lg text-white/50 max-w-lg mx-auto">Comece grátis. Evolua quando quiser. Sem surpresas.</p>
                    </div>

                    {/* Tab selector: Plans vs Credits */}
                    <div className="flex items-center justify-center gap-2 mb-10">
                        <button
                            onClick={() => setPricingTab('plans')}
                            className={cn('px-6 py-2.5 rounded-full text-sm font-semibold transition-all', pricingTab === 'plans' ? 'bg-white/10 text-white border border-white/20' : 'text-white/40 hover:text-white/60')}
                        >
                            Planos Mensais
                        </button>
                        <button
                            onClick={() => setPricingTab('credits')}
                            className={cn('px-6 py-2.5 rounded-full text-sm font-semibold transition-all', pricingTab === 'credits' ? 'bg-white/10 text-white border border-white/20' : 'text-white/40 hover:text-white/60')}
                        >
                            Comprar Créditos
                        </button>
                    </div>

                    {pricingTab === 'plans' ? (
                        <>
                            {/* Annual/Monthly Toggle */}
                            <div className="flex items-center justify-center gap-4 mb-10">
                                <span className={cn('text-sm font-medium transition-colors', !isAnnual ? 'text-white' : 'text-white/40')}>Mensal</span>
                                <button
                                    onClick={() => setIsAnnual(!isAnnual)}
                                    className={cn('relative w-14 h-7 rounded-full transition-colors', isAnnual ? 'bg-emerald-500' : 'bg-white/20')}
                                >
                                    <div className={cn('absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform', isAnnual ? 'translate-x-7' : 'translate-x-0.5')} />
                                </button>
                                <span className={cn('text-sm font-medium transition-colors', isAnnual ? 'text-white' : 'text-white/40')}>Anual</span>
                                {isAnnual && (
                                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 animate-pulse">
                                        ATÉ 32% OFF
                                    </span>
                                )}
                            </div>

                            {/* Plans Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                                {plans.map((plan: any) => {
                                    const Icon = plan.icon;
                                    return (
                                        <div key={plan.id} className={cn(
                                            'relative flex flex-col p-8 rounded-2xl border transition-all duration-500',
                                            plan.popular ? 'border-emerald-500/40 bg-gradient-to-b from-emerald-500/5 to-transparent shadow-xl shadow-emerald-500/5 scale-[1.03] z-10' : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                                        )}>
                                            {plan.popular && (
                                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black px-5 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                                                    <Star className="w-3.5 h-3.5 fill-current" /> Mais Popular
                                                </div>
                                            )}
                                            <div className="text-center mb-6">
                                                <div className={cn('mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-4', `bg-gradient-to-br ${plan.gradient}`)}>
                                                    <Icon className={cn('w-7 h-7', plan.color)} />
                                                </div>
                                                <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                                                <div className="flex items-baseline justify-center gap-1">
                                                    <span className="text-4xl font-black">{plan.price}</span>
                                                    <span className="text-white/40">{plan.period}</span>
                                                </div>
                                                {plan.monthlyEquiv && (
                                                    <p className="text-sm text-emerald-400 mt-1 font-medium">{plan.monthlyEquiv}</p>
                                                )}
                                                {plan.savings && (
                                                    <p className="text-xs text-emerald-400/70 mt-0.5">{plan.savings}</p>
                                                )}
                                                <p className="text-sm text-white/40 mt-2">{plan.desc}</p>
                                            </div>
                                            <div className="w-full h-px bg-white/5 my-4" />
                                            <ul className="space-y-3 flex-1 mb-8">
                                                {plan.features.map((f: any, i: number) => (
                                                    <li key={i} className="flex items-center gap-3 text-sm">
                                                        {f.included ? (
                                                            <div className="p-1 rounded-full bg-emerald-500/15 text-emerald-500 shrink-0"><Check className="w-3 h-3" strokeWidth={3} /></div>
                                                        ) : (
                                                            <div className="p-1 rounded-full bg-white/5 text-white/20 shrink-0"><X className="w-3 h-3" /></div>
                                                        )}
                                                        <span className={f.included ? 'text-white/80' : 'text-white/25 line-through'}>{f.text}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <button onClick={plan.action} className={cn('w-full py-3.5 rounded-xl text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98]', plan.ctaStyle)}>
                                                {plan.cta}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        /* ═══ CRÉDITOS AVULSOS ═══ */
                        <div className="space-y-10">
                            <div className="text-center">
                                <h3 className="text-2xl sm:text-3xl font-black mb-3">Créditos Avulsos</h3>
                                <p className="text-white/50 max-w-lg mx-auto">Não quer assinar? Compre pacotes de créditos que nunca expiram e use as ferramentas premium quando precisar.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                {creditPacks.map((pack, i) => (
                                    <div key={i} className={cn(
                                        'relative flex flex-col items-center p-6 sm:p-8 rounded-2xl border transition-all duration-300 hover:scale-[1.02]',
                                        pack.popular ? 'border-emerald-500/30 bg-emerald-500/5 shadow-lg shadow-emerald-500/5' : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                                    )}>
                                        {pack.popular && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black px-4 py-1 rounded-full text-xs font-bold shadow-md whitespace-nowrap">
                                                MAIS POPULAR
                                            </div>
                                        )}
                                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                                            <Coins className="w-6 h-6 text-emerald-400" />
                                        </div>
                                        <h4 className="text-lg font-bold mb-1">{pack.name}</h4>
                                        <p className="text-2xl font-black text-white mb-0.5">{pack.credits.toLocaleString()} <span className="text-sm font-normal text-white/40">créditos</span></p>
                                        <p className="text-3xl font-black text-emerald-400 mb-1">R$ {pack.price.toFixed(2).replace('.', ',')}</p>
                                        <p className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full mb-4 border border-emerald-500/20">{pack.desc}</p>
                                        <button onClick={() => window.open(pack.url, '_blank')} className={cn(
                                            'w-full py-3 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]',
                                            pack.popular ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black' : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                                        )}>
                                            Comprar Agora
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Credit costs info */}
                            <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl border border-white/5 bg-white/[0.02]">
                                <h4 className="flex items-center gap-2 text-lg font-bold mb-5">
                                    <Zap className="w-5 h-5 text-amber-400" /> O que posso fazer com créditos?
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {creditCosts.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
                                            <span className="text-sm text-white/70">{item.label}</span>
                                            <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                                                {item.cost} crédito{item.cost > 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* ═══ FAQ ═════════════════════════════════════════════════ */}
            <section className="py-20 sm:py-28 px-4 sm:px-6">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl sm:text-4xl font-black mb-4">Perguntas <span className="text-white/50">frequentes</span></h2>
                        <p className="text-white/40">Tudo que você precisa saber antes de começar</p>
                    </div>
                    <div className="space-y-3">
                        {faqs.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} open={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)} />)}
                    </div>
                </div>
            </section>

            {/* ═══ GARANTIA ════════════════════════════════════════════ */}
            <section className="py-20 sm:py-24 px-4 sm:px-6">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center mb-6">
                        <ShieldCheck className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black mb-4">Garantia de <span className="text-emerald-400">7 dias</span></h2>
                    <p className="text-white/50 leading-relaxed max-w-lg mx-auto mb-6">
                        Se você assinar um plano pago e não ficar satisfeito nos primeiros 7 dias, devolvemos 100% do seu dinheiro.
                        <strong className="text-white/70"> Sem perguntas, sem burocracia. Zero risco.</strong>
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/30">
                        <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Reembolso em 48h</span>
                        <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Sem justificativa</span>
                        <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Cancele quando quiser</span>
                    </div>
                </div>
            </section>

            {/* ═══ CTA FINAL ═══════════════════════════════════════════ */}
            <section className="py-20 sm:py-28 px-4 sm:px-6 relative">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl" />
                </div>
                <div className="max-w-3xl mx-auto text-center relative z-10">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight">
                        Pronto para operar com <br />
                        <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">inteligência artificial</span>?
                    </h2>
                    <p className="text-lg text-white/50 mb-10 max-w-lg mx-auto">
                        Milhares de sinais são gerados todos os dias. A pergunta é: quantos você está aproveitando?
                    </p>
                    <button onClick={goToAuth} className="group inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-xl px-10 py-5 rounded-2xl hover:shadow-2xl hover:shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95">
                        Comece Grátis Agora <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                    </button>
                    <p className="mt-5 text-sm text-white/30">✓ Sem cartão &nbsp;·&nbsp; ✓ 30 segundos &nbsp;·&nbsp; ✓ Cancele quando quiser</p>

                    {/* Exchange referral */}
                    <ExchangeBanner className="mt-8" />
                </div>
            </section>

            {/* ═══ FOOTER ══════════════════════════════════════════════ */}
            <footer className="py-10 px-4 sm:px-6 border-t border-white/5">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Gem className="w-5 h-5 text-emerald-400" />
                        <span className="font-bold">Gem Intel Pro</span>
                        <span className="text-xs text-white/30">© 2025</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-white/30">
                        <a href="#" className="hover:text-white/60 transition-colors">Termos</a>
                        <a href="#" className="hover:text-white/60 transition-colors">Privacidade</a>
                        <a href="#" className="hover:text-white/60 transition-colors">Contato</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
