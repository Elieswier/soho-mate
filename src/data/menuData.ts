export type MenuItem = {
  id: number;
  name: string;
  category: 'smalls' | 'starters' | 'salads' | 'mains' | 'pizza-sandwiches';
  ingredients: string;
  allergens: string[];
  dietary: string[];
  pairing: string;
  imageUrl: string;
};

export const MENU_ITEMS: MenuItem[] = [
  { id: 1, name: "Shrimp", category: "smalls", ingredients: "Garlic, olive oil, white wine, parsley, focaccia", allergens: ["Crustaceans", "Gluten", "Sulphites"], dietary: [], pairing: "House white wine" , imageUrl: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600" },
  { id: 2, name: "Confit Vegetables", category: "smalls", ingredients: "Labneh, eggplant, zucchini, onion, artichoke, garlic, tomato, bell pepper", allergens: ["Dairy"], dietary: ["Vegetarian"], pairing: "Light rosé" , imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600" },
  { id: 3, name: "CLTA Chicken Wraps", category: "smalls", ingredients: "Cherry tomato, avocado, dill dressing", allergens: ["Check eggs in dressing"], dietary: [], pairing: "Light lager" , imageUrl: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600" },
  { id: 4, name: "Edamame & Jalapeño Dip", category: "smalls", ingredients: "Edamame, jalapeño, crudités", allergens: ["Soya", "Check sesame"], dietary: ["Plant-based"], pairing: "Cocktail opener" , imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600" },
  { id: 5, name: "Lamb Kebab", category: "starters", ingredients: "Mujadra, bulgur, tatbileh, spinach", allergens: ["Gluten", "Sesame"], dietary: [], pairing: "Full red wine" , imageUrl: "https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=600" },
  { id: 6, name: "Sea Bass Ceviche", category: "starters", ingredients: "Avocado, lemon, coriander, green onion, spicy pepper", allergens: ["Fish"], dietary: [], pairing: "Sauvignon Blanc" , imageUrl: "https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=600" },
  { id: 7, name: "Burnt Eggplant", category: "starters", ingredients: "Tomato salsa, herbs, roasted chickpeas, focaccia", allergens: ["Gluten", "Check sesame"], dietary: ["Plant-based"], pairing: "Natural wine" , imageUrl: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=600" },
  { id: 8, name: "Fish Kebab", category: "starters", ingredients: "Yoghurt, mashweya, tatbileh", allergens: ["Fish", "Dairy", "Sesame"], dietary: [], pairing: "Chilled white" , imageUrl: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=600" },
  { id: 9, name: "Mozzarella", category: "starters", ingredients: "Cherry tomato, basil", allergens: ["Dairy"], dietary: ["Vegetarian"], pairing: "Prosecco" , imageUrl: "https://images.unsplash.com/photo-1551183053-bf91798d792a?w=600" },
  { id: 10, name: "Caesar Salad", category: "salads", ingredients: "Romaine, anchovy dressing, crouton, parmesan", allergens: ["Fish", "Gluten", "Dairy"], dietary: [], pairing: "Chardonnay" , imageUrl: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600" },
  { id: 11, name: "Summer Salad", category: "salads", ingredients: "Lettuce, kohlrabi, carrot, beetroot, cucumber, crispy quinoa, balsamic vinaigrette", allergens: ["Check sulphites"], dietary: ["Plant-based"], pairing: "Rosé" , imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600" },
  { id: 12, name: "Med Salmon Salad", category: "salads", ingredients: "Lettuce, artichoke, potato, tomato, egg, olive, caperberry", allergens: ["Fish", "Egg"], dietary: [], pairing: "Dry white" , imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600" },
  { id: 13, name: "Fattoush", category: "salads", ingredients: "Tomato, olives, cucumber, radish, onion, crispy feta", allergens: ["Dairy"], dietary: ["Vegetarian"], pairing: "Dry rosé" , imageUrl: "https://images.unsplash.com/photo-1529565214545-7b0b1d8d1c0b?w=600" },
  { id: 14, name: "Beef Fillet", category: "mains", ingredients: "Béarnaise, fries", allergens: ["Egg", "Dairy"], dietary: [], pairing: "Cabernet Sauvignon" , imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?w=600" },
  { id: 15, name: "Brick Chicken", category: "mains", ingredients: "Grape, tomato, spicy yoghurt, thai basil", allergens: ["Dairy"], dietary: [], pairing: "Pinot Noir" , imageUrl: "https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=600" },
  { id: 16, name: "Lasagnette", category: "mains", ingredients: "Semi-dried tomato, zucchini, spinach, olives, parsley, garlic, olive oil, white wine", allergens: ["Gluten", "Sulphites"], dietary: ["Vegetarian"], pairing: "Sangiovese" , imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600" },
  { id: 17, name: "Salmon", category: "mains", ingredients: "Wild rice, red wine, butter, asparagus, green onion, celery", allergens: ["Fish", "Dairy", "Sulphites"], dietary: [], pairing: "White Burgundy" , imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600" },
  { id: 18, name: "Sea Bream", category: "mains", ingredients: "Fennel ragu, tomato, zucchini, artichoke", allergens: ["Fish"], dietary: [], pairing: "Vermentino" , imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600" },
  { id: 19, name: "Lamb Asado", category: "mains", ingredients: "Mujadra, bulgur, confit vegetables", allergens: ["Gluten", "Check sesame"], dietary: [], pairing: "Syrah" , imageUrl: "https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=600" },
  { id: 20, name: "Pumpkin & Tofu Curry", category: "mains", ingredients: "Pumpkin, tofu, steamed rice", allergens: ["Soya"], dietary: ["Plant-based"], pairing: "Riesling" , imageUrl: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600" },
  { id: 21, name: "Avocado on Toast", category: "pizza-sandwiches", ingredients: "Chilli, sourdough, poached egg", allergens: ["Gluten", "Egg"], dietary: ["Vegetarian"], pairing: "Fresh juice" , imageUrl: "https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=600" },
  { id: 22, name: "Vegan Burger", category: "pizza-sandwiches", ingredients: "Secret sauce, lettuce, tomato, pickle, sweet potato fries", allergens: ["Gluten", "Check sauce"], dietary: ["Plant-based"], pairing: "Craft beer" , imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600" },
  { id: 23, name: "Reuben Ciabatta", category: "pizza-sandwiches", ingredients: "Slow-roasted asado, shifka aioli, lettuce, tomato, pickle, fries", allergens: ["Gluten", "Egg"], dietary: [], pairing: "House red" , imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600" },
  { id: 24, name: "Dirty Burger", category: "pizza-sandwiches", ingredients: "Mustard mayo, lettuce, tomato, pickle, fries", allergens: ["Gluten", "Egg", "Mustard"], dietary: [], pairing: "Cold beer" , imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600" },
  { id: 25, name: "Pizza Margherita", category: "pizza-sandwiches", ingredients: "Tomato, mozzarella, basil", allergens: ["Gluten", "Dairy"], dietary: ["Vegetarian"], pairing: "Chianti" , imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600" },
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
