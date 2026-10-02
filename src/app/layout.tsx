import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BattleStudyProvider } from "@/context/BattleStudyContext";
import GlobalHeader from "@/components/GlobalHeader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "배틀스터디 (BattleStudy Arena)",
  description: "학교의 명예를 걸고 맞붙는 1대1 실시간 퀴즈 배틀",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-duo-dark font-sans">
        <BattleStudyProvider>
          <GlobalHeader />
          <main className="flex-1 overflow-x-hidden">
            {children}
          </main>
        </BattleStudyProvider>
      </body>
    </html>
  );
}
