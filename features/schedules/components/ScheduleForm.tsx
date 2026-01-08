"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { isBefore, startOfDay } from "date-fns";

// 共通パーツ
import CustomInput from "@/components/CustomInput";
import Button from "@/components/Button";
import { FormItem } from "@/components/FormItem";
import { SelectBox } from "@/components/SelectBox";

// 定数・分離したモーダル
import { TARGET_OPTIONS } from "@/features/calendar/constants/targetStyles";
import ScheduleFormModal from "@/features/schedules/components/ScheduleFormModal";
import { Target } from "@prisma/client";

export default function ScheduleForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // パラメータ取得
  const scheduleId = searchParams.get("id");
  const queryDate = searchParams.get("date");
  const isNew = searchParams.get("isNew") === "true";

  // --- ステート管理 (初期値は文字列で固定し、useEffectで同期する) ---
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("01");
  const [day, setDay] = useState("01");

  const [title, setTitle] = useState(searchParams.get("title") || "");
  const [time, setTime] = useState(searchParams.get("time") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [otherLocation, setOtherLocation] = useState(
    searchParams.get("otherLocation") || ""
  );
  const [target, setTarget] = useState(searchParams.get("target") || "all");
  const [content, setContent] = useState(searchParams.get("content") || "");

  const [error, setError] = useState<string | null>(null);
  const [isErrorBg, setIsErrorBg] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // クエリパラメータの日付をステートに反映
  useEffect(() => {
    if (queryDate) {
      const d = new Date(queryDate);
      if (!isNaN(d.getTime())) {
        setYear(d.getFullYear().toString());
        setMonth((d.getMonth() + 1).toString().padStart(2, "0"));
        setDay(d.getDate().toString().padStart(2, "0"));
      }
    }
  }, [queryDate]);

  // 日付の選択肢計算
  const daysOptions = useMemo(() => {
    const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
    return Array.from({ length: lastDay }, (_, i) =>
      (i + 1).toString().padStart(2, "0")
    );
  }, [year, month]);

  // textareaの自動リサイズ
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = "240px";
      const scrollHeight = contentRef.current.scrollHeight;
      if (scrollHeight > 240)
        contentRef.current.style.height = `${scrollHeight}px`;
    }
  }, [content]);

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
        // 保存後はカレンダーへ戻る
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
    <>
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

        {/* タイトル */}
        <FormItem label="タイトル" required>
          <input
            type="text"
            placeholder="タイトルを入力してください"
            className={`w-full border border-[#9D9D9D] h-[52px] px-[8px] text-[20px] rounded-[4px] focus:border-[2px] focus:border-[#090C26] outline-none ${getTextColor(
              title
            )}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormItem>

        {/* 時間 */}
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

        {/* 場所 */}
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
            <div
              style={{
                width: "100%",
                height: "52px",
                padding: "0 8px",
                fontSize: "20px",
                borderRadius: "4px",
                border: "1px solid #9D9D9D",
                display: "flex",
                alignItems: "center",
                boxSizing: "border-box",
                backgroundColor: location === "その他" ? "#FFFFFF" : "#D9D9D9",
                transition: "all 0.2s",
              }}
            >
              {location === "その他" ? (
                <input
                  type="text"
                  placeholder="その他場所を入力してください"
                  value={otherLocation}
                  onChange={(e) => setOtherLocation(e.target.value)}
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    outline: "none",
                    backgroundColor: "transparent",
                    fontSize: "20px",
                    fontWeight: "500",
                    color: otherLocation === "" ? "#999999" : "#090C26",
                    WebkitTextFillColor:
                      otherLocation === "" ? "#999999" : "#090C26",
                  }}
                />
              ) : (
                <span
                  style={{
                    color: "#999999",
                    fontSize: "20px",
                    fontWeight: "500",
                    WebkitTextFillColor: "#999999",
                  }}
                >
                  その他場所を入力してください
                </span>
              )}
            </div>
          </div>
        </FormItem>

        {/* 対象 */}
        <FormItem label="対象" required>
          <div className="grid grid-cols-3 gap-x-[8px] gap-y-[12px]">
            {TARGET_OPTIONS.map((opt, index) => (
              <React.Fragment key={opt.id}>
                <div className="flex justify-center">
                  <CustomInput
                    type="radio"
                    id={opt.id}
                    name="schedule-target"
                    value={opt.id}
                    label={opt.name}
                    checked={target === opt.id}
                    onChange={() => setTarget(opt.id)}
                    selectedColor={opt.bg}
                    selectedTextColor={opt.text}
                    selectedBorderColor={opt.border || opt.bg}
                  />
                </div>
                {index === 0 && (
                  <>
                    <div className="w-full" />
                    <div className="w-full" />
                  </>
                )}
              </React.Fragment>
            ))}
          </div>
        </FormItem>

        {/* 内容・連絡事項 */}
        <FormItem label="内容・連絡事項">
          <textarea
            ref={contentRef}
            placeholder="内容・連絡事項を入力してください"
            className={`w-full border border-[#9D9D9D] min-h-[240px] px-[8px] py-[12px] text-[20px] rounded-[4px] outline-none focus:border-[2px] focus:border-[#090C26] resize-none overflow-hidden ${getTextColor(
              content
            )}`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </FormItem>

        {/* ボタン */}
        <div className="flex flex-col items-center mt-[12px] gap-[24px] pb-[60px]">
          <Button
            label="CHECK"
            activeBgColor="#090C26"
            onClick={handleCheck}
            disabled={
              title.trim() === "" ||
              (location === "その他" && otherLocation.trim() === "")
            }
          />
          <Button
            label="CANCEL"
            activeBgColor="#143875"
            onClick={() => router.back()}
          />
        </div>
      </main>

      <ScheduleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleRegister}
        isSubmitting={isSubmitting}
        isNew={isNew}
        data={{
          year,
          month,
          day,
          title,
          time,
          location,
          otherLocation,
          targetId: target as Target,
          content,
        }}
      />
    </>
  );
}
