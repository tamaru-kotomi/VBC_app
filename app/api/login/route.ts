import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { User } from "@prisma/client"; // Prismaから直接型をインポート

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "メールアドレスとパスワードを入力してください" },
        { status: 400 }
      );
    }

    // 戻り値の型を明示的に User | null に指定
    const user: User | null = await prisma.user.findUnique({
      where: { email },
    });

    // ユーザーが存在しない、またはパスワードが不一致の場合
    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: "メールアドレスまたはパスワードが違います" },
        { status: 401 }
      );
    }

    // 成功時
    return NextResponse.json({
      success: true,
      user: {
        email: user.email,
        isAdmin: user.isAdmin,
        grades: user.grades, // Int[] が正しく反映されていればエラーになりません
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
