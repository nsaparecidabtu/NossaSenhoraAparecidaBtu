// src/components/home/SiteFooter.tsx
import { FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa6'

type Props = {
  name: string | null | undefined
  phone: string | null | undefined
  email: string | null | undefined
  address: string | null | undefined
  instagramUrl: string | null | undefined
  facebookUrl: string | null | undefined
  youtubeUrl: string | null | undefined
}

export function SiteFooter({
  name,
  phone,
  email,
  address,
  instagramUrl,
  facebookUrl,
  youtubeUrl,
}: Props) {
  return (
    <footer className="border-t border-line bg-navy px-6 py-12 text-cream">
      <div className="mx-auto grid max-w-3xl gap-8 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/favicon.svg" alt="" className="h-7 w-7" />
            <p className="font-display text-base font-bold">
              {name ?? 'Paróquia Nossa Senhora Aparecida'}
            </p>
          </div>
          <p className="mt-3 font-body text-sm italic text-cream/60">
            &ldquo;Fazei tudo o que Ele vos disser.&rdquo;
            <br />
            (João 2,5)
          </p>
        </div>

        <div>
          <p className="font-body text-xs font-bold uppercase tracking-widest text-gold">Contato</p>
          <div className="mt-3 space-y-1.5 font-body text-sm text-cream/70">
            {phone && <p>{phone}</p>}
            {email && <p>{email}</p>}
          </div>
        </div>

        <div>
          <p className="font-body text-xs font-bold uppercase tracking-widest text-gold">
            Endereço
          </p>
          <p className="mt-3 font-body text-sm text-cream/70">{address ?? 'Endereço em breve'}</p>

          {(instagramUrl || facebookUrl || youtubeUrl) && (
            <div className="mt-4 flex gap-3">
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-cream/30 text-cream/70 transition-colors hover:text-gold"
                >
                  <FaInstagram className="h-4 w-4" />
                </a>
              )}
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-cream/30 text-cream/70 transition-colors hover:text-gold"
                >
                  <FaFacebook className="h-4 w-4" />
                </a>
              )}
              {youtubeUrl && (
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-cream/30 text-cream/70 transition-colors hover:text-gold"
                >
                  <FaYoutube className="h-4 w-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-3xl border-t border-cream/10 pt-6 text-center font-mono text-xs text-cream/40">
        © {new Date().getFullYear()} {name ?? 'Paróquia Nossa Senhora Aparecida'}. Todos os direitos
        reservados.
      </p>
    </footer>
  )
}