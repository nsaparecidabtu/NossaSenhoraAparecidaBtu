// src/components/layout/SiteHeader.tsx
import Link from 'next/link'
import { auth, signIn, signOut } from '@/auth'
import { Radio } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Início', href: '/' },
  { label: 'A Paróquia', href: '/a-paroquia' },
  { label: 'Missas', href: '/#horarios' },
  { label: 'Eventos', href: '/#eventos' },
  { label: 'Galeria', href: '/#galeria' },
  { label: 'Contato', href: '/#contato' },
  { label: 'AO VIVO', href: '/ao-vivo' },
]

export async function SiteHeader() {
  let session = null
  
  try {
    session = await auth()
  } catch (e) {
    console.error("Erro ao recuperar sessão no Header:", e)
    // Se o token estiver corrompido, a sessão permanece null e o site renderiza como visitante
  }
  // Verifica se o usuário tem cargo de staff ou permissões ativas
  const isStaff = !!session?.user?.staffRole || (session?.user?.permissions?.length ?? 0) > 0

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-3 py-3 sm:px-6">
        
        {/* Logo / Título */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <img src="/favicon.svg" alt="Nossa Senhora Aparecida" className="h-7 w-7 sm:h-8 sm:w-8" />
          <span className="font-display text-xs font-bold leading-tight tracking-tight text-navy sm:text-lg">
            Nossa Senhora Aparecida
          </span>
        </Link>

        {/* Navegação Desktop */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-sm font-semibold text-navy/75 transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Ações à Direita (Mobile First & Responsivo) */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          
          {/* Botão Painel visível em Mobile e Desktop se for Staff */}
          {isStaff && (
            <Link
              href="/admin"
              className="rounded border border-navy/30 bg-navy/5 px-2.5 py-1.5 font-body text-[11px] font-bold uppercase tracking-wide text-navy transition-colors hover:bg-navy hover:text-cream sm:text-xs"
            >
              Painel
            </Link>
          )}

          <Link
            href="/#doacao"
            className="rounded-full bg-gold px-3 py-1.5 font-body text-[11px] font-semibold uppercase tracking-wide text-navy transition-opacity hover:opacity-90 sm:px-4 sm:py-2 sm:text-xs"
          >
            Doar
          </Link>

          {session?.user ? (
            <form
              action={async () => {
                'use server'
                await signOut()
              }}
              className="flex items-center gap-1.5 sm:gap-2"
            >
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name ?? 'Você'}
                  className="h-6 w-6 rounded-full border border-line"
                />
              )}
              <button
                type="submit"
                className="font-body text-[11px] font-semibold uppercase tracking-wide text-navy/50 transition-colors hover:text-gold sm:text-xs"
              >
                Sair
              </button>
            </form>
          ) : (
            <form
              action={async () => {
                'use server'
                await signIn('google')
              }}
            >
              <button
                type="submit"
                className="border border-navy px-2.5 py-1.5 font-body text-[11px] font-semibold uppercase tracking-wide text-navy transition-colors hover:bg-navy hover:text-cream sm:text-xs"
              >
                Entrar
              </button>
            </form>
          )}
        </div>
      </div>
    </header>
  )
}