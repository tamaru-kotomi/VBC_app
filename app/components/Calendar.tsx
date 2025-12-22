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
import DetailTable from "./DetailTable";
import { TargetLabel } from "./TargetLabel"; // ラベル用コンポーネントをインポート

const targetStyles: Record<
  string,
  { bg: string; text: string; border: string; name: string }
> = {
  ALL: { bg: "#8BC34A", text: "#FFFFFF", border: "#8BC34A", name: "ALL" },
  boys: { bg: "#3C2465", text: "#FFFFFF", border: "#3C2465", name: "男子" },
  boysA: { bg: "#673AB7", text: "#FFFFFF", border: "#673AB7", name: "男子A" },
  boysB: { bg: "#FFFFFF", text: "#673AB7", border: "#673AB7", name: "男子B" },
  girls: { bg: "#811C1C", text: "#FFFFFF", border: "#811C1C", name: "女子" },
  girlsA: { bg: "#D32F2F", text: "#FFFFFF", border: "#D32F2F", name: "女子A" },
  girlsB: { bg: "#FFFFFF", text: "#D32F2F", border: "#D32F2F", name: "女子B" },
};

interface Schedule {
  id: string;
  title: string;
  date: Date | string;
  time?: string | null;
  location?: string | null;
  otherLocation?: string | null;
  targetId: string;
  content?: string | null;
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

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const canGoPrev = isAfter(monthStart, startOfMonth(subMonths(today, 1)));
  const canGoNext = isBefore(monthStart, startOfMonth(addMonths(today, 1)));

  const getDayColor = (date: Date) => {
    const dayEn = format(date, "EEE").toUpperCase();
    if (dayEn === "SUN") return "#C20000";
    if (dayEn === "SAT") return "#5343CD";
    return "#090C26";
  };

  const handleAddSchedule = () => {
    if (selectedDay) {
      const dateStr = format(selectedDay, "yyyy-MM-dd");
      router.push(`/calendar/create?date=${dateStr}&isNew=true`);
    }
  };

  return (
    <div className="w-full max-w-[375px] mx-auto text-[#090C26]">
      {/* 1. 年月ナビゲーション */}
      <div className="flex items-end justify-between mb-6 w-full px-[8px]">
        <button
          onClick={() =>
            canGoPrev && setCurrentMonth(subMonths(currentMonth, 1))
          }
          className="flex items-end text-[20px] font-bold"
        >
          <Image
            src={
              canGoPrev
                ? "/images/icons/icon_prev.png"
                : "/images/icons/icon_prev_gray.png"
            }
            alt="前"
            width={18}
            height={18}
          />{" "}
          前月
        </button>
        <h2 className="text-[36px] font-bold tracking-tighter leading-none">
          {format(currentMonth, "yyyy/MM")}
        </h2>
        <button
          onClick={() =>
            canGoNext && setCurrentMonth(addMonths(currentMonth, 1))
          }
          className="flex items-end text-[20px] font-bold"
        >
          次月{" "}
          <Image
            src={
              canGoNext
                ? "/images/icons/icon_next.png"
                : "/images/icons/icon_next_gray.png"
            }
            alt="次"
            width={18}
            height={18}
          />
        </button>
      </div>

      {/* 2. 曜日ヘッダー */}
      <div className="grid grid-cols-7 mb-[4px] text-center text-[16px] font-bold">
        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
          <div
            key={day}
            style={{
              color:
                day === "SUN"
                  ? "#C20000"
                  : day === "SAT"
                  ? "#5343CD"
                  : "#090C26",
            }}
          >
            {day}
          </div>
        ))}
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
              className="relative h-[142px] bg-white cursor-pointer hover:bg-slate-50"
            >
              <span
                className={`absolute left-[4px] top-[4px] text-[16px] font-bold ${
                  !isCurrentMonth ? "text-[#9D9D9D]" : "text-[#090C26]"
                }`}
              >
                {format(day, "d")}
              </span>
              <div className="mt-[24px] flex flex-col items-center">
                {daySchedules.map((item) => {
                  const style = targetStyles[item.targetId] || targetStyles.ALL;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-center border font-bold"
                      style={{
                        width: "44px",
                        fontSize: "12px",
                        borderRadius: "20px",
                        backgroundColor: style.bg,
                        color: style.text,
                        borderColor: style.border,
                        borderWidth: "1px",
                        padding: "2px 0",
                        marginTop: "4px",
                        lineHeight: "1",
                        textAlign: "center",
                      }}
                    >
                      {style.name}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. 詳細スライドイン */}
      <div
        className={`fixed inset-0 z-[110] bg-white transition-transform duration-500 ${
          selectedDay ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <Header
          showClose={true}
          onClose={() => setSelectedDay(null)}
          title="詳細"
        />
        <main className="py-[36px] px-[16px] h-[calc(100vh-120px)] overflow-y-auto">
          {selectedDay && (
            <div className="flex flex-col items-center">
              <h3 className="text-[36px] font-bold tracking-tighter mb-[24px]">
                {format(selectedDay, "yyyy/MM/dd")}
                <span>（</span>
                <span style={{ color: getDayColor(selectedDay) }}>
                  {format(selectedDay, "EEE").toUpperCase()}
                </span>
                <span>）</span>
              </h3>

              {/* 左右のpaddingを0に調整 (w-fullのみにし、px-8を除去) */}
              <div className="w-full space-y-10 pb-[100px]">
                {initialSchedules
                  .filter((s) => isSameDay(new Date(s.date), selectedDay))
                  .map((schedule) => (
                    <div key={schedule.id} className="w-full">
                      {/* ラベル部分を TargetLabel コンポーネントに変更 */}
                      <div className="mb-3">
                        <TargetLabel targetId={schedule.targetId} />
                      </div>

                      <DetailTable
                        targetId={schedule.targetId}
                        items={[
                          { label: "タイトル", value: schedule.title },
                          { label: "時間", value: schedule.time || "未設定" },
                          {
                            label: "場所",
                            value:
                              schedule.location === "その他"
                                ? schedule.otherLocation || "未設定"
                                : schedule.location || "未設定",
                          },
                          {
                            label: "内容・連絡事項",
                            value: schedule.content || "-",
                          },
                        ]}
                      />
                    </div>
                  ))}
              </div>

              <button
                onClick={handleAddSchedule}
                className="fixed right-[16px] bottom-[36px] z-[120]"
              >
                <Image
                  src="/images/icons/icon_plus.png"
                  alt="追加"
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
