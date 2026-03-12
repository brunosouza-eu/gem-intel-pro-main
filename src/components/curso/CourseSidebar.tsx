'use client'
// ─────────────────────────────────────────────────────────────────────────────
// CourseSidebar — navegação lateral (desktop) ou drawer overlay (mobile)
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FASES } from '@/lib/curso-data'

const IconCheck = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M20 6L9 17l-5-5" />
  </svg>
)
const IconPlay = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
)
const IconLock = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
)
const IconX = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
)

interface Props {
  moduloAtualSlug: string
  aulaAtualSlug: string
  progresso: Record<string, boolean>
  hasAccess: boolean
  isMobile?: boolean
  isOpen?: boolean
  onClose?: () => void
}

export default function CourseSidebar({ moduloAtualSlug, aulaAtualSlug, progresso, hasAccess, isMobile, isOpen, onClose }: Props) {
  const totalAulas = FASES.flatMap(f => f.modulos.flatMap(m => m.aulas)).length
  const concluidas = Object.values(progresso).filter(Boolean).length
  const pct = Math.round((concluidas / totalAulas) * 100)

  // Lock scroll when mobile drawer is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [isMobile, isOpen])

  // Mobile: don't render if closed
  if (isMobile && !isOpen) return null

  const sidebarContent = (
    <>
      {/* Header */}
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #1e3a5f', position: 'sticky', top: 0, background: '#0d1117', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <Link to="/biblioteca/trade-master-pro" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
            onClick={() => isMobile && onClose?.()}>
            <span style={{ fontSize: 10, color: '#607d8b' }}>←</span>
            <span style={{ fontSize: 11, color: '#607d8b' }}>Curso Trade Master</span>
          </Link>
          {isMobile && (
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#607d8b', cursor: 'pointer', padding: 4 }}>
              <IconX />
            </button>
          )}
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 6 }}>
          <span style={{ color: '#607d8b' }}>Progresso</span>
          <span style={{ color: '#4ade80', fontFamily: 'monospace', fontWeight: 700 }}>{pct}%</span>
        </div>
        <div style={{ height: 4, background: '#1e3a5f', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #4ade80, #22c55e)', borderRadius: 2, transition: 'width 0.4s ease' }} />
        </div>
        <div style={{ fontSize: 10, color: '#607d8b', marginTop: 5 }}>{concluidas} de {totalAulas} aulas concluídas</div>
      </div>

      {/* Fases e módulos */}
      <div style={{ flex: 1 }}>
        {FASES.map(fase => (
          <div key={fase.id}>
            <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ height: 1, flex: 1, background: '#1e3a5f' }} />
              <span style={{ fontSize: 10, color: '#4ade80', fontWeight: 700, letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
                FASE {fase.numero}
              </span>
              <div style={{ height: 1, flex: 1, background: '#1e3a5f' }} />
            </div>

            {fase.modulos.map(modulo => (
              <div key={modulo.id}>
                <div style={{ padding: '8px 16px 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13 }}>{modulo.icone}</span>
                  <span style={{ fontSize: 11, color: '#607d8b', fontWeight: 600 }}>{modulo.titulo}</span>
                </div>

                {modulo.aulas.map(aula => {
                  const ativa = modulo.slug === moduloAtualSlug && aula.slug === aulaAtualSlug
                  const concluida = progresso[aula.slug]
                  const bloqueada = !hasAccess && !aula.gratis

                  return (
                    <Link
                      key={aula.id}
                      to={bloqueada ? '#' : `/biblioteca/trade-master-pro/${modulo.slug}/${aula.slug}`}
                      onClick={() => isMobile && onClose?.()}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                        padding: '10px 16px 10px 24px',
                        background: ativa ? '#1a2840' : 'transparent',
                        borderLeft: ativa ? '3px solid #4ade80' : '3px solid transparent',
                        textDecoration: 'none',
                        transition: 'background 0.15s',
                        cursor: bloqueada ? 'default' : 'pointer',
                      }}
                      onMouseEnter={e => { if (!ativa && !bloqueada) e.currentTarget.style.background = '#111827' }}
                      onMouseLeave={e => { if (!ativa) e.currentTarget.style.background = 'transparent' }}
                    >
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: concluida ? '#22c55e22' : ativa ? '#3d8fef22' : '#1e3a5f33',
                        border: `1px solid ${concluida ? '#22c55e66' : ativa ? '#3d8fef66' : '#1e3a5f'}`,
                        color: concluida ? '#4ade80' : ativa ? '#3d8fef' : '#607d8b',
                      }}>
                        {concluida ? <IconCheck /> : bloqueada ? <IconLock /> : <IconPlay />}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: 13, lineHeight: 1.4,
                          color: ativa ? '#fff' : concluida ? '#94a3b8' : bloqueada ? '#475569' : '#cbd5e1',
                          fontWeight: ativa ? 600 : 400,
                        }}>
                          {aula.titulo}
                        </div>
                        <div style={{ fontSize: 11, color: '#607d8b', marginTop: 2 }}>{aula.duracao}</div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )

  // ── Mobile: overlay drawer ──
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)', zIndex: 90,
            animation: 'fadeIn 0.2s ease',
          }}
        />
        {/* Drawer */}
        <aside style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 'min(85vw, 340px)', background: '#0d1117',
          borderLeft: '1px solid #1e3a5f', zIndex: 91,
          display: 'flex', flexDirection: 'column',
          overflowY: 'auto',
          scrollbarWidth: 'thin', scrollbarColor: '#1e3a5f transparent',
          animation: 'slideInRight 0.25s ease',
        }}>
          {sidebarContent}
        </aside>
        <style>{`
          @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
          @keyframes slideInRight { from { transform: translateX(100%) } to { transform: translateX(0) } }
        `}</style>
      </>
    )
  }

  // ── Desktop: fixed sidebar ──
  return (
    <aside className="curso-sidebar-desktop" style={{
      width: 280, flexShrink: 0, height: '100%', overflowY: 'auto',
      background: '#0d1117', borderLeft: '1px solid #1e3a5f',
      display: 'flex', flexDirection: 'column',
      scrollbarWidth: 'thin', scrollbarColor: '#1e3a5f transparent',
    }}>
      {sidebarContent}
    </aside>
  )
}
