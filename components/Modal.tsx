"use client";

import React, { useEffect } from "react";
import Image from "next/image";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  buttons?: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, children, buttons }: ModalProps) => {
  // モーダル表示時背景のスクロールを禁止
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#999999]/80"
      onClick={onClose} // モーダル本体外クリックで閉じる
    >
      {/* モーダル本体 */}
      <div
        className="relative w-[351px] bg-white rounded-[4px] shadow-lg flex flex-col"
        onClick={(e) => e.stopPropagation()} // 本体クリック時のイベント伝搬を阻止
      >
        {/* クローズアイコン */}
        <button
          onClick={onClose}
          className="absolute right-[12px] top-[24px] w-[44px] h-[44px] hover:opacity-70 transition-opacity z-[210]"
        >
          <Image
            src="/images/icons/icon_close.png"
            alt="閉じる"
            width={44}
            height={44}
          />
        </button>

        {/* コンテンツエリア */}
        <div className="mt-[92px] px-[12px] pb-[24px]">{children}</div>

        {/* ボタンエリア*/}
        {buttons && (
          <div className="px-[12px] pb-[24px] flex justify-center gap-[24px]">
            {buttons}
          </div>
        )}
      </div>
    </div>
  );
};
