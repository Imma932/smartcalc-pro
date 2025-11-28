// js/currency/currencyAPI.js
// Robust fetcher with caching, fallback rates and diagnostics.

const API_BASE = "https://api.exchangerate.host/latest"; // free API; swap if you have another
const CACHE_KEY = "smartcalc_exchange_rates";
const CACHE_META_KEY = "smartcalc_exchange_meta";
const CACHE_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

// Minimal fallback rates for offline / emergency use (customize to your needs)
const fallbackRates = {
  USD: 1,
  EUR: 0.92,
  KES: 145.0,
  GBP: 0.79,
  JPY: 154.0,
  // add more if you like
};

async function fetchFromApi(base = "USD") {
  const url = `${API_BASE}?base=${encodeURIComponent(base)}`;
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
  }
  const data = await resp.json();
  if (!data || !data.rates) throw new Error("Invalid API response");
  return { rates: data.rates, date: data.date || new Date().toISOString().slice(0,10) };
}

/**
 * Returns an object: { rates: {...}, base: "USD", source: "api|cache|fallback", lastUpdated: ISO }
 */
export async function getExchangeRates(options = { base: "USD", forceRefresh: false }) {
  const base = options.base || "USD";
  try {
    // Check cache first
    const metaRaw = localStorage.getItem(CACHE_META_KEY);
    const cacheRaw = localStorage.getItem(CACHE_KEY);
    const now = Date.now();

    if (!options.forceRefresh && metaRaw && cacheRaw) {
      const meta = JSON.parse(metaRaw);
      const cache = JSON.parse(cacheRaw);
      // If cached base matches and not expired, use it
      if (meta.base === base && (now - meta.fetchedAt) < CACHE_TTL_MS) {
        return { rates: cache, base: meta.base, source: "cache", lastUpdated: new Date(meta.fetchedAt).toISOString() };
      }
    }

    // Try API
    try {
      const { rates, date } = await fetchFromApi(base);
      // store
      localStorage.setItem(CACHE_KEY, JSON.stringify(rates));
      localStorage.setItem(CACHE_META_KEY, JSON.stringify({ base, fetchedAt: Date.now(), date }));
      return { rates, base, source: "api", lastUpdated: date || new Date().toISOString() };
    } catch (apiErr) {
      console.warn("Currency API failed:", apiErr);
      // if cache exists return cache even if base mismatch (best effort)
      if (cacheRaw && metaRaw) {
        const meta = JSON.parse(metaRaw);
        const cache = JSON.parse(cacheRaw);
        return { rates: cache, base: meta.base, source: "cache-stale", lastUpdated: new Date(meta.fetchedAt).toISOString(), warning: apiErr.message };
      }
      // fallback
      console.warn("Using fallback rates");
      return { rates: fallbackRates, base: base, source: "fallback", lastUpdated: new Date().toISOString(), warning: apiErr.message };
    }
  } catch (err) {
    console.error("Unexpected error in getExchangeRates:", err);
    // last resort fallback
    return { rates: fallbackRates, base, source: "fallback", lastUpdated: new Date().toISOString(), error: err.message };
  }
}

/**
 * Helper to clear cache (useful for debugging)
 */
export function clearRatesCache() {
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(CACHE_META_KEY);
}