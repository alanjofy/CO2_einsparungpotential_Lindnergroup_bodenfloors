let data = [];
let chart = null;
let allScenarioChart = null;
const AUTH_USER = "Lindnergroup";
const AUTH_PASS = "Lindner2026";
const ALT_AUTH_USER = "alanjofy";
const ALT_AUTH_PASS = "lca123";

/* =========================
   LOAD CSV
========================= */
fetch("datafinal.csv")
  .then(res => res.text())
  .then(text => {
    const lines = text.trim().split("\n");
    const header = lines[0].split(",").map(h => h.trim().toLowerCase());
    const rows = lines.slice(1);

    const findNth = (name, nth = 0) => {
      const indexes = [];
      header.forEach((h, i) => {
        if (h === name) indexes.push(i);
      });
      return indexes[nth] ?? -1;
    };

    const idx = {
      customerChoice: findNth("customer choice", 0),
      boden: findNth("boden type", 0),
      installed: findNth("installed type", 0),
      userChoice: findNth("user choices", 0),
      a1Installed: findNth("a1-c4(kg co2)", 0),
      installedThickness: findNth("thickness", 0),
      installedDeclaredUnit: findNth("declared unit", 0),
      installedEnergySavings: findNth("energy savings", 0),
      installedThermalSavings: findNth("thermal savings", 0),
      installedWaterSavings: findNth("water savings", 0),
      newOption: findNth("new option", 0),
      a1New: findNth("a1-c4(kg co2)", 1),
      newThickness: findNth("thickness", 1),
      newDeclaredUnit: findNth("declared unit", 1),
      newEnergySavings: findNth("energy savings", 1),
      newThermalSavings: findNth("thermal savings", 1),
      newWaterSavings: findNth("water savings", 1)
    };

    const get = (cols, i) => (i >= 0 ? cols[i]?.trim() : "");
    const toNum = (v) => {
      const n = parseFloat(v);
      return Number.isFinite(n) ? n : NaN;
    };

    data = rows.map(r => {
      const c = r.split(",");
      return {
        customerChoice: get(c, idx.customerChoice),
        boden: get(c, idx.boden),
        installed: get(c, idx.installed),
        userChoice: get(c, idx.userChoice),
        a1Installed: toNum(get(c, idx.a1Installed)),
        installedThickness: get(c, idx.installedThickness),
        installedDeclaredUnit: get(c, idx.installedDeclaredUnit),
        installedEnergySavings: toNum(get(c, idx.installedEnergySavings)),
        installedThermalSavings: toNum(get(c, idx.installedThermalSavings)),
        installedWaterSavings: toNum(get(c, idx.installedWaterSavings)),
        newOption: get(c, idx.newOption),
        a1New: toNum(get(c, idx.a1New)),
        newThickness: get(c, idx.newThickness),
        newDeclaredUnit: get(c, idx.newDeclaredUnit),
        newEnergySavings: toNum(get(c, idx.newEnergySavings)),
        newThermalSavings: toNum(get(c, idx.newThermalSavings)),
        newWaterSavings: toNum(get(c, idx.newWaterSavings))
      };
    });
  });

/* =========================
   DOM
========================= */
const customerTypeSelect = document.getElementById("customerTypeSelect");
const bodenSelect = document.getElementById("bodenSelect");
const subtypeSelect = document.getElementById("subTypeSelect");
const subTypeCard = document.getElementById("subTypeCard");
const installedSelect = document.getElementById("installedSelect");
const userChoiceSelect = document.getElementById("userChoiceSelect");

const resultBox = document.getElementById("resultBox");
const comparisonTitle = document.getElementById("comparisonTitle");
const commentaryBox = document.getElementById("commentaryBox");

const donutBlock = document.getElementById("donutBlock");
const savingPercentEl = document.getElementById("savingPercent");

const eolVisual = document.getElementById("eolVisual");
const whatIfBox = document.getElementById("whatIfBox");
const exportBtn = document.getElementById("exportBtn");
const insightsPanel = document.getElementById("insightsPanel");
const reuseSavings = document.getElementById("reuseSavings");
const reuseRing = document.getElementById("reuseRing");
const reusePercentEl = document.getElementById("reusePercent");
const reuseLignaBoost = document.getElementById("reuseLignaBoost");
const loginScreen = document.getElementById("loginScreen");
const loginForm = document.getElementById("loginForm");
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const loginError = document.getElementById("loginError");
const logoutBtn = document.getElementById("logoutBtn");
const langToggleBtn = document.getElementById("langToggleBtn");
const welcomeOverlay = document.getElementById("welcomeOverlay");
const welcomeStartBtn = document.getElementById("welcomeStartBtn");
const welcomeSkipBtn = document.getElementById("welcomeSkipBtn");
const welcomeDontShow = document.getElementById("welcomeDontShow");

const productCard = installedSelect.closest(".card");
const eolCard = userChoiceSelect.closest(".card");

