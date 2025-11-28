// js/calculators/graphCalc.js
// Multiple-graph graph plotter (supports up to 3 functions)
// Exports: loadGraphCalculator(container)

export async function loadGraphCalculator(container) {
  container = container || document.getElementById("app") || document.getElementById("app-content");
  if (!container) throw new Error("No container provided for graph calculator.");

  container.innerHTML = `
    <div class="graph-wrapper">
      <h2 class="graph-title">Graph Plotter — Multiple Functions</h2>

      <div class="graph-controls">
        <div class="func-row">
          <label><input type="checkbox" id="f1-enable" checked> y₁ =</label>
          <input id="f1-input" placeholder="sin(x)" class="equation">
          <input type="color" id="f1-color" value="#ff6384">
        </div>

        <div class="func-row">
          <label><input type="checkbox" id="f2-enable" checked> y₂ =</label>
          <input id="f2-input" placeholder="x**2" value="x**2" class="equation">
          <input type="color" id="f2-color" value="#36a2eb">
        </div>

        <div class="func-row">
          <label><input type="checkbox" id="f3-enable"> y₃ =</label>
          <input id="f3-input" placeholder="log(abs(x))" value="" class="equation">
          <input type="color" id="f3-color" value="#ffcd56">
        </div>

        <div class="range-row">
          <label> x-min: <input id="x-min" type="number" value="-10" step="any"></label>
          <label> x-max: <input id="x-max" type="number" value="10" step="any"></label>
          <label> step: <input id="x-step" type="number" value="0.1" step="any" min="0.0001"></label>
        </div>

        <div style="display:flex;gap:8px;margin-top:10px;">
          <button id="plotBtn" class="plot-btn">Plot</button>
          <button id="clearBtn" class="plot-btn secondary">Clear</button>
        </div>

        <div id="graphError" style="color:#ffb6b6;margin-top:8px;"></div>
      </div>

      <div class="graph-canvas-container">
        <canvas id="graphCanvas" height="400"></canvas>
      </div>
    </div>
  `;

  const ctx = container.querySelector("#graphCanvas").getContext("2d");
  const fInputs = [
    { enable: container.querySelector("#f1-enable"), input: container.querySelector("#f1-input"), color: container.querySelector("#f1-color"), label: "y₁" },
    { enable: container.querySelector("#f2-enable"), input: container.querySelector("#f2-input"), color: container.querySelector("#f2-color"), label: "y₂" },
    { enable: container.querySelector("#f3-enable"), input: container.querySelector("#f3-input"), color: container.querySelector("#f3-color"), label: "y₃" },
  ];
  const xMinEl = container.querySelector("#x-min");
  const xMaxEl = container.querySelector("#x-max");
  const xStepEl = container.querySelector("#x-step");
  const plotBtn = container.querySelector("#plotBtn");
  const clearBtn = container.querySelector("#clearBtn");
  const errEl = container.querySelector("#graphError");

  // ensure Chart.js is loaded (returns when ready)
  await ensureChartJs();

  // chart instance
  let chart = null;

  plotBtn.addEventListener("click", () => {
    errEl.textContent = "";
    // parse range
    const xmin = Number(xMinEl.value);
    const xmax = Number(xMaxEl.value);
    const step = Number(xStepEl.value);
    if (!isFinite(xmin) || !isFinite(xmax) || !isFinite(step) || step <= 0 || xmin >= xmax) {
      errEl.textContent = "Invalid range or step. Ensure x-min < x-max and step > 0.";
      return;
    }

    // build x array
    const xs = [];
    // limit points to avoid performance issues
    const maxPoints = 2000;
    let points = Math.floor((xmax - xmin) / step) + 1;
    if (points > maxPoints) {
      errEl.textContent = `Too many points (${points}). Increase step or reduce range (max ${maxPoints}).`;
      return;
    }
    for (let x = xmin; x <= xmax + 1e-12; x = Number((x + step).toPrecision(12))) {
      xs.push(x);
    }

    // prepare datasets
    const datasets = [];
    for (let i = 0; i < fInputs.length; i++) {
      const f = fInputs[i];
      if (!f.enable.checked) continue;
      const exprRaw = f.input.value.trim();
      if (!exprRaw) continue;

      // compile expression to function safely-ish
      let fn;
      try {
        // wrap expression to allow Math.* functions and constants
        // using `with(Math){...}` so users can use sin, cos, log, PI, E, etc.
        // Note: still executes JS code so avoid untrusted input in production.
        fn = new Function("x", `with(Math){ return ${exprRaw}; }`);
        // test with x=0
        const test = fn(0);
        // if test throws or is undefined but expression maybe valid for other x, we proceed
      } catch (compileErr) {
        errEl.textContent = `Error compiling expression for ${f.label}: ${compileErr.message}`;
        return;
      }

      const ys = [];
      for (let xi = 0; xi < xs.length; xi++) {
        const x = xs[xi];
        let y;
        try {
          y = fn(x);
          if (typeof y !== "number" || !isFinite(y)) {
            ys.push(null); // Chart.js will break line on null
          } else {
            ys.push(y);
          }
        } catch {
          ys.push(null);
        }
      }

      datasets.push({
        label: `${f.label} = ${exprRaw}`,
        data: ys,
        borderColor: f.color.value,
        backgroundColor: hexToRgba(f.color.value, 0.15),
        spanGaps: false,
        pointRadius: 0,
        borderWidth: 2,
        fill: false,
        // store xs as meta so we can use labels from xs array
        _xs: xs
      });
    }

    if (!datasets.length) {
      errEl.textContent = "No valid functions to plot. Enable and enter expressions.";
      return;
    }

    // build chart data — use xs as labels
    const labels = xs.map(x => Number(x.toFixed(6))); // numeric labels
    if (chart) chart.destroy();

    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets
      },
      options: {
        animation: { duration: 300 },
        responsive: true,
        maintainAspectRatio: false,
        parsing: false, // we'll provide data arrays directly (Chart 3+)
        normalized: true,
        plugins: {
          legend: { display: true, position: "top" },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              title: (items) => {
                // items[0].label is the x value
                return `x = ${items[0].label}`;
              },
              label: (item) => {
                return `${item.dataset.label}: ${Number(item.parsed.y).toPrecision(6)}`;
              }
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: "x" },
            ticks: { maxRotation: 0, autoSkip: true },
          },
          y: {
            title: { display: true, text: "y" },
            ticks: { autoSkip: true },
          }
        },
        elements: {
          line: { tension: 0.15 }
        }
      }
    });
  });

  clearBtn.addEventListener("click", () => {
    if (chart) { chart.destroy(); chart = null; }
    errEl.textContent = "";
  });

  // small helper: hex to rgba
  function hexToRgba(hex, alpha = 1) {
    const h = hex.replace("#", "");
    const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }
}

// helper to ensure Chart.js is loaded
function ensureChartJs() {
  return new Promise((resolve, reject) => {
    if (window.Chart) return resolve();
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/chart.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed loading Chart.js"));
    document.head.appendChild(script);
  });
}