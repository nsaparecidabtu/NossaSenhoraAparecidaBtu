// src/app/admin/page.tsx

import Link from 'next/link'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

const MENU = [
  { label: 'Horários de Missa', href: '/admin/horarios', ready: true },
  { label: 'Próximos Eventos', href: '/admin/eventos', ready: true },
  { label: 'Galeria', href: '/admin/galeria', ready: true },
  { label: 'Pastorais e Ministérios', href: '/admin/ministerios', ready: true },
  { label: 'FAQ', href: '/admin/faq', ready: true },
  { label: 'Palavra do Dia', href: '/admin/palavra-do-dia', ready: true },
  { label: 'Dados Institucionais', href: '/admin/configuracoes', ready: true },
  { label: 'Usuários e Permissões', href: '/admin/usuarios', ready: true },
  { label: 'Cores Litúrgicas', href: '/admin/liturgico', ready: true },
  { label: 'Depoimentos', href: '/admin/depoimentos', ready: true },
  { label: 'Pedidos Recebidos', href: '/admin/pedidos', ready: true },
  { label: 'Catequese', href: '/admin/catequese', ready: true },
]

export default async function AdminPage() {
  const session = await auth()

  if (session?.user?.staffRole !== 'SUPER_ADMIN') {
    redirect('/')
  }

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold">Painel — Dona Maria</h1>
        <p className="mt-2 font-body text-sm text-navy/60">
          Bem-vinda, {session.user.name}.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {MENU.map((item) =>
            item.ready ? (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg border border-line bg-white p-4 font-body font-semibold transition-colors hover:border-gold"
              >
                {item.label}
              </Link>
            ) : (
              <div
                key={item.href}
                className="cursor-not-allowed rounded-lg border border-dashed border-line bg-white/50 p-4 font-body font-semibold text-navy/30"
              >
                {item.label} <span className="font-mono text-[10px]">(em breve)</span>
              </div>
            )
          )}
        </div>
      </div>
    </main>
  )
}