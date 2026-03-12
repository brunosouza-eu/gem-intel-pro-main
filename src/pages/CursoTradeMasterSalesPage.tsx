/**
 * 🎓 Curso Trade Master — Página de Vendas
 * Landing page premium para tráfego pago (R$9,90)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { FASES, CURSO_META } from '@/lib/curso-data';
import {
    Check, ChevronDown, ChevronUp, ArrowRight, Shield,
    BookOpen, Target, Brain, TrendingUp, Clock, Users,
    Play, Star, Zap, Award, Gem, ShieldCheck, Lock,
    BarChart3, Layers
} from 'lucide-react';

// Replace with your actual Hotmart / payment link for the R$9,90 course
const HOTMART_COURSE_URL = 'https://pay.hotmart.com/A104828828D?off=sj4n59vd';

const FaqItem: React.FC<{ q: string; a: string; open: boolean; onClick: () => void }> = ({ q, a, open, onClick }) => (
    <div className={cn(
        'rounded-2xl border transition-all duration-300 overflow-hidden',
        open ? 'border-emerald-500/30 bg-emerald-500/5 shadow-lg shadow-emerald-500/5' : 'border-white/5 bg-white/[0.02] hover:border-white/10'
    )}>
        <button className="w-full flex items-center justify-between p-5 text-left" onClick={onClick}>
            <span className="font-semibold text-base pr-4">{q}</span>
            {open ? <ChevronUp className="w-5 h-5 text-emerald-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-white/30 shrink-0" />}
        </button>
        <div className={cn('px-5 transition-all duration-300 overflow-hidden', open ? 'pb-5 max-h-[500px] opacity-100' : 'max-h-0 opacity-0')}>
            <p className="text-white/60 leading-relaxed text-sm">{a}</p>
        </div>
    </div>
);

const CursoTradeMasterSalesPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, profile, isPro, isAdmin } = useAuth();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    // If user already has access, redirect to the course
    useEffect(() => {
        if (user && (isPro || isAdmin)) {
            navigate('/biblioteca/trade-master-pro', { replace: true });
        }
    }, [user, isPro, isAdmin, navigate]);

    const goToBuy = () => {
        if (!user) {
            navigate('/auth');
        } else {
            window.open(HOTMART_COURSE_URL, '_blank');
        }
    };

    const totalAulas = FASES.flatMap(f => f.modulos.flatMap(m => m.aulas)).length;

    const benefits = [
        { icon: BookOpen, title: '37 Aulas Completas', desc: 'Do absoluto zero à execução profissional, tudo mastigado' },
        { icon: Target, title: 'Sistema STMP', desc: 'Método proprietário com ADX, RSI, MACD, Ichimoku e scorecard' },
        { icon: Brain, title: 'Psicologia do Trader', desc: '10 regras absolutas + gestão emocional que te mantém no jogo' },
        { icon: TrendingUp, title: 'Análise Multi-Timeframe', desc: 'Protocolo de 45 min com matriz de 7 dimensões × 3 timeframes' },
        { icon: BarChart3, title: 'Cenários Probabilísticos', desc: 'Framework dos 3 cenários com cálculo de probabilidade quantificado' },
        { icon: Layers, title: 'Material de Apoio', desc: 'Cada aula com documentação, exemplos reais e exercícios práticos' },
    ];

    const faqs = [
        { q: 'Para quem é o Curso Trade Master?', a: 'Para quem quer aprender a operar criptomoedas de forma profissional. Você não precisa ter experiência prévia — o curso te leva do zero ao avançado com um método estruturado e prático.' },
        { q: 'Tenho acesso vitalício?', a: 'Sim! Uma vez que você comprar o curso, o acesso é seu para sempre. Você pode assistir quantas vezes quiser, no seu ritmo.' },
        { q: 'E se eu já tenho um plano Pro ou Elite?', a: 'Se você é assinante Pro ou Elite da Gem Intel, o Curso Trade Master já está incluso no seu plano. Você não precisa pagar R$9,90 separadamente!' },
        { q: 'Posso assistir no celular?', a: 'Com certeza! A plataforma é 100% responsiva. Assista no celular, tablet ou computador — a experiência é otimizada para todos os dispositivos.' },
        { q: 'Tem certificado?', a: 'Sim! Ao concluir todas as 37 aulas, você recebe um certificado digital de conclusão do Curso Trade Master.' },
        { q: 'Posso cancelar e pedir reembolso?', a: 'Você tem 7 dias de garantia incondicional. Se não gostar, devolvemos 100% do seu dinheiro — sem perguntas, sem burocracia.' },
    ];

    return (
        <div className="min-h-screen bg-[hsl(222,47%,6%)] text-white overflow-hidden">

            {/* ═══ NAV ══════════════════════════════════════════ */}
            <nav className="flex items-center justify-between px-4 sm:px-8 lg:px-16 py-5 relative z-20">
                <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <Gem className="w-5 h-5 text-black" />
                    </div>
                    <span className="text-xl font-extrabold tracking-tight">Gem Intel</span>
                </div>
                <div className="flex items-center gap-3">
                    {user ? (
                        <button onClick={() => navigate('/dashboard')} className="text-sm font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 text-black px-5 py-2.5 rounded-xl hover:shadow-lg transition-all">
                            Ir para o App
                        </button>
                    ) : (
                        <>
                            <button onClick={() => navigate('/auth')} className="text-sm text-white/60 hover:text-white transition-colors px-4 py-2">Entrar</button>
                            <button onClick={() => navigate('/auth')} className="text-sm font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 text-black px-5 py-2.5 rounded-xl hover:shadow-lg transition-all">
                                Criar Conta
                            </button>
                        </>
                    )}
                </div>
            </nav>

            {/* ═══ HERO ══════════════════════════════════════════ */}
            <section className="relative flex flex-col items-center justify-center px-4 sm:px-6 pt-8 sm:pt-16 pb-16 sm:pb-24">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-gradient-to-b from-emerald-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm mb-8">
                        <BookOpen className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">{totalAulas} aulas</span>
                        <span className="text-white/50">• 18 horas de conteúdo</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] tracking-tight mb-6">
                        <span className="block">Curso</span>
                        <span className="block bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Trade Master</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-6">
                        O método completo de análise e operação em criptomoedas.
                        Do contexto macro à execução precisa — <strong className="text-white/80">37 aulas</strong> com exemplos reais.
                    </p>

                    {/* Price */}
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <span className="text-white/30 line-through text-lg">R$ 197</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl sm:text-6xl font-black text-white">R$ 9</span>
                            <span className="text-2xl font-bold text-white">,90</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                            95% OFF
                        </span>
                    </div>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                        <button
                            onClick={goToBuy}
                            className="group w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-lg px-10 py-4 rounded-2xl hover:shadow-xl hover:shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                        >
                            Quero o Curso Agora
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/30">
                        <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Acesso vitalício</span>
                        <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Garantia de 7 dias</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Assista no seu ritmo</span>
                    </div>
                </div>
            </section>

            {/* ═══ SOCIAL PROOF ═══════════════════════════════════ */}
            <section className="py-12 sm:py-16 px-4 sm:px-6 relative">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { value: '37', label: 'Aulas', icon: Play },
                            { value: '18h', label: 'De Conteúdo', icon: Clock },
                            { value: '4', label: 'Fases', icon: Layers },
                            { value: '10', label: 'Módulos', icon: BookOpen },
                        ].map((s, i) => (
                            <div key={i} className="text-center p-5 sm:p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                                <s.icon className="w-6 h-6 mx-auto mb-3 text-emerald-400/80" />
                                <div className="text-2xl sm:text-3xl font-black text-white mb-0.5">{s.value}</div>
                                <p className="text-xs text-white/40">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ O QUE VOCÊ VAI APRENDER ═══════════════════════ */}
            <section className="py-16 sm:py-24 px-4 sm:px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
                            <Target className="w-4 h-4" /> O que você vai dominar
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black mb-4">
                            Tudo que você precisa para operar com
                            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"> confiança</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {benefits.map((b, i) => (
                            <div key={i} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-emerald-500/20 transition-all duration-300 group">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                                    <b.icon className="w-6 h-6 text-emerald-400" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{b.title}</h3>
                                <p className="text-sm text-white/50 leading-relaxed">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ CONTEÚDO DO CURSO (4 FASES) ═══════════════════ */}
            <section className="py-16 sm:py-24 px-4 sm:px-6 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent pointer-events-none" />
                <div className="max-w-3xl mx-auto relative">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl sm:text-4xl font-black mb-4">
                            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">4 fases</span>, 37 aulas
                        </h2>
                        <p className="text-white/50 max-w-lg mx-auto">Uma jornada completa do contexto macro à execução precisa.</p>
                    </div>

                    <div className="space-y-4">
                        {FASES.map(fase => (
                            <div key={fase.id} className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
                                <div className="p-5 sm:p-6 flex items-start gap-4">
                                    <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
                                        <span className="text-emerald-400 font-bold text-sm">{fase.numero}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold mb-1">{fase.titulo}</h3>
                                        <p className="text-sm text-white/40 mb-3">{fase.descricao}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {fase.modulos.map(m => (
                                                <span key={m.id} className="text-xs px-3 py-1 rounded-full bg-white/[0.04] border border-white/5 text-white/50">
                                                    {m.icone} {m.titulo}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="mt-2 text-xs text-white/30">
                                            {fase.modulos.reduce((s, m) => s + m.aulas.length, 0)} aulas
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ INCLUÍDO NOS PLANOS ═════════════════════════════ */}
            <section className="py-16 sm:py-24 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-transparent to-emerald-500/5 p-6 sm:p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-4">
                                <Award className="w-8 h-8 text-amber-400" />
                                <h2 className="text-2xl sm:text-3xl font-black">Já é assinante Pro ou Elite?</h2>
                            </div>
                            <p className="text-white/60 text-base leading-relaxed mb-6">
                                O Curso Trade Master está <strong className="text-amber-400">incluso</strong> nos planos Pro (R$ 47/mês) e Elite (R$ 97/mês) da Gem Intel.
                                Se você já é assinante, basta <strong className="text-white/80">acessar o app</strong> e ir direto para o curso — sem pagar nada a mais.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => navigate(user ? '/biblioteca/trade-master-pro' : '/auth')}
                                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-6 py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
                                >
                                    <Play className="w-4 h-4" />
                                    {user ? 'Acessar o Curso' : 'Criar Conta Grátis'}
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium border border-white/10 hover:border-white/20 text-white/60 hover:text-white transition-all"
                                >
                                    Ver planos da Gem Intel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ CTA COMPRA ════════════════════════════════════ */}
            <section className="py-16 sm:py-24 px-4 sm:px-6 relative">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl" />
                </div>
                <div className="max-w-xl mx-auto text-center relative z-10">
                    <div className="p-8 sm:p-10 rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/5 to-transparent">
                        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                            <BookOpen className="w-10 h-10 text-emerald-400" />
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-black mb-2">Curso Trade Master</h2>
                        <p className="text-white/40 text-sm mb-6">{CURSO_META.subtitulo}</p>

                        <div className="flex items-center justify-center gap-2 mb-6">
                            <span className="text-white/30 line-through">R$ 197</span>
                            <span className="text-4xl font-black text-emerald-400">R$ 9,90</span>
                            <span className="text-xs text-white/30">/ acesso vitalício</span>
                        </div>

                        <ul className="text-left space-y-3 mb-8 max-w-sm mx-auto">
                            {[
                                '🎁 Bônus: 30 Créditos na Gem Intel',
                                '37 aulas completas (18h de conteúdo)',
                                'Método STMP proprietário',
                                'Material de apoio em cada aula',
                                'Acesso vitalício — aprenda no seu ritmo',
                                'Certificado de conclusão',
                                'Atualizações gratuitas',
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm">
                                    <div className="p-1 rounded-full bg-emerald-500/15 shrink-0">
                                        <Check className="w-3 h-3 text-emerald-400" strokeWidth={3} />
                                    </div>
                                    <span className="text-white/80">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={goToBuy}
                            className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <Zap className="w-5 h-5" />
                            Quero Aprender Agora — R$ 9,90
                        </button>

                        <p className="text-xs text-white/30 mt-4">Pagamento seguro via Hotmart • Garantia de 7 dias</p>
                    </div>
                </div>
            </section>

            {/* ═══ GARANTIA ═══════════════════════════════════════ */}
            <section className="py-16 sm:py-20 px-4 sm:px-6">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center mb-6">
                        <ShieldCheck className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black mb-4">Garantia de <span className="text-emerald-400">7 dias</span></h2>
                    <p className="text-white/50 leading-relaxed max-w-lg mx-auto mb-6">
                        Se nas primeiras 24 horas você decidir que o curso não é para você,
                        devolvemos <strong className="text-white/70">100% do seu dinheiro</strong>. Sem perguntas. Você não tem absolutamente nada a perder.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/30">
                        <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Reembolso em 48h</span>
                        <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Sem justificativa</span>
                        <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Zero burocracia</span>
                    </div>
                </div>
            </section>

            {/* ═══ FAQ ════════════════════════════════════════════ */}
            <section className="py-16 sm:py-24 px-4 sm:px-6">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl sm:text-4xl font-black mb-4">Perguntas <span className="text-white/50">frequentes</span></h2>
                    </div>
                    <div className="space-y-3">
                        {faqs.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} open={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)} />)}
                    </div>
                </div>
            </section>

            {/* ═══ CTA FINAL ═════════════════════════════════════ */}
            <section className="py-16 sm:py-24 px-4 sm:px-6 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none" />
                <div className="max-w-3xl mx-auto text-center relative z-10">
                    <h2 className="text-3xl sm:text-4xl font-black mb-6 leading-tight">
                        Pronto para dominar o<br />
                        <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">mercado cripto</span>?
                    </h2>
                    <p className="text-white/50 mb-10 max-w-lg mx-auto">
                        37 aulas, 18 horas, método comprovado — por apenas <strong className="text-emerald-400">R$ 9,90</strong>.
                    </p>
                    <button
                        onClick={goToBuy}
                        className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-lg px-10 py-4 rounded-2xl hover:shadow-xl hover:shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                        Começar Agora — R$ 9,90
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 border-t border-white/5 text-center text-xs text-white/20">
                © {new Date().getFullYear()} Gem Intel Pro. Todos os direitos reservados.
            </footer>
        </div>
    );
};

export default CursoTradeMasterSalesPage;
