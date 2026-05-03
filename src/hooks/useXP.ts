import { useLocalStorage } from "./useLocalStorage";
import { useState } from "react";

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

export function useXP() {
  const [xp, setXp] = useLocalStorage<number>("sh_xp", 0);
  const [dailyStreak, setDailyStreak] = useLocalStorage<number>("sh_streak", 0);
  const [lastStudy, setLastStudy] = useLocalStorage<string>("sh_last_study", "");
  const [sessionStreak, setSessionStreak] = useState(0);

  const updateDailyStreak = () => {
    const today = todayStr();
    if (lastStudy === today) return false;
    if (lastStudy === yesterdayStr()) {
      setDailyStreak(dailyStreak + 1);
    } else {
      setDailyStreak(1);
    }
    setLastStudy(today);
    return true;
  };

  const addXP = (amount: number) => {
    const today = todayStr();
    let bonus = 0;
    if (lastStudy !== today) {
      if (lastStudy === yesterdayStr()) setDailyStreak(dailyStreak + 1);
      else setDailyStreak(1);
      setLastStudy(today);
      bonus = 20;
    }
    setXp(xp + amount + bonus);
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
  };
}
