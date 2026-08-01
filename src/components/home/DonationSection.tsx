// src/components/home/DonationSection.tsx
import { CopyPixButton } from '@/components/CopyPixButton'

export function DonationSection({ pixKey }: { pixKey: string | null | undefined }) {
  if (!pixKey) return null

  return (
    <section id="doacao" className="bg-[#f3ede0] px-6 py-14">
      <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-2 md:items-center">
        <div>
          <p className="font-body text-xs font-bold uppercase tracking-widest text-gold">
            Sua Doação Transforma Vidas
          </p>
          <p className="mt-4 font-body leading-relaxed text-navy/80">
            Com sua ajuda, podemos continuar nossa missão de evangelizar, acolher e servir a
            comunidade.
          </p>
          <p className="mt-2 font-display font-semibold">Doe com amor. Doe com fé.</p>
        </div>

        <div className="rounded-lg border border-line bg-white p-6 text-center">
          <span className="inline-block rounded-full bg-gold px-3 py-1 font-body text-[10px] font-bold uppercase tracking-widest text-navy">
            Chave PIX
          </span>
          <div className="mt-4 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(pixKey)}`}
              alt="QR Code da chave PIX"
              className="h-44 w-44"
            />
          </div>
          <p className="mt-3 font-mono text-sm font-semibold text-navy/80">{pixKey}</p>
          <CopyPixButton pixKey={pixKey} />
        </div>
      </div>
    </section>
  )
}