import { ReactNode, useState } from "react";
import { useLocation } from "react-router-dom";
import { UserCircle } from "lucide-react";
import BottomNav from "./BottomNav";
import SideNav from "./SideNav";
import Profile from "./Profile";
import { useXP } from "@/hooks/useXP";

const AppShell = ({ children }: { children: ReactNode }) => {
  const { xp, rank, dailyStreak } = useXP();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="h-[100dvh] bg-sh-bg text-sh-text flex overflow-hidden">
      {/* Desktop sidebar */}
      <SideNav onProfileOpen={() => setProfileOpen(true)} />

      {/* Main column */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile header — hidden on desktop */}
        <header
          className="md:hidden fixed top-0 inset-x-0 flex items-center justify-between px-4 z-40"
          style={{
            height: "calc(56px + env(safe-area-inset-top))",
            paddingTop: "env(safe-area-inset-top)",
            background: "rgba(250, 248, 245, 0.85)",
            backdropFilter: "blur(20px) saturate(1.4)",
            WebkitBackdropFilter: "blur(20px) saturate(1.4)",
            borderBottom: "1px solid rgba(214, 206, 195, 0.6)",
          }}
        >
          {/* XP pill */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
            style={{ background: "rgba(240, 234, 224, 0.8)" }}
          >
            <span className="text-[10px] font-medium text-sh-text">{xp} XP</span>
            {dailyStreak > 0 && (
              <span className="text-[10px] text-sh-muted">· 🔥{dailyStreak}</span>
            )}
          </div>

          {/* Logo centered */}
          <h1
            className="font-sans font-black text-[18px] text-sh-text absolute left-1/2 tracking-tight"
            style={{
              top: "calc(50% + env(safe-area-inset-top) / 2)",
              transform: "translate(-50%, -50%)",
            }}
          >
            Soho Mate
          </h1>

          {/* Profile button */}
          <button
            onClick={() => setProfileOpen(true)}
            aria-label="Open profile"
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-sh-surface transition-colors"
          >
            <UserCircle size={19} strokeWidth={1.5} className="text-sh-muted" />
          </button>
        </header>

        <Profile open={profileOpen} onClose={() => setProfileOpen(false)} />

        {/* Scrollable content */}
        <main
          key={location.pathname}
          className="flex-1 overflow-y-auto overflow-x-hidden pt-[calc(56px+env(safe-area-inset-top))] md:pt-0"
        >
          {children}
        </main>

        {/* Mobile bottom nav — hidden on desktop */}
        <BottomNav />
      </div>
    </div>
  );
};

export default AppShell;
