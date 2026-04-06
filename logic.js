// MESS ORACLE — Scoring & Verdict Logic

// ── SCORING CONFIG ───────────────────────────────
// All weights in one place — easy to tune without hunting through code
const SCORE_CONFIG = {
  base: 60,
  nonvegBonus: 8,
  cravingMatch: 20,
  cravingMiss: -8,
  proteinTagBase: 18,
  proteinTagGoal: 8,       // extra for bulk/cut goals
  proteinHigh: 15,         // protein >= 15g
  proteinMid: 8,           // protein >= 10g
  proteinLow: -6,          // protein <= 2g
  proteinGoalBonus: 5,     // protein >= 12g on muscle goals
  cutHighCal: -12,         // cal > 300 on cut
  cutLowCal: 8,            // cal < 100 on cut
  cutHighFat: -8,          // fat > 12 on cut
  bulkHighCal: 8,          // cal > 250 on bulk
  bulkHighCarb: 5,         // carbs > 30 on bulk
  spicyPenalty: -25,       // spicy + low tolerance
  spicyBonus: 10,          // spicy + high tolerance
  mildBonus: 8,            // mild + low tolerance
};

const VERDICT_THRESHOLDS = {
  eat:         { min: 70, label: "EAT THE MESS",    emoji: "✓", color: "green" },
  conditional: { min: 40, label: "CONDITIONAL EAT", emoji: "~", color: "amber" },
  skip:        { min: 0,  label: "GO OUTSIDE",       emoji: "✗", color: "red"   },
};

const GOAL_MACROS = {
  bulk:        { protein: 35, carbs: 50, fat: 15, calories: 800 },
  maintenance: { protein: 25, carbs: 50, fat: 25, calories: 600 },
  cut:         { protein: 40, carbs: 35, fat: 25, calories: 450 },
};

const MEAL_CAL_TARGETS = {
  bulk:        { breakfast: 600, lunch: 900, snacks: 300, dinner: 800 },
  maintenance: { breakfast: 450, lunch: 700, snacks: 200, dinner: 600 },
  cut:         { breakfast: 350, lunch: 500, snacks: 150, dinner: 450 },
};

// Items that are condiments/extras — scored but shown in a separate section,
// not counted toward the overall meal score or pulled into the main combo
const CONDIMENT_NAMES = new Set([
  "pickle", "rice pickle", "thuvaiyal pickle", "ghee", "butter", "jam",
  "gingelly oil", "podi oil", "paruppu podi", "thovayal", "udap",
  "chopped onion", "chopped onion + lemon", "fryams", "lemon mint juice",
  "sweet buttermilk", "buttermilk", "millet buttermilk",
]);

// Items served at every meal that don't need scoring — just listed
const AUTO_INCLUDE_NAMES = new Set([
  "tea / coffee / milk",
]);

const SPICY_WORDS = ["masala", "chettinad", "milagu", "kuzhambu", "andhra", "chilli", "hot", "vatha", "pepper"];
const MILD_WORDS  = ["curd", "milk", "salad", "fruit", "bread", "butter", "jam", "upma", "idli", "dosa", "poha", "rasam", "buttermilk", "chutney"];

// ── ITEM CLASSIFIER ──────────────────────────────
function classifyItem(item) {
  const nameLower = item.name.toLowerCase();
  if (AUTO_INCLUDE_NAMES.has(nameLower)) return "auto";
  // Match condiment by prefix/exact (handles variations like "pickle" in "rice pickle")
  for (const c of CONDIMENT_NAMES) {
    if (nameLower === c || nameLower.startsWith(c)) return "condiment";
  }
  return "main";
}

// ── ITEM SCORER ─────────────────────────────────
function scoreItem(item, prefs) {
  const C = SCORE_CONFIG;

  // Hard filter
  if (prefs.veg === "veg" && item.tags.includes("nonveg")) return -1;

  let score = C.base;

  if (prefs.veg === "both" && item.tags.includes("nonveg")) score += C.nonvegBonus;

  // Craving
  if (prefs.craving !== "any") {
    score += item.tags.includes(prefs.craving) ? C.cravingMatch : C.cravingMiss;
  }

  // Protein
  if (item.tags.includes("protein")) score += C.proteinTagBase;
  if      (item.protein >= 15) score += C.proteinHigh;
  else if (item.protein >= 10) score += C.proteinMid;
  else if (item.protein <= 2)  score += C.proteinLow;

  if (prefs.goal === "bulk" || prefs.goal === "cut") {
    if (item.tags.includes("protein")) score += C.proteinTagGoal;
    if (item.protein >= 12)            score += C.proteinGoalBonus;
  }

  // Calories / fat per goal
  if (prefs.goal === "cut") {
    if (item.cal > 300) score += C.cutHighCal;
    if (item.cal < 100) score += C.cutLowCal;
    if (item.fat > 12)  score += C.cutHighFat;
  }
  if (prefs.goal === "bulk") {
    if (item.cal > 250)  score += C.bulkHighCal;
    if (item.carbs > 30) score += C.bulkHighCarb;
  }

  // Spice
  const nameL = item.name.toLowerCase();
  const isSpicy = SPICY_WORDS.some(w => nameL.includes(w));
  const isMild  = MILD_WORDS.some(w => nameL.includes(w));
  if (prefs.spice === "low"  && isSpicy) score += C.spicyPenalty;
  if (prefs.spice === "high" && isSpicy) score += C.spicyBonus;
  if (prefs.spice === "low"  && isMild)  score += C.mildBonus;

  return Math.max(0, Math.min(100, score));
}

