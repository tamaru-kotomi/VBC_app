"use client";

import React from "react";
import { Modal } from "@/components/Modal";
import Button from "@/components/Button";
import { TargetLabel } from "@/components/TargetLabel";
import DetailTable from "@/features/calendar/components/DetailTable";

interface ScheduleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  isNew: boolean;
  data: {
    year: string;
    month: string;
    day: string;
    title: string;
    time: string;
    location: string;
    otherLocation: string;
    target: string;
    content: string;
  };
}

export default function ScheduleFormModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
  isNew,
  data,
}: ScheduleFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      buttons={
        <div className="flex justify-center w-full">
          <Button
            label={isNew ? "ADD" : "EDIT"}
            activeBgColor="#090C26"
            onClick={onConfirm}
            disabled={isSubmitting}
          />
        </div>
      }
    >
      <div className="flex flex-col">
        <div className="w-full flex justify-start mb-[18px]">
          <TargetLabel targetId={data.target} />
        </div>
        <DetailTable
          targetId={data.target}
          items={[
            { label: "日付", value: `${data.year}/${data.month}/${data.day}` },
            { label: "タイトル", value: data.title },
            { label: "時間", value: data.time || "指定なし" },
            {
              label: "場所",
              value:
                data.location === "その他"
                  ? data.otherLocation
                  : data.location || "指定なし",
            },
            { label: "内容・連絡事項", value: data.content || "-" },
          ]}
        />
      </div>
    </Modal>
  );
}
