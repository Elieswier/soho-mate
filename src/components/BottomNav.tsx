import { NavLink } from "react-router-dom";
import { Layers, HelpCircle, FileText, ClipboardList, BarChart3 } from "lucide-react";

const tabs = [
  { to: "/", label: "Cards", Icon: Layers, end: true },
  { to: "/quiz", label: "Quiz", Icon: HelpCircle },
  { to: "/scripts", label: "Scripts", Icon: FileText },
  { to: "/log-shift", label: "Log", Icon: ClipboardList },
  { to: "/insights", label: "Insights", Icon: BarChart3 },
];

const BottomNav = () => {
  return (
    <div
      className="md:hidden fixed bottom-0 inset-x-0 z-40 flex items-end justify-center pointer-events-none"
      style={{ paddingBottom: "calc(14px + env(safe-area-inset-bottom))" }}
    >
      <nav
        className="flex items-center gap-0.5 px-2 py-1.5 rounded-2xl pointer-events-auto"
        style={{
          background: "rgba(250, 248, 245, 0.88)",
          backdropFilter: "blur(24px) saturate(1.5)",
          WebkitBackdropFilter: "blur(24px) saturate(1.5)",
          boxShadow:
            "0 4px 28px rgba(26,26,26,0.13), 0 1px 0 rgba(255,255,255,0.7) inset, 0 0 0 1px rgba(214,206,195,0.55)",
        }}
      >
        {tabs.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-[3px] px-3.5 py-2 rounded-xl transition-all duration-200 min-w-[58px] ${
                isActive
                  ? "bg-sh-text text-white shadow-sh-sm"
                  : "text-sh-muted hover:text-sh-text hover:bg-sh-surface"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={19} strokeWidth={isActive ? 2 : 1.5} />
                <span
                  className={`text-[10px] tracking-wide leading-none ${
                    isActive ? "font-semibold" : "font-normal"
                  }`}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default BottomNav;
