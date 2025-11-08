// scientificCalc.js — builds scientific calculator UI and links to MathEngine

import { MathEngine } from "./engine/mathEngine.js";

export function loadScientificCalc(container) {
  container.innerHTML = `
    <div class="calculator scientific">
      <input type="text" id="sci-display" readonly class="display" />
      <div class="sci-buttons"></div>
    </div>
  `;

  const engine = new MathEngine();
  const display = container.querySelector("#sci-display");
  const buttons = container.querySelector(".sci-buttons");

  const btnLayout = [
    ["AC", "DEL", "(", ")", "÷"],
    ["sin", "cos", "tan", "π", "%"],
    ["7", "8", "9", "×", "^"],
    ["4", "5", "6", "−", "√"],
    ["1", "2", "3", "+", "x²"],
    ["0", ".", "ANS", "=", "log"]
  ];

  // build button grid
  buttons.innerHTML = btnLayout
    .map(
      (row) =>
        `<div class="row">${row
          .map(
            (label) =>
              `<button class="btn" data-value="${label}">${label}</button>`
          )
          .join("")}</div>`
    )
    .join("");

  let lastAnswer = "";

  buttons.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const val = btn.dataset.value;

      if (val === "AC") display.value = "";
      else if (val === "DEL") display.value = display.value.slice(0, -1);
      else if (val === "=") {
        const result = engine.evaluate(display.value);
        display.value = result;
        lastAnswer = result;
      } else if (val === "ANS") display.value += lastAnswer;
      else if (val === "π") display.value += "π";
      else if (val === "√") display.value += "sqrt(";
      else if (val === "x²") display.value += "^2";
      else display.value += val;
    });
  });
}