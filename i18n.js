/* ========================================================
   KlasperAI — i18n Engine
   Reads data-i18n / data-i18n-html attributes and swaps text
   ======================================================== */

(function initI18n() {
  const STORAGE_KEY = "klasper_lang";
  const DEFAULT_LANG = "es";
  const SUPPORTED = ["es", "en"];

  /** Get saved language or detect from browser */
  function getLanguage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED.includes(saved)) return saved;

    // Auto-detect browser language
    const browserLang = (navigator.language || navigator.userLanguage || "").slice(0, 2).toLowerCase();
    if (SUPPORTED.includes(browserLang)) return browserLang;

    return DEFAULT_LANG;
  }

  /** Apply translations to the DOM */
  function applyTranslations(lang) {
    // data-i18n → textContent
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (TRANSLATIONS[key] && TRANSLATIONS[key][lang] !== undefined) {
        el.textContent = TRANSLATIONS[key][lang];
      }
    });

    // data-i18n-html → innerHTML (for tags like <em>, <strong>, <br>)
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (TRANSLATIONS[key] && TRANSLATIONS[key][lang] !== undefined) {
        el.innerHTML = TRANSLATIONS[key][lang];
      }
    });

    // Update <html lang="...">
    document.documentElement.lang = lang;

    // Update toggle buttons
    document.querySelectorAll(".lang-toggle").forEach((btn) => {
      const otherLang = lang === "es" ? "EN" : "ES";
      btn.textContent = otherLang;
      btn.setAttribute("aria-label", lang === "es" ? "Switch to English" : "Cambiar a Español");
      btn.setAttribute("data-current-lang", lang);
    });
  }

  /** Set language, save, and apply */
  function setLanguage(lang) {
    if (!SUPPORTED.includes(lang)) return;
    localStorage.setItem(STORAGE_KEY, lang);
    applyTranslations(lang);

    // Dispatch event for any other JS that needs to react
    window.dispatchEvent(new CustomEvent("languageChanged", { detail: { lang } }));
  }

  /** Toggle between languages */
  function toggleLanguage() {
    const current = getLanguage();
    const next = current === "es" ? "en" : "es";
    setLanguage(next);
  }

  // --- Initialize ---

  // Wait for DOM
  function init() {
    // Check if TRANSLATIONS is available
    if (typeof TRANSLATIONS === "undefined") {
      console.warn("i18n: TRANSLATIONS not found. Skipping.");
      return;
    }

    // Apply saved/detected language
    const lang = getLanguage();
    applyTranslations(lang);

    // Bind toggle buttons
    document.querySelectorAll(".lang-toggle").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        toggleLanguage();
      });
    });
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Expose globally for programmatic use
  window.KlasperI18n = {
    setLanguage,
    getLanguage,
    toggleLanguage,
  };
})();
