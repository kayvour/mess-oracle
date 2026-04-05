// MESS ORACLE — Scoring & Verdict Logic

const VERDICT_THRESHOLDS = {
  eat:         { min: 70, label: "EAT THE MESS",     emoji: "✓", color: "green" },
  conditional: { min: 40, label: "CONDITIONAL EAT",  emoji: "~", color: "amber" },
  skip:        { min: 0,  label: "GO OUTSIDE",        emoji: "✗", color: "red"   },
};

const GOAL_MACROS = {
  bulk:        { protein: 35, carbs: 50, fat: 15, calories: 800 },
  maintenance: { protein: 25, carbs: 50, fat: 25, calories: 600 },
  cut:         { protein: 40, carbs: 35, fat: 25, calories: 450 },
};

// Calorie target per meal (used to cap combo size)
const MEAL_CAL_TARGETS = {
  bulk:        { breakfast: 600, lunch: 900, snacks: 300, dinner: 800 },
  maintenance: { breakfast: 450, lunch: 700, snacks: 200, dinner: 600 },
  cut:         { breakfast: 350, lunch: 500, snacks: 150, dinner: 450 },
};

const SPICY_WORDS = ["masala", "chettinad", "milagu", "kuzhambu", "andhra", "pepper", "chilli", "hot", "vatha"];
const MILD_WORDS  = ["curd", "milk", "salad", "fruit", "bread", "butter", "jam", "upma", "idli", "dosa", "poha", "rasam", "buttermilk"];

// ── ITEM SCORER ─────────────────────────────────
function scoreItem(item, prefs) {
  // Hard filter: veg preference
  if (prefs.veg === "veg" && item.tags.includes("nonveg")) return -1;

  let score = 60;

  // Non-veg bonus
  if (prefs.veg === "both" && item.tags.includes("nonveg")) score += 8;

  // Craving match
  if (prefs.craving !== "any") {
    if (item.tags.includes(prefs.craving)) score += 20;
    else score -= 8;
  }

  // Protein — rewarded for everyone, extra for muscle goals
  if (item.tags.includes("protein")) score += 18;
  if (item.protein >= 15) score += 15;
  else if (item.protein >= 10) score += 8;
  else if (item.protein <= 2) score -= 6;

  if (prefs.goal === "bulk" || prefs.goal === "cut") {
    if (item.tags.includes("protein")) score += 8;
    if (item.protein >= 12) score += 5;
  }

  // Calorie tuning per goal
  if (prefs.goal === "cut") {
    if (item.cal > 300) score -= 12;
    if (item.cal < 100) score += 8;
    if (item.fat > 12)  score -= 8;
  }
  if (prefs.goal === "bulk") {
    if (item.cal > 250) score += 8;
    if (item.carbs > 30) score += 5;
  }

  // Spice tolerance
  const nameL = item.name.toLowerCase();
  const isSpicy = SPICY_WORDS.some(w => nameL.includes(w));
  const isMild  = MILD_WORDS.some(w => nameL.includes(w));
  if (prefs.spice === "low"  && isSpicy) score -= 25;
  if (prefs.spice === "high" && isSpicy) score += 10;
  if (prefs.spice === "low"  && isMild)  score += 8;

  return Math.max(0, Math.min(100, score));
}

// ── EXCLUSIVE GROUP RESOLVER ─────────────────────
// For items like "Paneer Biryani vs Chicken Biryani" — pick the best-scoring one.
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
    const eligible = groups[groupKey].filter(item =>
      !(prefs.veg === "veg" && item.tags.includes("nonveg"))
    );
    if (!eligible.length) continue;
    const scored = eligible
      .map(item => ({ ...item, _s: scoreItem(item, prefs) }))
      .sort((a, b) => b._s - a._s);
    const winner = { ...scored[0] };
    delete winner._s;
    if (scored.length > 1) winner.exclusiveAlternative = scored[1];
    resolved.push(winner);
  }
  return resolved;
}

