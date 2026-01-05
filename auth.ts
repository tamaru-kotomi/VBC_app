/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
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
          // データベースからユーザーを取得
          const dbUser = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!dbUser || !dbUser.password) {
            console.log("❌ ユーザーが見つかりません");
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password as string,
            dbUser.password
          );

          if (!isValid) {
            console.log("❌ パスワードが一致しません");
            return null;
          }

          console.log("✅ 認証成功:", dbUser.email);

          // ここで返却するオブジェクトが、下の jwt コールバックの 'user' に入ります
          return {
            id: dbUser.id.toString(),
            email: dbUser.email,
            isAdmin: dbUser.isAdmin === true, // ここでisAdminを付与
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    // auth.config.ts の authorized 判定を上書きしないようにマージ
    ...authConfig.callbacks,

    // トークン作成時（ログイン時）に user オブジェクトから isAdmin を抽出して保持
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.isAdmin = user.isAdmin;
      }
      return token;
    },

    // セッションに isAdmin を書き込む（これでページ側から参照可能になる）
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.isAdmin = !!token.isAdmin;
      }
      return session;
    },
  },

  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});
