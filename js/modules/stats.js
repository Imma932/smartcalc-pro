// js/modules/stats.js
/**
 * Statistics and Combinatorics Module for SmartCalc Pro
 * Handles factorials, permutations, combinations, and basic statistics.
 */

export class StatsModule {
  constructor() {}

  // Factorial (n!)
  factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  }

  // Permutation: nPr = n! / (n - r)!
  permutation(n, r) {
    if (r > n || n < 0 || r < 0) return NaN;
    return this.factorial(n) / this.factorial(n - r);
  }

  // Combination: nCr = n! / [r! * (n - r)!]
  combination(n, r) {
    if (r > n || n < 0 || r < 0) return NaN;
    return this.factorial(n) / (this.factorial(r) * this.factorial(n - r));
  }

  // Mean (average)
  mean(data) {
    if (!Array.isArray(data) || data.length === 0) return NaN;
    return data.reduce((a, b) => a + b, 0) / data.length;
  }

  // Variance
  variance(data) {
    if (!Array.isArray(data) || data.length === 0) return NaN;
    const avg = this.mean(data);
    return this.mean(data.map(x => (x - avg) ** 2));
  }

  // Standard deviation
  stddev(data) {
    const v = this.variance(data);
    return Math.sqrt(v);
  }

  // Random number generation (0–1)
  random() {
    return Math.random();
  }

  // Random integer between min and max (inclusive)
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Evaluate by function name
  evaluate(func, ...args) {
    switch (func) {
      case "n!": return this.factorial(args[0]);
      case "nPr": return this.permutation(args[0], args[1]);
      case "nCr": return this.combination(args[0], args[1]);
      case "mean": return this.mean(args[0]);
      case "variance": return this.variance(args[0]);
      case "stddev": return this.stddev(args[0]);
      case "rand": return this.random();
      case "randInt": return this.randomInt(args[0], args[1]);
      default: return NaN;
    }
  }
}