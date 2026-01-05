import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// 1. NextAuth から auth 関数を取得
const { auth } = NextAuth(authConfig);

// 2. Next.js が認識できるように "middleware" という名前の関数として export する
export default auth((req) => {
  // ここに独自のロジックを書くこともできますが、
  // authConfig.callbacks.authorized で判定しているので、基本はこのままでOKです。
});

export const config = {
  // 画像や静的ファイルを対象外にする
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
