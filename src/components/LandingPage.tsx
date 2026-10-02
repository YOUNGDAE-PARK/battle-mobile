import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Calculator, User, School, Search, Zap } from "lucide-react";

const SEOUL_MIDDLE_SCHOOLS = [
  "청계중학교",
  "대청중학교",
  "휘문중학교",
  "대명중학교",
  "진선여중",
  "단대부중",
  "숙명여중",
];

interface LandingPageProps {
  onJoin: (nickname: string, school: string) => void;
  onGoToTeacherDashboard?: () => void;
}

export default function LandingPage({ onJoin, onGoToTeacherDashboard }: LandingPageProps) {
  const [nickname, setNickname] = useState("");
  const [schoolInput, setSchoolInput] = useState("");
  const [filteredSchools, setFilteredSchools] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (schoolInput.trim() === "") {
      setFilteredSchools(SEOUL_MIDDLE_SCHOOLS.slice(0, 4));
    } else {
      const filtered = SEOUL_MIDDLE_SCHOOLS.filter(s => s.includes(schoolInput));
      setFilteredSchools(filtered.slice(0, 5));
    }
  }, [schoolInput]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nickname.trim()) {
      setError("닉네임을 입력해주세요!");
      return;
    }
    if (nickname.length < 2) {
      setError("닉네임은 2글자 이상이어야 해요.");
      return;
    }
    if (!schoolInput.trim()) {
      setError("학교 이름을 입력해주세요!");
      return;
    }

    onJoin(nickname, schoolInput);
  };

  return (
    <div className="relative min-h-screen bg-white text-duo-dark flex flex-col items-center justify-center font-sans p-4 overflow-hidden">
      {/* Playful Background Elements */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-duo-yellow/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-duo-green/20 rounded-full blur-xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md w-full"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-duo-green mb-2">
            스쿨배틀
          </h1>
          <p className="text-lg font-bold text-duo-gray-dark">
            학교의 명예를 걸고 맞붙자!
          </p>
        </div>

        {/* Card */}
        <div className="duo-card space-y-6 shadow-sm">
          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-duo-gray rounded-2xl">
            <button
              type="button"
              className="flex-1 py-3 rounded-xl text-sm font-bold bg-white text-duo-green shadow-sm flex items-center justify-center gap-2 cursor-pointer border-b-2 border-duo-gray-dark"
            >
              <Swords className="w-5 h-5" />
              학생 로그인
            </button>

            {onGoToTeacherDashboard && (
              <button
                type="button"
                onClick={onGoToTeacherDashboard}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-duo-dark hover:bg-white/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calculator className="w-5 h-5" />
                선생님
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-duo-red/10 border-2 border-duo-red rounded-xl text-duo-red text-sm font-bold text-center"
              >
                {error}
              </motion.div>
            )}

            {/* Nickname Input */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-duo-dark ml-2">
                닉네임
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-duo-gray-dark" />
                <input
                  type="text"
                  placeholder="예: 대치동불주먹"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={12}
                  className="w-full bg-duo-gray border-2 border-duo-gray-dark rounded-2xl py-4 pl-12 pr-4 text-duo-dark placeholder-duo-gray-dark focus:outline-none focus:border-duo-blue focus:bg-white transition-all font-bold text-base"
                />
              </div>
            </div>

            {/* School Input */}
            <div className="space-y-2 relative">
              <label className="block text-sm font-bold text-duo-dark ml-2">
                우리 학교
              </label>
              <div className="relative">
                <School className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-duo-gray-dark" />
                <input
                  type="text"
                  placeholder="예: 청계중학교"
                  value={schoolInput}
                  onChange={(e) => {
                    setSchoolInput(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full bg-duo-gray border-2 border-duo-gray-dark rounded-2xl py-4 pl-12 pr-4 text-duo-dark placeholder-duo-gray-dark focus:outline-none focus:border-duo-blue focus:bg-white transition-all font-bold text-base"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-duo-gray-dark" />
              </div>

              {/* Dropdown Suggestions */}
              <AnimatePresence>
                {showDropdown && filteredSchools.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-20 w-full left-0 mt-2 bg-white border-2 border-duo-gray-dark rounded-2xl shadow-lg overflow-hidden"
                  >
                    {filteredSchools.map((school, idx) => (
                      <button
                        key={school}
                        type="button"
                        onClick={() => {
                          setSchoolInput(school);
                          setShowDropdown(false);
                        }}
                        className={`w-full text-left px-5 py-4 text-duo-dark hover:bg-duo-gray text-base font-bold transition-colors ${idx !== filteredSchools.length - 1 ? 'border-b-2 border-duo-gray' : ''}`}
                      >
                        {school}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="btn-duo-primary flex items-center justify-center gap-2"
              >
                <span>아레나 입장하기</span>
                <Zap className="w-5 h-5 fill-white" />
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
