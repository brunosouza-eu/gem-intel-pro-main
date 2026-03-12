import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAulaBySlug, getProximaAula, getAulaAnterior } from '@/lib/curso-data';
import { getProgressoCurso, usuarioTemAcesso } from '@/lib/curso-progress';
import { useAuth } from '@/contexts/AuthContext';
import CoursePlayer from '@/components/curso/CoursePlayer';
import CourseSidebar from '@/components/curso/CourseSidebar';
import ConteudoAula from '@/components/curso/ConteudoAula';
import { LESSON_CONTENT } from '@/lib/curso-content';
import '@/lib/curso-content.css';

const IconArrow = ({ dir }: { dir: 'left' | 'right' }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {dir === 'left' ? <path d="M19 12H5M12 5l-7 7 7 7" /> : <path d="M5 12h14M12 5l7 7-7 7" />}
    </svg>
);

const IconMenu = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
);

function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < breakpoint : false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < breakpoint);
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, [breakpoint]);
    return isMobile;
}

export default function TradeMasterAulaPage() {
    const { modulo: moduloSlug, aula: aulaSlug } = useParams<{ modulo: string; aula: string }>();
    const { user, isAdmin, profile, isPro, loading: userLoading } = useAuth();
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    const resultado = moduloSlug && aulaSlug ? getAulaBySlug(moduloSlug, aulaSlug) : null;
    const proximaAula = moduloSlug && aulaSlug ? getProximaAula(moduloSlug, aulaSlug) : null;
    const aulaAnterior = moduloSlug && aulaSlug ? getAulaAnterior(moduloSlug, aulaSlug) : null;

    const [hasPurchased, setHasPurchased] = useState(false);
    const [progresso, setProgresso] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);
    const [abaAtiva, setAbaAtiva] = useState<'material' | 'notas'>('material');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Pro/Elite/Admin always have access; free plan checks for individual purchase
    const hasAccess = isAdmin || isPro || hasPurchased;

    useEffect(() => {
        if (userLoading) return;
        if (!resultado) { navigate('/biblioteca/trade-master-pro'); return; }

        async function init() {
            if (user?.id || isAdmin) {
                const uid = user?.id || 'admin';
                const [prog, purchased] = await Promise.all([
                    getProgressoCurso(uid, undefined, isAdmin),
                    // Only check purchase if not already covered by plan
                    (isAdmin || isPro) ? Promise.resolve(true) : usuarioTemAcesso(uid, undefined, false, profile?.plan),
                ]);
                setHasPurchased(!!purchased);
                setProgresso(prog.progressoMap);
            }
            setLoading(false);
        }
        init();
    }, [user, isAdmin, isPro, userLoading, resultado, navigate, profile?.plan]);

    // Block access if no permission and lesson isn't free
    useEffect(() => {
        if (!loading && resultado && !hasAccess && !resultado.aula.gratis && !isAdmin) {
            navigate('/curso-trade-master');
        }
    }, [loading, hasAccess, resultado, navigate, isAdmin]);

    const scrollToTop = useCallback(() => {
        window.scrollTo(0, 0);
        // Also scroll the tab content container
        document.querySelector('[data-scroll-container]')?.scrollTo(0, 0);
    }, []);

    const handleConcluir = useCallback(async () => {
        if (!resultado) return;
        setProgresso(prev => ({ ...prev, [resultado.aula.slug]: true }));
        if (proximaAula) {
            setTimeout(() => {
                navigate(`/biblioteca/trade-master-pro/${proximaAula.moduloSlug}/${proximaAula.slug}`);
                scrollToTop();
            }, 2000);
        }
    }, [resultado, proximaAula, navigate, scrollToTop]);

    if (loading || !resultado) {
        return (
            <div style={{ minHeight: '100%', background: '#0a0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: '#607d8b', fontSize: 14 }}>Carregando...</div>
            </div>
        );
    }

    const { aula, modulo, fase } = resultado;

    return (
        <>
            <style>{`
          @media (max-width: 767px) {
            .curso-aula-root { flex-direction: column !important; }
            .curso-aula-root > aside.curso-sidebar-desktop { display: none !important; }
          }
        `}</style>
            <div className="curso-aula-root" style={{ display: 'flex', height: '100%', background: '#0a0f1a', overflow: 'hidden' }}>

                {/* ── Main content ───────────────────────────────── */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

                    {/* Top bar: breadcrumb + menu button */}
                    <div style={{
                        padding: isMobile ? '8px 12px' : '10px 24px',
                        background: '#0d1117', borderBottom: '1px solid #1e3a5f',
                        display: 'flex', alignItems: 'center', gap: 8,
                        fontSize: isMobile ? 10 : 11, color: '#607d8b', flexShrink: 0,
                    }}>
                        <Link to="/biblioteca/trade-master-pro" style={{ color: '#607d8b', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                            {isMobile ? '📊' : 'Curso Trade Master'}
                        </Link>
                        <span>›</span>
                        {!isMobile && (
                            <>
                                <span>Fase {fase.numero}</span>
                                <span>›</span>
                                <span>{modulo.titulo}</span>
                                <span>›</span>
                            </>
                        )}
                        <span style={{
                            color: '#cbd5e1', flex: 1,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                            {aula.titulo}
                        </span>

                        {/* Mobile menu button */}
                        {isMobile && (
                            <button
                                onClick={() => setSidebarOpen(true)}
                                style={{
                                    background: '#1e3a5f44', border: '1px solid #1e3a5f',
                                    borderRadius: 8, padding: '6px 8px',
                                    color: '#94a3b8', cursor: 'pointer', flexShrink: 0,
                                    display: 'flex', alignItems: 'center', gap: 4,
                                }}
                            >
                                <IconMenu />
                                <span style={{ fontSize: 10 }}>Aulas</span>
                            </button>
                        )}
                    </div>

                    {/* Player */}
                    <CoursePlayer
                        videoId={aula.videoId}
                        aulaSlug={aula.slug}
                        moduloSlug={modulo.slug}
                        titulo={aula.titulo}
                        duracao={aula.duracao}
                        onConcluir={handleConcluir}
                    />

                    {/* ── Tabs: Material / Notas ─────────────────── */}
                    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                        {/* Tab headers */}
                        <div style={{ display: 'flex', borderBottom: '1px solid #1e3a5f', background: '#0d1117', flexShrink: 0 }}>
                            {(['material', 'notas'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setAbaAtiva(tab)}
                                    style={{
                                        padding: isMobile ? '10px 14px' : '10px 20px',
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        fontSize: isMobile ? 12 : 13,
                                        color: abaAtiva === tab ? '#4ade80' : '#607d8b',
                                        borderBottom: abaAtiva === tab ? '2px solid #4ade80' : '2px solid transparent',
                                        fontWeight: abaAtiva === tab ? 600 : 400,
                                        transition: 'all 0.15s',
                                        textTransform: 'capitalize',
                                    }}
                                >
                                    {tab === 'material' ? '📄 Material' : '📝 Notas'}
                                </button>
                            ))}
                        </div>

                        {/* Tab content */}
                        <div data-scroll-container style={{
                            flex: 1, overflowY: 'auto',
                            padding: isMobile ? '16px 14px' : '20px 24px',
                            scrollbarWidth: 'thin', scrollbarColor: '#1e3a5f transparent',
                        }}>
                            {abaAtiva === 'material' ? (
                                <ConteudoAula aulaSlug={aula.slug} descricao={aula.descricao} />
                            ) : (
                                <NotasAula aulaSlug={aula.slug} userId={user?.id} />
                            )}
                        </div>
                    </div>

                    {/* ── Navigation prev/next ────────────────────── */}
                    <div style={{
                        padding: isMobile ? '10px 12px' : '12px 24px',
                        background: '#0d1117', borderTop: '1px solid #1e3a5f',
                        display: 'flex', justifyContent: 'space-between', gap: 10, flexShrink: 0,
                    }}>
                        {aulaAnterior ? (
                            <Link
                                to={`/biblioteca/trade-master-pro/${aulaAnterior.moduloSlug}/${aulaAnterior.slug}`}
                                onClick={scrollToTop}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    padding: isMobile ? '8px 12px' : '8px 16px',
                                    borderRadius: 8, border: '1px solid #1e3a5f',
                                    color: '#607d8b', fontSize: 12, textDecoration: 'none',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#3d8fef'; e.currentTarget.style.color = '#3d8fef'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e3a5f'; e.currentTarget.style.color = '#607d8b'; }}
                            >
                                <IconArrow dir="left" />
                                {isMobile ? 'Anterior' : 'Aula anterior'}
                            </Link>
                        ) : <div />}

                        {proximaAula && (
                            <Link
                                to={`/biblioteca/trade-master-pro/${proximaAula.moduloSlug}/${proximaAula.slug}`}
                                onClick={scrollToTop}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    padding: isMobile ? '8px 14px' : '8px 20px',
                                    borderRadius: 8,
                                    background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                                    color: '#0a0f1a', fontSize: 12, fontWeight: 700, textDecoration: 'none',
                                    transition: 'opacity 0.2s',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                            >
                                Próxima
                                <IconArrow dir="right" />
                            </Link>
                        )}
                    </div>
                </div>

                {/* ── Sidebar ──────────────────────────────────────── */}
                <CourseSidebar
                    moduloAtualSlug={moduloSlug!}
                    aulaAtualSlug={aulaSlug!}
                    progresso={progresso}
                    hasAccess={hasAccess || isAdmin}
                    isMobile={isMobile}
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />
            </div>
        </>
    );
}

// ── Notas por aula ─────────────────────────────────────────────
function NotasAula({ aulaSlug, userId }: { aulaSlug: string; userId?: string }) {
    const key = `nota_${userId ?? 'guest'}_${aulaSlug}`;
    const [nota, setNota] = useState('');
    const [salvo, setSalvo] = useState(false);

    useEffect(() => {
        setNota(localStorage.getItem(key) ?? '');
    }, [key, aulaSlug]);

    const salvar = () => {
        localStorage.setItem(key, nota);
        setSalvo(true);
        setTimeout(() => setSalvo(false), 2000);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ color: '#607d8b', fontSize: 12, margin: 0 }}>
                Suas anotações sobre esta aula (salvas localmente)
            </p>
            <textarea
                value={nota}
                onChange={e => setNota(e.target.value)}
                placeholder="Digite suas notas aqui..."
                style={{
                    width: '100%', minHeight: 200, background: '#0d1729', border: '1px solid #1e3a5f',
                    borderRadius: 8, padding: '12px', color: '#e2e8f0', fontSize: 13, lineHeight: 1.6,
                    resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                }}
                onFocus={e => (e.target.style.borderColor = '#4ade80')}
                onBlur={e => (e.target.style.borderColor = '#1e3a5f')}
            />
            <button
                onClick={salvar}
                style={{
                    alignSelf: 'flex-start', padding: '8px 16px', borderRadius: 8, cursor: 'pointer',
                    background: salvo ? '#22c55e22' : '#1e3a5f', border: `1px solid ${salvo ? '#22c55e88' : '#2d4a6f'}`,
                    color: salvo ? '#4ade80' : '#94a3b8', fontSize: 12, fontWeight: 500, transition: 'all 0.2s',
                }}
            >
                {salvo ? '✓ Salvo!' : 'Salvar nota'}
            </button>
        </div>
    );
}
