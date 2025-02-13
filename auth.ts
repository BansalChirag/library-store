import NextAuth, { User } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./database";
import { usersTable } from "./database/schema";
import { eq } from "drizzle-orm";
import bcryptjs from "bcryptjs";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, credentials.email.toString()))
          .limit(1);
        if (user.length === 0) return null;
        const isPasswordValid = bcryptjs.compare(
          user[0].password,
          credentials.password.toString()
        );
        if (!isPasswordValid) {
          return null;
        }
        return {
          id: user[0].id.toString(),
          email: user[0].email,
          name: user[0].email,
        } as User;
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user, isNewUser, account, profile }) {
      console.log("🚀 ~ jwt ~ account:", account);
      console.log("🚀 ~ jwt ~ profile:", profile);
      console.log("🚀 ~ jwt ~ isNewUser:", isNewUser);
      if (user) {
        (token.id = user.id), (token.name = user.name);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
});
