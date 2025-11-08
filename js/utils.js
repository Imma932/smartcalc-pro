// js/utils.js

/** Loads the header (navbar) into the #navbar element */
export function loadHeader() {
  const header = document.getElementById("navbar");
  header.innerHTML = `
    <div class="nav-container">
      <h1 class="logo">🧮 SmartCalc Pro</h1>
      <nav class="nav-links">
        <button class="nav-btn" data-tab="basic">Basic</button>
        <button class="nav-btn" data-tab="scientific">Scientific</button>
      </nav>
    </div>
  `;
}

/** Loads footer into the #footer element */
export function loadFooter() {
  const footer = document.getElementById("footer");
  footer.innerHTML = `
    <p>© ${new Date().getFullYear()} SmartCalc Pro — All rights reserved.</p>
  `;
}

/** Clears all child nodes from a DOM element */
export function clearElement(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}