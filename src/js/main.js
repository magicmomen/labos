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
      renderThemePicker();
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

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "✕";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteSession(session.id);
    });

    li.appendChild(subjectSpan);
    li.appendChild(minutesSpan);
    li.appendChild(deleteBtn);
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
  sessions.unshift({ id: Date.now(), subject, minutes, timestamp: Date.now() });
  saveSessions(sessions);
  renderSessions();

  subjectInput.value = "";
  minutesInput.value = "";
}

function deleteSession(id) {
  const sessions = getSessions().filter((s) => s.id !== id);
  saveSessions(sessions);
  renderSessions();
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

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "✕";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteJournalEntry(entry.id);
    });

    li.appendChild(dateSpan);
    li.appendChild(bodySpan);
    li.appendChild(deleteBtn);
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
  entries.unshift({ id: Date.now(), body, timestamp: Date.now() });
  saveJournalEntries(entries);
  renderJournal();

  input.value = "";
}

function deleteJournalEntry(id) {
  const entries = getJournalEntries().filter((e) => e.id !== id);
  saveJournalEntries(entries);
  renderJournal();
}

document.getElementById("add-entry-btn").addEventListener("click", addJournalEntry);
renderJournal();

// --- Task Manager ---
const TASKS_KEY = "labos-tasks";

function getTasks() {
  const raw = localStorage.getItem(TASKS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function renderTasks() {
  const list = document.getElementById("task-list");
  const tasks = getTasks();
  list.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "session-item task-item" + (task.completed ? " completed" : "");

    const checkbox = document.createElement("span");
    checkbox.className = "task-item-checkbox";
    checkbox.textContent = task.completed ? "✓" : "";

    const label = document.createElement("span");
    label.className = "task-item-label";
    label.textContent = task.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "✕";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteTask(task.id);
    });

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(deleteBtn);

    li.addEventListener("click", () => toggleTask(task.id));

    list.appendChild(li);
  });
}

function addTask() {
  const input = document.getElementById("task-input");
  const text = input.value.trim();

  if (!text) {
    return;
  }

  const tasks = getTasks();
  tasks.unshift({ id: Date.now(), text, completed: false });
  saveTasks(tasks);
  renderTasks();

  input.value = "";
}

function toggleTask(id) {
  const tasks = getTasks();
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks(tasks);
    renderTasks();
  }
}

function deleteTask(id) {
  const tasks = getTasks().filter((t) => t.id !== id);
  saveTasks(tasks);
  renderTasks();
}

document.getElementById("add-task-btn").addEventListener("click", addTask);
renderTasks();


// --- Pomodoro Timer (with custom durations + break mode) ---
let pomodoroMode = "focus"; // "focus" or "break"
let pomodoroSecondsLeft = 25 * 60;
let pomodoroTotalSeconds = 25 * 60;
let pomodoroIntervalId = null;

function getFocusDuration() {
  const val = parseInt(document.getElementById("focus-duration-input").value, 10);
  return (val && val > 0) ? val * 60 : 25 * 60;
}

