import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAchievements, ALL_ACHIEVEMENTS } from "@/hooks/useAchievements";

const BACKUP_KEYS = [
  "sh_shifts", "sh_xp", "sh_streak", "sh_last_study",
  "sh_mastered", "sh_best_score", "sh_onboarded",
];
const ALL_KEYS = [...BACKUP_KEYS, "sh_hourly_rate", "sh_language"];

const RANKS = [
  { min: 0, name: "Soho Newcomer" },
  { min: 100, name: "Soho Regular" },
  { min: 300, name: "Soho Insider" },
  { min: 600, name: "Soho Veteran" },
  { min: 1000, name: "Soho Mate" },
];

const rankInfo = (xp: number) => {
  let current = RANKS[0];
  let next: typeof RANKS[number] | null = null;
  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].min) {
      current = RANKS[i];
      next = RANKS[i + 1] ?? null;
    }
  }
  return { current, next };
};

interface ProfileProps {
  open: boolean;
  onClose: () => void;
}

const Profile = ({ open, onClose }: ProfileProps) => {
  const [xp] = useLocalStorage<number>("sh_xp", 0);
  const { isUnlocked, unlockedCount, total: achTotal } = useAchievements();
  const [hourlyRate, setHourlyRate] = useLocalStorage<number>("sh_hourly_rate", 50);
  const [language, setLanguage] = useLocalStorage<string>("sh_language", "EN");
  const [email, setEmail] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<string>("");
  const [confirmErase, setConfirmErase] = useState(false);
  const [pendingRestore, setPendingRestore] = useState<Record<string, unknown> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? "");
      setCreatedAt(data.user?.created_at ?? "");
    });
  }, [open]);

  const { current: rank, next } = rankInfo(xp);
  const rangeStart = rank.min;
  const rangeEnd = next ? next.min : rank.min;
  const progressPct = next ? Math.min(100, Math.max(0, ((xp - rangeStart) / (rangeEnd - rangeStart)) * 100)) : 100;
  const progressLabel = next
    ? `${xp} XP → ${next.min} XP to reach ${next.name}`
    : `${xp} XP — top rank reached`;

  const backup = () => {
    const data: Record<string, unknown> = {};
    BACKUP_KEYS.forEach((k) => {
      const v = localStorage.getItem(k);
      if (v !== null) {
        try { data[k] = JSON.parse(v); } catch { data[k] = v; }
      }
    });
    const payload = { version: 1, exportedAt: new Date().toISOString(), data };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sohomate-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (parsed.version !== 1 || !parsed.data || typeof parsed.data !== "object") {
          toast("Invalid backup file");
          return;
        }
        setPendingRestore(parsed.data);
      } catch {
        toast("Invalid backup file");
      }
    };
    reader.readAsText(file);
  };

  const confirmRestore = () => {
    if (!pendingRestore) return;
    Object.entries(pendingRestore).forEach(([k, v]) => {
      localStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v));
    });
    window.location.reload();
  };

  const exportCSV = () => {
    const raw = localStorage.getItem("sh_shifts");
    const shifts: Array<Record<string, unknown>> = raw ? JSON.parse(raw) : [];
    const headers = [
      "Date", "Day", "Area", "Type", "Hours", "Base Pay",
      "Tips", "Total", "Covers", "Confidence", "Notes",
    ];
    const rows = shifts.map((s: any) => [
      s.date, s.dayOfWeek, (s.areas && s.areas.length ? s.areas.join("|") : (s.area || "")), s.type, s.hoursWorked,
      s.basePay, s.tips, s.total, s.covers, s.confidence,
      `"${(s.notes || "").replace(/"/g, '""')}"`,
    ].join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sohomate-shifts-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const eraseAll = () => {
    ALL_KEYS.forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const memberSince = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
    : "";

  return (
    <div
      className={`fixed inset-0 z-50 bg-sh-bg overflow-y-auto transition-transform duration-300 ${
        open ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
      aria-hidden={!open}
    >
      <div className="px-5 pt-4 pb-10 max-w-md mx-auto flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-sans font-black text-[28px] text-sh-text tracking-tight">Profile</h1>
          <button onClick={onClose} className="text-sh-muted text-[16px] min-w-[44px] min-h-[44px]" aria-label="Close">
            ✕
          </button>
        </div>

        {/* Me */}
        <div className="bg-sh-surface border border-sh-border rounded-2xl p-4" style={{ boxShadow: "0 2px 8px rgba(26,26,26,0.05)" }}>
          <div className="font-sans font-black text-[26px] text-sh-text leading-tight tracking-tight">Elie S.</div>
          {email && <div className="mt-1 text-[12px] text-sh-muted">{email}</div>}
          {memberSince && <div className="mt-1 text-[11px] text-sh-muted">Member since {memberSince}</div>}
        </div>

        {/* Rank */}
        <div>
          <div className="text-[10px] uppercase tracking-widest text-sh-muted mb-2">My rank</div>
          <div className="bg-sh-surface border border-sh-border rounded-2xl p-4" style={{ boxShadow: "0 2px 8px rgba(26,26,26,0.05)" }}>
            <div className="font-sans font-black text-[22px] text-sh-text leading-tight tracking-tight">{rank.name}</div>
            <div className="mt-3 h-1.5 w-full bg-sh-border rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${progressPct}%`, background: "linear-gradient(90deg, #C4A882, #D94F2E)" }} />
            </div>
            <div className="mt-2 text-[11px] text-sh-muted">{progressLabel}</div>
          </div>
        </div>

        {/* Settings */}
        <div className="flex flex-col gap-3">
          <div className="text-[10px] uppercase tracking-widest text-sh-muted">Settings</div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest text-sh-muted">Base pay per hour</label>
            <div className="flex items-center bg-sh-surface border border-sh-border rounded-xl">
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value) || 0)}
                className="flex-1 bg-transparent px-3 py-2 text-[14px] text-sh-text outline-none rounded-xl min-h-[44px]"
              />
              <span className="px-3 text-[12px] text-sh-muted">NIS</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest text-sh-muted">Language</label>
            <div className="flex gap-2">
              {(["EN", "FR", "HE"] as const).map((l) => {
                const active = language === l;
                return (
                  <button
                    key={l}
                    onClick={() => setLanguage(l)}
                    className={`px-4 min-h-[44px] text-[10px] uppercase rounded-xl border ${
                      active
                        ? "bg-sh-text text-sh-bg border-sh-text"
                        : "bg-transparent text-sh-muted border-sh-border"
                    }`}
                  >
                    {l}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-widest text-sh-muted">Achievements</div>
            <div className="text-[11px] text-sh-muted">{unlockedCount} / {achTotal}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {ALL_ACHIEVEMENTS.map((ach) => {
              const unlocked = isUnlocked(ach.id);
              return (
                <div
                  key={ach.id}
                  className={`bg-sh-surface border rounded-xl p-3 flex flex-col gap-1 transition-opacity ${
                    unlocked ? "border-sh-text opacity-100" : "border-sh-border opacity-40"
                  }`}
                  style={unlocked ? { boxShadow: "0 2px 6px rgba(26,26,26,0.06)" } : {}}
                >
                  <div className="text-[20px] leading-none">{ach.emoji}</div>
                  <div className={`text-[12px] font-medium leading-tight ${unlocked ? "text-sh-text" : "text-sh-muted"}`}>
                    {ach.name}
                  </div>
                  <div className="text-[10px] text-sh-muted leading-snug">{ach.description}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Data */}
        <div className="flex flex-col gap-3">
          <div className="text-[10px] uppercase tracking-widest text-sh-muted">Data</div>
          <button onClick={backup} className="w-full py-3 text-[14px] font-semibold bg-sh-cta text-white rounded-xl min-h-[44px] hover:bg-sh-cta-dark transition-colors shadow-sh-sm">
            Backup all data
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="w-full py-3 text-[14px] font-semibold border border-sh-border text-sh-text bg-transparent rounded-xl min-h-[44px] hover:bg-sh-surface transition-colors">
            Restore backup
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={onRestoreFile}
          />
          <button onClick={exportCSV} className="w-full py-3 text-[14px] font-semibold border border-sh-border text-sh-text bg-transparent rounded-xl min-h-[44px] hover:bg-sh-surface transition-colors">
            Export shifts CSV
          </button>
          <button
            onClick={() => setConfirmErase(true)}
            className="w-full py-3 text-[14px] font-semibold border border-sh-error-border text-sh-error bg-sh-error-light rounded-xl min-h-[44px] hover:bg-sh-error hover:text-white transition-colors"
          >
            Erase all data
          </button>

          {pendingRestore && (
            <div className="bg-sh-surface border border-sh-border rounded-2xl p-4 flex flex-col gap-3" style={{ boxShadow: "0 2px 8px rgba(26,26,26,0.05)" }}>
              <p className="text-[12px] text-sh-text">
                This will replace all current data. Tap Restore to confirm.
              </p>
              <div className="flex gap-2">
                <button onClick={confirmRestore} className="flex-1 py-3 text-[14px] font-semibold bg-sh-cta text-white rounded-xl min-h-[44px] hover:bg-sh-cta-dark transition-colors">
                  Restore
                </button>
                <button onClick={() => setPendingRestore(null)} className="flex-1 py-3 text-[14px] font-semibold border border-sh-border text-sh-text bg-transparent rounded-xl min-h-[44px] hover:bg-sh-surface transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Account */}
        <div className="flex flex-col gap-3">
          <div className="text-[10px] uppercase tracking-widest text-sh-muted">Account</div>
          <button onClick={signOut} className="w-full py-3 text-[14px] font-semibold border border-sh-border text-sh-text bg-transparent rounded-xl min-h-[44px] hover:bg-sh-surface transition-colors">
            Sign out
          </button>
        </div>
      </div>

      {confirmErase && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center px-6">
          <div className="bg-sh-bg border border-sh-border rounded-2xl p-5 max-w-sm w-full flex flex-col gap-4" style={{ boxShadow: "0 8px 32px rgba(26,26,26,0.12)" }}>
            <p className="text-[13px] text-sh-text">
              This will delete all your shifts, XP, streaks and mastered cards. This cannot be undone.
            </p>
            <div className="flex flex-col gap-2">
              <button onClick={eraseAll} className="w-full py-3 text-[14px] font-semibold bg-sh-error text-white rounded-xl min-h-[44px] hover:opacity-90 transition-opacity">
                Erase everything
              </button>
              <button onClick={() => setConfirmErase(false)} className="w-full py-3 text-[14px] font-semibold border border-sh-border text-sh-text bg-transparent rounded-xl min-h-[44px] hover:bg-sh-surface transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
