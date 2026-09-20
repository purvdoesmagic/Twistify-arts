import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import { User } from "@/app/models/user";
import { connectToDatabase } from "@/lib/mongodb";

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        portal: { label: "Portal", type: "text" },
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === "string" ? credentials.email.trim().toLowerCase() : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";
        const requiresAdminAccess = credentials?.portal === "admin";

        if (!email || !password) {
          return null;
        }

        await connectToDatabase();
        const user = await User.findOne({ email }).select("name email passwordHash role").lean();

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
          return null;
        }

        if (requiresAdminAccess && user.role !== "admin") {
          return null;
        }

        return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
});
