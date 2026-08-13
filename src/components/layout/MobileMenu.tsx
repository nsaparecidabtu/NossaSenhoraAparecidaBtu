// src/components/layout/MobileMenu.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

type NavLink = {
  label: string
  href: string
}

export function MobileMenu({ links }: { links: NavLink[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Fecha o menu automaticamente quando a rota muda
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Trava o scroll da página (body) quando o menu estiver aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <div className="md:hidden flex items-center">
      {/* Botão Hamburger */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative z-50 flex items-center justify-center rounded-md p-2 text-navy hover:bg-navy/10 transition-colors"
        aria-label="Abrir menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* 
        OVERLAY e DRAWER
        Usamos fixed para cobrir a tela inteira. 
        O pointer-events-none controla se podemos clicar no fundo quando fechado.
      */}
      <div 
        className={`fixed inset-0 z-[100] transition-all duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Fundo escuro clicável para fechar */}
        <div 
          className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
        
        {/* Painel lateral direito (Drawer) com animação nativa */}
        <div 
          className={`absolute right-0 top-0 h-full w-[260px] bg-cream shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Cabeçalho do Drawer (Botão Fechar) */}
          <div className="flex items-center justify-end border-b border-line p-4">
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center rounded-md p-2 text-navy hover:bg-navy/10 transition-colors"
              aria-label="Fechar menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Links de Navegação */}
          <nav className="flex flex-col p-6 space-y-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-display text-lg font-bold text-navy hover:text-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}