import { useEffect, useMemo, useRef, useState } from "react";
// note: useEffect/useRef used for shift backup toast; useMemo for stats
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
import TrainingPlan from "@/components/TrainingPlan";

const axisTick = { fontSize: 10, fill: "#6B6560", fontFamily: "Inter" };

const ShiftStat = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-sh-surface border border-sh-border rounded-2xl p-3 text-center flex-1" style={{ boxShadow: "0 2px 8px rgba(26,26,26,0.05)" }}>
    <div className="text-[10px] uppercase tracking-[0.12em] text-sh-muted font-semibold">{label}</div>
    <div className="font-sans font-black text-[26px] text-sh-text leading-tight mt-1 tracking-tight">{value}</div>
  </div>
);

const Insights = () => {
  const [tab, setTab] = useState<"training" | "shifts">("training");
  const [shifts] = useLocalStorage<Shift[]>("sh_shifts", []);

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

  return (
    <div className="px-5 pt-6 pb-28 max-w-md md:max-w-4xl mx-auto md:px-10 flex flex-col gap-5">
      {/* Header */}
      <h1 className="font-sans font-black text-[44px] md:text-[56px] text-sh-text leading-none tracking-tight">Insights</h1>

      {/* Tabs */}
      <div className="flex border-b border-sh-border">
        {([
          ["training", "Training"],
          ["shifts", "My Shifts"],
        ] as const).map(([key, label]) => {
          const active = tab === key;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-2.5 text-[13px] font-semibold bg-transparent transition-colors ${
                active
                  ? "text-sh-cta border-b-2 border-sh-cta -mb-px"
                  : "text-sh-muted border-b-2 border-transparent"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {tab === "training" && <TrainingPlan />}

      {tab === "shifts" && (
        <>
          {!stats ? (
            <div className="flex items-center justify-center min-h-[40vh] px-6">
              <h2 className="font-sans font-black text-[24px] text-sh-muted text-center tracking-tight">
                Log your first shift to see insights.
              </h2>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <ShiftStat label="Total earned" value={`${stats.totalEarned} ₪`} />
                <ShiftStat label="Avg tip" value={`${stats.avgTip} ₪`} />
                <ShiftStat label="Shifts" value={`${stats.count}`} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-sh-surface border border-sh-border rounded-2xl p-4" style={{ boxShadow: "0 2px 8px rgba(26,26,26,0.05)" }}>
                  <div className="text-[9px] uppercase tracking-[0.12em] text-sh-muted font-semibold">Best day</div>
                  <div className="font-sans font-black text-[20px] text-sh-text mt-1.5 tracking-tight leading-tight">
                    {stats.bestDay.day}
                  </div>
                  <div className="text-[11px] text-sh-muted mt-0.5">{stats.bestDay.avg} ₪ avg</div>
                </div>
                <div className="bg-sh-surface border border-sh-border rounded-2xl p-4" style={{ boxShadow: "0 2px 8px rgba(26,26,26,0.05)" }}>
                  <div className="text-[9px] uppercase tracking-[0.12em] text-sh-muted font-semibold">Best area</div>
                  <div className="font-sans font-black text-[20px] text-sh-text mt-1.5 tracking-tight leading-tight">
                    {stats.bestArea.area}
                  </div>
                  <div className="text-[11px] text-sh-muted mt-0.5">{stats.bestArea.avg} ₪ tips avg</div>
                </div>
              </div>

              <div className="bg-sh-surface border border-sh-border rounded-2xl p-4" style={{ boxShadow: "0 2px 8px rgba(26,26,26,0.05)" }}>
                <div className="text-[10px] uppercase tracking-[0.12em] text-sh-muted font-semibold mb-3">Earnings by day</div>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.dayData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                      <XAxis dataKey="day" tick={axisTick} axisLine={{ stroke: "#D6CEC3" }} tickLine={false} />
                      <YAxis tick={axisTick} axisLine={{ stroke: "#D6CEC3" }} tickLine={false} width={32} />
                      <Tooltip cursor={{ fill: "#FEF0EC" }} contentStyle={{ background: "#FAF8F5", border: "1px solid #D6CEC3", borderRadius: 8, fontSize: 12 }} />
                      <Bar dataKey="avg" fill="#D94F2E" radius={[4, 4, 0, 0]} background={{ fill: "#EDE8E0", radius: [4, 4, 0, 0] } as any} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-sh-surface border border-sh-border rounded-2xl p-4" style={{ boxShadow: "0 2px 8px rgba(26,26,26,0.05)" }}>
                <div className="text-[10px] uppercase tracking-[0.12em] text-sh-muted font-semibold mb-3">Earnings by area</div>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.areaData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                      <XAxis dataKey="area" tick={axisTick} axisLine={{ stroke: "#D6CEC3" }} tickLine={false} />
                      <YAxis tick={axisTick} axisLine={{ stroke: "#D6CEC3" }} tickLine={false} width={32} />
                      <Tooltip cursor={{ fill: "#FEF0EC" }} contentStyle={{ background: "#FAF8F5", border: "1px solid #D6CEC3", borderRadius: 8, fontSize: 12 }} />
                      <Bar dataKey="avg" fill="#C4A882" radius={[4, 4, 0, 0]} background={{ fill: "#EDE8E0", radius: [4, 4, 0, 0] } as any} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-sh-surface border border-sh-border rounded-2xl p-4" style={{ boxShadow: "0 2px 8px rgba(26,26,26,0.05)" }}>
                <div className="text-[10px] uppercase tracking-[0.12em] text-sh-muted font-semibold mb-3">Confidence trend</div>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.last10} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                      <XAxis dataKey="label" tick={axisTick} axisLine={{ stroke: "#D6CEC3" }} tickLine={false} />
                      <YAxis domain={[1, 10]} tick={axisTick} axisLine={{ stroke: "#D6CEC3" }} tickLine={false} width={28} />
                      <Tooltip contentStyle={{ background: "#FAF8F5", border: "1px solid #D6CEC3", borderRadius: 8, fontSize: 12 }} />
                      <Line type="monotone" dataKey="confidence" stroke="#D94F2E" strokeWidth={2} dot={{ fill: "#D94F2E", r: 3, strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <button
                onClick={exportCSV}
                className="w-full py-3.5 text-[14px] font-semibold border border-sh-border text-sh-muted bg-transparent rounded-xl hover:bg-sh-surface hover:text-sh-text transition-colors"
              >
                Export CSV ↓
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Insights;
