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
  isAfter,
  isBefore,
  startOfDay,
} from "date-fns";
import Image from "next/image";
import Header from "../components/Header";
import DetailTable from "./DetailTable";
import { TargetLabel } from "./TargetLabel";
import { Modal } from "./Modal";
import Button from "../components/Button";

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
  const today = startOfDay(new Date());

  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingSchedule, setDeletingSchedule] = useState<Schedule | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const canGoPrev = isAfter(monthStart, startOfMonth(subMonths(new Date(), 1)));
  const canGoNext = isBefore(
    monthStart,
    startOfMonth(addMonths(new Date(), 1))
  );

  const isSelectedPast = selectedDay
    ? isBefore(startOfDay(selectedDay), today)
    : false;

  const handleAddSchedule = () => {
    if (selectedDay && !isSelectedPast) {
      const dateStr = format(selectedDay, "yyyy-MM-dd");
      router.push(`/calendar/create?date=${dateStr}&isNew=true`);
    }
  };

  const handleEdit = (schedule: Schedule) => {
    const dateObj = new Date(schedule.date);
    const params = new URLSearchParams({
      id: schedule.id,
      date: format(dateObj, "yyyy-MM-dd"),
      title: schedule.title || "",
      time: schedule.time || "",
      location: schedule.location || "",
      otherLocation: schedule.otherLocation || "",
      target: schedule.targetId,
      content: schedule.content || "",
      isNew: "false",
    });
    router.push(`/calendar/create?${params.toString()}`);
  };

  const confirmDelete = (schedule: Schedule) => {
    setDeletingSchedule(schedule);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingSchedule || isDeleting) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/schedules/${deletingSchedule.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setSchedules((prev) =>
          prev.filter((s) => s.id !== deletingSchedule.id)
        );
        setIsDeleteModalOpen(false);
        setDeletingSchedule(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getDayColor = (date: Date) => {
    const dayEn = format(date, "EEE").toUpperCase();
    if (dayEn === "SUN") return "#C20000";
    if (dayEn === "SAT") return "#5343CD";
    return "#090C26";
  };

  return (
    <div className="w-full max-w-[375px] mx-auto text-[#090C26]">
      {/* カレンダーヘッダー */}
      <div className="flex items-center justify-between mb-6 w-full px-[8px]">
        <button
          onClick={() =>
            canGoPrev && setCurrentMonth(subMonths(currentMonth, 1))
          }
          className={`flex items-center gap-[4px] text-[20px] font-bold ${
            !canGoPrev ? "opacity-50" : ""
          }`}
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
          />
          <span>前月</span>
        </button>
        <h2 className="text-[36px] font-bold tracking-tighter leading-none">
          {format(currentMonth, "yyyy/MM")}
        </h2>
        <button
          onClick={() =>
            canGoNext && setCurrentMonth(addMonths(currentMonth, 1))
          }
          className={`flex items-center gap-[4px] text-[20px] font-bold ${
            !canGoNext ? "opacity-50" : ""
          }`}
        >
          <span>次月</span>
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

      {/* 曜日表示 */}
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

      {/* カレンダー本体 */}
      <div className="border-[2px] border-[#9D9D9D] bg-[#9D9D9D] grid grid-cols-7 gap-[1px] overflow-hidden rounded-[2px]">
        {calendarDays.map((day) => {
          const daySchedules = schedules.filter((s) =>
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

      {/* 詳細スライドインモーダル */}
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

              <div className="w-full space-y-10 pb-[120px]">
                {(() => {
                  const filteredSchedules = schedules.filter((s) =>
                    isSameDay(new Date(s.date), selectedDay)
                  );

                  // スケジュールが1件もない場合の表示
                  if (filteredSchedules.length === 0) {
                    return (
                      <div className="w-full text-center">
                        <p className="text-[16px] font-bold text-[#090C26]">
                          現在、表示できるスケジュールはありません。
                        </p>
                      </div>
                    );
                  }

                  // スケジュールがある場合の表示
                  return filteredSchedules.map((schedule) => {
                    const isPast = isBefore(
                      startOfDay(new Date(schedule.date)),
                      today
                    );
                    return (
                      <div key={schedule.id} className="w-full">
                        <div className="flex justify-between items-center mb-[8px]">
                          <TargetLabel targetId={schedule.targetId} />
                          <div className="flex gap-[16px]">
                            <button
                              onClick={() => !isPast && handleEdit(schedule)}
                              disabled={isPast}
                              className="flex flex-col items-center gap-[2px]"
                            >
                              <Image
                                src={
                                  isPast
                                    ? "/images/icons/icon_edit_gray.png"
                                    : "/images/icons/icon_edit.png"
                                }
                                alt="編集"
                                width={32}
                                height={32}
                              />
                              <span
                                className="text-[12px] font-bold"
                                style={{
                                  color: isPast ? "#999999" : "#090C26",
                                }}
                              >
                                編集
                              </span>
                            </button>
                            <button
                              onClick={() => confirmDelete(schedule)}
                              className="flex flex-col items-center gap-[2px]"
                            >
                              <Image
                                src="/images/icons/icon_trash.png"
                                alt="削除"
                                width={32}
                                height={32}
                              />
                              <span className="text-[12px] font-bold text-[#090C26]">
                                削除
                              </span>
                            </button>
                          </div>
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
                    );
                  });
                })()}
              </div>

              {/* 追加ボタン */}
              <button
                onClick={() => !isSelectedPast && handleAddSchedule()}
                disabled={isSelectedPast}
                className={`fixed right-[16px] bottom-[36px] z-[120] ${
                  isSelectedPast ? "cursor-not-allowed" : ""
                }`}
              >
                <Image
                  src={
                    isSelectedPast
                      ? "/images/icons/icon_plus_gray.png"
                      : "/images/icons/icon_plus.png"
                  }
                  alt="追加"
                  width={96}
                  height={96}
                />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* 削除確認モーダル */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        buttons={
          <div className="flex flex-row gap-[16px] justify-center w-full">
            <Button
              label="YES"
              activeBgColor="#090C26"
              onClick={handleDelete}
              disabled={isDeleting}
            />
            <Button
              label="NO"
              activeBgColor="#143875"
              onClick={() => setIsDeleteModalOpen(false)}
            />
          </div>
        }
      >
        <div className="py-[20px] text-center flex flex-col items-center gap-[4px]">
          {deletingSchedule && (
            <>
              <p className="text-[16px] font-bold text-[#090C26] leading-tight">
                {format(new Date(deletingSchedule.date), "yyyy/MM/dd")}{" "}
                {targetStyles[deletingSchedule.targetId]?.name || ""}
              </p>
              <p className="text-[16px] font-bold text-[#090C26] leading-tight">
                「{deletingSchedule.title}」
              </p>
              <p className="text-[16px] font-bold text-[#090C26] leading-tight mt-[8px]">
                の予定を本当に削除しますか？
              </p>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
