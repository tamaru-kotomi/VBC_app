import React from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameDay,
} from "date-fns";
import { ja } from "date-fns/locale";
import prisma from "../lib/prisma";
import Header from "../components/Header";

export default async function CalendarPage() {
  // 1. データベースから予定を取得（最新のNext.jsの書き方：Server Component）
  const schedules = await prisma.schedule.findMany();

  // 2. 今月のカレンダーの日付を計算
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const calendarStart = startOfWeek(monthStart, { locale: ja });
  const calendarEnd = endOfWeek(monthEnd, { locale: ja });

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  return (
    <div className="min-h-screen bg-slate-50 relative">
      <Header showGear={true} />

      {/* 2. メインコンテンツ（上36px, 左右8pxの余白。フィルターの下に潜り込むよう z-0 を指定） */}
      <main className="pt-[36px] px-[8px] pb-8 relative z-0">
        <div className="max-w-4xl mx-auto">
          {/* カレンダー外枠 */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* 曜日ヘッダー: ヘッダー色と統一 */}
            <div className="grid grid-cols-7 bg-[#090C26] text-white text-center py-2 text-sm font-medium">
              {["日", "月", "火", "水", "木", "金", "土"].map((day) => (
                <div key={day} className="py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* カレンダー日付グリッド */}
            <div className="grid grid-cols-7 border-l border-t border-slate-100">
              {calendarDays.map((day) => {
                // その日の予定をフィルタリング
                const daySchedules = schedules.filter((s) =>
                  isSameDay(new Date(s.date), day)
                );

                return (
                  <div
                    key={day.toString()}
                    className="min-h-[100px] p-1 border-r border-b border-slate-100 bg-white"
                  >
                    {/* 日付数字: 今月以外は薄く表示 */}
                    <span
                      className={`text-xs font-medium block mb-1 ${
                        format(day, "MM") !== format(today, "MM")
                          ? "text-slate-300"
                          : "text-slate-700"
                      }`}
                    >
                      {format(day, "d")}
                    </span>

                    {/* 予定リスト */}
                    <div className="space-y-1">
                      {daySchedules.map((item) => (
                        <div
                          key={item.id}
                          className="text-[10px] p-1 rounded bg-blue-50 text-blue-700 border border-blue-100 truncate shadow-sm"
                          title={item.title}
                        >
                          {item.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
