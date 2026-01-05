// vbc-app/auth.config.ts
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

      // 未ログインならログイン画面へ（これだけに絞る）
      if (!isLoggedIn && isCalendarPage) {
        return false;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
