// trig.js — trigonometric & hyperbolic functions

export const trigModule = {
  mode: "DEG",

  _toRad(x) {
    return this.mode === "DEG" ? (x * Math.PI) / 180 : x;
  },
  _toDeg(x) {
    return this.mode === "DEG" ? (x * 180) / Math.PI : x;
  },

  sin(x) { return Math.sin(this._toRad(x)); },
  cos(x) { return Math.cos(this._toRad(x)); },
  tan(x) { return Math.tan(this._toRad(x)); },

  asin(x) { return this._toDeg(Math.asin(x)); },
  acos(x) { return this._toDeg(Math.acos(x)); },
  atan(x) { return this._toDeg(Math.atan(x)); },

  sinh(x) { return Math.sinh(x); },
  cosh(x) { return Math.cosh(x); },
  tanh(x) { return Math.tanh(x); }
};