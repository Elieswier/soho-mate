import { useLocalStorage } from "./useLocalStorage";

export type Achievement = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  // progress-based achievements: required and current count (optional)
  required?: number;
};

export const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: "first_round",    name: "First Round",    emoji: "🥂", description: "Complete your first quiz."                           },
  { id: "allergen_safe",  name: "Allergen Safe",  emoji: "🛡️", description: "Score 100% on the Allergens quiz."                   },
  { id: "sommelier",      name: "Sommelier",      emoji: "🍷", description: "Score 100% on the Wine quiz."                        },
  { id: "hat_trick",      name: "Hat Trick",      emoji: "🎩", description: "Answer 3 Hard questions correctly in one session."   },
  { id: "runway_ready",   name: "Runway Ready",   emoji: "✈️", description: "Complete Day 1 of The Runway."                       },
  { id: "full_runway",    name: "Fully Landed",   emoji: "🏁", description: "Complete all 7 days of The Runway."                  },
  { id: "week_streak",    name: "Week Streak",    emoji: "🔥", description: "Study 7 days in a row."                              },
  { id: "card_master",    name: "Card Master",    emoji: "📇", description: "Review 100 flashcards total.", required: 100         },
  { id: "full_house",     name: "Full House",     emoji: "🃏", description: "Complete a Full House quiz."                         },
  { id: "service_pro",    name: "Service Pro",    emoji: "🌟", description: "Score 100% on a quiz three times.",  required: 3     },
];

type AchievementStore = {
  unlocked: string[];         // achievement IDs
  cardCount: number;          // total flashcards reviewed
  perfectCount: number;       // total 100% quiz scores
};

const DEFAULT_STORE: AchievementStore = {
  unlocked: [],
  cardCount: 0,
  perfectCount: 0,
};

export function useAchievements() {
  const [store, setStore] = useLocalStorage<AchievementStore>("sh_achievements", DEFAULT_STORE);

  const isUnlocked = (id: string) => store.unlocked.includes(id);

  const unlock = (id: string) => {
    if (isUnlocked(id)) return false;
    setStore((prev) => ({ ...prev, unlocked: [...prev.unlocked, id] }));
    return true;
  };

  // ── Called after a quiz is submitted ─────────────────────────────────────
  // Returns array of newly-unlocked achievement IDs (for toast/banner)
  const checkQuiz = ({
    category,
    score,
    total,
    hardCorrect,
  }: {
    category: "menu" | "allergens" | "soho-story" | "wine" | "full" | "custom" | "drill";
    score: number;
    total: number;
    hardCorrect: number; // number of difficulty-3 questions answered correctly this session
  }): string[] => {
    const newly: string[] = [];
    const perfect = total > 0 && score === total;

    // First Round
    if (unlock("first_round")) newly.push("first_round");

    // Allergen Safe
    if (perfect && category === "allergens" && unlock("allergen_safe")) newly.push("allergen_safe");

    // Sommelier
    if (perfect && category === "wine" && unlock("sommelier")) newly.push("sommelier");

    // Full House
    if (perfect && category === "full" && unlock("full_house")) newly.push("full_house");

    // Hat Trick — 3+ hard correct in this session
    if (hardCorrect >= 3 && unlock("hat_trick")) newly.push("hat_trick");

    // Service Pro — 3 perfect quizzes total
    const newPerfectCount = store.perfectCount + (perfect ? 1 : 0);
    if (newPerfectCount !== store.perfectCount) {
      setStore((prev) => ({ ...prev, perfectCount: newPerfectCount }));
    }
    if (newPerfectCount >= 3 && unlock("service_pro")) newly.push("service_pro");

    return newly;
  };

  // ── Called after flashcard deck review ────────────────────────────────────
  const trackCards = (count: number): string[] => {
    const newly: string[] = [];
    const newCount = store.cardCount + count;
    setStore((prev) => ({ ...prev, cardCount: newCount }));
    if (newCount >= 100 && unlock("card_master")) newly.push("card_master");
    return newly;
  };

  // ── Called when a Runway day is completed ────────────────────────────────
  const checkRunway = (completedDays: number[]): string[] => {
    const newly: string[] = [];
    if (completedDays.includes(1) && unlock("runway_ready")) newly.push("runway_ready");
    if (completedDays.length === 7 && unlock("full_runway")) newly.push("full_runway");
    return newly;
  };

  // ── Called when daily streak updates ─────────────────────────────────────
  const checkStreak = (streak: number): string[] => {
    const newly: string[] = [];
    if (streak >= 7 && unlock("week_streak")) newly.push("week_streak");
    return newly;
  };

  return {
    store,
    isUnlocked,
    checkQuiz,
    trackCards,
    checkRunway,
    checkStreak,
    cardCount: store.cardCount,
    perfectCount: store.perfectCount,
    unlockedCount: store.unlocked.length,
    total: ALL_ACHIEVEMENTS.length,
  };
}
