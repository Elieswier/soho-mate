import { useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

export const RANKS: { min: number; name: string }[] = [
  { min: 0,    name: "Soho Newcomer" },
  { min: 100,  name: "Soho Regular"  },
  { min: 300,  name: "Soho Insider"  },
  { min: 600,  name: "Soho Veteran"  },
  { min: 1000, name: "Soho Mate"     },
];

// Base XP per difficulty level
const DIFF_XP: Record<1 | 2 | 3, number> = { 1: 5, 2: 10, 3: 20 };

export const getRankIndex = (xp: number): number => {
  let idx = 0;
  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].min) idx = i;
  }
  return idx;
};

const rankFor = (xp: number) => RANKS[getRankIndex(xp)].name;

const todayStr = () => new Date().toISOString().slice(0, 10);
const yesterdayStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

// One-time reset for the v2 XP system
if (typeof window !== "undefined" && !localStorage.getItem("sh_xp_v2_reset")) {
  localStorage.setItem("sh_xp", "0");
  localStorage.setItem("sh_xp_v2_reset", "1");
}

export function useXP() {
  const [xp, setXp] = useLocalStorage<number>("sh_xp", 0);
  const [dailyStreak, setDailyStreak] = useLocalStorage<number>("sh_streak", 0);
  const [lastStudy, setLastStudy] = useLocalStorage<string>("sh_last_study", "");
  const [lastPerfect, setLastPerfect] = useLocalStorage<string>("sh_last_perfect", "");
  const [quizMisses, setQuizMisses] = useLocalStorage<Record<number, number>>("sh_quiz_misses", {});
  const [sessionStreak, setSessionStreak] = useState(0);

  // ── Plain addXP (flashcards, bonuses) ──────────────────────────────────────
  const addXP = (amount: number) => {
    if (!amount) return;
    setXp((prev) => prev + amount);
  };

  // ── Difficulty + adaptive XP for quiz correct answers ─────────────────────
  // Returns { amount, levelUp, newRank } so callers can show feedback
  const addQuizXP = (
    difficulty: 1 | 2 | 3,
    questionId: number
  ): { amount: number; levelUp: boolean; newRank: string } => {
    const base = DIFF_XP[difficulty];
    const misses = quizMisses[questionId] ?? 0;
    // Adaptive multiplier: 1× → 1.5× → 2× → 2.5× (capped at 3 misses)
    const multiplier = 1 + Math.min(misses, 3) * 0.5;
    const amount = Math.round(base * multiplier);

    const newXp = xp + amount;
    const prevRankIdx = getRankIndex(xp);
    const newRankIdx = getRankIndex(newXp);
    const levelUp = newRankIdx > prevRankIdx;

    setXp(newXp);
    return { amount, levelUp, newRank: RANKS[newRankIdx].name };
  };

  // ── Track wrong answer (adaptive learning) ────────────────────────────────
  const trackMiss = (questionId: number) => {
    setQuizMisses((prev) => ({
      ...prev,
      [questionId]: (prev[questionId] ?? 0) + 1,
    }));
  };

  // ── Award daily-session bonus once per day ────────────────────────────────
  const awardDailyBonus = (): number => {
    const today = todayStr();
    if (lastStudy === today) return 0;
    let newStreak = 1;
    if (lastStudy === yesterdayStr()) newStreak = dailyStreak + 1;
    setDailyStreak(newStreak);
    setLastStudy(today);
    let bonus = 20;
    if (newStreak === 3) bonus += 30;
    if (newStreak === 7) bonus += 50;
    setXp((prev) => prev + bonus);
    return bonus;
  };

  // ── Perfect quiz bonus (+75, or +100 on consecutive day) ─────────────────
  const awardPerfectQuiz = (): number => {
    const today = todayStr();
    const consecutive = lastPerfect === yesterdayStr();
    const amount = consecutive ? 100 : 75;
    setXp((prev) => prev + amount);
    setLastPerfect(today);
    return amount;
  };

  const updateDailyStreak = () => {
    const today = todayStr();
    if (lastStudy === today) return false;
    let newStreak = 1;
    if (lastStudy === yesterdayStr()) newStreak = dailyStreak + 1;
    setDailyStreak(newStreak);
    setLastStudy(today);
    return true;
  };

  const incrementSessionStreak = () => setSessionStreak((s) => s + 1);
  const resetSessionStreak = () => setSessionStreak(0);

  return {
    xp,
    rank: rankFor(xp),
    rankIndex: getRankIndex(xp),
    addXP,
    addQuizXP,
    trackMiss,
    dailyStreak,
    sessionStreak,
    incrementSessionStreak,
    resetSessionStreak,
    updateDailyStreak,
    awardDailyBonus,
    awardPerfectQuiz,
  };
}
