// src/app/admin/usuarios/components/UsersList.tsx
'use client'

import { useState, useActionState } from 'react'
import { updateStaffAccess } from '@/actions/staffAccess'
import type { StaffPermission, StaffRole } from '@prisma/client'

type MinistryOption = { id: string; name: string }

type UserItem = {
  id: string
  name: string | null
  email: string | null
  staffRole: StaffRole | null
  ministryId?: string | null
  permissions?: StaffPermission[]
  createdAt: Date
}

type ActionState = { success: boolean; error?: string }

const ALL_PERMISSIONS: { id: StaffPermission; label: string }[] = [
  { id: 'VIEW_PRAYER_REQUESTS', label: 'Ver Pedidos de Oração' },
  { id: 'MANAGE_TITHE_RAFFLE', label: 'Gerenciar Sorteio do Dízimo' },
  { id: 'MANAGE_EVENTS', label: 'Gerenciar Eventos' },
  { id: 'MANAGE_GALLERY', label: 'Gerenciar Galeria' },
  { id: 'MANAGE_MASS_SCHEDULE', label: 'Gerenciar Horários de Missa' },
  { id: 'MANAGE_MINISTRIES', label: 'Gerenciar Pastorais / Ministérios' },
  { id: 'MANAGE_FAQ', label: 'Gerenciar FAQ' },
  { id: 'MANAGE_LITURGICAL_THEME', label: 'Gerenciar Tema Litúrgico' },
  { id: 'MANAGE_TESTIMONIALS', label: 'Gerenciar Testemunhos' },
  { id: 'MANAGE_CATECHISM', label: 'Gerenciar Catequese' },
]

export function UsersList({ users, ministries = [] }: { users: UserItem[]; ministries?: MinistryOption[] }) {
  const [editingUser, setEditingUser] = useState<UserItem | null>(null)

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl border border-line bg-white shadow-sm">
        <table className="w-full text-left font-body text-sm text-navy">
          <thead className="border-b border-line bg-cream/50 font-display text-xs font-bold uppercase tracking-wider text-navy/60">
            <tr>
              <th className="p-3.5">Nome</th>
              <th className="p-3.5">E-mail</th>
              <th className="p-3.5">Nível</th>
              <th className="p-3.5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-cream/20 transition-colors">
                <td className="p-3.5 font-semibold">{u.name ?? 'Sem nome'}</td>
                <td className="p-3.5 text-navy/70">{u.email ?? 'Sem e-mail'}</td>
                <td className="p-3.5">
                  <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                    u.staffRole === 'SUPER_ADMIN'
                      ? 'bg-gold/20 text-navy border border-gold/40'
                      : ['CATECHIST', 'MINISTRY_LEADER'].includes(u.staffRole as string)
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {u.staffRole ?? 'Membro'}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  <button
                    type="button"
                    onClick={() => setEditingUser(u)}
                    className="rounded border border-line px-3 py-1 font-body text-xs font-semibold uppercase text-navy hover:bg-navy hover:text-cream transition-colors"
                  >
                    Permissões
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Edição Inline conectado à sua Server Action */}
      {editingUser && (
        <EditStaffAccessModal 
          user={editingUser} 
          ministries={ministries} 
          onClose={() => setEditingUser(null)} 
        />
      )}
    </div>
  )
}

function EditStaffAccessModal({ user, ministries, onClose }: { user: UserItem; ministries: MinistryOption[]; onClose: () => void }) {
  const [selectedRole, setSelectedRole] = useState<string>(user.staffRole ?? '')
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (prevState, formData) => {
      const res = await updateStaffAccess(prevState, formData)
      if (res.success) onClose()
      return res
    },
    { success: false }
  )

  const isLeader = selectedRole === 'MINISTRY_LEADER'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm animate-[fadein_0.2s_ease]">
      <div className="w-full max-w-lg rounded-2xl border border-line bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div>
            <h3 className="font-display text-lg font-bold text-navy">Gerenciar Acesso & Nível</h3>
            <p className="font-body text-xs text-navy/60">{user.name} ({user.email})</p>
          </div>
          <button type="button" onClick={onClose} className="text-navy/40 hover:text-navy text-lg font-bold">✕</button>
        </div>

        <form action={formAction} className="mt-4 space-y-4">
          <input type="hidden" name="userId" value={user.id} />

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy/60">Nível / Perfil</label>
            <select 
              name="staffRole" 
              value={selectedRole} 
              onChange={(e) => setSelectedRole(e.target.value)}
              className="mt-1 w-full rounded border border-line bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
            >
              <option value="">Fiel / Membro Comum (Sem painel)</option>
              <option value="CATECHIST">Catequista</option>
              <option value="MINISTRY_LEADER">Líder de Ministério / Pastoral</option>
              <option value="SUPER_ADMIN">Administrador Geral (Super Admin)</option>
            </select>
          </div>

          {/* Se for Líder de Ministério, exibe os ministérios e permissões selecionáveis */}
          {isLeader && (
            <div className="space-y-4 rounded-xl border border-line bg-cream/30 p-4 animate-[fadein_0.2s_ease]">
              {ministries.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/60">Ministério Vinculado</label>
                  <select 
                    name="ministryId" 
                    defaultValue={user.ministryId ?? ''} 
                    className="mt-1 w-full rounded border border-line bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
                  >
                    <option value="">Selecione o ministério...</option>
                    {ministries.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-navy/60">Permissões Permitidas</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {ALL_PERMISSIONS.map((p) => (
                    <label key={p.id} className="flex items-center gap-2 rounded border border-line/60 bg-white p-2 text-xs hover:border-gold cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="permissions" 
                        value={p.id} 
                        defaultChecked={user.permissions?.includes(p.id)} 
                        className="h-3.5 w-3.5 rounded border-line text-navy focus:ring-gold"
                      />
                      <span className="font-medium text-navy">{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-line">
            <button 
              type="button" 
              onClick={onClose} 
              className="rounded border border-line px-4 py-2 font-body text-xs font-semibold uppercase text-navy/70 hover:bg-black/5"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={pending} 
              className="rounded bg-navy px-4 py-2 font-body text-xs font-semibold uppercase tracking-wide text-cream hover:bg-gold hover:text-navy transition-colors disabled:opacity-50"
            >
              {pending ? 'Salvando...' : 'Atualizar Acesso'}
            </button>
          </div>

          {state.error && (
            <p className="rounded bg-red-50 p-2 text-xs font-medium text-red-600 border border-red-200">
              {state.error}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}