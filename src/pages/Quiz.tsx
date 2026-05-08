import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UtensilsCrossed, AlertTriangle, Landmark, Layers, Wine, Zap } from "lucide-react";
import { QUIZ_QUESTIONS, QuizQuestion, QuizCategory } from "@/data/quizData";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useXP } from "@/hooks/useXP";
import { useAchievements } from "@/hooks/useAchievements";
import type { DayProgress } from "@/data/trainingPlan";

// ── Types ──────────────────────────────────────────────────────────────────
type ModeKey = "menu" | "allergens" | "soho-story" | "wine" | "full";

const MODE_META: Record<ModeKey, { name: string; cat: QuizCategory | "all"; icon: React.ReactNode }> = {
  menu:         { name: "The Menu",   cat: "menu",       icon: <UtensilsCrossed size={22} strokeWidth={1.5} /> },
  allergens:    { name: "Allergens",  cat: "allergens",  icon: <AlertTriangle   size={22} strokeWidth={1.5} /> },
  "soho-story": { name: "The House",  cat: "soho-story", icon: <Landmark        size={22} strokeWidth={1.5} /> },
  wine:         { name: "Wine",       cat: "wine",       icon: <Wine            size={22} strokeWidth={1.5} /> },
  full:         { name: "Full House", cat: "all",        icon: <Layers          size={22} strokeWidth={1.5} /> },
};

// ── Rotating result copy ───────────────────────────────────────────────────
type ResultTier = "perfect" | "great" | "solid" | "retry";
const RESULT_COPY: Record<ResultTier, string[]> = {
  perfect: [
    "Perfect. Adam will be impressed.",
    "Zero mistakes. The floor is yours.",
    "Clean sweep. That's the standard.",
    "Full marks. Don't let it go to your head.",
  ],
  great: [
    "Solid run. Review the ones you missed.",
    "Nearly there — a bit more polish.",
    "Good shape. One more pass tonight.",
    "Strong. The grey areas are getting smaller.",
  ],
  solid: [
    "Back to the flashcards — you've got this.",
    "Not bad, but you know what to do.",
    "Decent start. Keep grinding.",
    "Room to grow. That's fine.",
  ],
  retry: [
    "The menu won't memorise itself.",
    "That's what practice runs are for.",
    "Everyone starts somewhere. Go again.",
    "Rough round. Shake it off and retry.",
  ],
};
const pickCopy = (score: number, total: number): string => {
  const pct = total === 0 ? 0 : score / total;
  const tier: ResultTier =
    pct === 1        ? "perfect" :
    pct >= 0.75      ? "great"   :
    pct >= 0.5       ? "solid"   : "retry";
  const pool = RESULT_COPY[tier];
  return pool[Math.floor(Math.random() * pool.length)];
};

// ── Helpers ────────────────────────────────────────────────────────────────
const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const questionsForMode = (m: ModeKey): QuizQuestion[] => {
  const cat = MODE_META[m].cat;
  return cat === "all" ? QUIZ_QUESTIONS : QUIZ_QUESTIONS.filter((q) => q.category === (cat as QuizCategory));
};
const DIFF_LABEL:  Record<1|2|3, string> = { 1: "Easy", 2: "Medium", 3: "Hard" };
const DIFF_COLOUR: Record<1|2|3, string> = { 1: "text-emerald-600", 2: "text-amber-500", 3: "text-red-500" };

