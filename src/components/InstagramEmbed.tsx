// src/components/InstagramEmbed.tsx
'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } }
  }
}

export function InstagramEmbed({ url }: { url: string }) {
  useEffect(() => {
    if (window.instgrm) {
      window.instgrm.Embeds.process()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://www.instagram.com/embed.js'
    script.async = true
    document.body.appendChild(script)
  }, [url])

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      style={{ margin: '0 auto', maxWidth: 400, width: '100%' }}
    />
  )
}