// MESS ORACLE — Scoring & Verdict Logic

const VERDICT_THRESHOLDS = {
  eat:        { min: 70, label: "EAT THE MESS", emoji: "✓", color: "green" },
  conditional:{ min: 40, label: "CONDITIONAL EAT", emoji: "~", color: "amber" },
  skip:       { min: 0,  label: "GO OUTSIDE", emoji: "✗", color: "red" }
};

const GOAL_MACROS = {
  bulk:        { protein: 35, carbs: 50, fat: 15, calories: 800 },
  maintenance: { protein: 25, carbs: 50, fat: 25, calories: 600 },
  cut:         { protein: 40, carbs: 35, fat: 25, calories: 450 }
};

// Spice indicator words
const SPICY_WORDS = ["masala", "chettinad", "milagu", "kuzhambu", "andhra", "pepper", "chilli", "hot"];
const MILD_WORDS  = ["curd", "milk", "salad", "fruit", "bread", "butter", "jam", "upma", "idli", "dosa", "poha"];

function scoreItem(item, prefs) {
  let score = 60; // base score — mess food is edible by default

  // Veg preference
  if (prefs.veg === "veg" && item.tags.includes("nonveg")) return -1; // filter out entirely
  if (prefs.veg === "both" && item.tags.includes("nonveg")) score += 10;

  // Craving match
  if (prefs.craving !== "any") {
    if (item.tags.includes(prefs.craving)) score += 20;
    else score -= 10;
  }

  // Protein scoring — boosted significantly for all goals
  if (item.tags.includes("protein")) score += 18;
  if (item.protein >= 15) score += 15;
  else if (item.protein >= 10) score += 8;
  else if (item.protein <= 3) score -= 8;

  // Extra protein bonus for muscle goals
  if (prefs.goal === "bulk" || prefs.goal === "cut") {
    if (item.tags.includes("protein")) score += 8;
    if (item.protein >= 12) score += 5;
  }

  // Calorie goal
  if (prefs.goal === "cut") {
    if (item.cal > 400) score -= 15;
    if (item.cal < 200) score += 10;
    if (item.fat > 15) score -= 10;
  }
  if (prefs.goal === "bulk") {
    if (item.cal > 350) score += 10;
    if (item.carbs > 50) score += 5;
  }

  // Spice tolerance
  const nameL = item.name.toLowerCase();
  const isSpicy = SPICY_WORDS.some(w => nameL.includes(w));
  const isMild  = MILD_WORDS.some(w => nameL.includes(w));
  if (prefs.spice === "low" && isSpicy)  score -= 25;
  if (prefs.spice === "high" && isSpicy) score += 10;
  if (prefs.spice === "low" && isMild)   score += 8;

  return Math.max(0, Math.min(100, score));
}

function getItemVerdict(score) {
  if (score >= 70) return { label: "eat this", color: "green",  icon: "✓" };
  if (score >= 40) return { label: "maybe",    color: "amber",  icon: "~" };
  if (score >= 0)  return { label: "skip",     color: "red",    icon: "✗" };
  return null;
}

function computeMacros(items) {
  return items.reduce((acc, item) => ({
    protein: acc.protein + (item.protein || 0),
    carbs:   acc.carbs   + (item.carbs   || 0),
    fat:     acc.fat     + (item.fat     || 0),
    cal:     acc.cal     + (item.cal     || 0)
  }), { protein: 0, carbs: 0, fat: 0, cal: 0 });
}

function getMacroRating(macros, goal) {
  const targets = GOAL_MACROS[goal];
  const totalMacroG = macros.protein + macros.carbs + macros.fat;
  if (totalMacroG === 0) return { rating: "unknown", notes: [] };

  const pPct = Math.round((macros.protein / totalMacroG) * 100);
  const cPct = Math.round((macros.carbs   / totalMacroG) * 100);
  const fPct = Math.round((macros.fat     / totalMacroG) * 100);

  const notes = [];
  if (pPct < targets.protein - 8) notes.push(`Low protein (${pPct}% vs ${targets.protein}% target) — add a side of dal or egg`);
  if (pPct > targets.protein + 10) notes.push(`High protein — good for your goal`);
  if (cPct > targets.carbs + 12)   notes.push(`Carb-heavy (${cPct}%) — skip the extra rice scoop`);
  if (fPct > targets.fat + 10)     notes.push(`High fat — watch the ghee/oil additions`);
  if (macros.cal > targets.calories + 200) notes.push(`Calorie-dense meal (~${macros.cal} kcal) — maybe skip a side dish`);
  if (macros.cal < targets.calories - 150) notes.push(`Light on calories (~${macros.cal} kcal) — might be hungry later`);
  if (notes.length === 0) notes.push("Macros align well with your goal 👍");

  const score = 100 - (notes.filter(n => !n.includes("good") && !n.includes("align")).length * 25);
  const rating = score >= 75 ? "good" : score >= 50 ? "okay" : "poor";

  return { rating, notes, pPct, cPct, fPct, totalCal: macros.cal };
}

