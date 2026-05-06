import { NavLink } from "react-router-dom";
import { Layers, HelpCircle, FileText, ClipboardList, BarChart3 } from "lucide-react";

const tabs = [
  { to: "/", label: "Flashcards", Icon: Layers, end: true },
  { to: "/quiz", label: "Quiz", Icon: HelpCircle },
  { to: "/scripts", label: "Scripts", Icon: FileText },
  { to: "/log-shift", label: "Log shift", Icon: ClipboardList },
  { to: "/insights", label: "Insights", Icon: BarChart3 },
];

const BottomNav = () => {
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 border-t border-sh-border flex z-40"
      style={{
        background: "#FAF8F5",
        paddingBottom: "env(safe-area-inset-bottom)",
        height: "calc(80px + env(safe-area-inset-bottom))",
      }}
    >
      {tabs.map(({ to, label, Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-1 min-h-[44px] ${
              isActive ? "text-sh-text" : "text-sh-muted"
            }`
          }
        >
          <Icon size={22} strokeWidth={1.5} />
          <span className="text-[11px] font-light tracking-wide">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
