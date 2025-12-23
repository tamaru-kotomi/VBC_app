"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "../components/Button";
import { CommonInput } from "../components/CommonInput";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isButtonDisabled = !email.trim() || !password.trim() || isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isButtonDisabled) return;

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/calendar");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("通信エラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <main className="w-full max-w-[375px] px-[24px]">
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          {/* ロゴ */}
          <Image
            src="/images/icons/logo.png"
            alt="Logo"
            width={200}
            height={200}
            priority
          />

          {/* メールアドレス入力欄（ロゴとの余白 52px） */}
          <div className="w-full mt-[52px] flex flex-col relative">
            {/* エラーメッセージ（入力枠の上8pxに固定表示。h-[21px]は14pxフォントの概ねの高さ） */}
            <div className="absolute top-[-29px] left-0 h-[21px]">
              {error && (
                <p className="text-[#D32F2F] text-[14px] font-normal">
                  ※{error}
                </p>
              )}
            </div>

            <CommonInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレス"
              className="text-[#090C26] placeholder:text-[#999999]"
            />
          </div>

          {/* パスワード入力欄（メールアドレス欄との余白 24px） */}
          <div className="w-full mt-[24px]">
            <CommonInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワード"
              className="text-[#090C26] placeholder:text-[#999999]"
            />
          </div>

          {/* ログインボタン（パスワード欄との余白 32px） */}
          <div className="mt-[32px]">
            <Button
              label={isLoading ? "LOADING..." : "LOGIN"}
              onClick={() => {}}
              type="submit"
              disabled={isButtonDisabled}
              activeBgColor="#090C26"
            />
          </div>
        </form>
      </main>
    </div>
  );
}
