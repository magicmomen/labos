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
