"use client";

import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import ScheduleForm from "@/features/calendar/components/ScheduleForm";

export default function CreateSchedulePage() {
  const searchParams = useSearchParams();
  const isNew = searchParams.get("isNew") === "true";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-full">
        <Header
          title={!isNew ? "スケジュール編集" : "スケジュール登録"}
          showClose={false}
        />
      </div>

      <div className="w-full max-w-[375px]">
        {/* 複雑な入力フォームとロジックはすべてこの中 */}
        <ScheduleForm />
      </div>
    </div>
  );
}
