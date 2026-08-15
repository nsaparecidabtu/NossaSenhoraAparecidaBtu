// src/app/admin/usuarios/AdminUsersClient.tsx
'use client'

import { useActionState, useState } from 'react'
import { updateStaffAccess } from '@/actions/staffAccess'
import type { StaffPermission, StaffRole } from '@prisma/client'

type User = {
  id: string
  name: string | null
  email: string | null
  image: string | null
  staffRole: StaffRole | null
  permissions: StaffPermission[] | string[]
  createdAt?: Date
}

type Ministry = { id: string; name: string }

type ActionState = { success: boolean; error?: string }

const PERMISSION_LABELS: Record<StaffPermission, string> = {
  MANAGE_CATECHISM: 'Catequese (Gestão de alunos e chamadas)',
  MANAGE_EVENTS: 'Eventos paroquiais',
  MANAGE_GALLERY: 'Galeria de fotos',
  MANAGE_MASS_SCHEDULE: 'Horários de missa',
  MANAGE_MINISTRIES: 'Pastorais e ministérios',
  MANAGE_FAQ: 'Perguntas frequentes (FAQ)',
  MANAGE_LITURGICAL_THEME: 'Cores e tema litúrgico',
  MANAGE_TESTIMONIALS: 'Moderação de testemunhos',
  VIEW_PRAYER_REQUESTS: 'Ver pedidos de oração',
  MANAGE_TITHE_RAFFLE: 'Sorteio do dízimo',
  MANAGE_LIVE_STREAM: 'Transmissão ao vivo (moderação de pedidos)',
  MANAGE_SETTINGS: 'Configurações do painel',
  MANAGE_USERS: 'Gestão de usuários',
  MANAGE_SECRETARY_REQUESTS: 'Solicitações da secretaria',
  MANAGE_MASS_INTENTIONS: 'Intenções de missa',
}

// Versão curta pra caber num badge — mesma ordem/chaves de PERMISSION_LABELS
const PERMISSION_SHORT_LABELS: Record<StaffPermission, string> = {
  MANAGE_CATECHISM: 'Catequese',
  MANAGE_EVENTS: 'Eventos',
  MANAGE_GALLERY: 'Galeria',
  MANAGE_MASS_SCHEDULE: 'Horários',
  MANAGE_MINISTRIES: 'Ministérios',
  MANAGE_FAQ: 'FAQ',
  MANAGE_LITURGICAL_THEME: 'Litúrgico',
  MANAGE_TESTIMONIALS: 'Testemunhos',
  VIEW_PRAYER_REQUESTS: 'Pedidos de Oração',
  MANAGE_TITHE_RAFFLE: 'Dízimo',
  MANAGE_LIVE_STREAM: 'Ao Vivo',
  MANAGE_SETTINGS: 'Config',
  MANAGE_USERS: 'Usuários',
  MANAGE_SECRETARY_REQUESTS: 'Secretaria',
  MANAGE_MASS_INTENTIONS: 'Intenções',
}

function roleLabel(role: StaffRole | string | null) {
  if (role === 'SUPER_ADMIN') return 'Super Admin'
  if (role === 'STAFF') return 'Equipe Operacional / Staff'
  if (role === 'MINISTRY_LEADER') return 'Líder de Ministério'
  return 'Sem acesso ao painel'
}

