// vbc-app/auth.config.ts
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [],
  trustHost: true,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = auth?.user?.isAdmin === true;

      // 遷移先の絶対URLを生成する際に、現在のリクエストのホストを利用するように強制
      const isProtectedPage = nextUrl.pathname.startsWith("/calendar");
      const isAdminOnlyPage = nextUrl.pathname.startsWith("/calendar/create");

      if (!isLoggedIn && isProtectedPage) {
        // ログイン画面へ飛ばす際も URL オブジェクトを使ってドメインを固定
        const loginUrl = new URL("/login", nextUrl.origin);
        return Response.redirect(loginUrl);
      }

      if (isLoggedIn && isAdminOnlyPage && !isAdmin) {
        // 現在のドメイン (nextUrl.origin) を使ってリダイレクト先を生成
        return Response.redirect(new URL("/calendar", nextUrl.origin));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
