// src/auth.ts
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import type { StaffRole, StaffPermission } from '@prisma/client'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt', // Forçamos JWT para garantir persistência correta dos metadados de staff
  },
  callbacks: {
    async jwt({ token, user }) {
      // No momento do login, buscamos os dados atualizados no banco e guardamos no token
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          select: { id: true, staffRole: true, permissions: true },
        })

        if (dbUser) {
          token.id = dbUser.id
          token.staffRole = dbUser.staffRole
          token.permissions = dbUser.permissions
        }
      } else if (token.email && !token.staffRole) {
        // Fallback para garantir sincronia em requisições subsequentes
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
          select: { id: true, staffRole: true, permissions: true },
        })

        if (dbUser) {
          token.id = dbUser.id
          token.staffRole = dbUser.staffRole
          token.permissions = dbUser.permissions
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.staffRole = (token.staffRole as StaffRole | null) ?? null
        session.user.permissions = (token.permissions as StaffPermission[]) ?? []
      }
      return session
    },
  },
})