// src/app/admin/page.tsx
import Link from 'next/link'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import type { StaffPermission } from '@prisma/client'

// Tipagem atualizada para suportar grupos e múltiplas permissões
type MenuItem = {
  group: string
  label: string
  href: string
  permissions?: StaffPermission[]
  adminOnly?: boolean
}

// Menu organizado por Domínios (Departamentos da Paróquia)
const MENU: MenuItem[] = [
  // --- ATENDIMENTO ---
  { group: 'Atendimento', label: 'Caixa de Entrada', href: '/admin/pedidos', permissions: ['MANAGE_SECRETARY_REQUESTS', 'MANAGE_MASS_INTENTIONS'] },
  { group: 'Atendimento', label: 'FAQ', href: '/admin/faq', permissions: ['MANAGE_FAQ'] },

  // --- LITURGIA ---
  { group: 'Liturgia', label: 'Horários de Missa', href: '/admin/horarios', permissions: ['MANAGE_MASS_SCHEDULE'] },
  { group: 'Liturgia', label: 'Tempo Litúrgico', href: '/admin/liturgico', permissions: ['MANAGE_LITURGICAL_THEME'] },
  { group: 'Liturgia', label: 'Palavra do Dia', href: '/admin/palavra-do-dia', permissions: ['MANAGE_LITURGICAL_THEME'] },

  // --- COMUNIDADE ---
  { group: 'Comunidade', label: 'Catequese', href: '/admin/catequese', permissions: ['MANAGE_CATECHISM'] },
  { group: 'Comunidade', label: 'Pastorais e Movimentos', href: '/admin/ministerios', permissions: ['MANAGE_MINISTRIES'] },
  { group: 'Comunidade', label: 'Próximos Eventos', href: '/admin/eventos', permissions: ['MANAGE_EVENTS'] },

  // --- COMUNICAÇÃO ---
  { group: 'Comunicação', label: 'Canais de Transmissão', href: '/admin/ao-vivo', permissions: ['MANAGE_LIVE_STREAM'] },
  { group: 'Comunicação', label: 'Monitor Ao Vivo (Mural)', href: '/admin/pedidosLive', permissions: ['MANAGE_LIVE_STREAM'] },
  { group: 'Comunicação', label: 'Galeria de Fotos', href: '/admin/galeria', permissions: ['MANAGE_GALLERY'] },
  { group: 'Comunicação', label: 'Depoimentos', href: '/admin/depoimentos', permissions: ['MANAGE_TESTIMONIALS'] },

  // --- SISTEMA ---
  { group: 'Sistema', label: 'Dados Institucionais', href: '/admin/configuracoes', adminOnly: true },
  { group: 'Sistema', label: 'Usuários e Equipe', href: '/admin/usuarios', adminOnly: true },
]

export default async function AdminPage() {
  const session = await auth()
  
  if (!session?.user) redirect('/')

  const isSuperAdmin = session.user.staffRole === 'SUPER_ADMIN'
  const userPermissions = (session.user.permissions as StaffPermission[]) ?? []

  // 1. Filtra os itens permitidos para o usuário atual
  const allowedMenu = MENU.filter((item) => {
    if (isSuperAdmin) return true
    if (item.adminOnly && !isSuperAdmin) return false
    
    // Se o item exige permissões, o usuário deve ter pelo menos uma delas
    if (item.permissions) {
      return item.permissions.some(p => userPermissions.includes(p))
    }
    
    return true
  })

  // Se o usuário não tiver acesso a nada, manda pra home
  if (allowedMenu.length === 0) redirect('/')

  // 2. Agrupa os itens permitidos pela chave "group"
  const groupedMenu = allowedMenu.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = []
    }
    acc[item.group].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)

  return (
    <main className="min-h-screen bg-cream px-4 py-12 sm:px-6 text-navy">
      <div className="mx-auto max-w-4xl animate-[fadein_0.3s_ease]">
        
        <header className="mb-10 rounded-2xl border border-line bg-white p-6 shadow-sm">
          <h1 className="font-display text-3xl font-bold">Painel Administrativo</h1>
          <p className="mt-1 font-body text-sm text-navy/60">
            Bem-vindo(a), <span className="font-semibold text-navy">{session.user.name}</span>. 
            Selecione o módulo que deseja gerenciar.
          </p>
        </header>

        <div className="space-y-10">
          {Object.entries(groupedMenu).map(([groupName, items]) => (
            <section key={groupName}>
              {/* Título do Departamento */}
              <h2 className="mb-4 border-b border-line pb-2 font-display text-lg font-bold text-navy/80 uppercase tracking-wide">
                {groupName}
              </h2>
              
              {/* Grid de Cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex flex-col justify-center rounded-xl border border-line bg-white p-5 font-body transition-all hover:border-gold hover:shadow-md hover:-translate-y-0.5"
                  >
                    <span className="font-semibold text-navy group-hover:text-gold transition-colors">
                      {item.label}
                    </span>
                    <span className="mt-1 text-xs text-navy/40 opacity-0 transition-opacity group-hover:opacity-100">
                      Acessar módulo →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
        
      </div>
    </main>
  )
}