// js/engine/dateEngine.js
/**
 * Date engine utilities for SmartCalc Pro (enhanced)
 *
 * Exports:
 *  - toDate(input)
 *  - getDateDifference(a,b, includeTime=false) -> {years,months,days,hours,minutes,seconds, totalDays, totalHours, totalMinutes}
 *  - addToDate(base, amount, unit, operation) -> Date
 *  - addToTime(timeStr, adjust, operation) -> "HH:MM:SS"
 *  - getCountdown(target) -> {days,hours,minutes,seconds, totalSeconds}
 *  - getDayOfWeek(dateStr) -> "Monday"
 *  - getAge(birth) -> {years,months,days}
 */

function toDate(d) {
  if (!d) return null;
  if (d instanceof Date) return new Date(d.getTime());
  // Accept yyyy-mm-dd, ISO, or Date string
  const dt = new Date(d);
  if (!isNaN(dt)) return dt;
  return null;
}

export function getDateDifference(a, b, includeTime = false) {
  const A = toDate(a);
  const B = toDate(b);
  if (!A || !B) return null;

  // Ensure start <= end
  let start = A < B ? new Date(A) : new Date(B);
  let end = A < B ? new Date(B) : new Date(A);

  // compute totals
  const totalMs = end.getTime() - start.getTime();
  const totalSeconds = Math.floor(totalMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);
  // Years/months/days by calendar
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();
  let hours = end.getHours() - start.getHours();
  let minutes = end.getMinutes() - start.getMinutes();
  let seconds = end.getSeconds() - start.getSeconds();

  if (seconds < 0) { seconds += 60; minutes -= 1; }
  if (minutes < 0) { minutes += 60; hours -= 1; }
  if (hours < 0) { hours += 24; days -= 1; }

  if (days < 0) {
    // borrow from previous month (end's previous month)
    const prevMonthLastDay = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    days += prevMonthLastDay;
    months -= 1;
  }
  if (months < 0) { months += 12; years -= 1; }

  const result = { years, months, days, hours, minutes, seconds, totalDays, totalHours, totalMinutes, totalSeconds };
  // fill totals
  result.totalDays = totalDays;
  result.totalHours = totalHours;
  result.totalMinutes = totalMinutes;
  result.totalSeconds = totalSeconds;

  if (includeTime) return result;
  return { years, months, days, totalDays };
}

export function addToDate(base, amount, unit = "days", operation = "add") {
  const date = toDate(base);
  if (!date || typeof amount !== "number" || isNaN(amount)) return null;
  const sign = operation === "subtract" ? -1 : 1;
  const amt = sign * amount;
  const res = new Date(date.getTime());

  switch (unit) {
    case "days":
      res.setDate(res.getDate() + amt);
      break;
    case "weeks":
      res.setDate(res.getDate() + amt * 7);
      break;
    case "months": {
      const originalDay = res.getDate();
      res.setMonth(res.getMonth() + amt);
      // fix overflow (e.g., Jan 31 -> Feb)
      if (res.getDate() < originalDay) {
        res.setDate(0); // last day previous month
      }
      break;
    }
    case "years": {
      const m = res.getMonth();
      res.setFullYear(res.getFullYear() + amt);
      if (m === 1 && res.getMonth() !== m) res.setDate(0);
      break;
    }
    default:
      return null;
  }
  return res;
}

export function addToTime(timeStr, adjust = { h: 0, m: 0, s: 0 }, operation = "add") {
  if (!timeStr) return null;
  const parts = timeStr.split(":").map(p => Number(p || 0));
  let [h = 0, m = 0, s = 0] = parts;
  const sign = operation === "subtract" ? -1 : 1;
  let totalSeconds = h * 3600 + m * 60 + s;
  totalSeconds += sign * ((adjust.h || 0) * 3600 + (adjust.m || 0) * 60 + (adjust.s || 0));
  totalSeconds = ((totalSeconds % 86400) + 86400) % 86400;
  const rh = Math.floor(totalSeconds / 3600);
  const rm = Math.floor((totalSeconds % 3600) / 60);
  const rs = totalSeconds % 60;
  const pad = n => String(n).padStart(2, "0");
  return `${pad(rh)}:${pad(rm)}:${pad(rs)}`;
}

export function getCountdown(target) {
  const now = new Date();
  const t = toDate(target);
  if (!t) return null;
  let diff = Math.max(0, t.getTime() - now.getTime());
  const days = Math.floor(diff / (24 * 3600 * 1000));
  diff -= days * 24 * 3600 * 1000;
  const hours = Math.floor(diff / (3600 * 1000));
  diff -= hours * 3600 * 1000;
  const minutes = Math.floor(diff / (60 * 1000));
  diff -= minutes * 60 * 1000;
  const seconds = Math.floor(diff / 1000);
  return { days, hours, minutes, seconds, totalSeconds: Math.floor((t.getTime() - now.getTime())/1000) };
}

export function getDayOfWeek(date) {
  const d = toDate(date);
  if (!d) return null;
  return d.toLocaleDateString(undefined, { weekday: "long" });
}

export function getAge(birth) {
  const b = toDate(birth);
  const now = new Date();
  if (!b) return null;
  return getDateDifference(b, now, false);
}