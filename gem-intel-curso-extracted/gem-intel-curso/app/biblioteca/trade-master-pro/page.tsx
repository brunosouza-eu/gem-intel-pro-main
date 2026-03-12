'use client'
// ─────────────────────────────────────────────────────────────────────────────
// /biblioteca/trade-master-pro  —  Página inicial do curso
// Mantém o layout/sidebar do Gem Intel, adiciona conteúdo do curso
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FASES, CURSO_META, getAllAulas } from '@/lib/curso-data'
import { getProgressoCurso } from '@/lib/curso-progress'
import { useUser } from '@/hooks/useUser'       // hook existente no seu projeto

// ── Icons (inline SVG para não depender de lib extra) ─────────────────────────
const IconPlay = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>
)
const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
)
const IconLock = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
)
const IconClock = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
  </svg>
)

// ─────────────────────────────────────────────────────────────────────────────

export default function TradeMasterProPage() {
  const { user } = useUser()
  const [progresso, setProgresso] = useState({ percentual: 0, concluidas: 0, totalAulas: 37, ultimaAula: null as any, progressoMap: {} as Record<string, boolean> })
  const [loading, setLoading] = useState(true)
  const [fasesAbertas, setFasesAbertas] = useState<Record<string, boolean>>({ 'fase-1': true })

  useEffect(() => {
    if (!user?.id) { setLoading(false); return }
    getProgressoCurso(user.id).then(p => { setProgresso(p); setLoading(false) })
  }, [user?.id])

  const primeiraAula = FASES[0].modulos[0].aulas[0]
  const continuarAula = progresso.ultimaAula

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1a', color: '#e2e8f0', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Hero banner ──────────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #0d1929 0%, #0a1628 50%, #0d1117 100%)',
        borderBottom: '1px solid #1e3a5f',
        padding: '32px 32px 28px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(#1e3a5f22 1px, transparent 1px), linear-gradient(90deg, #1e3a5f22 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }}/>

        <div style={{ position: 'relative', maxWidth: 900 }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#607d8b', marginBottom: 16 }}>
            <span>Biblioteca</span>
            <span style={{ color: '#1e3a5f' }}>›</span>
            <span style={{ color: '#4ade80' }}>Trade Master Pro</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ background: 'linear-gradient(135deg, #4ade80, #22c55e)', borderRadius: 10, padding: '8px 10px', fontSize: 20 }}>📊</div>
                <div>
                  <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
                    Trade Master Pro
                  </h1>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: '#607d8b' }}>
                    {CURSO_META.subtitulo}
                  </p>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 16 }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 220 }}>
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
                    <div style={{ height: '100%', width: `${progresso.percentual}%`, background: 'linear-gradient(90deg, #4ade80, #22c55e)', borderRadius: 3, transition: 'width 0.6s ease' }}/>
                  </div>
                </div>
              )}

              {/* Main CTA */}
              <Link
                href={
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
            </div>
          </div>
        </div>
      </div>

      {/* ── Conteúdo principal ────────────────────────────────────────────────── */}
      <div style={{ padding: '28px 32px', maxWidth: 900 }}>

        {/* Fases */}
        {FASES.map(fase => (
          <div key={fase.id} style={{ marginBottom: 24 }}>

            {/* Fase header */}
            <button
              onClick={() => setFasesAbertas(prev => ({ ...prev, [fase.id]: !prev[fase.id] }))}
              style={{
                width: '100%', background: '#111827', border: '1px solid #1e3a5f',
                borderRadius: 10, padding: '14px 18px', cursor: 'pointer', color: '#e2e8f0',
                display: 'flex', alignItems: 'center', gap: 14, marginBottom: fasesAbertas[fase.id] ? 2 : 0,
              }}
            >
              <div style={{
                background: 'linear-gradient(135deg, #4ade8022, #22c55e22)',
                border: '1px solid #4ade8044',
                borderRadius: 8, padding: '4px 10px',
                fontSize: 11, fontWeight: 700, color: '#4ade80', letterSpacing: '0.08em',
              }}>
                FASE {fase.numero}
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{fase.titulo}</div>
                <div style={{ fontSize: 12, color: '#607d8b', marginTop: 2 }}>{fase.descricao}</div>
              </div>
              <span style={{ color: '#607d8b', fontSize: 18, transition: 'transform 0.2s', transform: fasesAbertas[fase.id] ? 'rotate(180deg)' : 'none' }}>⌄</span>
            </button>

            {/* Módulos */}
            {fasesAbertas[fase.id] && (
              <div style={{ border: '1px solid #1e3a5f', borderTop: 'none', borderRadius: '0 0 10px 10px', overflow: 'hidden' }}>
                {fase.modulos.map((modulo, mIdx) => (
                  <div key={modulo.id} style={{ borderTop: mIdx > 0 ? '1px solid #1e3a5f' : 'none' }}>

                    {/* Módulo header */}
                    <div style={{ padding: '12px 18px', background: '#0d1729', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 16 }}>{modulo.icone}</span>
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#cbd5e1' }}>{modulo.titulo}</span>
                        <span style={{ fontSize: 11, color: '#607d8b', marginLeft: 10 }}>{modulo.aulas.length} aulas</span>
                      </div>
                    </div>

                    {/* Aulas */}
                    {modulo.aulas.map(aula => {
                      const concluida = progresso.progressoMap[aula.slug]
                      const bloqueada = !user?.id && !aula.gratis

                      return (
                        <Link
                          key={aula.id}
                          href={
                            bloqueada
                              ? '#'
                              : `/biblioteca/trade-master-pro/${modulo.slug}/${aula.slug}`
                          }
                          style={{
                            display: 'flex', alignItems: 'center', gap: 14,
                            padding: '12px 18px 12px 28px',
                            background: '#0a0f1a',
                            borderTop: '1px solid #111827',
                            textDecoration: 'none',
                            transition: 'background 0.15s',
                            cursor: bloqueada ? 'default' : 'pointer',
                          }}
                          onMouseEnter={e => { if (!bloqueada) e.currentTarget.style.background = '#111827' }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#0a0f1a' }}
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
                          <div style={{ flex: 1 }}>
                            <span style={{ fontSize: 13, color: bloqueada ? '#607d8b' : '#cbd5e1', fontWeight: 500 }}>
                              {aula.titulo}
                            </span>
                            {aula.gratis && !concluida && (
                              <span style={{
                                marginLeft: 8, fontSize: 10, padding: '1px 6px', borderRadius: 4,
                                background: '#4ade8022', color: '#4ade80', border: '1px solid #4ade8044', fontWeight: 600,
                              }}>GRÁTIS</span>
                            )}
                          </div>

                          {/* Duration */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#607d8b', fontSize: 11 }}>
                            <IconClock />
                            {aula.duracao}
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
