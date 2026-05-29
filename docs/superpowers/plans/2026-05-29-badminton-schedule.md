# Badminton Schedule App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page personal web app to add and view upcoming badminton sessions over the next 30 days.

**Architecture:** Three static files — `index.html` (structure), `style.css` (presentation), `app.js` (all logic). Data persists in `localStorage` under key `badminton-schedule`. No server, no build step — open `index.html` directly in a browser.

**Tech Stack:** Plain HTML5, CSS3, vanilla JavaScript (ES6+), localStorage API.

---

## File Map

| File | Responsibility |
|------|---------------|
| `index.html` | Page structure: header, add-session form, schedule list container |
| `style.css` | Layout, card styles, outcome badge colors |
| `app.js` | Data layer (load/save/add), filtering/sorting, rendering, form handler |

---

### Task 1: Scaffold — HTML skeleton + file wiring

**Files:**
- Create: `index.html`
- Create: `style.css`
- Create: `app.js`

- [ ] **Step 1: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My Badminton Schedule</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <header>
    <h1>My Badminton Schedule</h1>
  </header>

  <main>
    <section class="form-section">
      <h2>Add Session</h2>
      <form id="add-form">
        <label>
          Date
          <input type="date" name="date" required />
        </label>
        <label>
          Time
          <input type="time" name="time" required />
        </label>
        <label>
          Location
          <input type="text" name="location" placeholder="e.g. Sports Hall Court A" required />
        </label>
        <label>
          Games Target
          <input type="number" name="gamesTarget" min="1" value="5" required />
        </label>
        <label>
          Outcome
          <select name="outcome">
            <option value="">— Upcoming —</option>
            <option value="win">Win</option>
            <option value="loss">Loss</option>
            <option value="draw">Draw</option>
          </select>
        </label>
        <button type="submit">Add Session</button>
      </form>
    </section>

    <section class="schedule-section">
      <h2>Next 30 Days</h2>
      <div id="schedule-list"></div>
    </section>
  </main>

  <script src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create empty `style.css`**

```css
/* styles added in Task 5 */
```

- [ ] **Step 3: Create empty `app.js`**

```js
// logic added in Tasks 2–4
```

- [ ] **Step 4: Open `index.html` in browser**

Expected: Page loads, shows "My Badminton Schedule" heading, form with 5 fields, and empty schedule section. No console errors.

- [ ] **Step 5: Commit**

```bash
git add index.html style.css app.js
git commit -m "feat: scaffold HTML structure with form and schedule container"
```

---

### Task 2: Data layer — localStorage CRUD + filtering

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Write data functions in `app.js`**

Replace the placeholder comment with:

```js
const STORAGE_KEY = 'badminton-schedule';

function loadSchedule() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
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
```

- [ ] **Step 2: Verify data layer in browser console**

Open `index.html`, open DevTools console, paste and run:

```js
addEntry({ id: '1', date: new Date().toISOString().slice(0,10), time: '18:00', location: 'Test Court', gamesTarget: 3, outcome: '' });
console.assert(loadSchedule().length === 1, 'FAIL: expected 1 entry');
console.assert(getUpcomingEntries().length === 1, 'FAIL: expected 1 upcoming entry');
console.log('Data layer OK');
localStorage.removeItem('badminton-schedule');
```

Expected output: `Data layer OK` with no assertion failures.

- [ ] **Step 3: Commit**

```bash
git add app.js
git commit -m "feat: add localStorage data layer with load/save/add/filter functions"
```

---

### Task 3: Render — schedule list to DOM

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Add `formatDate` and `renderSchedule` functions**

Append to `app.js`:

```js
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
  });
}

function renderSchedule() {
  const entries = getUpcomingEntries();
  const container = document.getElementById('schedule-list');

  if (entries.length === 0) {
    container.innerHTML = '<p class="empty">No sessions in the next 30 days.</p>';
    return;
  }

  container.innerHTML = entries.map(e => {
    const badgeClass = e.outcome ? `badge-${e.outcome}` : 'badge-upcoming';
    const badgeLabel = e.outcome
      ? e.outcome.charAt(0).toUpperCase() + e.outcome.slice(1)
      : 'Upcoming';

    return `
      <div class="card">
        <div class="card-header">
          <span class="card-date">${formatDate(e.date)} &bull; ${e.time}</span>
          <span class="badge ${badgeClass}">${badgeLabel}</span>
        </div>
        <div class="card-body">
          <div class="card-location">${e.location}</div>
          <div class="card-games">Target: ${e.gamesTarget} game${e.gamesTarget !== 1 ? 's' : ''}</div>
        </div>
      </div>
    `;
  }).join('');
}
```

- [ ] **Step 2: Call `renderSchedule` on page load**

Append to `app.js`:

```js
document.addEventListener('DOMContentLoaded', renderSchedule);
```

- [ ] **Step 3: Verify render in browser console**

Open `index.html`, open DevTools console, paste and run:

```js
addEntry({ id: '1', date: new Date().toISOString().slice(0,10), time: '19:00', location: 'Sports Hall', gamesTarget: 5, outcome: 'win' });
renderSchedule();
```

