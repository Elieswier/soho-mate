export type STR = { en: string; fr: string; he: string };

export type MenuItem = {
  id: number;
  name: string;
  category: 'smalls' | 'starters' | 'salads' | 'mains' | 'sides' | 'pizza-sandwiches' | 'soho-story' | 'soho-tlv' | 'waiter';
  ingredients: string;
  allergens: string[];
  dietary: string[];
  pairing: string;
  imageUrl?: string;
  str?: STR;
};

export const MENU_ITEMS: MenuItem[] = [
  { id: 1, name: "Shrimp", category: "smalls", ingredients: "Garlic, olive oil, white wine, parsley, focaccia", allergens: ["Crustaceans", "Gluten", "Sulphites"], dietary: [], pairing: "House white wine", imageUrl: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600",
    str: {
      en: "Plump shrimp sautéed in garlic, white wine and olive oil, served with warm focaccia for the sauce.",
      fr: "Crevettes sautées à l'ail, au vin blanc et à l'huile d'olive, servies avec une focaccia tiède pour la sauce.",
      he: "שרימפס בשום, יין לבן ושמן זית, עם פוקאצ'ה חמה לטבול ברוטב.",
    } },
  { id: 2, name: "Confit Vegetables", category: "smalls", ingredients: "Labneh, eggplant, zucchini, onion, artichoke, garlic, tomato, bell pepper", allergens: ["Dairy"], dietary: ["Vegetarian"], pairing: "Light rosé", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600",
    str: {
      en: "Slow-cooked Mediterranean vegetables over creamy labneh — soft, smoky and deeply seasoned.",
      fr: "Légumes méditerranéens confits sur un lit de labneh crémeux — fondants, légèrement fumés et bien parfumés.",
      he: "ירקות ים-תיכוניים מבושלים לאט על לבנה קרמית — רכים, מעושנים, מתובלים יפה.",
    } },
  { id: 3, name: "CLTA Chicken Wraps", category: "smalls", ingredients: "Cherry tomato, avocado, dill dressing", allergens: ["Check eggs in dressing"], dietary: [], pairing: "Light lager", imageUrl: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600",
    str: {
      en: "Chicken, lettuce, tomato and avocado wrapped fresh with a bright dill dressing.",
      fr: "Poulet, laitue, tomate et avocat enroulés frais, relevés d'une vinaigrette à l'aneth.",
      he: "ראפ של עוף, חסה, עגבנייה ואבוקדו עם רוטב שמיר רענן.",
    } },
  { id: 4, name: "Edamame & Jalapeño Dip", category: "smalls", ingredients: "Edamame, jalapeño, crudités", allergens: ["Soya", "Check sesame"], dietary: ["Plant-based"], pairing: "Cocktail opener", imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600",
    str: {
      en: "Bright edamame dip with a jalapeño kick, served with crisp seasonal crudités.",
      fr: "Dip d'edamame relevé au jalapeño, accompagné de crudités de saison croquantes.",
      he: "ממרח אדממה עם נגיעה חריפה של חלפיניו, עם ירקות חתוכים פריכים.",
    } },
  { id: 5, name: "Lamb Kebab", category: "starters", ingredients: "Mujadra, bulgur, tatbileh, spinach", allergens: ["Gluten", "Sesame"], dietary: [], pairing: "Full red wine", imageUrl: "https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=600",
    str: {
      en: "Spiced lamb kebab over mujadra and bulgur with fresh tatbileh and wilted spinach.",
      fr: "Brochette d'agneau épicée sur mujadra et boulgour, tatbileh frais et épinards fondants.",
      he: "קבב כבש מתובל על מג'דרה ובורגול, עם תבולה טרייה ותרד.",
    } },
  { id: 6, name: "Sea Bass Ceviche", category: "starters", ingredients: "Avocado, lemon, coriander, green onion, spicy pepper", allergens: ["Fish"], dietary: [], pairing: "Sauvignon Blanc", imageUrl: "https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=600",
    str: {
      en: "Fresh sea bass cured in lemon with avocado, coriander and a gentle chilli lift.",
      fr: "Bar mariné au citron, avocat, coriandre et une touche de piment doux.",
      he: "סביצ'ה לברק טרי בלימון, אבוקדו, כוסברה ונגיעה של חריף.",
    } },
  { id: 7, name: "Burnt Eggplant", category: "starters", ingredients: "Tomato salsa, herbs, roasted chickpeas, focaccia", allergens: ["Gluten", "Check sesame"], dietary: ["Plant-based"], pairing: "Natural wine", imageUrl: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=600",
    str: {
      en: "Smoky charred eggplant with bright tomato salsa, herbs and crunchy roasted chickpeas.",
      fr: "Aubergine grillée fumée, salsa de tomates, herbes fraîches et pois chiches rôtis croustillants.",
      he: "חציל שרוף ומעושן עם סלסת עגבניות, עשבי תיבול וחומוס קלוי פריך.",
    } },
  { id: 8, name: "Fish Kebab", category: "starters", ingredients: "Yoghurt, mashweya, tatbileh", allergens: ["Fish", "Dairy", "Sesame"], dietary: [], pairing: "Chilled white", imageUrl: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=600",
    str: {
      en: "Delicate fish kebab with cool yoghurt, smoky mashweya and herby tatbileh.",
      fr: "Brochette de poisson délicate, yaourt frais, mashweya fumée et tatbileh aux herbes.",
      he: "קבב דג עדין עם יוגורט קר, משוויה מעושנת ותבולה.",
    } },
  { id: 9, name: "Mozzarella", category: "starters", ingredients: "Cherry tomato, basil", allergens: ["Dairy"], dietary: ["Vegetarian"], pairing: "Prosecco", imageUrl: "https://images.unsplash.com/photo-1551183053-bf91798d792a?w=600",
    str: {
      en: "Creamy mozzarella with sweet cherry tomatoes and fresh basil — simple done right.",
      fr: "Mozzarella crémeuse, tomates cerises sucrées et basilic frais — la simplicité bien faite.",
      he: "מוצרלה קרמית עם עגבניות שרי מתוקות ובזיליקום — פשוט וטעים.",
    } },
  { id: 10, name: "Caesar Salad", category: "salads", ingredients: "Romaine, anchovy dressing, crouton, parmesan", allergens: ["Fish", "Gluten", "Dairy"], dietary: [], pairing: "Chardonnay", imageUrl: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600",
    str: {
      en: "Crisp romaine in our anchovy Caesar dressing with golden croutons and parmesan.",
      fr: "Laitue romaine croquante, sauce César aux anchois, croûtons dorés et parmesan.",
      he: "חסה רומית פריכה ברוטב קיסר עם אנשובי, קרוטונים זהובים ופרמזן.",
    } },
  { id: 11, name: "Summer Salad", category: "salads", ingredients: "Lettuce, kohlrabi, carrot, beetroot, cucumber, crispy quinoa, balsamic vinaigrette", allergens: ["Check sulphites"], dietary: ["Plant-based"], pairing: "Rosé", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600",
    str: {
      en: "Crunchy seasonal vegetables with crispy quinoa and a light balsamic vinaigrette.",
      fr: "Légumes de saison croquants, quinoa croustillant et vinaigrette balsamique légère.",
      he: "ירקות עונתיים פריכים, קינואה קראנצ'ית וויניגרט בלסמי קליל.",
    } },
  { id: 12, name: "Med Salmon Salad", category: "salads", ingredients: "Lettuce, artichoke, potato, tomato, egg, olive, caperberry", allergens: ["Fish", "Egg"], dietary: [], pairing: "Dry white", imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600",
    str: {
      en: "Salmon Niçoise-style with artichoke, potato, egg and caperberries — a full plate.",
      fr: "Salade de saumon façon niçoise — artichaut, pomme de terre, œuf et câprons.",
      he: "סלט סלמון בסגנון ניסואז — ארטישוק, תפוחי אדמה, ביצה וקייפר. צלחת מלאה.",
    } },
  { id: 13, name: "Fattoush", category: "salads", ingredients: "Tomato, olives, cucumber, radish, onion, crispy feta", allergens: ["Dairy"], dietary: ["Vegetarian"], pairing: "Dry rosé", imageUrl: "https://images.unsplash.com/photo-1529565214545-7b0b1d8d1c0b?w=600",
    str: {
      en: "Levantine chopped salad with crispy feta — bright, crunchy and refreshing.",
      fr: "Salade levantine hachée avec feta croustillante — fraîche, croquante et désaltérante.",
      he: "פתוש עם פטה פריכה — חתוך דק, מרענן וקראנצ'י.",
    } },
  { id: 14, name: "Beef Fillet", category: "mains", ingredients: "Béarnaise, fries", allergens: ["Egg", "Dairy"], dietary: [], pairing: "Cabernet Sauvignon", imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?w=600",
    str: {
      en: "Tender beef fillet with classic béarnaise and golden fries — the steakhouse classic.",
      fr: "Filet de bœuf tendre, sauce béarnaise classique et frites dorées — le grand classique.",
      he: "פילה בקר רך עם רוטב ברנייז קלאסי וצ'יפס זהוב. קלאסיקה.",
    } },
  { id: 15, name: "Brick Chicken", category: "mains", ingredients: "Grape, tomato, spicy yoghurt, thai basil", allergens: ["Dairy"], dietary: [], pairing: "Pinot Noir", imageUrl: "https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=600",
    str: {
      en: "Crispy-skinned chicken pressed under a brick, with grape, tomato and spicy yoghurt.",
      fr: "Poulet à la peau croustillante pressé sous brique, raisin, tomate et yaourt épicé.",
      he: "עוף עם עור פריך תחת לבנה, עם ענבים, עגבנייה ויוגורט חריף.",
    } },
  { id: 16, name: "Lasagnette", category: "mains", ingredients: "Semi-dried tomato, zucchini, spinach, olives, parsley, garlic, olive oil, white wine", allergens: ["Gluten", "Sulphites"], dietary: ["Vegetarian"], pairing: "Sangiovese", imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600",
    str: {
      en: "Ribbons of pasta with semi-dried tomato, zucchini and olives in a garlic white-wine sauce.",
      fr: "Rubans de pâtes, tomates mi-séchées, courgettes et olives dans une sauce ail et vin blanc.",
      he: "פסטה רחבה עם עגבניות מיובשות, קישואים וזיתים ברוטב שום ויין לבן.",
    } },
  { id: 17, name: "Salmon", category: "mains", ingredients: "Wild rice, red wine, butter, asparagus, green onion, celery", allergens: ["Fish", "Dairy", "Sulphites"], dietary: [], pairing: "White Burgundy", imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600",
    str: {
      en: "Pan-seared salmon on wild rice with asparagus and a red-wine butter sauce.",
      fr: "Saumon poêlé sur riz sauvage, asperges et sauce au beurre et vin rouge.",
      he: "סלמון צרוב על אורז בר עם אספרגוס ורוטב חמאה ויין אדום.",
    } },
  { id: 18, name: "Sea Bream", category: "mains", ingredients: "Fennel ragu, tomato, zucchini, artichoke", allergens: ["Fish"], dietary: [], pairing: "Vermentino", imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600",
    str: {
      en: "Whole sea bream over fennel ragu with tomato, zucchini and artichoke — light and aromatic.",
      fr: "Daurade sur ragoût de fenouil, tomate, courgette et artichaut — léger et parfumé.",
      he: "דניס על רגו שומר עם עגבנייה, קישוא וארטישוק. קליל וארומטי.",
    } },
  { id: 19, name: "Lamb Asado", category: "mains", ingredients: "Mujadra, bulgur, confit vegetables", allergens: ["Gluten", "Check sesame"], dietary: [], pairing: "Syrah", imageUrl: "https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=600",
    str: {
      en: "Slow-roasted lamb that pulls apart, with mujadra, bulgur and confit vegetables.",
      fr: "Agneau rôti lentement et fondant, mujadra, boulgour et légumes confits.",
      he: "כבש שצלוי לאט עד שהוא נמס, עם מג'דרה, בורגול וירקות קונפי.",
    } },
  { id: 20, name: "Pumpkin & Tofu Curry", category: "mains", ingredients: "Pumpkin, tofu, steamed rice", allergens: ["Soya"], dietary: ["Plant-based"], pairing: "Riesling", imageUrl: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600",
    str: {
      en: "Warming pumpkin and tofu curry with steamed rice — fragrant and fully plant-based.",
      fr: "Curry réconfortant de potiron et tofu, riz vapeur — parfumé et entièrement végétal.",
      he: "קארי דלעת וטופו מחמם עם אורז מאודה — ארומטי ולגמרי טבעוני.",
    } },
  { id: 21, name: "Avocado on Toast", category: "pizza-sandwiches", ingredients: "Chilli, sourdough, poached egg", allergens: ["Gluten", "Egg"], dietary: ["Vegetarian"], pairing: "Fresh juice", imageUrl: "https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=600",
    str: {
      en: "Smashed avocado on sourdough with chilli and a soft poached egg on top.",
      fr: "Avocat écrasé sur pain au levain, piment et œuf poché coulant.",
      he: "אבוקדו על לחם מחמצת עם צ'ילי וביצה עלומה רכה למעלה.",
    } },
  { id: 22, name: "Vegan Burger", category: "pizza-sandwiches", ingredients: "Secret sauce, lettuce, tomato, pickle, sweet potato fries", allergens: ["Gluten", "Check sauce"], dietary: ["Plant-based"], pairing: "Craft beer", imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
    str: {
      en: "Plant-based burger with our secret sauce, classic fixings and sweet potato fries.",
      fr: "Burger végétal, notre sauce secrète, garniture classique et frites de patate douce.",
      he: "המבורגר טבעוני עם הרוטב הסודי שלנו, תוספות קלאסיות וצ'יפס בטטה.",
    } },
  { id: 23, name: "Reuben Ciabatta", category: "pizza-sandwiches", ingredients: "Slow-roasted asado, shifka aioli, lettuce, tomato, pickle, fries", allergens: ["Gluten", "Egg"], dietary: [], pairing: "House red", imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600",
    str: {
      en: "Slow-roasted asado in ciabatta with shifka aioli, lettuce, tomato and pickle.",
      fr: "Asado rôti lentement en ciabatta, aïoli au shifka, laitue, tomate et cornichon.",
      he: "אסאדו צלוי לאט בצ'יאבטה, עם איולי שיפקה, חסה, עגבנייה וחמוץ.",
    } },
  { id: 24, name: "Dirty Burger", category: "pizza-sandwiches", ingredients: "Mustard mayo, lettuce, tomato, pickle, fries", allergens: ["Gluten", "Egg", "Mustard"], dietary: [], pairing: "Cold beer", imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
    str: {
      en: "Our signature beef burger with mustard mayo, classic fixings and a side of fries.",
      fr: "Notre burger signature, mayo moutarde, garniture classique et frites maison.",
      he: "ההמבורגר החתום שלנו עם מיונז חרדל, תוספות קלאסיות וצ'יפס בצד.",
    } },
  { id: 25, name: "Pizza Margherita", category: "pizza-sandwiches", ingredients: "Tomato, mozzarella, basil", allergens: ["Gluten", "Dairy"], dietary: ["Vegetarian"], pairing: "Chianti", imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600",
    str: {
      en: "Classic Margherita — San Marzano tomato, mozzarella and fresh basil on a thin crust.",
      fr: "Margherita classique — tomate San Marzano, mozzarella et basilic frais sur pâte fine.",
      he: "מרגריטה קלאסית — עגבניית סן מרצאנו, מוצרלה ובזיליקום טרי על בצק דק.",
    } },
  { id: 26, name: "Pizza Quattro Formaggi", category: "pizza-sandwiches", ingredients: "Four cheeses, mushroom", allergens: ["Gluten", "Dairy"], dietary: ["Vegetarian"], pairing: "Medium red", imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600",
    str: {
      en: "Four-cheese pizza with mushroom — rich, savoury and seriously indulgent.",
      fr: "Pizza aux quatre fromages et champignons — riche, savoureuse et gourmande.",
      he: "פיצה ארבע גבינות עם פטריות — עשירה, מלוחה ופשוט מפנקת.",
    } },
  { id: 27, name: "Green Salad", category: "sides", ingredients: "Mixed greens", allergens: [], dietary: ["Plant-based"], pairing: "Anything",
    str: {
      en: "Simple, fresh mixed greens — light and clean.",
      fr: "Une salade verte simple et fraîche — légère et nette.",
      he: "סלט ירוק פשוט וטרי. קליל.",
    } },
  { id: 28, name: "Sweet Potato Fries", category: "sides", ingredients: "Sweet potato", allergens: ["Check fryer cross-contamination"], dietary: ["Plant-based"], pairing: "Burgers, mains",
    str: {
      en: "Crispy sweet potato fries — naturally sweet, perfectly salted.",
      fr: "Frites de patate douce croustillantes — douces et salées à la perfection.",
      he: "צ'יפס בטטה פריך. מתוק-מלוח, ממכר.",
    } },
  { id: 29, name: "Fries", category: "sides", ingredients: "Potato", allergens: ["Check fryer cross-contamination"], dietary: ["Plant-based"], pairing: "Burgers, mains",
    str: {
      en: "Classic fries — crispy outside, fluffy inside.",
      fr: "Frites classiques — croustillantes dehors, moelleuses dedans.",
      he: "צ'יפס קלאסי. פשוט עובד.",
    } },
  { id: 30, name: "Tomato & Onion Salad", category: "sides", ingredients: "Tomato, onion", allergens: [], dietary: ["Plant-based"], pairing: "Any main",
    str: {
      en: "Fresh tomato and onion — simple, honest, Mediterranean.",
      fr: "Tomate et oignon frais — simple, honnête, méditerranéen.",
      he: "סלט עגבניות ובצל. ישראלי בנשמה.",
    } },
  { id: 31, name: "Focaccia", category: "sides", ingredients: "Bread, olive oil", allergens: ["Gluten"], dietary: ["Plant-based"], pairing: "Starters, dips",
    str: {
      en: "Warm, olive-oil-rich focaccia — perfect for sharing.",
      fr: "Focaccia tiède et généreuse en huile d'olive — idéale à partager.",
      he: "פוקאצ'ה חמה עם שמן זית. מושלמת לשיתוף.",
    } },
];

export const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'smalls', label: 'Smalls' },
  { key: 'starters', label: 'Starters' },
  { key: 'salads', label: 'Salads' },
  { key: 'mains', label: 'Mains' },
  { key: 'sides', label: 'Sides' },
  { key: 'pizza-sandwiches', label: 'Pizza & Sandwiches' },
] as const;
