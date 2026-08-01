// src/components/home/GallerySection.tsx

type GalleryImage = { id: string; imageUrl: string; caption: string | null }

export function GallerySection({ gallery }: { gallery: GalleryImage[] }) {
  if (gallery.length === 0) return null

  return (
    <section id="galeria" className="mx-auto max-w-3xl px-6 py-10">
      <p className="text-center font-body text-xs font-bold uppercase tracking-widest text-gold">
        Galeria
      </p>
      <div className="mt-6 grid grid-cols-3 gap-2">
        {gallery.map((g) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={g.id}
            src={g.imageUrl}
            alt={g.caption ?? ''}
            className="aspect-square w-full rounded-md object-cover transition-opacity hover:opacity-80"
          />
        ))}
      </div>
    </section>
  )
}