// ── SKIP REASON ──────────────────────────────────
// Returns a short human-readable reason why an item scored low
function getSkipReason(item, prefs) {
  const nameL = item.name.toLowerCase();
  const isSpicy = SPICY_WORDS.some(w => nameL.includes(w));

  if (prefs.spice === "low" && isSpicy)      return "too spicy for your tolerance";
  if (prefs.goal === "cut" && item.cal > 300) return "too calorie-dense for your cut";
  if (prefs.goal === "cut" && item.fat > 12)  return "too fatty for your cut";
  if (prefs.veg === "veg" && item.tags.includes("nonveg")) return "not veg";
  if (item.protein <= 2 && (prefs.goal === "bulk" || prefs.goal === "cut"))
                                              return "near-zero protein";
  if (prefs.craving !== "any" && !item.tags.includes(prefs.craving))
                                              return `not matching your ${prefs.craving} craving`;
  return "low overall score for your prefs";
}

// ── EXCLUSIVE GROUP RESOLVER ─────────────────────
function resolveExclusiveGroups(items, prefs) {
  const groups = {};
  const nonGrouped = [];

  for (const item of items) {
    if (item.exclusiveGroup) {
      (groups[item.exclusiveGroup] = groups[item.exclusiveGroup] || []).push(item);
    } else {
      nonGrouped.push(item);
    }
  }

  const resolved = [...nonGrouped];
  for (const groupKey of Object.keys(groups)) {
    const eligible = groups[groupKey].filter(
      item => !(prefs.veg === "veg" && item.tags.includes("nonveg"))
    );
    if (!eligible.length) continue;

    // Score once here for ranking; main pass will score again — that's fine,
    // scoreItem is pure and cheap
    const ranked = eligible
      .map(item => ({ ...item, _s: scoreItem(item, prefs) }))
      .sort((a, b) => b._s - a._s);

    const winner = { ...ranked[0] };
    delete winner._s;
    if (ranked.length > 1) winner.exclusiveAlternative = ranked[1];
    resolved.push(winner);
  }
  return resolved;
}

// ── COMBO BUILDER ────────────────────────────────
function buildOptimalCombo(mainItems, goal, meal) {
  const calTarget = MEAL_CAL_TARGETS[goal]?.[meal] ?? 650;
  const sorted = [...mainItems].sort((a, b) => b.score - a.score);

  const combo = [];
  let totalCal = 0;

  // Always include eat-tier items
  for (const item of sorted) {
    if (item.score >= 70) {
      combo.push(item);
      totalCal += item.cal;
    }
  }
  // Fill with maybe-tier up to budget
  for (const item of sorted) {
    if (item.score >= 40 && item.score < 70) {
      if (totalCal + item.cal <= calTarget * 1.15) {
        combo.push(item);
        totalCal += item.cal;
      }
    }
  }
  return combo;
}

// ── VERDICT THRESHOLDS ───────────────────────────
function getItemVerdict(score) {
  if (score >= 70) return { label: "eat",   color: "green", icon: "✓" };
  if (score >= 40) return { label: "maybe", color: "amber", icon: "~" };
  return                  { label: "skip",  color: "red",   icon: "✗" };
}

// ── MACROS ───────────────────────────────────────
function computeMacros(items) {
  return items.reduce((acc, item) => ({
    protein: acc.protein + (item.protein || 0),
    carbs:   acc.carbs   + (item.carbs   || 0),
    fat:     acc.fat     + (item.fat     || 0),
    cal:     acc.cal     + (item.cal     || 0),
  }), { protein: 0, carbs: 0, fat: 0, cal: 0 });
}

