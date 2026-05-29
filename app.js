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
  var startYr = days[0].getFullYear();
  var endYr   = days[6].getFullYear();
  document.getElementById('week-month').textContent =
    sm === em
      ? MONTHS[sm].toUpperCase() + ' ' + startYr
      : MONTHS[sm].toUpperCase() + ' ' + startYr +
        ' / ' + MONTHS[em].toUpperCase() + ' ' + endYr;

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
