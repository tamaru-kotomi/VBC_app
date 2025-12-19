"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import Image from "next/image";
import Header from "../components/Header";

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
  const router = useRouter();
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

  // 曜日の色を取得する関数
  const getDayColor = (date: Date) => {
    const dayEn = format(date, "EEE").toUpperCase(); // "SAT", "SUN" 等
    if (dayEn === "SUN") return "#C20000";
    if (dayEn === "SAT") return "#5343CD";
    return "#090C26";
  };

  // 登録画面へ遷移する関数
  const handleAddSchedule = () => {
    if (selectedDay) {
      // 日付を YYYY-MM-DD 形式でパラメータとして渡す
      const dateStr = format(selectedDay, "yyyy-MM-dd");
      router.push(`/calendar/create?date=${dateStr}`);
    }
  };

  return (
    <div className="w-full max-w-[375px] mx-auto text-[#090C26]">
      {/* 1. 年月ナビゲーション */}
      <div className="flex items-end justify-between mb-6 w-full">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className={`flex items-end text-[20px] font-bold transition-colors leading-none ${
            !canGoPrev ? "cursor-not-allowed" : "hover:opacity-60"
          }`}
          style={{ color: canGoPrev ? "#090C26" : "#999999" }}
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
            />
          </div>
          前月
        </button>

        <h2 className="text-[36px] font-bold tracking-tighter leading-none text-[#090C26]">
          {format(currentMonth, "yyyy/MM")}
        </h2>

        <button
          onClick={nextMonth}
          disabled={!canGoNext}
          className={`flex items-end text-[20px] font-bold transition-colors leading-none ${
            !canGoNext ? "cursor-not-allowed" : "hover:opacity-60"
          }`}
          style={{ color: canGoNext ? "#090C26" : "#999999" }}
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
            />
          </div>
        </button>
      </div>

      {/* 2. 曜日ヘッダー */}
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

      {/* 3. カレンダーグリッド */}
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
              <span
                className={`absolute left-[4px] top-[4px] text-[16px] font-bold leading-none ${
                  !isCurrentMonth ? "text-[#9D9D9D]" : "text-[#090C26]"
                }`}
              >
                {format(day, "d")}
              </span>
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
        className={`fixed inset-0 z-[110] bg-white transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${
          selectedDay ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <Header
          showClose={true}
          onClose={() => setSelectedDay(null)}
          title="詳細"
        />

        <main className="py-[36px] px-[16px] h-[calc(100vh-120px)] overflow-y-auto relative">
          {selectedDay && (
            <div className="flex flex-col items-center">
              {/* 日付表示 */}
              <h3 className="text-[36px] font-bold tracking-tighter leading-none mb-[24px] text-[#090C26]">
                {format(selectedDay, "yyyy/MM/dd")}
                <span>（</span>
                <span style={{ color: getDayColor(selectedDay) }}>
                  {format(selectedDay, "EEE").toUpperCase()}
                </span>
                <span>）</span>
              </h3>

              {/* コンテンツエリア */}
              <div className="w-full px-[16px]">
                {/* 予定リスト表示エリア */}
              </div>

              {/* 追従プラスアイコン: 右16px, 下36px */}
              {/* mainの中に置くことでスライドイン内でのみ追従させます */}
              <button
                onClick={handleAddSchedule}
                className="fixed right-[16px] bottom-[36px] w-[60px] h-[60px] hover:opacity-80 transition-opacity drop-shadow-lg"
              >
                <Image
                  src="/images/icons/icon_plus.png"
                  alt="予定を追加"
                  width={60}
                  height={60}
                />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
