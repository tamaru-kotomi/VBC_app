"use client";

import React, { useEffect } from "react";
import Image from "next/image";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  buttons?: React.ReactNode; // ボタンエリアを受け取るprops
}

export const Modal = ({ isOpen, onClose, children, buttons }: ModalProps) => {
  // モーダル表示時に背景のスクロールを禁止する
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

        {/* コンテンツエリア (クローズアイコンの24px下から開始) */}
        <div className="mt-[92px] px-[12px] pb-[24px]">
          {/* アイコン上24px + アイコン44px + 余白24px = 92px 
            左右余白12px, 下余白24px
          */}
          {children}
        </div>

        {/* ボタンエリア (コンテンツから24px下) */}
        {buttons && (
          <div className="px-[12px] pb-[24px] flex justify-center gap-[24px]">
            {/* 1つの時は中央、2つの時はgap 24pxで並ぶ */}
            {buttons}
          </div>
        )}
      </div>
    </div>
  );
};
