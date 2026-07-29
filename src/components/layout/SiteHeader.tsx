// src/components/layout/SiteHeader.tsx

import Link from 'next/link'
import { auth, signIn, signOut } from '@/auth'

export async function SiteHeader() {
  const session = await auth()
  const isStaff = !!session?.user?.staffRole

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy font-display text-sm font-bold text-cream">
            N
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-navy">
            Nossa Senhora Aparecida
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {isStaff && (
            <Link
              href="/admin"
              className="font-body text-xs font-semibold uppercase tracking-wide text-navy/50 transition-colors hover:text-gold"
            >
              Painel
            </Link>
          )}

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
                className="border border-navy px-3 py-1 font-body text-xs font-semibold uppercase tracking-wide text-navy transition-colors hover:bg-navy hover:text-cream"
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