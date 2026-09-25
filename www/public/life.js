// Conway's Game of Life background for the homepage stage, plus the
// control tray wiring (MS speed input, SPAWN GLIDER, CONTROL toggle).
// One ES module — README "Game of Life" / redesign-spec.md
// "public/life.js (rewrite)".

const CELL = 10; // px per cell (grid resolution)
const CELL_GAP = 1; // cells are drawn at CELL - CELL_GAP, leaving a 1px gap
const SEED_DENSITY = 0.13; // 13% random seed
const TICK_MS = 240; // default ms per generation (the tray's MS input changes it)
const MIN_TICK = 10;
const MAX_TICK = 1000;
const MAX_DPR = 2; // devicePixelRatio cap
const GROUND_COLOR = '#2EACFF';
const CELL_COLOR = '#4AB7FF';
// Spawned gliders are drawn in lime (--lime) so a SPAWN GLIDER click is
// visible, and stay lime for good. Colour follows the "Immigration" variant:
// a surviving cell keeps its colour, a newborn takes the majority colour of
// its three parents, so lime travels with the glider without flooding the grid.
const GLIDER_COLOR = '#C8EE3A';
// 5-cell glider, as offsets from the spawn point (README/spec).
const GLIDER = [
  [1, 0],
  [2, 1],
  [0, 2],
  [1, 2],
  [2, 2],
];

const canvas = document.getElementById('life-canvas');

