// factorial.js — factorial, permutations, combinations

export const factorialModule = {
  factorial(n) {
    n = Math.floor(n);
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  }
};