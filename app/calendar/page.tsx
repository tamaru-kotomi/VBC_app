import prisma from "../lib/prisma";
import Header from "../components/Header";
import Calendar from "../components/Calendar";

export default async function CalendarPage() {
  const schedules = await prisma.schedule.findMany();

  return (
    <div className="min-h-screen bg-white relative">
      <Header showGear={true} />

      <main className="py-[36px] px-[8px]">
        {/* クライアントコンポーネントにデータを渡す */}
        <Calendar initialSchedules={schedules} />
      </main>
    </div>
  );
}
