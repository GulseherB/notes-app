import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { CredentialsType, LoggedInUser } from "@/data/types/auth";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      authorize: async (credentials, req) => {
        try {
          const { email, password } = credentials as CredentialsType;

          const response = await axios.post(
            `${process.env.NEXTAUTH_URL}/api/auth/login`,
            { email, password },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          if (response.data) {
            const data = response.data;
            // NextAuth authorize() MUST return an object with a top-level "id"
            // so that token.sub is properly initialized
            return {
              id: data.user?.id?.toString() || "",
              access_token: data.access_token,
              refresh_token: data.refresh_token,
              expires_at: data.expires_at,
              user: data.user,
            } as any;
          }
          return null;
        } catch (error) {
          console.error('Login error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 gün
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 gün
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      // İlk giriş — user objesi sadece login anında gelir
      if (user) {
        const loggedInUser = user as any;
        token.access_token = loggedInUser.access_token;
        token.refresh_token = loggedInUser.refresh_token;
        token.expires_at = loggedInUser.expires_at;
        token.role = loggedInUser.user?.role;
        token.user = loggedInUser.user;
        // sub zaten authorize()'un döndürdüğü id'den gelir
        // ama güvence olarak tekrar set edelim
        token.sub = loggedInUser.id || loggedInUser.user?.id?.toString();
        token.email = loggedInUser.user?.email;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        // token.user içindeki tüm kullanıcı bilgilerini session.user'a aktar
        if (token.user) {
          session.user = {
            ...(token.user as any),
            id: token.sub,
          };
        }
        (session as any).accessToken = token.access_token;
        (session as any).role = token.role;
        (session as any).sub = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

export default NextAuth(authOptions);
