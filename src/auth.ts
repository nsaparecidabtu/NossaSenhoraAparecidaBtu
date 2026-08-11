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
    async session({ session, user }) {
      // Buscamos diretamente no banco os dados mais recentes do usuário para garantir 
      // que alterações de cargo feitas no painel reflitam imediatamente sem precisar re-login obrigatório.
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          staffRole: true,
          ministryId: true,
          permissions: true,
        },
      })

      if (session.user && dbUser) {
        session.user.id = user.id
        session.user.staffRole = dbUser.staffRole
        session.user.ministryId = dbUser.ministryId
        session.user.permissions = dbUser.permissions
      }
      
      return session
    },
  },
})