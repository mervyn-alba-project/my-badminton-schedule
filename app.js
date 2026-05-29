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

document.addEventListener('DOMContentLoaded', renderSchedule);
