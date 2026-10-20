import type { NextAuthConfig } from "next-auth";

// A fresh clone has no AUTH_SECRET. A fixed fallback is only safe when no real accounts can
// exist to impersonate: in development, or with no database. Production with a database must set it.
const fallbackSecret =
  process.env.NODE_ENV !== "production" || !process.env.MONGODB_URI
    ? "twistify-arts-insecure-local-secret"
    : undefined;

export const authConfig = {
  secret: process.env.AUTH_SECRET ?? fallbackSecret,
  trustHost: true,
  providers: [],
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.id === "string" && typeof token.role === "string") {
        session.user.id = token.id;
        session.user.role = token.role === "admin" ? "admin" : "customer";
      }

      return session;
    },
  },
} satisfies NextAuthConfig;
