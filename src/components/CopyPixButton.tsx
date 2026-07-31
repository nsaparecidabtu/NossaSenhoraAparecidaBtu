// src/components/CopyPixButton.tsx
'use client'

import { useState } from 'react'

export function CopyPixButton({ pixKey }: { pixKey: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(pixKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard indisponível (ex: sem HTTPS) — ignora silenciosamente
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="mt-3 inline-flex items-center gap-2 rounded bg-navy px-4 py-2.5 font-body text-xs font-semibold uppercase tracking-wide text-cream transition-opacity hover:opacity-90"
    >
      {copied ? 'Copiado!' : 'Copiar chave PIX'}
    </button>
  )
}