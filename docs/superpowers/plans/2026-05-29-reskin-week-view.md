# Reskin + Week View Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the `Badminton Schedule.html` template visual design to the working app and add a navigable 7-day week calendar view, then deploy to GitHub Pages.

**Architecture:** Three files are fully replaced — `style.css` (template design tokens + components), `index.html` (template HTML structure with JS-hookable IDs), `app.js` (existing data layer kept verbatim, new render functions added). No build tools; plain HTML/CSS/JS opened directly in a browser. No test runner available — verification is browser-based.

**Tech Stack:** HTML5, CSS (OKLCH, custom properties), vanilla JS, localStorage, Google Fonts (Archivo + Space Mono), GitHub Pages (master branch root).

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `style.css` | Full replace | All visual design — tokens, layout, components |
| `index.html` | Full replace | Page structure with IDs for JS to target |
| `app.js` | Full replace | Data layer (unchanged logic) + week/list/header render functions |

---

## Task 1: Replace `style.css` with template design system

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Replace `style.css` in full**

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: oklch(0.965 0.009 150);
  --surface: #ffffff;
  --ink: oklch(0.23 0.025 165);
  --muted: oklch(0.52 0.022 160);
  --faint: oklch(0.70 0.018 160);
  --line: oklch(0.905 0.013 155);

  --green: oklch(0.56 0.115 158);
  --green-strong: oklch(0.50 0.13 160);
  --green-deep: oklch(0.305 0.055 162);
  --green-deeper: oklch(0.255 0.05 163);
  --green-wash: oklch(0.95 0.03 158);

  --volt: oklch(0.88 0.185 122);
  --volt-deep: oklch(0.80 0.18 122);

  --win: oklch(0.56 0.12 158);
  --win-wash: oklch(0.945 0.045 155);
  --loss: oklch(0.585 0.18 27);
  --loss-wash: oklch(0.945 0.04 32);
  --up: oklch(0.66 0.135 75);
  --up-wash: oklch(0.95 0.055 85);

  --radius: 14px;
  --radius-sm: 9px;
  --shadow: 0 1px 2px oklch(0.3 0.04 160 / 0.05), 0 8px 24px oklch(0.3 0.04 160 / 0.06);
  --shadow-lift: 0 2px 4px oklch(0.3 0.04 160 / 0.06), 0 16px 40px oklch(0.3 0.04 160 / 0.10);
}

body {
  font-family: 'Archivo', system-ui, sans-serif;
  background: var(--bg);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
  line-height: 1.45;
  min-height: 100vh;
}

.mono { font-family: 'Space Mono', monospace; }

/* ---------- HEADER ---------- */
header.bar {
  background: var(--green-deep);
  background-image: linear-gradient(90deg, oklch(0.28 0.05 162) 0%, oklch(0.32 0.058 160) 100%);
  color: #fff;
  border-bottom: 4px solid var(--volt);
  position: relative;
  overflow: hidden;
}
header.bar::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, oklch(1 0 0 / 0.06) 1px, transparent 1px),
    linear-gradient(to bottom, oklch(1 0 0 / 0.05) 1px, transparent 1px);
  background-size: 56px 56px;
  -webkit-mask-image: linear-gradient(105deg, transparent 55%, #000 100%);
  mask-image: linear-gradient(105deg, transparent 55%, #000 100%);
  pointer-events: none;
}
.bar-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 26px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  position: relative;
  z-index: 1;
}
.brand { display: flex; align-items: center; gap: 16px; }
.shuttle {
  width: 46px; height: 46px;
  border-radius: 50%;
  background: var(--volt);
  display: grid; place-items: center;
  flex: none;
  box-shadow: 0 0 0 4px oklch(0.88 0.185 122 / 0.22);
}
.shuttle span {
  font-family: 'Space Mono', monospace;
  font-weight: 700;
  font-size: 22px;
  color: var(--green-deeper);
  line-height: 1;
}
.wordmark { line-height: 1; }
.wordmark .kick {
  display: block;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--volt);
  margin-bottom: 6px;
}
.wordmark h1 {
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  font-stretch: 125%;
}
.bar-meta { display: flex; align-items: center; gap: 14px; }
.meta-chip {
  background: oklch(1 0 0 / 0.07);
  border: 1px solid oklch(1 0 0 / 0.14);
  border-radius: 999px;
  padding: 9px 16px;
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.meta-chip .num {
  font-family: 'Space Mono', monospace;
  font-weight: 700;
  font-size: 16px;
  color: var(--volt);
}
.meta-chip .lbl {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: oklch(1 0 0 / 0.65);
}

/* ---------- LAYOUT ---------- */
main {
  max-width: 1180px;
  margin: 0 auto;
  padding: 40px 32px 80px;
}
.section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 18px;
}
.section-head .title { display: flex; align-items: center; gap: 14px; }
.section-head h2 {
  font-size: 22px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.01em;
  font-stretch: 120%;
}
.tick {
  width: 8px; height: 26px;
  background: var(--volt);
  border-radius: 2px;
  flex: none;
}
.section-head .sub {
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
}

