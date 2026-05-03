import { ReactNode } from "react";
import BottomNav from "./BottomNav";
import { useXP } from "@/hooks/useXP";

const AppShell = ({ children }: { children: ReactNode }) => {
  const { xp, rank, dailyStreak } = useXP();
  return (
    <div className="min-h-screen bg-sh-bg text-sh-text flex flex-col overflow-x-hidden">
      <header className="fixed top-0 inset-x-0 h-14 bg-sh-bg border-b border-sh-border flex items-center justify-between px-4 z-40">
        <div className="flex flex-col leading-tight min-w-0">
          <span className="text-[10px] uppercase tracking-wider text-sh-muted truncate">{rank}</span>
          <span className="text-[11px] text-sh-text">{xp} XP</span>
        </div>
        <h1 className="font-serif text-[20px] font-normal text-sh-text absolute left-1/2 -translate-x-1/2">House Tracker</h1>
        <div className="text-[11px] text-sh-text min-w-[40px] text-right">
          {dailyStreak > 0 ? `🔥 ${dailyStreak}` : ""}
        </div>
      </header>
      <main className="flex-1 pt-14 pb-20 overflow-x-hidden">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default AppShell;
