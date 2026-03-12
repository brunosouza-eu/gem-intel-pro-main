// ─────────────────────────────────────────────────────────────────────────────
// Types — Trade Master Pro Course Module
// ─────────────────────────────────────────────────────────────────────────────

export interface CursoUser {
  id: string
  email: string
  nome: string
  plano: UserPlano
  cursos: string[]          // slugs dos cursos comprados
  createdAt: string
}

export type UserPlano = 'free' | 'pro' | 'vip'

export interface ProgressoAula {
  userId: string
  cursoSlug: string
  moduloSlug: string
  aulaSlug: string
  concluida: boolean
  percentual: number         // 0-100 (baseado no tempo assistido)
  ultimaVez: string          // ISO date
  tempoAssistido: number     // segundos
}

export interface ProgressoCurso {
  userId: string
  cursoSlug: string
  aulasConcluidas: number
  totalAulas: number
  percentual: number
  ultimaAula: {
    moduloSlug: string
    aulaSlug: string
  } | null
  iniciouEm: string
  ultimaAtividade: string
}

// ── Supabase DB row types ──────────────────────────────────────────────────────

export interface DBProgressoAula {
  id: string
  user_id: string
  curso_slug: string
  modulo_slug: string
  aula_slug: string
  concluida: boolean
  percentual: number
  tempo_assistido: number
  ultima_vez: string
  created_at: string
  updated_at: string
}

export interface DBCursoCompra {
  id: string
  user_id: string
  curso_slug: string
  valor: number
  metodo: 'hotmart' | 'kiwify' | 'stripe' | 'manual'
  hotmart_transaction?: string
  status: 'ativo' | 'cancelado' | 'reembolsado'
  created_at: string
}

// ── Component props ────────────────────────────────────────────────────────────

export interface CoursePlayerProps {
  videoId: string | null
  aulaId: string
  titulo: string
  onProgresso: (percentual: number) => void
  onConcluir: () => void
}

export interface CourseSidebarProps {
  moduloAtualSlug: string
  aulaAtualSlug: string
  progresso: Record<string, boolean>  // aulaSlug → concluida
}
