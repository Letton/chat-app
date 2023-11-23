import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter"
import { NextAuthOptions } from "next-auth"
import { db } from "./db"
import GoogleProvider from "next-auth/providers/google"


const getGoogleCredentials = () => {
  const clientId = process.env.GOOGLE_ID;
  const clientSecret = process.env.GOOGLE_SECRET;

  if (!clientId || clientId.length === 0) throw new Error('Missing GOOGLE_ID');
  if (!clientSecret || clientSecret.length === 0) throw new Error('Missing GOOGLE_SECRET');
  
  return {
    clientId,
    clientSecret
  }

}

export const authOptions = {
  adapter: UpstashRedisAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    "strategy": "jwt"
  },
  pages: {
    signIn: '/auth/signin',
  },
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret
    })
  ],
  callbacks: {
    async jwt({token, user}) {
      const dbUser = (await db.get(`user:${token.id}`)) as User | null;
    
      if (!dbUser) {
        token.id = user.id
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      }
    },
    async session({session, token}) {
      if (token) {
        session.user.id = token.id,
        session.user.name = token.name,
        session.user.email = token.email,
        session.user.image = token.picture
      }

      return session;
    },

    redirect() {
      return '/app'
    }
  }
} satisfies NextAuthOptions