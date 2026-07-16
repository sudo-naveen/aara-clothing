import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import authConfig from "@/auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const username = credentials.username as string;
        const password = credentials.password as string;

        const user = await prisma.user.findUnique({
          where: { username },
        });

        if (!user) {
          return null;
        }

        if (!user.isActive) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          username: user.username,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.username = (user as { username: string }).username;
        token.isAdmin = (user as { isAdmin: boolean }).isAdmin;
      }
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string | null;
        (session.user as { username: string }).username = token.username as string;
        (session.user as unknown as { isAdmin: boolean }).isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
});