const STRINGS = {
  en: {
    loginTitle: "Lindner Access",
    loginSubtitle: "Please login to continue",
    username: "Username",
    password: "Password",
    login: "Login",
    logout: "Logout",
    invalidLogin: "Invalid username or password",
    mainTitle: "Product Lifecycle Optimizer",
    mainSubtitle: "Smart. Analytical. Strategic",
    mainScopeTitle: "Cradle-to-grave climate impact comparison (A1-C4)",
    projectContext: "Project Context",
    floorType: "Floor type",
    floorConfiguration: "Floor Configuration",
    product: "Product",
    eolDecision: "End-of-life decision",
    selectRequirement: "Select your requirement",
    hasInstalledProduct: "I have an installed product",
    needNewProduct: "I need a new product",
    selectFloorType: "Select floor type",
    selectConfiguration: "Select configuration",
    selectProduct: "Select product",
    selectEol: "Select end-of-life",
    impactInsights: "Impact insights",
    savingsPotential: "Savings potential",
    co2Reduction: "CO2 reduction",
    moreSavings: "More Savings",
    fewerTrees: "Less Trees are cut",
    carbonStoredLonger: "Carbon remains stored longer during it's second life",
    whatIfTitle: "What if this product were reused?",
    whatIfText: "Reuse keeps material value in the system and avoids emissions from new production.",
    exportPng: "Export PNG",
    scope: "Scope: A1-C4- Cradle to Grave",
    circularComparison: "Circular Product Comparison",
    firstLife: "New Panel",
    circularLife: "Refurbished Panel",
    co2SavingSuffix: "CO2 saving",
    reuseSecondLife: "Reuse - Second life activated",
    productRetained: "Product retained",
    lifecycleExtended: "Lifecycle extended through it's second life",
    co2ReductionSuffix: "CO2 reduction",
    impactPrefix: "A1-C4 impact:",
    recycling: "Recycling",
    landfilling: "Landfilling",
    incineration: "Incineration",
    materialRecovery: "Material recovery",
    processing: "Processing",
    partialValueRetained: "Partial value retained",
    permanentLoss: "Permanent material loss",
    productBurned: "Product Burned",
    materialDestroyed: "Material destroyed",
    thermalOutput: "Thermal and Electric output",
    additionalSavings: "Additional savings",
    energySavings: "Energy savings",
    thermalSavings: "Thermal savings",
    waterSavings: "Water savings",
    co2Saved: "CO2 Saved",
    embodiedCo2: "Embodied CO2 (second life)",
    raisedFloor: "Raised access floor",
    hollowFloor: "Hollow floor",
    panel: "Panel",
    panelSteel: "Panel with steel",
    userChoiceReuse: "Reuse",
    userChoiceRecycling: "Recycling",
    userChoiceLandfilling: "Landfilling",
    userChoiceIncineration: "Incineration",
    userChoiceAllScenarios: "All scenarios",
    scenarioOverview: "Scenario overview",
    welcomeTitle: "Welcome to Lindner Circular Questionnaire",
    welcomeIntro: "This tool helps you compare A1-C4 climate impact and identify better circular options.",
    welcomeStep1: "1) Select project context",
    welcomeStep2: "2) Choose floor type and product",
    welcomeStep3: "3) Select end-of-life pathway",
    welcomeStep4: "4) Review recommendation and export report",
    welcomeDontShow: "Don't show again",
    welcomeStart: "Start Assessment",
    welcomeSkip: "Skip"
  },
  de: {
    loginTitle: "Lindner Zugang",
    loginSubtitle: "Bitte anmelden, um fortzufahren",
    username: "Benutzername",
    password: "Passwort",
    login: "Anmelden",
    logout: "Abmelden",
    invalidLogin: "Ungultiger Benutzername oder Passwort",
    mainTitle: "Product Lifecycle Optimizer",
    mainSubtitle: "Smart. Analytisch. Strategisch",
    mainScopeTitle: "Klimawirkungsvergleich von der Wiege bis zur Bahre (A1-C4)",
    projectContext: "Projektkontext",
    floorType: "Bodentyp",
    floorConfiguration: "Bodenkonfiguration",
    product: "Produkt",
    eolDecision: "End-of-Life Entscheidung",
    selectRequirement: "Anforderung auswahlen",
    hasInstalledProduct: "Ich habe ein eingebautes Produkt",
    needNewProduct: "Ich brauche ein neues Produkt",
    selectFloorType: "Bodentyp auswahlen",
    selectConfiguration: "Konfiguration auswahlen",
    selectProduct: "Produkt auswahlen",
    selectEol: "End-of-Life auswahlen",
    impactInsights: "Wirkungsanalyse",
    savingsPotential: "Einsparpotenzial",
    co2Reduction: "CO2 Reduktion",
    moreSavings: "Mehr Einsparungen",
    fewerTrees: "Weniger Baume werden gefallt",
    carbonStoredLonger: "Kohlenstoff bleibt im zweiten Lebenszyklus langer gespeichert",
    whatIfTitle: "Was ware, wenn dieses Produkt wiederverwendet wurde?",
    whatIfText: "Wiederverwendung halt den Materialwert im System und vermeidet Emissionen aus neuer Produktion.",
    exportPng: "PNG Export",
    scope: "Umfang: A1-C4 - Von der Wiege bis zum Grab ",
    circularComparison: "Vergleich Zirkularprodukt",
    firstLife: "ERSTES LEBEN",
    circularLife: "ZIRKULARES LEBEN",
    co2SavingSuffix: "CO2 Einsparung",
    reuseSecondLife: "Wiederverwendung - Zweites Leben aktiviert",
    productRetained: "Produkt erhalten",
    lifecycleExtended: "Lebenszyklus im zweiten Leben verlangert",
    co2ReductionSuffix: "CO2 Reduktion",
    impactPrefix: "A1-C4 Wirkung:",
    recycling: "Recycling",
    landfilling: "Deponierung",
    incineration: "Verbrennung",
    materialRecovery: "Materialruckgewinnung",
    processing: "Verarbeitung",
    partialValueRetained: "Teilweiser Werterhalt",
    permanentLoss: "Permanenter Materialverlust",
    productBurned: "Produkt verbrannt",
    materialDestroyed: "Material zerstort",
    thermalOutput: "Thermischer und elektrischer Output",
    additionalSavings: "Zusatzliche Einsparungen",
    energySavings: "Energieeinsparung",
    thermalSavings: "Thermische Einsparung",
    waterSavings: "Wassereinsparung",
    co2Saved: "CO2 Eingespart",
    embodiedCo2: "Verkorpertes CO2 (zweites Leben)",
    raisedFloor: "Doppelboden",
    hollowFloor: "Hohlboden",
    panel: "Panel",
    panelSteel: "Panel mit Stahl",
    userChoiceReuse: "Wiederverwendung",
    userChoiceRecycling: "Recycling",
    userChoiceLandfilling: "Deponierung",
    userChoiceIncineration: "Verbrennung",
    userChoiceAllScenarios: "Alle Szenarien",
    scenarioOverview: "Szenario-Uberblick",
    welcomeTitle: "Willkommen beim Lindner Circular Questionnaire",
    welcomeIntro: "Dieses Tool vergleicht die Klimawirkung A1-C4 und zeigt zirkulare Optionen mit geringerer Wirkung.",
    welcomeStep1: "1) Projektkontext auswahlen",
    welcomeStep2: "2) Bodentyp und Produkt auswahlen",
    welcomeStep3: "3) End-of-Life Pfad auswahlen",
    welcomeStep4: "4) Empfehlung prufen und Bericht exportieren",
    welcomeDontShow: "Nicht mehr anzeigen",
    welcomeStart: "Analyse starten",
    welcomeSkip: "Uberspringen"
  }
};

