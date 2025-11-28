// js/currency/currencyCalc.js
import { getExchangeRates, clearRatesCache } from "./data/currencyAPI.js";

/**
 * loadCurrencyCalculator(container)
 * container: element to render into (e.g., document.getElementById('app') or similar)
 */
export async function loadCurrencyCalculator(container) {
  // if container param isn't provided, try default id 'app' or 'app-content'
  container = container || document.getElementById("app") || document.getElementById("app-content");
  if (!container) throw new Error("No container element found to load currency calculator.");

  container.innerHTML = `
    <div class="currency-container">
      <h2>Currency Converter</h2>
      <div class="currency-form">
        <input type="number" id="cur-amount" placeholder="Enter amount" min="0" step="any" />
        <div style="display:flex;gap:8px;align-items:center;justify-content:center;margin-top:8px">
          <select id="cur-from" style="flex:1"></select>
          <button id="swap-currencies" title="Swap" style="width:44px">⇄</button>
          <select id="cur-to" style="flex:1"></select>
        </div>
        <div style="display:flex;gap:8px;justify-content:center;margin-top:12px">
          <button id="convertBtn">Convert</button>
          <button id="refreshRates" title="Refresh rates">Refresh</button>
          <button id="clearCache" title="Clear cache">Clear Cache</button>
        </div>
      </div>

      <div id="conversionResult" class="result-display" style="margin-top:12px"></div>
      <div id="rateMeta" style="margin-top:6px;font-size:0.9rem;color:#aaa"></div>
    </div>
  `;

  const amountEl = container.querySelector("#cur-amount");
  const fromEl = container.querySelector("#cur-from");
  const toEl = container.querySelector("#cur-to");
  const convertBtn = container.querySelector("#convertBtn");
  const swapBtn = container.querySelector("#swap-currencies");
  const refreshBtn = container.querySelector("#refreshRates");
  const clearCacheBtn = container.querySelector("#clearCache");
  const resultDiv = container.querySelector("#conversionResult");
  const metaDiv = container.querySelector("#rateMeta");

  // load initial rates (base USD)
  let currentBase = "USD";
  let lastFetched = null;
  let loadedRates = null;
  let loadedSource = null;

  async function loadRates(base = "USD", force = false) {
    resultDiv.textContent = "Loading rates…";
    try {
      const { rates, source, lastUpdated, warning, error } = await getExchangeRates({ base, forceRefresh: force });
      loadedRates = rates;
      currentBase = base;
      loadedSource = source;
      lastFetched = lastUpdated;
      populateSelects(Object.keys(rates).sort());
      metaDiv.textContent = `Source: ${source}${lastUpdated ? " • Last: " + lastUpdated : ""}${warning ? " • Warning: " + warning : ""}${error ? " • Error: " + error : ""}`;
      resultDiv.textContent = "";
    } catch (err) {
      console.error(err);
      resultDiv.textContent = "Failed to load rates.";
      metaDiv.textContent = "Error fetching rates.";
    }
  }

  function populateSelects(list) {
    // remove duplicates / ensure common currencies exist
    if (!Array.isArray(list) || !list.length) list = ["USD","EUR","GBP","KES","JPY"];
    fromEl.innerHTML = list.map(c => `<option value="${c}">${c}</option>`).join("");
    toEl.innerHTML = list.map(c => `<option value="${c}">${c}</option>`).join("");
    // sensible defaults
    if (!fromEl.value) fromEl.value = "USD";
    if (!toEl.value) toEl.value = "EUR";
  }

  function convertNow() {
    const amount = parseFloat(amountEl.value);
    const from = fromEl.value;
    const to = toEl.value;
    if (!loadedRates) {
      resultDiv.textContent = "Rates not loaded yet.";
      return;
    }
    if (isNaN(amount)) {
      resultDiv.textContent = "Please enter a valid amount.";
      return;
    }
    // Strategy: get rates relative to loadedRates base
    // If API returned rates with `base == currentBase`, then value_in_base = amount / rate[from] * (if needed)
    // Using exchangerate.host we asked for rates with base equal to 'from' when converting; but here we keep a general approach:
    // Convert amount in 'from' to target using rates: amount_in_baseUSD -> converted
    // If rates are relative to base X, we can convert via: amount_in_to = amount * (rate_to / rate_from)
    // But our getExchangeRates returns rates keyed by currency where 1 base = rates[currency].
    // So use ratio: converted = amount * (rates[to] / rates[from])
    const rateFrom = loadedRates[from];
    const rateTo = loadedRates[to];
    if (!rateFrom || !rateTo) {
      resultDiv.textContent = "Selected currencies not supported by rates.";
      return;
    }
    const converted = amount * (rateTo / rateFrom);
    resultDiv.textContent = `${amount} ${from} = ${converted.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${to}`;
  }

  // events
  convertBtn.addEventListener("click", convertNow);
  amountEl.addEventListener("keyup", (e) => {
    // Enter key triggers convert
    if (e.key === "Enter") convertNow();
  });
  swapBtn.addEventListener("click", () => {
    const a = fromEl.value;
    fromEl.value = toEl.value;
    toEl.value = a;
    convertNow();
  });

  refreshBtn.addEventListener("click", async () => {
    await loadRates(currentBase, true);
  });
  clearCacheBtn.addEventListener("click", () => {
    clearRatesCache();
    resultDiv.textContent = "Cache cleared. Reloading rates…";
    loadRates(currentBase, true);
  });

  // load rates on start
  await loadRates(currentBase, false);
}