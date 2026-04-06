// MESS ORACLE — App Controller

// ── STATE ────────────────────────────────────────
const PREF_STORAGE_KEY = "mess-oracle-prefs";

const state = {
  day:  null,
  meal: null,
  prefs: loadPrefs(),
};

function loadPrefs() {
  try {
    const saved = localStorage.getItem(PREF_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  return { veg: "veg", spice: "low", craving: "any", goal: "maintenance" };
}

function savePrefs() {
  try { localStorage.setItem(PREF_STORAGE_KEY, JSON.stringify(state.prefs)); } catch (_) {}
}

// ── CONSTANTS ────────────────────────────────────
const DAYS  = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
const MEALS = [
  { id: "breakfast", label: "Breakfast", icon: "☀" },
  { id: "lunch",     label: "Lunch",     icon: "◑" },
  { id: "snacks",    label: "Snacks",    icon: "◇" },
  { id: "dinner",    label: "Dinner",    icon: "☾" },
];

// ── INIT ─────────────────────────────────────────
function init() {
  renderDayGrid();
  renderMealGrid();
  setupToggleListeners();
  applyPrefsToUI();
  autoSelectCurrentDay();
  setupTooltips();
}

function autoSelectCurrentDay() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
  if (DAYS.includes(today)) selectDay(today);
}

// ── NAVIGATION ───────────────────────────────────
function showStep(id) {
  document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
  const el = document.getElementById(id);
  if (el) {
    el.classList.add("active");
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function goBack(stepId) { showStep(stepId); }

// ── DAY GRID ─────────────────────────────────────
function renderDayGrid() {
  const grid = document.getElementById("day-grid");
  grid.innerHTML = DAYS.map(day => `
    <button class="day-btn" data-day="${day}" onclick="selectDay('${day}')">
      <span class="day-short">${day.slice(0,3).toUpperCase()}</span>
      <span class="day-full">${day.charAt(0).toUpperCase() + day.slice(1)}</span>
    </button>
  `).join("");
}

function selectDay(day) {
  state.day = day;
  document.querySelectorAll(".day-btn").forEach(b =>
    b.classList.toggle("active", b.dataset.day === day)
  );
  setTimeout(() => showStep("step-meal"), 200);
}

// ── MEAL GRID ────────────────────────────────────
function renderMealGrid() {
  const grid = document.getElementById("meal-grid");
  grid.innerHTML = MEALS.map(m => `
    <button class="meal-btn" data-meal="${m.id}" onclick="selectMeal('${m.id}')">
      <span class="meal-icon">${m.icon}</span>
      <span class="meal-label">${m.label}</span>
    </button>
  `).join("");
}

function selectMeal(meal) {
  state.meal = meal;
  document.querySelectorAll(".meal-btn").forEach(b =>
    b.classList.toggle("active", b.dataset.meal === meal)
  );
  setTimeout(() => showStep("step-prefs"), 200);
}

// ── PREFERENCES ──────────────────────────────────
function setupToggleListeners() {
  document.querySelectorAll(".toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const pref = btn.dataset.pref;
      const val  = btn.dataset.val;
      state.prefs[pref] = val;
      savePrefs();
      document.querySelectorAll(`.toggle[data-pref="${pref}"]`).forEach(b =>
        b.classList.toggle("active", b.dataset.val === val)
      );
    });
  });
}

// Apply saved prefs to toggle buttons on load
function applyPrefsToUI() {
  Object.entries(state.prefs).forEach(([pref, val]) => {
    document.querySelectorAll(`.toggle[data-pref="${pref}"]`).forEach(b =>
      b.classList.toggle("active", b.dataset.val === val)
    );
  });
}

// ── TOOLTIPS (tap-to-toggle on mobile) ───────────
function setupTooltips() {
  document.addEventListener("click", e => {
    const tip = e.target.closest(".food-tooltip");
    // Close any open tooltip
    document.querySelectorAll(".food-tooltip.tip-open").forEach(el => {
      if (el !== tip) el.classList.remove("tip-open");
    });
    if (tip) {
      e.stopPropagation();
      tip.classList.toggle("tip-open");
    }
  });
}

// ── VERDICT ──────────────────────────────────────
function judgeTheMess() {
  if (!state.day || !state.meal) return;
  const result = generateVerdict(state.day, state.meal, state.prefs);
  if (!result) return;

  if (result.empty) {
    renderEmptyState(result.reason);
    showStep("step-verdict");
    return;
  }

  renderVerdict(result);
  showStep("step-verdict");
}

// Called from verdict screen — re-run with updated prefs without going back
function retweakAndJudge() {
  showStep("step-prefs");
}

