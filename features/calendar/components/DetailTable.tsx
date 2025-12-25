"use client";

import React from "react";
// ★ 共通定数をインポート
import { TARGET_CONFIG } from "@/features/calendar/constants/targetStyles";

interface DetailItem {
  label: string;
  value: string;
}

interface DetailTableProps {
  items: DetailItem[];
  targetId: string;
  maxHeight?: string;
}

export default function DetailTable({
  items,
  targetId,
  maxHeight = "none",
}: DetailTableProps) {
  // ★ 共通定数から取得
  const config = TARGET_CONFIG[targetId] || TARGET_CONFIG.ALL;

  return (
    <div
      className="w-full border-[2px] border-[#9D9D9D] overflow-y-auto overflow-x-hidden bg-white"
      style={{ maxHeight }}
    >
      <div className="p-[4px]">
        <dl className="flex flex-col w-full text-[#090C26]">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <React.Fragment key={item.label}>
                <div
                  className={`flex flex-col w-full ${
                    index !== 0 ? "mt-[4px]" : ""
                  }`}
                >
                  <div
                    className={`flex items-stretch w-full ${
                      !isLast ? "pb-[4px]" : ""
                    }`}
                  >
                    <dt
                      className="w-[100px] flex-shrink-0 px-[8px] py-[9px] text-[20px] font-bold leading-tight"
                      style={{
                        backgroundColor: config.bg,
                        color: config.text,
                        border: config.border
                          ? `2px solid ${config.border}`
                          : "none",
                        // config.border が無い場合は背景色と同じ色で境界線を引く
                        borderRight: `2px solid ${config.border || config.bg}`,
                      }}
                    >
                      {item.label === "内容・連絡事項" ? (
                        <span>
                          内容・
                          <br />
                          連絡事項
                        </span>
                      ) : (
                        item.label
                      )}
                    </dt>
                    <dd className="flex-1 flex items-center px-[12px] py-[10px] text-[16px] leading-tight break-all bg-white font-medium whitespace-pre-wrap">
                      {item.value}
                    </dd>
                  </div>
                </div>
                {!isLast && <div className="h-[1px] w-full bg-[#D9D9D9]" />}
              </React.Fragment>
            );
          })}
        </dl>
      </div>
    </div>
  );
}
