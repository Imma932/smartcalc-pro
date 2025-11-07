import { loadNavbar, loadFooter } from './utils.js';
import { loadBasicCalculator } from './calculator.js';

document.addEventListener('DOMContentLoaded', () => {
  loadNavbar();
  loadFooter();
  loadBasicCalculator(); // Default view
});