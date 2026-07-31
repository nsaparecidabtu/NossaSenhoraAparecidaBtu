// src/components/layout/SiteHeader.tsx

import Link from 'next/link'
import { auth, signIn, signOut } from '@/auth'

const NAV_LINKS = [
  { label: 'Início', href: '/' },
  { label: 'A Paróquia', href: '/a-paroquia' },
  { label: 'Missas', href: '/#horarios' },
  { label: 'Eventos', href: '/#eventos' },
  { label: 'Galeria', href: '/#galeria' },
  { label: 'Contato', href: '/#contato' },
]

export async function SiteHeader() {
  const session = await auth()
  const isStaff = !!session?.user?.staffRole

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <img src="/favicon.svg" alt="Nossa Senhora Aparecida" className="h-8 w-8" />
          <span className="font-display text-sm font-bold leading-tight tracking-tight text-navy sm:text-lg">
            Nossa Senhora Aparecida
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-sm font-semibold text-navy/70 transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          {isStaff && (
            <Link
              href="/admin"
              className="hidden font-body text-xs font-semibold uppercase tracking-wide text-navy/50 transition-colors hover:text-gold sm:inline"
            >
              Painel
            </Link>
          )}

          <Link
            href="/#doacao"
            className="rounded-full bg-gold px-4 py-2 font-body text-xs font-semibold uppercase tracking-wide text-navy transition-opacity hover:opacity-90"
          >
            Doar
          </Link>

          {session?.user ? (
            <form
              action={async () => {
                'use server'
                await signOut()
              }}
              className="flex items-center gap-2"
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
                className="font-body text-xs font-semibold uppercase tracking-wide text-navy/50 transition-colors hover:text-gold"
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
                className="border border-navy px-3 py-1.5 font-body text-xs font-semibold uppercase tracking-wide text-navy transition-colors hover:bg-navy hover:text-cream"
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