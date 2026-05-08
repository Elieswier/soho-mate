import { NavLink } from "react-router-dom";
import { Layers, HelpCircle, FileText, ClipboardList, BarChart3, UserCircle, Zap } from "lucide-react";
import { useXP, RANKS } from "@/hooks/useXP";

const tabs = [
  { to: "/", label: "Flashcards", Icon: Layers, end: true },
  { to: "/quiz", label: "Quiz", Icon: HelpCircle },
  { to: "/scripts", label: "Scripts", Icon: FileText },
  { to: "/log-shift", label: "Log shift", Icon: ClipboardList },
  { to: "/insights", label: "Insights", Icon: BarChart3 },
];

const SideNav = ({ onProfileOpen }: { onProfileOpen: () => void }) => {
  const { xp, rank, dailyStreak } = useXP();

  // XP progress to next rank
  let currentRank = RANKS[0];
  let nextRank: typeof RANKS[number] | null = null;
  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].min) { currentRank = RANKS[i]; nextRank = RANKS[i + 1] ?? null; }
  }
  const progressPct = nextRank
    ? Math.min(100, ((xp - currentRank.min) / (nextRank.min - currentRank.min)) * 100)
    : 100;

  return (
    <aside className="hidden md:flex flex-col w-56 h-full border-r border-sh-border bg-sh-bg flex-shrink-0">
      {/* Logo */}
      <div className="px-5 pt-7 pb-5">
        <div className="font-serif text-[26px] text-sh-text leading-none tracking-tight">
          Soho Mate
        </div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-sh-muted mt-1.5">
          Tel Aviv-Jaffa
        </div>
      </div>

      <div className="mx-4 h-px bg-sh-border" />

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {tabs.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 text-[13px] rounded-xl transition-all duration-150 ${
                isActive
                  ? "bg-sh-text text-white shadow-sh-sm"
                  : "text-sh-muted hover:text-sh-text hover:bg-sh-surface"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={15} strokeWidth={isActive ? 2 : 1.5} />
                <span className={isActive ? "font-medium" : "font-normal"}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* XP widget + profile */}
      <div className="mx-3 mb-4 rounded-xl bg-sh-surface border border-sh-border p-4">
        {/* Rank row */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <Zap size={11} strokeWidth={2} className="text-sh-accent" />
            <span className="text-[10px] uppercase tracking-[0.14em] text-sh-muted font-medium">
              {rank}
            </span>
          </div>
          {dailyStreak > 0 && (
            <span className="text-[11px] text-sh-muted">🔥 {dailyStreak}</span>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full bg-sh-border rounded-full overflow-hidden mb-2">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progressPct}%`,
              background: "linear-gradient(90deg, #C4A882, #1A1A1A)",
            }}
          />
        </div>

        {/* XP text */}
        <div className="text-[10px] text-sh-muted mb-3">
          <span className="text-sh-text font-medium">{xp} XP</span>
          {nextRank ? ` · ${nextRank.min - xp} to ${nextRank.name}` : " · Top rank"}
        </div>

        {/* Profile button */}
        <button
          onClick={onProfileOpen}
          className="flex items-center gap-2 text-[12px] text-sh-muted hover:text-sh-text transition-colors w-full"
        >
          <UserCircle size={15} strokeWidth={1.5} />
          <span>Profile</span>
        </button>
      </div>
    </aside>
  );
};

export default SideNav;
