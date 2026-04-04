// MESS ORACLE — Full Menu Data
// Extracted from: VEGNONVEG SPECIAL COMMON MENU EFFECTIVE FROM 2nd APRIL 2026

// Tamil/regional food glossary for hover tooltips
const FOOD_GLOSSARY = {
  "kuzhambu": "thick tamarind-based curry, usually spicy",
  "kara kuzhambu": "spicy tamarind curry with veggies or lentils",
  "vathakuzhambu": "tangy sun-dried berry tamarind curry — acquired taste, very spicy",
  "milagu rasam": "thin black pepper soup, great for digestion",
  "pineapple rasam": "sweet-tangy thin soup with pineapple",
  "mysore rasam": "aromatic rasam with coconut and spices",
  "tomato rasam": "light, tangy tomato-based soup",
  "moong dal rasam": "thin lentil-based soup with moong",
  "paruppu rasam": "thin lentil soup, everyday comfort",
  "arachuvitta sambar": "freshly ground coconut sambar, richer than normal",
  "poriyal": "dry stir-fried vegetable side dish",
  "keerai porial": "stir-fried leafy greens (spinach/amaranth)",
  "raw banana poriyal": "stir-fried raw plantain, mildly spiced",
  "carrot & beans poriyal": "dry stir-fried carrot and french beans",
  "dry cabbage porial": "stir-fried cabbage with mustard and curry leaves",
  "broad beans poriyal": "stir-fried broad beans with coconut",
  "mixed vegetable porial": "assorted veggie stir-fry",
  "paruppu podi": "spiced lentil powder, mix with ghee and rice",
  "thovayal": "thick chutney made from roasted lentils/coconut",
  "thuvaiyal pickle": "thick chutney-style condiment",
  "podi oil": "spiced lentil powder with gingelly oil",
  "gingelly oil": "sesame oil — nutty, traditional Tamil flavour",
  "fryams": "fried papad strips — crunchy snack, empty calories basically",
  "udap": "urad dal based condiment",
  "bisibelabath": "Karnataka one-pot rice+dal+veggie dish, spiced",
  "vadacurry": "spiced lentil patty curry, goes great with idli",
  "pav vaji": "pav bhaji — buttery spiced veggie mash with buns",
  "rawa khichdi": "semolina porridge, savoury breakfast",
  "semiya khidi": "vermicelli upma — thin noodle breakfast porridge",
  "andhra noonn": "Andhra-style naan/bread, usually very spicy",
  "chettinad": "fiery spice blend from Chettinad region — heavy pepper",
  "kadhi pakoda curry": "yoghurt-based gravy with fried fritters",
  "millet buttermilk": "buttermilk with millet flour — probiotic, filling",
  "badam milk": "almond milk sweetened with saffron/cardamom",
  "poha": "flattened rice, light breakfast staple",
  "bhajiya": "deep-fried snack fritters",
  "idli": "steamed rice-lentil cakes — ~70 kcal each, very clean",
  "phulka": "thin unleavened wheat flatbread, lighter than chapati",
  "jeera dal": "cumin-tempered lentil soup",
  "chenna masala": "white chickpea curry",
  "white chana masala": "spiced white chickpea curry",
};

