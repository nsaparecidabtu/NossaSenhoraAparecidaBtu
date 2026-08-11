// src/app/admin/usuarios/AdminUsersClient.tsx
'use client'

import { useActionState, useState } from 'react'
import { updateStaffAccess } from '@/actions/staffAccess'
import type { StaffRole } from '@prisma/client'

type User = {
  id: string
  name: string | null
  email: string | null
  image: string | null
  staffRole: StaffRole | null
  ministryId: string | null
  permissions: string[]
}

type Ministry = { id: string; name: string }

type ActionState = { success: boolean; error?: string }

const PERMISSION_LABELS: Record<string, string> = {
  VIEW_PRAYER_REQUESTS: 'Ver pedidos de oração',
  MANAGE_TITHE_RAFFLE: 'Sorteio do dízimo',
  MANAGE_EVENTS: 'Eventos',
  MANAGE_GALLERY: 'Galeria',
  MANAGE_MASS_SCHEDULE: 'Horários de missa',
  MANAGE_MINISTRIES: 'Pastorais e ministérios',
  MANAGE_FAQ: 'FAQ',
  MANAGE_LITURGICAL_THEME: 'Cores litúrgicas especiais (coordenador litúrgico)',
  MANAGE_TESTIMONIALS: 'Moderar depoimentos',
  MANAGE_CATECHISM: 'Catequese (alunos e presença)',
}

function roleLabel(role: StaffRole | null) {
  if (role === 'SUPER_ADMIN') return 'Super Admin'
  if (role === 'MINISTRY_LEADER') return 'Líder de Ministério'
  if (role === 'CATECHIST') return 'Catequista'
  return 'Sem acesso ao painel'
}

function UserEditForm({
  user,
  ministries,
  isSelf,
  onDone,
}: {
  user: User
  ministries: Ministry[]
  isSelf: boolean
  onDone: () => void
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(updateStaffAccess, {
    success: false,
  })
  const [role, setRole] = useState<string>(user.staffRole ?? '')

  return (
    <form
      action={formAction}
      className="mt-3 space-y-3 rounded-lg border border-dashed border-line bg-cream/40 p-4 animate-[fadein_0.2s_ease]"
    >
      <input type="hidden" name="userId" value={user.id} />

      <div>
        <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
          Cargo / Nível
        </label>
        <select
          name="staffRole"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={isSelf}
          className="mt-1 w-full rounded border border-line bg-white px-3 py-2 font-body text-sm focus:border-gold focus:outline-none disabled:opacity-60"
        >
          <option value="">Sem acesso ao painel</option>
          <option value="CATECHIST">Catequista</option>
          <option value="MINISTRY_LEADER">Líder de Ministério</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
        {isSelf && (
          <p className="mt-1 font-body text-xs text-navy/40">
            Você não pode alterar seu próprio cargo por aqui.
          </p>
        )}
      </div>

      {role === 'MINISTRY_LEADER' && (
        <>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
              Ministério que lidera
            </label>
            <select
              name="ministryId"
              defaultValue={user.ministryId ?? ''}
              className="mt-1 w-full rounded border border-line bg-white px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
            >
              <option value="">Nenhum</option>
              {ministries.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
              Permissões do Líder
            </label>
            <div className="mt-1 space-y-1">
              {Object.entries(PERMISSION_LABELS).map(([value, label]) => (
                <label key={value} className="flex items-center gap-2 font-body text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    name="permissions"
                    value={value}
                    defaultChecked={user.permissions?.includes(value)}
                    className="h-4 w-4 rounded border-line text-navy focus:ring-gold"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="flex-1 rounded bg-navy py-2 font-body text-xs font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-gold hover:text-navy disabled:opacity-60"
        >
          {pending ? 'Salvando...' : 'Salvar Alterações'}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="flex-1 rounded border border-line py-2 font-body text-xs font-semibold uppercase tracking-wide text-navy/60 hover:bg-black/5"
        >
          Cancelar
        </button>
      </div>

      {state?.error && <p className="font-body text-xs text-red-600">{state.error}</p>}
      {state?.success && <p className="font-body text-xs text-green-700">Salvo com sucesso!</p>}
    </form>
  )
}

export function AdminUsersClient({
  users,
  ministries,
  currentUserId,
}: {
  users: User[]
  ministries: Ministry[]
  currentUserId: string
}) {
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <div className="mt-8 space-y-3">
      {users.map((u) => (
        <div key={u.id} className="rounded-xl border border-line bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {u.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={u.image} alt="" className="h-10 w-10 rounded-full border border-line" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy font-bold text-cream">
                  {u.name?.[0] ?? 'U'}
                </div>
              )}
              <div>
                <p className="font-display font-semibold text-navy">{u.name ?? 'Sem nome'}</p>
                <p className="font-body text-xs text-navy/50">{u.email}</p>
                <p className="mt-1 font-body text-xs font-semibold text-navy/70">
                  {roleLabel(u.staffRole)}
                </p>
              </div>
            </div>
            {/* IMPORTANTE: Usamos botão sem Link para não gerar 404 */}
            <button
              onClick={() => setEditingId(editingId === u.id ? null : u.id)}
              className="shrink-0 rounded border border-line px-3 py-1.5 font-body text-xs font-semibold text-navy transition-colors hover:border-gold hover:bg-navy/5"
            >
              {editingId === u.id ? 'Fechar' : 'Editar acesso'}
            </button>
          </div>

          {editingId === u.id && (
            <UserEditForm
              user={u}
              ministries={ministries}
              isSelf={u.id === currentUserId}
              onDone={() => setEditingId(null)}
            />
          )}
        </div>
      ))}

      {users.length === 0 && (
        <p className="py-8 text-center font-body text-sm text-navy/40">Nenhum usuário encontrado.</p>
      )}
    </div>
  )
}