import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, CheckCircle2, ChevronLeft, ChevronRight, BookOpen, HelpCircle, FileText, CheckSquare } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { TRAINING_PLAN, type DayProgress, type TrainingDayData } from "@/data/trainingPlan";

// ─── helpers ────────────────────────────────────────────────────────────────

const emptyProgress = (checklistLength: number): DayProgress => ({
  flashcards: false,
  quiz: false,
  script: false,
  checklist: new Array(checklistLength).fill(false),
});

const countDone = (p: DayProgress | undefined, checklistLength: number): number => {
  if (!p) return 0;
  return (
    (p.flashcards ? 1 : 0) +
    (p.quiz ? 1 : 0) +
    (p.script ? 1 : 0) +
    (p.checklist || []).filter(Boolean).length
  );
};

const totalActivities = (d: TrainingDayData) => 3 + d.checklist.length;

const isDayComplete = (p: DayProgress | undefined, d: TrainingDayData) =>
  !!p &&
  p.flashcards &&
  p.quiz &&
  p.script &&
  (p.checklist || []).filter(Boolean).length === d.checklist.length;

const isDayUnlocked = (
  dayIndex: number,
  allProgress: Record<string, DayProgress>
) => {
  if (dayIndex === 0) return true;
  const prevDay = TRAINING_PLAN[dayIndex - 1];
  return isDayComplete(allProgress[String(prevDay.day)], prevDay);
};

// ─── Day List ────────────────────────────────────────────────────────────────

type DayListProps = {
  allProgress: Record<string, DayProgress>;
  onSelect: (day: number) => void;
};

