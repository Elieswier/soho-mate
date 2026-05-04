import { useMemo, useRef, useState } from "react";
import { MENU_ITEMS, CATEGORIES, MenuItem } from "@/data/menuData";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useXP } from "@/hooks/useXP";

const categoryLabel = (key: MenuItem["category"]) =>
  CATEGORIES.find((c) => c.key === key)?.label ?? key;

type Lang = "en" | "fr" | "he";

const Flashcards = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useLocalStorage<number[]>("sh_mastered", []);
  const [lang, setLang] = useState<Lang>("en");
  const [flash, setFlash] = useState<{ id: number; text: string } | null>(null);
  const { addXP, sessionStreak, incrementSessionStreak, resetSessionStreak, updateDailyStreak } = useXP();

  const filtered = useMemo(
    () =>
      activeCategory === "all"
        ? MENU_ITEMS
        : MENU_ITEMS.filter((m) => m.category === activeCategory),
    [activeCategory]
  );

  const total = filtered.length;
  const safeIndex = total === 0 ? 0 : currentIndex % total;
  const card = filtered[safeIndex];

  const triggerFlash = (text: string) => {
    const id = Date.now();
    setFlash({ id, text });
    setTimeout(() => setFlash((f) => (f && f.id === id ? null : f)), 800);
  };

  const goNext = () => {
    setIsFlipped(false);
    setCurrentIndex((i) => (total === 0 ? 0 : (i + 1) % total));
  };
  const goPrev = () => {
    setIsFlipped(false);
    setCurrentIndex((i) => (total === 0 ? 0 : (i - 1 + total) % total));
  };

  const handleConfidence = (level: "again" | "almost" | "got") => {
    if (level === "got" && card && !masteredIds.includes(card.id)) {
      setMasteredIds([...masteredIds, card.id]);
    }
    if (level === "got") {
      addXP(15);
      incrementSessionStreak();
      updateDailyStreak();
      triggerFlash("+15 XP");
    } else if (level === "almost") {
      addXP(5);
      triggerFlash("+5 XP");
    } else {
      addXP(2);
      resetSessionStreak();
      triggerFlash("+2 XP");
    }
    setTimeout(goNext, 250);
  };

  const onCategoryChange = (key: string) => {
    setActiveCategory(key);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  };

  const langs: Lang[] = ["en", "fr", "he"];

  return (
    <div className="px-5 pt-4 pb-6 max-w-md mx-auto overflow-x-hidden">
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
        {CATEGORIES.map((c) => {
          const active = activeCategory === c.key;
          return (
            <button
              key={c.key}
              onClick={() => onCategoryChange(c.key)}
              className={`shrink-0 px-3 py-1.5 text-[12px] rounded-none border transition-colors ${
                active
                  ? "bg-sh-btn text-sh-btn-text border-sh-btn"
                  : "bg-transparent text-sh-muted border-sh-border"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        <div className="h-px w-full bg-sh-border relative">
          <div
            className="absolute inset-y-0 left-0 bg-sh-text"
            style={{
              width: total === 0 ? "0%" : `${((safeIndex + 1) / total) * 100}%`,
            }}
          />
        </div>
        {sessionStreak > 1 && (
          <div className="mt-2 text-[11px] text-sh-muted">🔥 {sessionStreak} in a row</div>
        )}
      </div>

      <div
        className="mt-6 perspective-1000"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button
          type="button"
          onClick={() => setIsFlipped((f) => !f)}
          className="relative w-full block text-left"
          style={{ height: "55vh" }}
        >
          <div
            className={`relative w-full h-full preserve-3d transition-transform duration-500`}
            style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
          >
            <div className="absolute inset-0 backface-hidden bg-sh-surface border border-sh-border rounded-none flex flex-col overflow-hidden">
              {card && (
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
                    <div className="text-[10px] uppercase tracking-widest text-sh-muted">
                      {categoryLabel(card.category)}
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <h2 className="font-serif text-[36px] font-normal text-sh-text text-center leading-tight">
                        {card.name}
                      </h2>
                    </div>
                    <div className="text-center text-[12px] text-sh-muted">Tap to reveal</div>
                  </div>
                </>
              )}
            </div>

            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-sh-surface border border-sh-border rounded-none p-6 flex flex-col">
              {card && (
                <>
                  <div className="text-[10px] uppercase tracking-widest text-sh-muted">
                    {categoryLabel(card.category)}
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center gap-3 overflow-y-auto">
                    <p className="text-[13px] text-sh-text text-center leading-relaxed">
                      {card.ingredients}
                    </p>
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

                    {/* Language toggle */}
                    <div
                      className="flex gap-1.5 mt-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {langs.map((l) => {
                        const active = lang === l;
                        return (
                          <button
                            key={l}
                            onClick={(e) => { e.stopPropagation(); setLang(l); }}
                            className={`px-2 py-0.5 text-[9px] uppercase tracking-wider rounded-none border ${
                              active
                                ? "bg-sh-btn text-sh-btn-text border-sh-btn"
                                : "bg-transparent text-sh-muted border-sh-border"
                            }`}
                          >
                            {l}
                          </button>
                        );
                      })}
                    </div>

                    {lang === "he" ? (
                      <p className="text-[14px] text-sh-text text-right w-full" dir="rtl">
                        {card.str.he}
                      </p>
                    ) : (
                      <p className="font-serif italic text-[15px] text-sh-text text-center leading-snug">
                        {card.str[lang]}
                      </p>
                    )}
                  </div>
                  <div className="text-center text-[11px] italic text-sh-muted">
                    Pairs with: {card.pairing}
                  </div>
                </>
              )}
            </div>
          </div>
        </button>
      </div>

      {/* XP buttons */}
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
              onClick={() => handleConfidence(b.k as "again" | "almost" | "got")}
              className="py-2.5 text-[13px] text-sh-muted border border-sh-border rounded-none bg-transparent"
            >
              {b.label}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between text-[13px] text-sh-muted">
        <button onClick={goPrev} className="px-2 py-1">←</button>
        <span>Mastered: {masteredIds.length} / {MENU_ITEMS.length}</span>
        <button onClick={goNext} className="px-2 py-1">→</button>
      </div>
    </div>
  );
};

export default Flashcards;
