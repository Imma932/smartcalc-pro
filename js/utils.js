// js/utils.js 
// utils.js (near top of file)
function ensureMaterialIcons() {
  if (document.querySelector('link[href*="fonts.googleapis.com/icon?family=Material+Icons"]')) return;
  const l1 = document.createElement("link");
  l1.rel = "preconnect";
  l1.href = "https://fonts.googleapis.com";
  document.head.appendChild(l1);

  const l2 = document.createElement("link");
  l2.rel = "preconnect";
  l2.href = "https://fonts.gstatic.com";
  l2.crossOrigin = "";
  document.head.appendChild(l2);

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
  document.head.appendChild(link);
}

export function loadHeader() {  
  const header = document.getElementById("navbar");
  ensureMaterialIcons();
  
  header.innerHTML = `  
    <nav class="nav-bar">
      <div class="calculator-header">
         <h1 class="logo">SmartCalc Pro</h1>
          <p class="slogan">Count on us for accuracy</p>
      </div>
      <div class="dropdown">
        <button class="dropdown-btn" id="menuIcon">
          <span class="material-symbols-outlined">
            menu
          </span>
        </button>

        <div class="dropdown-content" id="dropdown-menu">
          <button class="nav-btn"data-tab="basic">${svgBasic()}Basic Calculator</button>
          <button class="nav-btn"data-tab="scientific">${svgScientific()}Scientific Calculator</button>
          <button class="nav-btn" data-tab="date">${svgCalendar()}Date Calculator</button>
          <button class="nav-btn" data-tab="currency">${svgMoney()}Currency Converter</button>
          <button class="nav-btn" data-tab="graph">${svgGraph()}Graphs</button>
        </div>
      </div>
    </nav>  
  `;  
} 
function svgMenu() {
  return `
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18M3 12h18M3 18h18"
       stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;
}

function svgBasic() {
  return `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M5 3h14v18H5z" stroke="currentColor" stroke-width="2"/>
      <path d="M8 8h8M8 12h8M8 16h5"
       stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;
}

function svgScientific() {
  return `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16M4 12h16M4 18h16"
        stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M8 6v12" stroke="currentColor" stroke-width="2"/>
    </svg>
  `;
}

function svgCalendar() {
  return `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="2"
        stroke="currentColor" stroke-width="2"/>
      <path d="M3 10h18M8 2v4M16 2v4"
        stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;
}

function svgGraph() {
  return `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M3 3v18h18" stroke="currentColor" stroke-width="2"/>
      <path d="M7 14l4-4 3 3 5-7"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
}

function svgMoney() {
  return `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 1v22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M17 5a5 5 0 0 0-10 0 5 5 0 0 0 10 0z" 
        stroke="currentColor" stroke-width="2"/>
      <path d="M7 19a5 5 0 0 0 10 0 5 5 0 0 0-10 0z" 
        stroke="currentColor" stroke-width="2"/>
    </svg>
  `;
}

export function setupMenu() {
  const menuIcon = document.getElementById("menuIcon");
  const dropdown = document.getElementById("dropdown-menu");

  menuIcon.addEventListener("click", () => {
    dropdown.classList.toggle("show");
  });

  // Close menu when a tab is clicked
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      dropdown.classList.remove("show");
    });
  });
  //Close the tab when anywhere else is clicked
  document.addEventListener("click", (e) => {
  const dropdown = document.getElementById("dropdown-menu");
  const menuIcon = document.getElementById("menu-icon");

  if (!dropdown.contains(e.target) && !menuIcon.contains(e.target)) {
    dropdown.classList.remove("show");
  }
});
}
export function loadFooter() {  
  const footer = document.getElementById("footer");  
  footer.innerHTML = `  
    <p>© ${new Date().getFullYear()} SmartCalc Pro | Designed by Immanuel Mbugua</p>  
  `;  
}