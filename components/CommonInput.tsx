"use client";

import React, { ChangeEvent } from "react";

interface CommonInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  type?: string;
}

export const CommonInput = ({
  value,
  onChange,
  placeholder,
  disabled,
  className = "",
  type = "text", // デフォルトは text
}: CommonInputProps) => {
  return (
    <input
      type={type} // 指定された type を適用
      disabled={disabled}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`
        w-full h-[52px] border border-[#9D9D9D] px-[8px] rounded-[4px] text-[20px] outline-none font-medium
        focus:border-[2px] focus:border-[#090C26]
        placeholder:text-[#999999] 
        disabled:bg-[#D9D9D9] 
        disabled:opacity-100 
        disabled:cursor-not-allowed
        /* 入力中か空（placeholder表示中）かで色を切り替え */
        ${value === "" ? "text-[#999999]" : "text-[#090C26]"}
        ${className}
      `}
      style={{
        // iOS/Safariでdisabled時に文字が薄くなるのを防ぐ
        WebkitTextFillColor: disabled
          ? "#999999"
          : value === ""
          ? "#999999"
          : "#090C26",
        opacity: 1,
      }}
    />
  );
};