let currentLang = localStorage.getItem("appLanguage") === "de" ? "de" : "en";

function t(key) {
  return STRINGS[currentLang][key] || STRINGS.en[key] || key;
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function translatedUserChoice(choice) {
  const lower = (choice || "").toLowerCase();
  if (lower === "reuse") return t("userChoiceReuse");
  if (lower === "recycling") return t("userChoiceRecycling");
  if (lower === "landfilling") return t("userChoiceLandfilling");
  if (lower === "incineration") return t("userChoiceIncineration");
  if (lower === "all scenarios") return t("userChoiceAllScenarios");
  return choice;
}

function normalizeChoice(choice) {
  return (choice || "").trim().toLowerCase();
}

function setAllScenariosMode(active) {
  document.body.classList.toggle("all-scenarios-mode", !!active);
}

function formatTechSpec(thickness, declaredUnit) {
  const specs = [];
  if (thickness) specs.push(`${thickness} mm`);
  if (declaredUnit) {
    const hasUnit = /kg\s*\/\s*m/i.test(declaredUnit);
    specs.push(hasUnit ? declaredUnit : `${declaredUnit} kg /m2`);
  }
  return specs.join(" | ");
}

function panelLabel(typeKey) {
  const floor = bodenSelect?.value || "";
  return floor ? `${floor} ${t(typeKey)}` : t(typeKey);
}

function hasMetricValue(value) {
  return Number.isFinite(value);
}

function metricValueText(value) {
  if (!Number.isFinite(value)) return "";
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function refreshDropdownLanguage() {
  if (subtypeSelect) {
    Array.from(subtypeSelect.options).forEach((opt, idx) => {
      if (idx === 0) {
        opt.textContent = t("selectConfiguration");
        return;
      }
      if (opt.value === "raised") opt.textContent = t("raisedFloor");
      if (opt.value === "hollow") opt.textContent = t("hollowFloor");
      if (opt.value === "panel") opt.textContent = t("panel");
      if (opt.value === "steel") opt.textContent = t("panelSteel");
    });
  }

  if (userChoiceSelect) {
    Array.from(userChoiceSelect.options).forEach((opt, idx) => {
      if (idx === 0) {
        opt.textContent = t("selectEol");
        return;
      }
      opt.textContent = translatedUserChoice(opt.value);
    });
  }
}

function applyStaticTranslations() {
  document.documentElement.lang = currentLang;
  setText("loginTitle", t("loginTitle"));
  setText("loginSubtitle", t("loginSubtitle"));
  setText("loginUserLabel", t("username"));
  setText("loginPassLabel", t("password"));
  setText("loginBtn", t("login"));
  setText("loginError", t("invalidLogin"));
  setText("logoutBtn", t("logout"));
  setText("mainTitle", `🌿 ${t("mainTitle")}`);
  setText("mainSubtitle", t("mainSubtitle"));
  setText("mainScopeTitle", t("mainScopeTitle"));
  setText("projectContextLabel", t("projectContext"));
  setText("floorTypeLabel", t("floorType"));
  setText("floorConfigLabel", t("floorConfiguration"));
  setText("productLabel", t("product"));
  setText("eolDecisionLabel", t("eolDecision"));
  setText("customerTypeDefaultOption", t("selectRequirement"));
  setText("installedProductOption", t("hasInstalledProduct"));
  setText("newProductOption", t("needNewProduct"));
  setText("floorTypeDefaultOption", t("selectFloorType"));
  setText("floorConfigDefaultOption", t("selectConfiguration"));
  setText("productDefaultOption", t("selectProduct"));
  setText("eolDefaultOption", t("selectEol"));
  setText("impactInsightsTitle", t("impactInsights"));
  setText("savingsPotentialLabel", t("savingsPotential"));
  setText("donutReductionLabel", t("co2Reduction"));
  const reuseReductionEl = document.getElementById("reuseReductionLabel");
  if (reuseReductionEl) reuseReductionEl.innerHTML = `CO<sub>2</sub> ${t("co2Reduction").replace("CO2 ", "")}`;
  setText("moreSavingsTitle", t("moreSavings"));
  setText("moreSavingsItem1", t("fewerTrees"));
  setText("moreSavingsItem2", t("carbonStoredLonger"));
  const whatIfTitleEl = document.querySelector("#whatIfBox h4");
  if (whatIfTitleEl) whatIfTitleEl.textContent = `💡 ${t("whatIfTitle")}`;
  const whatIfTextEl = document.querySelector("#whatIfBox p");
  if (whatIfTextEl) whatIfTextEl.textContent = t("whatIfText");
  if (exportBtn) exportBtn.textContent = `⬇ ${t("exportPng")}`;
  setText("scopeNote", t("scope"));
  setText("welcomeTitle", t("welcomeTitle"));
  setText("welcomeIntro", t("welcomeIntro"));
  setText("welcomeStep1", t("welcomeStep1"));
  setText("welcomeStep2", t("welcomeStep2"));
  setText("welcomeStep3", t("welcomeStep3"));
  setText("welcomeStep4", t("welcomeStep4"));
  setText("welcomeDontShowLabel", t("welcomeDontShow"));
  setText("welcomeStartBtn", t("welcomeStart"));
  setText("welcomeSkipBtn", t("welcomeSkip"));
  refreshDropdownLanguage();
  if (langToggleBtn) langToggleBtn.textContent = currentLang === "en" ? "DE" : "EN";
}

function refreshCurrentResultTranslation() {
  if (customerTypeSelect.value.toLowerCase().includes("new")) {
    if (bodenSelect.value) showNewProductComparison();
    return;
  }

  if (!userChoiceSelect.value) return;
  if (normalizeChoice(userChoiceSelect.value) === "all scenarios") {
    showAllScenarios();
    return;
  }

  const row = data.find(d =>
    d.customerChoice.toLowerCase() === customerTypeSelect.value.toLowerCase() &&
    d.boden === bodenSelect.value &&
    d.installed === installedSelect.value &&
    d.userChoice === userChoiceSelect.value
  );

  if (!row) return;
  if (row.userChoice.toLowerCase() === "reuse") {
    showReuse(row);
  } else {
    showEndOfLife(row);
  }
}

function setLanguage(lang) {
  currentLang = lang === "de" ? "de" : "en";
  localStorage.setItem("appLanguage", currentLang);
  applyStaticTranslations();
  refreshCurrentResultTranslation();
}

function shouldShowWelcome() {
  return localStorage.getItem("hideWelcomeOverlay") !== "1";
}

function showWelcomeOverlay() {
  if (!welcomeOverlay || !shouldShowWelcome()) return;
  welcomeOverlay.classList.remove("hidden");
}

function hideWelcomeOverlay() {
  if (!welcomeOverlay) return;
  welcomeOverlay.classList.add("hidden");
}

/* =========================
   LOGIN / LOGOUT
========================= */
function lockApp() {
  document.body.classList.add("app-locked");
  if (loginScreen) loginScreen.classList.remove("hidden");
  if (logoutBtn) logoutBtn.classList.add("hidden");
  if (langToggleBtn) langToggleBtn.classList.add("hidden");
  hideWelcomeOverlay();
}

function unlockApp() {
  document.body.classList.remove("app-locked");
  if (loginScreen) loginScreen.classList.add("hidden");
  if (logoutBtn) logoutBtn.classList.remove("hidden");
  if (langToggleBtn) langToggleBtn.classList.remove("hidden");
  showWelcomeOverlay();
}

function initAuth() {
  const isAuthed = sessionStorage.getItem("isAuthenticated") === "1";
  if (isAuthed) {
    unlockApp();
  } else {
    lockApp();
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const user = (loginUsername?.value || "").trim();
      const pass = loginPassword?.value || "";
      const ok =
        (user === AUTH_USER && pass === AUTH_PASS) ||
        (user === ALT_AUTH_USER && pass === ALT_AUTH_PASS);

      if (!ok) {
        if (loginError) loginError.classList.remove("hidden");
        return;
      }

      sessionStorage.setItem("isAuthenticated", "1");
      if (loginError) loginError.classList.add("hidden");
      if (loginPassword) loginPassword.value = "";
      unlockApp();
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("isAuthenticated");
      if (loginForm) loginForm.reset();
      if (loginError) loginError.classList.add("hidden");
      resetDashboard();
      lockApp();
    });
  }

  if (langToggleBtn) {
    langToggleBtn.addEventListener("click", () => {
      setLanguage(currentLang === "en" ? "de" : "en");
    });
  }

  if (welcomeSkipBtn) {
    welcomeSkipBtn.addEventListener("click", () => {
      hideWelcomeOverlay();
    });
  }

  if (welcomeStartBtn) {
    welcomeStartBtn.addEventListener("click", () => {
      if (welcomeDontShow?.checked) {
        localStorage.setItem("hideWelcomeOverlay", "1");
      }
      hideWelcomeOverlay();
    });
  }
}

