"use client";

import React from "react";

interface CommonInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isError?: boolean;
}

export const CommonInput = ({
  isError,
  className = "",
  ...props
}: CommonInputProps) => {
  const baseClass =
    "w-full border border-[#9D9D9D] px-[8px] text-[20px] rounded-[4px] focus:outline-none focus:border-[2px] focus:border-[#090C26] transition-all h-[52px]";
  // エラー時は背景色を #00C6FF の 20% に変更
  const errorClass = isError ? "bg-[#00C6FF]/20" : "bg-white";

  return (
    <input
      {...props}
      className={`${baseClass} ${errorClass} ${className} disabled:bg-[#D9D9D9] disabled:text-transparent disabled:cursor-not-allowed`}
    />
  );
};
