"use client";

import React from "react";

interface CustomInputProps {
  id: string;
  name: string;
  value: string;
  label: string;
  type: "checkbox" | "radio";
  selectedColor?: string;
  selectedTextColor?: string;
  selectedBorderColor?: string;
  defaultBorderColor?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CustomInput({
  id,
  name,
  value,
  label,
  type,
  selectedColor = "#090C26",
  selectedTextColor = "#fff",
  selectedBorderColor,
  defaultBorderColor = "#D9D9D9",
  checked,
  onChange,
}: CustomInputProps) {
  // 選択時の枠線色の決定
  const activeBorderColor = selectedBorderColor || selectedColor;

  return (
    <div className="relative inline-block box-border w-[100px] h-[44px]">
      {/* 標準のチェックボックスを非表示にし、クリック判定を全体に広げる */}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="peer absolute opacity-0 w-full h-full cursor-pointer z-10"
      />

      {/* デザインされたラベル部分 */}
      <label
        htmlFor={id}
        className={`
          flex items-center justify-center
          w-full h-full
          border-[2px] rounded-[30px]
          bg-[#D9D9D9] text-[#999999]
          font-bold text-[20px] leading-none
          py-[10px] text-center
          cursor-pointer transition-all duration-200
          
          /* 非選択時の枠線色 */
          border-[var(--default-border)]

          /* 選択時（peer-checked）のスタイル */
          peer-checked:bg-[var(--selected-bg)]
          peer-checked:text-[var(--selected-text)]
          peer-checked:border-[var(--selected-border)]
        `}
        style={
          {
            "--selected-bg": selectedColor,
            "--selected-text": selectedTextColor,
            "--selected-border": activeBorderColor,
            "--default-border": defaultBorderColor,
          } as React.CSSProperties
        }
      >
        {label}
      </label>
    </div>
  );
}
