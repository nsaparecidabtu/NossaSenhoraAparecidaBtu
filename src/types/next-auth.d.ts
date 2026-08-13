// src/types/next-auth.d.ts
import type { StaffRole, StaffPermission } from '@prisma/client'
import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      staffRole: StaffRole | null
      permissions: StaffPermission[]
    } & DefaultSession['user']
  }

  interface User {
    staffRole?: StaffRole | null
    permissions?: StaffPermission[]
  }
}