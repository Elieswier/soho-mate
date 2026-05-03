import { ReactNode } from "react";
import BottomNav from "./BottomNav";

const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-sh-bg text-sh-text flex flex-col">
      <header className="fixed top-0 inset-x-0 h-14 bg-sh-bg border-b border-sh-border flex items-center justify-center z-40">
        <h1 className="font-serif text-[22px] font-normal text-sh-text">House Tracker</h1>
      </header>
      <main className="flex-1 pt-14 pb-20">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default AppShell;
