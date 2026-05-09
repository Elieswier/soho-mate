import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Trash2, Pencil, X } from "lucide-react";
import { useShifts } from "@/hooks/useShifts";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Shift, DAYS, calcHours } from "@/lib/shifts";

const todayISO = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const TRAINING_RATE = 45;

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
  const { shifts, addShift, updateShift, deleteShift } = useShifts();
  const [hourlyRate] = useLocalStorage<number>("sh_hourly_rate", 50);
  const [trainingMode, setTrainingMode] = useLocalStorage<boolean>("sh_training_mode", true);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [date, setDate] = useState(todayISO());
  const [areas, setAreas] = useState<Shift["areas"]>(["Indoor"]);
  const [types, setTypes] = useState<Shift["types"]>(["Dinner"]);
  const [startTime, setStartTime] = useState("12:00");
  const [endTime, setEndTime] = useState("20:00");
  const [tips, setTips] = useState<string>("");
  const [covers, setCovers] = useState<string>("");
  const [confidence, setConfidence] = useState(7);
  const [notes, setNotes] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const effectiveRate = trainingMode ? TRAINING_RATE : hourlyRate;
  const hours = useMemo(() => calcHours(startTime, endTime), [startTime, endTime]);
  const basePay = Math.round(hours * effectiveRate);
  const tipsNum = Number(tips) || 0;
  const total = basePay + tipsNum;

  const toggleArea = (a: "Indoor" | "Pool" | "Garden") => {
    setAreas((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };

  const toggleType = (t: "Lunch" | "Dinner" | "Event") => {
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const resetForm = () => {
    setDate(todayISO());
    setAreas(["Indoor"]);
    setTypes(["Dinner"]);
    setStartTime("12:00");
    setEndTime("20:00");
    setTips("");
    setCovers("");
    setConfidence(7);
    setNotes("");
    setEditingId(null);
  };

  const loadShiftForEdit = (s: Shift) => {
    setEditingId(s.id);
    setDate(s.date);
    setAreas(s.areas ?? ["Indoor"]);
    setTypes(s.types ?? ["Dinner"]);
    setStartTime(s.startTime);
    setEndTime(s.endTime);
    setTips(s.tips > 0 ? String(s.tips) : "");
    setCovers(s.covers > 0 ? String(s.covers) : "");
    setConfidence(s.confidence);
    setNotes(s.notes ?? "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = () => {
    const d = new Date(date + "T00:00:00");
    const dayOfWeek = DAYS[d.getDay()];

    if (editingId !== null) {
      updateShift(editingId, {
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
      });
      toast("Shift updated ✓", { duration: 2000, position: "bottom-center" });
    } else {
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
      addShift(shift);
      toast(`Shift logged — ${total} ₪ today`, { duration: 2000, position: "bottom-center" });
    }
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (confirmDeleteId === id) {
      deleteShift(id);
      setConfirmDeleteId(null);
      if (editingId === id) resetForm();
      toast("Shift deleted", { duration: 1500, position: "bottom-center" });
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(null), 3000);
    }
  };

  const recent = shifts.slice(0, 5);

  return (
    <div className="w-full px-5 pt-6 pb-28 max-w-md md:max-w-4xl mx-auto md:px-10 flex flex-col gap-5 overflow-x-hidden">
      <div className="flex items-center justify-between">
        <h1 className="font-sans font-black text-[44px] md:text-[56px] text-sh-text leading-none tracking-tight">Log Shift</h1>
        {editingId !== null && (
          <button
            onClick={resetForm}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-sh-muted border border-sh-border rounded-xl px-3 py-2 hover:bg-sh-surface transition-colors"
          >
            <X size={12} strokeWidth={2} /> Cancel edit
          </button>
        )}
      </div>

      {/* Training mode toggle */}
      <div className="flex items-center justify-between bg-sh-surface border border-sh-border rounded-xl px-4 py-3" style={{ boxShadow: "0 1px 4px rgba(26,26,26,0.04)" }}>
        <div>
          <div className="text-[12px] font-semibold text-sh-text">
            {trainingMode ? "Training mode" : "Regular mode"}
          </div>
          <div className="text-[10px] text-sh-muted mt-0.5">
            {trainingMode ? `${TRAINING_RATE} NIS/h · no tips` : `${hourlyRate} NIS/h + tips`}
          </div>
        </div>
        <button
          onClick={() => setTrainingMode(!trainingMode)}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
            trainingMode ? "bg-sh-cta" : "bg-sh-border"
          }`}
          aria-label="Toggle training mode"
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
              trainingMode ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Edit mode banner */}
      {editingId !== null && (
        <div className="bg-sh-cta-light border border-sh-cta rounded-xl px-4 py-2.5 text-[12px] text-sh-cta font-semibold">
          Editing shift — modify and tap Update Shift to save
        </div>
      )}

      {/* Date */}
      <div>
        <label className="block text-[10px] uppercase tracking-[0.12em] font-semibold text-sh-muted mb-2">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full min-w-0 px-3 py-2.5 text-[14px] bg-sh-bg border border-sh-border rounded-xl text-sh-text"
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
      <div className="grid grid-cols-2 gap-3 min-w-0">
        <div className="min-w-0">
          <label className="block text-[10px] uppercase tracking-widest text-sh-muted mb-2">Start time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full min-w-0 px-3 py-2.5 text-[14px] bg-sh-bg border border-sh-border rounded-xl text-sh-text"
          />
        </div>
        <div className="min-w-0">
          <label className="block text-[10px] uppercase tracking-widest text-sh-muted mb-2">End time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full min-w-0 px-3 py-2.5 text-[14px] bg-sh-bg border border-sh-border rounded-xl text-sh-text"
          />
        </div>
      </div>

      {/* Tips — hide in training mode */}
      {!trainingMode && (
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
      )}

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
          <span className="text-sh-muted">Rate</span>
          <span className="font-medium">{effectiveRate} ₪/h{trainingMode ? " (training)" : ""}</span>
        </div>
        <div className="flex justify-between text-[13px] text-sh-text py-1.5">
          <span className="text-sh-muted">Base pay</span>
          <span className="font-medium">{basePay} ₪</span>
        </div>
        {!trainingMode && (
          <div className="flex justify-between text-[13px] text-sh-text py-1.5">
            <span className="text-sh-muted">Tips</span>
            <span className="font-medium">{tipsNum} ₪</span>
          </div>
        )}
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
        {editingId !== null ? "Update shift" : "Log shift"}
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
                className={`flex items-center justify-between py-2.5 text-[12px] border-b border-sh-border last:border-b-0 gap-2 ${
                  editingId === s.id ? "bg-sh-cta-light -mx-2 px-2 rounded-xl" : ""
                }`}
              >
                <span className="text-sh-muted flex-1 min-w-0 truncate">
                  {s.date} · {(s.areas && s.areas.length ? s.areas.join(" + ") : s.area)} · {s.type}
                </span>
                <span className="text-sh-text font-medium shrink-0">{s.total} ₪</span>
                <button
                  onClick={() => loadShiftForEdit(s)}
                  className={`shrink-0 p-1 rounded-lg transition-colors ${
                    editingId === s.id
                      ? "text-sh-cta"
                      : "text-sh-muted hover:text-sh-text"
                  }`}
                  aria-label="Edit shift"
                >
                  <Pencil size={13} strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className={`shrink-0 p-1 rounded-lg transition-colors ${
                    confirmDeleteId === s.id
                      ? "text-white bg-sh-error"
                      : "text-sh-muted hover:text-sh-error"
                  }`}
                  aria-label="Delete shift"
                >
                  <Trash2 size={13} strokeWidth={1.5} />
                </button>
              </div>
            ))}
          </div>
          {confirmDeleteId !== null && (
            <p className="text-[10px] text-sh-muted mt-1">Tap again to confirm delete</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LogShift;
