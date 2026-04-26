import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        return {
          id: "owner-default",
          name: credentials.username,
          email: `${credentials.username}@local.rental`,
          role: "owner"
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "staff";
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = (token.role as string) ?? "staff";
      return session;
    }
  },
  pages: {
    signIn: "/login"
  }
});

export { handler as GET, handler as POST };
