# Reskin + Week View — Design Spec

**Date:** 2026-05-29  
**Approach:** A — Reskin existing files, add week calendar

---

## Overview

Apply the `Badminton Schedule.html` template visual design to the working app (`index.html` + `style.css` + `app.js`). Add a 7-day week calendar view with navigation. Deploy to GitHub Pages via `master` branch.

No data model changes. Existing localStorage logic is untouched.

---

## HTML (`index.html`)

Structure mirrors the template exactly:

### Header `.bar`
- Dark green background with volt accent border
- Brand: shuttle icon + "Match Tracker" / "My Badminton Schedule" wordmark
- Right side: two stat chips — **Upcoming count** and **W–L record**
- Both chips are JS-driven (`id="stat-upcoming"`, `id="stat-record"`)

### Week Section
- `.section-head` with "This Week" title + week range label (`id="week-range-label"`)
- `.week-card` containing:
  - `.week-top`: month label (`id="week-month"`) + nav buttons (prev `#btn-prev`, today `#btn-today`, next `#btn-next`)
  - `.week-grid`: 7 `.day` divs built by JS, `is-today` class on current day

### Two-Column Layout `.columns`
Left: sticky `.form-card` with Add Session form (same fields: date, time, location, gamesTarget, outcome). Uses template classes: `.ctrl`, `.field`, `.row2`, `.btn-add`.

Right: `.section-head` + `.list` of `.session` cards (date tile, main info, pill badge). Sub-label shows total count (`id="list-count"`).

---

## CSS (`style.css`)

Full replacement. Design tokens from template:

```css
:root {
  --bg, --surface, --ink, --muted, --faint, --line
  --green, --green-strong, --green-deep, --green-deeper, --green-wash
  --volt, --volt-deep
  --win, --win-wash, --loss, --loss-wash, --up, --up-wash
  --radius: 14px, --radius-sm: 9px, --shadow, --shadow-lift
}
```

Fonts: Archivo (body) + Space Mono (mono labels) via Google Fonts.

All component styles from template: `.bar`, `.week-card`, `.week-grid`, `.day`, `.chip`, `.form-card`, `.ctrl`, `.btn-add`, `.session`, `.datetile`, `.pill`.

---

## JS (`app.js`)

### State
- `currentWeekStart` — Date object, always a Monday. Initialised to Monday of current week.

### New functions

**`getWeekMonday(date)`** — returns Monday of the week containing `date`.

**`renderWeek()`**
1. Compute 7 dates from `currentWeekStart`
2. Load all sessions, index by date string
3. Build 7 `.day` divs: DOW label, date number, `is-today` if matches today
4. For sessions on that day: render `.chip` with class `win` / `loss` / `up` (upcoming), showing time + location
5. Inject into `#week-grid`
6. Update `#week-month` (e.g. "May 2026") and `#week-range-label` (e.g. "Week 22 · 25–31 May")

**`renderList()`** — replaces current `renderSchedule()`. Outputs `.session` / `.datetile` / `.pill` markup for next-30-days entries. Updates `#list-count`.

**`renderHeader()`** — computes upcoming count and W–L record from full localStorage array. Updates `#stat-upcoming` and `#stat-record`.

**`renderAll()`** — calls `renderWeek()`, `renderList()`, `renderHeader()`.

### Week navigation
- `#btn-prev`: subtract 7 days from `currentWeekStart`, call `renderWeek()`
- `#btn-today`: reset `currentWeekStart` to current week Monday, call `renderWeek()`
- `#btn-next`: add 7 days, call `renderWeek()`

### Form submit
Same validation + `addEntry()` call as now, then `renderAll()` + `form.reset()`.

---

## Deployment

Push `master` to `github.com/mervyn-alba-project/my-badminton-schedule`. GitHub Pages configured to serve from `master` root.
