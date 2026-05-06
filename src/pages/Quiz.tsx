import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { QUIZ_QUESTIONS, QuizQuestion, QuizCategory } from "@/data/quizData";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useXP } from "@/hooks/useXP";

type ModeKey = "menu" | "allergens" | "soho-story" | "full";

const MODE_META: Record<ModeKey, { name: string; cat: QuizCategory | "all" }> = {
  menu: { name: "The Menu", cat: "menu" },
  allergens: { name: "Allergens", cat: "allergens" },
  "soho-story": { name: "The House", cat: "soho-story" },
  full: { name: "Full House", cat: "all" },
};

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
  return cat === "all" ? QUIZ_QUESTIONS : QUIZ_QUESTIONS.filter((q) => q.category === cat);
};

const Quiz = () => {
  const [params, setParams] = useSearchParams();
  const [screen, setScreen] = useState<"select" | "quiz">("select");
  const [mode, setMode] = useState<ModeKey>("menu");
  const [sessionKey, setSessionKey] = useState(0);

  const questions = useMemo<QuizQuestion[]>(
    () => shuffle(questionsForMode(mode)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sessionKey, mode]
  );

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [done, setDone] = useState(false);
  const [bestScore, setBestScore] = useLocalStorage<number>("sh_best_score", 0);
  const { addXP, awardDailyBonus, awardPerfectQuiz } = useXP();
  const [flash, setFlash] = useState<{ id: number; text: string } | null>(null);

  // Auto-start from external link (?cat=menu)
  useEffect(() => {
    const cat = params.get("cat") as ModeKey | null;
    if (cat && MODE_META[cat]) {
      setMode(cat);
      setScreen("quiz");
      setIndex(0);
      setSelected(null);
      setScore(0);
      setStreak(0);
      setDone(false);
      setSessionKey((k) => k + 1);
      params.delete("cat");
      setParams(params, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = questions.length;
  const q = questions[index];
  const isLast = index === total - 1;

  const triggerFlash = (text: string) => {
    const id = Date.now();
    setFlash({ id, text });
    setTimeout(() => setFlash((f) => (f && f.id === id ? null : f)), 800);
  };

  const choose = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correctIndex) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setScore((s) => s + 1);
      let amount = 10;
      if (newStreak === 5) amount = 25;
      else if (newStreak === 3) amount = 15;
      addXP(amount);
      const bonus = awardDailyBonus();
      triggerFlash(bonus ? `+${amount} XP · +${bonus} daily` : `+${amount} XP`);
    } else {
      setStreak(0);
    }
  };

  const next = () => {
    if (isLast) {
      const finalScore = score;
      if (finalScore > bestScore) setBestScore(finalScore);
      if (finalScore === total && total > 0) {
        const amount = awardPerfectQuiz();
        triggerFlash(`Perfect! +${amount} XP`);
      }
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setStreak(0);
    setDone(false);
    setSessionKey((k) => k + 1);
  };

  const startMode = (m: ModeKey) => {
    setMode(m);
    restart();
    setScreen("quiz");
  };

  const backToSelect = () => {
    setScreen("select");
    restart();
  };

  // ── MODE SELECTOR ──
  if (screen === "select") {
    const modes: ModeKey[] = ["menu", "allergens", "soho-story", "full"];
    return (
      <div className="px-6 pt-6 pb-28 max-w-md md:max-w-4xl md:px-10 mx-auto overflow-x-hidden">
        <h1 className="font-serif text-[32px] text-sh-text leading-tight">Quiz</h1>
        <p className="font-sans text-[12px] text-sh-muted mt-1">Choose your focus</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {modes.map((m) => {
            const count = questionsForMode(m).length;
            return (
              <button
                key={m}
                onClick={() => startMode(m)}
                className="bg-[#F0EAE0] border border-sh-border rounded-none p-5 text-left min-h-[44px] md:min-h-[180px] md:flex md:flex-col md:justify-between"
              >
                <div className="font-serif text-[22px] text-sh-text leading-tight">{MODE_META[m].name}</div>
                <div className="font-sans text-[11px] text-sh-muted mt-1">{count} questions</div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (done) {
    const message =
      score === total
        ? "Perfect. Adam will be impressed."
        : score >= total * 0.75
        ? "Solid. Review your weak cards tonight."
        : "Back to the flashcards — you've got this.";

    return (
      <div className="px-5 pt-10 pb-28 max-w-md md:max-w-2xl md:px-10 mx-auto flex flex-col items-center text-center">
        <div className="font-serif text-[64px] leading-none text-sh-text">
          {score} / {total}
        </div>
        <p className="mt-4 text-[14px] text-sh-muted">{message}</p>
        <p className="mt-2 text-[12px] text-sh-muted">
          Best score: {Math.max(bestScore, score)} / {total}
        </p>
        <button
          onClick={restart}
          className="mt-10 w-full py-3 text-[14px] border border-sh-text text-sh-text bg-transparent rounded-none"
        >
          Retake quiz
        </button>
        <button
          onClick={backToSelect}
          className="mt-3 w-full text-[12px] text-sh-muted font-sans min-h-[44px]"
        >
          ← Back to modes
        </button>
      </div>
    );
  }

  const answered = selected !== null;

  return (
    <div className="px-5 pt-4 pb-28 max-w-md md:max-w-4xl md:px-10 mx-auto overflow-x-hidden relative">
      <button
        onClick={backToSelect}
        aria-label="Back"
        className="text-sh-muted text-[18px] min-h-[44px] min-w-[44px] flex items-center"
      >
        ←
      </button>
      {flash && (
        <div
          key={flash.id}
          className="absolute top-12 left-1/2 -translate-x-1/2 text-[11px] text-sh-text animate-xp-flash pointer-events-none z-10"
        >
          {flash.text}
        </div>
      )}
      <div className="flex items-center justify-between text-[12px] text-sh-muted">
        <span>Question {index + 1} / {total}</span>
        <span>{score} / {index + (answered ? 1 : 0)} correct</span>
      </div>
      <div className="mt-2 h-px w-full bg-sh-border relative">
        <div
          className="absolute inset-y-0 left-0 bg-sh-text"
          style={{ width: `${((index + (answered ? 1 : 0)) / total) * 100}%` }}
        />
      </div>

      <div className="mt-6 bg-sh-surface border border-sh-border rounded-none p-6">
        <h2 className="font-serif text-[24px] font-normal text-sh-text leading-relaxed">
          {q.question}
        </h2>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correctIndex;
          const isPicked = selected === i;
          let cls = "bg-sh-bg border-sh-border text-sh-text";
          let extra = "";
          if (answered) {
            if (isCorrect) {
              cls = "bg-sh-surface border-sh-text text-sh-text";
            } else if (isPicked) {
              cls = "bg-sh-bg border-sh-muted text-sh-muted";
              extra = "line-through";
            } else {
              cls = "bg-sh-bg border-sh-border text-sh-muted";
            }
          }
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              disabled={answered}
              className={`w-full text-left px-4 py-3 text-[14px] border rounded-none transition-colors ${cls} ${extra}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {answered && (
        <p className="mt-4 text-[12px] italic text-sh-muted leading-relaxed">
          {q.explanation}
        </p>
      )}

      {answered && (
        <button
          onClick={next}
          className="mt-6 w-full py-3 text-[14px] bg-sh-btn text-sh-btn-text rounded-none"
        >
          {isLast ? "See results" : "Next"}
        </button>
      )}
    </div>
  );
};

export default Quiz;
