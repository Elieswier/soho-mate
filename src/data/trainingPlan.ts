export type DayProgress = {
  flashcards: boolean;
  quiz: boolean;
  script: boolean;
  checklist: boolean[];
};

export type TrainingDayData = {
  day: number;
  title: string;
  theme: string;
  flashcard: {
    label: string;
    description: string;
    category: string;
    mode: "menu" | "house" | "floor" | "full";
  };
  quiz: {
    label: string;
    description: string;
    category: string;
    mode: "menu" | "allergens" | "soho-story" | "full";
  };
  script: {
    title: string;
    text: string;
  };
  checklist: string[];
};

export const TRAINING_PLAN: TrainingDayData[] = [
  {
    day: 1,
    title: "Welcome to the House",
    theme: "Soho culture, TLV basics, and your first greeting",
    flashcard: {
      label: "TLV House deck",
      description: "8 cards — location, spaces, bedrooms, and the House philosophy",
      category: "soho-tlv",
      mode: "house",
    },
    quiz: {
      label: "Soho Story quiz",
      description: "History, global presence, and TLV-specific knowledge",
      category: "soho-story",
      mode: "soho-story",
    },
    script: {
      title: "The Greeting",
      text: `Good [evening/afternoon], welcome to Soho House.\nMy name's Elie — I'll be looking after you today.\nCan I start you off with something to drink?`,
    },
    checklist: [
      "Memorize the greeting in EN — say it out loud",
      "Try the FR version: Bonsoir, bienvenue au Soho House…",
      "Know your address: Yefet St 27, Tel Aviv-Jaffa",
      "Name the 4 service spaces at TLV from memory",
    ],
  },
  {
    day: 2,
    title: "Smalls & Starters",
    theme: "First 9 dishes — ingredients, allergens, and how to describe them",
    flashcard: {
      label: "Smalls + Starters deck",
      description: "9 cards — the opening dishes you'll describe to every table",
      category: "smalls",
      mode: "menu",
    },
    quiz: {
      label: "Menu quiz",
      description: "Ingredients, allergens, and dietary categories for smalls and starters",
      category: "menu",
      mode: "menu",
    },
    script: {
      title: "Tapas-style service",
      text: `Feel free to order as you go —\neverything comes out as it's ready.\nTake your time and just wave me over whenever.`,
    },
    checklist: [
      "Recite the Shrimp ingredients from memory",
      "Name all allergens in the Lamb Kebab (gluten + sesame)",
      "Identify the plant-based small (Edamame & Jalapeño Dip)",
      "Describe one starter using the STR formula",
    ],
  },
  {
    day: 3,
    title: "Salads, Sides & Allergens",
    theme: "Lighter dishes, dietary categories, and allergen fluency",
    flashcard: {
      label: "Salads + Sides deck",
      description: "9 cards — 4 salads and 5 sides with full allergen profiles",
      category: "salads",
      mode: "menu",
    },
    quiz: {
      label: "Allergens quiz",
      description: "Identify allergens across the menu — no guessing allowed",
      category: "allergens",
      mode: "allergens",
    },
    script: {
      title: "60-second check-in",
      text: `How is everything so far?\nCan I bring you anything else while you're settled?`,
    },
    checklist: [
      "Name all 3 allergens in the Caesar (fish + gluten + dairy)",
      "Identify the plant-based salad (Summer Salad)",
      "Know the gluten-free safe side (Tomato & Onion salad)",
      "Recite the Big 8 allergens out loud without looking",
    ],
  },
  {
    day: 4,
    title: "Mains & Wine Pairings",
    theme: "All 7 mains, wine pairings, and the bottle upsell",
    flashcard: {
      label: "Mains deck",
      description: "7 cards — every main with ingredients, allergens and pairing",
      category: "mains",
      mode: "menu",
    },
    quiz: {
      label: "Menu quiz",
      description: "Mains-focused: ingredients, allergens, and plant-based options",
      category: "menu",
      mode: "menu",
    },
    script: {
      title: "Wine upsell",
      text: `Would a bottle make more sense for the table?\nBetter value and I'll keep your glasses topped up.`,
    },
    checklist: [
      "Know the pairing for Beef Fillet (Cabernet Sauvignon)",
      "Name both plant-based mains (Lasagnette + Pumpkin & Tofu Curry)",
      "Know the Salmon allergens (fish + dairy + sulphites)",
      "Practice the bottle upsell line out loud 3 times",
    ],
  },
  {
    day: 5,
    title: "Pizza, Sandwiches & Allergen Depth",
    theme: "Full menu coverage and mastering allergen safety",
    flashcard: {
      label: "Pizza & Sandwiches deck",
      description: "6 cards — pizzas, burgers, sandwiches with key allergens",
      category: "pizza-sandwiches",
      mode: "menu",
    },
    quiz: {
      label: "Allergens quiz",
      description: "Full allergen deep-dive — this is what protects your guests",
      category: "allergens",
      mode: "allergens",
    },
    script: {
      title: "Recovery script",
      text: `I sincerely apologize — let me sort that right now\nand make sure the rest of your time here\nis exactly right.`,
    },
    checklist: [
      "Know which burger has mustard allergen (Dirty Burger)",
      "Name the Reuben Ciabatta allergens (gluten + egg)",
      "Suggest a safe main for a dairy-free guest",
      "Say out loud: 'Great question — let me check with the kitchen'",
    ],
  },
  {
    day: 6,
    title: "The House Story",
    theme: "Soho history, TLV building, and brand storytelling",
    flashcard: {
      label: "Soho Story deck",
      description: "10 cards — the story members love to hear",
      category: "soho-story",
      mode: "house",
    },
    quiz: {
      label: "Soho Story quiz",
      description: "History, global facts, and TLV details",
      category: "soho-story",
      mode: "soho-story",
    },
    script: {
      title: "Pool & garden service",
      text: `Can I get you something cold to drink?\nWe have still and sparkling water,\nfresh juices, and the full wine list.`,
    },
    checklist: [
      "Know when Soho House was founded (1995, Nick Jones, London)",
      "Share the 300-year-old lemon trees detail naturally",
      "Know the laptop rule (not at pool or garden)",
      "Know how many Houses globally (48 across 19 countries)",
    ],
  },
  {
    day: 7,
    title: "The Full Run",
    theme: "Everything together — service from greeting to farewell",
    flashcard: {
      label: "Service deck",
      description: "8 cards — the craft of being the best waiter in the room",
      category: "waiter",
      mode: "floor",
    },
    quiz: {
      label: "Full House quiz",
      description: "Service scenarios, recovery, and member handling — everything",
      category: "service",
      mode: "full",
    },
    script: {
      title: "Farewell",
      text: `It was a pleasure —\nwe hope to see you back at the House.`,
    },
    checklist: [
      "Walk through a full service in your head: greet → tapas → wine → farewell",
      "Name all 8 allergens without looking",
      "Know the STR formula by heart (Sensory → Technique → Recommended pairing)",
      "Score 10 or above on the Full House quiz",
    ],
  },
];
