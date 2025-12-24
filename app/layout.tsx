import NextAuthProvider from "@/app/components/NextAuthProvider";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {/* NextAuthProvider */}
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
