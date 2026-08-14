// src/components/admin/HelpManual.tsx
import { ReactNode } from 'react'
import { BookOpen, LucideIcon } from 'lucide-react'

// 1. O Wrapper Principal
export function HelpRoot({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6 animate-[fadein_0.3s_ease] pb-12">
      {children}
    </div>
  )
}

// 2. O Cabeçalho Padrão
export function HelpHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 text-gold">
        <BookOpen className="h-6 w-6" />
        <h2 className="font-display text-xl font-bold text-navy">{title}</h2>
      </div>
      <p className="mt-2 font-body text-sm text-navy/70 leading-relaxed">
        {description}
      </p>
    </div>
  )
}

// 3. As Seções Padrão
export function HelpSection({ 
  icon: Icon, 
  title, 
  children 
}: { 
  icon?: LucideIcon | React.ComponentType<{ className?: string }>,
  title: string
  children: ReactNode 
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-sm space-y-3">
      <div className="flex items-center gap-2 text-navy">
        {Icon && <Icon className="h-5 w-5 text-gold" />}
        <h3 className="font-display text-base font-bold">{title}</h3>
      </div>
      <div className="font-body text-sm text-navy/70 space-y-2">
        {children}
      </div>
    </div>
  )
}