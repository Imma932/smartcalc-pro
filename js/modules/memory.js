// js/modules/memory.js
/**
 * Constants and Memory Module for SmartCalc Pro
 * Handles constants, previous answer (ANS), and memory storage operations.
 */

export class MemoryModule {
  constructor() {
    this.memory = 0;        // Stored memory value
    this.lastAnswer = 0;    // Previous calculation result (ANS)
  }

  // Memory operations
  memoryClear() {
    this.memory = 0;
  }

  memoryRecall() {
    return this.memory;
  }

  memoryStore(value) {
    this.memory = value;
  }

  memoryAdd(value) {
    this.memory += value;
  }

  memorySubtract(value) {
    this.memory -= value;
  }

  // ANS operations
  setLastAnswer(value) {
    this.lastAnswer = value;
  }

  getLastAnswer() {
    return this.lastAnswer;
  }

  // Physical constants
  getConstant(name) {
    const constants = {
      pi: Math.PI,
      e: Math.E,
      c: 299792458,        // Speed of light in m/s
      G: 6.67430e-11,      // Gravitational constant
      h: 6.62607015e-34,   // Planck’s constant
      Na: 6.02214076e23,   // Avogadro’s number
      k: 1.380649e-23,     // Boltzmann constant
      R: 8.314462618,      // Universal gas constant
    };
    return constants[name] ?? NaN;
  }

  // Evaluate function by command
  evaluate(func, value = null) {
    switch (func) {
      case "MS": this.memoryStore(value); return this.memory;
      case "MR": return this.memoryRecall();
      case "M+": this.memoryAdd(value); return this.memory;
      case "M-": this.memorySubtract(value); return this.memory;
      case "MC": this.memoryClear(); return 0;
      case "ANS": return this.getLastAnswer();
      default: return this.getConstant(func);
    }
  }
}