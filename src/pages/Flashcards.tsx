import { useMemo, useRef, useState } from "react";
import { MENU_ITEMS, CATEGORIES, MenuItem } from "@/data/menuData";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const categoryLabel = (key: MenuItem["category"]) =>
  CATEGORIES.find((c) => c.key === key)?.label ?? key;

const Flashcards = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useLocalStorage<number[]>("sh_mastered", []);

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
    goNext();
  };

  const onCategoryChange = (key: string) => {
    setActiveCategory(key);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Touch swipe
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

  return (
    <div className="px-5 pt-4 pb-6 max-w-md mx-auto">
      {/* Category pills */}
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

      {/* Counter + progress */}
      <div className="mt-5">
        <div className="text-[12px] text-sh-muted">
          {total === 0 ? "0 / 0" : `${safeIndex + 1} / ${total}`}
        </div>
        <div className="mt-1 h-px w-full bg-sh-border relative">
          <div
            className="absolute inset-y-0 left-0 bg-sh-text"
            style={{
              width: total === 0 ? "0%" : `${((safeIndex + 1) / total) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Card */}
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
            {/* Front */}
            <div className="absolute inset-0 backface-hidden bg-sh-surface border border-sh-border rounded-none p-6 flex flex-col">
              {card && (
                <>
                  <div className="text-[10px] uppercase tracking-widest text-sh-muted">
                    {categoryLabel(card.category)}
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <h2 className="font-serif text-[36px] font-normal text-sh-text text-center leading-tight">
                      {card.name}
                    </h2>
                  </div>
                  <div className="text-center text-[12px] text-sh-muted">
                    Tap to reveal
                  </div>
                </>
              )}
            </div>

            {/* Back */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-sh-surface border border-sh-border rounded-none p-6 flex flex-col">
              {card && (
                <>
                  <div className="text-[10px] uppercase tracking-widest text-sh-muted">
                    {categoryLabel(card.category)}
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center gap-4 overflow-y-auto">
                    <p className="text-[13px] text-sh-text text-center leading-relaxed">
                      {card.ingredients}
                    </p>
                    {card.allergens.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {card.allergens.map((a) => (
                          <span
                            key={a}
                            className="px-2 py-0.5 text-[10px] bg-sh-btn text-sh-bg rounded-none"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    )}
                    {card.dietary.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {card.dietary.map((d) => (
                          <span
                            key={d}
                            className="px-2 py-0.5 text-[10px] border border-sh-text text-sh-text bg-transparent rounded-none"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
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

      {/* Confidence buttons */}
      {isFlipped && (
        <div className="mt-5 grid grid-cols-3 gap-2">
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

      {/* Prev / Next nav */}
      <div className="mt-6 flex items-center justify-between text-[13px] text-sh-muted">
        <button onClick={goPrev} className="px-2 py-1">←</button>
        <span>Mastered: {masteredIds.length} / {MENU_ITEMS.length}</span>
        <button onClick={goNext} className="px-2 py-1">→</button>
      </div>
    </div>
  );
};

export default Flashcards;
