// src/app/admin/page.tsx
import Link from 'next/link'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import type { StaffPermission } from '@prisma/client'

// Tipagem explícita para os itens do menu administrativo
type MenuItem = {
  label: string
  href: string
  permission?: StaffPermission | null
  adminOnly?: boolean
}

const MENU: MenuItem[] = [
  { label: 'Horários de Missa', href: '/admin/horarios', permission: 'MANAGE_MASS_SCHEDULE' },
  { label: 'Próximos Eventos', href: '/admin/eventos', permission: 'MANAGE_EVENTS' },
  { label: 'Galeria', href: '/admin/galeria', permission: 'MANAGE_GALLERY' },
  { label: 'Pastorais', href: '/admin/ministerios', permission: 'MANAGE_MINISTRIES' },
  { label: 'FAQ', href: '/admin/faq', permission: 'MANAGE_FAQ' },
  { label: 'Catequese', href: '/admin/catequese', permission: 'MANAGE_CATECHISM' },
  { label: 'Dados Institucionais', href: '/admin/configuracoes', adminOnly: true }, // Adicionado aqui
  { label: 'Usuários', href: '/admin/usuarios', adminOnly: true }, // Apenas Super Admin
  { label: 'AO VIVO ADMIN', href: '/admin/ao-vivo', permission: 'MANAGE_LIVE_STREAM' }, // Adicionado aqui
  {label: 'Pedidos de Oração (Ao Vivo)', href: '/admin/pedidosLive', permission: 'VIEW_PRAYER_REQUESTS' } // Adicionado aqui
]

export default async function AdminPage() {
  const session = await auth()
  
  if (!session?.user) redirect('/')

  const isSuperAdmin = session.user.staffRole === 'SUPER_ADMIN'
  const userPermissions = session.user.permissions ?? []

  // Filtra o menu de forma inteligente baseada no contexto do usuário logado
  const allowedMenu = MENU.filter((item) => {
    if (item.adminOnly) return isSuperAdmin
    if (!item.permission) return true // Sem restrição específica
    return isSuperAdmin || userPermissions.includes(item.permission)
  })

  // Se o usuário não tiver acesso a absolutamente nenhum módulo, redireciona para a home
  if (allowedMenu.length === 0) redirect('/')

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold">Painel Administrativo</h1>
        <p className="mt-2 font-body text-sm text-navy/60">
          Bem-vindo(a), {session.user.name}.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {allowedMenu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg border border-line bg-white p-4 font-body font-semibold transition-all hover:border-gold hover:shadow-sm"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}