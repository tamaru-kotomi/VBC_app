/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // 1. DBからユーザーを取得
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          // 2. ユーザーが存在しない、またはパスワード未設定の場合は失敗
          if (!user || !user.password) {
            console.log("❌ ユーザーが見つかりません");
            return null;
          }

          // 3. パスワードの照合（ハッシュ化された値と比較）
          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isValid) {
            console.log("❌ パスワードが一致しません");
            return null;
          }

          console.log("✅ 認証成功:", user.email);

          // 4. 成功：セッションにデータを渡す
          return {
            id: user.id.toString(),
            email: user.email,
            isAdmin: user.isAdmin === true,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).isAdmin = token.isAdmin;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  basePath: "/api/auth",
  debug: process.env.NODE_ENV === "development",
});
