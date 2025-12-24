"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn } from "next-auth/react";
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
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("メールアドレスまたはパスワードが違います");
        setIsLoading(false);
      } else {
        window.location.href = "/calendar";
      }
    } catch (err) {
      setError("通信エラーが発生しました。");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <main className="w-full max-w-[375px] px-[24px]">
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          {/* ロゴ */}
          <div className="relative w-[200px] h-[200px]">
            <Image
              src="/images/icons/logo.png"
              alt="Logo"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>

          {/* メールアドレス入力欄 */}
          <div className="w-full mt-[52px] flex flex-col relative">
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

          {/* パスワード入力欄 */}
          <div className="w-full mt-[24px]">
            <CommonInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワード"
              className="text-[#090C26] placeholder:text-[#999999]"
            />
          </div>

          {/* ログインボタン */}
          <div className="mt-[32px] w-full flex justify-center">
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
