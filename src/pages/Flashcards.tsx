import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MENU_ITEMS, CATEGORIES, MenuItem } from "@/data/menuData";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useXP } from "@/hooks/useXP";
import { useAchievements } from "@/hooks/useAchievements";
import type { DayProgress } from "@/data/trainingPlan";

const categoryLabel = (key: MenuItem["category"]) =>
  CATEGORIES.find((c) => c.key === key)?.label ?? key;

type Lang = "en" | "fr" | "he";
type Rating = "again" | "almost" | "got";
type ModeKey = "menu" | "house" | "floor" | "wine" | "full";

const MODE_CATS: Record<ModeKey, MenuItem["category"][] | "all"> = {
  menu: ["smalls", "starters", "salads", "mains", "sides", "pizza-sandwiches"],
  house: ["soho-story", "soho-tlv"],
  floor: ["waiter"],
  wine: ["wine"],
  full: "all",
};

const MODE_META: Record<ModeKey, { name: string; tip: string }> = {
  menu: { name: "The Menu", tip: "Describe every dish in 2 sentences." },
  house: { name: "The House", tip: "Know the story behind the House." },
  floor: { name: "The Floor", tip: "This is what separates good from great." },
  wine: { name: "Wine", tip: "Grape, body, key flavour, food pairing." },
  full: { name: "Full House", tip: "Your weakest cards come first." },
};

const itemsForMode = (mode: ModeKey, ratings: Record<number, Rating>): MenuItem[] => {
  const cats = MODE_CATS[mode];
  const base = cats === "all" ? MENU_ITEMS : MENU_ITEMS.filter((m) => cats.includes(m.category));
  if (mode !== "full") return base;
  const order: Record<string, number> = { again: 0, unrated: 1, almost: 2, got: 3 };
  return [...base].sort((a, b) => {
    const ra = ratings[a.id] ?? "unrated";
    const rb = ratings[b.id] ?? "unrated";
    return (order[ra] ?? 1) - (order[rb] ?? 1);
  });
};

