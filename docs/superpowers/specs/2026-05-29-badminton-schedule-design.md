# Badminton Schedule App — Design Spec

**Date:** 2026-05-29  
**Stack:** Plain HTML/CSS/JS, no build tools  
**Storage:** Browser localStorage

---

## Overview

Single-user personal web app. One `index.html` file opened directly in a browser. Tracks badminton sessions for the next 30 days.

---

## Data Model

Stored as a JSON array under localStorage key `badminton-schedule`.

Each entry:

```json
{
  "id": "<timestamp string>",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "location": "string",
  "gamesTarget": 5,
  "outcome": "win" | "loss" | "draw" | ""
}
```

- `id`: `Date.now().toString()` at time of creation — unique enough for single-user use
- `outcome`: empty string means session is upcoming / result not yet recorded

---

## UI Layout

Single page, top to bottom:

### 1. Header
- Title: "My Badminton Schedule"

### 2. Add Session Form
Fields:
- Date (date input, required)
- Time (time input, required)
- Location (text input, required)
- Games Target (number input, min 1, required)
- Outcome (select: blank / Win / Loss / Draw — blank for future sessions)

Submit button: "Add Session"

### 3. Schedule List
- Shows entries where date falls within the next 30 days from today
- Sorted ascending by date then time
- Each card displays: date, time, location, games target, outcome badge
- Outcome badge colors: green = win, red = loss, grey = draw, white/muted = upcoming (blank)

---

## Behavior

**On page load:**
1. Read `badminton-schedule` from localStorage (default to empty array if absent)
2. Filter to entries with date within [today, today + 30 days] inclusive
3. Sort ascending by date + time
4. Render cards

**Add form submit:**
1. Validate: date, time, location, gamesTarget are filled
2. Build entry object with generated id
3. Load full array from localStorage, push new entry, save back
4. Re-render schedule list (re-filter and re-sort)
5. Clear form fields

**Notes:**
- Past sessions can be added (e.g., to record outcome after the fact) — they simply won't appear in the 30-day view
- No edit or delete functionality in this version
- Data is scoped to the browser; clearing localStorage clears all data
