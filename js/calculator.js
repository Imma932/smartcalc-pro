// basicCalc.js — simple calculator view for SmartCalc Pro

export function loadBasicCalc(container) {
  container.innerHTML = `
    <div class="calculator">
      <h1 class="logo-calc">SmartCalc Pro</h1>
      <input type="text" id="display" readonly class="display" />
      <div class="buttons">
        <button class="btn" data-action="clear">AC</button>
        <button class="btn" data-action="delete">DEL</button>
        <button class="btn" data-value="%">%</button>
        <button class="btn" data-value="/">÷</button>

        <button class="btn" data-value="7">7</button>
        <button class="btn" data-value="8">8</button>
        <button class="btn" data-value="9">9</button>
        <button class="btn" data-value="*">×</button>

        <button class="btn" data-value="4">4</button>
        <button class="btn" data-value="5">5</button>
        <button class="btn" data-value="6">6</button>
        <button class="btn" data-value="-">−</button>

        <button class="btn" data-value="1">1</button>
        <button class="btn" data-value="2">2</button>
        <button class="btn" data-value="3">3</button>
        <button class="btn" data-value="+">+</button>

        <button class="btn" data-value="0">0</button>
        <button class="btn" data-value=".">.</button>
        <button class="btn" data-action="ans">ANS</button>
        <button class="btn equal" data-action="equals">=</button>
      </div>
    </div>
  `;

  const display = container.querySelector("#display");
  let lastAnswer = "";

  container.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.dataset.value;
      const action = btn.dataset.action;

      if (value) {
        display.value += value;
      } else if (action === "clear") {
        display.value = "";
      } else if (action === "delete") {
        display.value = display.value.slice(0, -1);
      } else if (action === "equals") {
        try {
          const result = Function(`"use strict"; return (${display.value.replace(/÷/g,"/").replace(/×/g,"*")})`)();
          display.value = result;
          lastAnswer = result;
        } catch {
          display.value = "Error";
        }
      } else if (action === "ans") {
        display.value += lastAnswer;
      }
    });
  });
}