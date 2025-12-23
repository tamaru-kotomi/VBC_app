import prisma from "../lib/prisma";
import CalendarWrapper from "../components/CalendarWrapper";

export default async function CalendarPage() {
  // データベースから全予定を取得
  const schedules = await prisma.schedule.findMany();

  return (
    <div className="min-h-screen bg-white relative">
      {/* 状態管理（フィルター）を行うWrapperにデータを渡す */}
      <CalendarWrapper initialSchedules={schedules} />
    </div>
  );
}