const DayList = ({ allProgress, onSelect }: DayListProps) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="mb-1">
        <div className="font-serif text-[28px] text-sh-text leading-tight">The Runway</div>
        <div className="text-[12px] text-sh-muted mt-1">
          7 days. Complete each to unlock the next.
        </div>
      </div>

      {TRAINING_PLAN.map((day, idx) => {
        const p = allProgress[String(day.day)];
        const unlocked = isDayUnlocked(idx, allProgress);
        const complete = isDayComplete(p, day);
        const done = countDone(p, day.checklist.length);
        const total = totalActivities(day);

        return (
          <button
            key={day.day}
            disabled={!unlocked}
            onClick={() => onSelect(day.day)}
            className={`w-full text-left bg-sh-surface border border-sh-border rounded-none p-4 flex items-start gap-3 transition-opacity ${
              !unlocked ? "opacity-40 cursor-default" : ""
            }`}
          >
            {/* day number */}
            <div className="flex-shrink-0 w-8 text-[10px] uppercase tracking-widest text-sh-muted pt-1">
              {String(day.day).padStart(2, "0")}
            </div>

            {/* content */}
            <div className="flex-1 min-w-0">
              <div className="font-serif text-[20px] text-sh-text leading-tight">{day.title}</div>
              <div className="text-[11px] text-sh-muted mt-0.5 leading-snug">{day.theme}</div>

              {/* progress bar — only show if unlocked and not complete */}
              {unlocked && !complete && done > 0 && (
                <div className="mt-2 h-0.5 w-full bg-sh-border rounded-none">
                  <div
                    className="h-full bg-sh-text transition-all"
                    style={{ width: `${Math.round((done / total) * 100)}%` }}
                  />
                </div>
              )}
              {unlocked && !complete && done === 0 && (
                <div className="mt-2 h-0.5 w-full bg-sh-border rounded-none" />
              )}
            </div>

            {/* status icon */}
            <div className="flex-shrink-0 pt-1">
              {!unlocked ? (
                <Lock size={16} className="text-sh-muted" strokeWidth={1.5} />
              ) : complete ? (
                <CheckCircle2 size={18} className="text-sh-text" strokeWidth={1.5} />
              ) : (
                <ChevronRight size={18} className="text-sh-muted" strokeWidth={1.5} />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

// ─── Activity Row ────────────────────────────────────────────────────────────

type ActivityRowProps = {
  icon: React.ReactNode;
  label: string;
  description: string;
  done: boolean;
  onToggle: () => void;
  cta?: React.ReactNode;
};

const ActivityRow = ({ icon, label, description, done, onToggle, cta }: ActivityRowProps) => (
  <div className={`bg-sh-surface border border-sh-border rounded-none p-4 flex flex-col gap-3 transition-opacity ${done ? "opacity-60" : ""}`}>
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="flex-shrink-0 mt-0.5 text-sh-muted">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-medium text-sh-text leading-tight">{label}</div>
          <div className="text-[11px] text-sh-muted mt-0.5 leading-snug">{description}</div>
        </div>
      </div>
      <button
        onClick={onToggle}
        className="flex-shrink-0 mt-0.5"
        aria-label={done ? "Mark undone" : "Mark done"}
      >
        {done ? (
          <CheckCircle2 size={20} className="text-sh-text" strokeWidth={1.5} />
        ) : (
          <div className="w-5 h-5 rounded-full border border-sh-border" />
        )}
      </button>
    </div>
    {cta && <div>{cta}</div>}
  </div>
);

// ─── Day Detail ───────────────────────────────────────────────────────────────

type DayDetailProps = {
  dayData: TrainingDayData;
  progress: DayProgress;
  onBack: () => void;
  onProgressChange: (p: DayProgress) => void;
};

const DayDetail = ({ dayData, progress, onBack, onProgressChange }: DayDetailProps) => {
  const navigate = useNavigate();
  const [scriptExpanded, setScriptExpanded] = useState(false);

  const toggle = (field: "flashcards" | "quiz" | "script") => {
    onProgressChange({ ...progress, [field]: !progress[field] });
  };

  const toggleChecklist = (i: number) => {
    const next = [...(progress.checklist || new Array(dayData.checklist.length).fill(false))];
    next[i] = !next[i];
    onProgressChange({ ...progress, checklist: next });
  };

  const done = countDone(progress, dayData.checklist.length);
  const total = totalActivities(dayData);

  const flashcardLink = `/?mode=${dayData.flashcard.mode}&from=training&day=${dayData.day}`;
  const quizLink = `/quiz?cat=${dayData.quiz.mode}&from=training&day=${dayData.day}`;

  return (
    <div className="flex flex-col gap-4">
      {/* header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-sh-muted" aria-label="Back">
          <ChevronLeft size={22} strokeWidth={1.5} />
        </button>
        <div className="text-[10px] uppercase tracking-widest text-sh-muted">
          Day {dayData.day} of 7
        </div>
      </div>

      <div>
        <div className="font-serif text-[30px] text-sh-text leading-tight">{dayData.title}</div>
        <div className="text-[12px] text-sh-muted mt-1">{dayData.theme}</div>
      </div>

      {/* overall progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-0.5 bg-sh-border">
          <div
            className="h-full bg-sh-text transition-all"
            style={{ width: `${Math.round((done / total) * 100)}%` }}
          />
        </div>
        <div className="text-[10px] text-sh-muted whitespace-nowrap">{done} / {total}</div>
      </div>

      {/* 1. Flashcards */}
      <ActivityRow
        icon={<BookOpen size={16} strokeWidth={1.5} />}
        label={dayData.flashcard.label}
        description={dayData.flashcard.description}
        done={progress.flashcards}
        onToggle={() => toggle("flashcards")}
        cta={
          <button
            onClick={() => navigate(flashcardLink)}
            className="text-[11px] text-sh-text underline underline-offset-2"
          >
            Open Flashcards →
          </button>
        }
      />

      {/* 2. Quiz */}
      <ActivityRow
        icon={<HelpCircle size={16} strokeWidth={1.5} />}
        label={dayData.quiz.label}
        description={dayData.quiz.description}
        done={progress.quiz}
        onToggle={() => toggle("quiz")}
        cta={
          <button
            onClick={() => navigate(quizLink)}
            className="text-[11px] text-sh-text underline underline-offset-2"
          >
            Open Quiz →
          </button>
        }
      />

      {/* 3. Script */}
      <div className={`bg-sh-surface border border-sh-border rounded-none p-4 flex flex-col gap-3 transition-opacity ${progress.script ? "opacity-60" : ""}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 mt-0.5 text-sh-muted">
              <FileText size={16} strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium text-sh-text leading-tight">Script to memorize</div>
              <div className="text-[11px] text-sh-muted mt-0.5">{dayData.script.title}</div>
            </div>
          </div>
          <button
            onClick={() => toggle("script")}
            className="flex-shrink-0 mt-0.5"
          >
            {progress.script ? (
              <CheckCircle2 size={20} className="text-sh-text" strokeWidth={1.5} />
            ) : (
              <div className="w-5 h-5 rounded-full border border-sh-border" />
            )}
          </button>
        </div>

        <button
          onClick={() => setScriptExpanded((v) => !v)}
          className="text-[11px] text-sh-text underline underline-offset-2 text-left"
        >
          {scriptExpanded ? "Hide script ↑" : "Show script ↓"}
        </button>

        {scriptExpanded && (
          <p
            className="font-serif text-[18px] italic text-sh-text whitespace-pre-line leading-relaxed border-l-2 border-sh-text pl-3"
          >
            {dayData.script.text}
          </p>
        )}
      </div>

      {/* 4. Checklist */}
      <div className="bg-sh-surface border border-sh-border rounded-none p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <CheckSquare size={16} strokeWidth={1.5} className="text-sh-muted flex-shrink-0" />
          <div className="text-[13px] font-medium text-sh-text">Today's checklist</div>
        </div>
        <div className="flex flex-col gap-2">
          {dayData.checklist.map((item, i) => {
            const checked = (progress.checklist || [])[i] === true;
            return (
              <button
                key={i}
                onClick={() => toggleChecklist(i)}
                className="flex items-start gap-3 text-left w-full"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {checked ? (
                    <CheckCircle2 size={16} className="text-sh-text" strokeWidth={1.5} />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-sh-border mt-0.5" />
                  )}
                </div>
                <span className={`text-[13px] leading-snug ${checked ? "line-through text-sh-muted" : "text-sh-text"}`}>
                  {item}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* completion banner */}
      {isDayComplete(progress, dayData) && (
        <div className="bg-sh-text text-sh-bg text-center py-3 rounded-none">
          <div className="font-serif text-[20px]">Day {dayData.day} complete</div>
          {dayData.day < 7 && (
            <div className="text-[11px] mt-1 opacity-70">Day {dayData.day + 1} is now unlocked</div>
          )}
          {dayData.day === 7 && (
            <div className="text-[11px] mt-1 opacity-70">You're a Soho Mate.</div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const TrainingPlan = () => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [allProgress, setAllProgress] = useLocalStorage<Record<string, DayProgress>>(
    "sh_training",
    {}
  );

  const getProgress = (day: number): DayProgress => {
    const existing = allProgress[String(day)];
    const dayData = TRAINING_PLAN[day - 1];
    if (existing) return existing;
    return emptyProgress(dayData.checklist.length);
  };

  const setDayProgress = (day: number, p: DayProgress) => {
    setAllProgress((prev) => ({ ...prev, [String(day)]: p }));
  };

  if (selectedDay !== null) {
    const dayData = TRAINING_PLAN[selectedDay - 1];
    return (
      <DayDetail
        dayData={dayData}
        progress={getProgress(selectedDay)}
        onBack={() => setSelectedDay(null)}
        onProgressChange={(p) => setDayProgress(selectedDay, p)}
      />
    );
  }

  return (
    <DayList
      allProgress={allProgress}
      onSelect={setSelectedDay}
    />
  );
};

export default TrainingPlan;
