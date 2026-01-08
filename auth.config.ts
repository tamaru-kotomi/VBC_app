import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [],
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isCalendarPage = nextUrl.pathname.startsWith("/calendar");

      // 未ログインならログイン画面へ
      if (!isLoggedIn && isCalendarPage) {
        return false;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
