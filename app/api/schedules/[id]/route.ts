import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { auth } from "@/auth"; // ★認証チェック用に追加

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. 認証チェック
    const session = await auth();

    // ログインしていない、または管理者フラグが false の場合は拒否
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: "この操作を行う権限がありません" },
        { status: 403 }
      );
    }

    // 2. paramsをawaitして中身を取り出す
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "IDが指定されていません" },
        { status: 400 }
      );
    }

    // 3. DBから削除
    await db.schedule.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true, message: "削除が完了しました" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json(
      { error: "データの削除に失敗しました" },
      { status: 500 }
    );
  }
}
