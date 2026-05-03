export type MenuItem = {
  id: number;
  name: string;
  category: 'smalls' | 'starters' | 'salads' | 'mains' | 'pizza-sandwiches';
  ingredients: string;
  allergens: string[];
  dietary: string[];
  pairing: string;
};

export const MENU_ITEMS: MenuItem[] = [
  { id: 1, name: "Shrimp", category: "smalls", ingredients: "Garlic, olive oil, white wine, parsley, focaccia", allergens: ["Crustaceans", "Gluten", "Sulphites"], dietary: [], pairing: "House white wine" },
  { id: 2, name: "Confit Vegetables", category: "smalls", ingredients: "Labneh, eggplant, zucchini, onion, artichoke, garlic, tomato, bell pepper", allergens: ["Dairy"], dietary: ["Vegetarian"], pairing: "Light rosé" },
  { id: 3, name: "CLTA Chicken Wraps", category: "smalls", ingredients: "Cherry tomato, avocado, dill dressing", allergens: ["Check eggs in dressing"], dietary: [], pairing: "Light lager" },
  { id: 4, name: "Edamame & Jalapeño Dip", category: "smalls", ingredients: "Edamame, jalapeño, crudités", allergens: ["Soya", "Check sesame"], dietary: ["Plant-based"], pairing: "Cocktail opener" },
  { id: 5, name: "Lamb Kebab", category: "starters", ingredients: "Mujadra, bulgur, tatbileh, spinach", allergens: ["Gluten", "Sesame"], dietary: [], pairing: "Full red wine" },
  { id: 6, name: "Sea Bass Ceviche", category: "starters", ingredients: "Avocado, lemon, coriander, green onion, spicy pepper", allergens: ["Fish"], dietary: [], pairing: "Sauvignon Blanc" },
  { id: 7, name: "Burnt Eggplant", category: "starters", ingredients: "Tomato salsa, herbs, roasted chickpeas, focaccia", allergens: ["Gluten", "Check sesame"], dietary: ["Plant-based"], pairing: "Natural wine" },
  { id: 8, name: "Fish Kebab", category: "starters", ingredients: "Yoghurt, mashweya, tatbileh", allergens: ["Fish", "Dairy", "Sesame"], dietary: [], pairing: "Chilled white" },
  { id: 9, name: "Mozzarella", category: "starters", ingredients: "Cherry tomato, basil", allergens: ["Dairy"], dietary: ["Vegetarian"], pairing: "Prosecco" },
  { id: 10, name: "Caesar Salad", category: "salads", ingredients: "Romaine, anchovy dressing, crouton, parmesan", allergens: ["Fish", "Gluten", "Dairy"], dietary: [], pairing: "Chardonnay" },
  { id: 11, name: "Summer Salad", category: "salads", ingredients: "Lettuce, kohlrabi, carrot, beetroot, cucumber, crispy quinoa, balsamic vinaigrette", allergens: ["Check sulphites"], dietary: ["Plant-based"], pairing: "Rosé" },
  { id: 12, name: "Med Salmon Salad", category: "salads", ingredients: "Lettuce, artichoke, potato, tomato, egg, olive, caperberry", allergens: ["Fish", "Egg"], dietary: [], pairing: "Dry white" },
  { id: 13, name: "Fattoush", category: "salads", ingredients: "Tomato, olives, cucumber, radish, onion, crispy feta", allergens: ["Dairy"], dietary: ["Vegetarian"], pairing: "Dry rosé" },
  { id: 14, name: "Beef Fillet", category: "mains", ingredients: "Béarnaise, fries", allergens: ["Egg", "Dairy"], dietary: [], pairing: "Cabernet Sauvignon" },
  { id: 15, name: "Brick Chicken", category: "mains", ingredients: "Grape, tomato, spicy yoghurt, thai basil", allergens: ["Dairy"], dietary: [], pairing: "Pinot Noir" },
  { id: 16, name: "Lasagnette", category: "mains", ingredients: "Semi-dried tomato, zucchini, spinach, olives, parsley, garlic, olive oil, white wine", allergens: ["Gluten", "Sulphites"], dietary: ["Vegetarian"], pairing: "Sangiovese" },
  { id: 17, name: "Salmon", category: "mains", ingredients: "Wild rice, red wine, butter, asparagus, green onion, celery", allergens: ["Fish", "Dairy", "Sulphites"], dietary: [], pairing: "White Burgundy" },
  { id: 18, name: "Sea Bream", category: "mains", ingredients: "Fennel ragu, tomato, zucchini, artichoke", allergens: ["Fish"], dietary: [], pairing: "Vermentino" },
  { id: 19, name: "Lamb Asado", category: "mains", ingredients: "Mujadra, bulgur, confit vegetables", allergens: ["Gluten", "Check sesame"], dietary: [], pairing: "Syrah" },
  { id: 20, name: "Pumpkin & Tofu Curry", category: "mains", ingredients: "Pumpkin, tofu, steamed rice", allergens: ["Soya"], dietary: ["Plant-based"], pairing: "Riesling" },
  { id: 21, name: "Avocado on Toast", category: "pizza-sandwiches", ingredients: "Chilli, sourdough, poached egg", allergens: ["Gluten", "Egg"], dietary: ["Vegetarian"], pairing: "Fresh juice" },
  { id: 22, name: "Vegan Burger", category: "pizza-sandwiches", ingredients: "Secret sauce, lettuce, tomato, pickle, sweet potato fries", allergens: ["Gluten", "Check sauce"], dietary: ["Plant-based"], pairing: "Craft beer" },
  { id: 23, name: "Reuben Ciabatta", category: "pizza-sandwiches", ingredients: "Slow-roasted asado, shifka aioli, lettuce, tomato, pickle, fries", allergens: ["Gluten", "Egg"], dietary: [], pairing: "House red" },
  { id: 24, name: "Dirty Burger", category: "pizza-sandwiches", ingredients: "Mustard mayo, lettuce, tomato, pickle, fries", allergens: ["Gluten", "Egg", "Mustard"], dietary: [], pairing: "Cold beer" },
  { id: 25, name: "Pizza Margherita", category: "pizza-sandwiches", ingredients: "Tomato, mozzarella, basil", allergens: ["Gluten", "Dairy"], dietary: ["Vegetarian"], pairing: "Chianti" },
  { id: 26, name: "Pizza Quattro Formaggi", category: "pizza-sandwiches", ingredients: "Four cheeses, mushroom", allergens: ["Gluten", "Dairy"], dietary: ["Vegetarian"], pairing: "Medium red" }
];

export const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'smalls', label: 'Smalls' },
  { key: 'starters', label: 'Starters' },
  { key: 'salads', label: 'Salads' },
  { key: 'mains', label: 'Mains' },
  { key: 'pizza-sandwiches', label: 'Pizza & Sandwiches' },
] as const;
