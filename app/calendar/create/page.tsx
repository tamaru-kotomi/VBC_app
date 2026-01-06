import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/Header";
import ScheduleForm from "@/features/schedules/components/ScheduleForm";

export default async function CreateSchedulePage() {
  // サーバー側で最新のセッションを取得
  const session = await auth();

  // 1. セッションがない、または isAdmin が true でない場合は即座にカレンダーへ戻す
  if (!session?.user?.isAdmin) {
    redirect("/calendar");
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-full">
        <Header title="スケジュール管理" showClose={false} />
      </div>
      <div className="w-full max-w-[375px]">
        {/* URLパラメータを扱うコンポーネントには Suspense が必須 */}
        <Suspense
          fallback={
            <div className="p-10 text-center text-[16px] font-bold">
              読み込み中...
            </div>
          }
        >
          <ScheduleForm />
        </Suspense>
      </div>
    </div>
  );
}
