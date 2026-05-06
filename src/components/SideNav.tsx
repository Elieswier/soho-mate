import { NavLink } from "react-router-dom";
import { Layers, HelpCircle, FileText, ClipboardList, BarChart3, UserCircle } from "lucide-react";
import { useXP } from "@/hooks/useXP";

const tabs = [
  { to: "/", label: "Flashcards", Icon: Layers, end: true },
  { to: "/quiz", label: "Quiz", Icon: HelpCircle },
  { to: "/scripts", label: "Scripts", Icon: FileText },
  { to: "/log-shift", label: "Log shift", Icon: ClipboardList },
  { to: "/insights", label: "Insights", Icon: BarChart3 },
];

const SideNav = ({ onProfileOpen }: { onProfileOpen: () => void }) => {
  const { xp, rank, dailyStreak } = useXP();

  return (
    <aside className="hidden md:flex flex-col w-52 h-full border-r border-sh-border bg-sh-bg flex-shrink-0">
      {/* Logo */}
      <div className="px-6 pt-8 pb-6 border-b border-sh-border">
        <div className="font-serif text-[24px] text-sh-text leading-none">Soho Mate</div>
        <div className="text-[10px] uppercase tracking-widest text-sh-muted mt-1">Tel Aviv-Jaffa</div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {tabs.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 text-[13px] transition-colors ${
                isActive
                  ? "bg-sh-surface text-sh-text border-l-2 border-sh-text pl-[10px]"
                  : "text-sh-muted hover:text-sh-text hover:bg-sh-surface border-l-2 border-transparent pl-[10px]"
              }`
            }
          >
            <Icon size={15} strokeWidth={1.5} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User info + profile */}
      <div className="px-5 py-5 border-t border-sh-border">
        <div className="text-[10px] uppercase tracking-widest text-sh-muted">{rank}</div>
        <div className="text-[13px] text-sh-text mt-0.5">
          {xp} XP{dailyStreak > 0 ? ` · 🔥 ${dailyStreak}` : ""}
        </div>
        <button
          onClick={onProfileOpen}
          className="mt-3 flex items-center gap-2 text-[11px] text-sh-muted hover:text-sh-text"
        >
          <UserCircle size={14} strokeWidth={1.5} />
          Profile
        </button>
      </div>
    </aside>
  );
};

export default SideNav;
