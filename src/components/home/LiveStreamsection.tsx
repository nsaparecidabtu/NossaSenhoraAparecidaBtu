// src/components/home/LiveStreamSection.tsx

type Props = { youtubeVideoId: string | null | undefined; isLiveNow: boolean | undefined }

export function LiveStreamSection({ youtubeVideoId, isLiveNow }: Props) {
  if (!isLiveNow || !youtubeVideoId) return null

  return (
    <section className="mx-auto max-w-3xl px-6 py-10">
      <h2 className="font-display text-2xl font-bold text-gold">Assista Agora</h2>
      <div className="mt-4 aspect-video overflow-hidden rounded-lg border border-line">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${youtubeVideoId}`}
          title="Transmissão ao vivo"
          allowFullScreen
        />
      </div>
    </section>
  )
}