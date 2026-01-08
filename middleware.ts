import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// auth 関数を取得
const { auth } = NextAuth(authConfig);

// デフォルトエクスポートを明示的に「関数」として定義する
export default auth((req) => {
  // 認証後の処理が必要な場合はここに書けますが、
  // authorized コールバック（auth.config.ts）がメインの判定を行う
});

export const config = {
  // 静的ファイルやAPIなどを除外する設定
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
