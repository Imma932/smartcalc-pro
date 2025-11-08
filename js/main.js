// main.js — entry point that loads header, footer, and calculators

import { loadHeader, loadFooter } from "./utils.js";
import { loadBasicCalc } from "./calculator.js";
import { loadScientificCalc } from "./scientific.js";

document.addEventListener("DOMContentLoaded", () => {
  loadHeader();
  loadFooter();

  const container = document.getElementById("basic-calculator");

  // handle nav switches
  document.getElementById("navbar").addEventListener("click", (e) => {
    const btn = e.target.closest(".nav-btn");
    if (!btn) return;
    const tab = btn.dataset.tab;
    if (tab === "basic") loadBasicCalc(container);
    else if (tab === "scientific") loadScientificCalc(container);
  });

  // default tab
  loadBasicCalc(container);
});