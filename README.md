# 🍽️ MESS ORACLE

> Daily mess food verdict.

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

- **Day + Meal selector**: auto-detects today's day on load
- **Preference engine**: veg/non-veg, spice level, craving type, fitness goal
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
MENU = {
monday: {
breakfast: [{ name, serving, tags, protein, carbs, fat, cal }],
lunch: [...],
snacks: [...],
dinner: [...]
},
...
}


## Future Improvements

- Dynamic menu switching (load different menu files)
- Upload custom menu files directly
- Menu validation to prevent broken formats
- Advanced macro insights (weekly averages, goal optimization)
- Smart macro estimation for incomplete menus
- Share/import menu configurations
