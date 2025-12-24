"use client";

import React from "react";

// 表示用データ定義（CustomInputと共通の配色）
export const TARGET_CONFIG: Record<
  string,
  { name: string; bg: string; text: string; border?: string }
> = {
  ALL: { name: "ALL", bg: "#8BC34A", text: "#FFFFFF" },
  boys: { name: "男子", bg: "#3C2465", text: "#FFFFFF" },
  boysA: { name: "男子A", bg: "#673AB7", text: "#FFFFFF" },
  boysB: { name: "男子B", bg: "#FFFFFF", text: "#673AB7", border: "#673AB7" },
  girls: { name: "女子", bg: "#811C1C", text: "#FFFFFF" },
  girlsA: { name: "女子A", bg: "#D32F2F", text: "#FFFFFF" },
  girlsB: { name: "女子B", bg: "#FFFFFF", text: "#D32F2F", border: "#D32F2F" },
};

interface TargetLabelProps {
  targetId: string; // "ALL", "boys" など
}

export const TargetLabel = ({ targetId }: TargetLabelProps) => {
  const config = TARGET_CONFIG[targetId] || TARGET_CONFIG.ALL;

  return (
    <div
      className="flex items-center justify-center w-[120px] h-[37px] rounded-[20px] text-[24px] font-bold borderBox"
      style={{
        backgroundColor: config.bg,
        color: config.text,
        border: config.border ? `2px solid ${config.border}` : "none",
      }}
    >
      {config.name}
    </div>
  );
};
