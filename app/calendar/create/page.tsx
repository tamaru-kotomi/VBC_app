"use client";

import React, { useState, useMemo, ChangeEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { isBefore, startOfDay } from "date-fns";
import Header from "../../../components/Header";
import CustomInput from "../../../components/CustomInput";
import Button from "../../../components/Button";
import { FormItem } from "../../../components/FormItem";
import { CommonInput } from "../../../components/CommonInput";
import { SelectBox } from "../../../components/SelectBox"; // コンポーネントを使用
import { Modal } from "../../../components/Modal";
import { TargetLabel } from "../../../components/TargetLabel";
import DetailTable from "../../../features/calendar/components/DetailTable";

// 対象カテゴリーごとの色定義
const targetOptions = [
  {
    id: "ALL",
    name: "ALL",
    selectedColor: "#8BC34A",
    selectedTextColor: "#FFFFFF",
    selectedBorderColor: "#8BC34A",
  },
  {
    id: "boys",
    name: "男子",
    selectedColor: "#3C2465",
    selectedTextColor: "#FFFFFF",
    selectedBorderColor: "#3C2465",
  },
  {
    id: "boysA",
    name: "男子A",
    selectedColor: "#673AB7",
    selectedTextColor: "#FFFFFF",
    selectedBorderColor: "#673AB7",
  },
  {
    id: "boysB",
    name: "男子B",
    selectedColor: "#FFFFFF",
    selectedTextColor: "#673AB7",
    selectedBorderColor: "#673AB7",
  },
  {
    id: "girls",
    name: "女子",
    selectedColor: "#811C1C",
    selectedTextColor: "#FFFFFF",
    selectedBorderColor: "#811C1C",
  },
  {
    id: "girlsA",
    name: "女子A",
    selectedColor: "#D32F2F",
    selectedTextColor: "#FFFFFF",
    selectedBorderColor: "#D32F2F",
  },
  {
    id: "girlsB",
    name: "女子B",
    selectedColor: "#FFFFFF",
    selectedTextColor: "#D32F2F",
    selectedBorderColor: "#D32F2F",
  },
];

export default function CreateSchedulePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const scheduleId = searchParams.get("id");
  const queryDate = searchParams.get("date");
  const isNew = searchParams.get("isNew") === "true";
  const defaultDate = queryDate ? new Date(queryDate) : new Date();

  const [year, setYear] = useState(defaultDate.getFullYear().toString());
  const [month, setMonth] = useState(
    (defaultDate.getMonth() + 1).toString().padStart(2, "0")
  );
  const [day, setDay] = useState(
    defaultDate.getDate().toString().padStart(2, "0")
  );
  const [title, setTitle] = useState(searchParams.get("title") || "");
  const [time, setTime] = useState(searchParams.get("time") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [otherLocation, setOtherLocation] = useState(
    searchParams.get("otherLocation") || ""
  );
  const [target, setTarget] = useState(searchParams.get("target") || "ALL");
  const [content, setContent] = useState(searchParams.get("content") || "");

  const [error, setError] = useState<string | null>(null);
  const [isErrorBg, setIsErrorBg] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const daysOptions = useMemo(() => {
    const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
    return Array.from({ length: lastDay }, (_, i) =>
      (i + 1).toString().padStart(2, "0")
    );
  }, [year, month]);

  const handleCheck = () => {
    const selectedDate = startOfDay(
      new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    );
    const today = startOfDay(new Date());
    if (isBefore(selectedDate, today)) {
      setError("※過去の日付を指定することはできません");
      setIsErrorBg(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setError(null);
    setIsErrorBg(false);
    setIsModalOpen(true);
  };

  const handleRegister = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: scheduleId,
          year,
          month,
          day,
          title,
          time,
          location,
          otherLocation,
          target,
          content,
        }),
      });
      if (response.ok) {
        router.push("/calendar");
        router.refresh();
      } else {
        alert("保存に失敗しました。");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTextColor = (val: string) =>
    val === "" ? "text-[#999999]" : "text-[#090C26]";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-full">
        <Header
          title={!isNew ? "スケジュール編集" : "スケジュール登録"}
          showClose={false}
        />
      </div>

      <div className="w-full max-w-[375px]">
        <main className="px-[16px] py-[36px] flex flex-col gap-[36px]">
          {/* 日付選択 */}
          <FormItem label="日付" required error={error}>
            <div className="flex items-end gap-[4px]">
              <SelectBox
                value={year}
                onChange={setYear}
                options={["2025", "2026"]}
                suffix="年"
                width="96px"
                bgColor={isErrorBg ? "rgba(0, 198, 255, 0.2)" : "white"}
              />
              <SelectBox
                value={month}
                onChange={setMonth}
                options={Array.from({ length: 12 }, (_, i) =>
                  (i + 1).toString().padStart(2, "0")
                )}
                suffix="月"
                width="80px"
                bgColor={isErrorBg ? "rgba(0, 198, 255, 0.2)" : "white"}
              />
              <SelectBox
                value={day}
                onChange={setDay}
                options={daysOptions}
                suffix="日"
                width="80px"
                bgColor={isErrorBg ? "rgba(0, 198, 255, 0.2)" : "white"}
              />
            </div>
          </FormItem>

          <FormItem label="タイトル" required>
            <CommonInput
              placeholder="タイトルを入力してください"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={getTextColor(title)}
            />
          </FormItem>

          {/* 時間選択：SelectBoxコンポーネントを使用 */}
          <FormItem label="時間">
            <SelectBox
              value={time}
              onChange={setTime}
              options={[
                "【全日】08:30 ~ 17:30",
                "【全日】09:00 ~ 17:30",
                "【AM】08:30 ~ 12:00",
                "【AM】09:00 ~ 12:00",
                "【PM】13:00 ~ 15:00",
                "【PM】13:00 ~ 17:30",
                "【PM】19:00 ~ 21:00",
                "その他",
              ]}
              width="100%"
              placeholder="選択してください"
            />
          </FormItem>

          {/* 場所選択：SelectBoxコンポーネントを使用 */}
          <FormItem label="場所">
            <div className="flex flex-col gap-[12px]">
              <SelectBox
                value={location}
                onChange={setLocation}
                options={[
                  "佐原小",
                  "香取中",
                  "北佐原小",
                  "佐原五中",
                  "小見川BG",
                  "栗源BG",
                  "山田BG",
                  "その他",
                ]}
                width="100%"
                placeholder="選択してください"
              />
              <CommonInput
                disabled={location !== "その他"}
                placeholder="その他場所を入力してください"
                value={otherLocation}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setOtherLocation(e.target.value)
                }
              />
            </div>
          </FormItem>

          <FormItem label="対象" required>
            <div className="grid grid-cols-3 gap-x-[16px] gap-y-[12px]">
              {targetOptions.map((opt, index) => (
                <div
                  key={opt.id}
                  className={index === 0 ? "col-span-3 flex justify-start" : ""}
                >
                  <CustomInput
                    type="radio"
                    id={opt.id}
                    name="target_group"
                    value={opt.id}
                    label={opt.name}
                    checked={target === opt.id}
                    onChange={() => setTarget(opt.id)}
                    selectedColor={opt.selectedColor}
                    selectedTextColor={opt.selectedTextColor}
                    selectedBorderColor={opt.selectedBorderColor}
                  />
                </div>
              ))}
            </div>
          </FormItem>

          <FormItem label="内容・連絡事項">
            <textarea
              className={`w-full border border-[#9D9D9D] px-[8px] py-[12px] text-[20px] rounded-[4px] min-h-[240px] focus:outline-none focus:border-[2px] focus:border-[#090C26] resize-none ${getTextColor(
                content
              )}`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </FormItem>

          <div className="flex flex-col items-center mt-[12px] gap-[24px] pb-[60px]">
            <Button
              label="CHECK"
              activeBgColor="#090C26"
              onClick={handleCheck}
              disabled={title.trim() === ""}
            />
            <Button
              label="CANCEL"
              activeBgColor="#143875"
              onClick={() => router.back()}
            />
          </div>
        </main>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        buttons={
          <div className="flex justify-center w-full">
            <Button
              label={isNew ? "ADD" : "EDIT"}
              activeBgColor="#090C26"
              onClick={handleRegister}
              disabled={isSubmitting}
            />
          </div>
        }
      >
        <div className="flex flex-col">
          <div className="w-full flex justify-start mb-[18px]">
            <TargetLabel targetId={target} />
          </div>
          <DetailTable
            targetId={target}
            items={[
              { label: "日付", value: `${year}/${month}/${day}` },
              { label: "タイトル", value: title },
              { label: "時間", value: time || "指定なし" },
              {
                label: "場所",
                value:
                  location === "その他"
                    ? otherLocation
                    : location || "指定なし",
              },
              { label: "内容・連絡事項", value: content || "-" },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
}
