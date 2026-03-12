// ─────────────────────────────────────────────────────────────────────────────
// Progresso do curso — Supabase helpers
// ─────────────────────────────────────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js'
import { CURSO_SLUG, getAllAulas } from './curso-data'

// Usa o client já existente no projeto (ajuste o import conforme seu projeto)
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

// ── Verificar acesso ───────────────────────────────────────────────────────────

export async function usuarioTemAcesso(userId: string, cursoSlug = CURSO_SLUG, isAdmin = false, userPlan?: string): Promise<boolean> {
  if (isAdmin) return true;

  // Pro and Elite plans include the course
  if (userPlan === 'pro' || userPlan === 'elite') return true;

  // Free plan: check for individual purchase (R$9,90)
  const { data } = await supabase
    .from('curso_compras')
    .select('id')
    .eq('user_id', userId)
    .eq('curso_slug', cursoSlug)
    .eq('status', 'ativo')
    .single()
  return !!data
}

// ── Progresso por aula ─────────────────────────────────────────────────────────

export async function getProgressoAula(
  userId: string,
  moduloSlug: string,
  aulaSlug: string,
  cursoSlug = CURSO_SLUG
) {
  const { data } = await supabase
    .from('progresso_aulas')
    .select('*')
    .eq('user_id', userId)
    .eq('curso_slug', cursoSlug)
    .eq('modulo_slug', moduloSlug)
    .eq('aula_slug', aulaSlug)
    .single()
  return data
}

export async function upsertProgressoAula({
  userId,
  moduloSlug,
  aulaSlug,
  percentual,
  concluida,
  tempoAssistido,
  cursoSlug = CURSO_SLUG,
}: {
  userId: string
  moduloSlug: string
  aulaSlug: string
  percentual: number
  concluida: boolean
  tempoAssistido: number
  cursoSlug?: string
}) {
  const { error } = await supabase.from('progresso_aulas').upsert(
    {
      user_id: userId,
      curso_slug: cursoSlug,
      modulo_slug: moduloSlug,
      aula_slug: aulaSlug,
      percentual,
      concluida,
      tempo_assistido: tempoAssistido,
      ultima_vez: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,curso_slug,modulo_slug,aula_slug' }
  )
  return !error
}

// ── Progresso geral do curso ───────────────────────────────────────────────────

export async function getProgressoCurso(userId: string, cursoSlug = CURSO_SLUG, isAdmin = false) {
  const { data } = await supabase
    .from('progresso_aulas')
    .select('aula_slug, modulo_slug, concluida, ultima_vez')
    .eq('user_id', userId)
    .eq('curso_slug', cursoSlug)
    .order('ultima_vez', { ascending: false })

  const totalAulas = getAllAulas().length
  const concluidas = data?.filter(r => r.concluida).length ?? 0
  const percentual = Math.round((concluidas / totalAulas) * 100)

  const ultimaAula = data?.[0]
    ? { moduloSlug: data[0].modulo_slug, aulaSlug: data[0].aula_slug }
    : null

  // Map aulaSlug → concluida para o sidebar
  const progressoMap: Record<string, boolean> = {}
  data?.forEach(r => {
    progressoMap[r.aula_slug] = r.concluida
  })

  return { concluidas, totalAulas, percentual, ultimaAula, progressoMap }
}

// ── Webhook Hotmart — registrar compra ────────────────────────────────────────
// Chamar isso no route handler /api/webhooks/hotmart

export async function registrarCompraHotmart({
  userId,
  email,
  transactionId,
  valor,
  cursoSlug = CURSO_SLUG,
}: {
  userId?: string
  email: string
  transactionId: string
  valor: number
  cursoSlug?: string
}) {
  // 1. Buscar userId pelo email se não fornecido
  let uid = userId
  if (!uid) {
    const { data: user } = await supabase
      .from('profiles')             // ajuste para sua tabela de users
      .select('id')
      .eq('email', email)
      .single()
    uid = user?.id
  }

  if (!uid) return { ok: false, error: 'Usuário não encontrado' }

  // 2. Inserir compra
  const { error } = await supabase.from('curso_compras').insert({
    user_id: uid,
    curso_slug: cursoSlug,
    valor,
    metodo: 'hotmart',
    hotmart_transaction: transactionId,
    status: 'ativo',
    created_at: new Date().toISOString(),
  })

  return { ok: !error, error: error?.message }
}
