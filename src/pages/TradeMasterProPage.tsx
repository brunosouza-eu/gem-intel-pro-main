import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FASES, CURSO_META } from '@/lib/curso-data';
import { getProgressoCurso, usuarioTemAcesso } from '@/lib/curso-progress';
import { useAuth } from '@/contexts/AuthContext';

const IconPlay = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z" />
    </svg>
);
const IconCheck = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M20 6L9 17l-5-5" />
    </svg>
);
const IconLock = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
);
const IconClock = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
    </svg>
);

function useIsMobile(bp = 768) {
    const [m, setM] = useState(typeof window !== 'undefined' ? window.innerWidth < bp : false);
    useEffect(() => { const c = () => setM(window.innerWidth < bp); window.addEventListener('resize', c); return () => window.removeEventListener('resize', c); }, [bp]);
    return m;
}

export default function TradeMasterProPage() {
    const { user, isAdmin, profile, isPro } = useAuth();
    const isMobile = useIsMobile();
    const [progresso, setProgresso] = useState({ percentual: 0, concluidas: 0, totalAulas: 37, ultimaAula: null as any, progressoMap: {} as Record<string, boolean> });
    const [loading, setLoading] = useState(true);
    const [fasesAbertas, setFasesAbertas] = useState<Record<string, boolean>>({ 'fase-1': true });
    const [hasPurchased, setHasPurchased] = useState(false);

    // Pro/Elite/Admin always have access; free plan checks for individual purchase
    const hasAccess = isAdmin || isPro || hasPurchased;

    useEffect(() => {
        if (!user?.id) { setLoading(false); return; }
        Promise.all([
            getProgressoCurso(user.id, undefined, isAdmin),
            // Only check purchase if not already covered by plan
            (isAdmin || isPro) ? Promise.resolve(true) : usuarioTemAcesso(user.id, undefined, false, profile?.plan),
        ]).then(([p, purchased]) => {
            setProgresso(p);
            setHasPurchased(!!purchased);
            setLoading(false);
        });
        // Track daily mission: read course
        import('@/lib/missionTracker').then(m => m.trackMissionAction('read_course')).catch(() => {});
    }, [user?.id, isAdmin, isPro, profile?.plan]);

    const primeiraAula = FASES[0].modulos[0].aulas[0];
    const continuarAula = progresso.ultimaAula;

    return (
        <div style={{ minHeight: '100%', background: '#0a0f1a', color: '#e2e8f0', fontFamily: "'Inter', system-ui, sans-serif" }}>

            {/* ── Hero banner ──────────────────────────────── */}
            <div style={{
                background: 'linear-gradient(135deg, #0d1929 0%, #0a1628 50%, #0d1117 100%)',
                borderBottom: '1px solid #1e3a5f',
                padding: isMobile ? '20px 16px 18px' : '32px 32px 28px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Decorative grid */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(#1e3a5f22 1px, transparent 1px), linear-gradient(90deg, #1e3a5f22 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', maxWidth: 900 }}>
                    {/* Breadcrumb */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#607d8b', marginBottom: isMobile ? 12 : 16 }}>
                        <span>Biblioteca</span>
                        <span style={{ color: '#1e3a5f' }}>›</span>
                        <span style={{ color: '#4ade80' }}>Curso Trade Master</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: isMobile ? 16 : 24, flexDirection: isMobile ? 'column' : 'row' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                <div style={{ background: 'linear-gradient(135deg, #4ade80, #22c55e)', borderRadius: 10, padding: '8px 10px', fontSize: 20 }}>📊</div>
                                <div>
                                    <h1 style={{ margin: 0, fontSize: isMobile ? 22 : 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
                                        Curso Trade Master
                                    </h1>
                                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#607d8b' }}>
                                        {CURSO_META.subtitulo}
                                    </p>
                                </div>
                            </div>

                            {/* Stats row */}
                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, auto)', gap: isMobile ? 12 : 20, marginTop: 16 }}>
                                {[
                                    { label: 'Aulas', value: '37' },
                                    { label: 'Horas', value: '18h' },
                                    { label: 'Nível', value: 'Intermediário' },
                                    { label: 'Atualizado', value: '2026' },
                                ].map(s => (
                                    <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <span style={{ fontSize: 18, fontWeight: 700, color: '#4ade80', fontFamily: 'monospace' }}>{s.value}</span>
                                        <span style={{ fontSize: 11, color: '#607d8b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA + Progress */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: isMobile ? '100%' : 'auto', minWidth: isMobile ? undefined : 220 }}>
                            {/* Progress bar */}
                            {progresso.concluidas > 0 && (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                                        <span style={{ color: '#607d8b' }}>Progresso</span>
                                        <span style={{ color: '#4ade80', fontFamily: 'monospace', fontWeight: 700 }}>
                                            {progresso.concluidas}/{progresso.totalAulas} aulas — {progresso.percentual}%
                                        </span>
                                    </div>
                                    <div style={{ height: 6, background: '#1e3a5f', borderRadius: 3, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${progresso.percentual}%`, background: 'linear-gradient(90deg, #4ade80, #22c55e)', borderRadius: 3, transition: 'width 0.6s ease' }} />
                                    </div>
                                </div>
                            )}

                            {/* Main CTA */}
                            {hasAccess || isAdmin ? (
                                <Link
                                    to={
                                        continuarAula
                                            ? `/biblioteca/trade-master-pro/${continuarAula.moduloSlug}/${continuarAula.aulaSlug}`
                                            : `/biblioteca/trade-master-pro/${FASES[0].modulos[0].slug}/${primeiraAula.slug}`
                                    }
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                        background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                                        color: '#0a0f1a', padding: '12px 24px', borderRadius: 10,
                                        fontWeight: 700, fontSize: 14, textDecoration: 'none',
                                        transition: 'opacity 0.2s',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                                >
                                    <IconPlay />
                                    {continuarAula ? 'Continuar curso' : 'Começar agora'}
                                </Link>
                            ) : (
                                <Link
                                    to="/curso-trade-master"
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                        color: '#0a0f1a', padding: '12px 24px', borderRadius: 10,
                                        fontWeight: 700, fontSize: 14, textDecoration: 'none',
                                        transition: 'opacity 0.2s',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                                >
                                    🔒 Desbloquear por R$ 9,90
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Free plan upgrade banner ──────────────────── */}
            {!loading && !hasAccess && !isAdmin && user && (
                <div style={{
                    margin: isMobile ? '16px 16px 0' : '24px 32px 0',
                    padding: isMobile ? '14px 16px' : '16px 24px',
                    background: 'linear-gradient(135deg, #f59e0b22, #d9770622)',
                    border: '1px solid #f59e0b44',
                    borderRadius: 12,
                    display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
                }}>
                    <span style={{ fontSize: 20 }}>🔒</span>
                    <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#fbbf24' }}>Acesso Restrito</div>
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                            Seu plano atual é gratuito. Desbloqueie o curso completo por apenas <strong style={{ color: '#fbbf24' }}>R$ 9,90</strong> ou faça upgrade do seu plano.
                        </div>
                    </div>
                    <Link
                        to="/curso-trade-master"
                        style={{
                            padding: '8px 20px', borderRadius: 8,
                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                            color: '#0a0f1a', fontSize: 13, fontWeight: 700, textDecoration: 'none',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        Desbloquear Agora
                    </Link>
                </div>
            )}

            {/* ── Conteúdo principal ────────────────────────── */}
            <div style={{ padding: isMobile ? '20px 16px' : '28px 32px', maxWidth: 900 }}>

                {/* Fases */}
                {FASES.map(fase => (
                    <div key={fase.id} style={{ marginBottom: 24 }}>

                        {/* Fase header */}
                        <button
                            onClick={() => setFasesAbertas(prev => ({ ...prev, [fase.id]: !prev[fase.id] }))}
                            style={{
                                width: '100%', background: '#111827', border: '1px solid #1e3a5f',
                                borderRadius: 10, padding: isMobile ? '12px 14px' : '14px 18px', cursor: 'pointer', color: '#e2e8f0',
                                display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 14, marginBottom: fasesAbertas[fase.id] ? 2 : 0,
                            }}
                        >
                            <div style={{
                                background: 'linear-gradient(135deg, #4ade8022, #22c55e22)',
                                border: '1px solid #4ade8044',
                                borderRadius: 8, padding: '4px 10px',
                                fontSize: 11, fontWeight: 700, color: '#4ade80', letterSpacing: '0.08em',
                                whiteSpace: 'nowrap',
                            }}>
                                FASE {fase.numero}
                            </div>
                            <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                                <div style={{ fontSize: isMobile ? 14 : 15, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fase.titulo}</div>
                                <div style={{ fontSize: 12, color: '#607d8b', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fase.descricao}</div>
                            </div>
                            <span style={{ color: '#607d8b', fontSize: 18, transition: 'transform 0.2s', transform: fasesAbertas[fase.id] ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>⌄</span>
                        </button>

                        {/* Módulos */}
                        {fasesAbertas[fase.id] && (
                            <div style={{ border: '1px solid #1e3a5f', borderTop: 'none', borderRadius: '0 0 10px 10px', overflow: 'hidden' }}>
                                {fase.modulos.map((modulo, mIdx) => (
                                    <div key={modulo.id} style={{ borderTop: mIdx > 0 ? '1px solid #1e3a5f' : 'none' }}>

                                        {/* Módulo header */}
                                        <div style={{ padding: isMobile ? '10px 14px' : '12px 18px', background: '#0d1729', display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <span style={{ fontSize: 16 }}>{modulo.icone}</span>
                                            <div>
                                                <span style={{ fontSize: 13, fontWeight: 600, color: '#cbd5e1' }}>{modulo.titulo}</span>
                                                <span style={{ fontSize: 11, color: '#607d8b', marginLeft: 10 }}>{modulo.aulas.length} aulas</span>
                                            </div>
                                        </div>

                                        {/* Aulas */}
                                        {modulo.aulas.map(aula => {
                                            const concluida = progresso.progressoMap[aula.slug];
                                            const bloqueada = !isAdmin && !hasAccess && !aula.gratis;

                                            return (
                                                <Link
                                                    key={aula.id}
                                                    to={
                                                        bloqueada
                                                            ? '/curso-trade-master'
                                                            : `/biblioteca/trade-master-pro/${modulo.slug}/${aula.slug}`
                                                    }
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 14,
                                                        padding: isMobile ? '12px 14px 12px 20px' : '12px 18px 12px 28px',
                                                        background: '#0a0f1a',
                                                        borderTop: '1px solid #111827',
                                                        textDecoration: 'none',
                                                        transition: 'background 0.15s',
                                                        cursor: bloqueada ? 'default' : 'pointer',
                                                    }}
                                                    onMouseEnter={e => { if (!bloqueada) e.currentTarget.style.background = '#111827'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = '#0a0f1a'; }}
                                                >
                                                    {/* Status icon */}
                                                    <div style={{
                                                        width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        background: concluida ? '#22c55e22' : '#1e3a5f44',
                                                        border: `1px solid ${concluida ? '#22c55e88' : '#1e3a5f'}`,
                                                        color: concluida ? '#4ade80' : bloqueada ? '#607d8b' : '#3d8fef',
                                                    }}>
                                                        {concluida ? <IconCheck /> : bloqueada ? <IconLock /> : <IconPlay />}
                                                    </div>

                                                    {/* Title */}
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <span style={{
                                                            fontSize: 13, color: bloqueada ? '#607d8b' : '#cbd5e1', fontWeight: 500,
                                                            display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                        }}>
                                                            {aula.titulo}
                                                        </span>
                                                        {aula.gratis && !concluida && (
                                                            <span style={{
                                                                marginLeft: 0, marginTop: 2, fontSize: 10, padding: '1px 6px', borderRadius: 4,
                                                                background: '#4ade8022', color: '#4ade80', border: '1px solid #4ade8044', fontWeight: 600,
                                                                display: 'inline-block',
                                                            }}>GRÁTIS</span>
                                                        )}
                                                    </div>

                                                    {/* Duration */}
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#607d8b', fontSize: 11, flexShrink: 0 }}>
                                                        <IconClock />
                                                        {aula.duracao}
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
