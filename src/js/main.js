console.log("LabOS booting...");

// --- Screen navigation ---
const dashboard = document.getElementById("app");
const settingsScreen = document.getElementById("settings-screen");
const settingsBtn = document.getElementById("settings-btn");
const backBtn = document.getElementById("back-btn");

function showSettings() {
  dashboard.classList.remove("active");
  settingsScreen.classList.add("active");
}

function showDashboard() {
  settingsScreen.classList.remove("active");
  dashboard.classList.add("active");
}

settingsBtn.addEventListener("click", showSettings);
backBtn.addEventListener("click", showDashboard);

// --- Theme picker rendering ---
const themeSwatchColors = {
  "matrix-green": "#39ff14",
  "cyber-amber": "#ffb000",
  "neon-cyan": "#00fff9"
};

const themeLabels = {
  "matrix-green": "Matrix Green",
  "cyber-amber": "Cyber Amber",
  "neon-cyan": "Neon Cyan"
};

function renderThemePicker() {
  const picker = document.getElementById("theme-picker");
  const active = getSavedTheme();
  picker.innerHTML = "";

  Object.keys(themeSwatchColors).forEach((themeName) => {
    const swatch = document.createElement("div");
    swatch.className = "theme-swatch" + (themeName === active ? " selected" : "");

    const dot = document.createElement("div");
    dot.className = "swatch-dot";
    dot.style.background = themeSwatchColors[themeName];

    const label = document.createElement("span");
    label.className = "swatch-label";
    label.textContent = themeLabels[themeName];

    swatch.appendChild(dot);
    swatch.appendChild(label);

    swatch.addEventListener("click", () => {
      applyTheme(themeName);
      renderThemePicker(); // re-render to update "selected" highlight
    });

    picker.appendChild(swatch);
  });
}

renderThemePicker();

// --- Font picker rendering ---
const fontLabels = {
  "courier": "Courier (Classic)",
  "jetbrains": "JetBrains Mono",
  "vt323": "VT323 (Pixel CRT)"
};

function renderFontPicker() {
  const picker = document.getElementById("font-picker");
  const active = getSavedFont();
  picker.innerHTML = "";

  Object.keys(fontLabels).forEach((fontName) => {
    const swatch = document.createElement("div");
    swatch.className = "theme-swatch" + (fontName === active ? " selected" : "");

    const label = document.createElement("span");
    label.className = "swatch-label";
    label.style.fontFamily = FONTS[fontName];
    label.textContent = fontLabels[fontName];

    swatch.appendChild(label);

    swatch.addEventListener("click", () => {
      applyFont(fontName);
      renderFontPicker();
    });

    picker.appendChild(swatch);
  });
}

renderFontPicker();

// --- Study Tracker ---
const SESSIONS_KEY = "labos-study-sessions";

function getSessions() {
  const raw = localStorage.getItem(SESSIONS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveSessions(sessions) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

function renderSessions() {
  const list = document.getElementById("session-list");
  const sessions = getSessions();
  list.innerHTML = "";

  sessions.forEach((session) => {
    const li = document.createElement("li");
    li.className = "session-item";

    const subjectSpan = document.createElement("span");
    subjectSpan.className = "session-item-subject";
    subjectSpan.textContent = session.subject;

    const minutesSpan = document.createElement("span");
    minutesSpan.className = "session-item-minutes";
    minutesSpan.textContent = `${session.minutes} min`;

    li.appendChild(subjectSpan);
    li.appendChild(minutesSpan);
    list.appendChild(li);
  });
}

function addSession() {
  const subjectInput = document.getElementById("subject-input");
  const minutesInput = document.getElementById("minutes-input");

  const subject = subjectInput.value.trim();
  const minutes = parseInt(minutesInput.value, 10);

  if (!subject || !minutes || minutes <= 0) {
    return;
  }

  const sessions = getSessions();
  sessions.unshift({ subject, minutes, timestamp: Date.now() });
  saveSessions(sessions);
  renderSessions();

  subjectInput.value = "";
  minutesInput.value = "";
}

document.getElementById("add-session-btn").addEventListener("click", addSession);
renderSessions();

// --- Research Journal ---
const JOURNAL_KEY = "labos-journal-entries";

function getJournalEntries() {
  const raw = localStorage.getItem(JOURNAL_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveJournalEntries(entries) {
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
}

function formatEntryDate(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) +
    " " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function renderJournal() {
  const list = document.getElementById("journal-list");
  const entries = getJournalEntries();
  list.innerHTML = "";

  entries.forEach((entry) => {
    const li = document.createElement("li");
    li.className = "session-item journal-entry";

    const dateSpan = document.createElement("span");
    dateSpan.className = "journal-entry-date";
    dateSpan.textContent = formatEntryDate(entry.timestamp);

    const bodySpan = document.createElement("span");
    bodySpan.className = "journal-entry-body";
    bodySpan.textContent = entry.body;

    li.appendChild(dateSpan);
    li.appendChild(bodySpan);
    list.appendChild(li);
  });
}

function addJournalEntry() {
  const input = document.getElementById("journal-input");
  const body = input.value.trim();

  if (!body) {
    return;
  }

  const entries = getJournalEntries();
  entries.unshift({ body, timestamp: Date.now() });
  saveJournalEntries(entries);
  renderJournal();

  input.value = "";
}

document.getElementById("add-entry-btn").addEventListener("click", addJournalEntry);
renderJournal();
