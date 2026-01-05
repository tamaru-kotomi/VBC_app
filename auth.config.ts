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
      if (!isLoggedIn && isProtectedPage) return false;

      // 一般ユーザーが管理者ページへアクセス
      if (isLoggedIn && isAdminOnlyPage && !isAdmin) {
        return Response.redirect(new URL("/calendar", nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
