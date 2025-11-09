// js/dateCalc.js
import {
  getDateDifference,
  addToDate,
  addToTime,
  getCountdown,
  getDayOfWeek,
  getAge
} from "./engine/dateEngine.js";

import {
  formatDatePretty,
  formatCountdown,
  saveCountdown,
  loadCountdowns,
  removeCountdown
} from "./dateHelpers.js";

/**
* loadDateCalc(container)
* Renders the date/time calculator UI into the given container element.
*/
export function loadDateCalc(container) {
  container.innerHTML = `
  <div class="date-time-calculator enhanced">
  <h2 class="dt-title">🗓️ Date & Time Calculator</h2>

  <div class="dt-tabs" role="tablist">
  <button class="dt-tab active" data-mode="difference">Date Difference</button>
  <button class="dt-tab" data-mode="addsubtract">Add / Subtract</button>
  <button class="dt-tab" data-mode="time">Time Calc</button>
  <button class="dt-tab" data-mode="countdown">Countdown / Age</button>
  </div>

  <div class="dt-content">
  <div class="dt-panel dt-difference active">
  <div class="dt-grid">
  <div>
  <label>From</label>
  <input type="date" id="diff-from" />
  <div class="muted" id="diff-from-day"></div>
  </div>
  <div>
  <label>To</label>
  <input type="date" id="diff-to" />
  <div class="muted" id="diff-to-day"></div>
  </div>
  </div>
  <div class="dt-actions">
  <button id="btn-diff" class="dt-action">Calculate Difference</button>
  <button id="btn-diff-clear" class="dt-action secondary">Reset</button>
  </div>
  <div class="dt-result-box" id="diff-result-box">
  <div class="dt-result-title">Result</div>
  <div id="diff-result" class="dt-result res-info">—</div>
  <div id="diff-summary" class="dt-summary">—</div>
  </div>
  </div>

  <div class="dt-panel dt-addsubtract">
  <div class="dt-grid">
  <div>
  <label>Base Date</label>
  <input type="date" id="base-date" />
  <div class="muted" id="base-day"></div>
  </div>
  <div>
  <label>Amount</label>
  <input type="number" id="add-amount" value="1" min="0" />
  <label>Unit</label>
  <select id="add-unit">
  <option value="days">Days</option>
  <option value="weeks">Weeks</option>
  <option value="months">Months</option>
  <option value="years">Years</option>
  </select>
  <label>Operation</label>
  <select id="add-op">
  <option value="add">Add</option>
  <option value="subtract">Subtract</option>
  </select>
  </div>
  </div>
  <div class="dt-actions">
  <button id="btn-add" class="dt-action">Compute</button>
  <button id="btn-add-today" class="dt-action secondary">Set to Today</button>
  </div>
  <div class="dt-result-box">
  <div class="dt-result-title">Result Date</div>
  <div id="add-result" class="dt-result res-ok">—</div>
  </div>
  </div>

  <div class="dt-panel dt-time">
  <div class="dt-grid">
  <div>
  <label>Start Time</label>
  <input type="time" id="time-start" step="1" value="00:00:00" />
  <div class="muted">24-hour HH:MM:SS</div>
  </div>
  <div>
  <label>Hours</label>
  <input type="number" id="time-h" value="0" />
  <label>Minutes</label>
  <input type="number" id="time-m" value="0" />
  <label>Seconds</label>
  <input type="number" id="time-s" value="0" />
  <label>Operation</label>
  <select id="time-op">
  <option value="add">Add</option>
  <option value="subtract">Subtract</option>
  </select>
  </div>
  </div>
  <div class="dt-actions">
  <button id="btn-time" class="dt-action">Compute Time</button>
  <button id="btn-time-now" class="dt-action secondary">Set to Now</button>
  </div>
  <div class="dt-result-box">
  <div class="dt-result-title">Result Time</div>
  <div id="time-result" class="dt-result res-ok">—</div>
  </div>
  </div>

  <div class="dt-panel dt-countdown">
  <div class="dt-grid">
  <div>
  <label>Target / Birth Date</label>
  <input type="date" id="count-date" />
  </div>
  <div>
  <label>Label (optional)</label>
  <input type="text" id="count-label" placeholder="e.g. Exam, Birthday" />
  <div class="muted">Save countdowns for quick recall</div>
  </div>
  </div>

  <div class="dt-actions">
  <button id="btn-countdown" class="dt-action">Start Countdown</button>
  <button id="btn-age" class="dt-action secondary">Calculate Age</button>
  <button id="btn-save-count" class="dt-action secondary">Save Countdown</button>
  </div>

  <div class="dt-result-box">
  <div class="dt-result-title">Result</div>
  <div id="count-result" class="dt-result res-info">—</div>
  </div>

  <div class="dt-saved" style="margin-top:12px;">
  <div class="dt-result-title">Saved Countdowns</div>
  <div id="saved-list"></div>
  </div>
  </div>
  </div>
  </div>
  `;

  // hook elements
  const tabs = container.querySelectorAll(".dt-tab");
  const panels = container.querySelectorAll(".dt-panel");
  const setActivePanel = (mode) => {
    tabs.forEach(t => t.classList.toggle("active", t.dataset.mode === mode));
    panels.forEach(p => p.classList.remove("active"));
    const panel = container.querySelector(`.dt-${mode}`);
    if (panel) panel.classList.add("active");
  };

  tabs.forEach(tab => {
    tab.addEventListener("click", () => setActivePanel(tab.dataset.mode));
  });

  // ----- helpers for UI nodes -----
  const el = (sel) => container.querySelector(sel);

  // Date Difference behavior (live)
  const diffFrom = el("#diff-from");
  const diffTo = el("#diff-to");
  const diffFromDay = el("#diff-from-day");
  const diffToDay = el("#diff-to-day");
  const diffResult = el("#diff-result");
  const diffSummary = el("#diff-summary");
  const diffResultBox = el("#diff-result-box");

  function computeDifference() {
    const a = diffFrom.value;
    const b = diffTo.value;
    if (!a || !b) {
      diffResult.textContent = "Please select both dates.";
      diffResult.className = "dt-result res-warn";
      diffSummary.textContent = "—";
      return;
    }
    const diff = getDateDifference(a, b, true);
    if (!diff) {
      diffResult.textContent = "Invalid dates.";
      diffResult.className = "dt-result res-error";
      diffSummary.textContent = "—";
      return;
    }
    diffResult.textContent = `${diff.years} year${diff.years === 1?"": "s"}, ${diff.months} month${diff.months === 1?"": "s"}, ${diff.days} day${diff.days === 1?"": "s"}`;
    diffResult.className = "dt-result res-ok";
    diffSummary.textContent = `Total: ${diff.totalDays} day(s) • ${diff.totalHours} hour(s) • ${diff.totalMinutes} minute(s)`;
  }

  diffFrom.addEventListener("change", () => {
    diffFromDay.textContent = diffFrom.value ? getDayOfWeek(diffFrom.value): "";
    computeDifference();
  });
  diffTo.addEventListener("change", () => {
    diffToDay.textContent = diffTo.value ? getDayOfWeek(diffTo.value): "";
    computeDifference();
  });
  el("#btn-diff").addEventListener("click", computeDifference);
  el("#btn-diff-clear").addEventListener("click", () => {
    diffFrom.value = ""; diffTo.value = ""; diffFromDay.textContent = ""; diffToDay.textContent = ""; diffResult.textContent = "—"; diffSummary.textContent = "—";
  });

  // Add/Subtract behavior
  const baseDate = el("#base-date");
  const baseDay = el("#base-day");
  baseDate.addEventListener("change", () => baseDay.textContent = baseDate.value ? getDayOfWeek(baseDate.value): "");
  el("#btn-add").addEventListener("click", () => {
    const base = baseDate.value;
    const amount = Number(el("#add-amount").value);
    const unit = el("#add-unit").value;
    const op = el("#add-op").value;
    const out = el("#add-result");
    if (!base || isNaN(amount)) {
      out.textContent = "Invalid input."; out.className = "dt-result res-error"; return;
    }
    const nd = addToDate(base, amount, unit, op);
    if (!nd) {
      out.textContent = "Error"; out.className = "dt-result res-error"; return;
    }
    out.textContent = formatDatePretty(nd);
    out.className = "dt-result res-ok";
  });
  el("#btn-add-today").addEventListener("click",
    () => {
      const todayIso = new Date().toISOString().slice(0, 10);
      baseDate.value = todayIso;
      baseDay.textContent = getDayOfWeek(todayIso);
    });

  // Time behavior
  el("#btn-time").addEventListener("click",
    () => {
      const start = el("#time-start").value || "00:00:00";
      const h = Number(el("#time-h").value) || 0;
      const m = Number(el("#time-m").value) || 0;
      const s = Number(el("#time-s").value) || 0;
      const op = el("#time-op").value;
      const out = el("#time-result");
      const res = addToTime(start, {
        h, m, s
      }, op);
      if (!res) {
        out.textContent = "Error"; out.className = "dt-result res-error"; return;
      }
      out.textContent = res;
      out.className = "dt-result res-ok";
    });
  el("#btn-time-now").addEventListener("click",
    () => {
      const now = new Date();
      const pad = n => String(n).padStart(2, '0');
      el("#time-start").value = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    });

  // Countdown & Age
  const countDate = el("#count-date");
  const countLabel = el("#count-label");
  const countResult = el("#count-result");
  const savedList = el("#saved-list");
  let countdownIntervalId = null;

  function renderSaved() {
    const list = loadCountdowns();
    if (!list.length) {
      savedList.innerHTML = "<div class='muted'>No saved countdowns.</div>"; return;
    }
    savedList.innerHTML = list.map((s, idx) => {
      const pretty = formatDatePretty(s.date);
      return `<div class="saved-item"><div class="saved-left"><strong>${escapeHtml(s.name)}</strong><div class="muted">${pretty}</div></div><div class="saved-actions"><button data-idx="${idx}" class="load-count">Load</button><button data-idx="${idx}" class="del-count">Delete</button></div></div>`;
    }).join("");
    // attach events
    savedList.querySelectorAll(".load-count").forEach(btn => {
      btn.addEventListener("click", (ev) => {
        const idx = Number(ev.currentTarget.dataset.idx);
        const list = loadCountdowns();
        if (list[idx]) {
          countDate.value = list[idx].date.slice(0, 10);
          countLabel.value = list[idx].name;
        }
      });
    });
    savedList.querySelectorAll(".del-count").forEach(btn => {
      btn.addEventListener("click",
        async (ev) => {
          const idx = Number(ev.currentTarget.dataset.idx);
          removeCountdown(idx);
          renderSaved();
        });
    });
  }

  function stopCountdown() {
    if (countdownIntervalId) {
      clearInterval(countdownIntervalId);
      countdownIntervalId = null;
    }
  }

  function startLiveCountdown(targetIso) {
    stopCountdown();
    countdownIntervalId = setInterval(() => {
      const cd = getCountdown(targetIso);
      if (!cd) {
        countResult.textContent = "Invalid date."; countResult.className = "dt-result res-error"; stopCountdown(); return;
      }
      if (cd.totalSeconds <= 0) {
        countResult.textContent = "Time reached!";
        countResult.className = "dt-result res-ok";
        stopCountdown();
        return;
      }
      countResult.textContent = formatCountdown(cd);
      countResult.className = "dt-result res-info";
    },
      1000);
  }

  el("#btn-countdown").addEventListener("click",
    () => {
      const t = countDate.value;
      if (!t) {
        countResult.textContent = "Select a date."; countResult.className = "dt-result res-warn"; return;
      }
      const iso = new Date(t).toISOString();
      startLiveCountdown(iso);
    });

  el("#btn-age").addEventListener("click",
    () => {
      const birth = countDate.value;
      if (!birth) {
        countResult.textContent = "Select a date."; countResult.className = "dt-result res-warn"; return;
      }
      const age = getAge(birth);
      if (!age) {
        countResult.textContent = "Invalid date."; countResult.className = "dt-result res-error"; return;
      }
      countResult.textContent = `${age.years} year${age.years === 1?"": "s"}, ${age.months} month${age.months === 1?"": "s"}, ${age.days} day${age.days === 1?"": "s"}`;
      countResult.className = "dt-result res-ok";
    });

  el("#btn-save-count").addEventListener("click",
    () => {
      const t = countDate.value;
      const name = (countLabel.value || "Untitled").trim();
      if (!t) {
        countResult.textContent = "Select a date to save."; countResult.className = "dt-result res-warn"; return;
      }
      const ok = saveCountdown(name, new Date(t).toISOString());
      if (!ok) {
        countResult.textContent = "Save failed."; countResult.className = "dt-result res-error"; return;
      }
      renderSaved();
      countResult.textContent = "Saved!";
      countResult.className = "dt-result res-ok";
      setTimeout(() => {
        if (countResult.textContent === "Saved!") countResult.textContent = formatDatePretty(new Date(t));
      },
        900);
    });

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
      }

      // initial render saved
      renderSaved();

      // cleanup when switching away: stop countdown

      tabs.forEach(t => t.addEventListener("click", () => stopCountdown()));

      // auto-calc for difference (live)
      [diffFrom, diffTo].forEach(inp => inp.addEventListener("input", () => computeDifference()));

      // make sure panels adjust on load
      setActivePanel("difference");
      }