"use client";

import { TARGET_CONFIG } from "@/features/calendar/constants/targetStyles";

interface Props {
  targetId: string;
}

export const CalendarTargetLabel = ({ targetId }: Props) => {
  // ★ 共通設定からデータを取得。なければ ALL をデフォルトにする
  const config = TARGET_CONFIG[targetId] || TARGET_CONFIG.ALL;

  return (
    <div
      className="flex items-center justify-center border"
      style={{
        width: "44px",
        fontSize: "12px",
        borderRadius: "20px",
        backgroundColor: config.bg,
        color: config.text,
        borderColor: config.border || config.bg,
        borderWidth: "1px",
        padding: "2px 0",
        marginTop: "4px",
        lineHeight: "1",
      }}
    >
      {config.name}
    </div>
  );
};
