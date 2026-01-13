"use client";
import { signOut } from "next-auth/react";

export default function Logout() {
  const handleLogout = async () => {
    try {
      await signOut({
        callbackUrl: "/login",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <button
      type="button"
      className="text-[#090C26] text-[20px] border-b"
      onClick={handleLogout}
    >
      ログアウト
    </button>
  );
}
