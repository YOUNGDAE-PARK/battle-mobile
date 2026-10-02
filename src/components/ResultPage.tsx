"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, Award, RefreshCw, ChevronDown, ChevronUp, Check, X, 
  Sparkles, Flame, ShieldAlert, BookOpen, MessageSquare, Zap, Crown
} from "lucide-react";
import { OpponentData } from "./Lobby";

interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

interface AnswersLogItem {
  question: Question;
  isCorrect: boolean;
  selectedIndex: number;
  timeTaken: number;
}

interface ResultPageProps {
  userProfile: { nickname: string; school: string; tier: string; lp: number };
  opponent: OpponentData;
  userFinalHp: number;
  opponentFinalHp: number;
  answersLog: AnswersLogItem[];
  isFirstMatch?: boolean;
  onReturnToLobby: (newTier: string, newLp: number) => void;
  isStrictAssessment?: boolean;
  onGoToTeacherDashboard?: () => void;
}

const TIER_ORDER = ["Iron", "Bronze", "Silver", "Gold", "Diamond"];
const TIER_DETAILS: Record<string, { label: string; color: string; title: string; bg: string }> = {
  Iron: { label: "아이언", color: "#a19d94", title: "[뇌정지]", bg: "from-stone-850 to-stone-950 border-stone-800" },
  Bronze: { label: "브론즈", color: "#cd7f32", title: "[오답 자판기]", bg: "from-white to-duo-gray border-amber-900" },
  Silver: { label: "실버", color: "#c0c0c0", title: "[현지인]", bg: "from-duo-gray to-duo-gray-dark border-duo-gray-dark" },
  Gold: { label: "골드", color: "#ffd700", title: "[1인분 장인]", bg: "from-white via-duo-gray to-duo-gray border-duo-yellow" },
  Diamond: { label: "다이아몬드", color: "#b9f2ff", title: "[하드캐리 머신]", bg: "from-white via-duo-gray to-duo-gray border-duo-blue" },
};

