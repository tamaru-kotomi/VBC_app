"use client";

import { TARGET_CONFIG } from "@/features/calendar/constants/targetStyles";

interface TargetLabelProps {
  targetId: string;
}

export const TargetLabel = ({ targetId }: TargetLabelProps) => {
  const config = TARGET_CONFIG[targetId] || TARGET_CONFIG.ALL;

  return (
    <div
      className="flex items-center justify-center w-[120px] h-[37px] rounded-[20px] text-[24px] font-bold"
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
