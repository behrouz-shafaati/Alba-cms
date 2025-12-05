import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'
import userCtrl from '@/features/user/controller'
import { User } from '@/features/user/interface'
const bcrypt = require('bcryptjs')

export async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await userCtrl.findOne({ filters: { email } })
    return user
  } catch (error) {
    console.error('Failed to fetch user:', error)
    throw new Error('Failed to fetch user.')
  }
}

export const authOptions = {
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          const user = await getUser(email)
          if (!user) return null

          // evaluate password
          const passwordsMatch = await bcrypt.compare(password, user.password)

          // const user = {
          //   id: user.id,
          //   email: user.email,
          //   name: user?.name,
          //   roles: user.roles,
          //   picture: '#',
          // };
          if (passwordsMatch) return user
        }
        // Invalid credentials
        return null
      },
    }),
  ],
  callbacks: {
    async jwt(obj) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      const user = (await getUser(obj.token.email)) as User
      // console.log('#8723 user:', user);
      const sessionUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
      }
      obj.token.user = sessionUser
      return obj.token
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      if (token) session.user = token.user

      return session
    },
  },
}

export const { auth, signIn, signOut, handlers } = NextAuth(authOptions)
