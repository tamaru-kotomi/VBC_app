import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Prismaの接続を初期化
const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // 1. フロントエンド（page.tsx）から送られてきたJSONデータを受け取る
    const body = await request.json();

    // 2. 送られてきた年・月・日を、DBが理解できる「Date型」に変換する
    // JavaScriptのDateは月が0から始まるので -1 する
    const scheduleDate = new Date(
      parseInt(body.year),
      parseInt(body.month) - 1,
      parseInt(body.day)
    );

    // 3. データベースに保存する（ここがあなたの書いた心臓部です！）
    const result = await prisma.schedule.create({
      data: {
        date: scheduleDate,
        title: body.title,
        time: body.time || null,
        location: body.location || null,
        otherLocation: body.otherLocation || null,
        targetId: body.target, // ラジオボタンで選ばれたID（ALL, boysAなど）
        content: body.content || null,
      },
    });

    // 4. 成功したよ！という返事と、保存されたデータをフロントエンドに返す
    return NextResponse.json(result);
  } catch (error) {
    // 5. 万が一エラーが起きた場合の処理
    console.error("保存時にエラーが発生しました:", error);
    return NextResponse.json(
      { error: "スケジュールの保存に失敗しました。" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const schedules = await prisma.schedule.findMany({
      orderBy: {
        date: "asc",
      },
    });
    return NextResponse.json(schedules);
  } catch (error) {
    return NextResponse.json({ error: "取得失敗" }, { status: 500 });
  }
}