applyStaticTranslations();
initAuth();

/* =========================
   DRAGGABLE LIGNA POPUP
========================= */
if (reuseLignaBoost) {
  let dragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  const startDrag = (e) => {
    if (!reuseLignaBoost.classList.contains("hidden")) {
      const rect = reuseLignaBoost.getBoundingClientRect();
      dragOffsetX = e.clientX - rect.left;
      dragOffsetY = e.clientY - rect.top;
      dragging = true;
      reuseLignaBoost.classList.add("dragging");
      reuseLignaBoost.setPointerCapture(e.pointerId);
    }
  };

  const onDrag = (e) => {
    if (!dragging) return;
    const parent = reuseLignaBoost.offsetParent;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const popupRect = reuseLignaBoost.getBoundingClientRect();

    let nextLeft = e.clientX - parentRect.left - dragOffsetX;
    let nextTop = e.clientY - parentRect.top - dragOffsetY;

    const maxLeft = parentRect.width - popupRect.width;
    const maxTop = parentRect.height - popupRect.height;

    nextLeft = Math.max(0, Math.min(maxLeft, nextLeft));
    nextTop = Math.max(0, Math.min(maxTop, nextTop));

    reuseLignaBoost.style.left = `${nextLeft}px`;
    reuseLignaBoost.style.top = `${nextTop}px`;
    reuseLignaBoost.style.transform = "none";
  };

  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    reuseLignaBoost.classList.remove("dragging");
    try {
      reuseLignaBoost.releasePointerCapture(e.pointerId);
    } catch (err) {
      // Ignore if pointer is already released.
    }
  };

  reuseLignaBoost.addEventListener("pointerdown", startDrag);
  window.addEventListener("pointermove", onDrag);
  window.addEventListener("pointerup", endDrag);
  window.addEventListener("pointercancel", endDrag);
}

