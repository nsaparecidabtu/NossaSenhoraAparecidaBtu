// src/app/admin/usuarios/components/EditUserModal.tsx
'use client'

import { useState, useActionState } from 'react'
import { updateStaffAccess } from '@/actions/staffAccess'
import type { StaffPermission, StaffRole } from '@prisma/client'

type MinistryOption = { id: string; name: string }

export type UserItem = {
  id: string
  name: string | null
  email: string | null
  staffRole: StaffRole | null
  ministryId?: string | null
  permissions?: StaffPermission[] | string[]
}

type ActionState = { success: boolean; error?: string }

const ALL_PERMISSIONS: { id: StaffPermission; label: string }[] = [
  { id: 'MANAGE_CATECHISM', label: 'Catequese (Gestão de Alunos e Chamada)' },
  { id: 'MANAGE_EVENTS', label: 'Gerenciar Eventos' },
  { id: 'MANAGE_GALLERY', label: 'Gerenciar Galeria' },
  { id: 'MANAGE_MASS_SCHEDULE', label: 'Gerenciar Horários de Missa' },
  { id: 'MANAGE_MINISTRIES', label: 'Gerenciar Pastorais / Ministérios' },
  { id: 'MANAGE_FAQ', label: 'Gerenciar FAQ' },
  { id: 'MANAGE_LITURGICAL_THEME', label: 'Gerenciar Tema Litúrgico' },
  { id: 'MANAGE_TESTIMONIALS', label: 'Gerenciar Testemunhos' },
  { id: 'VIEW_PRAYER_REQUESTS', label: 'Ver Pedidos de Oração' },
  { id: 'MANAGE_TITHE_RAFFLE', label: 'Gerenciar Sorteio do Dízimo' },
]

export function EditUserModal({
  user,
  ministries = [],
  onClose,
}: {
  user: UserItem
  ministries?: MinistryOption[]
  onClose: () => void
}) {
  const [selectedRole, setSelectedRole] = useState<string>(user.staffRole ?? '')

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (prevState, formData) => {
      const res = await updateStaffAccess(prevState, formData)
      if (res.success) {
        onClose()
      }
      return res
    },
    { success: false }
  )

  const showPermissions = selectedRole === 'STAFF' || selectedRole === 'MINISTRY_LEADER'
  const isLeader = selectedRole === 'MINISTRY_LEADER'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm animate-[fadein_0.2s_ease]">
      <div className="w-full max-w-lg rounded-2xl border border-line bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto text-navy">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div>
            <h3 className="font-display text-lg font-bold">Gerenciar Acesso & Permissões</h3>
            <p className="font-body text-xs text-navy/60">{user.name ?? 'Sem nome'} ({user.email})</p>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-navy/40 hover:text-navy text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <form action={formAction} className="mt-4 space-y-4 font-body">
          <input type="hidden" name="userId" value={user.id} />

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy/60">
              Nível / Perfil
            </label>
            <select 
              name="staffRole" 
              value={selectedRole} 
              onChange={(e) => setSelectedRole(e.target.value)}
              className="mt-1 w-full rounded border border-line bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
            >
              <option value="">Sem acesso ao painel (Fiel / Membro)</option>
              <option value="STAFF">Equipe Operacional (Staff / Catequista / Secretário)</option>
              <option value="MINISTRY_LEADER">Líder de Ministério / Pastoral</option>
              <option value="SUPER_ADMIN">Administrador Geral (Super Admin)</option>
            </select>
          </div>

          {/* Exibe seleção de ministério e checkboxes de permissão para STAFF ou LÍDER */}
          {showPermissions && (
            <div className="space-y-4 rounded-xl border border-line bg-cream/30 p-4 animate-[fadein_0.2s_ease]">
              {isLeader && ministries.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/60">
                    Ministério Liderado
                  </label>
                  <select 
                    name="ministryId" 
                    defaultValue={user.ministryId ?? ''} 
                    className="mt-1 w-full rounded border border-line bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
                  >
                    <option value="">Selecione o ministério...</option>
                    {ministries.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-navy/60">
                  Permissões Concedidas ao Usuário
                </label>
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
              {pending ? 'Salvando...' : 'Salvar Alterações'}
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