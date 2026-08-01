// src/app/admin/usuarios/AdminUsersClient.tsx
'use client'

import { useActionState, useState } from 'react'
import { updateStaffAccess } from '@/actions/staffAccess'

type StaffRole = 'SUPER_ADMIN' | 'MINISTRY_LEADER'

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
}

function roleLabel(role: StaffRole | null) {
  if (role === 'SUPER_ADMIN') return 'Super Admin'
  if (role === 'MINISTRY_LEADER') return 'Líder de Ministério'
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
  const [role, setRole] = useState<'' | StaffRole>(user.staffRole ?? '')

  return (
    <form
      action={formAction}
      className="mt-3 space-y-3 rounded border border-dashed border-line bg-cream/40 p-4"
    >
      <input type="hidden" name="userId" value={user.id} />

      <div>
        <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
          Cargo
        </label>
        <select
          name="staffRole"
          value={role}
          onChange={(e) => setRole(e.target.value as '' | StaffRole)}
          disabled={isSelf}
          className="mt-1 w-full rounded border border-line bg-white px-3 py-2 font-body text-sm focus:border-gold focus:outline-none disabled:opacity-60"
        >
          <option value="">Sem acesso ao painel</option>
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
              Permissões
            </label>
            <div className="mt-1 space-y-1">
              {Object.entries(PERMISSION_LABELS).map(([value, label]) => (
                <label key={value} className="flex items-center gap-2 font-body text-sm">
                  <input
                    type="checkbox"
                    name="permissions"
                    value={value}
                    defaultChecked={user.permissions.includes(value)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="flex-1 rounded bg-navy py-2 font-body text-xs font-semibold uppercase tracking-wide text-cream disabled:opacity-60"
        >
          {pending ? 'Salvando...' : 'Salvar'}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="flex-1 rounded border border-line py-2 font-body text-xs font-semibold uppercase tracking-wide text-navy/60"
        >
          Cancelar
        </button>
      </div>

      {state?.error && <p className="font-body text-xs text-red-600">{state.error}</p>}
      {state?.success && <p className="font-body text-xs text-green-700">Salvo!</p>}
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
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold">Usuários e Permissões</h1>
        <p className="mt-1 font-body text-sm text-navy/60">
          Só aparecem aqui pessoas que já entraram no site com Google pelo menos uma vez.
        </p>

        <div className="mt-8 space-y-3">
          {users.map((u) => (
            <div key={u.id} className="rounded-lg border border-line bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {u.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={u.image} alt="" className="h-10 w-10 rounded-full" />
                  )}
                  <div>
                    <p className="font-display font-semibold">{u.name ?? 'Sem nome'}</p>
                    <p className="font-body text-xs text-navy/50">{u.email}</p>
                    <p className="mt-1 font-body text-xs font-semibold text-navy/70">
                      {roleLabel(u.staffRole)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingId(editingId === u.id ? null : u.id)}
                  className="shrink-0 font-body text-xs font-semibold text-navy/60 hover:underline"
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
        </div>
      </div>
    </main>
  )
}