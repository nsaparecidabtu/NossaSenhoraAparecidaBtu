// src/app/admin/galeria/AdminGalleryClient.tsx
'use client'

import { useActionState } from 'react'
import { createGalleryImage, deleteGalleryImage } from '@/actions/gallery'
import { ImageUpload } from '@/components/admin/ImageUpload'

type GalleryImage = { id: string; imageUrl: string; caption: string | null; order: number }

type ActionState = { success: boolean; error?: string }

export function AdminGalleryClient({ images }: { images: GalleryImage[] }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createGalleryImage,
    { success: false }
  )

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold">Galeria</h1>
        <p className="mt-1 font-body text-sm text-navy/60">
          A home mostra as 6 primeiras fotos, ordenadas pelo campo "Ordem".
        </p>

        <form
          action={formAction}
          className="mt-8 space-y-4 rounded-lg border border-line bg-white p-6"
        >
          <ImageUpload name="imageUrl" label="Foto" />

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
              Legenda (opcional)
            </label>
            <input
              name="caption"
              className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
              Ordem de exibição
            </label>
            <input
              name="order"
              type="number"
              defaultValue={images.length}
              className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded bg-navy py-3 font-body text-sm font-semibold uppercase tracking-wide text-cream transition-opacity disabled:opacity-60"
          >
            {pending ? 'Salvando...' : 'Adicionar Foto'}
          </button>

          {state?.error && <p className="font-body text-sm text-red-600">{state.error}</p>}
          {state?.success && <p className="font-body text-sm text-green-700">Salvo!</p>}
        </form>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((img) => (
            <div key={img.id} className="overflow-hidden rounded-lg border border-line bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.imageUrl} alt={img.caption ?? ''} className="aspect-square w-full object-cover" />
              <div className="p-2">
                {img.caption && (
                  <p className="truncate font-body text-xs text-navy/60">{img.caption}</p>
                )}
                <form
                  action={async () => {
                    await deleteGalleryImage(img.id)
                  }}
                >
                  <button
                    type="submit"
                    className="mt-1 font-body text-xs font-semibold text-red-600 hover:underline"
                  >
                    Excluir
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}