"use client";

import { ChangeEvent } from "react";

interface SelectBoxProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  suffix?: string;
  width: string;
  bgColor?: string;
  placeholder?: string;
}

export const SelectBox = ({
  value,
  onChange,
  options,
  suffix,
  width,
  bgColor = "white",
  placeholder,
}: SelectBoxProps) => {
  const selectIconStyle = {
    backgroundImage: "url('/images/icons/icon_pulldown.png')",
  };

  return (
    <div className="flex items-end gap-[4px]">
      <select
        className="border border-[#9D9D9D] h-[52px] px-[8px] text-[20px] rounded-[4px] appearance-none bg-no-repeat bg-[right_8px_center] bg-[length:16px_16px] focus:outline-none focus:border-[2px] focus:border-[#090C26] text-[#090C26]"
        style={{ ...selectIconStyle, width: width, backgroundColor: bgColor }}
        value={value}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          onChange(e.target.value)
        }
      >
        {/* placeholder が渡された場合、未選択用の option として表示 */}
        {placeholder && (
          <option value="" disabled={value !== ""}>
            {placeholder}
          </option>
        )}

        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {/* suffix がある場合のみ表示 */}
      {suffix && (
        <span className="text-[20px] font-normal text-[#090C26] leading-[1.2]">
          {suffix}
        </span>
      )}
    </div>
  );
};