function getProTip(day, meal, prefs, overallScore) {
  const tips = {
    bulk: [
      "Add an extra scoop of rice — the mess serves consistent carbs, useful for bulking.",
      "Ask for double dal. The mess staff usually oblige.",
      "Finish with the milk/curd — easy extra protein.",
    ],
    cut: [
      "Load up on the salad first. Fills you up before you attack the carbs.",
      "Skip the pickle (sodium) and the fryams (empty calories).",
      "Choose rasam over sambar — fewer calories, same satisfaction.",
    ],
    maintenance: [
      "Eat slow — hostel food is rarely mindfully eaten.",
      "The curd is underrated. Great probiotic, solid protein.",
      "Drink the buttermilk. Genuinely good for digestion.",
    ]
  };

  const funTips = [
    "Pro move: take the fruit and eat it later as a snack.",
    "The ghee allocation is stingy — bring your own if bulking.",
    "Sitting with someone who hates the food makes yours taste better.",
    "Eat breakfast. Skipping it and blaming the mess is a hostel tradition.",
    "The mess aunties remember students who say thank you. Be that student.",
  ];

  const goalTips = tips[prefs.goal] || [];
  const all = [...goalTips, ...funTips];
  return all[Math.floor(Math.random() * all.length)];
}

function resolveExclusiveGroups(items, prefs) {
  const groups = {};
  const nonGrouped = [];
  for (const item of items) {
    if (item.exclusiveGroup) {
      if (!groups[item.exclusiveGroup]) groups[item.exclusiveGroup] = [];
      groups[item.exclusiveGroup].push(item);
    } else {
      nonGrouped.push(item);
    }
  }
  const resolved = [...nonGrouped];
  for (const groupKey of Object.keys(groups)) {
    const group = groups[groupKey];
    const eligible = group.filter(item => {
      if (prefs.veg === "veg" && item.tags.includes("nonveg")) return false;
      return true;
    });
    if (eligible.length === 0) continue;
    const scored = eligible.map(item => ({ ...item, _tempScore: scoreItem(item, prefs) }));
    scored.sort((a, b) => b._tempScore - a._tempScore);
    const winner = { ...scored[0] };
    if (scored.length > 1) winner.exclusiveAlternative = scored[1];
    resolved.push(winner);
  }
  return resolved;
}

function generateVerdict(day, meal, prefs) {
  const items = MENU[day]?.[meal] ?? [];
  if (!items.length) return null;

  const resolvedItems = resolveExclusiveGroups(items, prefs);

  const scored = resolvedItems.map(item => {
    const s = scoreItem(item, prefs);
    return s === -1 ? null : { ...item, score: s, verdict: getItemVerdict(s) };
  }).filter(Boolean);

  const eatItems   = scored.filter(i => i.score >= 70);
  const maybeItems = scored.filter(i => i.score >= 40 && i.score < 70);
  const skipItems  = scored.filter(i => i.score < 40);

  const avgScore = scored.length
    ? Math.round(scored.reduce((s, i) => s + i.score, 0) / scored.length)
    : 0;

  const recommendedItems = [...eatItems, ...maybeItems];
  const macros = computeMacros(recommendedItems);
  const macroRating = getMacroRating(macros, prefs.goal);

  let overallVerdict;
  if (avgScore >= 65) overallVerdict = VERDICT_THRESHOLDS.eat;
  else if (avgScore >= 40) overallVerdict = VERDICT_THRESHOLDS.conditional;
  else overallVerdict = VERDICT_THRESHOLDS.skip;

  const tip = getProTip(day, meal, prefs, avgScore);

  return {
    day, meal, prefs, avgScore,
    overallVerdict,
    eatItems, maybeItems, skipItems,
    macros, macroRating,
    tip
  };
}