// ── Component ──────────────────────────────────────────────────────────────
const Quiz = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const fromTraining = params.get("from") === "training";
  const trainingDay  = Number(params.get("day") ?? "0");

  // ── All state up-front (hooks must be unconditional) ─────────────────────
  const [screen, setScreen]           = useState<"select" | "quiz">("select");
  const [mode, setMode]               = useState<ModeKey>("menu");
  const [sessionKey, setSessionKey]   = useState(0);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isDrillMode, setIsDrillMode]   = useState(false);
  const [customCats, setCustomCats]   = useState<Set<QuizCategory>>(new Set(["menu", "soho-story"] as QuizCategory[]));
  const [allTrainingProgress, setAllTrainingProgress] = useLocalStorage<Record<string, DayProgress>>("sh_training", {});
  const [index, setIndex]             = useState(0);
  const [selected, setSelected]       = useState<number | null>(null);
  const [score, setScore]             = useState(0);
  const [streak, setStreak]           = useState(0);
  const [done, setDone]               = useState(false);
  const [resultCopy, setResultCopy]   = useState("");
  const [bestScore, setBestScore]     = useLocalStorage<number>("sh_best_score", 0);
  const [flash, setFlash]             = useState<{ id: number; text: string; big?: boolean } | null>(null);
  const [hardCorrectThisSession, setHardCorrectThisSession] = useState(0);

  const { addQuizXP, trackMiss, awardDailyBonus, awardPerfectQuiz } = useXP();
  const { checkQuiz } = useAchievements();

  // Shuffled mode/custom questions
  const modeQuestions = useMemo<QuizQuestion[]>(
    () => isCustomMode
      ? shuffle(QUIZ_QUESTIONS.filter((q) => customCats.has(q.category)))
      : shuffle(questionsForMode(mode)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sessionKey, mode, isCustomMode, customCats]
  );

  // Daily Drill: 5 stable questions per day (deterministic for the day)
  const drillQuestions = useMemo<QuizQuestion[]>(() => {
    const day = new Date().toISOString().slice(0, 10);
    const dayNum = day.split("-").reduce((a, b) => a + Number(b), 0);
    return shuffle([...QUIZ_QUESTIONS].sort((a) => (a.id * dayNum) % 7 - 3.5)).slice(0, 5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The active question set
  const questions = isDrillMode ? drillQuestions : modeQuestions;
  const total     = questions.length;
  const q         = questions[index] ?? questions[0];
  const isLast    = index === total - 1;

  // Auto-start from deep-link (?cat=menu)
  useEffect(() => {
    const cat = params.get("cat") as ModeKey | null;
    if (cat && MODE_META[cat]) {
      setMode(cat);
      setIsDrillMode(false);
      setIsCustomMode(false);
      setScreen("quiz");
      setIndex(0); setSelected(null); setScore(0); setStreak(0); setDone(false);
      setSessionKey((k) => k + 1);
      params.delete("cat");
      setParams(params, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const triggerFlash = (text: string, big = false) => {
    const id = Date.now();
    setFlash({ id, text, big });
    setTimeout(() => setFlash((f) => (f && f.id === id ? null : f)), big ? 1800 : 900);
  };

  const choose = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correctIndex) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setScore((s) => s + 1);
      const { amount, levelUp, newRank } = addQuizXP(q.difficulty, q.id);
      if (q.difficulty === 3) setHardCorrectThisSession((n) => n + 1);
      const bonus = awardDailyBonus();
      if (levelUp) {
        triggerFlash(`✦ ${newRank}`, true);
      } else {
        const streakTag = newStreak >= 3 ? ` · ${newStreak}🔥` : "";
        const bonusTag  = bonus ? ` · +${bonus} daily` : "";
        triggerFlash(`+${amount} XP${streakTag}${bonusTag}`);
      }
    } else {
      setStreak(0);
      trackMiss(q.id);
    }
  };

  const finishQuiz = (finalScore: number) => {
    if (finalScore > bestScore) setBestScore(finalScore);
    if (finalScore === total && total > 0) {
      const amount = awardPerfectQuiz();
      triggerFlash(`Perfect! +${amount} XP`, true);
    }
    if (fromTraining && trainingDay > 0 && total > 0 && finalScore / total >= 0.7) {
      setAllTrainingProgress((prev) => {
        const key = String(trainingDay);
        const existing = prev[key] ?? { flashcards: false, quiz: false, script: false, checklist: [] };
        return { ...prev, [key]: { ...existing, quiz: true } };
      });
    }
    // Determine category for achievement checks
    const achCategory = isDrillMode
      ? "drill"
      : isCustomMode
      ? "custom"
      : (mode as "menu" | "allergens" | "soho-story" | "wine" | "full");
    checkQuiz({ category: achCategory, score: finalScore, total, hardCorrect: hardCorrectThisSession });
    setHardCorrectThisSession(0);
    setResultCopy(pickCopy(finalScore, total));
    setDone(true);
  };

  const next = () => {
    if (isLast) { finishQuiz(score); return; }
    setIndex((i) => i + 1);
    setSelected(null);
  };

  const reset = () => {
    setIndex(0); setSelected(null); setScore(0); setStreak(0); setDone(false);
    setSessionKey((k) => k + 1);
  };

  const startMode = (m: ModeKey) => {
    setIsCustomMode(false); setIsDrillMode(false); setMode(m);
    reset(); setScreen("quiz");
  };

  const startDrill = () => {
    setIsCustomMode(false); setIsDrillMode(true);
    reset(); setScreen("quiz");
  };

  const startCustom = () => {
    if (customCats.size === 0) return;
    setIsCustomMode(true); setIsDrillMode(false);
    reset(); setScreen("quiz");
  };

  const toggleCustomCat = (cat: QuizCategory) => {
    setCustomCats((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  const backToSelect = () => {
    setScreen("select"); setIsCustomMode(false); setIsDrillMode(false);
    reset();
  };

  // ── MODE SELECTOR ──────────────────────────────────────────────────────────
  if (screen === "select") {
    const QUIZ_CARD_META: Record<ModeKey, { tag: string; bg: string; textColor: string; border: string }> = {
      menu:         { tag: "Dishes · allergens",         bg: "bg-[#F0EAE0]", textColor: "text-sh-text", border: "border-[#D6CEC3]" },
      allergens:    { tag: "Safe service · 14 allergens", bg: "bg-[#EDE8E0]", textColor: "text-sh-text", border: "border-[#D2CBC0]" },
      "soho-story": { tag: "Culture · Soho TLV",          bg: "bg-[#E8E2D8]", textColor: "text-sh-text", border: "border-[#CCC6BB]" },
      wine:         { tag: "Varietals · pairings",        bg: "bg-[#E4DDD3]", textColor: "text-sh-text", border: "border-[#C8C0B4]" },
      full:         { tag: "All categories",              bg: "bg-sh-text",   textColor: "text-sh-bg",   border: "border-sh-text"   },
    };

    return (
      <div className="px-5 pt-6 pb-28 max-w-md md:max-w-4xl md:px-10 mx-auto overflow-x-hidden">
        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <h1 className="font-sans font-black text-[44px] md:text-[56px] text-sh-text leading-none tracking-tight">Quiz</h1>
          <span className="text-[11px] text-sh-muted mb-1.5">{QUIZ_QUESTIONS.length} questions</span>
        </div>

        {/* Daily Drill — hero card */}
        <button
          onClick={startDrill}
          className="w-full bg-sh-cta text-white rounded-2xl p-5 text-left flex items-center justify-between gap-4 mb-4 hover:bg-sh-cta-dark active:scale-[0.98] transition-all duration-150"
          style={{ minHeight: 96, boxShadow: "0 4px 20px rgba(217,79,46,0.30)" }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Zap size={13} strokeWidth={2} className="opacity-80" />
              <span className="text-[9px] uppercase tracking-[0.14em] opacity-75 font-semibold">Daily Drill</span>
            </div>
            <div className="font-sans font-black text-[22px] leading-tight tracking-tight">5 questions · right now</div>
            <div className="text-[12px] opacity-70 mt-1">Mixed · changes every day</div>
          </div>
          <span className="font-sans font-black text-[32px] opacity-50 flex-shrink-0">→</span>
        </button>

        {/* Bento grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Menu — wide */}
          {(() => {
            const m: ModeKey = "menu";
            const { tag, bg, textColor, border } = QUIZ_CARD_META[m];
            const count = questionsForMode(m).length;
            return (
              <button
                onClick={() => startMode(m)}
                className={`col-span-2 relative overflow-hidden border ${border} ${bg} rounded-2xl p-5 text-left flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]`}
                style={{ height: 148, boxShadow: "0 2px 8px rgba(26,26,26,0.06), 0 0 0 1px rgba(214,206,195,0.3)" }}
              >
                <div className={`text-[9px] uppercase tracking-[0.12em] ${textColor} opacity-40 font-sans`}>{tag}</div>
                <div>
                  <div className={`font-sans font-black text-[28px] ${textColor} leading-tight tracking-tight`}>{MODE_META[m].name}</div>
                  <div className={`text-[11px] font-semibold ${textColor} opacity-50 mt-0.5`}>{count} questions</div>
                </div>
              </button>
            );
          })()}

          {/* Allergens */}
          {(() => {
            const m: ModeKey = "allergens";
            const { tag, bg, textColor, border } = QUIZ_CARD_META[m];
            const count = questionsForMode(m).length;
            return (
              <button
                onClick={() => startMode(m)}
                className={`relative overflow-hidden border ${border} ${bg} rounded-2xl p-4 text-left flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]`}
                style={{ height: 140, boxShadow: "0 2px 8px rgba(26,26,26,0.06), 0 0 0 1px rgba(214,206,195,0.3)" }}
              >
                <div className={`text-[9px] uppercase tracking-[0.12em] ${textColor} opacity-40 font-sans`}>{tag}</div>
                <div>
                  <div className={`font-sans font-black text-[20px] ${textColor} leading-tight tracking-tight`}>{MODE_META[m].name}</div>
                  <div className={`text-[11px] font-semibold ${textColor} opacity-50 mt-0.5`}>{count} questions</div>
                </div>
              </button>
            );
          })()}

          {/* The House */}
          {(() => {
            const m: ModeKey = "soho-story";
            const { tag, bg, textColor, border } = QUIZ_CARD_META[m];
            const count = questionsForMode(m).length;
            return (
              <button
                onClick={() => startMode(m)}
                className={`relative overflow-hidden border ${border} ${bg} rounded-2xl p-4 text-left flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]`}
                style={{ height: 140, boxShadow: "0 2px 8px rgba(26,26,26,0.06), 0 0 0 1px rgba(214,206,195,0.3)" }}
              >
                <div className={`text-[9px] uppercase tracking-[0.12em] ${textColor} opacity-40 font-sans`}>{tag}</div>
                <div>
                  <div className={`font-sans font-black text-[20px] ${textColor} leading-tight tracking-tight`}>{MODE_META[m].name}</div>
                  <div className={`text-[11px] font-semibold ${textColor} opacity-50 mt-0.5`}>{count} questions</div>
                </div>
              </button>
            );
          })()}

          {/* Wine */}
          {(() => {
            const m: ModeKey = "wine";
            const { tag, bg, textColor, border } = QUIZ_CARD_META[m];
            const count = questionsForMode(m).length;
            return (
              <button
                onClick={() => startMode(m)}
                className={`relative overflow-hidden border ${border} ${bg} rounded-2xl p-4 text-left flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]`}
                style={{ height: 128, boxShadow: "0 2px 8px rgba(26,26,26,0.06), 0 0 0 1px rgba(214,206,195,0.3)" }}
              >
                <div className={`text-[9px] uppercase tracking-[0.12em] ${textColor} opacity-40 font-sans`}>{tag}</div>
                <div>
                  <div className={`font-sans font-black text-[20px] ${textColor} leading-tight tracking-tight`}>{MODE_META[m].name}</div>
                  <div className={`text-[11px] font-semibold ${textColor} opacity-50 mt-0.5`}>{count} questions</div>
                </div>
              </button>
            );
          })()}

          {/* Full House — dark contrast card */}
          {(() => {
            const m: ModeKey = "full";
            const { tag, bg, textColor, border } = QUIZ_CARD_META[m];
            const count = questionsForMode(m).length;
            return (
              <button
                onClick={() => startMode(m)}
                className={`relative overflow-hidden border ${border} ${bg} rounded-2xl p-4 text-left flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]`}
                style={{ height: 128, boxShadow: "0 4px 16px rgba(26,26,26,0.18)" }}
              >
                <div className={`text-[9px] uppercase tracking-[0.12em] ${textColor} opacity-40 font-sans`}>{tag}</div>
                <div>
                  <div className={`font-sans font-black text-[20px] ${textColor} leading-tight tracking-tight`}>{MODE_META[m].name}</div>
                  <div className={`text-[11px] font-semibold ${textColor} opacity-50 mt-0.5`}>{count} questions</div>
                </div>
              </button>
            );
          })()}
        </div>

        {/* Custom mix */}
        <div className="mt-6 border-t border-sh-border pt-5">
          <div className="text-[10px] uppercase tracking-[0.12em] text-sh-muted mb-3 font-semibold">Custom mix</div>
          <div className="flex flex-wrap gap-2 mb-4">
            {([
              { cat: "menu"       as QuizCategory, label: "Menu"      },
              { cat: "allergens"  as QuizCategory, label: "Allergens" },
              { cat: "soho-story" as QuizCategory, label: "The House" },
              { cat: "wine"       as QuizCategory, label: "Wine"      },
              { cat: "service"    as QuizCategory, label: "Service"   },
            ]).map(({ cat, label }) => {
              const active = customCats.has(cat);
              const count  = QUIZ_QUESTIONS.filter((q) => q.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => toggleCustomCat(cat)}
                  className={`px-3 py-2 text-[12px] rounded-xl border transition-colors font-semibold ${
                    active
                      ? "bg-sh-text text-sh-bg border-sh-text"
                      : "bg-transparent text-sh-muted border-sh-border"
                  }`}
                >
                  {label} <span className="opacity-60 text-[10px] font-normal">{count}</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-sh-muted">
              {QUIZ_QUESTIONS.filter((q) => customCats.has(q.category)).length} selected
            </span>
            <button
              onClick={startCustom}
              disabled={customCats.size === 0}
              className="px-5 py-2.5 text-[13px] font-semibold bg-sh-cta text-white rounded-xl disabled:opacity-40 hover:bg-sh-cta-dark transition-colors"
            >
              Start custom →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── RESULTS ────────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="px-5 pt-10 pb-28 max-w-md md:max-w-2xl md:px-10 mx-auto flex flex-col items-center text-center">
        <div className="font-sans font-black text-[72px] leading-none text-sh-text tracking-tight">
          {score}<span className="text-sh-muted-2 text-[40px]">/{total}</span>
        </div>
        <p className="mt-4 text-[14px] text-sh-muted leading-relaxed max-w-[280px]">{resultCopy}</p>
        <p className="mt-2 text-[11px] text-sh-muted-2">
          Best: {Math.max(bestScore, score)} / {total}
        </p>
        <button
          onClick={reset}
          className="mt-10 w-full py-3.5 text-[14px] font-semibold bg-sh-cta text-white rounded-xl hover:bg-sh-cta-dark transition-colors shadow-sh-md"
        >
          Retake quiz
        </button>
        {fromTraining ? (
          <button
            onClick={() => navigate("/insights")}
            className="mt-3 w-full py-3.5 text-[14px] font-semibold border border-sh-border text-sh-text bg-transparent rounded-xl hover:bg-sh-surface transition-colors"
          >
            ← Back to training
          </button>
        ) : (
          <button
            onClick={backToSelect}
            className="mt-3 w-full text-[12px] text-sh-muted font-sans min-h-[44px]"
          >
            ← Back to modes
          </button>
        )}
      </div>
    );
  }

  // ── QUIZ SCREEN ────────────────────────────────────────────────────────────
  const answered = selected !== null;
  const backLabel = fromTraining ? "Training" : isDrillMode ? "Daily Drill" : "Modes";

  return (
    <div className="px-5 pt-4 pb-28 max-w-md md:max-w-4xl md:px-10 mx-auto overflow-x-hidden relative">
      <button
        onClick={fromTraining ? () => navigate("/insights") : backToSelect}
        aria-label="Back"
        className="text-sh-muted text-[13px] min-h-[44px] flex items-center gap-1"
      >
        ← {backLabel}
      </button>

      {/* XP / rank flash */}
      {flash && (
        <div
          key={flash.id}
          className="absolute top-12 left-1/2 -translate-x-1/2 pointer-events-none z-10 whitespace-nowrap animate-xp-flash"
        >
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-white font-semibold shadow-sh-md ${flash.big ? "bg-sh-text text-[14px]" : "bg-sh-cta text-[11px]"}`}>
            {flash.text}
          </span>
        </div>
      )}

      {/* Progress */}
      <div className="flex items-center justify-between text-[12px] text-sh-muted">
        <span className="flex items-center gap-2">
          {index + 1} / {total}
          {isDrillMode && (
            <span className="text-[9px] uppercase tracking-[0.12em] border border-sh-border px-1.5 py-0.5 rounded-md font-semibold text-sh-cta border-sh-cta opacity-70">
              Drill
            </span>
          )}
        </span>
        <span className="font-semibold">{score} correct</span>
      </div>
      <div className="mt-2 h-1.5 w-full bg-sh-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${((index + (answered ? 1 : 0)) / total) * 100}%`,
            background: "linear-gradient(90deg, #C4A882, #D94F2E)",
          }}
        />
      </div>

      {/* Question card */}
      <div className="mt-6 bg-sh-surface border border-sh-border rounded-2xl p-6"
        style={{ boxShadow: "0 2px 8px rgba(26,26,26,0.05)" }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className={`text-[10px] uppercase tracking-[0.12em] font-semibold ${DIFF_COLOUR[q.difficulty]}`}>
            {DIFF_LABEL[q.difficulty]}
          </span>
          <span className="text-[10px] text-sh-muted uppercase tracking-[0.1em]">
            {q.category === "soho-story" ? "the house" : q.category}
          </span>
        </div>
        <h2 className="font-sans font-black text-[22px] text-sh-text leading-snug tracking-tight">
          {q.question}
        </h2>
      </div>

      {/* Options */}
      <div className="mt-4 flex flex-col gap-2">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correctIndex;
          const isPicked  = selected === i;
          let cls   = "bg-sh-bg border-sh-border text-sh-text hover:border-sh-border-strong";
          let extra = "";
          if (answered) {
            if (isCorrect)     { cls = "bg-sh-success-light border-sh-success text-sh-text"; }
            else if (isPicked) { cls = "bg-sh-error-light border-sh-error-border text-sh-error"; extra = "line-through"; }
            else               { cls = "bg-sh-bg border-sh-border text-sh-muted opacity-60"; }
          }
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              disabled={answered}
              className={`w-full text-left px-4 py-3.5 text-[14px] border rounded-xl transition-all duration-150 ${cls} ${extra}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {answered && (
        <p className="mt-4 text-[12px] text-sh-muted leading-relaxed px-1">
          {q.explanation}
        </p>
      )}

      {/* Next / See results */}
      {answered && (
        <button
          onClick={next}
          className="mt-5 w-full py-3.5 text-[14px] font-semibold bg-sh-cta text-white rounded-xl hover:bg-sh-cta-dark transition-colors shadow-sh-md"
        >
          {isLast ? "See results →" : "Next →"}
        </button>
      )}
    </div>
  );
};

export default Quiz;
