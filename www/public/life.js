// Conway's Game of Life background for the homepage stage, plus the
// control tray wiring (PAUSE/START, SPAWN GLIDER, RESTART, CONTROL toggle).
// One ES module — README "Game of Life" / redesign-spec.md
// "public/life.js (rewrite)".

const CELL = 10; // px per cell (grid resolution)
const CELL_GAP = 1; // cells are drawn at CELL - CELL_GAP, leaving a 1px gap
const SEED_DENSITY = 0.13; // 13% random seed
const TICK_MS = 240; // ms per generation
const MAX_DPR = 2; // devicePixelRatio cap
const GROUND_COLOR = '#2EACFF';
const CELL_COLOR = '#4AB7FF';
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
  const pauseBtn = document.getElementById('life-pause');
  const gliderBtn = document.getElementById('life-glider');
  const restartBtn = document.getElementById('life-restart');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let cols = 0;
  let rows = 0;
  let current = null; // Uint8Array, current generation
  let next = null; // Uint8Array, scratch buffer swapped in on each step
  let generation = 0;
  let running = !reduceMotion;
  let timerId = null;
  let cssWidth = 0;
  let cssHeight = 0;
  let dpr = 1;

  const idx = (x, y) => y * cols + x;

  // Random-seeds current/next at the grid's current cols/rows and resets GEN.
  function seed() {
    current = new Uint8Array(cols * rows);
    next = new Uint8Array(cols * rows);
    for (let i = 0; i < current.length; i++) {
      current[i] = Math.random() < SEED_DENSITY ? 1 : 0;
    }
    generation = 0;
    if (genEl) genEl.textContent = '0';
  }

  function render() {
    ctx.fillStyle = GROUND_COLOR;
    ctx.fillRect(0, 0, cssWidth, cssHeight);
    ctx.fillStyle = CELL_COLOR;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (current[idx(x, y)]) {
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
        next[idx(x, y)] = (alive && (n === 2 || n === 3)) || (!alive && n === 3) ? 1 : 0;
      }
    }
    [current, next] = [next, current];
    generation++;
    if (genEl) genEl.textContent = String(generation);
    render();
  }

  function startTimer() {
    if (timerId) return;
    timerId = setInterval(step, TICK_MS);
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
    if (pauseBtn) pauseBtn.textContent = running ? 'PAUSE' : 'START';
  }

  function spawnGlider() {
    const gx = Math.floor(Math.random() * cols);
    const gy = Math.floor(Math.random() * rows);
    for (const [dx, dy] of GLIDER) {
      const x = (gx + dx) % cols;
      const y = (gy + dy) % rows;
      current[idx(x, y)] = 1;
    }
    render();
  }

  function restart() {
    seed();
    render();
  }

  function setTrayOpen(open) {
    if (!tray || !toggleBtn) return;
    tray.classList.toggle('is-open', open);
    toggleBtn.setAttribute('aria-expanded', String(open));
    toggleBtn.textContent = open ? 'CLOSE ✕' : 'CONTROL +';
  }

  toggleBtn?.addEventListener('click', () => {
    setTrayOpen(!tray.classList.contains('is-open'));
  });

  pauseBtn?.addEventListener('click', () => setRunning(!running));
  gliderBtn?.addEventListener('click', spawnGlider);
  restartBtn?.addEventListener('click', restart);

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

  if (reduceMotion) {
    // Reduced motion: start paused on the one seeded frame already drawn
    // by sizeCanvas() above, and show the paused label.
    if (pauseBtn) pauseBtn.textContent = 'START';
  } else {
    startTimer();
  }
}
