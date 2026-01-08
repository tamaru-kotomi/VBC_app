import { Schedule } from "@prisma/client";

// Prismaの型から「自動生成されるIDや日付」を除いた、フォーム入力用の型を作る
// Omitを使うことで、既存の型を再利用しつつ必要なものだけ抽出
export type ScheduleFormData = Omit<
  Schedule,
  "id" | "date" | "createdAt" | "updatedAt"
> & {
  // 日付はフォーム上では分解して扱うので、ここでカスタム定義
  year: string;
  month: string;
  day: string;
};
