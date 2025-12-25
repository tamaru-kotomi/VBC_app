"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import ScheduleForm from "@/features/calendar/components/ScheduleForm";

function CreateScheduleContent() {
  const searchParams = useSearchParams();
  const isNew = searchParams.get("isNew") === "true";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* ヘッダー部分はページ側で管理 */}
      <div className="w-full">
        <Header
          title={isNew ? "スケジュール登録" : "スケジュール編集"}
          showClose={false}
        />
      </div>

      <div className="w-full max-w-[375px]">
        {/* フォーム本体を呼び出す */}
        <ScheduleForm />
      </div>
    </div>
  );
}

export default function CreateSchedulePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <CreateScheduleContent />
    </Suspense>
  );
}
