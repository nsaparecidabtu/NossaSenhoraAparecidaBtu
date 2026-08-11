// src/app/admin/usuarios/components/UsersList.tsx
'use client'

import { useState } from 'react'
import type { StaffPermission, StaffRole } from '@prisma/client'
import { EditUserModal } from './EditUserModal'

type MinistryOption = { id: string; name: string }

export type UserItem = {
  id: string
  name: string | null
  email: string | null
  staffRole: StaffRole | string | null // Tipagem flexível para evitar conflito com schemas em migração
  ministryId?: string | null
  permissions?: StaffPermission[] | string[]
  createdAt: Date
}

export function UsersList({ 
  users, 
  ministries = [] 
}: { 
  users: UserItem[]
  ministries?: MinistryOption[] 
}) {
  const [editingUser, setEditingUser] = useState<UserItem | null>(null)

  return (
    <div className="space-y-3 font-body">
      <div className="overflow-x-auto rounded-xl border border-line bg-white shadow-sm">
        <table className="w-full text-left text-sm text-navy">
          <thead className="border-b border-line bg-cream/50 font-display text-xs font-bold uppercase tracking-wider text-navy/60">
            <tr>
              <th className="p-3.5">Nome</th>
              <th className="p-3.5">E-mail</th>
              <th className="p-3.5">Nível / Cargo</th>
              <th className="p-3.5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            {users.map((u) => {
              const role = u.staffRole as string | null
              const isSuperAdmin = role === 'SUPER_ADMIN'
              const isStaff = role === 'CATECHIST' || role === 'MINISTRY_LEADER'

              return (
                <tr key={u.id} className="hover:bg-cream/20 transition-colors">
                  <td className="p-3.5 font-semibold">{u.name ?? 'Sem nome'}</td>
                  <td className="p-3.5 text-navy/70">{u.email ?? 'Sem e-mail'}</td>
                  <td className="p-3.5">
                    <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                      isSuperAdmin 
                        ? 'bg-gold/20 text-navy border border-gold/40 font-bold' 
                        : isStaff
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {role ?? 'Membro'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => setEditingUser(u)}
                      className="rounded border border-line px-3 py-1 text-xs font-semibold uppercase text-navy hover:bg-navy hover:text-cream transition-colors"
                    >
                      Permissões
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Inline conectado à Server Action staffAccess.ts */}
      {editingUser && (
        <EditUserModal 
          user={editingUser as any} 
          ministries={ministries} 
          onClose={() => setEditingUser(null)} 
        />
      )}
    </div>
  )
}