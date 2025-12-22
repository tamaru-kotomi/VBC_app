import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Promise型に変更
) {
  try {
    // paramsをawaitして中身を取り出す
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "IDが指定されていません" },
        { status: 400 }
      );
    }

    // DBから削除
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
