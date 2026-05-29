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
