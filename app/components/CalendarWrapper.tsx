"use client";

import { useState } from "react";
import Header from "./Header";
import Calendar from "./Calendar";

// 共通のスケジュール型
export interface Schedule {
  id: string;
  title: string;
  date: Date | string;
  time?: string | null;
  location?: string | null;
  otherLocation?: string | null;
  targetId: string;
  content?: string | null;
}

export default function CalendarWrapper({
  initialSchedules,
}: {
  initialSchedules: Schedule[];
}) {
  // 初期値：すべてのラベルを表示対象にする
  const [activeFilters, setActiveFilters] = useState<string[]>([
    "ALL",
    "boys",
    "boysA",
    "boysB",
    "girls",
    "girlsA",
    "girlsB",
  ]);

  return (
    <>
      <Header
        showGear={true}
        onFilterApply={(selectedIds) => setActiveFilters(selectedIds)}
      />
      <main className="py-[36px] px-[8px]">
        <Calendar
          initialSchedules={initialSchedules}
          activeFilters={activeFilters}
        />
      </main>
    </>
  );
}
