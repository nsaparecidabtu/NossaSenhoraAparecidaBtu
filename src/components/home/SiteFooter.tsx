// src/components/home/SiteFooter.tsx
import { prisma } from '@/lib/prisma'
import { FaInstagram, FaFacebook, FaYoutube, FaWhatsapp, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'

// Função auxiliar para mapear o ícone correto baseado na categoria do banco
function getContactIcon(category: string) {
  switch (category) {
    case 'INSTAGRAM': return <FaInstagram className="h-4 w-4" />
    case 'FACEBOOK': return <FaFacebook className="h-4 w-4" />
    case 'YOUTUBE': return <FaYoutube className="h-4 w-4" />
    case 'WHATSAPP': return <FaWhatsapp className="h-4 w-4" />
    case 'PHONE': return <FaPhone className="h-4 w-4" />
    default: return null
  }
}

type Props = {
  name?: string | null
  phone?: string | null
  email?: string | null
}

export async function SiteFooter({ name, phone, email }: Props) {
  // Buscamos todos os contatos dinâmicos cadastrados no painel administrativo
  const contacts = await prisma.siteContact.findMany({
    orderBy: { createdAt: 'asc' }
  })

  // Separamos por categorias para facilitar a exibição organizada
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
            <img src="/favicon.svg" alt="Nossa Senhora Aparecida" className="h-7 w-7" />
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
            
            {/* Telefones cadastrados dinamicamente */}
            {phones.map(p => (
              <p key={p.id} className="flex items-center gap-2">
                <span className="text-gold text-xs">{p.label}:</span> {p.value}
              </p>
            ))}
          </div>

          {/* Redes Sociais dinâmicas */}
          {socialLinks.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {socialLinks.map(social => (
                <a
                  key={social.id}
                  href={social.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-cream/30 text-cream/70 transition-colors hover:border-gold hover:text-gold"
                >
                  {getContactIcon(social.category)}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Coluna 3: Endereços Dinâmicos cadastrados pelo Admin */}
        <div>
          <p className="font-body text-xs font-bold uppercase tracking-widest text-gold">
            Nossas Igrejas
          </p>
          
          <div className="mt-3 space-y-5">
            {addresses.map(addr => (
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
            ))}

            {addresses.length === 0 && (
              <p className="font-body text-xs text-cream/50 italic">Endereços em breve.</p>
            )}
          </div>
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-5xl border-t border-cream/10 pt-6 text-center font-mono text-xs text-cream/40">
        © {new Date().getFullYear()} {name ?? 'Paróquia Nossa Senhora Aparecida'}. Todos os direitos reservados.
      </p>
    </footer>
  )
}