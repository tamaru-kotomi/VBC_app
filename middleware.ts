import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// 1. NextAuth の設定から auth 関数を取得
const { auth } = NextAuth(authConfig);

// 2. Next.js が要求する「関数」の形でデフォルトエクスポートする
export default auth((req) => {
  // 認証後の追加ロジックが必要な場合はここに書く
});

export const config = {
  // 静的ファイルやAPIなどを除外する設定
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
