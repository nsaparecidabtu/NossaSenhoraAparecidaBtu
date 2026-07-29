// src/app/admin/configuracoes/AdminSettingsClient.tsx
'use client'

import { useActionState, useState } from 'react'
import { updateParishSettings } from '@/actions/parishSettings'
import { ImageUpload } from '@/components/admin/ImageUpload'

type ThemeMode = 'PADRAO' | 'DISCRETO' | 'FULLCOLOR'

type Settings = {
  name: string
  patronSaintName: string
  address: string | null
  phone: string | null
  email: string | null
  pixKey: string | null
  instagramUrl: string | null
  facebookUrl: string | null
  youtubeUrl: string | null
  heroImageUrl: string | null
  heroTagline: string | null
  aboutText: string | null
  aboutImageUrl: string | null
  patronStoryText: string | null
  liturgicalThemeMode: ThemeMode
} | null

type ActionState = { success: boolean; error?: string }

const THEME_OPTIONS: { value: ThemeMode; label: string; hint: string }[] = [
  { value: 'PADRAO', label: 'Padrão', hint: 'só navy e dourado' },
  { value: 'DISCRETO', label: 'Cores discretas', hint: 'barra fina + detalhes' },
  { value: 'FULLCOLOR', label: 'Full color litúrgico', hint: 'fundo e botões tingidos' },
]

function LiturgicalThemePicker({ defaultValue }: { defaultValue?: ThemeMode }) {
  const [value, setValue] = useState<ThemeMode>(defaultValue ?? 'DISCRETO')

  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
        Atmosfera litúrgica na home
      </label>
      <input type="hidden" name="liturgicalThemeMode" value={value} />
      <div className="mt-1 grid grid-cols-3 gap-1 rounded border border-line p-1">
        {THEME_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setValue(opt.value)}
            className={`rounded px-2 py-2 font-body text-xs font-semibold transition-colors ${
              value === opt.value ? 'bg-navy text-cream' : 'text-navy/60 hover:bg-cream'
            }`}
          >
            {opt.label}
            <span className="mt-0.5 block font-normal normal-case text-[10px] opacity-70">
              {opt.hint}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function Field({
  name,
  label,
  defaultValue,
  textarea,
}: {
  name: string
  label: string
  defaultValue?: string | null
  textarea?: boolean
}) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
        {label}
      </label>
      {textarea ? (
        <textarea
          name={name}
          defaultValue={defaultValue ?? ''}
          rows={4}
          className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
        />
      ) : (
        <input
          name={name}
          defaultValue={defaultValue ?? ''}
          className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
        />
      )}
    </div>
  )
}

export function AdminSettingsClient({ settings }: { settings: Settings }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    updateParishSettings,
    { success: false }
  )

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold">Dados Institucionais</h1>
        <p className="mt-1 font-body text-sm text-navy/60">
          Alimenta o hero, o "Sobre Nós", o rodapé e a doação da home.
        </p>

        <form
          action={formAction}
          className="mt-8 space-y-5 rounded-lg border border-line bg-white p-6"
        >
          <Field name="name" label="Nome da paróquia" defaultValue={settings?.name} />
          <Field
            name="patronSaintName"
            label="Nome do padroeiro(a)"
            defaultValue={settings?.patronSaintName}
          />
          <Field name="heroTagline" label="Frase de destaque (hero)" defaultValue={settings?.heroTagline} />
          <ImageUpload name="heroImageUrl" label="Imagem do hero" defaultValue={settings?.heroImageUrl} />

          <LiturgicalThemePicker defaultValue={settings?.liturgicalThemeMode} />

          <Field name="address" label="Endereço" defaultValue={settings?.address} />
          <Field name="phone" label="Telefone" defaultValue={settings?.phone} />
          <Field name="email" label="E-mail" defaultValue={settings?.email} />
          <Field name="pixKey" label="Chave PIX" defaultValue={settings?.pixKey} />

          <Field name="instagramUrl" label="Instagram (URL)" defaultValue={settings?.instagramUrl} />
          <Field name="facebookUrl" label="Facebook (URL)" defaultValue={settings?.facebookUrl} />
          <Field name="youtubeUrl" label="YouTube (URL do canal)" defaultValue={settings?.youtubeUrl} />

          <Field
            name="aboutText"
            label="Texto 'Sobre Nós'"
            defaultValue={settings?.aboutText}
            textarea
          />
          <ImageUpload name="aboutImageUrl" label="Imagem do 'Sobre Nós'" defaultValue={settings?.aboutImageUrl} />

          <Field
            name="patronStoryText"
            label="História do padroeiro(a)"
            defaultValue={settings?.patronStoryText}
            textarea
          />

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded bg-navy py-3 font-body text-sm font-semibold uppercase tracking-wide text-cream transition-opacity disabled:opacity-60"
          >
            {pending ? 'Salvando...' : 'Salvar Alterações'}
          </button>

          {state?.error && <p className="font-body text-sm text-red-600">{state.error}</p>}
          {state?.success && <p className="font-body text-sm text-green-700">Salvo!</p>}
        </form>
      </div>
    </main>
  )
}