// ── COMBO BUILDER ────────────────────────────────
// Greedily picks items by score until calorie budget is filled.
// Always includes every item scoring >= 70 first, then fills with maybes.
function buildOptimalCombo(scoredItems, goal, meal) {
  const calTarget = MEAL_CAL_TARGETS[goal]?.[meal] ?? 650;

  // Sort by score descending
  const sorted = [...scoredItems].sort((a, b) => b.score - a.score);

  const combo = [];
  let totalCal = 0;

  for (const item of sorted) {
    // Always include high-scorers (eat tier) if they fit
    if (item.score >= 70) {
      combo.push(item);
      totalCal += item.cal;
    }
  }

  // Fill remaining calorie budget with maybe-tier items, best first
  for (const item of sorted) {
    if (item.score >= 40 && item.score < 70) {
      if (totalCal + item.cal <= calTarget * 1.15) { // allow 15% over target
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
  if (pPct < targets.protein - 8)  notes.push(`Low protein (${pPct}% vs ${targets.protein}% target) — consider adding an egg or extra dal`);
  if (pPct > targets.protein + 10) notes.push(`High protein — great for your goal`);
  if (cPct > targets.carbs + 12)   notes.push(`Carb-heavy (${cPct}%) — skip the extra rice scoop`);
  if (fPct > targets.fat + 10)     notes.push(`High fat — watch the ghee and oil additions`);
  if (macros.cal > targets.calories + 200) notes.push(`Calorie-dense (~${macros.cal} kcal) — maybe drop one side`);
  if (macros.cal < targets.calories - 150) notes.push(`Light on calories (~${macros.cal} kcal) — you might be hungry later`);
  if (!notes.length) notes.push("Macros align well with your goal 👍");

  const badNotes = notes.filter(n => !n.includes("great") && !n.includes("align")).length;
  const score = 100 - badNotes * 25;
  const rating = score >= 75 ? "good" : score >= 50 ? "okay" : "poor";

  return { rating, notes, pPct, cPct, fPct };
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
  const rawItems = MENU[day]?.[meal] ?? [];
  if (!rawItems.length) return null;

  // 1. Resolve exclusive groups (paneer vs chicken, etc.)
  const items = resolveExclusiveGroups(rawItems, prefs);

  // 2. Score every item
  const scored = items
    .map(item => {
      const s = scoreItem(item, prefs);
      if (s === -1) return null;
      return { ...item, score: s, verdict: getItemVerdict(s) };
    })
    .filter(Boolean);

  if (!scored.length) return null;

  // 3. Bucket into eat / maybe / skip for display
  const eatItems   = scored.filter(i => i.score >= 70);
  const maybeItems = scored.filter(i => i.score >= 40 && i.score < 70);
  const skipItems  = scored.filter(i => i.score < 40);

  // 4. Build the optimal combo (what you should actually put on your plate)
  const comboItems = buildOptimalCombo(scored, prefs.goal, meal);

  // 5. Overall score = average of all scored items
  const avgScore = Math.round(
    scored.reduce((s, i) => s + i.score, 0) / scored.length
  );

  // 6. Macros from the recommended combo only
  const macros = computeMacros(comboItems);
  const macroRating = getMacroRating(macros, prefs.goal);

  // 7. Top-level verdict
  let overallVerdict;
  if      (avgScore >= 65) overallVerdict = VERDICT_THRESHOLDS.eat;
  else if (avgScore >= 40) overallVerdict = VERDICT_THRESHOLDS.conditional;
  else                     overallVerdict = VERDICT_THRESHOLDS.skip;

  const tip = getProTip(day, meal, prefs);

  return {
    day, meal, prefs, avgScore,
    overallVerdict,
    eatItems, maybeItems, skipItems,
    comboItems,   // ← the optimal plate
    macros, macroRating,
    tip,
  };
}
