// js/modules/convert.js
/**
 * Conversion Module for SmartCalc Pro
 * Handles unit and number system conversions.
 */

export class ConvertModule {
  constructor() {}

  // ---------- UNIT CONVERSIONS ---------- //

  // Length conversions (base unit: meter)
  length(value, from, to) {
    const map = {
      m: 1,
      km: 1000,
      cm: 0.01,
      mm: 0.001,
      mi: 1609.34,
      yd: 0.9144,
      ft: 0.3048,
      in: 0.0254,
    };
    return (value * map[from]) / map[to];
  }

  // Mass conversions (base unit: kilogram)
  mass(value, from, to) {
    const map = {
      kg: 1,
      g: 0.001,
      mg: 1e-6,
      lb: 0.453592,
      oz: 0.0283495,
    };
    return (value * map[from]) / map[to];
  }

  // Time conversions (base unit: second)
  time(value, from, to) {
    const map = {
      s: 1,
      ms: 0.001,
      min: 60,
      hr: 3600,
      day: 86400,
    };
    return (value * map[from]) / map[to];
  }

  // Temperature conversions
  temperature(value, from, to) {
    if (from === to) return value;

    // Convert from source → Celsius
    let c;
    switch (from) {
      case "C": c = value; break;
      case "F": c = (value - 32) * (5 / 9); break;
      case "K": c = value - 273.15; break;
      default: return NaN;
    }

    // Convert from Celsius → target
    switch (to) {
      case "C": return c;
      case "F": return (c * 9) / 5 + 32;
      case "K": return c + 273.15;
      default: return NaN;
    }
  }

  // ---------- NUMBER SYSTEM CONVERSIONS ---------- //

  toBinary(value) {
    return (value >>> 0).toString(2);
  }

  toOctal(value) {
    return (value >>> 0).toString(8);
  }

  toDecimal(value, base = 10) {
    return parseInt(value, base);
  }

  toHex(value) {
    return (value >>> 0).toString(16).toUpperCase();
  }

  // ---------- GENERAL EVALUATOR ---------- //
  evaluate(type, value, from, to) {
    switch (type) {
      case "length": return this.length(value, from, to);
      case "mass": return this.mass(value, from, to);
      case "time": return this.time(value, from, to);
      case "temp": return this.temperature(value, from, to);
      case "bin": return this.toBinary(value);
      case "oct": return this.toOctal(value);
      case "dec": return this.toDecimal(value, from); // here 'from' is base
      case "hex": return this.toHex(value);
      default: return NaN;
    }
  }
}