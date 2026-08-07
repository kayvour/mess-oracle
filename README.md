# 🍽️ MESS ORACLE

> Daily mess food verdict.

Built Using Claude Sonnet 4.6. Supervised, Tested and Reviewed.

## Folder Structure

```
mess-oracle/
├── index.html      ← main app shell
├── style.css       ← dark industrial aesthetic, responsive
├── menu.js         ← full weekly menu data with macros
├── logic.js        ← scoring engine, macro rating, verdict generation
├── app.js          ← UI controller, DOM rendering
└── README.md       ← this file
```

## Setup

Just open `index.html` in any browser. No build step, no dependencies, no server needed.

## Features

- **Mess counter selector**: Mess A (Non-Veg, Men's Hostel) / Mess B (LH Veg Mess)
- **2-week rotating menu**: each counter cycles two distinct weekly menus; the app auto-detects which one is active from today's date
- **Day + Meal selector**: today's tile is highlighted (not auto-selected) — pick manually
- **Preference engine**: skip egg/meat (on Mess A), spice level, craving type, fitness goal
- **Smart scoring**: every menu item scored 0–100 based on preferences
- **Eat / Maybe / Skip**: clear 3-tier verdict per item
- **Macro breakdown**: calories, protein, carbs, fat with visual bars
- **Goal-aware macros**: compared against targets for Bulk / Maintenance / Cut
- **Outside food suggestion**: a specific dish + place + price if the mess is underwhelming
- **Pro tip**: random goal-specific hostel wisdom

## Tech

Vanilla HTML/CSS/JS, no frameworks, no npm, no build tools.
Single responsibility: menu.js = data, logic.js = brain, app.js = UI.

## Custom Menu Format

To use your own mess menu, replace `menu.js` with the same structure:
```
MENU = {
  a: {
    week1: { monday: { breakfast: [{ name, serving, tags, protein, carbs, fat, cal }], lunch: [...], snacks: [...], dinner: [...] }, ... },
    week2: { ... }
  },
  b: { week1: {...}, week2: {...} },
}
```
`a`/`b` are just two independent mess counters — name them whatever you actually
have (rename the ids and update `MESS_TYPES` in `app.js` to match).
If a counter doesn't rotate on a 2-week cycle, put the same data under `week1` and `week2`.
`MESS_META.weekReferenceDate` should be a Monday that's the start of `week1`'s cycle —
`getActiveMenuWeek()` uses it to figure out which week is live today.

Alternative-item pairs (e.g. "Chicken 65 / Chicken Tikka Masala") use a shared
`exclusiveGroup` string on each item — the scorer picks the better-scoring one and
notes the other as an alternative, rather than showing both.


## Future Improvements

- Upload custom menu files directly
- Menu validation to prevent broken formats
- Advanced macro insights (weekly averages, goal optimization)
- Smart macro estimation for incomplete menus
- Share/import menu configurations
- Remember last-picked mess type across visits (like spice/craving/goal already do)
- Month-to-month menu updates without touching app.js/logic.js
