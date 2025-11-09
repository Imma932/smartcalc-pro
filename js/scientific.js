// js/scientificCalc.js
// Scientific UI (updated 4-column layout + better functionality)
import { MathEngine } from "./engine/mathEngine.js";

export function loadScientificCalc(container) {
  container.innerHTML = `
    <div class="scientific-calculator">
      <div class="calc-display" id="sci-display">
        <div class="expression" id="sci-expression"></div>
        <div class="result" id="sci-result"></div>
      </div>

      <div class="sci-buttons" id="sci-buttons"></div>
    </div>
  `;

  const engine = new MathEngine();
  const exprEl = container.querySelector("#sci-expression");
  const resEl = container.querySelector("#sci-result");
  const buttonsEl = container.querySelector("#sci-buttons");

  // === Layout (4 columns) ===
  const btnLayout = [
    ["AC", "DEL", "(", ")"],
    ["sin(", "cos(", "tan(", "√("],
    ["asin(", "acos(", "atan(", "ln("],
    ["sinh(", "cosh(", "tanh(", "log("],
    ["x²", "x³", "x⁻¹", "n!"],
    ["10^(", "e^(", "π", "E"],
    ["7", "8", "9", "÷"],
    ["4", "5", "6", "×"],
    ["1", "2", "3", "−"],
    ["0", ".", "%", "+"],
    ["ANS", "Rand", "^", "="]
  ];

  // Build grid (4 columns)
  buttonsEl.innerHTML = btnLayout
    .map(row => row.map(label =>
      `<button class="btn" data-value="${encodeURIComponent(label)}">${label}</button>`
    ).join("")).join("");

  let expression = "";
  let lastAnswer = "";

  const decode = v => decodeURIComponent(v);

  // === Normalize visual tokens for engine ===
  function normalizeExpression(expr) {
    let e = expr;
    e = e.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
    e = e.replace(/π/g, "π").replace(/\bE\b/g, "E");
    return e;
  }

  // === Update display & live preview ===
  function updateUI() {
    exprEl.textContent = expression || "0";
    try {
      const preview = engine.evaluate(normalizeExpression(expression));
      resEl.textContent = preview !== "Error" ? preview : "";
    } catch {
      resEl.textContent = "";
    }
  }

  // === Click Handlers ===
  buttonsEl.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const val = decode(btn.dataset.value);

      switch (val) {
        case "AC":
          expression = "";
          resEl.textContent = "";
          break;
        case "DEL":
          expression = expression.slice(0, -1);
          break;
        case "=":
          try {
            const result = engine.evaluate(normalizeExpression(expression));
            resEl.textContent = result;
            lastAnswer = String(result);
            expression = String(result);
          } catch {
            resEl.textContent = "Error";
            expression = "";
          }
          break;
        case "ANS":
          expression += lastAnswer || "0";
          break;
        case "√(":
          expression += "sqrt(";
          break;
        case "x²":
          expression += "^2";
          break;
        case "x³":
          expression += "^3";
          break;
        case "x⁻¹":
          expression += "^-1";
          break;
        case "n!":
          expression += "factorial(";
          break;
        case "10^(":
        case "e^(":
          expression += val;
          break;
        case "Rand":
          expression += "random()";
          break;
        default:
          expression += val;
      }

      updateUI();
    });
  });

  // === Keyboard Support ===
  window.addEventListener("keydown", (ev) => {
    const key = ev.key;
    if (/^[0-9+\-*/().%]$/.test(key)) {
      expression += key;
      updateUI();
    } else if (key === "Enter") {
      try {
        const result = engine.evaluate(normalizeExpression(expression));
        resEl.textContent = result;
        lastAnswer = String(result);
        expression = String(result);
      } catch {
        resEl.textContent = "Error";
        expression = "";
      }
    } else if (key === "Backspace") {
      expression = expression.slice(0, -1);
      updateUI();
    }
  });

  updateUI();
}