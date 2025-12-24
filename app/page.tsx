// vbc-app/app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  // トップページにアクセスが来たら、即座にログイン画面へ飛ばす
  redirect("/login");
}
