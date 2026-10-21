import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import { normalizePhone } from "@/app/lib/format";
import { User } from "@/app/models/user";
import { connectToDatabase, isDatabaseConfigured } from "@/lib/mongodb";

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Email or phone", type: "text" },
        password: { label: "Password", type: "password" },
        portal: { label: "Portal", type: "text" },
      },
      async authorize(credentials) {
        const identifier = typeof credentials?.identifier === "string" ? credentials.identifier.trim() : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";
        const requiresAdminAccess = credentials?.portal === "admin";

        const email = identifier.includes("@") ? identifier.toLowerCase() : "";
        const phone = email ? null : normalizePhone(identifier);

        if ((!email && !phone) || !password || !isDatabaseConfigured()) {
          return null;
        }

        await connectToDatabase();
        const user = await User.findOne(email ? { email } : { phone }).select("name email passwordHash role").lean();

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
