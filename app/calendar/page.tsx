import { auth } from "@/auth";
import prisma from "@/app/lib/prisma";
import CalendarWrapper from "@/features/calendar/components/CalendarWrapper";
import Logout from "@/components/Logout";

export default async function CalendarPage() {
  // 1. データベースから全予定を取得
  const schedules = await prisma.schedule.findMany();

  // 2. セッション情報の取得
  const session = await auth();

  return (
    <div className="min-h-screen bg-white relative">
      {/* isAdmin フラグを CalendarWrapper に渡す。
        session?.user?.isAdmin が存在すれば true、なければ false とる。
      */}
      <CalendarWrapper
        initialSchedules={schedules}
        isAdmin={!!session?.user?.isAdmin}
      />
      <div className="pb-[36px] w-full flex justify-center">
        <Logout />
      </div>
    </div>
  );
}
