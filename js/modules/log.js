// log.js — logarithmic functions

export const logModule = {
  log10(x) { return Math.log10(x); },
  ln(x) { return Math.log(x); },
  log(x, base) { return Math.log(x) / Math.log(base || 10); }
};