const Flashcards = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const fromTraining = params.get("from") === "training";
  const [screen, setScreen] = useState<"select" | "start" | "card">("select");
  const [mode, setMode] = useState<ModeKey>("menu");
  const [allTrainingProgress, setAllTrainingProgress] = useLocalStorage<Record<string, DayProgress>>("sh_training", {});
  const trainingDay = Number(params.get("day") ?? "0");

  // Auto-start from training plan deep-link
  useEffect(() => {
    const m = params.get("mode") as ModeKey | null;
    if (m && (m === "menu" || m === "house" || m === "floor" || m === "wine" || m === "full")) {
      setMode(m);
      setScreen("card");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useLocalStorage<number[]>("sh_mastered", []);
  const [ratings, setRatings] = useLocalStorage<Record<number, Rating>>("sh_ratings", {});
  const [lang, setLang] = useState<Lang>("en");
  const [flash, setFlash] = useState<{ id: number; text: string } | null>(null);
  const [sessionRated, setSessionRated] = useState<Record<number, Rating>>({});
  const { addXP, sessionStreak, incrementSessionStreak, resetSessionStreak, awardDailyBonus } = useXP();
  const { trackCards } = useAchievements();

  const deck = useMemo(() => itemsForMode(mode, ratings), [mode, ratings]);
  const total = deck.length;
  const safeIndex = total === 0 ? 0 : currentIndex % total;
  const card = deck[safeIndex];

  const counts = useMemo(() => ({
    menu: itemsForMode("menu", {}).length,
    house: itemsForMode("house", {}).length,
    floor: itemsForMode("floor", {}).length,
    wine: itemsForMode("wine", {}).length,
    full: MENU_ITEMS.length,
  }), []);

  const triggerFlash = (text: string) => {
    const id = Date.now();
    setFlash({ id, text });
    setTimeout(() => setFlash((f) => (f && f.id === id ? null : f)), 800);
  };

  const goNext = () => { setIsFlipped(false); setCurrentIndex((i) => (total === 0 ? 0 : (i + 1) % total)); };
  const goPrev = () => { setIsFlipped(false); setCurrentIndex((i) => (total === 0 ? 0 : (i - 1 + total) % total)); };

  const handleConfidence = (level: Rating) => {
    if (!card) return;
    trackCards(1); // count every card reviewed toward Card Master achievement
    setRatings({ ...ratings, [card.id]: level });
    if (level === "got" && !masteredIds.includes(card.id)) {
      setMasteredIds([...masteredIds, card.id]);
    }

    const nextSession = { ...sessionRated, [card.id]: level };
    setSessionRated(nextSession);

    let parts: string[] = [];

    if (level === "got") {
      const newStreak = sessionStreak + 1;
      incrementSessionStreak();
      let amount = 10;
      if (newStreak >= 5 && newStreak % 5 === 0) amount = 25;
      else if (newStreak >= 3 && newStreak % 3 === 0) amount = 15;
      addXP(amount);
      parts.push(`+${amount} XP`);
      const bonus = awardDailyBonus();
      if (bonus) parts.push(`+${bonus} daily`);
    } else if (level === "again") {
      resetSessionStreak();
    } else {
      // almost — no XP
    }

    // Full-deck completion with no "again"
    const ratedIds = Object.keys(nextSession).map(Number);
    const deckIds = deck.map((d) => d.id);
    const allRated = deckIds.every((id) => ratedIds.includes(id));
    const noAgain = deckIds.every((id) => nextSession[id] !== "again");
    if (allRated && noAgain && deckIds.length > 0) {
      addXP(50);
      parts.push("+50 perfect deck");
      setSessionRated({});
    }

    if (parts.length) triggerFlash(parts.join(" · "));
    setTimeout(goNext, 250);
  };

  const openMode = (m: ModeKey) => { setMode(m); setScreen("start"); };
  const startStudying = () => { setCurrentIndex(0); setIsFlipped(false); setSessionRated({}); setScreen("card"); };
  const backToModes = () => {
    if (fromTraining && trainingDay > 0) {
      // Auto-mark flashcards done when returning to training
      setAllTrainingProgress((prev) => {
        const key = String(trainingDay);
        const existing = prev[key] ?? { flashcards: false, quiz: false, script: false, checklist: [] };
        return { ...prev, [key]: { ...existing, flashcards: true } };
      });
      navigate("/insights");
      return;
    }
    setScreen("select"); setIsFlipped(false); setCurrentIndex(0);
  };

  const quizForMode = (m: ModeKey) => {
    const map: Record<ModeKey, string> = {
      menu: "menu",
      house: "soho-story",
      wine: "full",
      floor: "full",
      full: "full",
    };
    navigate(`/quiz?cat=${map[m]}`);
  };

  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) { if (dx < 0) goNext(); else goPrev(); }
    touchStartX.current = null;
  };

  const langs: Lang[] = ["en", "fr", "he"];

  // ── MODE SELECTOR ─────────────────────────────────────────────
  if (screen === "select") {
    const DECK_META: Record<ModeKey, { tag: string; bg: string; textColor: string; border: string }> = {
      menu:  { tag: "DISHES · ALLERGENS", bg: "bg-[#F0EAE0]", textColor: "text-sh-text", border: "border-[#D6CEC3]" },
      house: { tag: "CULTURE · STORY",    bg: "bg-[#EAE4DA]", textColor: "text-sh-text", border: "border-[#CCC6BB]" },
      wine:  { tag: "VARIETALS · SERVICE", bg: "bg-[#E4DDD3]", textColor: "text-sh-text", border: "border-[#C8C0B4]" },
      floor: { tag: "SERVICE STANDARDS",  bg: "bg-[#EDE8E0]", textColor: "text-sh-text", border: "border-[#D2CBC0]" },
      full:  { tag: "ALL DECKS",          bg: "bg-sh-text",   textColor: "text-sh-bg",   border: "border-sh-text"   },
    };

    const BentoCard = ({
      mode: m,
      height,
      colSpan = "",
      titleSize = "text-[20px]",
    }: {
      mode: ModeKey;
      height: number;
      colSpan?: string;
      titleSize?: string;
    }) => {
      const meta = DECK_META[m];
      const info = MODE_META[m];
      return (
        <div className={`flex flex-col gap-2 ${colSpan}`}>
          <button
            onClick={() => openMode(m)}
            className={`group relative overflow-hidden border ${meta.border} ${meta.bg} p-4 md:p-5 text-left flex flex-col justify-between transition-all duration-200 rounded-2xl hover:-translate-y-0.5 active:scale-[0.98]`}
            style={{
              height: `${height}px`,
              boxShadow: "0 2px 8px rgba(26,26,26,0.06), 0 0 0 1px rgba(214,206,195,0.3)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 6px 20px rgba(26,26,26,0.10), 0 0 0 1px rgba(217,79,46,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 2px 8px rgba(26,26,26,0.06), 0 0 0 1px rgba(214,206,195,0.3)";
            }}
          >
            <div className={`font-sans font-black ${titleSize} leading-tight tracking-tight ${meta.textColor}`}>{info.name}</div>
            <div>
              {meta.tag && (
                <div className={`font-sans text-[9px] uppercase tracking-[0.12em] opacity-40 mb-1.5 ${meta.textColor}`}>
                  {meta.tag}
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className={`font-sans text-[12px] font-semibold ${meta.textColor} opacity-60`}>{counts[m]} cards</div>
              </div>
            </div>
          </button>
          <button
            onClick={() => quizForMode(m)}
            className="text-[11px] font-semibold text-sh-cta rounded-xl border border-sh-border bg-transparent py-2 hover:bg-sh-cta hover:text-white transition-all duration-150"
          >
            Quiz this deck →
          </button>
        </div>
      );
    };

    return (
      <div className="px-5 pt-6 pb-28 max-w-md md:max-w-4xl md:px-10 mx-auto overflow-x-hidden">
        <div className="flex items-end justify-between mb-6">
          <h1 className="font-sans font-black text-[44px] md:text-[56px] text-sh-text leading-none tracking-tight">Study</h1>
          <span className="font-sans text-[11px] text-sh-muted mb-1.5">{counts.full} cards total</span>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <BentoCard mode="menu"  height={168} colSpan="col-span-2" titleSize="text-[28px]" />
          <BentoCard mode="house" height={168} />
          <BentoCard mode="wine"  height={168} />

          {/* Bottom row */}
          <BentoCard mode="floor" height={136} />

          {/* Full House — 3 cols on desktop, 1 on mobile */}
          <div className="col-span-1 md:col-span-3 flex flex-col gap-2">
            <button
              onClick={() => openMode("full")}
              className="group relative overflow-hidden border border-sh-text bg-sh-text p-5 text-left flex flex-col justify-between transition-all duration-200 rounded-2xl hover:-translate-y-0.5 active:scale-[0.98]"
              style={{
                height: "136px",
                boxShadow: "0 4px 16px rgba(26,26,26,0.18)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(26,26,26,0.25)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(26,26,26,0.18)";
              }}
            >
              <div className="font-sans font-black text-[26px] leading-tight tracking-tight text-sh-bg">
                Full House
              </div>
              <div>
                <div className="font-sans text-[9px] uppercase tracking-[0.14em] opacity-40 text-sh-bg mb-1">All decks</div>
                <div className="font-sans text-[11px] opacity-60 text-sh-bg">
                  Weakest cards first · {counts.full} cards
                </div>
              </div>
            </button>
            <button
              onClick={() => quizForMode("full")}
              className="text-[11px] font-semibold text-sh-cta rounded-xl border border-sh-border bg-transparent py-2 hover:bg-sh-cta hover:text-white transition-all duration-150"
            >
              Quiz this deck →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── START SCREEN ──────────────────────────────────────────────
  if (screen === "start") {
    return (
      <div className="px-6 pt-10 max-w-md mx-auto flex flex-col items-center justify-center text-center overflow-x-hidden min-h-[70vh]">
        <button
          onClick={backToModes}
          aria-label="Back"
          className="absolute top-16 left-4 text-sh-muted text-[13px] min-h-[44px] min-w-[44px] flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-sh-surface transition-colors"
        >
          ← Decks
        </button>

        {/* Card count badge */}
        <div className="mb-5 px-3 py-1 rounded-full border border-sh-border text-[11px] text-sh-muted bg-sh-surface">
          {counts[mode]} cards
        </div>

        <h2 className="font-sans font-black text-[44px] text-sh-text leading-none tracking-tight">{MODE_META[mode].name}</h2>

        <div className="h-px w-20 bg-gradient-to-r from-transparent via-sh-border to-transparent my-6" />

        <p className="font-sans text-[13px] text-sh-muted max-w-[260px] leading-relaxed">{MODE_META[mode].tip}</p>

        <button
          onClick={startStudying}
          className="mt-8 w-full bg-sh-cta text-white py-3.5 text-[14px] font-sans font-semibold rounded-xl min-h-[44px] hover:bg-sh-cta-dark active:opacity-90 transition-all duration-150 shadow-sh-md"
        >
          Start studying →
        </button>
        <button
          onClick={backToModes}
          className="mt-3 text-[12px] text-sh-muted font-sans min-h-[44px] hover:text-sh-text transition-colors"
        >
          ← Back to decks
        </button>
      </div>
    );
  }

  // ── CARD SCREEN ───────────────────────────────────────────────
  return (
    <div className="px-5 pt-4 pb-28 max-w-md md:max-w-4xl md:px-10 mx-auto overflow-x-hidden">
      {/* Top bar: back + progress */}
      <div className="flex items-center gap-3">
        <button
          onClick={backToModes}
          aria-label="Back"
          className="text-sh-muted text-[13px] min-h-[44px] flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-sh-surface transition-colors -ml-3"
        >
          ← {fromTraining ? "Training" : "Decks"}
        </button>
        <div className="flex-1 flex flex-col gap-1">
          <div className="h-1.5 w-full bg-sh-border rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: total === 0 ? "0%" : `${((safeIndex + 1) / total) * 100}%`,
                background: "linear-gradient(90deg, #C4A882, #D94F2E)",
              }}
            />
          </div>
          {sessionStreak > 1 && (
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sh-cta-light text-sh-cta text-[10px] font-semibold self-start">
              🔥 {sessionStreak} in a row
            </div>
          )}
        </div>
        <span className="text-[11px] text-sh-muted shrink-0">
          {safeIndex + 1}/{total}
        </span>
      </div>

      <div className="mt-5 perspective-1000" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <button
          type="button"
          onClick={() => setIsFlipped((f) => !f)}
          className="relative w-full block text-left"
          style={{ height: "52vh" }}
        >
          <div
            className="relative w-full h-full preserve-3d transition-transform duration-500"
            style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
          >
            {/* Front face */}
            <div
              className="absolute inset-0 backface-hidden bg-sh-surface border border-sh-border rounded-2xl flex flex-col overflow-hidden"
              style={{ boxShadow: "0 4px 16px rgba(26,26,26,0.08)" }}
            >
              {card && (
                card.imageUrl ? (
                  <>
                    <div className="relative h-1/2 w-full bg-sh-surface overflow-hidden rounded-t-2xl">
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                      <div className="absolute inset-0 bg-black/[0.06]" />
                    </div>
                    <div className="h-1/2 p-6 flex flex-col">
                      <div className="text-[10px] uppercase tracking-[0.15em] text-sh-muted">{categoryLabel(card.category)}</div>
                      <div className="flex-1 flex items-center justify-center">
                        <h2 className="font-sans font-black text-[32px] text-sh-text text-center leading-tight tracking-tight">{card.name}</h2>
                      </div>
                      <div className="text-center text-[11px] text-sh-muted opacity-60">Tap to reveal</div>
                    </div>
                  </>
                ) : (
                  <div className="h-full p-6 flex flex-col">
                    <div className="text-[10px] uppercase tracking-[0.15em] text-sh-muted">{categoryLabel(card.category)}</div>
                    <div className="flex-1 flex items-center justify-center">
                      <h2 className="font-sans font-black text-[24px] text-sh-text text-center leading-snug tracking-tight">{card.name}</h2>
                    </div>
                    <div className="text-center text-[11px] text-sh-muted opacity-60">Tap to reveal</div>
                  </div>
                )
              )}
            </div>

            {/* Back face */}
            <div
              className="absolute inset-0 backface-hidden rotate-y-180 bg-sh-surface border border-sh-border rounded-2xl p-6 flex flex-col"
              style={{ boxShadow: "0 4px 16px rgba(26,26,26,0.08)" }}
            >
              {card && (
                card.str ? (
                  <>
                    <div className="text-[10px] uppercase tracking-[0.15em] text-sh-muted">{categoryLabel(card.category)}</div>
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 overflow-y-auto">
                      <p className="text-[13px] text-sh-text text-center leading-relaxed">{card.ingredients}</p>
                      {card.allergens.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 justify-center">
                          {card.allergens.map((a) => (
                            <span key={a} className="px-2.5 py-0.5 text-[10px] bg-sh-btn text-sh-bg rounded-lg">{a}</span>
                          ))}
                        </div>
                      )}
                      {card.dietary.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 justify-center">
                          {card.dietary.map((d) => (
                            <span key={d} className="px-2.5 py-0.5 text-[10px] border border-sh-text text-sh-text bg-transparent rounded-lg">{d}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-1.5 mt-1" onClick={(e) => e.stopPropagation()}>
                        {langs.map((l) => {
                          const active = lang === l;
                          return (
                            <button
                              key={l}
                              onClick={(e) => { e.stopPropagation(); setLang(l); }}
                              className={`px-2.5 py-1 text-[9px] uppercase tracking-wider rounded-lg border transition-colors ${
                                active ? "bg-sh-btn text-sh-btn-text border-sh-btn" : "bg-transparent text-sh-muted border-sh-border hover:border-sh-text"
                              }`}
                            >
                              {l}
                            </button>
                          );
                        })}
                      </div>
                      {lang === "he" ? (
                        <p className="text-[14px] text-sh-text text-right w-full" dir="rtl">{card.str.he}</p>
                      ) : (
                        <p className="font-serif italic text-[16px] text-sh-text text-center leading-snug">{card.str[lang]}</p>
                      )}
                    </div>
                    {card.pairing && (
                      <div className="text-center text-[11px] italic text-sh-muted">Pairs with: {card.pairing}</div>
                    )}
                  </>
                ) : (
                  <div className="h-full flex flex-col">
                    <div className="text-[10px] uppercase tracking-[0.15em] text-sh-muted">{categoryLabel(card.category)}</div>
                    <div className="flex-1 flex items-center justify-center">
                      <p className="font-sans text-[18px] text-sh-text text-center leading-snug">{card.ingredients}</p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </button>
      </div>

      {isFlipped && (
        <div className="mt-4 grid grid-cols-3 gap-2 relative">
          {flash && (
            <div
              key={flash.id}
              className="absolute -top-3 left-1/2 -translate-x-1/2 animate-xp-flash pointer-events-none whitespace-nowrap"
            >
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sh-cta text-white text-[11px] font-semibold shadow-sh-md">
                {flash.text}
              </span>
            </div>
          )}
          {[
            { k: "again",  label: "Again",  style: "bg-sh-error-light text-sh-error border-sh-error-border hover:bg-sh-error hover:text-white hover:border-sh-error" },
            { k: "almost", label: "Almost", style: "text-sh-muted border-sh-border hover:border-sh-border-strong hover:text-sh-text" },
            { k: "got",    label: "Got it ✓", style: "bg-sh-success text-white border-sh-success hover:opacity-90" },
          ].map((b) => (
            <button
              key={b.k}
              onClick={() => handleConfidence(b.k as Rating)}
              className={`py-3 text-[13px] border rounded-xl bg-transparent min-h-[44px] transition-all duration-150 ${b.style}`}
            >
              {b.label}
            </button>
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center justify-between text-[13px] text-sh-muted">
        <button onClick={goPrev} className="px-4 py-2 min-h-[44px] min-w-[44px] rounded-xl hover:bg-sh-surface transition-colors">←</button>
        <span className="text-[11px]">
          {masteredIds.length} mastered · {MENU_ITEMS.length - masteredIds.length} to go
        </span>
        <button onClick={goNext} className="px-4 py-2 min-h-[44px] min-w-[44px] rounded-xl hover:bg-sh-surface transition-colors">→</button>
      </div>

      <button
        onClick={backToModes}
        className="mt-2 w-full text-center text-[11px] text-sh-muted font-sans min-h-[44px] hover:text-sh-text transition-colors"
      >
        ← {fromTraining ? "Back to training" : "Back to decks"}
      </button>
    </div>
  );
};

export default Flashcards;