function renderEmptyState(reason) {
  document.getElementById("verdict-banner").innerHTML = `
    <div class="verdict-banner verdict-red">
      <div class="verdict-icon">✗</div>
      <div class="verdict-text">
        <div class="verdict-main">NOTHING TO EAT</div>
        <div class="verdict-sub">${reason}</div>
      </div>
    </div>
  `;
  ["items-breakdown","macros-section","outside-suggestion","pro-tip"].forEach(id => {
    document.getElementById(id).innerHTML = "";
  });
}

function renderVerdict(r) {
  renderBanner(r);
  renderItems(r);
  renderMacros(r);
  renderOutside(r);
  renderProTip(r);
}

// ── BANNER ───────────────────────────────────────
function renderBanner(r) {
  const v = r.overallVerdict;
  const mealLabel = MEALS.find(m => m.id === r.meal)?.label || r.meal;
  const dayLabel  = r.day.charAt(0).toUpperCase() + r.day.slice(1);
  document.getElementById("verdict-banner").innerHTML = `
    <div class="verdict-banner verdict-${v.color}">
      <div class="verdict-icon">${v.emoji}</div>
      <div class="verdict-text">
        <div class="verdict-main">${v.label}</div>
        <div class="verdict-sub">${dayLabel} ${mealLabel} — ${r.avgScore}/100</div>
      </div>
      <div class="score-ring">
        <svg viewBox="0 0 44 44" class="score-svg">
          <circle cx="22" cy="22" r="18" fill="none" stroke-width="4" class="ring-bg"/>
          <circle cx="22" cy="22" r="18" fill="none" stroke-width="4"
            stroke-dasharray="${(r.avgScore / 100) * 113} 113"
            stroke-linecap="round" class="ring-fill"
            transform="rotate(-90 22 22)"/>
        </svg>
        <span class="score-num">${r.avgScore}</span>
      </div>
    </div>
  `;
}

// ── ITEMS ────────────────────────────────────────
function renderItems(r) {
  const condimentHtml = r.condimentItems.length ? `
    <div class="items-section">
      <div class="section-title">condiments &amp; extras</div>
      ${r.condimentItems.map(item => itemRow(item, false)).join("")}
      ${r.autoItems.map(item => autoItemRow(item)).join("")}
    </div>
  ` : "";

  document.getElementById("items-breakdown").innerHTML = `
    <div class="items-section">
      <div class="section-title">your optimal plate</div>
      ${renderCombo(r.comboItems)}
    </div>
    <div class="items-section">
      <div class="section-title">all available options</div>
      ${renderItemGroup("Eat this 🟢", r.eatItems,   "eat")}
      ${renderItemGroup("Maybe 🟡",    r.maybeItems, "maybe")}
      ${renderItemGroup("Skip 🔴",     r.skipItems,  "skip")}
    </div>
    ${condimentHtml}
  `;
}

function renderCombo(items) {
  if (!items.length) return `<div class="combo-empty">Nothing worth eating today. Go outside.</div>`;
  const totalCal     = items.reduce((s, i) => s + i.cal,     0);
  const totalProtein = items.reduce((s, i) => s + i.protein, 0);
  return `
    <div class="combo-group">
      <div class="combo-header">
        <span class="combo-label">Build your plate</span>
        <span class="combo-cal">${totalCal} kcal · ${totalProtein}g protein</span>
      </div>
      <div class="item-list">
        ${items.map(item => itemRow(item, true)).join("")}
      </div>
    </div>
  `;
}

function itemRow(item, showAlternative) {
  return `
    <div class="item-row">
      <div class="item-main">
        <span class="item-name">${glossifyName(item.name)}</span>
        ${item.serving ? `<span class="item-serving">${item.serving}</span>` : ""}
        ${showAlternative && item.exclusiveAlternative
          ? `<span class="exclusive-note">picked over: ${glossifyName(item.exclusiveAlternative.name)}</span>`
          : ""}
        ${item.skipReason ? `<span class="skip-reason">↳ ${item.skipReason}</span>` : ""}
      </div>
      <span class="item-macro-mini">${item.protein}g P · ${item.carbs}g C · ${item.cal} kcal</span>
    </div>
  `;
}

function autoItemRow(item) {
  return `
    <div class="item-row item-row-auto">
      <div class="item-main">
        <span class="item-name item-name-muted">${item.name}</span>
        ${item.serving ? `<span class="item-serving">${item.serving}</span>` : ""}
      </div>
      <span class="item-macro-mini item-auto-label">always available</span>
    </div>
  `;
}

function renderItemGroup(label, items, cls) {
  if (!items.length) return "";
  return `
    <div class="item-group">
      <div class="group-label ${cls}">${label}</div>
      <div class="item-list">
        ${items.map(item => itemRow(item, false)).join("")}
      </div>
    </div>
  `;
}

