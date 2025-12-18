"use client";

import React, { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameDay,
  isSameMonth,
  isBefore,
  isAfter,
} from "date-fns";
import { ja } from "date-fns/locale";
import Image from "next/image";

// Prismaのモデルに合わせて target を定義
interface Schedule {
  id: string;
  title: string;
  date: Date | string;
  target: string;
}

export default function Calendar({
  initialSchedules,
}: {
  initialSchedules: Schedule[];
}) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // 表示可能範囲（当月の前後1ヶ月）
  const minMonth = startOfMonth(subMonths(today, 1));
  const maxMonth = startOfMonth(addMonths(today, 1));

  // カレンダー計算（月曜日始まり）
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  // 前月・次月ボタンの活性判定
  const canGoPrev = isAfter(monthStart, minMonth);
  const canGoNext = isBefore(monthStart, maxMonth);

  const prevMonth = () =>
    canGoPrev && setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () =>
    canGoNext && setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <div className="w-full max-w-[375px] mx-auto text-[#090C26]">
      {/* 1. 年月ナビゲーション (下付き配置) */}
      <div className="flex items-end justify-between mb-6 w-full">
        {/* 前月ボタン */}
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className={`flex items-end text-[20px] font-bold transition-colors leading-none ${
            !canGoPrev ? "cursor-not-allowed" : "hover:opacity-60"
          }`}
          style={{ color: canGoPrev ? "#090C26" : "#D9D9D9" }}
        >
          <div className="relative w-[18px] h-[18px] mr-[4px] mb-[2px]">
            <Image
              src={
                canGoPrev
                  ? "/images/icons/icon_prev.png"
                  : "/images/icons/icon_prev_gray.png"
              }
              alt="前月"
              width={18}
              height={18}
              style={{ objectFit: "contain" }}
            />
          </div>
          前月
        </button>

        {/* 当月表示 (36px, YYYY/MM) */}
        <h2 className="text-[36px] font-bold tracking-tighter leading-none text-[#090C26]">
          {format(currentMonth, "yyyy/MM")}
        </h2>

        {/* 次月ボタン */}
        <button
          onClick={nextMonth}
          disabled={!canGoNext}
          className={`flex items-end text-[20px] font-bold transition-colors leading-none ${
            !canGoNext ? "cursor-not-allowed" : "hover:opacity-60"
          }`}
          style={{ color: canGoNext ? "#090C26" : "#D9D9D9" }}
        >
          次月
          <div className="relative w-[18px] h-[18px] ml-[4px] mb-[2px]">
            <Image
              src={
                canGoNext
                  ? "/images/icons/icon_next.png"
                  : "/images/icons/icon_next_gray.png"
              }
              alt="次月"
              width={18}
              height={18}
              style={{ objectFit: "contain" }}
            />
          </div>
        </button>
      </div>

      {/* 2. 曜日ヘッダー (MON始まり / 色分け) */}
      <div className="grid grid-cols-7 mb-[4px] text-center text-[16px] font-bold leading-none">
        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => {
          let textColor = "#090C26";
          if (day === "SUN") textColor = "#C20000";
          if (day === "SAT") textColor = "#5343CD";

          return (
            <div key={day} style={{ color: textColor }}>
              {day}
            </div>
          );
        })}
      </div>

      {/* 3. カレンダーグリッド (枠線: #9D9D9D) */}
      <div className="border-[2px] border-[#9D9D9D] bg-[#9D9D9D] grid grid-cols-7 gap-[1px] overflow-hidden rounded-[2px]">
        {calendarDays.map((day) => {
          const daySchedules = initialSchedules.filter((s) =>
            isSameDay(new Date(s.date), day)
          );
          const isCurrentMonth = isSameMonth(day, monthStart);

          return (
            <div
              key={day.toString()}
              onClick={() => setSelectedDay(day)}
              className="relative h-[142px] bg-white cursor-pointer hover:bg-slate-50 transition-colors"
            >
              {/* 日付: 16px, 左4px, 上4px */}
              <span
                className={`
                  absolute left-[4px] top-[4px] text-[16px] font-bold leading-none
                  ${!isCurrentMonth ? "text-[#9D9D9D]" : "text-[#090C26]"}
                `}
              >
                {format(day, "d")}
              </span>

              {/* カテゴリーラベル表示エリア (targetを使用) */}
              <div className="mt-[24px] flex flex-col gap-[2px] px-[2px]">
                {daySchedules.map((item) => (
                  <div
                    key={item.id}
                    className="text-[10px] py-[1px] px-[4px] rounded-[2px] bg-[#090C26] text-white truncate"
                  >
                    {item.target}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. 詳細スライドイン (100vh) */}
      <div
        className={`fixed inset-x-0 bottom-0 z-[110] bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.15)] transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${
          selectedDay ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ height: "100vh" }}
      >
        <div className="p-6">
          {selectedDay && (
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[22px] font-bold">
                {format(selectedDay, "M/d", { locale: ja })}
                <span className="text-[16px] ml-2">
                  ({format(selectedDay, "E", { locale: ja })})
                </span>
              </h3>
              <button
                onClick={() => setSelectedDay(null)}
                className="text-[14px] font-bold text-[#9D9D9D]"
              >
                閉じる
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
