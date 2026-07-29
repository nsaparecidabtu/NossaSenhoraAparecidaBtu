// src/types/next-auth.d.ts

import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      staffRole: 'SUPER_ADMIN' | 'MINISTRY_LEADER' | null
      ministryId: string | null
      permissions: string[]
    } & DefaultSession['user']
  }
}