export function loadBasicCalculator() {
  const app = document.getElementById("basic-calculator");
  app.innerHTML = `
    <div class="calculator">
      <input type="text" id="display" readonly>
      <div class="buttons">
        <button>C</button>
        <button>DEL</button>
        <button>%</button>
        <button>/</button>
        <button>7</button>
        <button>8</button>
        <button>9</button>
        <button>*</button>
        <button>4</button>
        <button>5</button>
        <button>6</button>
        <button>-</button>
        <button>1</button>
        <button>2</button>
        <button>3</button>
        <button>+</button>
        <button>ANS</button>
        <button>0</button>
        <button>.</button>
        <button>=</button>
      </div>
    </div>
  `;

  const display = document.getElementById("display");
  const buttons = app.querySelectorAll("button");
  let currentInput = "";
  let lastAnswer = "0";

  // Utility function to safely evaluate expressions
  function safeEval(expr) {
    try {
      return Function(`'use strict'; return (${expr})`)();
    } catch {
      return "Error";
    }
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.textContent;

      if (value === "C") {
        currentInput = "";
      } 
      else if (value === "DEL") {
        currentInput = currentInput.slice(0, -1);
      } 
      else if (value === "ANS") {
        currentInput += lastAnswer;
      } 
      else if (value === "=") {
        try {
          let expression = currentInput;

          // Handle percentages properly
          expression = expression.replace(/(\d+(\.\d+)?)%/g, "($1/100)");

          const result = safeEval(expression);
          lastAnswer = result.toString();
          currentInput = lastAnswer;
        } catch {
          currentInput = "Error";
        }
      } 
      else {
        currentInput += value;
      }

      display.value = currentInput;
      display.scrollLeft = display.scrollWidth; // Auto-scroll to end
    });
  });
}