import { useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

const RANKS: { min: number; name: string }[] = [
  { min: 0, name: "Soho Newcomer" },
  { min: 100, name: "Soho Regular" },
  { min: 300, name: "Soho Insider" },
  { min: 600, name: "Soho Veteran" },
  { min: 1000, name: "Soho Mate" },
];

const rankFor = (xp: number) => {
  let r = RANKS[0].name;
  for (const t of RANKS) if (xp >= t.min) r = t.name;
  return r;
};

const todayStr = () => new Date().toISOString().slice(0, 10);
const yesterdayStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

// One-time reset for the new XP system
if (typeof window !== "undefined" && !localStorage.getItem("sh_xp_v2_reset")) {
  localStorage.setItem("sh_xp", "0");
  localStorage.setItem("sh_xp_v2_reset", "1");
}

export function useXP() {
  const [xp, setXp] = useLocalStorage<number>("sh_xp", 0);
  const [dailyStreak, setDailyStreak] = useLocalStorage<number>("sh_streak", 0);
  const [lastStudy, setLastStudy] = useLocalStorage<string>("sh_last_study", "");
  const [lastPerfect, setLastPerfect] = useLocalStorage<string>("sh_last_perfect", "");
  const [sessionStreak, setSessionStreak] = useState(0);

  const updateDailyStreak = () => {
    const today = todayStr();
    if (lastStudy === today) return false;
    let newStreak = 1;
    if (lastStudy === yesterdayStr()) newStreak = dailyStreak + 1;
    setDailyStreak(newStreak);
    setLastStudy(today);
    return true;
  };

  // Pure XP add — no streak side effects
  const addXP = (amount: number) => {
    if (!amount) return;
    setXp(xp + amount);
  };

  // Award daily-session bonus once per day on study activity
  const awardDailyBonus = () => {
    const today = todayStr();
    if (lastStudy === today) return 0;
    let newStreak = 1;
    if (lastStudy === yesterdayStr()) newStreak = dailyStreak + 1;
    setDailyStreak(newStreak);
    setLastStudy(today);
    let bonus = 20;
    if (newStreak === 3) bonus += 30;
    if (newStreak === 7) bonus += 50;
    setXp(xp + bonus);
    return bonus;
  };

  // Quiz perfect — award +75, or +100 if perfect again on a consecutive day
  const awardPerfectQuiz = () => {
    const today = todayStr();
    const consecutive = lastPerfect === yesterdayStr();
    const amount = consecutive ? 100 : 75;
    setXp(xp + amount);
    setLastPerfect(today);
    return amount;
  };

  const incrementSessionStreak = () => setSessionStreak((s) => s + 1);
  const resetSessionStreak = () => setSessionStreak(0);

  return {
    xp,
    rank: rankFor(xp),
    addXP,
    dailyStreak,
    sessionStreak,
    incrementSessionStreak,
    resetSessionStreak,
    updateDailyStreak,
    awardDailyBonus,
    awardPerfectQuiz,
  };
}
