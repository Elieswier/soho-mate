export type Shift = {
  id: number;
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  area?: "Indoor" | "Pool" | "Garden";
  areas: ("Indoor" | "Pool" | "Garden")[];
  type: "Lunch" | "Dinner" | "Event";
  types: ("Lunch" | "Dinner" | "Event")[];
  startTime: string;
  endTime: string;
  hoursWorked: number;
  basePay: number;
  tips: number;
  total: number;
  covers: number;
  confidence: number;
  notes: string;
};

export const HOURLY_RATE = 50;
export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const calcHours = (start: string, end: string): number => {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let mins = eh * 60 + em - (sh * 60 + sm);
  if (mins <= 0) mins += 24 * 60; // midnight crossover
  return Math.round((mins / 60) * 10) / 10;
};
