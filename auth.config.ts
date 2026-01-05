// vbc-app/auth.config.ts
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = auth?.user?.isAdmin === true;

      const isProtectedPage = nextUrl.pathname.startsWith("/calendar");
      const isAdminOnlyPage = nextUrl.pathname.startsWith("/calendar/create");

      // 未ログインで保護ページへアクセス
      if (!isLoggedIn && isProtectedPage) {
        return false; // 自動的にログインページへ（Auth.jsが現在のドメインで処理）
      }

      // 一般ユーザーが管理者ページへアクセスしようとした場合
      if (isLoggedIn && isAdminOnlyPage && !isAdmin) {
        // 絶対パスではなく、現在のURLをベースにした相対リダイレクトを生成
        return Response.redirect(new URL("/calendar", nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
