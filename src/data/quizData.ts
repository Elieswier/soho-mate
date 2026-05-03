export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 1, question: "Which dish contains crustaceans?", options: ["Edamame & Jalapeño Dip", "Shrimp", "Fish Kebab", "Sea Bass Ceviche"], correctIndex: 1, explanation: "Shrimp are crustaceans — always flag this allergen." },
  { id: 2, question: "A vegan guest asks for a main. Which is safe?", options: ["Brick Chicken", "Salmon", "Pumpkin & Tofu Curry", "Lasagnette"], correctIndex: 2, explanation: "Pumpkin & Tofu Curry is the only plant-based main." },
  { id: 3, question: "What allergens are in béarnaise sauce?", options: ["Gluten only", "Egg and Dairy", "Fish", "Mustard"], correctIndex: 1, explanation: "Béarnaise = butter (dairy) + egg yolk. Both must be flagged." },
  { id: 4, question: "Tatbileh is tahini-based. What allergen does that trigger?", options: ["Dairy", "Peanuts", "Sesame", "Soya"], correctIndex: 2, explanation: "Tahini is ground sesame — a top-14 allergen." },
  { id: 5, question: "A guest is dairy-free. Which salad works without modification?", options: ["Caesar", "Fattoush", "Summer Salad", "Med Salmon"], correctIndex: 2, explanation: "Summer Salad is fully plant-based with no dairy." },
  { id: 6, question: "Which pizzas on the menu are vegetarian?", options: ["Both Margherita and Quattro Formaggi", "Margherita only", "Quattro Formaggi only", "Neither"], correctIndex: 0, explanation: "Both pizzas are vegetarian — no meat in either." },
  { id: 7, question: "The Dirty Burger contains which unexpected allergen?", options: ["Sesame", "Celery", "Mustard", "Sulphites"], correctIndex: 2, explanation: "Mustard is in the mayo — easy to miss, must be flagged." },
  { id: 8, question: "Which starter is plant-based?", options: ["Fish Kebab", "Lamb Kebab", "Mozzarella", "Burnt Eggplant"], correctIndex: 3, explanation: "Burnt Eggplant with chickpeas is fully plant-based." },
  { id: 9, question: "Med Salmon Salad — which allergen pair must you flag?", options: ["Gluten and Dairy", "Fish and Egg", "Sesame and Soya", "Dairy and Egg"], correctIndex: 1, explanation: "Salmon = fish allergen. Egg appears in the salad too." },
  { id: 10, question: "A guest has a gluten allergy. Which side is safest?", options: ["Focaccia", "Fries", "Tomato and onion salad", "Crispy quinoa"], correctIndex: 2, explanation: "Tomato and onion salad has no gluten. Fries need fryer cross-contamination check." },
  { id: 11, question: "Mujadra appears in which two dishes?", options: ["Lamb Kebab and Fish Kebab", "Lamb Kebab and Lamb Asado", "Brick Chicken and Lamb Asado", "Sea Bream and Salmon"], correctIndex: 1, explanation: "Mujadra (lentil rice) is in both the Lamb Kebab starter and Lamb Asado main." },
  { id: 12, question: "What does STR stand for when describing a dish?", options: ["Style, Taste, Review", "Sensory, Technique, Recommended pairing", "Starter, Table, Runner", "Season, Texture, Recipe"], correctIndex: 1, explanation: "STR = your formula for describing any dish to a guest in 2 sentences." },
  { id: 13, question: "Caesar salad — what must you flag to a vegan guest?", options: ["Croutons only", "Anchovy dressing, parmesan, and croutons", "Just the parmesan", "Nothing, it is fine"], correctIndex: 1, explanation: "Three issues: anchovy (fish), parmesan (dairy), croutons (gluten)." },
  { id: 14, question: "Which small is plant-based?", options: ["Shrimp", "Confit Vegetables", "CLTA Chicken Wraps", "Edamame & Jalapeño Dip"], correctIndex: 3, explanation: "Edamame Dip is plant-based. Confit Vegetables is vegetarian (has labneh/dairy)." },
  { id: 15, question: "Fish Kebab contains which three allergens?", options: ["Gluten, Dairy, Egg", "Fish, Dairy, Sesame", "Fish, Gluten, Soya", "Dairy, Egg, Mustard"], correctIndex: 1, explanation: "Fish (the fish itself), Dairy (yoghurt), Sesame (tatbileh)." }
];
