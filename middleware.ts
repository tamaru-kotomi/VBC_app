import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  const session = await auth();
  const isLoggedIn = !!session;
  // session.user.isAdmin が true かどうかを確認
  const isAdmin = session?.user?.isAdmin === true;

  const { nextUrl } = req;

  // 1. 全ユーザー（一般・管理者）がログイン必須のページ
  const isProtectedPage = nextUrl.pathname.startsWith("/calendar");

  // 2. 管理者だけがアクセスできるページ (ここを修正)
  const isAdminOnlyPage = nextUrl.pathname.startsWith("/calendar/create");

  // --- 判定ロジック ---

  // A. 未ログイン 且つ 保護ページへのアクセス -> ログイン画面へ
  if (!isLoggedIn && isProtectedPage) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // B. ログイン済み 且つ 管理者専用ページへのアクセス 且つ 管理者ではない場合
  if (isLoggedIn && isAdminOnlyPage && !isAdmin) {
    // 一般ユーザーをカレンダーTOP（閲覧専用）に強制移動させる
    console.log(
      "🚫 一般ユーザーによる管理者ページへのアクセスをブロックしました"
    );
    return NextResponse.redirect(new URL("/calendar", nextUrl));
  }

  return NextResponse.next();
}

// APIや静的ファイルをミドルウェアの対象外にする
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
