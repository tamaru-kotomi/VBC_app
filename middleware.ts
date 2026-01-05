// vbc-app/middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// NextAuth(authConfig) から auth 関数を抽出し、デフォルトエクスポートします。
// これにより、auth.config.ts 内の authorized コールバックが Middleware として実行されます。
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  /*
   * 以下のパスを除外したすべてのリクエストに Middleware を適用します。
   * - api (NextAuth の API エンドポイント)
   * - _next/static (静的ファイル)
   * - _next/image (画像最適化)
   * - images (public/images フォルダ)
   * - favicon.ico (ファビコン)
   */
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
