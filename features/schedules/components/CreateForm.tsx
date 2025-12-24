"use client";

import React, {
  useState,
  ChangeEvent,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { isBefore, startOfDay, parseISO } from "date-fns";
import Header from "../../../components/Header";
import CustomInput from "../../../components/CustomInput";
import Button from "../../../components/Button";

// --- 型定義 ---
interface TargetOption {
  id: string;
  name: string;
  value: string;
  selectedColor: string;
  selectedTextColor?: string;
  selectedBorderColor?: string;
}

interface SelectBoxProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  suffix: string;
  width: string;
  bgColor?: string; // 背景色を追加
}

// サブコンポーネント: ラベル
const FormLabel = ({
  label,
  required,
}: {
  label: string;
  required?: boolean;
}) => (
  <div className="flex items-center gap-[4px] leading-none text-[#090C26]">
    <span className="text-[24px] font-bold">{label}</span>
    {required && (
      <span className="text-[20px] font-bold text-[#C20000]">＊</span>
    )}
  </div>
);

// サブコンポーネント: セレクトボックス
const SelectBox = ({
  value,
  onChange,
  options,
  suffix,
  width,
  bgColor = "white",
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
        {options.map((opt: string) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <span className="text-[20px] font-normal text-[#090C26] leading-[1.2]">
        {suffix}
      </span>
    </div>
  );
};

export default function CreateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // パラメータ取得
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

  const daysOptions = useMemo(() => {
    const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
    return Array.from({ length: lastDay }, (_, i) =>
      (i + 1).toString().padStart(2, "0")
    );
  }, [year, month]);

  const handleYearMonthChange = (newYear: string, newMonth: string) => {
    const lastDay = new Date(
      parseInt(newYear),
      parseInt(newMonth),
      0
    ).getDate();
    if (parseInt(day) > lastDay) {
      setDay(lastDay.toString().padStart(2, "0"));
    }
    setError(null);
    setIsErrorBg(false);
  };

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
        return;
      }
    }
    console.log("Check Success");
  };

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = "240px";
      const scrollHeight = contentRef.current.scrollHeight;
      if (scrollHeight > 240)
        contentRef.current.style.height = `${scrollHeight}px`;
    }
  }, [content]);

  const inputBaseClass =
    "w-full border border-[#9D9D9D] px-[8px] text-[20px] rounded-[4px] focus:outline-none focus:border-[2px] focus:border-[#090C26] transition-all";
  const selectBaseClass = `${inputBaseClass} appearance-none bg-no-repeat bg-[right_8px_center] bg-[length:16px_16px]`;
  const selectIconStyle = {
    backgroundImage: "url('/images/icons/icon_pulldown.png')",
  };
  const getTextColor = (val: string) =>
    val === "" ? "text-[#999999]" : "text-[#090C26]";

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

  const years = [
    new Date().getFullYear().toString(),
    (new Date().getFullYear() + 1).toString(),
  ];
  const months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-full">
        <Header title="スケジュール登録" showClose={false} />
      </div>
      <div className="w-full max-w-[375px]">
        <main className="px-[16px] py-[36px] flex flex-col gap-[36px]">
          <section className="relative">
            <FormLabel label="日付" required />
            <div className="flex items-end gap-[4px] mt-[12px]">
              <SelectBox
                value={year}
                onChange={(val: string) => {
                  setYear(val);
                  handleYearMonthChange(val, month);
                }}
                options={years}
                suffix="年"
                width="96px"
                bgColor={isErrorBg ? "rgba(0, 198, 255, 0.2)" : "white"}
              />
              <SelectBox
                value={month}
                onChange={(val: string) => {
                  setMonth(val);
                  handleYearMonthChange(year, val);
                }}
                options={months}
                suffix="月"
                width="80px"
                bgColor={isErrorBg ? "rgba(0, 198, 255, 0.2)" : "white"}
              />
              <SelectBox
                value={day}
                onChange={(val: string) => {
                  setDay(val);
                  setError(null);
                  setIsErrorBg(false);
                }}
                options={daysOptions}
                suffix="日"
                width="80px"
                bgColor={isErrorBg ? "rgba(0, 198, 255, 0.2)" : "white"}
              />
            </div>
            {error && (
              <p className="absolute left-0 -bottom-[20px] text-[#C20000] text-[14px] font-normal leading-none">
                {error}
              </p>
            )}
          </section>

          <section>
            <FormLabel label="タイトル" required />
            <input
              type="text"
              placeholder="タイトルを入力してください"
              className={`${inputBaseClass} h-[52px] mt-[12px] bg-white placeholder:text-[#999999] ${getTextColor(
                title
              )}`}
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
            />
          </section>

          <section>
            <FormLabel label="時間" />
            <select
              className={`${selectBaseClass} h-[52px] mt-[12px] bg-white pr-[32px] ${getTextColor(
                time
              )}`}
              style={selectIconStyle}
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
                "【PM】19:00 ~ 21:00",
                "その他",
              ].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </section>

          <section>
            <FormLabel label="場所" />
            <div className="flex flex-col gap-[12px] mt-[12px]">
              <select
                className={`${selectBaseClass} h-[52px] bg-white pr-[32px] ${getTextColor(
                  location
                )}`}
                style={selectIconStyle}
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

              {/* 【最終手段】inputを使わずに見た目を作ることで、ブラウザの薄くする機能を物理的に封鎖 */}
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
                  backgroundColor:
                    location === "その他" ? "#FFFFFF" : "#D9D9D9",
                  transition: "all 0.2s",
                }}
              >
                {location === "その他" ? (
                  <input
                    type="text"
                    placeholder="その他場所を入力してください"
                    value={otherLocation}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setOtherLocation(e.target.value)
                    }
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                      outline: "none",
                      backgroundColor: "transparent",
                      fontSize: "20px",
                      fontWeight: "500",
                      // 入力中かplaceholderかで色を分ける
                      color: otherLocation === "" ? "#999999" : "#090C26",
                      // 下記はiOS/Safariでの「勝手に薄くなる」のを防ぐ最重要プロパティ
                      WebkitTextFillColor:
                        otherLocation === "" ? "#999999" : "#090C26",
                    }}
                  />
                ) : (
                  /* 非活性時は input ではなくただの「文字」として描画。これで薄くなることは絶対にありません */
                  <span
                    style={{
                      color: "#999999",
                      fontSize: "20px",
                      fontWeight: "500",
                      userSelect: "none",
                      WebkitTextFillColor: "#999999", // 文字色を強制
                    }}
                  >
                    その他場所を入力してください
                  </span>
                )}
              </div>
            </div>
          </section>

          <section>
            <FormLabel label="対象" required />
            <div className="mt-[12px] w-full">
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
            </div>
          </section>

          <section>
            <FormLabel label="内容・連絡事項" />
            <textarea
              ref={contentRef}
              placeholder="内容・連絡事項を入力してください"
              className={`${inputBaseClass} min-h-[240px] py-[12px] mt-[12px] bg-white resize-none overflow-hidden placeholder:text-[#999999] ${getTextColor(
                content
              )}`}
              value={content}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setContent(e.target.value)
              }
            />
          </section>

          <div className="flex flex-col items-center mt-[12px] gap-[24px]">
            <Button
              label="CHECK"
              disabled={
                title.trim() === "" ||
                (location === "その他" && otherLocation.trim() === "")
              }
              activeBgColor="#090C26"
              onClick={handleCheck}
            />
            <Button
              label="CANCEL"
              activeBgColor="#143875"
              onClick={() => router.back()}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
