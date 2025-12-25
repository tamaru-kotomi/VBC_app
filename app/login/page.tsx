import Image from "next/image";
import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <main className="w-full max-w-[375px] px-[24px]">
        <div className="flex flex-col items-center">
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

          {/* ログインフォームコンポーネント */}
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
