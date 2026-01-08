"use client";

import React from "react";

interface FormItemProps {
  label: string;
  required?: boolean;
  error?: string | null;
  children: React.ReactNode;
}

export const FormItem = ({
  label,
  required,
  error,
  children,
}: FormItemProps) => {
  return (
    <div className="relative flex flex-col gap-[12px]">
      <div className="flex items-center gap-[4px] leading-none text-[#090C26]">
        <span className="text-[24px] font-bold">{label}</span>
        {required && (
          <span className="text-[20px] font-bold text-[#C20000]">＊</span>
        )}
      </div>
      {children}
      {error && (
        <p className="absolute left-0 -bottom-[20px] text-[#C20000] text-[14px] font-normal leading-none whitespace-nowrap">
          {error}
        </p>
      )}
    </div>
  );
};
