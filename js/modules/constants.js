// js/modules/constants.js
/**
 * Constants Module
 * Provides quick access to common scientific and mathematical constants.
 */

export const CONSTANTS = {
  PI: Math.PI,         // 3.14159...
  E: Math.E,              // 2.71828...
  PHI: 1.6180339887,      // Golden ratio
  G: 6.67430e-11,         // Gravitational constant (m^3·kg^-1·s^-2)
  C: 299792458,        // Speed of light (m/s)
  PLANCK: 6.62607015e-34,    // Planck’s constant (J·s)
  AVOGADRO: 6.02214076e23, // Avogadro’s number (mol^-1)
  GAS: 8.314462618, // Gas constant (J·mol^-1·K^-1)
  BOLTZMANN: 1.380649e-23, // Boltzmann constant (J/K)
  ELECTRON_MASS: 9.10938356e-31,  // kg
  PROTON_MASS: 1.6726219e-27,   // kg
  NEUTRON_MASS: 1.674927471e-27, // kg
  ELEMENTARY_CHARGE: 1.602176634e-19, // Coulomb
  STANDARD_GRAVITY: 9.80665,   // m/s²
  LIGHT_YEAR: 9.4607e15,                 // m
  ATM: 101325,                           // Pa
  STEFAN_BOLTZMANN: 5.670374419e-8,      // W/m²·K⁴
};

/**
 * Helper function to safely retrieve constants by name.
 * Example: getConstant("PI") → 3.141592653589793
 */
export function getConstant(name) {
  const key = name.toUpperCase();
  return CONSTANTS[key] ?? null;
}