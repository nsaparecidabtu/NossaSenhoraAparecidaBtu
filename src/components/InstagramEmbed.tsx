// src/components/InstagramEmbed.tsx
//
// Usa o widget oficial do Instagram (embed.js) pra renderizar um post/reels
// público diretamente na página, sem precisar de API key.
'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } }
  }
}

export function InstagramEmbed({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function process() {
      window.instgrm?.Embeds.process()
    }

    if (window.instgrm) {
      process()
      return
    }

    const existing = document.querySelector<HTMLScriptElement>('script[src*="instagram.com/embed.js"]')
    if (existing) {
      existing.addEventListener('load', process)
      return () => existing.removeEventListener('load', process)
    }

    const script = document.createElement('script')
    script.src = 'https://www.instagram.com/embed.js'
    script.async = true
    script.onload = process
    document.body.appendChild(script)
  }, [url])

  return (
    <div ref={containerRef}>
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{ margin: '0 auto', maxWidth: 400, width: '100%' }}
      >
        <a href={url} target="_blank" rel="noopener noreferrer">
          Ver esta publicação no Instagram
        </a>
      </blockquote>
    </div>
  )
}