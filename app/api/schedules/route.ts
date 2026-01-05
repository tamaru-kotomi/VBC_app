import { NextResponse } from "next/server";
import { db } from "../../lib/db";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      id,
      year,
      month,
      day,
      title,
      time,
      location,
      otherLocation,
      target,
      content,
    } = data;

    const scheduleDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day)
    );

    // 保存・更新用データ
    const payload = {
      title,
      date: scheduleDate,
      time: time || null,
      location: location || null,
      otherLocation: otherLocation || null,
      targetId: target,
      content: content || null,
    };

    if (id) {
      // IDがある場合は「修正（反映）」
      await db.schedule.update({
        where: { id: id },
        data: payload,
      });
      return NextResponse.json({ success: true, message: "Updated" });
    } else {
      // IDがない場合は「新規登録」
      await db.schedule.create({
        data: payload,
      });
      return NextResponse.json({ success: true, message: "Created" });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "保存に失敗しました" }, { status: 500 });
  }
}
