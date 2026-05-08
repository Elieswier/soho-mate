import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Shift, DAYS, calcHours } from "@/lib/shifts";

const todayISO = () => new Date().toISOString().slice(0, 10);

const Pill = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex-1 py-2.5 text-[13px] font-semibold rounded-xl border transition-all duration-150 ${
      active
        ? "bg-sh-cta text-white border-sh-cta shadow-sh-sm"
        : "bg-sh-bg text-sh-muted border-sh-border hover:border-sh-border-strong"
    }`}
  >
    {children}
  </button>
);

const LogShift = () => {
  const [shifts, setShifts] = useLocalStorage<Shift[]>("sh_shifts", []);
  const [hourlyRate] = useLocalStorage<number>("sh_hourly_rate", 50);

  const [date, setDate] = useState(todayISO());
  const [areas, setAreas] = useState<Shift["areas"]>(["Indoor"]);
  const [types, setTypes] = useState<Shift["types"]>(["Dinner"]);
  const [startTime, setStartTime] = useState("12:00");
  const [endTime, setEndTime] = useState("20:00");
  const [tips, setTips] = useState<string>("");
  const [covers, setCovers] = useState<string>("");
  const [confidence, setConfidence] = useState(7);
  const [notes, setNotes] = useState("");

  const hours = useMemo(() => calcHours(startTime, endTime), [startTime, endTime]);
  const basePay = Math.round(hours * hourlyRate);
  const tipsNum = Number(tips) || 0;
  const total = basePay + tipsNum;

  const toggleArea = (a: "Indoor" | "Pool" | "Garden") => {
    setAreas((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };

  const toggleType = (t: "Lunch" | "Dinner" | "Event") => {
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const submit = () => {
    const d = new Date(date + "T00:00:00");
    const dayOfWeek = DAYS[d.getDay()];
    const shift: Shift = {
      id: Date.now(),
      date,
      dayOfWeek,
      areas,
      type: types[0] ?? "Dinner",
      types,
      startTime,
      endTime,
      hoursWorked: hours,
      basePay,
      tips: tipsNum,
      total,
      covers: Number(covers) || 0,
      confidence,
      notes,
    };
    setShifts([shift, ...shifts]);
    toast(`Shift logged — ${total} NIS today`, { duration: 2000, position: "bottom-center" });
    setTips("");
    setCovers("");
    setNotes("");
  };

  const recent = shifts.slice(0, 3);

  return (
    <div className="w-full px-5 pt-6 pb-28 max-w-md md:max-w-4xl mx-auto md:px-10 flex flex-col gap-5 overflow-x-hidden">
      <h1 className="font-sans font-black text-[44px] md:text-[56px] text-sh-text leading-none tracking-tight">Log Shift</h1>

      {/* Date */}
      <div>
        <label className="block text-[10px] uppercase tracking-[0.12em] font-semibold text-sh-muted mb-2">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2.5 text-[14px] bg-sh-bg border border-sh-border rounded-xl text-sh-text"
        />
      </div>

      {/* Service area */}
      <div>
        <label className="block text-[10px] uppercase tracking-[0.12em] font-semibold text-sh-muted mb-2">Service area</label>
        <div className="flex gap-2">
          {(["Indoor", "Pool", "Garden"] as const).map((a) => (
            <Pill key={a} active={areas.includes(a)} onClick={() => toggleArea(a)}>{a}</Pill>
          ))}
        </div>
      </div>

      {/* Shift type */}
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-sh-muted mb-2">Shift type</label>
        <div className="flex gap-2">
          {(["Lunch", "Dinner", "Event"] as const).map((t) => (
            <Pill key={t} active={types.includes(t)} onClick={() => toggleType(t)}>{t}</Pill>
          ))}
        </div>
      </div>

      {/* Times */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-sh-muted mb-2">Start time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-3 py-2.5 text-[14px] bg-sh-bg border border-sh-border rounded-xl text-sh-text"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-sh-muted mb-2">End time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-3 py-2.5 text-[14px] bg-sh-bg border border-sh-border rounded-xl text-sh-text"
          />
        </div>
      </div>

      {/* Tips */}
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-sh-muted mb-2">My tip payout</label>
        <div className="flex">
          <input
            type="number"
            inputMode="numeric"
            value={tips}
            onChange={(e) => setTips(e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2.5 text-[14px] bg-sh-bg border border-sh-border rounded-l-xl text-sh-text"
          />
          <span className="px-3 py-2.5 text-[12px] bg-sh-surface border border-l-0 border-sh-border text-sh-muted flex items-center rounded-r-xl">NIS</span>
        </div>
      </div>

      {/* Covers */}
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-sh-muted mb-2">Covers served</label>
        <input
          type="number"
          inputMode="numeric"
          value={covers}
          onChange={(e) => setCovers(e.target.value)}
          placeholder="0"
          className="w-full px-3 py-2.5 text-[14px] bg-sh-bg border border-sh-border rounded-xl text-sh-text"
        />
      </div>

      {/* Confidence */}
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-sh-muted mb-2">Confidence</label>
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={confidence}
          onChange={(e) => setConfidence(Number(e.target.value))}
          className="w-full accent-[#D94F2E]"
        />
        <div className="flex justify-between text-[11px] text-sh-muted mt-1">
          <span>Rough</span>
          <span>Nailed it</span>
        </div>
        <div className="text-center font-sans font-black text-[40px] text-sh-cta leading-none mt-1 tracking-tight">{confidence}</div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-sh-muted mb-2">Notes</label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What worked? What to improve?"
          className="w-full px-3 py-2.5 text-[14px] bg-sh-bg border border-sh-border rounded-xl text-sh-text resize-none"
        />
      </div>

      {/* Live calc panel */}
      <div className="bg-sh-surface border border-sh-border rounded-2xl p-4" style={{ boxShadow: "0 2px 8px rgba(26,26,26,0.05)" }}>
        <div className="flex justify-between text-[13px] text-sh-text py-1.5">
          <span className="text-sh-muted">Hours worked</span>
          <span className="font-medium">{hours}h</span>
        </div>
        <div className="flex justify-between text-[13px] text-sh-text py-1.5">
          <span className="text-sh-muted">Base pay</span>
          <span className="font-medium">{basePay} ₪</span>
        </div>
        <div className="flex justify-between text-[13px] text-sh-text py-1.5">
          <span className="text-sh-muted">Tips</span>
          <span className="font-medium">{tipsNum} ₪</span>
        </div>
        <div className="flex justify-between items-baseline pt-3 mt-2 border-t border-sh-border">
          <span className="text-[13px] font-semibold text-sh-text">Total</span>
          <span className="font-sans font-black text-[28px] text-sh-cta tracking-tight leading-none">{total} ₪</span>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={submit}
        className="w-full py-3.5 text-[14px] font-semibold bg-sh-cta text-white rounded-xl hover:bg-sh-cta-dark active:opacity-90 transition-all shadow-sh-md"
      >
        Log shift
      </button>

      {/* Recent */}
      {recent.length > 0 && (
        <div>
          <h3 className="text-[10px] uppercase tracking-widest text-sh-muted border-b border-sh-border pb-2 mb-2">
            Recent shifts
          </h3>
          <div>
            {recent.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between py-2.5 text-[12px] border-b border-sh-border last:border-b-0"
              >
                <span className="text-sh-muted">{s.date} · {(s.areas && s.areas.length ? s.areas.join(" + ") : s.area)} · {s.type}</span>
                <span className="text-sh-text">{s.total} NIS</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LogShift;
