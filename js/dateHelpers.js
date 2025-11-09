// js/utils/dateHelpers.js
/**
 * Small helpers for date UI formatting and storage
 */

export function formatDatePretty(dateInput) {
  if (!dateInput) return "—";
  const d = (dateInput instanceof Date) ? dateInput : new Date(dateInput);
  if (isNaN(d)) return "Invalid date";
  // Example: "Nov 9, 2025 (Sunday)"
  const datePart = d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  const weekday = d.toLocaleDateString(undefined, { weekday: "long" });
  return `${datePart} (${weekday})`;
}

export function padTime(h, m, s) {
  const pad = n => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function formatCountdown(obj) {
  if (!obj) return "—";
  const parts = [];
  if (obj.days > 0) parts.push(`${obj.days} day${obj.days === 1 ? "" : "s"}`);
  if (obj.hours > 0) parts.push(`${obj.hours} hour${obj.hours === 1 ? "" : "s"}`);
  if (obj.minutes > 0) parts.push(`${obj.minutes} minute${obj.minutes === 1 ? "" : "s"}`);
  if (obj.seconds >= 0) parts.push(`${obj.seconds} second${obj.seconds === 1 ? "" : "s"}`);
  return parts.length ? parts.join(", ") : "0 seconds";
}

const STORAGE_KEY = "smartcalc_countdowns";

export function saveCountdown(name, isoDate) {
  try {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    list.push({ name, date: isoDate });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}

export function loadCountdowns() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function removeCountdown(index) {
  try {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    list.splice(index, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}