/* ---------- WEEK CALENDAR ---------- */
.week-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  margin-bottom: 48px;
}
.week-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  background: var(--green-wash);
  border-bottom: 1px solid var(--line);
}
.week-top .month {
  font-weight: 800;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--green-deep);
}
.week-nav { display: flex; align-items: center; gap: 8px; }
.week-nav button {
  width: 34px; height: 34px;
  border-radius: 8px;
  border: 1px solid var(--line);
  background: #fff;
  color: var(--green-deep);
  font-size: 16px;
  cursor: pointer;
  display: grid; place-items: center;
  transition: all .15s ease;
}
.week-nav button:hover { background: var(--green-deep); color: #fff; border-color: var(--green-deep); }
.week-nav .today-btn {
  width: auto;
  padding: 0 14px;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 700;
}
.week-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}
.day {
  border-right: 1px solid var(--line);
  min-height: 200px;
  display: flex;
  flex-direction: column;
}
.day:last-child { border-right: none; }
.day-head {
  padding: 14px 14px 10px;
  text-align: left;
  border-bottom: 1px solid var(--line);
}
.day-head .dow {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--faint);
  display: block;
}
.day-head .dnum {
  font-size: 26px;
  font-weight: 800;
  color: var(--ink);
  line-height: 1.1;
  margin-top: 3px;
}
.day.is-today { background: oklch(0.985 0.02 122); }
.day.is-today .day-head { border-bottom-color: var(--volt-deep); }
.day.is-today .dnum {
  color: var(--green-deep);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.day.is-today .dnum::after {
  content: "TODAY";
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.14em;
  background: var(--volt);
  color: var(--green-deeper);
  padding: 3px 6px;
  border-radius: 5px;
}
.day-body {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}
.chip {
  border-radius: var(--radius-sm);
  padding: 9px 10px 9px 12px;
  position: relative;
  border: 1px solid var(--line);
  background: #fff;
  overflow: hidden;
}
.chip::before {
  content: "";
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 4px;
  background: var(--c, var(--green));
}
.chip .time {
  font-family: 'Space Mono', monospace;
  font-weight: 700;
  font-size: 12px;
  color: var(--ink);
}
.chip .loc {
  font-size: 12px;
  color: var(--muted);
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.chip.win  { --c: var(--win);  background: var(--win-wash);  border-color: oklch(0.88 0.05 155); }
.chip.loss { --c: var(--loss); background: var(--loss-wash); border-color: oklch(0.88 0.045 32); }
.chip.up   { --c: var(--up);  background: var(--up-wash);   border-color: oklch(0.88 0.055 85); }
.day-empty {
  margin: auto;
  color: oklch(0.85 0.01 150);
  font-size: 22px;
  font-weight: 700;
}

/* ---------- TWO COLUMN ---------- */
.columns {
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 40px;
  align-items: start;
}

/* ---------- FORM ---------- */
.form-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  position: sticky;
  top: 24px;
}
.form-card .fc-head {
  background: var(--green-deep);
  color: #fff;
  padding: 18px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.form-card .fc-head .tick { background: var(--volt); }
.form-card .fc-head h2 {
  font-size: 18px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}
.form-body { padding: 24px; }
.field { margin-bottom: 18px; }
.field label {
  display: block;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 7px;
}
.row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.ctrl {
  width: 100%;
  font-family: 'Archivo', sans-serif;
  font-size: 15px;
  color: var(--ink);
  background: oklch(0.975 0.006 150);
  border: 1.5px solid var(--line);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  transition: border-color .15s ease, box-shadow .15s ease, background .15s ease;
}
.ctrl::placeholder { color: var(--faint); }
.ctrl:focus {
  outline: none;
  background: #fff;
  border-color: var(--green);
  box-shadow: 0 0 0 4px oklch(0.56 0.115 158 / 0.13);
}
select.ctrl {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23556' stroke-width='1.8' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 38px;
}
.btn-add {
  width: 100%;
  margin-top: 6px;
  background: var(--volt);
  color: var(--green-deeper);
  border: none;
  border-radius: var(--radius-sm);
  padding: 15px;
  font-family: 'Archivo', sans-serif;
  font-size: 15px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all .15s ease;
  box-shadow: 0 4px 0 var(--volt-deep);
}
.btn-add:hover  { transform: translateY(-1px); box-shadow: 0 5px 0 var(--volt-deep); }
.btn-add:active { transform: translateY(3px);  box-shadow: 0 1px 0 var(--volt-deep); }

/* ---------- SESSION LIST ---------- */
.list { display: flex; flex-direction: column; gap: 14px; }
.session {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  display: grid;
  grid-template-columns: 78px 1fr auto;
  align-items: center;
  gap: 22px;
  padding: 16px 20px 16px 16px;
  transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
}
.session:hover { transform: translateY(-2px); box-shadow: var(--shadow-lift); border-color: oklch(0.86 0.03 155); }
.datetile {
  background: var(--green-deep);
  color: #fff;
  border-radius: var(--radius-sm);
  text-align: center;
  padding: 10px 6px;
  line-height: 1;
}
.datetile .mo {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--volt);
}
.datetile .dd {
  font-size: 30px;
  font-weight: 800;
  margin-top: 4px;
}
.datetile .wd {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: oklch(1 0 0 / 0.6);
  margin-top: 4px;
}
.s-main .s-loc {
  font-size: 18px;
  font-weight: 700;
  color: var(--ink);
}
.s-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 6px;
  flex-wrap: wrap;
}
.s-meta span {
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  color: var(--muted);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.s-meta .dot { width: 4px; height: 4px; border-radius: 50%; background: var(--faint); }
.pill {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 8px 14px;
  border-radius: 999px;
  white-space: nowrap;
}
.pill.win  { background: var(--win);  color: #fff; }
.pill.loss { background: var(--loss); color: #fff; }
.pill.up   { background: var(--up-wash); color: oklch(0.42 0.11 70); border: 1.5px solid oklch(0.78 0.1 80); }
.empty {
  color: var(--muted);
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.1em;
}

/* ---------- FOOTER ---------- */
footer.foot {
  text-align: center;
  padding: 0 0 50px;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--faint);
}

/* ---------- RESPONSIVE ---------- */
@media (max-width: 900px) {
  .columns { grid-template-columns: 1fr; }
  .form-card { position: static; }
}
@media (max-width: 600px) {
  .bar-inner { flex-direction: column; align-items: flex-start; gap: 16px; }
  .week-grid { grid-template-columns: repeat(7, minmax(0, 1fr)); }
  .day-head .dnum { font-size: 18px; }
  main { padding: 24px 16px 60px; }
}
```

- [ ] **Step 2: Open `index.html` in browser**

Verify: page has green header with volt border, Archivo/Space Mono fonts load, background is light green-tinted, no layout errors. (JS not wired to new IDs yet — that's fine.)

---

## Task 2: Replace `index.html` with template-structured HTML

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Replace `index.html` in full**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My Badminton Schedule</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400..900;1,400..800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css" />
</head>
<body>

  <header class="bar">
    <div class="bar-inner">
      <div class="brand">
        <div class="shuttle"><span>🏸</span></div>
        <div class="wordmark">
          <span class="kick">Match Tracker</span>
          <h1>My Badminton Schedule</h1>
        </div>
      </div>
      <div class="bar-meta">
        <div class="meta-chip">
          <span class="num" id="stat-upcoming">00</span>
          <span class="lbl">Upcoming</span>
        </div>
        <div class="meta-chip">
          <span class="num" id="stat-record">0–0</span>
          <span class="lbl">Record</span>
        </div>
      </div>
    </div>
  </header>

  <main>

    <!-- WEEK CALENDAR -->
    <section>
      <div class="section-head">
        <div class="title">
          <span class="tick"></span>
          <h2>This Week</h2>
        </div>
        <span class="sub" id="week-range-label"></span>
      </div>

      <div class="week-card">
        <div class="week-top">
          <div class="month" id="week-month"></div>
          <div class="week-nav">
            <button id="btn-prev" aria-label="Previous week">&#8249;</button>
            <button id="btn-today" class="today-btn">Today</button>
            <button id="btn-next" aria-label="Next week">&#8250;</button>
          </div>
        </div>
        <div class="week-grid" id="week-grid"></div>
      </div>
    </section>

    <div class="columns">

      <!-- ADD SESSION FORM -->
      <section class="form-card">
        <div class="fc-head">
          <span class="tick"></span>
          <h2>Add Session</h2>
        </div>
        <div class="form-body">
          <form id="add-form">
            <div class="row2">
              <div class="field">
                <label for="f-date">Date</label>
                <input class="ctrl" type="date" id="f-date" name="date" required />
              </div>
              <div class="field">
                <label for="f-time">Time</label>
                <input class="ctrl" type="time" id="f-time" name="time" required />
              </div>
            </div>
            <div class="field">
              <label for="f-loc">Location</label>
              <input class="ctrl" type="text" id="f-loc" name="location"
                     placeholder="e.g. Sports Hall Court A" required />
            </div>
            <div class="row2">
              <div class="field">
                <label for="f-games">Games Target</label>
                <input class="ctrl" type="number" id="f-games" name="gamesTarget"
                       min="1" value="5" required />
              </div>
              <div class="field">
                <label for="f-out">Outcome</label>
                <select class="ctrl" id="f-out" name="outcome">
                  <option value="">— Upcoming —</option>
                  <option value="win">Win</option>
                  <option value="loss">Loss</option>
                </select>
              </div>
            </div>
            <button class="btn-add" type="submit">&#xFF0B; Add Session</button>
          </form>
        </div>
      </section>

      <!-- NEXT 30 DAYS -->
      <section>
        <div class="section-head">
          <div class="title">
            <span class="tick"></span>
            <h2>Next 30 Days</h2>
          </div>
          <span class="sub" id="list-count"></span>
        </div>
        <div class="list" id="schedule-list"></div>
      </section>

    </div>
  </main>

  <footer class="foot">My Badminton Schedule · Match Tracker</footer>

  <script src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Open `index.html` in browser**

Verify: header renders with dark green bg + volt border, shuttle icon visible, stat chips show "00 Upcoming" and "0–0 Record", week card box visible (empty grid, month blank), form card sticky with dark green head, "Next 30 Days" section visible, footer present.

---

## Task 3: Replace `app.js` with full render logic

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Replace `app.js` in full**

```javascript
const STORAGE_KEY = 'badminton-schedule';

// ─── Data layer (logic unchanged from prior version) ───────────────────────

function loadSchedule() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveSchedule(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function addEntry(entry) {
  const entries = loadSchedule();
  entries.push(entry);
  saveSchedule(entries);
}

function getUpcomingEntries() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const limit = new Date(today);
  limit.setDate(limit.getDate() + 30);

  return loadSchedule()
    .filter(e => {
      const d = new Date(e.date + 'T00:00:00');
      return d >= today && d <= limit;
    })
    .sort((a, b) => {
      const da = new Date(a.date + 'T' + a.time);
      const db = new Date(b.date + 'T' + b.time);
      return da - db;
    });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ─── Week helpers ───────────────────────────────────────────────────────────

function getWeekMonday(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();          // 0 = Sun
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function toDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + d;
}

function getISOWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// ─── State ──────────────────────────────────────────────────────────────────

let currentWeekStart = getWeekMonday(new Date());

// ─── Render: header stat chips ──────────────────────────────────────────────

function renderHeader() {
  const all = loadSchedule();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const limit = new Date(today);
  limit.setDate(limit.getDate() + 30);

  let upcoming = 0, wins = 0, losses = 0;
  all.forEach(function (e) {
    const d = new Date(e.date + 'T00:00:00');
    if (!e.outcome && d >= today && d <= limit) upcoming++;
    if (e.outcome === 'win')  wins++;
    if (e.outcome === 'loss') losses++;
  });

  document.getElementById('stat-upcoming').textContent =
    String(upcoming).padStart(2, '0');
  document.getElementById('stat-record').textContent =
    wins + '–' + losses;
}

// ─── Render: 7-day week grid ────────────────────────────────────────────────

function renderWeek() {
  var DOW        = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  var MONTHS     = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December'];
  var SHORT_MON  = ['Jan','Feb','Mar','Apr','May','Jun',
                    'Jul','Aug','Sep','Oct','Nov','Dec'];

  var todayStr = toDateString(new Date());
  var sessions = loadSchedule();

  var byDate = {};
  sessions.forEach(function (e) {
    if (!byDate[e.date]) byDate[e.date] = [];
    byDate[e.date].push(e);
  });

  var days = [];
  for (var i = 0; i < 7; i++) {
    var d = new Date(currentWeekStart);
    d.setDate(d.getDate() + i);
    days.push(d);
  }

  // Month / year label
  var sm = days[0].getMonth(), em = days[6].getMonth();
  var yr = days[0].getFullYear();
  document.getElementById('week-month').textContent =
    sm === em
      ? MONTHS[sm].toUpperCase() + ' ' + yr
      : MONTHS[sm].toUpperCase() + ' / ' + MONTHS[em].toUpperCase() + ' ' + yr;

  // Week range label
  var wk = getISOWeek(days[0]);
  var startLbl = days[0].getDate() + ' ' + SHORT_MON[days[0].getMonth()];
  var endLbl   = days[6].getDate() + ' ' + SHORT_MON[days[6].getMonth()];
  document.getElementById('week-range-label').textContent =
    'Week ' + wk + ' · ' + startLbl + '–' + endLbl;

  // Build day columns
  var html = days.map(function (d, i) {
    var dateStr = toDateString(d);
    var isToday = dateStr === todayStr;
    var daySessions = byDate[dateStr] || [];

    var chips = daySessions.map(function (e) {
      var cls = e.outcome === 'win' ? 'win' : e.outcome === 'loss' ? 'loss' : 'up';
      return '<div class="chip ' + cls + '">' +
        '<div class="time">' + escapeHtml(e.time) + '</div>' +
        '<div class="loc">'  + escapeHtml(e.location) + '</div>' +
        '</div>';
    }).join('');

    var body = chips || '<div class="day-empty">·</div>';

    return '<div class="day' + (isToday ? ' is-today' : '') + '">' +
      '<div class="day-head">' +
        '<span class="dow">' + DOW[i] + '</span>' +
        '<span class="dnum">' + d.getDate() + '</span>' +
      '</div>' +
      '<div class="day-body">' + body + '</div>' +
      '</div>';
  }).join('');

  document.getElementById('week-grid').innerHTML = html;
}

// ─── Render: next-30-days list ───────────────────────────────────────────────

function renderList() {
  var SHORT_MON = ['Jan','Feb','Mar','Apr','May','Jun',
                   'Jul','Aug','Sep','Oct','Nov','Dec'];
  var DOW_FULL  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  var entries   = getUpcomingEntries();
  var container = document.getElementById('schedule-list');

  document.getElementById('list-count').textContent =
    entries.length + ' session' + (entries.length !== 1 ? 's' : '');

  if (entries.length === 0) {
    container.innerHTML = '<p class="empty">No sessions in the next 30 days.</p>';
    return;
  }

  container.innerHTML = entries.map(function (e) {
    var d   = new Date(e.date + 'T00:00:00');
    var mo  = SHORT_MON[d.getMonth()];
    var dd  = String(d.getDate()).padStart(2, '0');
    var wd  = DOW_FULL[d.getDay()];

    var pillClass = e.outcome === 'win' ? 'win' : e.outcome === 'loss' ? 'loss' : 'up';
    var pillLabel = e.outcome === 'win' ? 'Win' : e.outcome === 'loss' ? 'Loss' : 'Upcoming';

    var detail = e.outcome
      ? 'Result recorded'
      : 'Target ' + escapeHtml(String(e.gamesTarget)) +
        ' game' + (e.gamesTarget !== 1 ? 's' : '');

    return '<article class="session">' +
      '<div class="datetile">' +
        '<div class="mo">' + mo + '</div>' +
        '<div class="dd">' + dd + '</div>' +
        '<div class="wd">' + wd + '</div>' +
      '</div>' +
      '<div class="s-main">' +
        '<div class="s-loc">' + escapeHtml(e.location) + '</div>' +
        '<div class="s-meta">' +
          '<span>' + escapeHtml(e.time) + '</span>' +
          '<span class="dot"></span>' +
          '<span>' + detail + '</span>' +
        '</div>' +
      '</div>' +
      '<span class="pill ' + pillClass + '">' + pillLabel + '</span>' +
      '</article>';
  }).join('');
}

// ─── Render all ──────────────────────────────────────────────────────────────

function renderAll() {
  renderHeader();
  renderWeek();
  renderList();
}

// ─── Init ────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
  renderAll();

  document.getElementById('btn-prev').addEventListener('click', function () {
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    renderWeek();
  });

  document.getElementById('btn-today').addEventListener('click', function () {
    currentWeekStart = getWeekMonday(new Date());
    renderWeek();
  });

  document.getElementById('btn-next').addEventListener('click', function () {
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    renderWeek();
  });

  document.getElementById('add-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var form = e.target;

    var entry = {
      id:          Date.now().toString(),
      date:        form.date.value,
      time:        form.time.value,
      location:    form.location.value.trim(),
      gamesTarget: parseInt(form.gamesTarget.value, 10),
      outcome:     form.outcome.value
    };

    addEntry(entry);
    renderAll();
    form.reset();
  });
});
```

- [ ] **Step 2: Open `index.html` in browser — verify initial render**

- Header stat chips show "00" and "0–0"
- Week grid shows 7 columns with correct day names and dates
- Today's column has yellow-tinted background + "TODAY" badge on the date number
- Month label and week range label populated (e.g. "MAY 2026", "Week 22 · 25–31 May")
- Form card renders with volt "＋ Add Session" button
- "Next 30 Days" list shows "0 sessions" and empty message

- [ ] **Step 3: Verify week navigation**

- Click `‹` → week shifts back 7 days, month/range labels update
- Click `Today` → returns to current week, today column highlighted again
- Click `›` → week advances 7 days

- [ ] **Step 4: Verify add session form**

Fill in the form with today's date, a time, a location, games target 3, outcome "Win". Submit.

Expected:
- Session chip appears in today's day column in the week grid
- Session card appears in "Next 30 Days" list with green "Win" pill
- Header record chip updates to "1–0"
- Form resets to empty

- [ ] **Step 5: Verify upcoming count**

Add a second session with a date within the next 30 days and outcome blank (upcoming).

Expected:
- "Upcoming" chip in header increments to "01"
- New card appears in list with yellow "Upcoming" pill

- [ ] **Step 6: Commit**

```bash
git add index.html style.css app.js
git commit -m "feat: apply template design + add week calendar view"
```

---

## Task 4: Deploy to GitHub Pages

**Files:** none (git push only)

- [ ] **Step 1: Push master to origin**

```bash
git push origin master
```

Expected output ends with: `master -> master`

- [ ] **Step 2: Enable GitHub Pages (if not already enabled)**

Go to: `https://github.com/mervyn-alba-project/my-badminton-schedule/settings/pages`

Set source: **Deploy from a branch → master → / (root)**. Save.

- [ ] **Step 3: Verify live site**

Wait ~1 minute, then open:
`https://mervyn-alba-project.github.io/my-badminton-schedule/`

Verify page loads with correct styling (green header, week grid, form). Add a test session and confirm it persists after page refresh.
