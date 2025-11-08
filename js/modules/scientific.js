// js/modules/scientific.js
/**
 * Scientific Functions Module
 * 
 * Handles:
 * - Powers and roots
 * - Trigonometric functions
 * - Logarithms
 * - Factorials, permutations, combinations
 * - Constants integration
 */

import { FactorialModule } from "./factorial.js";
import { getConstant } from "./constants.js";

export class ScientificModule {
  constructor() {
    this.factorialModule = new FactorialModule();
    this.angleMode = "DEG"; // default mode: DEG or RAD
  }

  // -------------------
  // ANGLE MODE MANAGEMENT
  // -------------------

  setAngleMode(mode) {
    if (["DEG", "RAD"].includes(mode.toUpperCase())) {
      this.angleMode = mode.toUpperCase();
    }
  }

  toRadians(value) {
    return this.angleMode === "DEG" ? (value * Math.PI) / 180 : value;
  }

  toDegrees(value) {
    return this.angleMode === "DEG" ? (value * 180) / Math.PI : value;
  }

  // -------------------
  // BASIC SCIENTIFIC OPS
  // -------------------

  power(base, exp) {
    return Math.pow(base, exp);
  }

  square(x) {
    return x * x;
  }

  cube(x) {
    return x * x * x;
  }

  sqrt(x) {
    return Math.sqrt(x);
  }

  cbrt(x) {
    return Math.cbrt(x);
  }

  pow10(x) {
    return Math.pow(10, x);
  }

  exp(x) {
    return Math.exp(x);
  }

  inverse(x) {
    return 1 / x;
  }

  // -------------------
  // LOGARITHMIC FUNCTIONS
  // -------------------

  log10(x) {
    return Math.log10 ? Math.log10(x) : Math.log(x) / Math.log(10);
  }

  ln(x) {
    return Math.log(x);
  }

  logBase(base, value) {
    return Math.log(value) / Math.log(base);
  }

  // -------------------
  // TRIGONOMETRIC FUNCTIONS
  // -------------------

  sin(x) {
    return Math.sin(this.toRadians(x));
  }

  cos(x) {
    return Math.cos(this.toRadians(x));
  }

  tan(x) {
    return Math.tan(this.toRadians(x));
  }

  asin(x) {
    return this.toDegrees(Math.asin(x));
  }

  acos(x) {
    return this.toDegrees(Math.acos(x));
  }

  atan(x) {
    return this.toDegrees(Math.atan(x));
  }

  // Hyperbolic functions
  sinh(x) {
    return Math.sinh(x);
  }

  cosh(x) {
    return Math.cosh(x);
  }

  tanh(x) {
    return Math.tanh(x);
  }

  // -------------------
  // FACTORIAL / COMBINATORICS
  // -------------------

  factorial(n) {
    return this.factorialModule.factorial(n);
  }

  permutation(n, r) {
    return this.factorialModule.permutation(n, r);
  }

  combination(n, r) {
    return this.factorialModule.combination(n, r);
  }

  // -------------------
  // CONSTANTS
  // -------------------

  getConstant(name) {
    return getConstant(name);
  }

  // -------------------
  // UTILITIES
  // -------------------

  negate(x) {
    return -x;
  }

  percent(x) {
    return x / 100;
  }

  random() {
    return Math.random();
  }

  abs(x) {
    return Math.abs(x);
  }
}