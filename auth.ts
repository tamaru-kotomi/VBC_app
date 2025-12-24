/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("入力されたメール:", credentials?.email);
        console.log("入力されたパスワード:", credentials?.password);

        // 1. 管理者ユーザーの判定
        if (
          credentials?.email === "admin@example.com" &&
          credentials?.password === "password"
        ) {
          return {
            id: "1",
            name: "Admin User",
            email: "admin@example.com",
            isAdmin: true, // 管理者フラグ
          };
        }

        // 2. 一般ユーザーの判定（追加）
        if (
          credentials?.email === "test@example.com" &&
          credentials?.password === "password123"
        ) {
          return {
            id: "2",
            name: "General User",
            email: "test@example.com",
            isAdmin: false, // 一般ユーザーは false
          };
        }

        // どちらにも一致しない場合は認証失敗
        return null;
      },
    }),
  ],
  callbacks: {
    // JWTトークンに isAdmin を持たせる
    async jwt({ token, user }: any) {
      if (user) {
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    // セッションオブジェクトに isAdmin を持たせる（フロントエンドで使えるようにする）
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).isAdmin = token.isAdmin;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  // クッキーが焼けない問題を解決するための強制設定
  secret: "vbc-app-super-secret-key-1234567890",
  trustHost: true,
  basePath: "/api/auth",
  cookies: {
    sessionToken: {
      name: `authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: false,
      },
    },
  },
  debug: true,
});
