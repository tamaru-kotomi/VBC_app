"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  ChangeEvent,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { isBefore, startOfDay, parseISO } from "date-fns";
import Header from "../../components/Header";
import CustomInput from "../../components/CustomInput";
import Button from "../../components/Button";
import { FormItem } from "../../components/FormItem";
import { CommonInput } from "../../components/CommonInput";
import { SelectBox } from "../../components/SelectBox";
import { Modal } from "../../components/Modal";
import { TargetLabel } from "../../components/TargetLabel";
import { DetailTable } from "../../components/DetailTable"; // コンポーネントをインポート

interface TargetOption {
  id: string;
  name: string;
  value: string;
  selectedColor: string;
  selectedTextColor?: string;
  selectedBorderColor?: string;
}

export default function CreateSchedulePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentRef = useRef<HTMLTextAreaElement>(null);

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
  const [error, setError] = useState<string | null>(null);
  const [isErrorBg, setIsErrorBg] = useState(false);

  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [otherLocation, setOtherLocation] = useState("");
  const [target, setTarget] = useState("ALL");
  const [content, setContent] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const daysOptions = useMemo(() => {
    const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
    return Array.from({ length: lastDay }, (_, i) =>
      (i + 1).toString().padStart(2, "0")
    );
  }, [year, month]);

  const handleCheck = () => {
    if (isNew) {
      const selectedDate = startOfDay(
        new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      );
      const today = startOfDay(new Date());
      if (isBefore(selectedDate, today)) {
        setError("※過去の日付を指定することはできません");
        setIsErrorBg(true);
        if (queryDate) {
          const d = parseISO(queryDate);
          setYear(d.getFullYear().toString());
          setMonth((d.getMonth() + 1).toString().padStart(2, "0"));
          setDay(d.getDate().toString().padStart(2, "0"));
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    }
    setIsModalOpen(true);
  };

  const handleRegister = () => {
    console.log("DB登録:", {
      year,
      month,
      day,
      title,
      time,
      location,
      otherLocation,
      target,
      content,
    });
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = "240px";
      const scrollHeight = contentRef.current.scrollHeight;
      if (scrollHeight > 240)
        contentRef.current.style.height = `${scrollHeight}px`;
    }
  }, [content]);

  const years = [
    new Date().getFullYear().toString(),
    (new Date().getFullYear() + 1).toString(),
  ];
  const months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );

  const targetOptions: TargetOption[] = [
    { id: "ALL", name: "ALL", value: "0", selectedColor: "#8BC34A" },
    { id: "boys", name: "男子", value: "1", selectedColor: "#3C2465" },
    { id: "boysA", name: "男子A", value: "2", selectedColor: "#673AB7" },
    {
      id: "boysB",
      name: "男子B",
      value: "3",
      selectedColor: "#ffffff",
      selectedTextColor: "#673AB7",
      selectedBorderColor: "#673AB7",
    },
    { id: "girls", name: "女子", value: "4", selectedColor: "#811C1C" },
    { id: "girlsA", name: "女子A", value: "5", selectedColor: "#D32F2F" },
    {
      id: "girlsB",
      name: "女子B",
      value: "6",
      selectedColor: "#ffffff",
      selectedTextColor: "#D32F2F",
      selectedBorderColor: "#D32F2F",
    },
  ];

  const getTextColor = (val: string) =>
    val === "" ? "text-[#999999]" : "text-[#090C26]";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-full">
        <Header title="スケジュール登録" showClose={false} />
      </div>
      <div className="w-full max-w-[375px]">
        <main className="px-[16px] py-[36px] flex flex-col gap-[36px]">
          {/* 日付項目 */}
          <FormItem label="日付" required error={error}>
            <div className="flex items-end gap-[4px]">
              <SelectBox
                value={year}
                onChange={(v: string) => {
                  setYear(v);
                  setError(null);
                  setIsErrorBg(false);
                }}
                options={years}
                suffix="年"
                width="96px"
                bgColor={isErrorBg ? "rgba(0, 198, 255, 0.2)" : "white"}
              />
              <SelectBox
                value={month}
                onChange={(v: string) => {
                  setMonth(v);
                  setError(null);
                  setIsErrorBg(false);
                }}
                options={months}
                suffix="月"
                width="80px"
                bgColor={isErrorBg ? "rgba(0, 198, 255, 0.2)" : "white"}
              />
              <SelectBox
                value={day}
                onChange={(v: string) => {
                  setDay(v);
                  setError(null);
                  setIsErrorBg(false);
                }}
                options={daysOptions}
                suffix="日"
                width="80px"
                bgColor={isErrorBg ? "rgba(0, 198, 255, 0.2)" : "white"}
              />
            </div>
          </FormItem>

          {/* タイトル項目 */}
          <FormItem label="タイトル" required>
            <CommonInput
              placeholder="タイトルを入力してください"
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              className={getTextColor(title)}
            />
          </FormItem>

          {/* 時間項目 */}
          <FormItem label="時間">
            <select
              className={`w-full border border-[#9D9D9D] px-[8px] text-[20px] rounded-[4px] h-[52px] appearance-none bg-white bg-no-repeat bg-[right_8px_center] bg-[length:16px_16px] focus:outline-none focus:border-[2px] focus:border-[#090C26] ${getTextColor(
                time
              )}`}
              style={{
                backgroundImage: "url('/images/icons/icon_pulldown.png')",
              }}
              value={time}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setTime(e.target.value)
              }
            >
              <option value="">選択してください</option>
              {[
                "【全日】08:30 ~ 17:30",
                "【全日】09:00 ~ 17:30",
                "【AM】08:30 ~ 12:00",
                "【AM】09:00 ~ 12:00",
                "【PM】13:00 ~ 15:00",
                "【PM】13:00 ~ 17:30",
                "その他",
              ].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </FormItem>

          {/* 場所項目 */}
          <FormItem label="場所">
            <div className="flex flex-col gap-[12px]">
              <select
                className={`w-full border border-[#9D9D9D] px-[8px] text-[20px] rounded-[4px] h-[52px] appearance-none bg-white bg-no-repeat bg-[right_8px_center] bg-[length:16px_16px] focus:outline-none focus:border-[2px] focus:border-[#090C26] ${getTextColor(
                  location
                )}`}
                style={{
                  backgroundImage: "url('/images/icons/icon_pulldown.png')",
                }}
                value={location}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setLocation(e.target.value)
                }
              >
                <option value="">選択してください</option>
                {[
                  "佐原小",
                  "香取中",
                  "北佐原小",
                  "佐原五中",
                  "小見川BG",
                  "栗源BG",
                  "山田BG",
                  "その他",
                ].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <CommonInput
                disabled={location !== "その他"}
                placeholder="その他場所を入力してください"
                value={otherLocation}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setOtherLocation(e.target.value)
                }
                className={
                  location === "その他" ? getTextColor(otherLocation) : ""
                }
              />
            </div>
          </FormItem>

          {/* 対象項目 */}
          <FormItem label="対象" required>
            <div className="grid grid-cols-3 w-full gap-y-[12px] gap-x-[8px] justify-items-center">
              {targetOptions.map((option, index) => (
                <div
                  key={option.id}
                  className={`${
                    index === 0
                      ? "col-span-3 justify-self-start"
                      : "w-full flex justify-center"
                  }`}
                >
                  <CustomInput
                    {...option}
                    type="radio"
                    name="schedule-target"
                    label={option.name}
                    checked={target === option.id}
                    onChange={() => setTarget(option.id)}
                  />
                </div>
              ))}
            </div>
          </FormItem>

          {/* 内容項目 */}
          <FormItem label="内容・連絡事項">
            <textarea
              ref={contentRef}
              placeholder="内容・連絡事項を入力してください"
              className={`w-full border border-[#9D9D9D] px-[8px] text-[20px] rounded-[4px] focus:outline-none focus:border-[2px] focus:border-[#090C26] transition-all min-h-[240px] py-[12px] bg-white resize-none overflow-hidden placeholder:text-[#999999] ${getTextColor(
                content
              )}`}
              value={content}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setContent(e.target.value)
              }
            />
          </FormItem>

          {/* ボタンエリア */}
          <div className="flex flex-col items-center mt-[12px] gap-[24px]">
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
      </div>

      {/* プレビューモーダル */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        buttons={
          <Button
            label="ADD"
            activeBgColor="#090C26"
            onClick={handleRegister}
          />
        }
      >
        <div className="flex flex-col">
          {/* 対象ラベル（左寄せ） */}
          <div className="w-full flex justify-start mb-[18px]">
            <TargetLabel targetId={target} />
          </div>

          {/* 共通コンポーネント化した詳細テーブル */}
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
              { label: "内容・連絡事項", value: content || "なし" },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
}
