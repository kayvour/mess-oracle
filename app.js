// MESS ORACLE — App Controller

const state = {
  day: null,
  meal: null,
  prefs: {
    veg:     "veg",
    spice:   "low",
    craving: "any",
    goal:    "maintenance"
  }
};

const DAYS = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
const MEALS = [
  { id: "breakfast", label: "Breakfast", icon: "☀" },
  { id: "lunch",     label: "Lunch",     icon: "◑" },
  { id: "snacks",    label: "Snacks",    icon: "◇" },
  { id: "dinner",    label: "Dinner",    icon: "☾" }
];

// ───────────── INIT ─────────────
function init() {
  renderDayGrid();
  renderMealGrid();
  setupToggleListeners();
  autoSelectCurrentDay();
}

function autoSelectCurrentDay() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
  if (DAYS.includes(today)) {
    selectDay(today);
  }
}

// ───────────── NAVIGATION ─────────────
function showStep(id) {
  document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
  const el = document.getElementById(id);
  if (el) {
    el.classList.add("active");
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function goBack(stepId) { showStep(stepId); }

// ───────────── DAY GRID ─────────────
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

// ───────────── MEAL GRID ─────────────
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

// ───────────── PREFERENCES ─────────────
function setupToggleListeners() {
  document.querySelectorAll(".toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const pref = btn.dataset.pref;
      const val  = btn.dataset.val;
      state.prefs[pref] = val;
      document.querySelectorAll(`.toggle[data-pref="${pref}"]`).forEach(b =>
        b.classList.toggle("active", b.dataset.val === val)
      );
    });
  });
}

// ───────────── VERDICT RENDER ─────────────
function judgeTheMess() {
  if (!state.day || !state.meal) return;
  const result = generateVerdict(state.day, state.meal, state.prefs);
  if (!result) return;
  renderVerdict(result);
  showStep("step-verdict");
}

function renderVerdict(r) {
  renderBanner(r);
  renderItems(r);
  renderMacros(r);
  renderOutside(r);
  renderProTip(r);
}

function renderBanner(r) {
  const v = r.overallVerdict;
  const mealLabel = MEALS.find(m => m.id === r.meal)?.label || r.meal;
  const dayLabel = r.day.charAt(0).toUpperCase() + r.day.slice(1);
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
            stroke-linecap="round"
            class="ring-fill"
            transform="rotate(-90 22 22)"/>
        </svg>
        <span class="score-num">${r.avgScore}</span>
      </div>
    </div>
  `;
}

function renderItems(r) {
  const html = `
    <div class="items-section">
      <div class="section-title">what to eat from today's menu</div>
      ${renderItemGroup("Eat this 🟢", r.eatItems, "eat")}
      ${renderItemGroup("Maybe 🟡", r.maybeItems, "maybe")}
      ${renderItemGroup("Skip 🔴", r.skipItems, "skip")}
    </div>
  `;
  document.getElementById("items-breakdown").innerHTML = html;
}

function glossifyName(name) {
  if (typeof FOOD_GLOSSARY === "undefined") return name;
  let result = name;
  const sortedKeys = Object.keys(FOOD_GLOSSARY).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    const escapedKey = key.replace(/[.*+?^${}()|[\]]/g, '\\$&');
    const regex = new RegExp('(?<![>])' + escapedKey, 'gi');
    if (regex.test(result)) {
      const desc = FOOD_GLOSSARY[key].replace(/"/g, '&quot;');
      result = result.replace(regex, `<span class="food-tooltip" tabindex="0" data-tip="${desc}">${key}<sup class="q">?</sup></span>`);
    }
  }
  return result;
}

function renderItemGroup(label, items, cls) {
  if (!items.length) return "";
  return `
    <div class="item-group">
      <div class="group-label ${cls}">${label}</div>
      <div class="item-list">
        ${items.map(item => `
          <div class="item-row">
            <div class="item-main">
              <span class="item-name">${glossifyName(item.name)}</span>
              ${item.serving ? `<span class="item-serving">${item.serving}</span>` : ''}
              ${item.exclusiveAlternative ? `<span class="exclusive-note">Oracle picked this over: ${glossifyName(item.exclusiveAlternative.name)}</span>` : ''}
            </div>
            <span class="item-macro-mini">${item.protein}g P · ${item.carbs}g C · ${item.cal} kcal</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderMacros(r) {
  const { macros, macroRating, prefs } = r;
  const targets = GOAL_MACROS[prefs.goal];
  const totalG = macros.protein + macros.carbs + macros.fat || 1;

  const pBar = Math.round((macros.protein / totalG) * 100);
  const cBar = Math.round((macros.carbs   / totalG) * 100);
  const fBar = Math.round((macros.fat     / totalG) * 100);

  const tPBar = targets.protein;
  const tCBar = targets.carbs;
  const tFBar = targets.fat;

  document.getElementById("macros-section").innerHTML = `
    <div class="macro-card">
      <div class="section-title">macro breakdown</div>
      <div class="macro-summary">
        <div class="macro-stat">
          <span class="macro-val">${macros.cal}</span>
          <span class="macro-label">kcal</span>
        </div>
        <div class="macro-stat">
          <span class="macro-val">${macros.protein}g</span>
          <span class="macro-label">protein</span>
        </div>
        <div class="macro-stat">
          <span class="macro-val">${macros.carbs}g</span>
          <span class="macro-label">carbs</span>
        </div>
        <div class="macro-stat">
          <span class="macro-val">${macros.fat}g</span>
          <span class="macro-label">fat</span>
        </div>
      </div>

      <div class="macro-bars">
        ${macroBar("Protein", pBar, tPBar, "#5de5a6")}
        ${macroBar("Carbs",   cBar, tCBar, "#f5c542")}
        ${macroBar("Fat",     fBar, tFBar, "#f07060")}
      </div>

      <div class="macro-goal-label">target for <strong>${prefs.goal}</strong>: ${tPBar}P / ${tCBar}C / ${tFBar}F%</div>

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

function renderOutside(r) {
  const shouldEat = r.avgScore >= 65;
  document.getElementById("outside-suggestion").innerHTML = `
    <div class="outside-card ${shouldEat ? "outside-secondary" : "outside-primary"}">
      <div class="outside-verdict-line">
        ${shouldEat
          ? `<span class="outside-icon">🏠</span><span class="outside-verdict-text">Mess is worth it today</span>`
          : `<span class="outside-icon">🚶</span><span class="outside-verdict-text">Skip the mess. Eat outside.</span>`
        }
      </div>
      ${!shouldEat ? `<div class="outside-note">Score too low — your time and stomach deserve better today.</div>` : `<div class="outside-note">Score is decent enough. Eat in, save the money.</div>`}
    </div>
  `;
}

function renderProTip(r) {
  document.getElementById("pro-tip").innerHTML = `
    <div class="tip-card">
      <span class="tip-icon">💡</span>
      <span class="tip-text">${r.tip}</span>
    </div>
  `;
}

function resetAll() {
  state.day = null;
  state.meal = null;
  showStep("step-day");
  document.querySelectorAll(".day-btn, .meal-btn").forEach(b => b.classList.remove("active"));
}

// Boot
document.addEventListener("DOMContentLoaded", init);