function getBreakDuration() {
  const val = parseInt(document.getElementById("break-duration-input").value, 10);
  return (val && val > 0) ? val * 60 : 5 * 60;
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function renderPomodoro() {
  document.getElementById("pomodoro-time").textContent = formatTime(pomodoroSecondsLeft);
  document.getElementById("pomodoro-mode-label").textContent =
    pomodoroMode === "focus" ? "FOCUS" : "BREAK";
  const percentElapsed = ((pomodoroTotalSeconds - pomodoroSecondsLeft) / pomodoroTotalSeconds) * 100;
  document.getElementById("pomodoro-progress-fill").style.width = `${percentElapsed}%`;
}

function switchPomodoroMode() {
  pomodoroMode = pomodoroMode === "focus" ? "break" : "focus";
  pomodoroTotalSeconds = pomodoroMode === "focus" ? getFocusDuration() : getBreakDuration();
  pomodoroSecondsLeft = pomodoroTotalSeconds;
  renderPomodoro();
}

function pomodoroTick() {
  if (pomodoroSecondsLeft <= 0) {
    switchPomodoroMode();
    return;
  }
  pomodoroSecondsLeft -= 1;
  renderPomodoro();
}

function startPomodoro() {
  if (pomodoroIntervalId !== null) {
    return;
  }
  pomodoroIntervalId = setInterval(pomodoroTick, 1000);
}

function pausePomodoro() {
  if (pomodoroIntervalId !== null) {
    clearInterval(pomodoroIntervalId);
    pomodoroIntervalId = null;
  }
}

function resetPomodoro() {
  pausePomodoro();
  pomodoroMode = "focus";
  pomodoroTotalSeconds = getFocusDuration();
  pomodoroSecondsLeft = pomodoroTotalSeconds;
  renderPomodoro();
}

document.getElementById("pomodoro-start-btn").addEventListener("click", startPomodoro);
document.getElementById("pomodoro-pause-btn").addEventListener("click", pausePomodoro);
document.getElementById("pomodoro-reset-btn").addEventListener("click", resetPomodoro);
document.getElementById("focus-duration-input").addEventListener("change", () => {
  if (pomodoroMode === "focus" && pomodoroIntervalId === null) {
    pomodoroTotalSeconds = getFocusDuration();
    pomodoroSecondsLeft = pomodoroTotalSeconds;
    renderPomodoro();
  }
});
document.getElementById("break-duration-input").addEventListener("change", () => {
  if (pomodoroMode === "break" && pomodoroIntervalId === null) {
    pomodoroTotalSeconds = getBreakDuration();
    pomodoroSecondsLeft = pomodoroTotalSeconds;
    renderPomodoro();
  }
});

resetPomodoro();

// --- Custom Widget Editor ---
const CUSTOM_WIDGETS_KEY = "labos-custom-widgets";

function getCustomWidgets() {
  const raw = localStorage.getItem(CUSTOM_WIDGETS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveCustomWidgets(widgets) {
  localStorage.setItem(CUSTOM_WIDGETS_KEY, JSON.stringify(widgets));
}

function getWidgetDataKey(widgetId) {
  return `labos-widget-data-${widgetId}`;
}

function getWidgetData(widgetId, defaultValue) {
  const raw = localStorage.getItem(getWidgetDataKey(widgetId));
  return raw ? JSON.parse(raw) : defaultValue;
}

function saveWidgetData(widgetId, data) {
  localStorage.setItem(getWidgetDataKey(widgetId), JSON.stringify(data));
}

function openWidgetModal() {
  document.getElementById("widget-modal").classList.add("active");
}

function closeWidgetModal() {
  document.getElementById("widget-modal").classList.remove("active");
  document.getElementById("widget-title-input").value = "";
}

function createCustomWidget() {
  const title = document.getElementById("widget-title-input").value.trim();
  const type = document.getElementById("widget-type-input").value;
  const color = document.getElementById("widget-color-input").value;

  if (!title) {
    return;
  }

  const widgets = getCustomWidgets();
  widgets.push({ id: Date.now(), title, type, color });
  saveCustomWidgets(widgets);
  closeWidgetModal();
  renderCustomWidgets();
}

function deleteCustomWidget(id) {
  const widgets = getCustomWidgets().filter((w) => w.id !== id);
  saveCustomWidgets(widgets);
  localStorage.removeItem(getWidgetDataKey(id));
  renderCustomWidgets();
}

function buildNoteWidget(widget, body) {
  const textarea = document.createElement("textarea");
  textarea.className = "tracker-input journal-textarea";
  textarea.value = getWidgetData(widget.id, "");
  textarea.addEventListener("input", () => {
    saveWidgetData(widget.id, textarea.value);
  });
  body.appendChild(textarea);
}

function buildCounterWidget(widget, body) {
  const display = document.createElement("div");
  display.className = "pomodoro-display";
  const countSpan = document.createElement("span");
  countSpan.id = `counter-value-${widget.id}`;
  countSpan.style.fontSize = "2rem";
  countSpan.textContent = getWidgetData(widget.id, 0);
  display.appendChild(countSpan);

  const controls = document.createElement("div");
  controls.className = "tracker-form";

  const minusBtn = document.createElement("button");
  minusBtn.className = "icon-btn";
  minusBtn.textContent = "−";
  minusBtn.addEventListener("click", () => {
    const current = getWidgetData(widget.id, 0) - 1;
    saveWidgetData(widget.id, current);
    countSpan.textContent = current;
  });

  const plusBtn = document.createElement("button");
  plusBtn.className = "icon-btn";
  plusBtn.textContent = "+";
  plusBtn.addEventListener("click", () => {
    const current = getWidgetData(widget.id, 0) + 1;
    saveWidgetData(widget.id, current);
    countSpan.textContent = current;
  });

  controls.appendChild(minusBtn);
  controls.appendChild(plusBtn);
  body.appendChild(display);
  body.appendChild(controls);
}

function buildChecklistWidget(widget, body) {
  const form = document.createElement("div");
  form.className = "tracker-form";

  const input = document.createElement("input");
  input.type = "text";
  input.className = "tracker-input";
  input.placeholder = "New item...";

  const addBtn = document.createElement("button");
  addBtn.className = "icon-btn";
  addBtn.textContent = "+ ADD";

  const list = document.createElement("ul");
  list.className = "session-list";

  function renderItems() {
    const items = getWidgetData(widget.id, []);
    list.innerHTML = "";
    items.forEach((item) => {
      const li = document.createElement("li");
      li.className = "session-item task-item" + (item.done ? " completed" : "");

      const checkbox = document.createElement("span");
      checkbox.className = "task-item-checkbox";
      checkbox.textContent = item.done ? "✓" : "";

      const label = document.createElement("span");
      label.className = "task-item-label";
      label.textContent = item.text;

      const del = document.createElement("button");
      del.className = "delete-btn";
      del.textContent = "✕";
      del.addEventListener("click", (e) => {
        e.stopPropagation();
        const updated = getWidgetData(widget.id, []).filter((i) => i.id !== item.id);
        saveWidgetData(widget.id, updated);
        renderItems();
      });

      li.appendChild(checkbox);
      li.appendChild(label);
      li.appendChild(del);
      li.addEventListener("click", () => {
        const updated = getWidgetData(widget.id, []);
        const found = updated.find((i) => i.id === item.id);
        found.done = !found.done;
        saveWidgetData(widget.id, updated);
        renderItems();
      });

      list.appendChild(li);
    });
  }

  addBtn.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) return;
    const items = getWidgetData(widget.id, []);
    items.unshift({ id: Date.now(), text, done: false });
    saveWidgetData(widget.id, items);
    input.value = "";
    renderItems();
  });

  form.appendChild(input);
  form.appendChild(addBtn);
  body.appendChild(form);
  body.appendChild(list);
  renderItems();
}

