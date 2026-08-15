// src/components/admin/AdminTabsNav.tsx
'use client'

import { useRouter } from 'next/navigation'

export type AdminTab = { id: string; label: string; requiresAdmin?: boolean }

export function AdminTabsNav({
  tabs,
  currentTab,
  isGlobalAdmin = true,
}: {
  tabs: AdminTab[]
  currentTab: string
  isGlobalAdmin?: boolean
}) {
  const router = useRouter()

  const visibleTabs = tabs.filter((tab) => !tab.requiresAdmin || isGlobalAdmin)

  return (
    <div className="mt-6 flex flex-wrap gap-2 border-b border-line pb-3">
      {visibleTabs.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => router.push(`?tab=${id}`)}
          className={`rounded-full border px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-wide transition-colors ${
            currentTab === id
              ? 'border-navy bg-navy text-cream'
              : 'border-line text-navy/60 hover:bg-navy/5'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
