// src/app/admin/configuracoes/AdminSettingsClient.tsx
'use client'

import { useActionState, useState } from 'react'
import { updateParishSettings } from '@/actions/parishSettings'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { ContactCategoryCard } from './components/ContactCategoryCard'
import { HelpSettingsTab } from './components/tabs/HelpSettingsTab'

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

type Contact = { id: string; category: string; label: string; value: string; mapUrl: string | null }
type ActionState = { success: boolean; error?: string }

const THEME_OPTIONS: { value: ThemeMode; label: string; hint: string }[] = [
  { value: 'PADRAO', label: 'Padrão', hint: 'só navy e dourado' },
  { value: 'DISCRETO', label: 'Cores discretas', hint: 'barra fina + detalhes' },
  { value: 'FULLCOLOR', label: 'Full color litúrgico', hint: 'fundo e botões tingidos' },
]

const CONTACT_CATEGORIES = [
  { id: 'INSTAGRAM', title: 'Instagram', placeholder: 'https://instagram.com/...' },
  { id: 'FACEBOOK', title: 'Facebook', placeholder: 'https://facebook.com/...' },
  { id: 'WHATSAPP', title: 'WhatsApp', placeholder: 'Ex: 14 99999-9999' },
  { id: 'PHONE', title: 'Telefone Fixo', placeholder: 'Ex: 14 3882-0000' },
  { id: 'ADDRESS', title: 'Endereço', placeholder: 'Rua X, nº Y...' },
  { id: 'OTHER', title: 'Outros Links', placeholder: 'https://...' },
]

function LiturgicalThemePicker({ defaultValue }: { defaultValue?: ThemeMode }) {
  const [value, setValue] = useState<ThemeMode>(defaultValue ?? 'DISCRETO')
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">Atmosfera litúrgica na home</label>
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
            <span className="mt-0.5 block font-normal normal-case text-[10px] opacity-70">{opt.hint}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function Field({ name, label, defaultValue, textarea }: { name: string; label: string; defaultValue?: string | null; textarea?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">{label}</label>
      {textarea ? (
        <textarea name={name} defaultValue={defaultValue ?? ''} rows={4} className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" />
      ) : (
        <input name={name} defaultValue={defaultValue ?? ''} className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" />
      )}
    </div>
  )
}

export function AdminSettingsClient({ settings, contacts }: { settings: Settings; contacts: Contact[] }) {
  const [activeTab, setActiveTab] = useState<'geral' | 'rodape' | 'ajuda'>('geral')
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    updateParishSettings,
    { success: false }
  )

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-3xl font-bold">Dados Institucionais</h1>
        <p className="mt-1 font-body text-sm text-navy/60">
          Gerencie o conteúdo estático e dinâmico da paróquia.
        </p>

        {/* Navegação das Abas (Padronizada Mobile-First) */}
        <div className="mt-6 flex flex-wrap gap-2 border-b border-line pb-3">
          <button
            onClick={() => setActiveTab('geral')}
            className={`rounded-full border px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-wide transition-colors ${activeTab === 'geral' ? 'border-navy bg-navy text-cream' : 'border-line text-navy/60 hover:bg-navy/5'}`}
          >
            Geral & Tema
          </button>
          <button
            onClick={() => setActiveTab('rodape')}
            className={`rounded-full border px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-wide transition-colors ${activeTab === 'rodape' ? 'border-navy bg-navy text-cream' : 'border-line text-navy/60 hover:bg-navy/5'}`}
          >
            Rodapé & Dinâmicos
          </button>
          <button
            onClick={() => setActiveTab('ajuda')}
            className={`rounded-full border px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-wide transition-colors ${activeTab === 'ajuda' ? 'border-navy bg-navy text-cream' : 'border-line text-navy/60 hover:bg-navy/5'}`}
          >
            Manual & Ajuda
          </button>
        </div>

        {/* ABA 1: Geral & Tema */}
        {activeTab === 'geral' && (
          <form action={formAction} className="mt-8 space-y-5 rounded-lg border border-line bg-white p-6 max-w-2xl shadow-sm">
            <Field name="name" label="Nome da paróquia" defaultValue={settings?.name} />
            <Field name="patronSaintName" label="Nome do padroeiro(a)" defaultValue={settings?.patronSaintName} />
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
            <Field name="aboutText" label="Texto 'Sobre Nós'" defaultValue={settings?.aboutText} textarea />
            <ImageUpload name="aboutImageUrl" label="Imagem do 'Sobre Nós'" defaultValue={settings?.aboutImageUrl} />
            <Field name="patronStoryText" label="História do padroeiro(a)" defaultValue={settings?.patronStoryText} textarea />

            <button type="submit" disabled={pending} className="w-full rounded bg-navy py-3 font-body text-sm font-semibold uppercase tracking-wide text-cream transition-opacity disabled:opacity-60 hover:bg-gold hover:text-navy">
              {pending ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            {state?.error && <p className="font-body text-sm text-red-600">{state.error}</p>}
            {state?.success && <p className="font-body text-sm text-green-700">Salvo com sucesso!</p>}
          </form>
        )}

        {/* ABA 2: Rodapé & Dinâmicos */}
        {activeTab === 'rodape' && (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {CONTACT_CATEGORIES.map((cat) => (
              <ContactCategoryCard 
                key={cat.id} 
                category={cat.id} 
                title={cat.title} 
                placeholder={cat.placeholder} 
                contacts={contacts.filter(c => c.category === cat.id)} 
              />
            ))}
          </div>
        )}

        {/* ABA 3: Manual & Ajuda */}
        {activeTab === 'ajuda' && (
          <div className="mt-8 max-w-2xl">
            <HelpSettingsTab />
          </div>
        )}

      </div>
    </main>
  )
}