/* =========================
   RESET
========================= */
function resetDashboard() {
  setAllScenariosMode(false);

  resultBox.classList.add("hidden");
  donutBlock.classList.add("hidden");
  eolVisual.classList.add("hidden");
  whatIfBox.classList.add("hidden");

  eolVisual.innerHTML = "";
  eolVisual.className = "eol-visual";

  commentaryBox.innerHTML = "";
  comparisonTitle.innerHTML = "";

  if (savingPercentEl) savingPercentEl.innerText = "";
  setReuseSavings(false, 0);
  if (reuseLignaBoost) reuseLignaBoost.classList.add("hidden");

  if (chart) {
    chart.destroy();
    chart = null;
  }
  if (allScenarioChart) {
    allScenarioChart.destroy();
    allScenarioChart = null;
  }
}

function animatePercent(targetPercent) {
  if (!savingPercentEl) return;
  const durationMs = 900;
  const start = performance.now();
  const endValue = Math.max(0, Math.min(100, targetPercent));

  function step(now) {
    const t = Math.min(1, (now - start) / durationMs);
    const current = endValue * t;
    savingPercentEl.innerText = `${current.toFixed(1)}%`;
    if (t < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function setReuseSavings(show, percent) {
  if (!reuseSavings || !reuseRing || !reusePercentEl || !insightsPanel) return;
  if (show) {
    reuseSavings.classList.remove("hidden");
    insightsPanel.classList.add("reuse-mode");
    animateReusePercent(percent);
    if (reuseLignaBoost) reuseLignaBoost.classList.add("hidden");
  } else {
    reuseSavings.classList.add("hidden");
    insightsPanel.classList.remove("reuse-mode");
    reuseRing.style.setProperty("--pct", 0);
    reusePercentEl.innerText = "0%";
    if (reuseLignaBoost) reuseLignaBoost.classList.add("hidden");
  }
}

function animateReusePercent(targetPercent) {
  if (!reuseRing || !reusePercentEl) return;
  const durationMs = 900;
  const start = performance.now();
  const endValue = Math.max(0, Math.min(100, targetPercent));

  function step(now) {
    const t = Math.min(1, (now - start) / durationMs);
    const current = endValue * t;
    reuseRing.style.setProperty("--pct", current);
    reusePercentEl.innerText = `${current.toFixed(1)}%`;
    if (t < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

/* =========================
   PROJECT CONTEXT
========================= */
customerTypeSelect.addEventListener("change", () => {

  resetDashboard();

  bodenSelect.innerHTML = `<option value="">${t("selectFloorType")}</option>`;
  installedSelect.innerHTML = `<option value="">${t("selectProduct")}</option>`;
  userChoiceSelect.innerHTML = `<option value="">${t("selectEol")}</option>`;
  if (subtypeSelect) subtypeSelect.innerHTML = `<option value="">${t("selectConfiguration")}</option>`;
  if (subTypeCard) subTypeCard.classList.add("hidden");

  if (!customerTypeSelect.value) return;

  const filtered = data.filter(d =>
    d.customerChoice.toLowerCase() === customerTypeSelect.value.toLowerCase()
  );

  const bodenTypes = [...new Set(filtered.map(d => d.boden))];

  bodenSelect.innerHTML += bodenTypes
    .map(b => `<option value="${b}">${b}</option>`).join("");

  if (customerTypeSelect.value.toLowerCase().includes("new")) {

    document.body.classList.add("new-mode");
    document.body.classList.remove("installed-mode");

    productCard.classList.add("hidden");
    eolCard.classList.add("hidden");
    if (subTypeCard) subTypeCard.classList.remove("hidden");

  } else {

    document.body.classList.add("installed-mode");
    document.body.classList.remove("new-mode");

    productCard.classList.remove("hidden");
    eolCard.classList.remove("hidden");
    if (subTypeCard) subTypeCard.classList.add("hidden");
  }

});

/* =========================
   FLOOR TYPE
========================= */
bodenSelect.addEventListener("change", () => {

  resetDashboard();

  if (!bodenSelect.value) return;

  /* NEW PRODUCT MODE */
  if (customerTypeSelect.value.toLowerCase().includes("new")) {

    handleSubtypeFilter();
    return;
  }

  /* INSTALLED MODE */
  const filtered = data.filter(d =>
    d.customerChoice.toLowerCase() === customerTypeSelect.value.toLowerCase() &&
    d.boden === bodenSelect.value
  );

  const products = [...new Set(filtered.map(d => d.installed))];

  installedSelect.innerHTML =
    `<option value="">${t("selectProduct")}</option>` +
    products.map(p => `<option value="${p}">${p}</option>`).join("");
});

/* =========================
   SUBTYPE FILTER (NEW PRODUCT ONLY)
========================= */
function handleSubtypeFilter() {

  if (!subtypeSelect) return;

  subtypeSelect.innerHTML = `<option value="">${t("selectConfiguration")}</option>`;
  if (subTypeCard) subTypeCard.classList.remove("hidden");

  if (bodenSelect.value === "Calcium Sulphate") {
    subtypeSelect.innerHTML += `
      <option value="raised">${t("raisedFloor")}</option>
      <option value="hollow">${t("hollowFloor")}</option>
    `;
  }

  if (bodenSelect.value === "Wooden Floors") {
    subtypeSelect.innerHTML += `
      <option value="panel">${t("panel")}</option>
      <option value="steel">${t("panelSteel")}</option>
    `;
  }
}

/* =========================
   SUBTYPE CHANGE
========================= */
if (subtypeSelect) {
  subtypeSelect.addEventListener("change", showNewProductComparison);
}

/* =========================
   INSTALLED PRODUCT
========================= */
installedSelect.addEventListener("change", () => {

  resetDashboard();

  if (!installedSelect.value) return;

  const filtered = data.filter(d =>
    d.customerChoice.toLowerCase() === customerTypeSelect.value.toLowerCase() &&
    d.boden === bodenSelect.value &&
    d.installed === installedSelect.value
  );

  const choices = [...new Set(filtered.map(d => d.userChoice))];

  userChoiceSelect.innerHTML =
    `<option value="">${t("selectEol")}</option>` +
    choices.map(c => `<option value="${c}">${translatedUserChoice(c)}</option>`).join("");
});

/* =========================
   END OF LIFE
========================= */
userChoiceSelect.addEventListener("change", () => {

  resetDashboard();

  if (!userChoiceSelect.value) return;
  if (normalizeChoice(userChoiceSelect.value) === "all scenarios") {
    showAllScenarios();
    return;
  }

  const row = data.find(d =>
    d.customerChoice.toLowerCase() === customerTypeSelect.value.toLowerCase() &&
    d.boden === bodenSelect.value &&
    d.installed === installedSelect.value &&
    d.userChoice === userChoiceSelect.value
  );

  if (!row) return;

  if (row.userChoice.toLowerCase() === "reuse") {
    showReuse(row);
  } else {
    showEndOfLife(row);
  }
});

function getScenarioOrder(rows) {
  const keys = rows.map(r => normalizeChoice(r.userChoice));
  const hasRecycling = keys.includes("recycling");
  return hasRecycling
    ? ["reuse", "recycling", "landfilling"]
    : ["reuse", "incineration"];
}

function buildScenarioInsightCard(row) {
  const type = normalizeChoice(row.userChoice);
  const impactValue = Number.isFinite(row.a1Installed) ? row.a1Installed : 0;

  if (type === "reuse") {
    const saved = row.a1Installed - row.a1New;
    const percent = row.a1Installed ? ((saved / row.a1Installed) * 100).toFixed(1) : "0.0";
    const additionalSavingsHtml =
      hasMetricValue(row.installedEnergySavings) ||
      hasMetricValue(row.installedThermalSavings) ||
      hasMetricValue(row.installedWaterSavings)
        ? `
      <div class="additional-savings in-card">
        <div class="additional-savings-title">${t("additionalSavings")}</div>
        <div class="additional-savings-row">
          ${hasMetricValue(row.installedEnergySavings) ? `<span class="saving-pill">${t("energySavings")}: ${metricValueText(row.installedEnergySavings)} kWh</span>` : ""}
          ${hasMetricValue(row.installedThermalSavings) ? `<span class="saving-pill">${t("thermalSavings")}: ${metricValueText(row.installedThermalSavings)} kWh</span>` : ""}
          ${hasMetricValue(row.installedWaterSavings) ? `<span class="saving-pill">${t("waterSavings")}: ${metricValueText(row.installedWaterSavings)} Litres</span>` : ""}
        </div>
      </div>
      `
        : "";

    return `
      <article class="scenario-card scenario-card--reuse">
        <div class="scenario-card-head">
          <h4>${translatedUserChoice(row.userChoice)}</h4>
          <p><strong>${t("impactPrefix")}</strong> ${impactValue} kg CO2</p>
        </div>
        <div class="scenario-visual scenario-visual--reuse">
          <div class="scenario-chip">${t("productRetained")}</div>
          <div class="scenario-chip">${t("lifecycleExtended")}</div>
          <div class="scenario-chip">${percent}% ${t("co2ReductionSuffix")}</div>
        </div>
        <div class="scenario-card-meta">
          ${additionalSavingsHtml || `<div class="scenario-meta-spacer"></div>`}
        </div>
      </article>
    `;
  }

  if (type === "recycling") {
    return `
      <article class="scenario-card scenario-card--recycling">
        <div class="scenario-card-head">
          <h4>${translatedUserChoice(row.userChoice)}</h4>
          <p><strong>${t("impactPrefix")}</strong> ${impactValue} kg CO2</p>
        </div>
        <div class="scenario-visual scenario-visual--recycling">
          <div class="scenario-chip">${t("materialRecovery")}</div>
          <div class="scenario-chip">${t("processing")}</div>
          <div class="scenario-chip">${t("partialValueRetained")}</div>
        </div>
        <div class="scenario-card-meta">
          <div class="scenario-meta-spacer"></div>
        </div>
      </article>
    `;
  }

  if (type === "landfilling") {
    return `
      <article class="scenario-card scenario-card--landfilling">
        <div class="scenario-card-head">
          <h4>${translatedUserChoice(row.userChoice)}</h4>
          <p><strong>${t("impactPrefix")}</strong> ${impactValue} kg CO2</p>
        </div>
        <div class="scenario-visual scenario-visual--landfilling">
          <div class="scenario-chip">${t("permanentLoss")}</div>
        </div>
        <div class="scenario-card-meta">
          <div class="scenario-meta-spacer"></div>
        </div>
      </article>
    `;
  }

  return `
    <article class="scenario-card scenario-card--incineration">
      <div class="scenario-card-head">
        <h4>${translatedUserChoice(row.userChoice)}</h4>
        <p><strong>${t("impactPrefix")}</strong> ${impactValue} kg CO2</p>
      </div>
      <div class="scenario-visual scenario-visual--incineration">
        <div class="scenario-chip">${t("productBurned")}</div>
        <div class="scenario-chip">${t("materialDestroyed")}</div>
      </div>
      <div class="scenario-card-meta">
        <div class="scenario-meta-spacer"></div>
      </div>
    </article>
  `;
}

function drawAllScenarioChart(rows) {
  if (allScenarioChart) {
    allScenarioChart.destroy();
    allScenarioChart = null;
  }

  const canvas = document.getElementById("allScenarioChart");
  if (!canvas) return;

  const labels = rows.map(r => translatedUserChoice(r.userChoice));
  const values = rows.map(r => r.a1Installed);
  const colors = rows.map((r) => {
    const type = normalizeChoice(r.userChoice);
    if (type === "reuse") return "#22c55e";
    if (type === "recycling") return "#f59e0b";
    if (type === "landfilling") return "#ef4444";
    return "#f97316";
  });

  allScenarioChart = new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "A1-C4 (kg CO2)",
        data: values,
        backgroundColor: colors,
        borderRadius: 8,
        maxBarThickness: 70,
        barPercentage: 0.68,
        categoryPercentage: 0.72
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          displayColors: false,
          backgroundColor: "#0f172a",
          titleColor: "#f8fafc",
          bodyColor: "#e2e8f0",
          callbacks: {
            label: (ctx) => `${ctx.raw} kg CO2`
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: "rgba(100, 116, 139, 0.12)",
            drawBorder: false
          },
          ticks: {
            color: "#475569",
            font: { size: 12, weight: "600" }
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(100, 116, 139, 0.12)",
            drawBorder: false
          },
          ticks: {
            callback: (v) => `${v}`,
            color: "#64748b",
            font: { size: 11 }
          },
          title: {
            display: true,
            text: "kg CO2",
            color: "#64748b",
            font: { size: 12, weight: "600" }
          }
        }
      }
    }
  });
}

function showAllScenarios() {
  setAllScenariosMode(true);
  const filtered = data.filter(d =>
    d.customerChoice.toLowerCase() === customerTypeSelect.value.toLowerCase() &&
    d.boden === bodenSelect.value &&
    d.installed === installedSelect.value &&
    normalizeChoice(d.userChoice) !== "all scenarios" &&
    !Number.isNaN(d.a1Installed)
  );

  if (!filtered.length) return;

  const ordered = getScenarioOrder(filtered)
    .map(choice => filtered.find(d => normalizeChoice(d.userChoice) === choice))
    .filter(Boolean);

  comparisonTitle.innerText = `${installedSelect.value} - ${t("scenarioOverview")}`;
  donutBlock.classList.add("hidden");
  if (savingPercentEl) savingPercentEl.innerText = "";
  setReuseSavings(false, 0);
  if (reuseLignaBoost) reuseLignaBoost.classList.add("hidden");
  whatIfBox.classList.add("hidden");
  eolVisual.classList.add("hidden");
  eolVisual.innerHTML = "";

  commentaryBox.innerHTML = `
    <div class="scenario-board scenario-count-${ordered.length}">
      <div class="scenario-summary-strip">
        <div class="scenario-heading-block">
          <p>A1-C4 scenario comparison</p>
        </div>
        <div class="scenario-legend">
          ${ordered.map((row) => {
            const type = normalizeChoice(row.userChoice);
            return `<span class="legend-chip legend-${type}">${translatedUserChoice(row.userChoice)}</span>`;
          }).join("")}
        </div>
      </div>
      <div class="scenario-chart-wrap board-chart">
        <canvas id="allScenarioChart"></canvas>
      </div>
      <section class="scenario-deck">
        ${ordered.map(buildScenarioInsightCard).join("")}
      </section>
    </div>
  `;

  drawAllScenarioChart(ordered);
  resultBox.classList.remove("hidden");
}

/* =========================
   NEW PRODUCT COMPARISON
========================= */
function showNewProductComparison() {
  setAllScenariosMode(false);

  if (!bodenSelect.value) return;
  donutBlock.classList.add("hidden");
  if (savingPercentEl) savingPercentEl.innerText = "";
  setReuseSavings(false, 0);

  let filtered = data.filter(d =>
    d.customerChoice.toLowerCase() === "new product" &&
    d.boden === bodenSelect.value
  );

  if (subtypeSelect && subtypeSelect.value) {

    if (subtypeSelect.value === "raised")
      filtered = filtered.filter(d => d.installed === "NORTEC");

    if (subtypeSelect.value === "hollow")
      filtered = filtered.filter(d => d.installed === "FLOOR & more");

    if (subtypeSelect.value === "panel")
      filtered = filtered.filter(d => d.installed === "LIGNA");

    if (subtypeSelect.value === "steel")
      filtered = filtered.filter(d => d.installed === "LIGNA ST");
  }

  if (!filtered.length) return;

  comparisonTitle.innerText =
    `${bodenSelect.value} >> ${t("circularComparison")}`;

  commentaryBox.innerHTML = `
    <div class="comparison-grid alt-new">
      ${filtered.map(row => {

        const saving =
          ((row.a1Installed - row.a1New) / row.a1Installed) * 100;
        const savingDisplay = saving.toFixed(1);

        return `
          <div class="product-panel alt-card">
            <div class="alt-split">
              <div class="alt-block first-life">
                <small>${panelLabel("firstLife")}</small>
                <h4>${row.installed}</h4>
                <p class="product-tech">${formatTechSpec(row.installedThickness, row.installedDeclaredUnit)}</p>
                <p>${row.a1Installed} kg CO<sub>2</sub></p>
              </div>

              <div class="alt-divider">----->>></div>

              <div class="alt-block circular-life">
                <small>${panelLabel("circularLife")}</small>
                <h4>${row.newOption}</h4>
                <p class="product-tech">${formatTechSpec(row.newThickness, row.newDeclaredUnit)}</p>
                <p>${row.a1New} kg CO<sub>2</sub></p>
                <div class="saving-round under-circular" style="--pct:${savingDisplay}">
                  <div class="saving-round-center">${savingDisplay}%</div>
                </div>
                <div class="saving-text under-circular">
                  ${t("co2SavingSuffix")}
                </div>
              </div>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;

  resultBox.classList.remove("hidden");
}

/* =========================
   REUSE (INSTALLED ONLY)
========================= */
function showReuse(row) {
  setAllScenariosMode(false);

  const saved = row.a1Installed - row.a1New;
  const percent = ((saved / row.a1Installed) * 100).toFixed(1);

  comparisonTitle.innerHTML =
    `${row.installed} → ${row.newOption}`;

  commentaryBox.innerHTML = `
    <div class="tech-compare">
      <p><strong>${row.installed}</strong><br>${formatTechSpec(row.installedThickness, row.installedDeclaredUnit)}</p>
      <p><strong>${row.newOption}</strong><br>${formatTechSpec(row.newThickness, row.newDeclaredUnit)}</p>
    </div>
    ${
      hasMetricValue(row.installedEnergySavings) ||
      hasMetricValue(row.installedThermalSavings) ||
      hasMetricValue(row.installedWaterSavings)
        ? `
      <div class="additional-savings">
        <div class="additional-savings-title">${t("additionalSavings")}</div>
        <div class="additional-savings-row">
          ${hasMetricValue(row.installedEnergySavings) ? `<span class="saving-pill">${t("energySavings")}: ${metricValueText(row.installedEnergySavings)} kWh</span>` : ""}
          ${hasMetricValue(row.installedThermalSavings) ? `<span class="saving-pill">${t("thermalSavings")}: ${metricValueText(row.installedThermalSavings)} kWh</span>` : ""}
          ${hasMetricValue(row.installedWaterSavings) ? `<span class="saving-pill">${t("waterSavings")}: ${metricValueText(row.installedWaterSavings)} Litres</span>` : ""}
        </div>
      </div>
      `
        : ""
    }
  `;

  donutBlock.classList.remove("hidden");
  animatePercent(parseFloat(percent));
  setReuseSavings(true, parseFloat(percent));

  if (reuseLignaBoost) {
    reuseLignaBoost.classList.add("hidden");
    const isInstalled = row.customerChoice.toLowerCase() === "installed product";
    const isWooden = row.boden.toLowerCase().includes("wood");
    const isLigna = row.installed.toLowerCase().includes("ligna");
    const isReuse = row.userChoice.toLowerCase() === "reuse";
    if (isInstalled && isWooden && isLigna && isReuse) {
      reuseLignaBoost.classList.remove("hidden");
    }
  }

  eolVisual.classList.remove("hidden");
  eolVisual.className = "eol-visual reuse";
  whatIfBox.classList.add("hidden");

  eolVisual.innerHTML = `
    <div class="eol-header">
      <span class="eol-icon">🔁</span>
      <h4>${t("reuseSecondLife")}</h4>
    </div>

    <div class="eol-pill-row">
      <div class="eol-pill positive">♻ ${t("productRetained")}</div>
      <div class="eol-pill positive">🔄 ${t("lifecycleExtended")}</div>
      <div class="eol-pill positive">📉 ${percent}% ${t("co2ReductionSuffix")}</div>
      
    </div>
  `;

  drawChart(saved, row.a1New);

  resultBox.classList.remove("hidden");
}

/* =========================
   OTHER EOL
========================= */
function showEndOfLife(row) {
  setAllScenariosMode(false);

  const type = row.userChoice.toLowerCase();
  setReuseSavings(false, 0);

  comparisonTitle.innerText =
    `${row.installed} – ${translatedUserChoice(row.userChoice)}`;

  const techSpec = formatTechSpec(row.installedThickness, row.installedDeclaredUnit);
  commentaryBox.innerHTML = `
    <p><strong>${t("impactPrefix")}</strong> ${row.a1Installed} kg CO2</p>
    ${techSpec ? `<p class="product-tech"><strong>Technical specs:</strong> ${techSpec}</p>` : ""}
  `;

  whatIfBox.classList.remove("hidden");

  let content = "";

  if (type === "recycling") {
    content = `
      <div class="eol-header">🟠 ${t("recycling")}</div>
      <div class="eol-steps">
        <div class="eol-step">♻ ${t("materialRecovery")}</div>
        <div class="eol-step">⚙ ${t("processing")}</div>
        <div class="eol-step">◐ ${t("partialValueRetained")}</div>
      </div>
    `;
  }

  if (type === "landfilling") {
    content = `
      <div class="eol-header">🔴 ${t("landfilling")}</div>
      <div class="eol-steps">
        <div class="eol-step">🗑 ${t("permanentLoss")}</div>
      </div>
    `;
  }

  if (type === "incineration") {
    content = `
      <div class="eol-header">🔥 ${t("incineration")}</div>
      <div class="eol-steps">
        <div class="eol-step">🔥 ${t("productBurned")}</div>
        <div class="eol-step">💨 ${t("materialDestroyed")}</div>
      </div>
    `;
  }

  eolVisual.innerHTML = content;
  eolVisual.className = "eol-visual " + type;
  eolVisual.classList.remove("hidden");

  resultBox.classList.remove("hidden");
}

/* =========================
   DONUT
========================= */
function drawChart(saved, remaining) {

  if (chart) chart.destroy();

  chart = new Chart(document.getElementById("pieChart"), {
    type: "doughnut",
    data: {
      labels: [t("co2Saved"), t("embodiedCo2")],
      datasets: [{
        data: [saved, remaining],
        backgroundColor: ["#22c55e", "#d1d5db"]
      }]
    },
    options: { cutout: "72%" }
  });
}

/* =========================
   EXPORT PNG
========================= */
function exportPNG() {
  const target = document.getElementById("resultBox");
  if (!target || target.classList.contains("hidden")) return;

  const captureNodes = [
    document.getElementById("comparisonTitle"),
    target.querySelector(".insight-grid"),
    target.querySelector(".scope")
  ].filter(Boolean);

  if (!captureNodes.length) return;

  target.classList.add("export-mode");

  // Let running animations/transitions settle before rasterizing.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      let left = Infinity;
      let top = Infinity;
      let right = -Infinity;
      let bottom = -Infinity;

      captureNodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        left = Math.min(left, rect.left);
        top = Math.min(top, rect.top);
        right = Math.max(right, rect.right);
        bottom = Math.max(bottom, rect.bottom);
      });

      const pad = 24;
      const x = Math.max(0, window.scrollX + left - pad);
      const y = Math.max(0, window.scrollY + top - pad);
      const width = Math.ceil(right - left + pad * 2);
      const height = Math.ceil(bottom - top + pad * 2);

      html2canvas(document.body, {
        backgroundColor: "#ffffff",
        scale: Math.max(2, (window.devicePixelRatio || 1) * 2),
        useCORS: true,
        x,
        y,
        width,
        height
      }).then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "circular-rebuild-report.png";
        link.click();
      }).finally(() => {
        target.classList.remove("export-mode");
      });
    });
  });
}












