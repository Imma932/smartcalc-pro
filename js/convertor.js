// js/converter.js
import { conversionData } from "./data/conversionData.js";

export function loadConverter(container) {
  container.innerHTML = `
    <div class="converter-container">
      <h2>Unit Converter</h2>
      
      <div class="converter-group">
        <select id="category-select">
          <option value="length">Length</option>
          <option value="mass">Mass</option>
          <option value="temperature">Temperature</option>
          <option value="time">Time</option>
          <option value="volume">Volume</option>
        </select>

        <div class="converter-row">
          <input type="number" id="from-value" placeholder="Enter value">
          <select id="from-unit"></select>
        </div>

        <div class="converter-row">
          <input type="text" id="to-value" readonly placeholder="Result">
          <select id="to-unit"></select>
        </div>

        <button id="convert-btn">Convert</button>
        <div class="converter-result" id="converter-result"></div>
      </div>
    </div>
  `;

  const categorySelect = container.querySelector("#category-select");
  const fromUnit = container.querySelector("#from-unit");
  const toUnit = container.querySelector("#to-unit");
  const fromValue = container.querySelector("#from-value");
  const toValue = container.querySelector("#to-value");
  const resultEl = container.querySelector("#converter-result");
  const convertBtn = container.querySelector("#convert-btn");

  // === Populate dropdowns ===
  function populateUnits(category) {
    const units = Object.keys(conversionData[category]);
    fromUnit.innerHTML = units.map(u => `<option value="${u}">${u}</option>`).join("");
    toUnit.innerHTML = units.map(u => `<option value="${u}">${u}</option>`).join("");
  }

  // === Temperature Conversion Logic ===
  function convertTemperature(value, from, to) {
    let celsius;
    if (from === "C") celsius = value;
    else if (from === "F") celsius = (value - 32) * (5 / 9);
    else if (from === "K") celsius = value - 273.15;

    let result;
    if (to === "C") result = celsius;
    else if (to === "F") result = (celsius * 9 / 5) + 32;
    else if (to === "K") result = celsius + 273.15;

    return result;
  }

  // === General conversion function ===
  function convert() {
    const category = categorySelect.value;
    const from = fromUnit.value;
    const to = toUnit.value;
    const value = parseFloat(fromValue.value);

    if (isNaN(value)) {
      resultEl.textContent = "⚠️ Please enter a valid number.";
      toValue.value = "";
      return;
    }

    let converted;

    if (category === "temperature") {
      converted = convertTemperature(value, from, to);
    } else {
      const baseValue = value * conversionData[category][from];
      converted = baseValue / conversionData[category][to];
    }

    if (!isFinite(converted)) {
      resultEl.textContent = "Conversion error.";
      toValue.value = "";
      return;
    }

    const formatted = converted.toFixed(6);
    toValue.value = formatted;
    resultEl.textContent = `${value} ${from} = ${formatted} ${to}`;
  }

  // === Event Listeners ===
  categorySelect.addEventListener("change", () => {
    populateUnits(categorySelect.value);
    resultEl.textContent = "";
    toValue.value = "";
  });

  convertBtn.addEventListener("click", convert);
  fromValue.addEventListener("input", convert);
  fromUnit.addEventListener("change", convert);
  toUnit.addEventListener("change", convert);

  // === Initialize default category ===
  populateUnits("length");
}