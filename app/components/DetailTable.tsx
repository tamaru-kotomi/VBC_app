"use client";

import React from "react";
import { TARGET_CONFIG } from "./TargetLabel";

interface DetailItem {
  label: string;
  value: string;
}

interface DetailTableProps {
  items: DetailItem[];
  targetId: string;
  maxHeight?: string;
}

export const DetailTable = ({
  items,
  targetId,
  maxHeight = "266px",
}: DetailTableProps) => {
  const config = TARGET_CONFIG[targetId] || TARGET_CONFIG.ALL;

  return (
    <div
      className="w-full border-[2px] border-[#9D9D9D] overflow-y-auto overflow-x-hidden"
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
                    {/* dt: 項目名 */}
                    <dt
                      className="w-[100px] flex-shrink-0 flex items-center px-[8px] py-[9px] text-[20px] font-bold leading-tight"
                      style={{
                        backgroundColor: config.bg,
                        color: config.text,
                        // 男子B/女子B等の枠線を2pxに。
                        // ベタ塗りのタイプも、右側の線を2pxに合わせると統一感が出ます。
                        border: config.border
                          ? `2px solid ${config.border}`
                          : "none",
                        borderRight: !config.border
                          ? `2px solid ${config.bg}` // ベタ塗りの場合、右側だけ2pxの境界線を引く
                          : `2px solid ${config.border}`,
                      }}
                    >
                      {item.label === "内容・連絡事項" ? (
                        <>
                          内容・
                          <br />
                          連絡事項
                        </>
                      ) : (
                        item.label
                      )}
                    </dt>
                    {/* dd: 内容 */}
                    <dd className="flex-1 flex items-center px-[12px] py-[10px] text-[16px] leading-tight break-all bg-white">
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
};
