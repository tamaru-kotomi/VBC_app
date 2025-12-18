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
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-900">
            🏐 {format(today, "yyyy年 M月", { locale: ja })} の予定
          </h1>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            ジュニアバレー
          </span>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* 曜日ヘッダー */}
          <div className="grid grid-cols-7 bg-blue-900 text-white text-center py-2 text-sm font-medium">
            {["日", "月", "火", "水", "木", "金", "土"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* カレンダーマス */}
          <div className="grid grid-cols-7 border-l border-t border-slate-100">
            {calendarDays.map((day) => {
              const daySchedules = schedules.filter((s) =>
                isSameDay(new Date(s.date), day)
              );

              return (
                <div
                  key={day.toString()}
                  className="min-h-[100px] p-2 border-r border-b border-slate-100 bg-white"
                >
                  <span
                    className={`text-sm font-medium ${
                      format(day, "MM") !== format(today, "MM")
                        ? "text-slate-300"
                        : "text-slate-700"
                    }`}
                  >
                    {format(day, "d")}
                  </span>

                  <div className="mt-1 space-y-1">
                    {daySchedules.map((item) => (
                      <div
                        key={item.id}
                        className="text-[10px] p-1 rounded bg-blue-50 text-blue-700 border border-blue-100 truncate"
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
    </div>
  );
}
