import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Shift } from "@/lib/shifts";

const LOCAL_KEY = "sh_shifts";

// ─── row ↔ Shift converters ──────────────────────────────────────────────────

const toRow = (s: Shift, userId: string) => ({
  id: s.id,
  user_id: userId,
  date: s.date,
  day_of_week: s.dayOfWeek,
  areas: s.areas ?? [],
  type: s.type,
  types: s.types ?? [s.type],
  start_time: s.startTime,
  end_time: s.endTime,
  hours_worked: s.hoursWorked,
  base_pay: s.basePay,
  tips: s.tips,
  total: s.total,
  covers: s.covers,
  confidence: s.confidence,
  notes: s.notes ?? "",
});

const fromRow = (row: Record<string, unknown>): Shift => ({
  id: row.id as number,
  date: row.date as string,
  dayOfWeek: row.day_of_week as string,
  areas: (row.areas as Shift["areas"]) ?? [],
  area: ((row.areas as string[]) ?? [])[0] as Shift["area"],
  type: row.type as Shift["type"],
  types: (row.types as Shift["types"]) ?? [row.type as Shift["type"]],
  startTime: row.start_time as string,
  endTime: row.end_time as string,
  hoursWorked: row.hours_worked as number,
  basePay: row.base_pay as number,
  tips: row.tips as number,
  total: row.total as number,
  covers: row.covers as number,
  confidence: row.confidence as number,
  notes: (row.notes as string) ?? "",
});

const readLocal = (): Shift[] => {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeLocal = (shifts: Shift[]) => {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(shifts));
};

// ─── hook ────────────────────────────────────────────────────────────────────

export const useShifts = () => {
  const [shifts, setShiftsState] = useState<Shift[]>(readLocal);
  const [synced, setSynced] = useState(false);

  // keep localStorage in sync with state
  useEffect(() => {
    writeLocal(shifts);
  }, [shifts]);

  // sync from Supabase on mount
  useEffect(() => {
    const sync = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("shifts")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) {
        console.warn("Supabase shifts fetch failed:", error.message);
        return;
      }

      const remote = (data ?? []).map(fromRow);

      // first-time migration: push local shifts that aren't in remote
      const local = readLocal();
      if (remote.length === 0 && local.length > 0) {
        const rows = local.map((s) => toRow(s, user.id));
        await supabase.from("shifts").upsert(rows);
        setShiftsState(local);
      } else {
        setShiftsState(remote);
      }

      setSynced(true);
    };

    sync();
  }, []);

  const addShift = useCallback(async (shift: Shift) => {
    // optimistic update
    setShiftsState((prev) => [shift, ...prev]);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("shifts")
      .upsert(toRow(shift, user.id));

    if (error) console.warn("Failed to save shift to Supabase:", error.message);
  }, []);

  const deleteShift = useCallback(async (id: number) => {
    setShiftsState((prev) => prev.filter((s) => s.id !== id));

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("shifts")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) console.warn("Failed to delete shift from Supabase:", error.message);
  }, []);

  return { shifts, addShift, deleteShift, synced };
};
