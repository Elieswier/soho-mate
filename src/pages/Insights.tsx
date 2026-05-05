import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Shift, DAYS } from "@/lib/shifts";
import { MENU_ITEMS, CATEGORIES } from "@/data/menuData";

const axisTick = { fontSize: 10, fill: "#6B6560", fontFamily: "DM Sans" };

const BACKUP_KEYS = [
  "sh_shifts", "sh_xp", "sh_streak", "sh_last_study",
  "sh_mastered", "sh_best_score", "sh_onboarded",
];

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

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-sh-surface border border-sh-border rounded-none p-3 text-center">
    <div className="text-[10px] uppercase tracking-widest text-sh-muted">{label}</div>
    <div className="font-serif text-[28px] text-sh-text leading-tight mt-1">{value}</div>
  </div>
);

const ShiftStat = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-sh-surface border border-sh-border rounded-none p-3 text-center flex-1">
    <div className="text-[10px] uppercase tracking-widest text-sh-muted">{label}</div>
    <div className="font-serif text-[28px] text-sh-text leading-tight mt-1">{value}</div>
  </div>
);

const Insights = () => {
  const [tab, setTab] = useState<"progress" | "shifts">("progress");
  const [shifts] = useLocalStorage<Shift[]>("sh_shifts", []);
  const [xp] = useLocalStorage<number>("sh_xp", 0);
  const [streak] = useLocalStorage<number>("sh_streak", 0);
  const [mastered] = useLocalStorage<number[]>("sh_mastered", []);
  const [bestScore] = useLocalStorage<number>("sh_best_score", 0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingRestore, setPendingRestore] = useState<Record<string, unknown> | null>(null);
  const prevCountRef = useRef<number | null>(null);

  useEffect(() => {
    if (prevCountRef.current === null) {
      prevCountRef.current = shifts.length;
      return;
    }
    if (shifts.length > prevCountRef.current && shifts.length % 3 === 0) {
      toast("Don't forget to back up your data", { duration: 3000 });
    }
    prevCountRef.current = shifts.length;
  }, [shifts.length]);

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

  const stats = useMemo(() => {
    if (shifts.length === 0) return null;
    const totalEarned = shifts.reduce((s, x) => s + x.total, 0);
    const totalTips = shifts.reduce((s, x) => s + x.tips, 0);
    const avgTip = Math.round(totalTips / shifts.length);

    const byDay: Record<string, { sum: number; n: number }> = {};
    DAYS.forEach((d) => (byDay[d] = { sum: 0, n: 0 }));
    shifts.forEach((s) => {
      if (!byDay[s.dayOfWeek]) byDay[s.dayOfWeek] = { sum: 0, n: 0 };
      byDay[s.dayOfWeek].sum += s.total;
      byDay[s.dayOfWeek].n += 1;
    });
    const dayData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => ({
      day: d,
      avg: byDay[d].n ? Math.round(byDay[d].sum / byDay[d].n) : 0,
    }));
    const bestDay = [...dayData].sort((a, b) => b.avg - a.avg)[0];

    const areas = ["Indoor", "Pool", "Garden"] as const;
    const byArea: Record<string, { tips: number; n: number }> = {};
    areas.forEach((a) => (byArea[a] = { tips: 0, n: 0 }));
    shifts.forEach((s) => {
      const list = s.areas && s.areas.length ? s.areas : (s.area ? [s.area] : []);
      list.forEach((a) => {
        if (!byArea[a]) return;
        byArea[a].tips += s.tips;
        byArea[a].n += 1;
      });
    });
    const areaData = areas.map((a) => ({
      area: a,
      avg: byArea[a].n ? Math.round(byArea[a].tips / byArea[a].n) : 0,
    }));
    const bestArea = [...areaData].sort((a, b) => b.avg - a.avg)[0];

    const last10 = [...shifts]
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-10)
      .map((s) => {
        const [, m, d] = s.date.split("-");
        return { label: `${d}/${m}`, confidence: s.confidence };
      });

    return { totalEarned, avgTip, count: shifts.length, dayData, areaData, bestDay, bestArea, last10 };
  }, [shifts]);

  const exportCSV = () => {
    const headers = [
      "Date", "Day", "Area", "Type", "Hours", "Base Pay",
      "Tips", "Total", "Covers", "Confidence", "Notes",
    ];
    const rows = shifts.map((s) => [
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

  // Progress tab derived
  const { current: rank, next } = rankInfo(xp);
  const rangeStart = rank.min;
  const rangeEnd = next ? next.min : rank.min;
  const progressPct = next ? Math.min(100, Math.max(0, ((xp - rangeStart) / (rangeEnd - rangeStart)) * 100)) : 100;
  const progressLabel = next
    ? `${xp} XP → ${next.min} XP to reach ${next.name}`
    : `${xp} XP — top rank reached`;

  const studySessions = Math.max(0, Math.floor(xp / 15));

  const weakest = useMemo(() => {
    if (!mastered || mastered.length === 0) return null;
    const cats = CATEGORIES.filter((c) => c.key !== "all");
    let worst: { label: string; pct: number } | null = null;
    cats.forEach((c) => {
      const items = MENU_ITEMS.filter((m) => m.category === c.key);
      if (items.length === 0) return;
      const masteredCount = items.filter((m) => mastered.includes(m.id)).length;
      const pct = masteredCount / items.length;
      if (worst === null || pct < worst.pct) worst = { label: c.label, pct };
    });
    return worst;
  }, [mastered]);

  return (
    <div className="px-5 pt-4 pb-8 max-w-md mx-auto flex flex-col gap-5">
      {/* Tabs */}
      <div className="flex">
        {([
          ["progress", "My Progress"],
          ["shifts", "My Shifts"],
        ] as const).map(([key, label]) => {
          const active = tab === key;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-2 text-[13px] rounded-none bg-transparent ${
                active
                  ? "text-sh-text border-b border-sh-text"
                  : "text-sh-muted border-b border-transparent"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {tab === "progress" && (
        <>
          {/* Rank card */}
          <div className="bg-sh-surface border border-sh-border rounded-none p-4">
            <div className="font-serif text-[32px] text-sh-text leading-tight">{rank.name}</div>
            <div className="mt-3 h-1 w-full bg-sh-border rounded-none">
              <div className="h-full bg-sh-text" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="mt-2 text-[11px] text-sh-muted">{progressLabel}</div>
          </div>

          {/* 2x2 stat grid */}
          <div className="grid grid-cols-2 gap-2">
            <StatCard label="Daily streak" value={`🔥 ${streak} days`} />
            <StatCard label="Best quiz score" value={`${bestScore} / 15`} />
            <StatCard label="Cards mastered" value={`${(mastered || []).length} / 57`} />
            <StatCard label="Study sessions" value={`${studySessions}`} />
          </div>

          {/* Weakest category */}
          <div className="bg-sh-surface border border-sh-border rounded-none p-4">
            <div className="text-[10px] uppercase tracking-widest text-sh-muted">Focus tonight:</div>
            {weakest ? (
              <div className="font-serif text-[20px] text-sh-text mt-1">{weakest.label}</div>
            ) : (
              <div className="font-serif text-[18px] text-sh-muted mt-1">
                Complete a quiz to see insights
              </div>
            )}
          </div>
        </>
      )}

      {tab === "shifts" && (
        <>
          {!stats ? (
            <div className="flex items-center justify-center min-h-[40vh] px-6">
              <h2 className="font-serif text-[24px] text-sh-muted text-center">
                Log your first shift to see insights.
              </h2>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <ShiftStat label="Total earned" value={`${stats.totalEarned} NIS`} />
                <ShiftStat label="Avg tip" value={`${stats.avgTip}`} />
                <ShiftStat label="Shifts" value={`${stats.count}`} />
              </div>

              <div className="bg-sh-surface border border-sh-border rounded-none p-4">
                <div className="text-[10px] uppercase tracking-widest text-sh-muted">Best day</div>
                <div className="font-serif text-[20px] text-sh-text mt-1">
                  {stats.bestDay.day} — {stats.bestDay.avg} NIS avg
                </div>
              </div>

              <div className="bg-sh-surface border border-sh-border rounded-none p-4">
                <div className="text-[10px] uppercase tracking-widest text-sh-muted">Best area</div>
                <div className="font-serif text-[20px] text-sh-text mt-1">
                  {stats.bestArea.area} — {stats.bestArea.avg} NIS avg tips
                </div>
              </div>

              <div className="bg-sh-surface border border-sh-border rounded-none p-4">
                <div className="text-[10px] uppercase tracking-widest text-sh-muted mb-3">Earnings by day</div>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.dayData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                      <XAxis dataKey="day" tick={axisTick} axisLine={{ stroke: "#D6CEC3" }} tickLine={false} />
                      <YAxis tick={axisTick} axisLine={{ stroke: "#D6CEC3" }} tickLine={false} width={32} />
                      <Tooltip cursor={{ fill: "#D6CEC3" }} contentStyle={{ background: "#FAF8F5", border: "1px solid #D6CEC3", borderRadius: 0, fontSize: 12 }} />
                      <Bar dataKey="avg" fill="#1A1A1A" background={{ fill: "#D6CEC3" }} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-sh-surface border border-sh-border rounded-none p-4">
                <div className="text-[10px] uppercase tracking-widest text-sh-muted mb-3">Earnings by area</div>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.areaData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                      <XAxis dataKey="area" tick={axisTick} axisLine={{ stroke: "#D6CEC3" }} tickLine={false} />
                      <YAxis tick={axisTick} axisLine={{ stroke: "#D6CEC3" }} tickLine={false} width={32} />
                      <Tooltip cursor={{ fill: "#D6CEC3" }} contentStyle={{ background: "#FAF8F5", border: "1px solid #D6CEC3", borderRadius: 0, fontSize: 12 }} />
                      <Bar dataKey="avg" fill="#1A1A1A" background={{ fill: "#D6CEC3" }} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-sh-surface border border-sh-border rounded-none p-4">
                <div className="text-[10px] uppercase tracking-widest text-sh-muted mb-3">Confidence trend</div>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.last10} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                      <XAxis dataKey="label" tick={axisTick} axisLine={{ stroke: "#D6CEC3" }} tickLine={false} />
                      <YAxis domain={[1, 10]} tick={axisTick} axisLine={{ stroke: "#D6CEC3" }} tickLine={false} width={28} />
                      <Tooltip contentStyle={{ background: "#FAF8F5", border: "1px solid #D6CEC3", borderRadius: 0, fontSize: 12 }} />
                      <Line type="monotone" dataKey="confidence" stroke="#1A1A1A" strokeWidth={1.5} dot={{ fill: "#1A1A1A", r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <button
                onClick={exportCSV}
                className="w-full py-3 text-[14px] border border-sh-text text-sh-text bg-transparent rounded-none"
              >
                Export CSV
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Insights;
