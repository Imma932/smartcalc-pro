export function loadBasicCalculator() {
  const app = document.getElementById("basic-calculator");
  app.innerHTML = `
    <div class="calculator">
      <input type="text" id="display" readonly>
      <div class="buttons">
        <button>C</button>
        <button>%</button>
        <button>/</button>
        <button>*</button>
        <button>7</button>
        <button>8</button>
        <button>9</button>
        <button>-</button>
        <button>4</button>
        <button>5</button>
        <button>6</button>
        <button>+</button>
        <button>1</button>
        <button>2</button>
        <button>3</button>
        <button>=</button>
        <button>0</button>
        <button>.</button>
      </div>
    </div>
  `;

  const display = document.getElementById("display");
  const buttons = app.querySelectorAll("button");
  let currentInput = "";

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.textContent;

      if (value === "C") {
        currentInput = "";
      } else if (value === "=") {
        try {
          currentInput = eval(currentInput).toString();
        } catch {
          currentInput = "Error";
        }
      } else {
        currentInput += value;
      }

      display.value = currentInput;
    });
  });
}