// ── GLOSSIFY ─────────────────────────────────────
// Wraps known Tamil/regional food words with tooltip spans.
// Sorts keys longest-first and tracks replaced ranges to prevent double-wrapping.
function glossifyName(name) {
  if (typeof FOOD_GLOSSARY === "undefined") return name;

  const sortedKeys = Object.keys(FOOD_GLOSSARY).sort((a, b) => b.length - a.length);
  // We build a list of (start, end, replacement) then apply non-overlapping ones
  const replacements = [];

  for (const key of sortedKeys) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex   = new RegExp(`(?<![\\w>])${escaped}(?![\\w<])`, "gi");
    let m;
    while ((m = regex.exec(name)) !== null) {
      const start = m.index;
      const end   = start + m[0].length;
      // Skip if overlaps with an already-claimed range
      const overlaps = replacements.some(r => start < r.end && end > r.start);
      if (!overlaps) {
        const desc = FOOD_GLOSSARY[key].replace(/"/g, "&quot;");
        replacements.push({
          start, end,
          html: `<span class="food-tooltip" tabindex="0" data-tip="${desc}">${m[0]}<sup class="q">?</sup></span>`,
        });
      }
    }
  }

  if (!replacements.length) return name;

  // Apply replacements from right to left to keep indices valid
  replacements.sort((a, b) => b.start - a.start);
  let result = name;
  for (const r of replacements) {
    result = result.slice(0, r.start) + r.html + result.slice(r.end);
  }
  return result;
}

// ── MACROS ───────────────────────────────────────
function renderMacros(r) {
  const { macros, macroRating, prefs } = r;
  const targets = GOAL_MACROS[prefs.goal];
  const totalG  = macros.protein + macros.carbs + macros.fat || 1;

  const pBar = Math.round((macros.protein / totalG) * 100);
  const cBar = Math.round((macros.carbs   / totalG) * 100);
  const fBar = Math.round((macros.fat     / totalG) * 100);

  document.getElementById("macros-section").innerHTML = `
    <div class="macro-card">
      <div class="section-title">macro breakdown — optimal plate</div>
      <div class="macro-summary">
        <div class="macro-stat"><span class="macro-val">${macros.cal}</span><span class="macro-label">kcal</span></div>
        <div class="macro-stat"><span class="macro-val">${macros.protein}g</span><span class="macro-label">protein</span></div>
        <div class="macro-stat"><span class="macro-val">${macros.carbs}g</span><span class="macro-label">carbs</span></div>
        <div class="macro-stat"><span class="macro-val">${macros.fat}g</span><span class="macro-label">fat</span></div>
      </div>
      <div class="macro-bars">
        ${macroBar("Protein", pBar, targets.protein, "#5de5a6")}
        ${macroBar("Carbs",   cBar, targets.carbs,   "#f5c542")}
        ${macroBar("Fat",     fBar, targets.fat,     "#f07060")}
      </div>
      <div class="macro-goal-label">target for <strong>${prefs.goal}</strong>: ${targets.protein}P / ${targets.carbs}C / ${targets.fat}F%</div>
      <div class="macro-notes">
        ${macroRating.notes.map(n => `<div class="macro-note">${n}</div>`).join("")}
      </div>
    </div>
  `;
}

function macroBar(label, actual, target, color) {
  return `
    <div class="bar-row">
      <span class="bar-label">${label}</span>
      <div class="bar-track">
        <div class="bar-fill" style="width:${actual}%; background:${color}"></div>
        <div class="bar-target" style="left:${target}%"></div>
      </div>
      <span class="bar-pct">${actual}%</span>
    </div>
  `;
}

// ── OUTSIDE / EAT-IN ─────────────────────────────
function renderOutside(r) {
  const shouldEat = r.avgScore >= 65;
  document.getElementById("outside-suggestion").innerHTML = `
    <div class="outside-card ${shouldEat ? "outside-secondary" : "outside-primary"}">
      <div class="outside-verdict-line">
        ${shouldEat
          ? `<span class="outside-icon">🏠</span><span class="outside-verdict-text">Mess is worth it today</span>`
          : `<span class="outside-icon">🚶</span><span class="outside-verdict-text">Skip the mess. Eat outside.</span>`}
      </div>
      <div class="outside-note">
        ${shouldEat
          ? "Score is decent. Eat in, save the money."
          : "Score too low — your time and stomach deserve better today."}
      </div>
      <button class="tweak-btn" onclick="retweakAndJudge()">← tweak preferences</button>
    </div>
  `;
}

// ── PRO TIP ──────────────────────────────────────
function renderProTip(r) {
  document.getElementById("pro-tip").innerHTML = `
    <div class="tip-card">
      <span class="tip-icon">💡</span>
      <span class="tip-text">${r.tip}</span>
    </div>
  `;
}

// ── RESET ────────────────────────────────────────
function resetAll() {
  state.day  = null;
  state.meal = null;
  showStep("step-day");
  document.querySelectorAll(".day-btn, .meal-btn").forEach(b => b.classList.remove("active"));
}

// Boot
document.addEventListener("DOMContentLoaded", init);