if (canvas) {
  const ctx = canvas.getContext('2d');
  const genEl = document.getElementById('life-gen');
  const tray = document.getElementById('life-tray');
  const toggleBtn = document.getElementById('life-toggle');
  const gliderBtn = document.getElementById('life-glider');
  const speedInput = document.getElementById('life-speed');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let cols = 0;
  let rows = 0;
  let current = null; // Uint8Array, current generation
  let next = null; // Uint8Array, scratch buffer swapped in on each step
  // Per-cell lime flag for spawned gliders (0 = normal colour), double
  // buffered like current/next. tintCount skips the tint pass when unused.
  let tint = null;
  let tintNext = null;
  let tintCount = 0;
  let generation = 0;
  let running = !reduceMotion;
  let timerId = null;
  let tickMs = TICK_MS;
  let cssWidth = 0;
  let cssHeight = 0;
  let dpr = 1;

  const idx = (x, y) => y * cols + x;

  // Random-seeds current/next at the grid's current cols/rows and resets GEN.
  function seed() {
    current = new Uint8Array(cols * rows);
    next = new Uint8Array(cols * rows);
    resetTint();
    for (let i = 0; i < current.length; i++) {
      current[i] = Math.random() < SEED_DENSITY ? 1 : 0;
    }
    generation = 0;
    if (genEl) genEl.textContent = '0';
  }

  function resetTint() {
    tint = new Uint8Array(cols * rows);
    tintNext = new Uint8Array(cols * rows);
    tintCount = 0;
  }

  function render() {
    ctx.fillStyle = GROUND_COLOR;
    ctx.fillRect(0, 0, cssWidth, cssHeight);
    ctx.fillStyle = CELL_COLOR;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = idx(x, y);
        if (current[i] && !(tintCount && tint[i])) {
          ctx.fillRect(x * CELL, y * CELL, CELL - CELL_GAP, CELL - CELL_GAP);
        }
      }
    }
    if (!tintCount) return;
    ctx.fillStyle = GLIDER_COLOR;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = idx(x, y);
        if (current[i] && tint[i]) {
          ctx.fillRect(x * CELL, y * CELL, CELL - CELL_GAP, CELL - CELL_GAP);
        }
      }
    }
  }

  // Sizes the canvas backing store to the element's CSS box, scaled for
  // DPR (capped at 2). Reseeds only when the *width* changed — on mobile
  // the URL bar changes the viewport height on scroll, and reseeding on
  // that would flash the grid (spec "Resize").
  function sizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const rect = canvas.getBoundingClientRect();
    const newCssWidth = Math.round(rect.width);
    const newCssHeight = Math.round(rect.height);

    canvas.width = Math.round(newCssWidth * dpr);
    canvas.height = Math.round(newCssHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const widthChanged = newCssWidth !== cssWidth;
    cssWidth = newCssWidth;
    cssHeight = newCssHeight;

    const newCols = Math.max(1, Math.ceil(cssWidth / CELL));
    const newRows = Math.max(1, Math.ceil(cssHeight / CELL));

    if (widthChanged || !current) {
      cols = newCols;
      rows = newRows;
      seed();
    } else if (newRows !== rows) {
      // Height-only change: resize the buffers in place instead of
      // reseeding, keeping whatever overlaps the new size.
      const oldCols = cols;
      const oldRows = rows;
      const oldCurrent = current;
      rows = newRows;
      current = new Uint8Array(cols * rows);
      next = new Uint8Array(cols * rows);
      resetTint(); // drop any glider tint rather than remap it
      const copyRows = Math.min(oldRows, rows);
      for (let y = 0; y < copyRows; y++) {
        current.set(oldCurrent.subarray(y * oldCols, y * oldCols + oldCols), y * cols);
      }
    }

    render();
  }

  // One generation of B3/S23 with toroidal wrap, using a double buffer
  // (Uint8Array) instead of nested arrays — a full-bleed 100svh stage at
  // 10px cells is ~14k cells per tick.
  function step() {
    for (let y = 0; y < rows; y++) {
      const yUp = (y - 1 + rows) % rows;
      const yDown = (y + 1) % rows;
      for (let x = 0; x < cols; x++) {
        const xLeft = (x - 1 + cols) % cols;
        const xRight = (x + 1) % cols;
        const n =
          current[idx(xLeft, yUp)] +
          current[idx(x, yUp)] +
          current[idx(xRight, yUp)] +
          current[idx(xLeft, y)] +
          current[idx(xRight, y)] +
          current[idx(xLeft, yDown)] +
          current[idx(x, yDown)] +
          current[idx(xRight, yDown)];
        const alive = current[idx(x, y)] === 1;
        const lives = (alive && (n === 2 || n === 3)) || (!alive && n === 3);
        next[idx(x, y)] = lives ? 1 : 0;

        // Immigration colouring: survivors keep their flag; a birth (exactly
        // 3 live parents) is lime when at least 2 of those parents are lime.
        if (tintCount) {
          let t = 0;
          if (lives && alive) {
            t = tint[idx(x, y)];
          } else if (lives) {
            const limeParents =
              (current[idx(xLeft, yUp)] & tint[idx(xLeft, yUp)]) +
              (current[idx(x, yUp)] & tint[idx(x, yUp)]) +
              (current[idx(xRight, yUp)] & tint[idx(xRight, yUp)]) +
              (current[idx(xLeft, y)] & tint[idx(xLeft, y)]) +
              (current[idx(xRight, y)] & tint[idx(xRight, y)]) +
              (current[idx(xLeft, yDown)] & tint[idx(xLeft, yDown)]) +
              (current[idx(x, yDown)] & tint[idx(x, yDown)]) +
              (current[idx(xRight, yDown)] & tint[idx(xRight, yDown)]);
            t = limeParents >= 2 ? 1 : 0;
          }
          tintNext[idx(x, y)] = t;
        }
      }
    }
    [current, next] = [next, current];
    if (tintCount) {
      [tint, tintNext] = [tintNext, tint];
      tintCount = 0;
      for (let i = 0; i < tint.length; i++) if (tint[i]) tintCount++;
    }
    generation++;
    if (genEl) genEl.textContent = String(generation);
    render();
  }

  function startTimer() {
    if (timerId) return;
    timerId = setInterval(step, tickMs);
  }

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function setRunning(shouldRun) {
    running = shouldRun;
    if (running && !document.hidden) {
      startTimer();
    } else {
      stopTimer();
    }
  }

  // Spawns in the top half of the stage (rows 10%–45%), clear of the hero
  // copy anchored at the bottom, so the lime glider is always in view.
  function spawnGlider() {
    const gx = Math.floor(Math.random() * Math.max(1, cols - 3));
    const top = Math.floor(rows * 0.1);
    const span = Math.max(1, Math.floor(rows * 0.35));
    const gy = top + Math.floor(Math.random() * span);
    for (const [dx, dy] of GLIDER) {
      const i = idx((gx + dx) % cols, (gy + dy) % rows);
      current[i] = 1;
      if (!tint[i]) tintCount++;
      tint[i] = 1;
    }
    render();
  }

  function setTrayOpen(open) {
    if (!tray || !toggleBtn) return;
    tray.classList.toggle('is-open', open);
    toggleBtn.setAttribute('aria-expanded', String(open));
    toggleBtn.textContent = open ? 'CLOSE ✕' : 'CONTROL';
  }

  toggleBtn?.addEventListener('click', () => {
    setTrayOpen(!tray.classList.contains('is-open'));
  });

  gliderBtn?.addEventListener('click', spawnGlider);
  // Speed: clamp to 10–1000 ms and restart the interval if it's running.
  // 'input' applies it live (arrows, typing); 'change' also tidies the
  // field on blur/Enter so an out-of-range value snaps to the limit.
  function applySpeed(tidyField) {
    const value = Math.round(Number(speedInput.value));
    if (!Number.isFinite(value) || value <= 0) return;
    tickMs = Math.min(MAX_TICK, Math.max(MIN_TICK, value));
    if (tidyField) speedInput.value = String(tickMs);
    if (timerId) {
      stopTimer();
      startTimer();
    }
  }
  speedInput?.addEventListener('input', () => applySpeed(false));
  speedInput?.addEventListener('change', () => applySpeed(true));

  // Pause the interval while the tab is hidden; resume if it was running.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopTimer();
    } else if (running) {
      startTimer();
    }
  });

  // Debounce resize to one call per frame.
  let resizeScheduled = false;
  window.addEventListener('resize', () => {
    if (resizeScheduled) return;
    resizeScheduled = true;
    requestAnimationFrame(() => {
      resizeScheduled = false;
      sizeCanvas();
    });
  });

  sizeCanvas();

  // Reduced motion: stay on the one seeded frame sizeCanvas() drew. There's
  // no start button any more, so the grid stays still for those visitors.
  if (!reduceMotion) startTimer();
}