function RoleBadge({ role }: { role: StaffRole | string | null }) {
  const styles: Record<string, string> = {
    SUPER_ADMIN: 'bg-gold/20 text-navy border border-gold/50',
    MINISTRY_LEADER: 'bg-purple-100 text-purple-800 border border-purple-200',
    STAFF: 'bg-blue-100 text-blue-800 border border-blue-200',
  }
  const style = (role && styles[role]) || 'bg-gray-100 text-gray-600 border border-gray-200'

  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 font-body text-[10px] font-bold uppercase tracking-wide ${style}`}
    >
      {roleLabel(role)}
    </span>
  )
}

function PermissionChips({ permissions }: { permissions: (StaffPermission | string)[] }) {
  if (!permissions || permissions.length === 0) {
    return <span className="font-body text-xs italic text-navy/40">Nenhuma permissão concedida ainda</span>
  }
  return (
    <div className="mt-1.5 flex flex-wrap gap-1.5">
      {permissions.map((p) => (
        <span
          key={p}
          className="rounded bg-navy/5 px-2 py-0.5 font-body text-[10px] font-semibold text-navy/70"
        >
          {PERMISSION_SHORT_LABELS[p as StaffPermission] ?? p}
        </span>
      ))}
    </div>
  )
}

function UserEditForm({
  user,
  isSelf,
  onDone,
}: {
  user: User
  ministries: Ministry[]
  isSelf: boolean
  onDone: () => void
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    updateStaffAccess,
    { success: false }
  )
  const [role, setRole] = useState<string>(user.staffRole ?? '')

  const showPermissions = role === 'STAFF' || role === 'MINISTRY_LEADER'

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
          <option value="">Sem acesso ao painel (Fiel / Membro)</option>
          <option value="STAFF">Equipe Operacional (Staff / Catequista / Secretário)</option>
          <option value="MINISTRY_LEADER">Líder de Ministério / Pastoral</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
        {isSelf && (
          <p className="mt-1 font-body text-xs text-navy/40">
            Você não pode alterar seu próprio cargo por aqui.
          </p>
        )}
      </div>

      {showPermissions && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
            Permissões Concedidas
          </label>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(Object.entries(PERMISSION_LABELS) as [StaffPermission, string][]).map(([value, label]) => (
              <label
                key={value}
                className="flex items-center gap-2 rounded border border-line/60 bg-white p-2 font-body text-xs hover:border-gold cursor-pointer"
              >
                <input
                  type="checkbox"
                  name="permissions"
                  value={value}
                  defaultChecked={(user.permissions as string[])?.includes(value)}
                  className="h-3.5 w-3.5 rounded border-line text-navy focus:ring-gold"
                />
                <span className="text-navy">{label}</span>
              </label>
            ))}
          </div>
        </div>
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

function UserCard({
  user,
  ministries,
  currentUserId,
  editingId,
  setEditingId,
  showPermissionChips,
}: {
  user: User
  ministries: Ministry[]
  currentUserId: string
  editingId: string | null
  setEditingId: (id: string | null) => void
  showPermissionChips: boolean
}) {
  const isEditing = editingId === user.id

  return (
    <div className="rounded-xl border border-line bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt="" className="h-10 w-10 rounded-full border border-line" />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy font-bold text-cream">
              {user.name?.[0] ?? 'U'}
            </div>
          )}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-display font-semibold text-navy">{user.name ?? 'Sem nome'}</p>
              <RoleBadge role={user.staffRole} />
            </div>
            <p className="font-body text-xs text-navy/50">{user.email}</p>
            {showPermissionChips && <PermissionChips permissions={user.permissions} />}
          </div>
        </div>
        <button
          onClick={() => setEditingId(isEditing ? null : user.id)}
          className="shrink-0 rounded border border-line px-3 py-1.5 font-body text-xs font-semibold text-navy transition-colors hover:border-gold hover:bg-navy/5"
        >
          {isEditing ? 'Fechar' : 'Editar acesso'}
        </button>
      </div>

      {isEditing && (
        <UserEditForm
          user={user}
          ministries={ministries}
          isSelf={user.id === currentUserId}
          onDone={() => setEditingId(null)}
        />
      )}
    </div>
  )
}

function RoleGroup({
  title,
  hint,
  users,
  ministries,
  currentUserId,
  editingId,
  setEditingId,
}: {
  title: string
  hint?: string
  users: User[]
  ministries: Ministry[]
  currentUserId: string
  editingId: string | null
  setEditingId: (id: string | null) => void
}) {
  if (users.length === 0) return null

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-sm font-bold uppercase tracking-wide text-navy/70">
          {title} <span className="font-body text-xs font-normal text-navy/40">({users.length})</span>
        </h3>
      </div>
      {hint && <p className="mt-0.5 font-body text-xs text-navy/40">{hint}</p>}
      <div className="mt-3 space-y-3">
        {users.map((u) => (
          <UserCard
            key={u.id}
            user={u}
            ministries={ministries}
            currentUserId={currentUserId}
            editingId={editingId}
            setEditingId={setEditingId}
            showPermissionChips
          />
        ))}
      </div>
    </div>
  )
}

export function AdminUsersClient({
  staffUsers,
  members,
  ministries,
  currentUserId,
}: {
  staffUsers: User[]
  members: User[]
  ministries: Ministry[]
  currentUserId: string
}) {
  const [editingId, setEditingId] = useState<string | null>(null)

  const superAdmins = staffUsers.filter((u) => u.staffRole === 'SUPER_ADMIN')
  const ministryLeaders = staffUsers.filter((u) => u.staffRole === 'MINISTRY_LEADER')
  const staff = staffUsers.filter((u) => u.staffRole === 'STAFF')

  return (
    <div className="mt-6 space-y-8">
      {staffUsers.length === 0 && (
        <p className="font-body text-sm text-navy/40">Nenhum membro da equipe cadastrado ainda.</p>
      )}

      <RoleGroup
        title="Super Admin"
        hint="Acesso total ao painel, sem restrição por permissão."
        users={superAdmins}
        ministries={ministries}
        currentUserId={currentUserId}
        editingId={editingId}
        setEditingId={setEditingId}
      />

      <RoleGroup
        title="Líderes de Ministério"
        users={ministryLeaders}
        ministries={ministries}
        currentUserId={currentUserId}
        editingId={editingId}
        setEditingId={setEditingId}
      />

      <RoleGroup
        title="Equipe Operacional / Staff"
        users={staff}
        ministries={ministries}
        currentUserId={currentUserId}
        editingId={editingId}
        setEditingId={setEditingId}
      />

      <div>
        <h3 className="font-display text-sm font-bold uppercase tracking-wide text-navy/70">
          Sem acesso ao painel{' '}
          <span className="font-body text-xs font-normal text-navy/40">(fiéis com login)</span>
        </h3>
        <p className="mt-0.5 font-body text-xs text-navy/40">
          Busque por nome ou e-mail abaixo pra promover alguém a Staff ou Líder de Ministério.
        </p>
        <div className="mt-3 space-y-3">
          {members.map((u) => (
            <UserCard
              key={u.id}
              user={u}
              ministries={ministries}
              currentUserId={currentUserId}
              editingId={editingId}
              setEditingId={setEditingId}
              showPermissionChips={false}
            />
          ))}
          {members.length === 0 && (
            <p className="py-6 text-center font-body text-sm text-navy/40">
              Nenhum fiel encontrado com esse filtro.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