export default function ResultPage({ 
  userProfile, opponent, userFinalHp, opponentFinalHp, answersLog, isFirstMatch, onReturnToLobby,
  isStrictAssessment = false, onGoToTeacherDashboard
}: ResultPageProps) {
  const isVictory = userFinalHp > opponentFinalHp;
  
  // Rank calculations
  const originalTier = userProfile.tier;
  const originalLp = userProfile.lp;
  const lpChange = isVictory ? 20 : -15;
  
  const [displayedLp, setDisplayedLp] = useState(originalLp);
  const [displayedTier, setDisplayedTier] = useState(originalTier);
  const [isPromoted, setIsPromoted] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [animatingLp, setAnimatingLp] = useState(true);
  const [showKakaoModal, setShowKakaoModal] = useState((isFirstMatch && !isStrictAssessment) || false);
  const [kakaoLinked, setKakaoLinked] = useState(false);

  // LP counting animation
  useEffect(() => {
    const timer = setTimeout(() => {
      let currentLp = originalLp;
      const targetLp = originalLp + lpChange;

      const interval = setInterval(() => {
        if (isVictory) {
          if (currentLp < targetLp) {
            currentLp += 1;
            if (currentLp >= 100) {
              // Promotion Trigger!
              clearInterval(interval);
              setIsPromoted(true);
              setDisplayedLp(100);
              
              // Transition to next tier
              setTimeout(() => {
                const nextTierIndex = Math.min(TIER_ORDER.indexOf(originalTier) + 1, TIER_ORDER.length - 1);
                setDisplayedTier(TIER_ORDER[nextTierIndex]);
                setDisplayedLp(0);
                
                // Add remaining LP to the new tier
                let newLpStart = 0;
                const remainingLp = targetLp - 100;
                const innerInterval = setInterval(() => {
                  if (newLpStart < remainingLp) {
                    newLpStart += 1;
                    setDisplayedLp(newLpStart);
                  } else {
                    clearInterval(innerInterval);
                    setAnimatingLp(false);
                  }
                }, 30);
              }, 1000);
            } else {
              setDisplayedLp(currentLp);
            }
          } else {
            clearInterval(interval);
            setAnimatingLp(false);
          }
        } else {
          // Defeat: LP drops
          if (currentLp > targetLp) {
            currentLp -= 1;
            if (currentLp < 0) {
              // Demotion trigger (prevent demotion below Iron 0 LP for MVP safety)
              clearInterval(interval);
              setDisplayedLp(0);
              setAnimatingLp(false);
            } else {
              setDisplayedLp(currentLp);
            }
          } else {
            clearInterval(interval);
            setAnimatingLp(false);
          }
        }
      }, 30);

      return () => clearInterval(interval);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleReturn = () => {
    let finalLp = originalLp + lpChange;
    let finalTier = originalTier;
    
    if (isVictory && finalLp >= 100) {
      const nextTierIndex = Math.min(TIER_ORDER.indexOf(originalTier) + 1, TIER_ORDER.length - 1);
      finalTier = TIER_ORDER[nextTierIndex];
      finalLp = finalLp - 100;
    } else if (!isVictory && finalLp < 0) {
      // Keep at 0 LP, no demotion in MVP
      finalLp = 0;
    }
    
    onReturnToLobby(finalTier, finalLp);
  };

  const correctAnswersCount = answersLog.filter(a => a.isCorrect).length;
  const currentTierInfo = TIER_DETAILS[displayedTier] || TIER_DETAILS.Silver;

  return (
    <div className="min-h-screen bg-duo-gray text-duo-dark py-12 px-4 relative overflow-x-hidden font-sans">
      {/* Background Radial Glow */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full blur-3xl pointer-events-none opacity-20 ${
        isVictory ? "bg-duo-blue" : "bg-duo-red"
      }`} />

      {/* Promotion Animation Screen Overlay */}
      <AnimatePresence>
        {isPromoted && animatingLp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-duo-gray flex flex-col items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.6, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
              className="text-center px-6"
            >
              <div className="inline-flex p-5 rounded-full bg-duo-yellow/20 border-2 border-duo-yellow mb-4 animate-bounce">
                <Crown className="w-16 h-16 text-duo-yellow fill-yellow-400/20" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-duo-gray to-duo-gray tracking-wider">
                TIER PROMOTED!
              </h2>
              <p className="text-lg font-bold text-duo-dark mt-2">
                축하합니다! 티어가 승격되었습니다!
              </p>
              
              <div className="mt-8 flex items-center justify-center gap-6 text-2xl font-black">
                <span className="text-duo-dark line-through">
                  {TIER_DETAILS[originalTier].label}
                </span>
                <span className="text-duo-blue">→</span>
                <span style={{ color: TIER_DETAILS[displayedTier].color }} className="animate-pulse">
                  {TIER_DETAILS[displayedTier].label}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto flex flex-col items-center gap-8 relative z-10">
        
        {/* Victory/Defeat Plate Banner */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="text-center relative"
        >
          {isStrictAssessment ? (
            <div className="relative">
              <div className="absolute inset-0 bg-duo-blue/10 blur-xl rounded-full scale-125" />
              <div className="inline-block px-3 py-1 bg-duo-blue/20 text-duo-blue border border-duo-blue rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                수학 수행평가 답안 제출 완료
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-duo-blue via-duo-blue-dark to-duo-blue">
                AI 1차 자동 채점 완료
              </h1>
              <p className="text-xs md:text-sm font-extrabold text-duo-blue mt-2">
                답안이 안전하게 제출되었습니다. 담당 교사의 2차 최종 점수 확정 대기 중입니다.
              </p>
            </div>
          ) : isVictory ? (
            <div className="relative">
              {/* Confetti Glow Background */}
              <div className="absolute inset-0 bg-duo-blue/10 blur-xl rounded-full scale-125" />
              <h1 className="text-6xl md:text-8xl font-black tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white via-duo-gray to-teal-400 ">
                VICTORY
              </h1>
              <p className="text-sm font-extrabold text-duo-blue tracking-[0.25em] uppercase mt-2">
                배틀에서 승리하여 명예를 쟁취했습니다!
              </p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute inset-0 bg-duo-red/10 blur-xl rounded-full scale-125" />
              <h1 className="text-6xl md:text-8xl font-black tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white via-duo-gray to-duo-gray ">
                DEFEAT
              </h1>
              <p className="text-sm font-extrabold text-duo-red tracking-[0.25em] uppercase mt-2">
                배틀에서 패배했습니다. 다시 기회를 노리세요.
              </p>
            </div>
          )}

          {/* Stats Bar */}
          <div className="mt-8 inline-flex items-center gap-6 bg-white border border-duo-gray-dark px-6 py-2.5 rounded-full text-xs font-semibold text-duo-dark">
            <span>정답 수: <strong className="text-duo-dark">{correctAnswersCount} / {answersLog.length || 3}</strong></span>
            {isStrictAssessment ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                <span>AI 1차 산출 점수: <strong className="text-duo-green font-mono text-sm">{Math.round((correctAnswersCount / (answersLog.length || 1)) * 100)}점</strong></span>
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                <span>상태: <strong className="text-duo-yellow">교사 2차 확정 대기</strong></span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                <span>최종 HP: <strong className="text-duo-dark">{Math.max(0, userFinalHp)}%</strong></span>
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                <span>상대 최종 HP: <strong className="text-duo-dark">{Math.max(0, opponentFinalHp)}%</strong></span>
              </>
            )}
          </div>
        </motion.div>

        {/* Tier & LP Update Progress Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`w-full max-w-lg bg-gradient-to-b ${currentTierInfo.bg} backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl relative overflow-hidden`}
        >
          {/* Card Glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="text-xs text-duo-dark font-bold uppercase tracking-wider">리그 포인트 업데이트</span>
            <span className={`text-sm font-black flex items-center gap-1 ${
              isVictory ? "text-duo-blue" : "text-duo-red"
            }`}>
              {isVictory ? `+${lpChange} LP` : `${lpChange} LP`}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-14 h-14 rounded-xl bg-duo-gray border border-duo-gray-dark flex items-center justify-center shadow-inner">
              <div 
                className="w-8 h-8 rotate-45 border-2 rounded flex items-center justify-center text-xs font-black"
                style={{ 
                  borderColor: currentTierInfo.color,
                  background: `linear-gradient(135deg, ${currentTierInfo.color}22, #000)`
                }}
              >
                <span className="-rotate-45" style={{ color: currentTierInfo.color }}>
                  {displayedTier[0]}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-black text-duo-dark" style={{ color: currentTierInfo.color }}>
                {currentTierInfo.label}
              </h3>
              <p className="text-xs text-duo-dark font-bold uppercase tracking-widest mt-0.5">
                {currentTierInfo.title}
              </p>
            </div>
          </div>

          {/* LP Slider Progress Bar */}
          <div className="space-y-2 relative z-10">
            <div className="flex justify-between items-end text-xs font-semibold">
              <span className="text-duo-dark">Progression</span>
              <span className="font-mono text-duo-dark">
                {displayedLp} <span className="text-duo-gray-dark font-normal">/ 100 LP</span>
              </span>
            </div>
            <div className="h-2.5 w-full bg-duo-gray rounded-full p-0.5 border border-duo-gray-dark overflow-hidden">
              <motion.div 
                className="h-full rounded-full"
                animate={{ width: `${displayedLp}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ 
                  background: `linear-gradient(90deg, ${currentTierInfo.color}, ${currentTierInfo.color}88)`
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* AI Tutor Section: BattleStudy AI Analysis Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full bg-white backdrop-blur-md border border-duo-gray-dark rounded-3xl p-6 md:p-8 flex flex-col gap-6"
        >
          <div>
            <h3 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
              <BookOpen className="text-duo-blue w-5 h-5" />
              배틀스터디 AI 오답 분석 피드백
            </h3>
            <p className="text-xs text-duo-gray-dark mt-1">
              각 문제에 대한 AI 튜터의 맞춤형 분석 보고서입니다. 카드를 클릭해 상세 해설을 확인하세요.
            </p>
          </div>

          {/* Questions Grid/List */}
          <div className="space-y-4">
            {answersLog.map((log, index) => {
              const isOpen = expandedQuestion === index;
              const isWrong = !log.isCorrect;

              return (
                <div 
                  key={index}
                  className={`bg-white border rounded-2xl overflow-hidden transition-all ${
                    isOpen 
                      ? "border-duo-gray-dark shadow-lg shadow-black/30" 
                      : isWrong
                        ? "border-duo-red hover:border-duo-red"
                        : "border-duo-gray-dark hover:border-duo-gray-dark"
                  }`}
                >
                  {/* Collapsed Header Bar */}
                  <button
                    onClick={() => setExpandedQuestion(isOpen ? null : index)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      {/* Check/X status emblem */}
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 font-extrabold text-xs ${
                        log.isCorrect 
                          ? "bg-duo-green/10 border border-duo-green text-duo-green" 
                          : "bg-duo-red/10 border border-duo-red text-duo-red"
                      }`}>
                        {log.isCorrect ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      </div>
                      
                      <div>
                        <span className="text-[10px] text-duo-gray-dark font-bold uppercase tracking-wider">
                          ROUND {index + 1} • {log.question.category}
                        </span>
                        <h4 className="text-sm md:text-base font-extrabold text-duo-dark mt-0.5 line-clamp-1">
                          {log.question.question}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-duo-gray-dark font-mono hidden sm:block">
                        풀이 시간: {log.timeTaken}초
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-duo-gray-dark" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-duo-gray-dark" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Content Area (Explanation & Review) */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-duo-gray-dark bg-duo-gray"
                      >
                        <div className="p-5 space-y-4 text-sm">
                          
                          {/* Selected Choice Summary */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-3 bg-white border border-duo-gray-dark rounded-xl">
                              <span className="text-xs text-duo-gray-dark font-bold block mb-1">나의 선택</span>
                              <p className={`font-semibold text-xs md:text-sm ${isWrong ? "text-duo-red" : "text-duo-green"}`}>
                                {log.selectedIndex === -1 
                                  ? "시간 초과 (선택 안 함)" 
                                  : `${log.selectedIndex + 1}. ${log.question.options[log.selectedIndex]}`}
                              </p>
                            </div>
                            <div className="p-3 bg-white border border-duo-gray-dark rounded-xl">
                              <span className="text-xs text-duo-gray-dark font-bold block mb-1">정답</span>
                              <p className="font-semibold text-xs md:text-sm text-duo-green">
                                {log.question.answerIndex + 1}. {log.question.options[log.question.answerIndex]}
                              </p>
                            </div>
                          </div>

                          {/* AI Tutor breakdown feedback */}
                          <div className="p-4 bg-white border border-duo-blue rounded-2xl relative">
                            {/* AI Coach Banner */}
                            <div className="flex items-center gap-2 mb-3.5">
                              <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-white to-duo-gray flex items-center justify-center shadow">
                                <Zap className="w-3.5 h-3.5 text-duo-dark fill-white" />
                              </div>
                              <span className="text-xs font-extrabold text-duo-blue uppercase tracking-wider">
                                BattleStudy AI 튜터 피드백
                              </span>
                            </div>
                            
                            <p className="text-duo-dark font-medium text-xs md:text-sm leading-relaxed break-keep">
                              {log.isCorrect 
                                ? `멋진 실력입니다! 이 문제를 정확히 푸셨습니다. ${log.question.explanation}` 
                                : `아이고! 여기서 오답이 발생하는군요. ${log.question.explanation}`}
                            </p>
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA Return Lobby / Teacher Dashboard Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mt-4">
          {isStrictAssessment && onGoToTeacherDashboard && (
            <button
              onClick={onGoToTeacherDashboard}
              className="w-full py-4 bg-duo-blue hover:bg-indigo-700 text-duo-dark font-black text-xs md:text-sm rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>👩‍🏫 교사 대시보드에서 채점 결과 확인</span>
            </button>
          )}

          <motion.button
            onClick={handleReturn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full font-bold rounded-2xl py-4 transition-colors cursor-pointer text-xs md:text-sm ${
              isStrictAssessment 
                ? "bg-white hover:bg-white border border-duo-gray-dark text-duo-dark" 
                : "relative overflow-hidden p-[1.5px]"
            }`}
          >
            {isStrictAssessment ? (
              <span>학생 로비로 복귀</span>
            ) : (
              <>
                <span className="absolute inset-0 bg-gradient-to-r from-white via-duo-gray to-duo-gray rounded-2xl" />
                <div className="relative flex items-center justify-center gap-2 bg-duo-gray text-duo-dark font-bold rounded-[14px] py-4 hover:bg-white transition-colors">
                  <span>로비로 돌아가기</span>
                </div>
              </>
            )}
          </motion.button>
        </div>
        
      </div>

      {/* Kakao Record Saving Modal (Growth Hacking Retention Popup) */}
      <AnimatePresence>
        {showKakaoModal && (
          <div className="fixed inset-0 z-50 bg-duo-gray backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-white border border-duo-gray-dark rounded-3xl p-6 md:p-8 shadow-2xl relative text-center space-y-6"
            >
              <div className="inline-flex p-4 rounded-full bg-duo-yellow/10 border border-duo-yellow text-duo-yellow">
                <Sparkles className="w-8 h-8 text-duo-yellow fill-yellow-400/20 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-duo-dark">
                  🎉 첫 퀴즈 배틀 완료!
                </h3>
                <p className="text-duo-dark text-xs md:text-sm leading-relaxed break-keep font-sans">
                  당신의 첫 번째 놀라운 기록을 영구 저장하시겠습니까? <br />
                  <span className="text-duo-dark mt-1 block">
                    (닉네임: <strong className="text-duo-blue">{userProfile.nickname}</strong>, 
                    학교: <strong className="text-duo-blue">{userProfile.school}</strong>, 
                    획득 LP: <strong className="text-duo-yellow">+{lpChange} LP</strong>)
                  </span>
                </p>
              </div>

              {kakaoLinked ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-duo-green/10 border border-duo-green rounded-2xl text-duo-green text-xs font-bold"
                >
                  ✅ 카카오 계정 연동 완료! <br />
                  <span className="text-duo-dark text-[10px] block mt-1">
                    다음 판부터 전적 및 랭크 점수가 영구 보존됩니다.
                  </span>
                </motion.div>
              ) : (
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setKakaoLinked(true);
                      setTimeout(() => {
                        setShowKakaoModal(false);
                      }, 2000);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#191919] font-black text-sm rounded-2xl shadow-lg cursor-pointer transition-all hover:scale-102"
                  >
                    <MessageSquare className="w-4 h-4 fill-current shrink-0" />
                    <span>1초 만에 카카오로 시작하기</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowKakaoModal(false)}
                    className="text-xs text-duo-gray-dark hover:text-duo-dark font-bold transition-colors cursor-pointer"
                  >
                    나중에 연동하기
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
