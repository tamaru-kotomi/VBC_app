"use client";

import React, { useState } from "react";
import Image from "next/image";
import CustomInput from "./CustomInput";
import Button from "./Button";

interface HeaderProps {
  title?: string;
  showClose?: boolean;
  showGear?: boolean;
  onClose?: () => void;
}

export default function Header({
  title,
  showClose = false,
  showGear = false,
  onClose,
}: HeaderProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({
    ALL: true,
    boys: true,
    boysA: true,
    boysB: true,
    girls: true,
    girlsA: true,
    girlsB: true,
  });
  const [backupCheckedItems, setBackupCheckedItems] = useState<{
    [key: string]: boolean;
  } | null>(null);

  const hasSelection = Object.values(checkedItems).some((val) => val === true);

  const filterOptions = [
    {
      id: "ALL",
      name: "ALL",
      value: "0",
      selectedColor: "#8BC34A",
      selectedTextColor: "#fff",
      selectedBorderColor: "#8BC34A",
    },
    {
      id: "boys",
      name: "男子",
      value: "1",
      selectedColor: "#3C2465",
      selectedTextColor: "#fff",
      selectedBorderColor: "#3C2465",
    },
    {
      id: "boysA",
      name: "男子A",
      value: "2",
      selectedColor: "#673AB7",
      selectedTextColor: "#fff",
      selectedBorderColor: "#673AB7",
    },
    {
      id: "boysB",
      name: "男子B",
      value: "3",
      selectedColor: "#ffffff",
      selectedTextColor: "#673AB7",
      selectedBorderColor: "#673AB7",
    },
    {
      id: "girls",
      name: "女子",
      value: "4",
      selectedColor: "#811C1C",
      selectedTextColor: "#fff",
      selectedBorderColor: "#811C1C",
    },
    {
      id: "girlsA",
      name: "女子A",
      value: "5",
      selectedColor: "#D32F2F",
      selectedTextColor: "#fff",
      selectedBorderColor: "#D32F2F",
    },
    {
      id: "girlsB",
      name: "女子B",
      value: "6",
      selectedColor: "#ffffff",
      selectedTextColor: "#D32F2F",
      selectedBorderColor: "#D32F2F",
    },
  ];

  const handleCheckboxChange = (id: string, isChecked: boolean) => {
    setCheckedItems((prev) => ({ ...prev, [id]: isChecked }));
  };

  const handleGearClick = () => {
    if (!isFilterOpen) {
      setBackupCheckedItems({ ...checkedItems });
      setIsFilterOpen(true);
    } else {
      if (backupCheckedItems) setCheckedItems(backupCheckedItems);
      setIsFilterOpen(false);
    }
  };

  const filterfunction = () => {
    setIsFilterOpen(false);
    setBackupCheckedItems(null);
  };
  const cancelFilter = () => {
    if (backupCheckedItems) setCheckedItems(backupCheckedItems);
    setIsFilterOpen(false);
  };
  const handleOverlayClick = () => {
    if (backupCheckedItems) setCheckedItems(backupCheckedItems);
    setIsFilterOpen(false);
  };

  const isDetailMode = showClose && title;

  return (
    <>
      <header className="relative w-full z-[100] leading-tight">
        <div className="relative w-full h-[120px] bg-[#090C26] overflow-hidden">
          {/* クローズボタン: 右上 (右16px, 上28px) */}
          {showClose && (
            <button
              onClick={onClose}
              className="absolute right-[16px] top-[28px] w-[44px] h-[44px] hover:opacity-70 z-[110]"
            >
              <Image
                src="/images/icons/icon_close_white.png"
                alt="Close"
                width={44}
                height={44}
              />
            </button>
          )}

          {/* タイトル表示 */}
          {title && (
            <h1
              className={`text-white font-bold leading-none tracking-wider absolute ${
                isDetailMode
                  ? "left-[16px] bottom-[16px] text-[40px]"
                  : "w-full text-center top-1/2 -translate-y-1/2 text-xl"
              }`}
            >
              {title}
            </h1>
          )}

          {/* ギアマーク */}
          {showGear && !isDetailMode && (
            <button
              onClick={handleGearClick}
              className="absolute right-4 bottom-4 w-[44px] h-[44px] hover:opacity-80 focus:outline-none"
            >
              <Image
                src="/images/icons/icon_gear.png"
                alt="Toggle Filter"
                width={44}
                height={44}
              />
            </button>
          )}
        </div>

        {/* フィルタードロップダウン */}
        <div
          className={`absolute top-[120px] left-0 w-full overflow-hidden transition-all duration-300 ease-in-out bg-[#090C26] z-[100] ${
            isFilterOpen ? "h-[566px]" : "h-0"
          }`}
        >
          <div className="mx-[16px] my-[36px] bg-[#fff] rounded-[4px] h-[calc(566px-72px)] overflow-y-auto shadow-xl">
            <div className="text-[#090C26] py-[36px]">
              <p className="font-bold text-[16px] text-center">
                カレンダーに表示したい
                <br />
                カテゴリーを選択してください。
              </p>
              <p className="text-[14px] mt-[4px] text-center">※複数設定可能</p>

              <div className="flex justify-center w-full px-[8px] mt-[20px]">
                {/* グリッドレイアウトの修正 */}
                <div className="grid grid-cols-[repeat(3,min-content)] w-full max-w-[375px] justify-center gap-x-[clamp(8px,4vw,16px)] gap-y-[12px]">
                  {filterOptions.map((option, index) => {
                    const inputElement = (
                      <CustomInput
                        {...option}
                        type="checkbox"
                        label={option.name}
                        checked={checkedItems[option.id]}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleCheckboxChange(option.id, e.target.checked)
                        }
                      />
                    );

                    if (index === 0) {
                      return (
                        <React.Fragment key={option.id}>
                          <div className="col-start-1 w-fit h-fit">
                            {inputElement}
                          </div>
                          {/* 1行目の残りを空ける */}
                          <div className="col-start-2"></div>
                          <div className="col-start-3"></div>
                        </React.Fragment>
                      );
                    }
                    return (
                      <div key={option.id} className="w-fit h-fit">
                        {inputElement}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col items-center mt-10 space-y-[12px]">
                <Button
                  label="FILTER"
                  onClick={filterfunction}
                  disabled={!hasSelection}
                  activeBgColor="#090C26"
                />
                <Button
                  label="CANCEL"
                  onClick={cancelFilter}
                  disabled={false}
                  activeBgColor="#143875"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-[#9D9D9D]/50 z-[90]"
          onClick={handleOverlayClick}
        />
      )}
    </>
  );
}
