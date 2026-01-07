"use client";

import { useState, useEffect, useMemo } from "react";
import {
  format,
  isSameDay,
  isSameMonth,
  isAfter,
  isBefore,
  startOfDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  subMonths,
  addMonths,
} from "date-fns";
import Image from "next/image";
import Header from "@/components/Header";
import DetailTable from "@/features/calendar/components/DetailTable";
import { TargetLabel } from "@/components/TargetLabel";
import { Modal } from "@/components/Modal";
import Button from "@/components/Button";
import { Schedule } from "@/features/calendar/components/CalendarWrapper";
import { TARGET_CONFIG } from "@/features/calendar/constants/targetStyles";

interface CalendarProps {
  initialSchedules: Schedule[];
  activeFilters: string[];
  isAdmin: boolean;
}

export default function Calendar({
  initialSchedules,
  activeFilters,
  isAdmin,
}: CalendarProps) {
  // --- Hydration 対策 ---
  const [isMounted, setIsMounted] = useState(false);

  // --- State ---
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingSchedule, setDeletingSchedule] = useState<Schedule | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setSchedules(initialSchedules);
  }, [initialSchedules]);

  // --- カレンダー計算 ---
  const today = startOfDay(new Date());
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(monthStart, { weekStartsOn: 1 }),
        end: endOfWeek(monthEnd, { weekStartsOn: 1 }),
      }),
    [monthStart, monthEnd]
  );

  const canGoPrev = isAfter(monthStart, startOfMonth(subMonths(new Date(), 1)));
  const canGoNext = isBefore(
    monthStart,
    startOfMonth(addMonths(new Date(), 1))
  );

  const getFilteredSchedules = (list: Schedule[]) => {
    return list.filter((s) => activeFilters.includes(s.targetId));
  };

  const handleAddSchedule = () => {
    if (!selectedDay) return;
    const isPast = isBefore(startOfDay(selectedDay), today);
    if (isPast) return;

    const dateStr = format(selectedDay, "yyyy-MM-dd");
    const url = `/calendar/create?date=${dateStr}&isNew=true`;

    // 強制リロード遷移でNextAuthのセッション判定を確実にする
    window.location.assign(url);
  };

  const handleEdit = (schedule: Schedule) => {
    const isPast = isBefore(startOfDay(new Date(schedule.date)), today);
    if (isPast) return;

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
    const url = `/calendar/create?${params.toString()}`;

    window.location.assign(url);
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
    } catch (e) {
      console.error(e);
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

  if (!isMounted) return null;

  return (
    <div className="w-full max-w-[375px] mx-auto text-[#090C26]">
      {/* 月移動ナビゲーション */}
      <div className="flex items-center justify-between mb-6 w-full px-[8px]">
        <button
          onClick={() =>
            canGoPrev && setCurrentMonth(subMonths(currentMonth, 1))
          }
          className={`flex items-center gap-[4px] text-[20px] font-bold ${
            !canGoPrev ? "text-[#999999]" : ""
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
            !canGoNext ? "text-[#999999]" : ""
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

      <div className="border-[2px] border-[#9D9D9D] bg-[#9D9D9D] grid grid-cols-7 gap-[1px] overflow-hidden rounded-[2px]">
        {calendarDays.map((day) => {
          const rawDaySchedules = schedules.filter((s) =>
            isSameDay(new Date(s.date), day)
          );
          const daySchedules = getFilteredSchedules(rawDaySchedules);
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
                  const style =
                    TARGET_CONFIG[item.targetId] || TARGET_CONFIG.ALL;
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
                        borderColor: style.border || style.bg,
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

      {/* 詳細モーダル */}
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
                  const daySchedules = getFilteredSchedules(
                    schedules.filter((s) =>
                      isSameDay(new Date(s.date), selectedDay)
                    )
                  );
                  if (daySchedules.length === 0)
                    return (
                      <div className="w-full text-center">
                        <p className="text-[16px] font-bold text-[#090C26]">
                          現在、表示できるスケジュールはありません。
                        </p>
                      </div>
                    );
                  return daySchedules.map((schedule) => {
                    const isPast = isBefore(
                      startOfDay(new Date(schedule.date)),
                      today
                    );
                    return (
                      <div key={schedule.id} className="w-full">
                        <div className="flex justify-between items-center mb-[8px]">
                          <TargetLabel targetId={schedule.targetId} />
                          {isAdmin && (
                            <div className="flex gap-[16px]">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(schedule);
                                }}
                                className="flex flex-col items-center gap-[2px]"
                                style={{
                                  cursor: isPast ? "default" : "pointer",
                                }}
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  confirmDelete(schedule);
                                }}
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
                          )}
                        </div>
                        <DetailTable
                          targetId={schedule.targetId}
                          items={[
                            { label: "タイトル", value: schedule.title || "" },
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

              {isAdmin && (
                <button
                  onClick={handleAddSchedule}
                  className="fixed right-[16px] bottom-[36px] z-[120] cursor-pointer"
                >
                  <Image
                    src={
                      selectedDay && isBefore(startOfDay(selectedDay), today)
                        ? "/images/icons/icon_plus_gray.png"
                        : "/images/icons/icon_plus.png"
                    }
                    alt="追加"
                    width={96}
                    height={96}
                  />
                </button>
              )}
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
                {TARGET_CONFIG[deletingSchedule.targetId]?.name || ""}
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
