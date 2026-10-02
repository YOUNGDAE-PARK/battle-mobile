"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle2, ChevronRight, AlertTriangle } from "lucide-react";

// Matches the type defined in context/BattleStudyContext.tsx (implicitly or explicitly)
type Question = {
  id: number;
  category: string;
  question: string;
  options: string[];
  answerIndex: number;
  timeLimit: number;
};

type Props = {
  questions: Question[];
  onFinish: (userHp: number, oppHp: number, log: any[]) => void;
};

export default function AssessmentExam({ questions, onFinish }: Props) {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  
  // Total Time Limit Logic
  const initialTotalTime = questions.reduce((sum, q) => sum + q.timeLimit, 0);
  const [totalTimeLeft, setTotalTimeLeft] = useState(initialTotalTime);
  
  // Per-question tracking for the log
  const [answersLog, setAnswersLog] = useState<any[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  
  const [isFinishing, setIsFinishing] = useState(false);

  // Global Timer
  useEffect(() => {
    if (isFinishing || totalTimeLeft <= 0) return;

    const timer = setInterval(() => {
      setTotalTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinishing, totalTimeLeft]);

  // When time runs out completely
  const handleTimeUp = () => {
    // If time is up, submit whatever we have and auto-fail the remaining
    setIsFinishing(true);
    let finalLog = [...answersLog];
    
    // Log the current question as timed out if not answered
    const currentQ = questions[currentRound];
    if (selectedChoice === null) {
      finalLog.push({
        question: currentQ,
        isCorrect: false,
        selectedIndex: -1,
        timeTaken: currentQ.timeLimit
      });
    }

    // Auto-fail the rest
    for (let i = currentRound + (selectedChoice === null ? 1 : 0); i < questions.length; i++) {
      finalLog.push({
        question: questions[i],
        isCorrect: false,
        selectedIndex: -1,
        timeTaken: 0
      });
    }
    
    onFinish(100, 100, finalLog);
  };

  const handleNext = () => {
    if (selectedChoice === null) return;
    
    const currentQ = questions[currentRound];
    const timeTakenSeconds = Math.floor((Date.now() - questionStartTime) / 1000);
    const isCorrect = selectedChoice === currentQ.answerIndex;

    const newLogEntry = {
      question: currentQ,
      isCorrect,
      selectedIndex: selectedChoice,
      timeTaken: timeTakenSeconds
    };
    
    const newLog = [...answersLog, newLogEntry];
    setAnswersLog(newLog);

    if (currentRound < questions.length - 1) {
      // Go to next question
      setCurrentRound(prev => prev + 1);
      setSelectedChoice(null);
      setQuestionStartTime(Date.now());
    } else {
      // Finished
      setIsFinishing(true);
      onFinish(100, 100, newLog);
    }
  };

  const currentQuestion = questions[currentRound];
  const progressPercent = ((currentRound) / questions.length) * 100;

  // Format time (MM:SS)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none overflow-hidden relative">
      {/* Anti-cheat Warning Banner */}
      <div className="w-full bg-duo-red text-white py-2.5 px-4 text-xs md:text-sm font-black text-center relative z-50 flex items-center justify-center gap-2 uppercase tracking-wide shadow-md">
        <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />
        <span>수행평가 진행 중: 화면 이탈 시 0점 처리됩니다</span>
      </div>

      <header className="w-full max-w-3xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between border-b border-slate-200 bg-white">
        <div>
          <h1 className="text-sm md:text-base font-black text-slate-800">2026학년도 1학기 수학 수행평가</h1>
          <p className="text-xs text-slate-500 font-bold mt-0.5">청계중학교 3학년</p>
        </div>
        
        {/* Global Timer */}
        <div className="flex flex-col items-end">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-black text-sm md:text-base shadow-sm ${
            totalTimeLeft <= 60 ? "bg-red-50 border-red-200 text-duo-red animate-pulse" : "bg-white border-slate-200 text-slate-800"
          }`}>
            <Clock className="w-4 h-4" />
            <span>{formatTime(totalTimeLeft)}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-bold mt-1 pr-1">남은 총 시간</span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-10 flex flex-col">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
            <span>문항 진행률</span>
            <span>{currentRound + 1} / {questions.length}</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-duo-blue"
              initial={{ width: `${progressPercent}%` }}
              animate={{ width: `${((currentRound + (selectedChoice !== null ? 1 : 0)) / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question Area */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm relative flex-1 flex flex-col justify-center">
          <span className="text-xs font-black text-duo-blue mb-4 block px-3 py-1 bg-blue-50 border border-blue-200 rounded-md w-max">
            {currentQuestion.category}
          </span>
          <h2 className="text-lg md:text-2xl font-black text-slate-900 leading-relaxed whitespace-pre-line break-keep mb-8">
            <span className="text-duo-blue mr-2">Q{currentRound + 1}.</span>
            {currentQuestion.question}
          </h2>

          <div className="space-y-3 mt-auto">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedChoice === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedChoice(idx)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all font-bold text-sm md:text-base flex items-center justify-between group ${
                    isSelected
                      ? "border-duo-blue bg-blue-50 text-duo-blue"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs border ${
                      isSelected ? "bg-duo-blue text-white border-duo-blue" : "bg-slate-100 text-slate-500 border-slate-300 group-hover:bg-slate-200"
                    }`}>
                      {idx + 1}
                    </div>
                    <span>{option}</span>
                  </div>
                  {isSelected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <CheckCircle2 className="w-5 h-5 text-duo-blue" />
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleNext}
            disabled={selectedChoice === null}
            className={`px-8 py-3.5 rounded-xl font-black text-sm md:text-base flex items-center gap-2 transition-all ${
              selectedChoice !== null 
                ? "bg-duo-blue text-white shadow-md shadow-blue-500/20 hover:bg-blue-600 hover:-translate-y-0.5 active:translate-y-0"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {currentRound < questions.length - 1 ? (
              <><span>다음 문항</span> <ChevronRight className="w-5 h-5" /></>
            ) : (
              <><span>최종 제출하기</span> <CheckCircle2 className="w-5 h-5" /></>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
