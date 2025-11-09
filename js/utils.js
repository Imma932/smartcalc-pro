// js/utils.js  
export function loadHeader() {  
  const header = document.getElementById("navbar");  
  if (!header) return;

  header.innerHTML = `  
    <header class="nav-bar">  
      <h1 class="logo">SmartCalc Pro</h1>  
      <div class="nav-buttons">  
        <button class="nav-btn active" data-tab="basic">Basic</button>  
        <button class="nav-btn" data-tab="scientific">Scientific</button>  
        <button class="nav-btn" data-tab="date">Date</button>  
        <button class="nav-btn" data-tab="converter">Unit Conversion</button>  
      </div>  
    </header>  
  `;  
}  
  
export function loadFooter() {  
  const footer = document.getElementById("footer");  
  if (!footer) return;

  footer.innerHTML = `  
    <footer class="app-footer">  
      <p>© ${new Date().getFullYear()} SmartCalc Pro | Designed by Immanuel Mbugua</p>  
    </footer>  
  `;  
}