Expected: Card appears showing today's date, "Sports Hall", "Target: 5 games", green "Win" badge.

Then clean up:

```js
localStorage.removeItem('badminton-schedule');
renderSchedule();
```

Expected: "No sessions in the next 30 days." message.

- [ ] **Step 4: Commit**

```bash
git add app.js
git commit -m "feat: render upcoming sessions as cards with date, location, games target, outcome badge"
```

---

### Task 4: Form handler — add session on submit

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Add form submit handler**

Append to `app.js` (after the `DOMContentLoaded` line):

```js
document.getElementById('add-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const form = e.target;

  const entry = {
    id: Date.now().toString(),
    date: form.date.value,
    time: form.time.value,
    location: form.location.value.trim(),
    gamesTarget: parseInt(form.gamesTarget.value, 10),
    outcome: form.outcome.value
  };

  addEntry(entry);
  renderSchedule();
  form.reset();
});
```

- [ ] **Step 2: Verify form submission in browser**

Open `index.html`. Fill in the form:
- Date: any date within the next 30 days
- Time: 19:00
- Location: Sports Hall
- Games Target: 5
- Outcome: leave blank

Click "Add Session".

Expected:
- Card appears in schedule list with correct data and "Upcoming" badge
- Form fields clear
- No console errors

Add a second entry with outcome "Win". Expected: card shows green "Win" badge.

- [ ] **Step 3: Verify data persists across page reload**

Reload the page. Expected: both cards still present (data survived reload via localStorage).

- [ ] **Step 4: Commit**

```bash
git add app.js
git commit -m "feat: wire add-session form to data layer with re-render and form reset"
```

---

### Task 5: Styling — layout, cards, badges

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Write full stylesheet**

Replace the placeholder comment in `style.css` with:

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: system-ui, sans-serif;
  background: #f4f6f8;
  color: #1a1a2e;
  min-height: 100vh;
}

header {
  background: #16213e;
  color: #fff;
  padding: 1.25rem 2rem;
}

header h1 {
  font-size: 1.5rem;
  font-weight: 700;
}

main {
  max-width: 700px;
  margin: 2rem auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

h2 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #16213e;
}

/* Form */
.form-section {
  background: #fff;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}

form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

label {
  display: flex;
  flex-direction: column;
  font-size: 0.8rem;
  font-weight: 600;
  color: #555;
  gap: 0.3rem;
}

input, select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #1a1a2e;
  background: #fafafa;
}

input:focus, select:focus {
  outline: none;
  border-color: #0f3460;
}

button[type="submit"] {
  grid-column: 1 / -1;
  padding: 0.65rem;
  background: #0f3460;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.25rem;
}

button[type="submit"]:hover {
  background: #16213e;
}

/* Schedule cards */
.schedule-section {
  display: flex;
  flex-direction: column;
}

#schedule-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.empty {
  color: #888;
  font-size: 0.95rem;
}

.card {
  background: #fff;
  border-radius: 10px;
  padding: 1rem 1.25rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.card-date {
  font-weight: 600;
  font-size: 0.95rem;
}

.card-body {
  display: flex;
  gap: 1.5rem;
  font-size: 0.875rem;
  color: #555;
}

/* Outcome badges */
.badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.badge-win      { background: #d4edda; color: #155724; }
.badge-loss     { background: #f8d7da; color: #721c24; }
.badge-draw     { background: #e2e3e5; color: #383d41; }
.badge-upcoming { background: #fff3cd; color: #856404; }

@media (max-width: 480px) {
  form { grid-template-columns: 1fr; }
}
```

- [ ] **Step 2: Verify styling in browser**

Open `index.html`. Expected:
- Dark navy header
- White form card with 2-column grid layout
- "Add Session" button spans full width
- Schedule cards render cleanly with colored badges
- Page looks consistent on narrow viewport (single column form)

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add full page styling with card layout and outcome badge colors"
```

---

### Task 6: Final smoke test

**Files:** none modified

- [ ] **Step 1: Clear all data and do a full walkthrough**

Open DevTools console, run:
```js
localStorage.removeItem('badminton-schedule');
location.reload();
```

Expected: "No sessions in the next 30 days."

- [ ] **Step 2: Add a future session (no outcome)**

Fill form with a date 7 days from today, time 19:00, location "Sports Hall", games target 5, outcome blank. Submit.

Expected: Card appears with "Upcoming" yellow badge.

- [ ] **Step 3: Add a past session with outcome**

Fill form with today's date, time 09:00, location "Community Centre Court 2", games target 3, outcome "Win". Submit.

Expected: Card appears (today is within 30-day window) with green "Win" badge, sorted before the future session.

- [ ] **Step 4: Add a session more than 30 days out**

Fill form with a date 35 days from today. Submit.

Expected: Card does NOT appear in the list (outside 30-day window). Open console, run `loadSchedule()` — entry is stored but `getUpcomingEntries()` filters it out.

- [ ] **Step 5: Reload and confirm persistence**

Reload the page. Expected: Both visible cards still present, order preserved.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "chore: verified full app flow — add, render, filter, persist"
```
