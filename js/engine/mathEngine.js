// mathEngine.js — safe evaluation of scientific expressions

import { trigModule } from "../modules/trig.js";
import { logModule } from "../modules/log.js";
import { powerModule } from "../modules/power.js";
import { factorialModule } from "../modules/factorial.js";
import { constantsModule } from "../modules/constants.js";

export class MathEngine {
  constructor() {
    this.lastAnswer = 0;
    this.angleMode = "DEG"; // default mode
    this.scientific = {
      ...trigModule,
      ...logModule,
      ...powerModule,
    };
    this.factorialModule = factorialModule;
    this.constants = constantsModule;
  }

  evaluate(expr) {
    try {
      if (!expr || expr.trim() === "") return "";

      let expression = expr.trim();

      // Replace constants
      expression = expression.replace(/\bπ\b/g, Math.PI);
      expression = expression.replace(/\bE\b/g, Math.E);
      expression = expression.replace(/\bANS\b/g, this.lastAnswer);

      // Function evaluation pass
      const funcRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^()]*)\)/;
      let guard = 0;
      while (funcRegex.test(expression) && guard < 100) {
        guard++;
        expression = expression.replace(funcRegex, (match, fn, argStr) => {
          const argVal = this.evaluate(argStr);
          const name = fn.toLowerCase();

          // route functions
          if (this.scientific[name]) return this.scientific[name](Number(argVal));
          if (this.factorialModule[name])
            return this.factorialModule[name](Number(argVal));
          if (Math[name]) return Math[name](Number(argVal));

          return match; // unknown
        });
      }

      // Percentage
      expression = expression.replace(/(\d+(\.\d+)?)%/g, "($1/100)");

      // Replace × ÷ ^ symbols
      expression = expression.replace(/×/g, "*").replace(/÷/g, "/");
      expression = expression.replace(/\^/g, "**");

      const result = Function(`"use strict"; return (${expression})`)();
      if (!Number.isFinite(result)) throw new Error("Math error");

      this.lastAnswer = result;
      return result;
    } catch (err) {
      console.error("MathEngine error:", err);
      return "Error";
    }
  }
}