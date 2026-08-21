// src/components/home/SiteFooter.tsx
import { FaInstagram, FaFacebook, FaYoutube, FaWhatsapp, FaPhone, FaMapMarkerAlt, FaCode } from 'react-icons/fa'
import type { ReactNode } from 'react'
// 🚀 REMOVIDO: import { prisma } from '@/lib/prisma'

const CONTACT_ICONS: Record<string, ReactNode> = {
  INSTAGRAM: <FaInstagram className="h-4 w-4" />,
  FACEBOOK: <FaFacebook className="h-4 w-4" />,
  YOUTUBE: <FaYoutube className="h-4 w-4" />,
  WHATSAPP: <FaWhatsapp className="h-4 w-4" />,
  PHONE: <FaPhone className="h-4 w-4" />,
}

// 🚀 Tipamos os contatos recebidos da page.tsx
type SiteContact = {
  id: string
  category: string
  label: string
  value: string
  mapUrl?: string | null
}

type Props = {
  name?: string | null
  phone?: string | null
  email?: string | null
  contacts: SiteContact[] // Nova prop
}

// 🚀 REMOVIDO o "async". Agora é uma função React normal e síncrona.
export function SiteFooter({ name, phone, email, contacts = [] }: Props) {
  
  // A filtragem continua acontecendo de forma rápida na memória
  const socialLinks = contacts.filter(c => ['INSTAGRAM', 'FACEBOOK', 'YOUTUBE', 'WHATSAPP'].includes(c.category))
  const phones = contacts.filter(c => c.category === 'PHONE')
  const addresses = contacts.filter(c => c.category === 'ADDRESS')

  return (
    <footer className="border-t border-line bg-navy px-6 py-12 text-cream">
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
        
        {/* Coluna 1: Identidade */}
        <div>
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/favicon.svg" alt="Símbolo da Paróquia" className="h-7 w-7" />
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

        {/* Coluna 2: Contatos e Redes Dinâmicas */}
        <div>
          <p className="font-body text-xs font-bold uppercase tracking-widest text-gold">Contato e Redes</p>
          
          <div className="mt-3 space-y-1.5 font-body text-sm text-cream/70">
            {phone && <p>{phone}</p>}
            {email && <p>{email}</p>}
            
            {phones.map(p => (
              <p key={p.id} className="flex items-center gap-2">
                <span className="text-gold text-xs">{p.label}:</span> {p.value}
              </p>
            ))}
          </div>

          {socialLinks.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {socialLinks.map(social => (
                <a
                  key={social.id}
                  href={social.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.label}
                  aria-label={`Visite nosso ${social.category.toLowerCase()}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-cream/30 text-cream/70 transition-colors hover:border-gold hover:text-gold"
                >
                  {CONTACT_ICONS[social.category] || null}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Coluna 3: Endereços Dinâmicos */}
        <div>
          <p className="font-body text-xs font-bold uppercase tracking-widest text-gold">
            Nossas Igrejas
          </p>
          
          <div className="mt-3 space-y-5">
            {addresses.length === 0 ? (
              <p className="mt-1 font-body text-xs text-cream/50">Nenhum endereço cadastrado.</p>
            ) : (
              addresses.map(addr => (
                <div key={addr.id}>
                  <p className="font-body text-sm font-semibold text-cream">{addr.label}</p>
                  <p className="mt-1 font-body text-xs leading-relaxed text-cream/60 whitespace-pre-line">
                    {addr.value}
                  </p>
                  {addr.mapUrl && (
                    <a
                      href={addr.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 rounded bg-cream/10 px-3 py-1.5 font-body text-[10px] font-bold uppercase tracking-wide text-cream transition-colors hover:bg-gold hover:text-navy"
                    >
                      <FaMapMarkerAlt className="h-3 w-3" />
                      Ver no mapa
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

{/* Seção Inferior: Copyright e Assinatura Ação Leve */}
      <div className="mx-auto mt-12 flex max-w-5xl flex-col items-center justify-between gap-6 border-t border-cream/10 pt-6 font-mono text-xs text-cream/40 md:flex-row md:gap-4">
        
 <div className="mx-auto mt-10 max-w-5xl border-t border-cream/10 pt-6 text-center">
        <p className="font-mono text-xs text-cream/40">
          © {new Date().getFullYear()} {name ?? 'Paróquia Nossa Senhora Aparecida'}. Todos os direitos reservados.
        </p>
        <div className="mt-2 flex justify-center gap-4 font-body text-xs text-cream/50">
          <a href="/termos-de-uso" className="hover:text-gold">Termos de Uso</a>
          <span className="text-cream/20">·</span>
          <a href="/privacidade" className="hover:text-gold">Política de Privacidade</a>
        </div>
      </div>
        
        {/* Lado Direito: Container Agrupado da Assinatura */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          
          {/* Powered By */}
          <p className="flex items-center gap-1.5">
            <FaCode className="h-3 w-3" />
            <span>Powered by</span>
            <a
              href="https://acaoleve.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-cream/70 transition-colors hover:text-gold"
            >
              João Denadai
            </a>
          </p>
          
          {/* Separador Visual (Oculto no Mobile, Visível no Desktop) */}
          <span className="hidden h-3 w-px bg-cream/20 sm:block" aria-hidden="true" />
          
          {/* Instagram */}
          <p className="flex items-center gap-1.5">
            <FaInstagram className="h-3 w-3" />
            <a
              href="https://www.instagram.com/dnadai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-cream/70 transition-colors hover:text-gold"
            >
              @dnadai
            </a>
          </p>

        </div>
      </div>
    </footer>
  )
}