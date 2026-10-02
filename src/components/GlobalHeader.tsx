"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useBattleStudy } from "@/context/BattleStudyContext";
import { Swords, Zap, Settings, LogIn } from "lucide-react";

export default function GlobalHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { energy } = useBattleStudy();

  // Hide header on login page
  if (pathname === "/login") return null;

  const currentTab = pathname.includes("/battle") ? "BATTLE" :
                     pathname.includes("/shadow-raid") ? "SHADOW_RAID" :
                     pathname.includes("/analytics") ? "ANALYTICS" :
                     pathname.includes("/teacher") ? "TEACHER" : "ARENA";

  return (
    <header className="border-b border-duo-gray-dark bg-white sticky top-0 z-50 px-4 md:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center justify-between w-full md:w-auto">
        <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => router.push("/")}>
          <div className="p-2 rounded-xl bg-duo-gray text-duo-dark shadow-sm">
            <Swords className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h2 className="text-sm md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-duo-dark to-duo-gray-dark font-sans">
              배틀스터디 아레나
            </h2>
            <p className="text-[9px] md:text-[10px] text-duo-blue tracking-wider font-semibold uppercase">
              Season 1: First Honor
            </p>
          </div>
        </div>

        {/* User Status Bar - Visible on mobile top right */}
        <div className="flex md:hidden items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-duo-yellow/10 border border-duo-yellow text-xs font-black text-duo-yellow">
            <Zap className="w-4 h-4 fill-yellow-400 animate-pulse" />
            <span>⚡ {energy} / 5</span>
          </div>
        </div>
      </div>

      {/* Game Navigation Tabs - Scrollable on mobile */}
      <div className="flex overflow-x-auto no-scrollbar items-center gap-1 bg-duo-gray border border-duo-gray-dark p-1 rounded-xl w-full md:w-auto shrink-0">
        <button
          type="button"
          onClick={() => router.push("/")}
          className={`px-3.5 py-2 whitespace-nowrap rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            currentTab === "ARENA" ? "bg-white text-duo-dark shadow-sm" : "text-duo-dark hover:text-duo-dark"
          }`}
        >
          <span>🏛️</span><span>메인 로비</span>
        </button>
        <button
          type="button"
          onClick={() => router.push("/battle")}
          className={`px-3.5 py-2 whitespace-nowrap rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            currentTab === "BATTLE" ? "bg-white text-duo-dark shadow-sm" : "text-duo-dark hover:text-duo-red"
          }`}
        >
          <span>⚔️</span><span>1:1 퀴즈 배틀</span>
        </button>
        <button
          type="button"
          onClick={() => router.push("/shadow-raid")}
          className={`px-3.5 py-2 whitespace-nowrap rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            currentTab === "SHADOW_RAID" ? "bg-white text-duo-green shadow-sm" : "text-duo-dark hover:text-duo-dark"
          }`}
        >
          <span>👾</span><span>오답 던전</span>
        </button>
        <button
          type="button"
          onClick={() => router.push("/analytics")}
          className={`px-3.5 py-2 whitespace-nowrap rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            currentTab === "ANALYTICS" ? "bg-white text-duo-dark shadow-sm" : "text-duo-dark hover:text-duo-dark"
          }`}
        >
          <span>📊</span><span>결과 & 분석</span>
        </button>
        <button
          type="button"
          onClick={() => router.push("/teacher")}
          className={`px-3.5 py-2 whitespace-nowrap rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            currentTab === "TEACHER" ? "bg-white text-duo-dark shadow-sm" : "text-duo-dark hover:text-duo-dark"
          }`}
        >
          <span>👩‍🏫</span><span>교사</span>
        </button>
        <div className="w-px h-6 bg-duo-gray-dark mx-1"></div>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="px-3.5 py-2 whitespace-nowrap rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 text-duo-blue hover:bg-white"
        >
          <LogIn className="w-3.5 h-3.5" /><span>로그인</span>
        </button>
      </div>

      {/* User Status Bar - Visible on Desktop */}
      <div className="hidden md:flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-duo-yellow/10 border border-duo-yellow text-xs font-black text-duo-yellow">
          <Zap className="w-4 h-4 fill-yellow-400 animate-pulse" />
          <span>⚡ {energy} / 5</span>
        </div>
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-duo-gray-dark text-xs font-semibold text-duo-green">
          <span className="w-2 h-2 rounded-full bg-duo-green animate-ping" />
          <span>4,821명 접속 중</span>
        </div>
      </div>
    </header>
  );
}
