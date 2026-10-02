"use client";

import React, { useEffect } from "react";
import AssessmentExam from "@/components/AssessmentExam";
import { useBattleStudy } from "@/context/BattleStudyContext";
import { useRouter } from "next/navigation";

export default function AssessmentRoutePage() {
  const router = useRouter();
  const {
    handleFinishMatch,
    isStrictAssessment,
    customBattleQuestions
  } = useBattleStudy();

  useEffect(() => {
    // If somehow a user reaches here without strict mode enabled, kick them to lobby
    if (!isStrictAssessment) {
      router.push("/");
    }
  }, [isStrictAssessment, router]);

  if (!isStrictAssessment) return null;

  return (
    <AssessmentExam
      questions={customBattleQuestions}
      onFinish={handleFinishMatch}
    />
  );
}
