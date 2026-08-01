// theme.js — LabOS Theme Engine
// A "theme" is a plain object mapping CSS variable names (no leading --) to values.

const THEMES = {
  "matrix-green": {
    "neon-green": "#39ff14",
    "bg-black": "#0a0a0a",
    "panel-bg": "#0f1a0f",
    "border-glow": "rgba(57, 255, 20, 0.4)"
  },
  "cyber-amber": {
    "neon-green": "#ffb000",
    "bg-black": "#0a0a0a",
    "panel-bg": "#1a1208",
    "border-glow": "rgba(255, 176, 0, 0.4)"
  },
  "neon-cyan": {
    "neon-green": "#00fff9",
    "bg-black": "#050a0a",
    "panel-bg": "#08181a",
    "border-glow": "rgba(0, 255, 249, 0.4)"
  }
};

const STORAGE_KEY = "labos-active-theme";

function applyTheme(themeName) {
  const theme = THEMES[themeName];
  if (!theme) {
    console.warn(`Theme "${themeName}" not found, falling back to matrix-green`);
    return applyTheme("matrix-green");
  }
  const root = document.documentElement;
  for (const [varName, value] of Object.entries(theme)) {
    root.style.setProperty(`--${varName}`, value);
  }
  localStorage.setItem(STORAGE_KEY, themeName);
}

function getSavedTheme() {
  return localStorage.getItem(STORAGE_KEY) || "matrix-green";
}

function initTheme() {
  applyTheme(getSavedTheme());
}

// Run immediately on load
initTheme();

// --- Font engine ---
const FONTS = {
  "courier": "'Courier New', monospace",
  "jetbrains": "'JetBrains Mono', 'Courier New', monospace",
  "vt323": "'VT323', 'Courier New', monospace"
};

const FONT_STORAGE_KEY = "labos-active-font";

function applyFont(fontName) {
  const fontStack = FONTS[fontName];
  if (!fontStack) {
    console.warn(`Font "${fontName}" not found, falling back to courier`);
    return applyFont("courier");
  }
  document.documentElement.style.setProperty("--font-main", fontStack);
  localStorage.setItem(FONT_STORAGE_KEY, fontName);
}

function getSavedFont() {
  return localStorage.getItem(FONT_STORAGE_KEY) || "courier";
}

// Apply saved font on load too
applyFont(getSavedFont());
