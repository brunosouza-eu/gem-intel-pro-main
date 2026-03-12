'use client'
// ─────────────────────────────────────────────────────────────────────────────
// CourseSidebar — navegação lateral dentro do player de aulas
// ─────────────────────────────────────────────────────────────────────────────
import Link from 'next/link'
import { FASES } from '@/lib/curso-data'

const IconCheck = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
)
const IconPlay = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>
)
const IconLock = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
)

interface Props {
  moduloAtualSlug: string
  aulaAtualSlug: string
  progresso: Record<string, boolean>
  hasAccess: boolean
}

export default function CourseSidebar({ moduloAtualSlug, aulaAtualSlug, progresso, hasAccess }: Props) {
  const totalAulas = FASES.flatMap(f => f.modulos.flatMap(m => m.aulas)).length
  const concluidas = Object.values(progresso).filter(Boolean).length
  const pct = Math.round((concluidas / totalAulas) * 100)

  return (
    <aside style={{
      width: 280, flexShrink: 0, height: '100vh', overflowY: 'auto',
      background: '#0d1117', borderLeft: '1px solid #1e3a5f',
      display: 'flex', flexDirection: 'column',
      scrollbarWidth: 'thin', scrollbarColor: '#1e3a5f transparent',
    }}>

      {/* Header */}
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #1e3a5f', position: 'sticky', top: 0, background: '#0d1117', zIndex: 10 }}>
        <Link href="/biblioteca/trade-master-pro" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 12 }}>
          <span style={{ fontSize: 10, color: '#607d8b' }}>←</span>
          <span style={{ fontSize: 11, color: '#607d8b' }}>Conteúdo do curso</span>
        </Link>

        {/* Progress */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 6 }}>
          <span style={{ color: '#607d8b' }}>Progresso</span>
          <span style={{ color: '#4ade80', fontFamily: 'monospace', fontWeight: 700 }}>{pct}%</span>
        </div>
        <div style={{ height: 4, background: '#1e3a5f', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #4ade80, #22c55e)', borderRadius: 2, transition: 'width 0.4s ease' }}/>
        </div>
        <div style={{ fontSize: 10, color: '#607d8b', marginTop: 5 }}>{concluidas} de {totalAulas} aulas concluídas</div>
      </div>

      {/* Fases e módulos */}
      <div style={{ flex: 1 }}>
        {FASES.map(fase => (
          <div key={fase.id}>
            {/* Fase label */}
            <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ height: 1, flex: 1, background: '#1e3a5f' }}/>
              <span style={{ fontSize: 10, color: '#4ade80', fontWeight: 700, letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
                FASE {fase.numero}
              </span>
              <div style={{ height: 1, flex: 1, background: '#1e3a5f' }}/>
            </div>

            {/* Módulos */}
            {fase.modulos.map(modulo => (
              <div key={modulo.id}>
                {/* Módulo label */}
                <div style={{ padding: '8px 16px 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13 }}>{modulo.icone}</span>
                  <span style={{ fontSize: 11, color: '#607d8b', fontWeight: 600 }}>{modulo.titulo}</span>
                </div>

                {/* Aulas */}
                {modulo.aulas.map(aula => {
                  const ativa = modulo.slug === moduloAtualSlug && aula.slug === aulaAtualSlug
                  const concluida = progresso[aula.slug]
                  const bloqueada = !hasAccess && !aula.gratis

                  return (
                    <Link
                      key={aula.id}
                      href={bloqueada ? '#' : `/biblioteca/trade-master-pro/${modulo.slug}/${aula.slug}`}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                        padding: '8px 16px 8px 24px',
                        background: ativa ? '#1a2840' : 'transparent',
                        borderLeft: ativa ? '3px solid #4ade80' : '3px solid transparent',
                        textDecoration: 'none',
                        transition: 'background 0.15s',
                        cursor: bloqueada ? 'default' : 'pointer',
                      }}
                      onMouseEnter={e => { if (!ativa && !bloqueada) e.currentTarget.style.background = '#111827' }}
                      onMouseLeave={e => { if (!ativa) e.currentTarget.style.background = 'transparent' }}
                    >
                      {/* Status dot */}
                      <div style={{
                        width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: concluida ? '#22c55e22' : ativa ? '#3d8fef22' : '#1e3a5f33',
                        border: `1px solid ${concluida ? '#22c55e66' : ativa ? '#3d8fef66' : '#1e3a5f'}`,
                        color: concluida ? '#4ade80' : ativa ? '#3d8fef' : '#607d8b',
                      }}>
                        {concluida ? <IconCheck /> : bloqueada ? <IconLock /> : <IconPlay />}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: 12, lineHeight: 1.4,
                          color: ativa ? '#fff' : concluida ? '#94a3b8' : bloqueada ? '#475569' : '#cbd5e1',
                          fontWeight: ativa ? 600 : 400,
                        }}>
                          {aula.titulo}
                        </div>
                        <div style={{ fontSize: 10, color: '#607d8b', marginTop: 2 }}>{aula.duracao}</div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </aside>
  )
}