function renderCustomWidgets() {
  document.querySelectorAll(".custom-widget").forEach((el) => el.remove());

  const widgets = getCustomWidgets();
  const container = document.getElementById("app");
  const addBtn = document.getElementById("add-widget-btn");

  widgets.forEach((widget) => {
    const section = document.createElement("section");
    section.className = "widget custom-widget";
    section.style.borderColor = widget.color;

    const removeBtn = document.createElement("button");
    removeBtn.className = "delete-btn custom-widget-remove";
    removeBtn.textContent = "✕";
    removeBtn.addEventListener("click", () => deleteCustomWidget(widget.id));

    const titleEl = document.createElement("h2");
    titleEl.className = "widget-title";
    titleEl.style.color = widget.color;
    titleEl.textContent = widget.title;

    section.appendChild(removeBtn);
    section.appendChild(titleEl);

    if (widget.type === "note") {
      buildNoteWidget(widget, section);
    } else if (widget.type === "counter") {
      buildCounterWidget(widget, section);
    } else if (widget.type === "checklist") {
      buildChecklistWidget(widget, section);
    }

    container.insertBefore(section, addBtn);
  });
}

document.getElementById("add-widget-btn").addEventListener("click", openWidgetModal);
document.getElementById("widget-cancel-btn").addEventListener("click", closeWidgetModal);
document.getElementById("widget-create-btn").addEventListener("click", createCustomWidget);

renderCustomWidgets();
