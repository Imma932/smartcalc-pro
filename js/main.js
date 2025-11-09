// js/main.js
import { loadHeader, loadFooter } from "./utils.js";
import { loadBasicCalc } from "./calculator.js";
import { loadScientificCalc } from "./scientific.js";
import { loadDateCalc } from "./dateCalc.js";
import{ loadConverter} from "./convertor.js";
document.addEventListener("DOMContentLoaded", () => {
  loadHeader();
  loadFooter();

  const container = document.getElementById("basic-calculator");

  // click delegation for nav buttons
  document.getElementById("navbar").addEventListener("click", (e) => {
    const btn = e.target.closest(".nav-btn");
    if (!btn) return;
    const tab = btn.dataset.tab;
    if (tab === "basic") loadBasicCalc(container);
    else if (tab === "scientific") loadScientificCalc(container);
    else if (tab === "date") loadDateCalc(container);
    else if(tab === "converter")
      loadConverter(container);
  });

  // default: basic
  loadBasicCalc(container);
});