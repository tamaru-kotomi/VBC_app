"use client";

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  activeBgColor?: string; // 活性時の背景色
  activeTextColor?: string; // 活性時の文字色
  className?: string; // 追加のスタイル調整用
  type?: "button" | "submit" | "reset";
}

export default function Button({
  label,
  onClick,
  disabled = false,
  activeBgColor = "#090C26",
  activeTextColor = "#ffffff",
  className = "",
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        /* 共通スタイル: 250x58px, 24px, bold, 8px角丸, 中央揃え */
        w-[250px] h-[58px] 
        text-[24px] font-bold rounded-[8px]
        flex items-center justify-center
        transition-colors duration-200
        
        /* 非活性（disabled）時のスタイル */
        disabled:bg-[#D9D9D9] disabled:text-[#999999] disabled:cursor-not-allowed
        
        ${className}
      `}
      style={
        !disabled
          ? {
              backgroundColor: activeBgColor,
              color: activeTextColor,
            }
          : {}
      }
    >
      {label}
    </button>
  );
}
