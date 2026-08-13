// src/proxy.ts
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

// O Auth.js injeta automaticamente o objeto 'req.auth' se a sessão for válida
export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnAdminPanel = req.nextUrl.pathname.startsWith('/admin')

  // Se tentar acessar QUALQUER ROTA dentro de /admin e não estiver logado, redireciona para a Home
  if (isOnAdminPanel && !isLoggedIn) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }

  // Se a requisição for válida, permite que siga normalmente
  return NextResponse.next()
})

// O Matcher define EM QUAIS ROTAS o proxy deve ser executado.
// Evitamos rodar o proxy em rotas estáticas, imagens e chamadas internas do Next.js.
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)'],
}