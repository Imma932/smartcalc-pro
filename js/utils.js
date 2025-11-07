export function loadNavbar() {
  document.getElementById('navbar').innerHTML = `
    <nav>
      <h1>SmartCalc Pro</h1>
      <ul>
        <li><a href="#" id="basic">Basic</a></li>
        <li><a href="#" id="scientific">Scientific</a></li>
        <li><a href="#" id="currency">Currency</a></li>
        <li><a href="#" id="date">Date/Time</a></li>
        <li><a href="#" id="graph">Graph</a></li>
      </ul>
    </nav>
  `;
}

export function loadFooter() {
  document.getElementById('footer').innerHTML = `
    <p>© 2025 SmartCalc Pro | Designed by Immanuel Mbugua</p>
  `;
}