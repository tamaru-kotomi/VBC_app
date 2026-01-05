/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // 1. auth.config.ts の軽量設定（Middlewareと共有）を読み込む
  ...authConfig,

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
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user || !user.password) {
            console.log("❌ ユーザーが見つかりません");
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isValid) {
            console.log("❌ パスワードが一致しません");
            return null;
          }

          console.log("✅ 認証成功:", user.email);

          // 成功：セッションにデータを渡す
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
    // トークンに isAdmin フラグを付与
    async jwt({ token, user }: any) {
      if (user) {
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    // セッションで isAdmin を参照可能にする
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).isAdmin = token.isAdmin;
      }
      return session;
    },
  },

  // JWTベースのセッション管理
  session: { strategy: "jwt" },

  secret: process.env.AUTH_SECRET,

  debug: process.env.NODE_ENV === "development",
});
