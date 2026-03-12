// ─────────────────────────────────────────────────────────────────────────────
// middleware.ts  —  Proteção de rotas do curso
// Adicione este bloco no seu middleware.ts existente
// ─────────────────────────────────────────────────────────────────────────────
// Se você já tem um middleware, MESCLE este código com o existente.
// Não substitua — adicione o bloco CURSO abaixo.

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Sessão do usuário
  const { data: { session } } = await supabase.auth.getSession()
  const { pathname } = req.nextUrl

  // ── BLOCO CURSO ──────────────────────────────────────────────────────────────
  // Protege todas as rotas do curso exceto a página de overview (que tem preview público)
  const isCursoRoute = pathname.startsWith('/biblioteca/trade-master-pro/')

  if (isCursoRoute) {
    // 1. Sem login → redireciona para login
    if (!session) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('redirect', pathname)
      loginUrl.searchParams.set('reason', 'course_access')
      return NextResponse.redirect(loginUrl)
    }

    // 2. Verificar se tem acesso ao curso no DB
    // (Para não fazer query em toda requisição, usamos um cookie de cache)
    const cursoCookie = req.cookies.get('curso_tmp_access')

    if (!cursoCookie) {
      const { data: compra } = await supabase
        .from('curso_compras')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('curso_slug', 'trade-master-pro')
        .eq('status', 'ativo')
        .single()

      if (!compra) {
        // Sem acesso → vai para a overview com flag de upgrade
        const overviewUrl = new URL('/biblioteca/trade-master-pro', req.url)
        overviewUrl.searchParams.set('upgrade', 'true')
        return NextResponse.redirect(overviewUrl)
      }

      // Cachear acesso em cookie por 24h para não bater no DB em cada req
      res.cookies.set('curso_tmp_access', '1', {
        maxAge: 60 * 60 * 24,
        httpOnly: true,
        sameSite: 'strict',
      })
    }
  }
  // ── FIM BLOCO CURSO ──────────────────────────────────────────────────────────

  return res
}

export const config = {
  matcher: [
    // Inclui as rotas do curso — ajuste o matcher existente para incluir este padrão
    '/biblioteca/trade-master-pro/:path*',
    // ...adicione aqui os outros matchers que você já tem
  ],
}
