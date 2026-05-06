import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MENU_ITEMS, CATEGORIES, MenuItem } from "@/data/menuData";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useXP } from "@/hooks/useXP";

const categoryLabel = (key: MenuItem["category"]) =>
  CATEGORIES.find((c) => c.key === key)?.label ?? key;

type Lang = "en" | "fr" | "he";
type Rating = "again" | "almost" | "got";
type ModeKey = "menu" | "house" | "floor" | "full";

const MODE_CATS: Record<ModeKey, MenuItem["category"][] | "all"> = {
  menu: ["smalls", "starters", "salads", "mains", "sides", "pizza-sandwiches"],
  house: ["soho-story", "soho-tlv"],
  floor: ["waiter"],
  full: "all",
};

const MODE_META: Record<ModeKey, { name: string; tip: string }> = {
  menu: { name: "The Menu", tip: "Describe every dish in 2 sentences." },
  house: { name: "The House", tip: "Know the story behind the House." },
  floor: { name: "The Floor", tip: "This is what separates good from great." },
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
  const [screen, setScreen] = useState<"select" | "start" | "card">("select");
  const [mode, setMode] = useState<ModeKey>("menu");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useLocalStorage<number[]>("sh_mastered", []);
  const [ratings, setRatings] = useLocalStorage<Record<number, Rating>>("sh_ratings", {});
  const [lang, setLang] = useState<Lang>("en");
  const [flash, setFlash] = useState<{ id: number; text: string } | null>(null);
  const [sessionRated, setSessionRated] = useState<Record<number, Rating>>({});
  const { addXP, sessionStreak, incrementSessionStreak, resetSessionStreak, awardDailyBonus } = useXP();

  const deck = useMemo(() => itemsForMode(mode, ratings), [mode, ratings]);
  const total = deck.length;
  const safeIndex = total === 0 ? 0 : currentIndex % total;
  const card = deck[safeIndex];

  const counts = useMemo(() => ({
    menu: itemsForMode("menu", {}).length,
    house: itemsForMode("house", {}).length,
    floor: itemsForMode("floor", {}).length,
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
  const backToModes = () => { setScreen("select"); setIsFlipped(false); setCurrentIndex(0); };

  const quizForMode = (m: ModeKey) => {
    const map: Record<ModeKey, string> = {
      menu: "menu",
      house: "soho-story",
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
    const modes: ModeKey[] = ["menu", "house", "floor", "full"];
    return (
      <div className="px-6 pt-6 pb-28 max-w-md md:max-w-4xl md:px-10 mx-auto overflow-x-hidden">
        <h1 className="font-serif text-[32px] md:text-[48px] text-sh-text leading-tight">Study</h1>
        <p className="font-sans text-[12px] text-sh-muted mt-1">Choose your deck</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {modes.map((m) => (
            <div key={m} className="flex flex-col gap-2">
              <button
                onClick={() => openMode(m)}
                className="bg-[#F0EAE0] border border-sh-border rounded-none p-5 text-left flex flex-col justify-between"
                style={{ minHeight: "clamp(80px, 22vw, 260px)" }}
              >
                <div className="font-serif text-[22px] md:text-[28px] text-sh-text leading-tight">{MODE_META[m].name}</div>
                <div className="font-sans text-[11px] text-sh-muted mt-1">{counts[m]} cards</div>
              </button>
              <button
                onClick={() => quizForMode(m)}
                className="text-[11px] text-sh-muted border border-sh-border rounded-none bg-transparent py-2"
              >
                Quiz this deck
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── START SCREEN ──────────────────────────────────────────────
  if (screen === "start") {
    return (
      <div className="px-6 pt-6 max-w-md mx-auto flex flex-col items-center justify-center text-center overflow-x-hidden">
        <button
          onClick={backToModes}
          aria-label="Back"
          className="absolute top-16 left-4 text-sh-muted text-[18px] min-h-[44px] min-w-[44px] flex items-center justify-start px-2"
        >
          ←
        </button>
        <h2 className="font-serif text-[48px] text-sh-text leading-none">{MODE_META[mode].name}</h2>
        <p className="font-sans text-[13px] text-sh-muted mt-3">{counts[mode]} cards</p>
        <div className="h-px w-32 bg-sh-border my-5" />
        <p className="font-sans italic text-[12px] text-sh-muted">{MODE_META[mode].tip}</p>
        <button
          onClick={startStudying}
          className="mt-8 w-full bg-sh-text text-white py-3 text-[14px] font-sans rounded-none min-h-[44px]"
        >
          Start studying
        </button>
        <button
          onClick={backToModes}
          className="mt-3 text-[12px] text-sh-muted font-sans min-h-[44px]"
        >
          ← Back
        </button>
      </div>
    );
  }

  // ── CARD SCREEN ───────────────────────────────────────────────
  return (
    <div className="px-5 pt-4 pb-28 max-w-md md:max-w-4xl md:px-10 mx-auto overflow-x-hidden">
      <button
        onClick={backToModes}
        aria-label="Back to modes"
        className="text-sh-muted text-[18px] min-h-[44px] min-w-[44px] flex items-center"
      >
        ←
      </button>

      <div className="mt-3">
        <div className="h-px w-full bg-sh-border relative">
          <div
            className="absolute inset-y-0 left-0 bg-sh-text"
            style={{ width: total === 0 ? "0%" : `${((safeIndex + 1) / total) * 100}%` }}
          />
        </div>
        {sessionStreak > 1 && (
          <div className="mt-2 text-[11px] text-sh-muted">🔥 {sessionStreak} in a row</div>
        )}
      </div>

      <div className="mt-6 perspective-1000" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <button
          type="button"
          onClick={() => setIsFlipped((f) => !f)}
          className="relative w-full block text-left"
          style={{ height: "55vh" }}
        >
          <div
            className="relative w-full h-full preserve-3d transition-transform duration-500"
            style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
          >
            <div className="absolute inset-0 backface-hidden bg-sh-surface border border-sh-border rounded-none flex flex-col overflow-hidden">
              {card && (
                card.imageUrl ? (
                  <>
                    <div className="relative h-1/2 w-full bg-sh-surface overflow-hidden">
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                      <div className="absolute inset-0 bg-black/[0.08]" />
                    </div>
                    <div className="h-1/2 p-6 flex flex-col">
                      <div className="text-[10px] uppercase tracking-widest text-sh-muted">{categoryLabel(card.category)}</div>
                      <div className="flex-1 flex items-center justify-center">
                        <h2 className="font-serif text-[36px] font-normal text-sh-text text-center leading-tight">{card.name}</h2>
                      </div>
                      <div className="text-center text-[12px] text-sh-muted">Tap to reveal</div>
                    </div>
                  </>
                ) : (
                  <div className="h-full p-6 flex flex-col">
                    <div className="text-[10px] uppercase tracking-widest text-sh-muted">{categoryLabel(card.category)}</div>
                    <div className="flex-1 flex items-center justify-center">
                      <h2 className="font-serif text-[24px] font-normal text-sh-text text-center leading-snug">{card.name}</h2>
                    </div>
                    <div className="text-center text-[12px] text-sh-muted">Tap to reveal</div>
                  </div>
                )
              )}
            </div>

            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-sh-surface border border-sh-border rounded-none p-6 flex flex-col">
              {card && (
                card.str ? (
                  <>
                    <div className="text-[10px] uppercase tracking-widest text-sh-muted">{categoryLabel(card.category)}</div>
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 overflow-y-auto">
                      <p className="text-[13px] text-sh-text text-center leading-relaxed">{card.ingredients}</p>
                      {card.allergens.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 justify-center">
                          {card.allergens.map((a) => (
                            <span key={a} className="px-2 py-0.5 text-[10px] bg-sh-btn text-sh-bg rounded-none">{a}</span>
                          ))}
                        </div>
                      )}
                      {card.dietary.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 justify-center">
                          {card.dietary.map((d) => (
                            <span key={d} className="px-2 py-0.5 text-[10px] border border-sh-text text-sh-text bg-transparent rounded-none">{d}</span>
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
                              className={`px-2 py-0.5 text-[9px] uppercase tracking-wider rounded-none border ${
                                active ? "bg-sh-btn text-sh-btn-text border-sh-btn" : "bg-transparent text-sh-muted border-sh-border"
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
                        <p className="font-serif italic text-[15px] text-sh-text text-center leading-snug">{card.str[lang]}</p>
                      )}
                    </div>
                    {card.pairing && (
                      <div className="text-center text-[11px] italic text-sh-muted">Pairs with: {card.pairing}</div>
                    )}
                  </>
                ) : (
                  <div className="h-full flex flex-col">
                    <div className="text-[10px] uppercase tracking-widest text-sh-muted">{categoryLabel(card.category)}</div>
                    <div className="flex-1 flex items-center justify-center">
                      <p className="font-serif text-[20px] text-sh-text text-center leading-snug">{card.ingredients}</p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </button>
      </div>

      {isFlipped && (
        <div className="mt-5 grid grid-cols-3 gap-2 relative">
          {flash && (
            <div
              key={flash.id}
              className="absolute -top-2 left-1/2 -translate-x-1/2 text-[11px] text-sh-text animate-xp-flash pointer-events-none"
            >
              {flash.text}
            </div>
          )}
          {[
            { k: "again", label: "Again" },
            { k: "almost", label: "Almost" },
            { k: "got", label: "Got it" },
          ].map((b) => (
            <button
              key={b.k}
              onClick={() => handleConfidence(b.k as Rating)}
              className="py-2.5 text-[13px] text-sh-muted border border-sh-border rounded-none bg-transparent min-h-[44px]"
            >
              {b.label}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between text-[13px] text-sh-muted">
        <button onClick={goPrev} className="px-3 py-2 min-h-[44px] min-w-[44px]">←</button>
        <span>Mastered: {masteredIds.length} / {MENU_ITEMS.length}</span>
        <button onClick={goNext} className="px-3 py-2 min-h-[44px] min-w-[44px]">→</button>
      </div>

      <button
        onClick={backToModes}
        className="mt-3 w-full text-center text-[11px] text-sh-muted font-sans min-h-[44px]"
      >
        ← Back to modes
      </button>
    </div>
  );
};

export default Flashcards;
