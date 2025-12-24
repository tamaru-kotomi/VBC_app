import { auth } from "@/auth";
import prisma from "../lib/prisma";
import CalendarWrapper from "../components/CalendarWrapper";

export default async function CalendarPage() {
  // 1. データベースから全予定を取得
  const schedules = await prisma.schedule.findMany();

  // 2. セッション情報の取得
  const session = await auth();

  return (
    <div className="min-h-screen bg-white relative">
      {/* isAdmin フラグを CalendarWrapper に渡します。
        session?.user?.isAdmin が存在すれば true、なければ false となります。
      */}
      <CalendarWrapper
        initialSchedules={schedules}
        isAdmin={!!session?.user?.isAdmin}
      />
    </div>
  );
}
