'use client'
// ─────────────────────────────────────────────────────────────────────────────
// CoursePlayer — Player com Panda Video + material de apoio + progresso
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef, useState, useCallback } from 'react'
import { upsertProgressoAula } from '@/lib/curso-progress'
import { useUser } from '@/hooks/useUser'

interface Props {
  videoId: string | null
  aulaSlug: string
  moduloSlug: string
  titulo: string
  duracao: string
  onConcluir: () => void
}

// ── Panda Video embed URL ──────────────────────────────────────────────────────
// Substitua 'SEU_PLAYER_ID' pelo ID do player criado no painel do Panda Video
const PANDA_PLAYER_BASE = 'https://player-vz-XXXX.tv.pandavideo.com.br/embed/'

export default function CoursePlayer({ videoId, aulaSlug, moduloSlug, titulo, duracao, onConcluir }: Props) {
  const { user } = useUser()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [marcandoConcluida, setMarcandoConcluida] = useState(false)
  const [concluida, setConcluida] = useState(false)
  const progressRef = useRef(0)
  const saveTimerRef = useRef<NodeJS.Timeout>()

  // Salva progresso no Supabase a cada 15s enquanto assiste
  const salvarProgresso = useCallback(async (pct: number, concl: boolean) => {
    if (!user?.id) return
    await upsertProgressoAula({
      userId: user.id,
      moduloSlug,
      aulaSlug,
      percentual: pct,
      concluida: concl,
      tempoAssistido: Math.round(pct * 0.01 * parseInt(duracao) * 60),
    })
  }, [user?.id, moduloSlug, aulaSlug, duracao])

  // Recebe eventos do iframe Panda Video via postMessage
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== 'object') return
      const { event, currentTime, duration } = e.data

      if (event === 'timeupdate' && duration > 0) {
        const pct = Math.min(100, Math.round((currentTime / duration) * 100))
        progressRef.current = pct

        // Auto-marcar como concluída ao atingir 85%
        if (pct >= 85 && !concluida) {
          setConcluida(true)
          salvarProgresso(pct, true).then(() => onConcluir())
        }
      }

      if (event === 'ended' && !concluida) {
        setConcluida(true)
        salvarProgresso(100, true).then(() => onConcluir())
      }
    }

    window.addEventListener('message', handler)

    // Auto-save a cada 15s
    saveTimerRef.current = setInterval(() => {
      if (progressRef.current > 0) {
        salvarProgresso(progressRef.current, concluida)
      }
    }, 15_000)

    return () => {
      window.removeEventListener('message', handler)
      if (saveTimerRef.current) clearInterval(saveTimerRef.current)
    }
  }, [concluida, salvarProgresso, onConcluir])

  const marcarManualmente = async () => {
    setMarcandoConcluida(true)
    await salvarProgresso(100, true)
    setConcluida(true)
    setMarcandoConcluida(false)
    onConcluir()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ── Video area ─────────────────────────────────────────────────────── */}
      <div style={{ background: '#000', position: 'relative', width: '100%', aspectRatio: '16/9' }}>
        {videoId ? (
          <iframe
            ref={iframeRef}
            src={`${PANDA_PLAYER_BASE}?v=${videoId}`}
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            title={titulo}
          />
        ) : (
          // Placeholder quando vídeo ainda não foi adicionado
          <div style={{
            width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 16,
            background: 'linear-gradient(135deg, #0d1729, #0a0f1a)',
          }}>
            <div style={{ fontSize: 48, opacity: 0.3 }}>🎬</div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#607d8b', fontSize: 15, margin: 0 }}>Vídeo em produção</p>
              <p style={{ color: '#475569', fontSize: 12, marginTop: 6 }}>
                Use o material de apoio abaixo enquanto isso
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Controls bar ──────────────────────────────────────────────────── */}
      <div style={{
        background: '#0d1117', borderBottom: '1px solid #1e3a5f',
        padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#fff' }}>{titulo}</h2>
          <div style={{ fontSize: 11, color: '#607d8b', marginTop: 3 }}>
            {duracao} de conteúdo
            {concluida && <span style={{ marginLeft: 10, color: '#4ade80', fontWeight: 600 }}>✓ Concluída</span>}
          </div>
        </div>

        {!concluida && (
          <button
            onClick={marcarManualmente}
            disabled={marcandoConcluida}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 16px', borderRadius: 8, cursor: 'pointer',
              background: 'transparent', border: '1px solid #1e3a5f',
              color: '#607d8b', fontSize: 12, fontWeight: 500,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#4ade80'; e.currentTarget.style.color = '#4ade80' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e3a5f'; e.currentTarget.style.color = '#607d8b' }}
          >
            {marcandoConcluida ? '...' : '✓ Marcar como concluída'}
          </button>
        )}
      </div>
    </div>
  )
}
