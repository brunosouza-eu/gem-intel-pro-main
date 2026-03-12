'use client'
// ─────────────────────────────────────────────────────────────────────────────
// /biblioteca/trade-master-pro/[modulo]/[aula]  —  Player de aula
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getAulaBySlug, getProximaAula, getAulaAnterior, CURSO_SLUG } from '@/lib/curso-data'
import { getProgressoCurso, usuarioTemAcesso } from '@/lib/curso-progress'
import { useUser } from '@/hooks/useUser'
import CoursePlayer from '@/components/curso/CoursePlayer'
import CourseSidebar from '@/components/curso/CourseSidebar'

interface PageProps {
  params: Promise<{ modulo: string; aula: string }>
}

const IconArrow = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    {dir === 'left' ? <path d="M19 12H5M12 5l-7 7 7 7"/> : <path d="M5 12h14M12 5l7 7-7 7"/>}
  </svg>
)

export default function AulaPage({ params }: PageProps) {
  const { modulo: moduloSlug, aula: aulaSlug } = use(params)
  const { user, loading: userLoading } = useUser()
  const router = useRouter()

  const resultado = getAulaBySlug(moduloSlug, aulaSlug)
  const proximaAula = getProximaAula(moduloSlug, aulaSlug)
  const aulaAnterior = getAulaAnterior(moduloSlug, aulaSlug)

  const [hasAccess, setHasAccess] = useState(false)
  const [progresso, setProgresso] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [abaAtiva, setAbaAtiva] = useState<'material' | 'notas'>('material')

  useEffect(() => {
    if (userLoading) return
    if (!resultado) { router.push('/biblioteca/trade-master-pro'); return }

    async function init() {
      if (user?.id) {
        const [acesso, prog] = await Promise.all([
          usuarioTemAcesso(user.id),
          getProgressoCurso(user.id),
        ])
        setHasAccess(acesso)
        setProgresso(prog.progressoMap)
      } else {
        // Usuário não logado — só aulas grátis
        setHasAccess(false)
      }
      setLoading(false)
    }
    init()
  }, [user, userLoading, resultado, router])

  // Bloquear acesso se não tem permissão e aula não é grátis
  useEffect(() => {
    if (!loading && resultado && !hasAccess && !resultado.aula.gratis) {
      router.push('/biblioteca/trade-master-pro?upgrade=true')
    }
  }, [loading, hasAccess, resultado, router])

  const handleConcluir = async () => {
    if (!resultado) return
    setProgresso(prev => ({ ...prev, [resultado.aula.slug]: true }))
    // Auto-avançar após 2s
    if (proximaAula) {
      setTimeout(() => {
        router.push(`/biblioteca/trade-master-pro/${proximaAula.moduloSlug}/${proximaAula.slug}`)
      }, 2000)
    }
  }

  if (loading || !resultado) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#607d8b', fontSize: 14 }}>Carregando...</div>
      </div>
    )
  }

  const { aula, modulo, fase } = resultado

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0a0f1a', overflow: 'hidden' }}>

      {/* ── Main content (left) ─────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top breadcrumb */}
        <div style={{
          padding: '10px 24px', background: '#0d1117', borderBottom: '1px solid #1e3a5f',
          display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#607d8b', flexShrink: 0,
        }}>
          <Link href="/biblioteca/trade-master-pro" style={{ color: '#607d8b', textDecoration: 'none' }}>TMP</Link>
          <span>›</span>
          <span>Fase {fase.numero}</span>
          <span>›</span>
          <span>{modulo.titulo}</span>
          <span>›</span>
          <span style={{ color: '#cbd5e1' }}>{aula.titulo}</span>
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

        {/* ── Tabs: Material / Notas ──────────────────────────────────────── */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

          {/* Tab headers */}
          <div style={{ display: 'flex', borderBottom: '1px solid #1e3a5f', background: '#0d1117', flexShrink: 0 }}>
            {(['material', 'notas'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setAbaAtiva(tab)}
                style={{
                  padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13,
                  color: abaAtiva === tab ? '#4ade80' : '#607d8b',
                  borderBottom: abaAtiva === tab ? '2px solid #4ade80' : '2px solid transparent',
                  fontWeight: abaAtiva === tab ? 600 : 400,
                  transition: 'all 0.15s',
                  textTransform: 'capitalize',
                }}
              >
                {tab === 'material' ? '📄 Material de Apoio' : '📝 Minhas Notas'}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', scrollbarWidth: 'thin', scrollbarColor: '#1e3a5f transparent' }}>
            {abaAtiva === 'material' ? (
              <div>
                <p style={{ color: '#607d8b', fontSize: 13, marginTop: 0 }}>
                  {aula.descricao}
                </p>
                {/* O HTML do material de apoio da aula (Trade Master Pro) pode ser carregado aqui */}
                {/* via um fetch ao /public/curso/material/{aulaSlug}.html ou incorporado como componente */}
                <div style={{ padding: '20px', background: '#0d1729', borderRadius: 10, border: '1px solid #1e3a5f', color: '#94a3b8', fontSize: 13 }}>
                  Material de apoio completo disponível no PDF do curso.
                  {/* TODO: integrar o HTML gerado (TradeMasterPro_MembersArea.html) por aula aqui */}
                </div>
              </div>
            ) : (
              <NotasAula aulaSlug={aula.slug} userId={user?.id} />
            )}
          </div>
        </div>

        {/* ── Navigation prev/next ────────────────────────────────────────── */}
        <div style={{
          padding: '12px 24px', background: '#0d1117', borderTop: '1px solid #1e3a5f',
          display: 'flex', justifyContent: 'space-between', gap: 12, flexShrink: 0,
        }}>
          {aulaAnterior ? (
            <Link
              href={`/biblioteca/trade-master-pro/${aulaAnterior.moduloSlug}/${aulaAnterior.slug}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 16px', borderRadius: 8, border: '1px solid #1e3a5f',
                color: '#607d8b', fontSize: 12, textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#3d8fef'; e.currentTarget.style.color = '#3d8fef' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e3a5f'; e.currentTarget.style.color = '#607d8b' }}
            >
              <IconArrow dir="left" />
              Aula anterior
            </Link>
          ) : <div />}

          {proximaAula && (
            <Link
              href={`/biblioteca/trade-master-pro/${proximaAula.moduloSlug}/${proximaAula.slug}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 20px', borderRadius: 8,
                background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                color: '#0a0f1a', fontSize: 12, fontWeight: 700, textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Próxima aula
              <IconArrow dir="right" />
            </Link>
          )}
        </div>
      </div>

      {/* ── Sidebar (right) ─────────────────────────────────────────────────── */}
      <CourseSidebar
        moduloAtualSlug={moduloSlug}
        aulaAtualSlug={aulaSlug}
        progresso={progresso}
        hasAccess={hasAccess}
      />
    </div>
  )
}

// ── Notas por aula (localStorage como fallback, Supabase em breve) ─────────────
function NotasAula({ aulaSlug, userId }: { aulaSlug: string; userId?: string }) {
  const key = `nota_${userId ?? 'guest'}_${aulaSlug}`
  const [nota, setNota] = useState('')
  const [salvo, setSalvo] = useState(false)

  useEffect(() => {
    setNota(localStorage.getItem(key) ?? '')
  }, [key])

  const salvar = () => {
    localStorage.setItem(key, nota)
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2000)
  }

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
  )
}
