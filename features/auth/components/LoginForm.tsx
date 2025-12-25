"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Button from "@/components/Button";
import { CommonInput } from "@/components/CommonInput";

export default function LoginForm() {
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
        // window.location.href を使うことで状態を完全にリセットして遷移
        window.location.href = "/calendar";
      }
    } catch (err) {
      setError("通信エラーが発生しました。");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
      {/* メールアドレス入力欄 */}
      <div className="w-full mt-[52px] flex flex-col relative">
        <div className="absolute top-[-29px] left-0 h-[21px]">
          {error && (
            <p className="text-[#D32F2F] text-[14px] font-normal">※{error}</p>
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
          onClick={() => {}} // type="submit" なので form の onSubmit が呼ばれる
          type="submit"
          disabled={isButtonDisabled}
          activeBgColor="#090C26"
        />
      </div>
    </form>
  );
}
