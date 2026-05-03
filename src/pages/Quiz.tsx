import { useMemo, useState } from "react";
import { QUIZ_QUESTIONS, QuizQuestion } from "@/data/quizData";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useXP } from "@/hooks/useXP";

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const Quiz = () => {
  const [sessionKey, setSessionKey] = useState(0);
  const questions = useMemo<QuizQuestion[]>(
    () => shuffle(QUIZ_QUESTIONS),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sessionKey]
  );
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [bestScore, setBestScore] = useLocalStorage<number>("sh_best_score", 0);
  const { addXP } = useXP();
  const [flash, setFlash] = useState<{ id: number; text: string } | null>(null);

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
      setScore((s) => s + 1);
      addXP(10);
      triggerFlash("+10 XP");
    } else {
      addXP(3);
      triggerFlash("+3 XP");
    }
  };

  const next = () => {
    if (isLast) {
      const finalScore = score;
      if (finalScore > bestScore) setBestScore(finalScore);
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
    setDone(false);
    setSessionKey((k) => k + 1);
  };

  if (done) {
    const message =
      score >= 12
        ? "Menu mastered. Adam will be impressed."
        : score >= 8
        ? "Solid. Review your weak cards tonight."
        : "Back to the flashcards — you've got this.";

    return (
      <div className="px-5 pt-10 pb-8 max-w-md mx-auto flex flex-col items-center text-center">
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
      </div>
    );
  }

  const answered = selected !== null;

  return (
    <div className="px-5 pt-4 pb-6 max-w-md mx-auto">
      {/* Header */}
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

      {/* Question card */}
      <div className="mt-6 bg-sh-surface border border-sh-border rounded-none p-6">
        <h2 className="font-serif text-[24px] font-normal text-sh-text leading-relaxed">
          {q.question}
        </h2>
      </div>

      {/* Options */}
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

      {/* Explanation */}
      {answered && (
        <p className="mt-4 text-[12px] italic text-sh-muted leading-relaxed">
          {q.explanation}
        </p>
      )}

      {/* Next */}
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