function getMacroRating(macros, goal) {
  const targets = GOAL_MACROS[goal];
  const totalG = macros.protein + macros.carbs + macros.fat;
  if (!totalG) return { rating: "unknown", notes: [] };

  const pPct = Math.round((macros.protein / totalG) * 100);
  const cPct = Math.round((macros.carbs   / totalG) * 100);
  const fPct = Math.round((macros.fat     / totalG) * 100);

  const notes = [];
  if (pPct < targets.protein - 8)       notes.push(`Low protein (${pPct}% vs ${targets.protein}% target) — consider adding an egg or extra dal`);
  if (pPct > targets.protein + 10)      notes.push(`High protein — great for your goal`);
  if (cPct > targets.carbs + 12)        notes.push(`Carb-heavy (${cPct}%) — skip the extra rice scoop`);
  if (fPct > targets.fat + 10)          notes.push(`High fat — watch the ghee and oil`);
  if (macros.cal > targets.calories + 200) notes.push(`Calorie-dense (~${macros.cal} kcal) — consider dropping a side`);
  if (macros.cal < targets.calories - 150) notes.push(`Light on calories (~${macros.cal} kcal) — you might be hungry later`);
  if (!notes.length)                    notes.push("Macros align well with your goal 👍");

  const badCount = notes.filter(n => !n.includes("great") && !n.includes("align")).length;
  const score = 100 - badCount * 25;
  return { rating: score >= 75 ? "good" : score >= 50 ? "okay" : "poor", notes, pPct, cPct, fPct };
}

// ── PRO TIP ──────────────────────────────────────
function getProTip(day, meal, prefs) {
  const tips = {
    bulk: [
      "Ask for double dal — the mess staff usually oblige.",
      "Finish with the milk or curd; easy extra protein at zero effort.",
      "Add an extra scoop of rice. Consistent carbs are bulk fuel.",
    ],
    cut: [
      "Load up on the salad first — fills you up before the carbs hit.",
      "Choose rasam over sambar. Fewer calories, same satisfaction.",
      "Skip the fryams and pickle. Empty sodium you don't need.",
    ],
    maintenance: [
      "The curd is underrated. Great probiotic, decent protein.",
      "Eat slow — hostel food is rarely mindfully eaten.",
      "Drink the buttermilk. Genuinely good for digestion.",
    ],
  };
  const funTips = [
    "Pro move: pocket the fruit and eat it two hours later.",
    "The ghee allocation is stingy — bring your own if bulking.",
    "Eat breakfast. Skipping it and blaming the mess is a hostel tradition.",
    "The mess aunties remember students who say thank you. Be that student.",
    "Sitting next to someone who hates the food makes yours taste better.",
  ];
  const all = [...(tips[prefs.goal] || []), ...funTips];
  return all[Math.floor(Math.random() * all.length)];
}

// ── MAIN VERDICT GENERATOR ───────────────────────
function generateVerdict(day, meal, prefs) {
  try {
    const rawItems = MENU[day]?.[meal] ?? [];
    if (!rawItems.length) return { empty: true, reason: "No menu data for this meal." };

    // 1. Resolve exclusive groups
    const items = resolveExclusiveGroups(rawItems, prefs);

    // 2. Classify each item: main / condiment / auto
    // 3. Score mains and condiments; skip auto-includes from scoring
    const mainItems      = [];
    const condimentItems = [];
    const autoItems      = [];

    for (const item of items) {
      const kind = classifyItem(item);
      if (kind === "auto") {
        autoItems.push(item);
        continue;
      }
      const s = scoreItem(item, prefs);
      if (s === -1) continue; // filtered by veg pref
      const scored = { ...item, score: s, verdict: getItemVerdict(s), skipReason: s < 40 ? getSkipReason(item, prefs) : null };
      if (kind === "condiment") condimentItems.push(scored);
      else                      mainItems.push(scored);
    }

    if (!mainItems.length && !condimentItems.length) {
      return { empty: true, reason: "Nothing available for your preferences today." };
    }

    // 4. Bucket mains into eat / maybe / skip
    const eatItems   = mainItems.filter(i => i.score >= 70);
    const maybeItems = mainItems.filter(i => i.score >= 40 && i.score < 70);
    const skipItems  = mainItems.filter(i => i.score < 40);

    // 5. Combo from mains only (condiments auto-excluded from plate builder)
    const comboItems = buildOptimalCombo(mainItems, prefs.goal, meal);

    // 6. Overall score from mains only (condiments don't drag it down)
    const avgScore = mainItems.length
      ? Math.round(mainItems.reduce((s, i) => s + i.score, 0) / mainItems.length)
      : 0;

    // 7. Macros from combo + condiments user will realistically take
    const macros = computeMacros(comboItems);
    const macroRating = getMacroRating(macros, prefs.goal);

    // 8. Verdict
    let overallVerdict;
    if      (avgScore >= 65) overallVerdict = VERDICT_THRESHOLDS.eat;
    else if (avgScore >= 40) overallVerdict = VERDICT_THRESHOLDS.conditional;
    else                     overallVerdict = VERDICT_THRESHOLDS.skip;

    const tip = getProTip(day, meal, prefs);

    return {
      day, meal, prefs, avgScore,
      overallVerdict,
      eatItems, maybeItems, skipItems,
      condimentItems, autoItems,
      comboItems,
      macros, macroRating,
      tip,
      empty: false,
    };
  } catch (err) {
    console.error("generateVerdict error:", err);
    return { empty: true, reason: "Something went wrong generating the verdict." };
  }
}
