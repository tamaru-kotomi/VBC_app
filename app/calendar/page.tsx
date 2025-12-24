import { auth } from "@/auth";
import prisma from "../lib/prisma";
import CalendarWrapper from "../components/CalendarWrapper";

export default async function CalendarPage() {
  const schedules = await prisma.schedule.findMany();
  const session = await auth();

  return (
    <div className="min-h-screen bg-white relative">
      <CalendarWrapper initialSchedules={schedules} />
    </div>
  );
}
