"use client";

import React from "react";

interface Props {
  targetId: string;
}

const targetStyles: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  ALL: { bg: "#8BC34A", text: "#FFFFFF", border: "#8BC34A" },
  boys: { bg: "#3C2465", text: "#FFFFFF", border: "#3C2465" },
  boysA: { bg: "#673AB7", text: "#FFFFFF", border: "#673AB7" },
  boysB: { bg: "#FFFFFF", text: "#673AB7", border: "#673AB7" },
  girls: { bg: "#811C1C", text: "#FFFFFF", border: "#811C1C" },
  girlsA: { bg: "#D32F2F", text: "#FFFFFF", border: "#D32F2F" },
  girlsB: { bg: "#FFFFFF", text: "#D32F2F", border: "#D32F2F" },
};

const targetNames: Record<string, string> = {
  ALL: "ALL",
  boys: "男子",
  boysA: "男子A",
  boysB: "男子B",
  girls: "女子",
  girlsA: "女子A",
  girlsB: "女子B",
};

export const CalendarTargetLabel = ({ targetId }: Props) => {
  const style = targetStyles[targetId] || targetStyles.ALL;
  const name = targetNames[targetId] || targetId;

  return (
    <div
      className="flex items-center justify-center border"
      style={{
        width: "44px",
        fontSize: "12px",
        borderRadius: "20px",
        backgroundColor: style.bg,
        color: style.text,
        borderColor: style.border,
        borderWidth: "1px",
        padding: "2px 0",
        marginTop: "4px",
        lineHeight: "1",
      }}
    >
      {name}
    </div>
  );
};