const MENU = {
  monday: {
    breakfast: [
      { name: "Vegetable Vermicelli Upma", serving: "1 plate (~200g)", tags: ["veg", "light"], protein: 6, carbs: 35, fat: 5, cal: 210 },
      { name: "Coconut Chutney", serving: "2 tbsp", tags: ["veg", "light"], protein: 1, carbs: 4, fat: 4, cal: 55 },
      { name: "Pongal + Sambar", serving: "1 plate (~250g)", tags: ["veg", "rice"], protein: 7, carbs: 40, fat: 5, cal: 240 },
      { name: "Toasted Bread + Butter + Jam", serving: "2 slices", tags: ["veg", "bread", "light"], protein: 4, carbs: 30, fat: 8, cal: 205 },
      { name: "Tea/Coffee/Milk", serving: "1 cup (200ml)", tags: ["veg", "light"], protein: 2, carbs: 6, fat: 2, cal: 50 },
      { name: "Boiled Egg", serving: "1 egg", tags: ["nonveg", "protein"], protein: 6, carbs: 0, fat: 5, cal: 70 }
    ],
    lunch: [
      { name: "Chapati (2 pcs) + Dal Fry", serving: "2 rotis + 1 katori dal", tags: ["veg", "bread", "protein"], protein: 12, carbs: 55, fat: 6, cal: 325 },
      { name: "White Rice + Milk Kara Kuzhambu", serving: "1 plate rice + 1 ladle kuzhambu", tags: ["veg", "rice"], protein: 6, carbs: 60, fat: 4, cal: 300 },
      { name: "Carrot & Beans Poriyal", serving: "1 katori (~80g)", tags: ["veg", "light"], protein: 2, carbs: 10, fat: 2, cal: 65 },
      { name: "Paruppu Rasam", serving: "1 cup (200ml)", tags: ["veg", "light"], protein: 3, carbs: 8, fat: 1, cal: 55 },
      { name: "Paruppu Podi + Gingelly Oil", serving: "1 tsp podi + ½ tsp oil", tags: ["veg", "light"], protein: 3, carbs: 6, fat: 5, cal: 80 },
      { name: "Thuvaiyal Pickle + Fryums", serving: "1 tsp pickle + 5-6 fryams", tags: ["veg", "light"], protein: 1, carbs: 5, fat: 1, cal: 35 },
      { name: "Watermelon + Curd + Lemon Mint Juice", serving: "1 slice + 1 katori curd + 1 glass juice", tags: ["veg", "light"], protein: 2, carbs: 18, fat: 1, cal: 90 }
    ],
    snacks: [
      { name: "Paneer Sandwich + Sauce", serving: "1 sandwich (2 slices)", tags: ["veg", "bread", "protein"], protein: 14, carbs: 28, fat: 10, cal: 255 },
      { name: "Tea/Coffee/Milk", serving: "1 cup (200ml)", tags: ["veg", "light"], protein: 2, carbs: 6, fat: 2, cal: 50 }
    ],
    dinner: [
      { name: "Phulka + White Chenna Masala + Jeera Dal", serving: "3 phulkas + 1 katori each", tags: ["veg", "bread", "protein"], protein: 16, carbs: 50, fat: 6, cal: 320 },
      { name: "White Rice + Dry Cabbage Porial", serving: "1 plate rice + 1 katori porial", tags: ["veg", "rice"], protein: 4, carbs: 55, fat: 2, cal: 255 },
      { name: "Rasam + Pickle", serving: "1 cup rasam + 1 tsp pickle", tags: ["veg", "light"], protein: 2, carbs: 6, fat: 1, cal: 40 },
      { name: "Ice Cream + Salad + Milk + Curd", serving: "1 scoop + 1 katori salad + 1 cup milk", tags: ["veg", "light"], protein: 5, carbs: 22, fat: 6, cal: 160 }
    ]
  },

  tuesday: {
    breakfast: [
      { name: "Idli + Sambar + Mint Chutney + Podi Oil + Poha + Bhajiya", serving: "3 idlis + accompaniments", tags: ["veg", "light"], protein: 8, carbs: 45, fat: 5, cal: 255 },
      { name: "Chopped Onion + Lemon", serving: "2 tbsp", tags: ["veg", "light"], protein: 1, carbs: 3, fat: 0, cal: 15 },
      { name: "Wheat Bread + Butter + Jam", serving: "2 slices", tags: ["veg", "bread"], protein: 4, carbs: 30, fat: 8, cal: 205 },
      { name: "Tea/Coffee/Milk", serving: "1 cup (200ml)", tags: ["veg", "light"], protein: 2, carbs: 6, fat: 2, cal: 50 },
      { name: "Egg Bhurji", serving: "2 eggs scrambled", tags: ["nonveg", "protein"], protein: 10, carbs: 2, fat: 8, cal: 120 }
    ],
    lunch: [
      { name: "Veg Biryani + Onion Raita", serving: "1 plate biryani (~300g) + 1 katori raita", tags: ["veg", "rice"], protein: 9, carbs: 62, fat: 8, cal: 365 },
      { name: "Methi Dal + Mixed Vegetable Kadhi", serving: "1 katori each", tags: ["veg", "protein"], protein: 10, carbs: 20, fat: 4, cal: 155 },
      { name: "White Rice + Sambar + Udap + Tomato Rasam + Curd", serving: "1 plate rice + 1 ladle each", tags: ["veg", "rice"], protein: 8, carbs: 65, fat: 4, cal: 330 },
      { name: "Paruppu Podi + Ghee + Thovayal + Pickle", serving: "1 tsp podi + ½ tsp ghee + 1 tsp each", tags: ["veg", "light"], protein: 3, carbs: 8, fat: 6, cal: 95 },
      { name: "Papad + Lemon Mint Juice", serving: "1 papad + 1 glass juice", tags: ["veg", "light"], protein: 2, carbs: 10, fat: 2, cal: 65 }
    ],
    snacks: [
      { name: "Masala Peanut / Veg Puff (even weeks)", serving: "1 small cup (~50g) / 1 puff", tags: ["veg", "light"], protein: 5, carbs: 18, fat: 6, cal: 145 },
      { name: "Tea/Coffee/Milk", serving: "1 cup (200ml)", tags: ["veg", "light"], protein: 2, carbs: 6, fat: 2, cal: 50 }
    ],
    dinner: [
      { name: "Masala Dosa + Chutney + Sambar", serving: "1 dosa + 2 tbsp chutney + 1 cup sambar", tags: ["veg", "light"], protein: 7, carbs: 48, fat: 6, cal: 275 },
      { name: "White Rice + Rasam + Pickle", serving: "1 plate rice + 1 cup rasam", tags: ["veg", "rice"], protein: 4, carbs: 52, fat: 2, cal: 245 },
      { name: "Milk", serving: "1 glass (250ml)", tags: ["veg", "protein"], protein: 8, carbs: 12, fat: 5, cal: 125 },
      { name: "Salad (Cucumber + Carrot)", serving: "1 katori (~100g)", tags: ["veg", "light"], protein: 1, carbs: 6, fat: 0, cal: 30 },
      { name: "Butter Milk", serving: "1 glass (200ml)", tags: ["veg", "light"], protein: 3, carbs: 4, fat: 2, cal: 45 }
    ]
  },

  wednesday: {
    breakfast: [
      { name: "Puri + Aloo Masala", serving: "3 puris + 1 katori masala", tags: ["veg", "bread"], protein: 6, carbs: 45, fat: 12, cal: 310 },
      { name: "Rawa Khichdi + Chutney", serving: "1 plate (~200g)", tags: ["veg", "light"], protein: 5, carbs: 38, fat: 4, cal: 210 },
      { name: "Bread + Butter + Jam", serving: "2 slices", tags: ["veg", "bread"], protein: 4, carbs: 30, fat: 8, cal: 205 },
      { name: "Tea/Coffee/Milk", serving: "1 cup (200ml)", tags: ["veg", "light"], protein: 2, carbs: 6, fat: 2, cal: 50 },
      { name: "Boiled Egg", serving: "1 egg", tags: ["nonveg", "protein"], protein: 6, carbs: 0, fat: 5, cal: 70 }
    ],
    lunch: [
      { name: "Palak Paneer", serving: "1 katori (~150g)", tags: ["veg", "protein"], protein: 12, carbs: 10, fat: 10, cal: 175, exclusiveGroup: "wed-lunch-main" },
      { name: "Chicken Handi Masala", serving: "1 katori (~150g)", tags: ["nonveg", "protein"], protein: 22, carbs: 8, fat: 12, cal: 225, exclusiveGroup: "wed-lunch-main" },
      { name: "Chapati (2 pcs)", serving: "2 rotis", tags: ["veg", "bread"], protein: 6, carbs: 30, fat: 2, cal: 162 },
      { name: "White Rice + Arachuvitta Sambar + Broad Beans Poriyal + Milagu Rasam", serving: "1 plate rice + ladles of each", tags: ["veg", "rice"], protein: 9, carbs: 68, fat: 4, cal: 345 },
      { name: "Paruppu Podi + Ghee + Thovayal + Pickle", serving: "1 tsp podi + ½ tsp ghee + 1 tsp each", tags: ["veg", "light"], protein: 3, carbs: 8, fat: 6, cal: 95 },
      { name: "Mixed Fruit + Butter Milk + Lemon Mint Juice", serving: "1 cup fruit + 1 glass each", tags: ["veg", "light"], protein: 3, carbs: 22, fat: 2, cal: 120 }
    ],
    snacks: [
      { name: "Pasta (red/white)", serving: "1 bowl (~200g)", tags: ["veg", "light"], protein: 6, carbs: 32, fat: 5, cal: 200 },
      { name: "Tea/Coffee/Milk", serving: "1 cup (200ml)", tags: ["veg", "light"], protein: 2, carbs: 6, fat: 2, cal: 50 }
    ],
    dinner: [
      { name: "White Chana Masala + Vegetable Biryani", serving: "1 katori chana + 1 plate biryani", tags: ["veg", "protein", "rice"], protein: 14, carbs: 62, fat: 7, cal: 370 },
      { name: "Idly + Sambar + Chutney", serving: "3 idlis + 1 cup sambar", tags: ["veg", "light"], protein: 6, carbs: 38, fat: 3, cal: 205 },
      { name: "Chettinaadu Egg Masala", serving: "2 eggs in gravy", tags: ["nonveg", "protein"], protein: 12, carbs: 8, fat: 10, cal: 170 },
      { name: "Rasam + Curd + Sweet", serving: "1 cup rasam + 1 katori curd", tags: ["veg", "light"], protein: 3, carbs: 16, fat: 2, cal: 95 },
      { name: "Salad (Beetroot + Carrot + Cucumber) + Strawberry Milk", serving: "1 katori salad + 1 glass milk", tags: ["veg", "light"], protein: 4, carbs: 20, fat: 3, cal: 125 }
    ]
  },

  thursday: {
    breakfast: [
      { name: "Idli + Vadacurry + Ground Nut Chutney", serving: "3 idlis + 1 katori vadacurry", tags: ["veg", "light"], protein: 9, carbs: 42, fat: 6, cal: 255 },
      { name: "Pav Vaji + Chopped Onion", serving: "2 pav + 1 katori bhaji", tags: ["veg", "bread"], protein: 7, carbs: 40, fat: 8, cal: 258 },
      { name: "Bread + Butter + Jam", serving: "2 slices", tags: ["veg", "bread"], protein: 4, carbs: 30, fat: 8, cal: 205 },
      { name: "Tea/Coffee/Milk", serving: "1 cup (200ml)", tags: ["veg", "light"], protein: 2, carbs: 6, fat: 2, cal: 50 },
      { name: "Boiled Egg", serving: "1 egg", tags: ["nonveg", "protein"], protein: 6, carbs: 0, fat: 5, cal: 70 }
    ],
    lunch: [
      { name: "Bisibelabath + Potato Chips", serving: "1 plate (~300g) + chips", tags: ["veg", "rice"], protein: 10, carbs: 65, fat: 8, cal: 375 },
      { name: "White Rice + Dal Fry + Raw Banana Poriyal + Pineapple Rasam + Curd", serving: "1 plate rice + ladles of each", tags: ["veg", "rice"], protein: 8, carbs: 70, fat: 4, cal: 350 },
      { name: "Paruppu Podi + Gingelly Oil", serving: "1 tsp podi + ½ tsp oil", tags: ["veg", "light"], protein: 3, carbs: 6, fat: 5, cal: 80 },
      { name: "Thovayal + Pickle + Lemon Mint Juice", serving: "1 tsp each + 1 glass juice", tags: ["veg", "light"], protein: 1, carbs: 7, fat: 1, cal: 45 },
      { name: "Fruit Salad (Black Grapes + Pineapple)", serving: "1 katori (~150g)", tags: ["veg", "light"], protein: 1, carbs: 18, fat: 0, cal: 75 }
    ],
    snacks: [
      { name: "Masala Sweet Corn", serving: "1 cup (~100g)", tags: ["veg", "light"], protein: 4, carbs: 22, fat: 2, cal: 120 },
      { name: "Tea/Coffee/Milk", serving: "1 cup (200ml)", tags: ["veg", "light"], protein: 2, carbs: 6, fat: 2, cal: 50 }
    ],
    dinner: [
      { name: "Soya Chunk Gravy + Phulka", serving: "1 katori gravy + 3 phulkas", tags: ["veg", "protein", "bread"], protein: 18, carbs: 45, fat: 6, cal: 310 },
      { name: "White Rice + Dal Fry + Sambar + Mixed Vegetable Porial + Rasam + Pickle", serving: "1 plate rice + ladles of each", tags: ["veg", "rice"], protein: 10, carbs: 72, fat: 5, cal: 375 },
      { name: "Salad (Cucumber + Carrot)", serving: "1 katori (~100g)", tags: ["veg", "light"], protein: 1, carbs: 6, fat: 0, cal: 30 },
      { name: "Milk + Buttermilk", serving: "1 glass milk (250ml) + 1 glass buttermilk", tags: ["veg", "protein"], protein: 10, carbs: 14, fat: 5, cal: 145 },
      { name: "Cold Badam Milk (veg only)", serving: "1 glass (200ml)", tags: ["veg", "protein"], protein: 5, carbs: 18, fat: 4, cal: 130 }
    ]
  },

  friday: {
    breakfast: [
      { name: "Dosa + Sambar + Tomato Chutney", serving: "1 dosa + 1 cup sambar", tags: ["veg", "light"], protein: 7, carbs: 40, fat: 5, cal: 230 },
      { name: "Semiya Khidi", serving: "1 plate (~200g)", tags: ["veg", "light"], protein: 5, carbs: 38, fat: 4, cal: 210 },
      { name: "Podi Oil", serving: "1 tsp podi + ½ tsp oil", tags: ["veg", "light"], protein: 2, carbs: 3, fat: 5, cal: 65 },
      { name: "Wheat Bread + Butter + Jam", serving: "2 slices", tags: ["veg", "bread"], protein: 4, carbs: 30, fat: 8, cal: 205 },
      { name: "Tea/Coffee/Milk", serving: "1 cup (200ml)", tags: ["veg", "light"], protein: 2, carbs: 6, fat: 2, cal: 50 },
      { name: "Egg Bhurji", serving: "2 eggs scrambled", tags: ["nonveg", "protein"], protein: 10, carbs: 2, fat: 8, cal: 120 }
    ],
    lunch: [
      { name: "Chapati (2 pcs) + Paneer Tikka Masala", serving: "2 rotis + 1 katori paneer", tags: ["veg", "protein", "bread"], protein: 18, carbs: 42, fat: 12, cal: 350, exclusiveGroup: "fri-lunch-main" },
      { name: "Chicken Chettinad Masala + Andhra Noonn", serving: "1 katori chicken + 1 naan", tags: ["nonveg", "protein"], protein: 25, carbs: 8, fat: 14, cal: 258, exclusiveGroup: "fri-lunch-main" },
      { name: "White Rice + Potato Bhindi Dry + Moong Dal Rasam + Sweet Buttermilk", serving: "1 plate rice + ladles of each", tags: ["veg", "rice"], protein: 8, carbs: 68, fat: 4, cal: 340 },
      { name: "Paruppu Podi + Ghee + Thovayal + Pickle + Banana", serving: "1 tsp podi + 1 banana + condiments", tags: ["veg", "light"], protein: 3, carbs: 18, fat: 5, cal: 130 }
    ],
    snacks: [
      { name: "Butter Biscuit (2 nos)", serving: "2 biscuits", tags: ["veg", "light"], protein: 2, carbs: 14, fat: 5, cal: 110 },
      { name: "Tea/Coffee/Milk", serving: "1 cup (200ml)", tags: ["veg", "light"], protein: 2, carbs: 6, fat: 2, cal: 50 }
    ],
    dinner: [
      { name: "Rajma Curry + Chapati", serving: "1 katori rajma + 2 chapatis", tags: ["veg", "protein", "bread"], protein: 14, carbs: 52, fat: 5, cal: 310 },
      { name: "Dal Tadka", serving: "1 katori (~200g)", tags: ["veg", "protein"], protein: 10, carbs: 22, fat: 4, cal: 165 },
      { name: "White Rice + Carrot Poriyal + Rasam + Curd + Pickle", serving: "1 plate rice + ladles of each", tags: ["veg", "rice"], protein: 6, carbs: 62, fat: 3, cal: 300 },
      { name: "Sweet + Salad + Rose Milkshake (veg only)", serving: "1 sweet + 1 katori salad + 1 glass", tags: ["veg", "light"], protein: 5, carbs: 26, fat: 4, cal: 160 }
    ]
  },

  saturday: {
    breakfast: [
      { name: "Rawa Idly + Rawa Chutney + Sambar", serving: "3 idlis + accompaniments", tags: ["veg", "light"], protein: 8, carbs: 42, fat: 5, cal: 245 },
      { name: "Potato Onion Poha", serving: "1 plate (~200g)", tags: ["veg", "light"], protein: 5, carbs: 35, fat: 5, cal: 205 },
      { name: "Wheat Bread + Butter + Jam", serving: "2 slices", tags: ["veg", "bread"], protein: 4, carbs: 30, fat: 8, cal: 205 },
      { name: "Tea/Coffee/Milk", serving: "1 cup (200ml)", tags: ["veg", "light"], protein: 2, carbs: 6, fat: 2, cal: 50 },
      { name: "Boiled Egg", serving: "1 egg", tags: ["nonveg", "protein"], protein: 6, carbs: 0, fat: 5, cal: 70 }
    ],
    lunch: [
      { name: "Chapati (2 pcs) + Vegetable Kadhai", serving: "2 rotis + 1 katori sabzi", tags: ["veg", "bread"], protein: 9, carbs: 48, fat: 7, cal: 295 },
      { name: "White Rice + Vathakuzhambu + Milagu Rasam + Curd + Keerai Porial", serving: "1 plate rice + ladles of each", tags: ["veg", "rice"], protein: 8, carbs: 68, fat: 4, cal: 340 },
      { name: "Paruppu Podi + Gingelly Oil + Thovayal", serving: "1 tsp podi + ½ tsp oil + 1 tsp thovayal", tags: ["veg", "light"], protein: 3, carbs: 7, fat: 5, cal: 85 },
      { name: "Fryams + Pickle", serving: "5-6 pieces + 1 tsp pickle", tags: ["veg", "light"], protein: 1, carbs: 6, fat: 2, cal: 45 },
      { name: "Papaya + Lemon Mint Juice", serving: "1 cup papaya + 1 glass juice", tags: ["veg", "light"], protein: 1, carbs: 16, fat: 0, cal: 68 }
    ],
    snacks: [
      { name: "Pani Puri", serving: "6 pieces", tags: ["veg", "light"], protein: 3, carbs: 20, fat: 4, cal: 128 },
      { name: "Tea/Coffee/Milk", serving: "1 cup (200ml)", tags: ["veg", "light"], protein: 2, carbs: 6, fat: 2, cal: 50 }
    ],
    dinner: [
      { name: "Phulka + Cabbage Green Peas Masala + Kadai Paneer", serving: "3 phulkas + 1 katori each", tags: ["veg", "protein", "bread"], protein: 17, carbs: 46, fat: 10, cal: 345 },
      { name: "White Rice + Kadhi Pakoda Curry + Rasam + Curd + Sweet", serving: "1 plate rice + 1 katori kadhi", tags: ["veg", "rice"], protein: 9, carbs: 70, fat: 7, cal: 385 },
      { name: "Pickle + Salad + Millet Buttermilk", serving: "1 tsp pickle + 1 katori salad + 1 glass", tags: ["veg", "light"], protein: 2, carbs: 8, fat: 1, cal: 50 }
    ]
  },

  sunday: {
    breakfast: [
      { name: "Pav Bhaji", serving: "2 pav + 1 katori bhaji", tags: ["veg", "bread"], protein: 8, carbs: 48, fat: 10, cal: 315 },
      { name: "Millet Pongal + Sambar + Chutney", serving: "1 plate (~250g)", tags: ["veg", "light"], protein: 7, carbs: 40, fat: 4, cal: 228 },
      { name: "Bread + Butter + Jam", serving: "2 slices", tags: ["veg", "bread"], protein: 4, carbs: 30, fat: 8, cal: 205 },
      { name: "Tea/Coffee/Milk", serving: "1 cup (200ml)", tags: ["veg", "light"], protein: 2, carbs: 6, fat: 2, cal: 50 },
      { name: "Egg Bhurji", serving: "2 eggs scrambled", tags: ["nonveg", "protein"], protein: 10, carbs: 2, fat: 8, cal: 120 }
    ],
    lunch: [
      { name: "Dum Paneer Biryani", serving: "1 plate (~350g)", tags: ["veg", "protein", "rice"], protein: 18, carbs: 62, fat: 12, cal: 435, exclusiveGroup: "sun-lunch-biryani" },
      { name: "Dum Chicken Biryani + Gobi Aloo + Onion Raita + Brinjal Gravy", serving: "1 plate biryani (~350g) + sides", tags: ["nonveg", "protein", "rice"], protein: 28, carbs: 65, fat: 14, cal: 505, exclusiveGroup: "sun-lunch-biryani" },
      { name: "White Rice + Mysore Rasam + Curd + Rice Pickle", serving: "1 plate rice + ladles of each", tags: ["veg", "rice"], protein: 5, carbs: 62, fat: 3, cal: 295 },
      { name: "Mixed Fruits + Lemon Mint Juice", serving: "1 cup fruit + 1 glass juice", tags: ["veg", "light"], protein: 1, carbs: 18, fat: 0, cal: 76 },
      { name: "Chilled Badam Milk (non-veg counter)", serving: "1 glass (200ml)", tags: ["nonveg", "protein"], protein: 6, carbs: 20, fat: 5, cal: 150 }
    ],
    snacks: [
      { name: "Boiled Chana Chat", serving: "1 cup (~150g)", tags: ["veg", "protein"], protein: 8, carbs: 24, fat: 2, cal: 148 },
      { name: "Tea/Coffee/Milk", serving: "1 cup (200ml)", tags: ["veg", "light"], protein: 2, carbs: 6, fat: 2, cal: 50 }
    ],
    dinner: [
      { name: "Mixed Vegetable Porial", serving: "1 katori (~100g)", tags: ["veg", "light"], protein: 3, carbs: 12, fat: 2, cal: 78 },
      { name: "Idly + Chutney + Sambar", serving: "3 idlis + accompaniments", tags: ["veg", "light"], protein: 6, carbs: 38, fat: 3, cal: 205 },
      { name: "White Rice + Dal Makhani + Rasam", serving: "1 plate rice + 1 katori dal + 1 cup rasam", tags: ["veg", "protein", "rice"], protein: 12, carbs: 62, fat: 6, cal: 355 },
      { name: "Salad + Milk + Buttermilk", serving: "1 katori salad + 1 glass milk + 1 glass buttermilk", tags: ["veg", "light"], protein: 5, carbs: 14, fat: 3, cal: 102 }
    ]
  }
};
