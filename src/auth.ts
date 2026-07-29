// src/auth.ts

import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './lib/prisma'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google], // lê AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET do .env
  session: { strategy: 'database' },
  callbacks: {
    session({ session, user }) {
      // Sessão em banco não expõe esses campos por padrão — os guards de
      // /admin e das rotas de ministério dependem deles existirem aqui.
      const dbUser = user as typeof user & {
        staffRole: 'SUPER_ADMIN' | 'MINISTRY_LEADER' | null
        ministryId: string | null
        permissions: string[]
      }

      if (session.user) {
        session.user.id = user.id
        session.user.staffRole = dbUser.staffRole
        session.user.ministryId = dbUser.ministryId
        session.user.permissions = dbUser.permissions
      }
      return session
    },
  },
})