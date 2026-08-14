// src/components/layout/MobileMenu.tsx

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

type NavLink = {
  label: string
  href: string
}

type MobileMenuProps = {
  links: NavLink[]
}

export function MobileMenu({ links }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  useEffect(() => {
    const originalOverflow = document.body.style.overflow

    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen])

  const openMenu = () => setIsOpen(true)
  const closeMenu = () => setIsOpen(false)

  return (
    <>
      <button
        type="button"
        onClick={openMenu}
        aria-label="Abrir menu"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        className="md:hidden relative z-50 flex h-10 w-10 items-center justify-center rounded-md text-[#172554] transition-colors hover:bg-[#172554]/10 focus:outline-none focus:ring-2 focus:ring-[#D4A72C] focus:ring-offset-2"
      >
        <Menu className="h-6 w-6" strokeWidth={2} />
      </button>

      <div
        id="mobile-navigation"
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-[9999] md:hidden ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={closeMenu}
          className={`absolute inset-0 h-full w-full cursor-default border-0 bg-[#0F172A]/60 backdrop-blur-[2px] transition-opacity duration-300 ease-out ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <aside
          aria-label="Menu de navegação"
          className={`absolute right-0 top-0 flex h-[100dvh] w-[min(85vw,320px)] flex-col bg-[#F8F5EC] text-[#172554] shadow-[-12px_0_40px_rgba(0,0,0,0.20)] transition-transform duration-300 ease-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-[#D8D2C5] bg-[#F8F5EC] px-5">
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4A72C]">
                Paróquia
              </span>
              <span className="mt-0.5 text-sm font-bold text-[#172554]">
                Nossa Senhora Aparecida
              </span>
            </div>

            <button
              type="button"
              onClick={closeMenu}
              aria-label="Fechar menu"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#172554] transition-colors hover:bg-[#172554]/10 focus:outline-none focus:ring-2 focus:ring-[#D4A72C]"
            >
              <X className="h-6 w-6" strokeWidth={2} />
            </button>
          </div>

          <nav
            aria-label="Navegação principal"
            className="flex flex-1 flex-col overflow-y-auto bg-[#F8F5EC] px-5 py-7"
          >
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="group flex min-h-[48px] items-center rounded-lg px-4 py-3 text-base font-semibold text-[#172554] transition-all duration-200 hover:bg-[#172554]/5 hover:text-[#B88914] focus:outline-none focus:ring-2 focus:ring-[#D4A72C]"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4A72C] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  <span className="ml-3">{link.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          <div className="shrink-0 border-t border-[#D8D2C5] bg-[#F8F5EC] px-6 py-5">
            <p className="text-center text-xs leading-relaxed text-[#64748B]">
              Lar de fé, esperança e devoção
            </p>
          </div>
        </aside>
      </div>
    </>
  )
}