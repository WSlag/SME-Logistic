(function () {
  'use strict';

  /** Canvas and sizing **/
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const bestEl = document.getElementById('best');
  const pauseBtn = document.getElementById('pauseBtn');
  const restartBtn = document.getElementById('restartBtn');

  /** Game config **/
  const GRID_COLS = 24;
  const GRID_ROWS = 24;
  const STEP_PER_SECOND_BASE = 7; // baseline speed
  const STEP_ACCELERATION = 0.035; // speed increases slightly per food
  const BACKGROUND_COLOR_A = '#101427';
  const BACKGROUND_COLOR_B = '#0f1326';
  const SNAKE_COLOR = '#2de56b';
  const SNAKE_HEAD_COLOR = '#6be675';
  const FOOD_COLOR = '#ff6b6b';

  /** State **/
  const state = {
    gridCols: GRID_COLS,
    gridRows: GRID_ROWS,
    cellSizePx: 20,
    devicePixelRatio: Math.max(1, Math.floor(window.devicePixelRatio || 1)),
    snake: [], // [{x,y}]
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    food: { x: 0, y: 0 },
    score: 0,
    best: Number(localStorage.getItem('snake_best') || '0') || 0,
    stepPerSecond: STEP_PER_SECOND_BASE,
    lastTs: 0,
    accumulatorMs: 0,
    paused: false,
    gameOver: false,
  };

  bestEl.textContent = String(state.best);

  function setCanvasSizeToCSSPixels() {
    const dpr = state.devicePixelRatio = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    const rect = canvas.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height || rect.width);
    // Ensure square
    const cssPx = size;
    const pixelSize = Math.floor(cssPx * dpr);
    canvas.width = pixelSize;
    canvas.height = pixelSize;

    // Compute cell size in device pixels
    state.cellSizePx = Math.floor(pixelSize / Math.max(state.gridCols, state.gridRows));
  }

  function resetGame() {
    state.snake = [];
    const startX = Math.floor(state.gridCols / 3);
    const startY = Math.floor(state.gridRows / 2);
    state.snake.push({ x: startX + 2, y: startY });
    state.snake.push({ x: startX + 1, y: startY });
    state.snake.push({ x: startX + 0, y: startY });

    state.direction = { x: 1, y: 0 };
    state.nextDirection = { x: 1, y: 0 };
    state.score = 0;
    scoreEl.textContent = '0';
    state.stepPerSecond = STEP_PER_SECOND_BASE;
    state.paused = false;
    state.gameOver = false;

    placeFood();
  }

  function placeFood() {
    const totalCells = state.gridCols * state.gridRows;
    if (state.snake.length >= totalCells) {
      // No space left: you win
      state.gameOver = true;
      return;
    }
    let x, y;
    let attempts = 0;
    while (true) {
      x = Math.floor(Math.random() * state.gridCols);
      y = Math.floor(Math.random() * state.gridRows);
      attempts++;
      if (!state.snake.some(s => s.x === x && s.y === y)) break;
      if (attempts > 10000) break; // fallback
    }
    state.food = { x, y };
  }

  function setDirection(nx, ny) {
    // Prevent reversing directly
    if (nx === -state.direction.x && ny === -state.direction.y) return;
    state.nextDirection = { x: nx, y: ny };
  }

  function update(dtMs) {
    if (state.paused || state.gameOver) return;

    state.accumulatorMs += dtMs;
    const stepMs = 1000 / state.stepPerSecond;

    while (state.accumulatorMs >= stepMs) {
      state.accumulatorMs -= stepMs;
      stepGame();
    }
  }

  function stepGame() {
    // Apply buffered direction once per step
    state.direction = state.nextDirection;

    const head = state.snake[0];
    const next = { x: head.x + state.direction.x, y: head.y + state.direction.y };

    // Wall collisions
    if (next.x < 0 || next.x >= state.gridCols || next.y < 0 || next.y >= state.gridRows) {
      state.gameOver = true;
      return;
    }

    // Self collision (ignore last tail if growing? Not needed here)
    if (state.snake.some((p, i) => i !== 0 && p.x === next.x && p.y === next.y)) {
      state.gameOver = true;
      return;
    }

    // Move: add new head
    state.snake.unshift(next);

    // Food check
    if (next.x === state.food.x && next.y === state.food.y) {
      state.score += 1;
      scoreEl.textContent = String(state.score);
      if (state.score > state.best) {
        state.best = state.score;
        bestEl.textContent = String(state.best);
        localStorage.setItem('snake_best', String(state.best));
      }
      // Slight acceleration
      state.stepPerSecond = STEP_PER_SECOND_BASE + state.score * STEP_ACCELERATION;
      placeFood();
    } else {
      // Remove tail
      state.snake.pop();
    }
  }

  function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawRoundedRect(x, y, w, h, r, color) {
    ctx.fillStyle = color;
    const rr = Math.min(r, Math.min(w, h) / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
    ctx.fill();
  }

  function draw() {
    clear();

    // Draw checker background aligned to grid
    const size = state.cellSizePx;
    for (let y = 0; y < state.gridRows; y++) {
      for (let x = 0; x < state.gridCols; x++) {
        ctx.fillStyle = ((x + y) % 2 === 0) ? BACKGROUND_COLOR_A : BACKGROUND_COLOR_B;
        ctx.fillRect(x * size, y * size, size, size);
      }
    }

    // Draw food
    ctx.fillStyle = FOOD_COLOR;
    const fx = state.food.x * size;
    const fy = state.food.y * size;
    const fr = Math.floor(size * 0.26);
    ctx.beginPath();
    ctx.arc(fx + size / 2, fy + size / 2, fr, 0, Math.PI * 2);
    ctx.fill();

    // Draw snake body
    for (let i = state.snake.length - 1; i >= 0; i--) {
      const seg = state.snake[i];
      const px = seg.x * size;
      const py = seg.y * size;
      const inset = Math.floor(size * 0.08);
      const color = i === 0 ? SNAKE_HEAD_COLOR : SNAKE_COLOR;
      drawRoundedRect(px + inset, py + inset, size - inset * 2, size - inset * 2, Math.floor(size * 0.2), color);
    }

    // Overlays
    if (state.paused || state.gameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const title = state.gameOver ? 'Game Over' : 'Paused';
      const subtitle = state.gameOver ? 'Press Enter or click Restart' : 'Press Space or click Pause';
      drawOverlayText(title, subtitle);
    }
  }

  function drawOverlayText(title, subtitle) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = 'rgba(20,24,44,0.8)';
    const padX = 28;
    const padY = 18;
    ctx.font = `${Math.floor(canvas.width * 0.05)}px Inter, system-ui, sans-serif`;
    const titleMetrics = ctx.measureText(title);
    ctx.font = `${Math.floor(canvas.width * 0.024)}px Inter, system-ui, sans-serif`;
    const subtitleMetrics = ctx.measureText(subtitle);

    const w = Math.max(titleMetrics.width, subtitleMetrics.width) + padX * 2;
    const h = Math.floor(canvas.height * 0.16);

    drawRoundedRect(centerX - w / 2, centerY - h / 2, w, h, 16, 'rgba(20,24,44,0.8)');

    ctx.fillStyle = '#e7eaf6';
    ctx.font = `${Math.floor(canvas.width * 0.05)}px Inter, system-ui, sans-serif`;
    ctx.fillText(title, centerX, centerY - 12);

    ctx.fillStyle = '#a9b1d6';
    ctx.font = `${Math.floor(canvas.width * 0.024)}px Inter, system-ui, sans-serif`;
    ctx.fillText(subtitle, centerX, centerY + 20);
  }

  function rafLoop(ts) {
    if (!state.lastTs) state.lastTs = ts;
    const dt = ts - state.lastTs;
    state.lastTs = ts;

    update(dt);
    draw();

    requestAnimationFrame(rafLoop);
  }

  function onResize() {
    setCanvasSizeToCSSPixels();
    // Redraw immediately after resize
    draw();
  }

  function togglePause(force) {
    if (typeof force === 'boolean') {
      state.paused = force;
    } else {
      state.paused = !state.paused;
    }
    pauseBtn.textContent = state.paused ? 'Resume' : 'Pause';
    pauseBtn.setAttribute('aria-pressed', state.paused ? 'true' : 'false');
  }

  function restart() {
    resetGame();
  }

  /** Input: keyboard **/
  window.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        setDirection(0, -1);
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        setDirection(0, 1);
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        setDirection(-1, 0);
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        setDirection(1, 0);
        break;
      case ' ': // Space: pause/resume
        e.preventDefault();
        if (state.gameOver) return;
        togglePause();
        break;
      case 'Enter':
        restart();
        break;
    }
  }, { passive: false });

  /** Input: buttons **/
  pauseBtn.addEventListener('click', () => {
    if (state.gameOver) return;
    togglePause();
  });

  restartBtn.addEventListener('click', () => {
    restart();
  });

  /** Input: touch (swipe) **/
  let touchStartX = 0;
  let touchStartY = 0;
  let touchMoved = false;

  canvas.addEventListener('touchstart', (e) => {
    const t = e.changedTouches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
    touchMoved = false;
  }, { passive: true });

  canvas.addEventListener('touchmove', () => {
    touchMoved = true;
  }, { passive: true });

  canvas.addEventListener('touchend', (e) => {
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    const minSwipe = 18; // px
    if (!touchMoved || (absX < minSwipe && absY < minSwipe)) {
      // Tap toggles pause when not game over
      if (!state.gameOver) togglePause();
      return;
    }

    if (absX > absY) {
      // Horizontal
      setDirection(dx > 0 ? 1 : -1, 0);
    } else {
      // Vertical
      setDirection(0, dy > 0 ? 1 : -1);
    }
  }, { passive: true });

  /** Init **/
  setCanvasSizeToCSSPixels();
  resetGame();
  window.addEventListener('resize', onResize);
  requestAnimationFrame(rafLoop);
})();