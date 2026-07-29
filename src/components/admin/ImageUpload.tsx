// src/components/admin/ImageUpload.tsx
//
// Substitui os antigos campos de texto "URL da imagem" nos formulários de
// admin — mas mantendo a opção de colar uma URL manualmente, além de subir
// arquivo. Os dois escrevem no mesmo estado `url`; o que a pessoa fizer por
// último é o que vale. O upload vai direto do navegador pro Vercel Blob
// (client upload via upload()), autorizado pela rota /api/upload.
'use client'

import { useRef, useState } from 'react'
import { upload } from '@vercel/blob/client'

export function ImageUpload({
  name,
  label,
  defaultValue,
}: {
  name: string
  label: string
  defaultValue?: string | null
}) {
  const [url, setUrl] = useState(defaultValue ?? '')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      })
      setUrl(blob.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao enviar imagem.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
        {label}
      </label>

      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt=""
          className="mt-2 h-32 w-full rounded border border-line object-cover"
        />
      )}

      {/* Campo de texto — cola uma URL direto, ou mostra a URL do upload */}
      <input
        name={name}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Cole uma URL ou envie um arquivo abaixo"
        className="mt-2 w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
      />

      <div className="mt-2 flex items-center gap-2">
        <div className="h-px flex-1 bg-line" />
        <span className="font-body text-[10px] uppercase tracking-wide text-navy/40">ou</span>
        <div className="h-px flex-1 bg-line" />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="mt-2 w-full rounded border border-line px-3 py-2 font-body text-sm file:mr-3 file:rounded file:border-0 file:bg-navy file:px-3 file:py-1.5 file:font-body file:text-xs file:font-semibold file:uppercase file:text-cream disabled:opacity-60"
      />

      {uploading && <p className="mt-1 font-body text-xs text-navy/50">Enviando...</p>}
      {error && <p className="mt-1 font-body text-xs text-red-600">{error}</p>}
      {!uploading && !error && !url && (
        <p className="mt-1 font-body text-xs text-navy/40">JPG, PNG, WEBP ou GIF — até 5MB.</p>
      )}
    </div>
  )
}