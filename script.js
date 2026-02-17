let data = [];
let chart = null;
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

    const rows = text.trim().split("\n").slice(1);

    data = rows.map(r => {
      const c = r.split(",");
      return {
        customerChoice: c[0]?.trim(),
        boden: c[1]?.trim(),
        installed: c[2]?.trim(),
        userChoice: c[3]?.trim(),
        a1Installed: parseFloat(c[4]),
        newOption: c[5]?.trim(),
        a1New: parseFloat(c[6])
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

const productCard = installedSelect.closest(".card");
const eolCard = userChoiceSelect.closest(".card");

/* =========================
   LOGIN / LOGOUT
========================= */
function lockApp() {
  document.body.classList.add("app-locked");
  if (loginScreen) loginScreen.classList.remove("hidden");
  if (logoutBtn) logoutBtn.classList.add("hidden");
}

function unlockApp() {
  document.body.classList.remove("app-locked");
  if (loginScreen) loginScreen.classList.add("hidden");
  if (logoutBtn) logoutBtn.classList.remove("hidden");
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
}

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

  bodenSelect.innerHTML = `<option value="">Select floor type</option>`;
  installedSelect.innerHTML = `<option value="">Select product</option>`;
  userChoiceSelect.innerHTML = `<option value="">Select end-of-life</option>`;
  if (subtypeSelect) subtypeSelect.innerHTML = `<option value="">Select configuration</option>`;
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
    `<option value="">Select product</option>` +
    products.map(p => `<option value="${p}">${p}</option>`).join("");
});

/* =========================
   SUBTYPE FILTER (NEW PRODUCT ONLY)
========================= */
function handleSubtypeFilter() {

  if (!subtypeSelect) return;

  subtypeSelect.innerHTML = `<option value="">Select configuration</option>`;
  if (subTypeCard) subTypeCard.classList.remove("hidden");

  if (bodenSelect.value === "Calcium Sulphate") {
    subtypeSelect.innerHTML += `
      <option value="raised">Raised access floor</option>
      <option value="hollow">Hollow floor</option>
    `;
  }

  if (bodenSelect.value === "Wooden Floors") {
    subtypeSelect.innerHTML += `
      <option value="panel">Panel</option>
      <option value="steel">Panel with steel</option>
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
    `<option value="">Select end-of-life</option>` +
    choices.map(c => `<option value="${c}">${c}</option>`).join("");
});

/* =========================
   END OF LIFE
========================= */
userChoiceSelect.addEventListener("change", () => {

  resetDashboard();

  if (!userChoiceSelect.value) return;

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

/* =========================
   NEW PRODUCT COMPARISON
========================= */
function showNewProductComparison() {

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
      filtered = filtered.filter(d => d.installed === "F&M");

    if (subtypeSelect.value === "panel")
      filtered = filtered.filter(d => d.installed === "LIGNA");

    if (subtypeSelect.value === "steel")
      filtered = filtered.filter(d => d.installed === "LIGNA ST");
  }

  if (!filtered.length) return;

  comparisonTitle.innerText =
    `${bodenSelect.value} >> Circular Product Comparison`;

  commentaryBox.innerHTML = `
    <div class="comparison-grid alt-new">
      ${filtered.map(row => {

        const saving =
          ((row.a1Installed - row.a1New) / row.a1Installed) * 100;

        return `
          <div class="product-panel alt-card">
            <div class="alt-split">
              <div class="alt-block first-life">
                <small>FIRST LIFE</small>
                <h4>${row.installed}</h4>
                <p>${row.a1Installed} kg CO<sub>2</sub></p>
              </div>

              <div class="alt-divider">----->>></div>

              <div class="alt-block circular-life">
                <small>CIRCULAR LIFE</small>
                <h4>${row.newOption}</h4>
                <p>${row.a1New} kg CO<sub>2</sub></p>
                <div class="saving-text under-circular">
                  ${saving.toFixed(1)}% CO<sub>2</sub> saving
                </div>
                <div class="saving-bar under-circular">
                  <div class="saving-fill" style="width:${saving}%"></div>
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

  const saved = row.a1Installed - row.a1New;
  const percent = ((saved / row.a1Installed) * 100).toFixed(1);

  comparisonTitle.innerHTML =
    `${row.installed} → ${row.newOption}`;

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
      <h4>Reuse – Second life activated</h4>
    </div>

    <div class="eol-pill-row">
      <div class="eol-pill positive">♻ Product retained</div>
      <div class="eol-pill positive">🔄 Lifecycle extended through it's second life</div>
      <div class="eol-pill positive">📉 ${percent}% CO₂ reduction</div>
    </div>
  `;

  drawChart(saved, row.a1New);

  resultBox.classList.remove("hidden");
}

/* =========================
   OTHER EOL
========================= */
function showEndOfLife(row) {

  const type = row.userChoice.toLowerCase();
  setReuseSavings(false, 0);

  comparisonTitle.innerText =
    `${row.installed} – ${row.userChoice}`;

  commentaryBox.innerHTML =
    `<p><strong>A1–C4 impact:</strong> ${row.a1Installed} kg CO₂</p>`;

  whatIfBox.classList.remove("hidden");

  let content = "";

  if (type === "recycling") {
    content = `
      <div class="eol-header">🟠 Recycling</div>
      <div class="eol-steps">
        <div class="eol-step">♻ Material recovery</div>
        <div class="eol-step">⚙ Processing</div>
        <div class="eol-step">◐ Partial value retained</div>
      </div>
    `;
  }

  if (type === "landfilling") {
    content = `
      <div class="eol-header">🔴 Landfilling</div>
      <div class="eol-steps">
        <div class="eol-step">🗑 Permanent material loss</div>
        <div class="eol-step">⛔ End of lifecycle</div>
        <div class="eol-step">✖ No recovery</div>
      </div>
    `;
  }

  if (type === "incineration") {
    content = `
      <div class="eol-header">🔥 Incineration</div>
      <div class="eol-steps">
        <div class="eol-step">🔥 Product Burned</div>
        <div class="eol-step">💨 Material destroyed</div>
        <div class="eol-step">⚡ Thermal and Electric output</div>
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
      labels: ["CO₂ Saved", "Emboided CO₂(second life)"],
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
