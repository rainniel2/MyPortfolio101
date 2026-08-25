(function () {
  "use strict";

  const toggle = document.getElementById("breakToggle");
  const bottomPanel = document.getElementById("bottomPanel");

  if (!toggle || !bottomPanel) return;

  const LEADERBOARD_STORAGE_KEY = "rynlBreakLeaderboardV1";
  const MAX_LEADERBOARD_ENTRIES = 5;
  const DEFAULT_PLAYER_NAME = "PLAYER";

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const state = {
    armed: false,
    hintOpen: false,
    discovered: false,
    playing: false,
    won: false,
    launched: false,
    paused: false,
    score: 0,
    width: window.innerWidth,
    height: window.innerHeight,
    dpr: 1,
    rafId: 0,
    lastFrameTime: 0,
    observer: null,
    fallbackScrollHandler: null,
    gameEvents: null,
    canvas: null,
    context: null,
    stage: null,
    scoreText: null,
    timerText: null,
    bestTimeText: null,
    soundButton: null,
    launchHint: null,
    winPanel: null,
    finalTimeText: null,
    playerNameInput: null,
    saveTimeButton: null,
    leaderboardList: null,
    bricks: [],
    ball: {
      x: 0,
      y: 0,
      radius: 6.5,
      velocityX: 0,
      velocityY: 0,
    },
    keys: {
      left: false,
      right: false,
    },
    pointer: {
      active: false,
      id: null,
      startX: 0,
      startY: 0,
      moved: false,
    },
    panelX: 0,
    panelBottomGap: 0,
    panelOriginalWidth: 0,
    scrollX: 0,
    scrollY: 0,
    savedBodyStyle: null,
    savedPanelStyle: null,
    savedPanelInert: false,
    savedPanelAriaDisabled: null,
    savedPanelItems: [],
    savedContentStates: [],
    colors: null,
    timerStarted: false,
    timerRunning: false,
    timerStartedAt: 0,
    timerElapsedMs: 0,
    finalTimeMs: 0,
    scoreSaved: false,
    leaderboard: loadLeaderboard(),
    soundEnabled: true,
    audioContext: null,
    audioMasterGain: null,
    lastPaddleSoundAt: 0,
  };

  const hint = document.createElement("aside");
  hint.id = "rynlBreakHint";
  hint.className = "rynl-break-hint";
  hint.setAttribute("role", "status");
  hint.setAttribute("aria-live", "polite");
  hint.setAttribute("aria-hidden", "true");
  hint.innerHTML = `
    <strong>NEED A BREAK?</strong>
    <p>There’s something waiting below.↓</p>
  `;

  const discovery = document.createElement("div");
  discovery.className = "rynl-break-discovery";
  discovery.setAttribute("aria-hidden", "true");
  discovery.innerHTML = `
    <button type="button" aria-label="Start RYNL BREAK"></button>
    <span>YOU FOUND IT</span>
  `;

  const sentinel = document.createElement("span");
  sentinel.className = "rynl-break-bottom-sentinel";
  sentinel.setAttribute("aria-hidden", "true");

  document.body.append(hint, discovery, sentinel);

  const discoveryButton = discovery.querySelector("button");

  toggle.addEventListener("click", function () {
    if (state.playing) {
      closeGame();
      return;
    }

    // The FIRST click means the user has read the sign.
    // Keep the Easter egg armed even when the message is closed.
    if (!state.armed) {
      armEasterEgg();
      return;
    }

    // After the sign has been read, the X only opens/closes the message.
    // It must NOT cancel the Easter egg anymore.
    if (state.hintOpen) {
      hideHint();
    } else {
      showHint();
    }
  });

  discoveryButton.addEventListener("click", startGame);

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape" || (!state.armed && !state.playing)) return;

    event.preventDefault();
    if (state.playing) {
      closeGame();
    } else if (state.hintOpen) {
      hideHint();
    }
  });

  window.addEventListener("resize", function () {
    if (state.armed && !state.playing) {
      if (state.hintOpen) positionHint();
      positionDiscovery();
    }
  });

  // Once the user starts scrolling away from the top, the sign message
  // disappears automatically. The READ state stays armed, so the user
  // does not have to click X again before reaching the bottom.
  window.addEventListener("scroll", function () {
    if (!state.armed || state.playing || !state.hintOpen) return;

    if (window.scrollY > 12) {
      hideHint();
    }
  }, { passive: true });

  function armEasterEgg() {
    state.armed = true;
    state.hintOpen = true;
    state.discovered = false;
    toggle.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close RYNL BREAK message");
    showHint();
    positionDiscovery();
    observePageBottom();
  }

  function showHint() {
    if (!state.armed) return;

    state.hintOpen = true;
    hint.classList.add("is-visible");
    hint.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close RYNL BREAK message");
    positionHint();
  }

  function hideHint() {
    state.hintOpen = false;
    hint.classList.remove("is-visible");
    hint.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open RYNL BREAK message");
  }

  function cancelEasterEgg() {
    stopBottomObservation();
    hideDiscovery();
    hideHint();
    state.armed = false;
    state.hintOpen = false;
    state.discovered = false;
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open RYNL BREAK Easter egg");
  }

  function observePageBottom() {
    stopBottomObservation();

    if ("IntersectionObserver" in window) {
      state.observer = new IntersectionObserver(
        function (entries) {
          if (!state.armed || state.playing) return;

          if (entries[0]?.isIntersecting) {
            revealDiscovery();
          } else {
            concealDiscovery();
          }
        },
        { threshold: 1 },
      );
      state.observer.observe(sentinel);
      return;
    }

    state.fallbackScrollHandler = function () {
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2;

      if (!state.armed || state.playing) return;

      if (atBottom) {
        revealDiscovery();
      } else {
        concealDiscovery();
      }
    };
    window.addEventListener("scroll", state.fallbackScrollHandler, {
      passive: true,
    });
    state.fallbackScrollHandler();
  }

  function stopBottomObservation() {
    state.observer?.disconnect();
    state.observer = null;

    if (state.fallbackScrollHandler) {
      window.removeEventListener("scroll", state.fallbackScrollHandler);
      state.fallbackScrollHandler = null;
    }
  }

  function revealDiscovery() {
    if (state.discovered || !state.armed || state.playing) return;

    state.discovered = true;
    positionDiscovery();
    discovery.classList.add("is-visible");
    discovery.setAttribute("aria-hidden", "false");

    if (!reducedMotion) {
      discovery.classList.add("is-bouncing");
      window.setTimeout(function () {
        discovery.classList.remove("is-bouncing");
      }, 390);
    }
  }

  function concealDiscovery() {
    if (!state.discovered) return;

    state.discovered = false;
    hideDiscovery();
  }

  function hideDiscovery() {
    discovery.classList.remove("is-visible", "is-bouncing");
    discovery.setAttribute("aria-hidden", "true");
  }

  function positionHint() {
    const toggleRect = toggle.getBoundingClientRect();
    const edge = Math.max(14, window.innerWidth - toggleRect.right);
    hint.style.top = `${Math.round(toggleRect.bottom + 9)}px`;
    hint.style.right = `${Math.round(edge)}px`;
  }

  function positionDiscovery() {
    const panelRect = bottomPanel.getBoundingClientRect();
    discovery.style.left = `${Math.round(panelRect.left + panelRect.width / 2)}px`;
    discovery.style.top = `${Math.max(58, Math.round(panelRect.top - 55))}px`;
  }

  function startGame() {
    if (!state.armed || !state.discovered || state.playing) return;

    state.playing = true;
    state.paused = document.hidden;
    state.won = false;
    state.launched = false;
    state.score = 0;
    resetRunTimer();
    stopBottomObservation();
    hideDiscovery();
    hint.classList.remove("is-visible");
    hint.setAttribute("aria-hidden", "true");
    saveAndLockPage();
    createGameStage();
    preparePanelPaddle();
    bindGameEvents();
    resizeGame({ preserveScore: false });
    resetBall();
    drawFrame(performance.now());

    requestAnimationFrame(function () {
      state.stage?.classList.add("is-visible");
      state.canvas?.focus({ preventScroll: true });
    });

    if (!state.paused) startAnimationLoop();
  }

  function saveAndLockPage() {
    state.scrollX = window.scrollX;
    state.scrollY = window.scrollY;
    state.savedBodyStyle = document.body.getAttribute("style");
    document.body.classList.add("rynl-break-active");

    const contentElements = [
      document.querySelector("main"),
      document.getElementById("quoteBox"),
    ].filter(Boolean);

    state.savedContentStates = contentElements.map(function (element) {
      const saved = {
        element,
        inert: element.inert,
        ariaHidden: element.getAttribute("aria-hidden"),
      };
      element.inert = true;
      element.setAttribute("aria-hidden", "true");
      return saved;
    });
  }

  function createGameStage() {
    const stage = document.createElement("section");
    stage.className = "rynl-break-stage";
    stage.setAttribute("role", "region");
    stage.setAttribute("aria-label", "RYNL BREAK brick breaker game");
    stage.innerHTML = `
      <canvas
        tabindex="0"
        aria-label="Brick breaker. Move the portfolio dock with the mouse, touch, or arrow keys. Click, tap, or press Space to launch the ball."
      ></canvas>
      <button
        class="rynl-break-exit"
        type="button"
        aria-label="Exit RYNL BREAK"
      >×</button>
      <div class="rynl-break-hud">
        <strong>BREAK GAME</strong>
        <div class="rynl-break-hud-meta">
          <span class="rynl-break-best" aria-label="Local best time">BEST --:--.-</span>
          <span class="rynl-break-timer" aria-label="Elapsed time">00:00.0</span>
          <span class="rynl-break-score" aria-label="Score">000</span>
          <button
            class="rynl-break-sound"
            type="button"
            aria-label="Turn game sound off"
            aria-pressed="true"
          >SOUND ON</button>
        </div>
      </div>
      <p class="rynl-break-launch-hint is-visible">CLICK · TAP · SPACE TO LAUNCH</p>
      <div
        class="rynl-break-win"
        role="dialog"
        aria-modal="false"
        aria-label="RYNL BREAK completed"
      >
        <p class="rynl-break-win-title">ALL CLEAR.</p>
        <p class="rynl-break-final-time">YOUR TIME <strong>00:00.0</strong></p>
        <form class="rynl-break-score-form">
          <label>
            <span>NAME</span>
            <input
              type="text"
              maxlength="12"
              autocomplete="nickname"
              spellcheck="false"
              placeholder="PLAYER"
              aria-label="Leaderboard name"
            />
          </label>
          <button type="submit">SAVE TIME</button>
        </form>
        <section class="rynl-break-leaderboard" aria-label="Local best times">
          <h3>LOCAL BEST TIMES</h3>
          <ol></ol>
          <small>THIS BROWSER ONLY</small>
        </section>
        <div class="rynl-break-win-actions">
          <button class="rynl-break-replay" type="button">PLAY AGAIN</button>
          <button class="rynl-break-close" type="button">CLOSE</button>
        </div>
      </div>
    `;

    document.body.appendChild(stage);
    state.stage = stage;
    state.canvas = stage.querySelector("canvas");
    state.context = state.canvas.getContext("2d", { alpha: true });
    state.scoreText = stage.querySelector(".rynl-break-score");
    state.timerText = stage.querySelector(".rynl-break-timer");
    state.bestTimeText = stage.querySelector(".rynl-break-best");
    state.soundButton = stage.querySelector(".rynl-break-sound");
    state.launchHint = stage.querySelector(".rynl-break-launch-hint");
    state.winPanel = stage.querySelector(".rynl-break-win");
    state.finalTimeText = stage.querySelector(".rynl-break-final-time strong");
    state.playerNameInput = stage.querySelector(".rynl-break-score-form input");
    state.saveTimeButton = stage.querySelector(".rynl-break-score-form button");
    state.leaderboardList = stage.querySelector(".rynl-break-leaderboard ol");

    stage
      .querySelector(".rynl-break-replay")
      .addEventListener("click", playAgain);
    stage
      .querySelector(".rynl-break-close")
      .addEventListener("click", closeGame);
    stage
      .querySelector(".rynl-break-exit")
      .addEventListener("click", closeGame);
    state.soundButton.addEventListener("click", toggleSound);
    stage
      .querySelector(".rynl-break-score-form")
      .addEventListener("submit", saveCompletedTime);
    stage.querySelectorAll("button, input").forEach(function (control) {
      control.addEventListener("pointerdown", function (event) {
        event.stopPropagation();
      });
    });
    updateSoundButton();
    renderLeaderboard();
  }

  function preparePanelPaddle() {
    const panelRect = bottomPanel.getBoundingClientRect();
    state.savedPanelStyle = bottomPanel.getAttribute("style");
    state.savedPanelInert = bottomPanel.inert;
    state.savedPanelAriaDisabled = bottomPanel.getAttribute("aria-disabled");
    state.panelOriginalWidth = panelRect.width;
    state.panelBottomGap = Math.max(8, window.innerHeight - panelRect.bottom);
    state.panelX = panelRect.left;
    state.savedPanelItems = Array.from(
      bottomPanel.querySelectorAll("a, button"),
    ).map(function (item) {
      const saved = {
        item,
        tabIndex: item.getAttribute("tabindex"),
        ariaDisabled: item.getAttribute("aria-disabled"),
      };
      item.setAttribute("tabindex", "-1");
      item.setAttribute("aria-disabled", "true");
      return saved;
    });

    bottomPanel.inert = true;
    bottomPanel.setAttribute("aria-disabled", "true");
    bottomPanel.classList.add("rynl-break-paddle");
    applyPanelGeometry();
  }

  function bindGameEvents() {
    state.gameEvents = new AbortController();
    const signal = state.gameEvents.signal;

    state.stage.addEventListener("pointerdown", onPointerDown, { signal });
    state.stage.addEventListener("pointermove", onPointerMove, { signal });
    state.stage.addEventListener("pointerup", onPointerUp, { signal });
    state.stage.addEventListener("pointercancel", onPointerCancel, { signal });
    window.addEventListener("keydown", onGameKeyDown, { signal });
    window.addEventListener("keyup", onGameKeyUp, { signal });
    window.addEventListener("resize", onGameResize, { signal });
    window.addEventListener("blur", clearMovementKeys, { signal });
    document.addEventListener("visibilitychange", onVisibilityChange, {
      signal,
    });
    bottomPanel.addEventListener("click", blockPanelInteraction, {
      capture: true,
      signal,
    });
  }

  function blockPanelInteraction(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  function onPointerDown(event) {
    if (!state.playing || state.won) return;

    state.pointer.active = true;
    state.pointer.id = event.pointerId;
    state.pointer.startX = event.clientX;
    state.pointer.startY = event.clientY;
    state.pointer.moved = false;
    state.stage.setPointerCapture?.(event.pointerId);
    movePanelToCenter(event.clientX);
  }

  function onPointerMove(event) {
    if (!state.playing || state.won) return;

    const isMouse = event.pointerType === "mouse";
    const isActivePointer =
      state.pointer.active && event.pointerId === state.pointer.id;
    if (!isMouse && !isActivePointer) return;

    if (isActivePointer) {
      const distance = Math.hypot(
        event.clientX - state.pointer.startX,
        event.clientY - state.pointer.startY,
      );
      if (distance > 7) state.pointer.moved = true;
    }

    movePanelToCenter(event.clientX);
  }

  function onPointerUp(event) {
    if (!state.playing || event.pointerId !== state.pointer.id) return;

    const shouldLaunch = !state.pointer.moved && !state.won;
    state.pointer.active = false;
    state.pointer.id = null;
    state.stage.releasePointerCapture?.(event.pointerId);
    if (shouldLaunch) launchBall();
  }

  function onPointerCancel(event) {
    if (event.pointerId !== state.pointer.id) return;
    state.pointer.active = false;
    state.pointer.id = null;
  }

  function onGameKeyDown(event) {
    if (!state.playing) return;
    if (event.target?.closest?.("button, input, form")) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      state.keys.left = true;
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      state.keys.right = true;
    } else if (event.code === "Space") {
      event.preventDefault();
      launchBall();
    }
  }

  function onGameKeyUp(event) {
    if (event.key === "ArrowLeft") state.keys.left = false;
    if (event.key === "ArrowRight") state.keys.right = false;
  }

  function clearMovementKeys() {
    state.keys.left = false;
    state.keys.right = false;
  }

  function onGameResize() {
    resizeGame({ preserveScore: true });
    if (!state.launched) dockBallToPanel();
    drawFrame(performance.now());
  }

  function onVisibilityChange() {
    if (!state.playing) return;

    if (document.hidden) {
      state.paused = true;
      pauseRunTimer(performance.now());
      stopAnimationLoop();
      clearMovementKeys();
    } else {
      state.paused = false;
      state.lastFrameTime = performance.now();
      resumeRunTimer(state.lastFrameTime);
      startAnimationLoop();
    }
  }

  function resizeGame({ preserveScore }) {
    if (!state.canvas || !state.context) return;

    state.width = window.innerWidth;
    state.height = window.innerHeight;
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);
    state.canvas.width = Math.round(state.width * state.dpr);
    state.canvas.height = Math.round(state.height * state.dpr);
    state.canvas.style.width = `${state.width}px`;
    state.canvas.style.height = `${state.height}px`;
    state.context.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    updateGameColors();
    applyPanelGeometry();
    layoutBricks(preserveScore ? state.score : 0);
    state.ball.x = clamp(
      state.ball.x || state.width / 2,
      state.ball.radius,
      state.width - state.ball.radius,
    );
    state.ball.y = clamp(
      state.ball.y || state.height / 2,
      state.ball.radius,
      state.height - state.ball.radius,
    );
  }

  function updateGameColors() {
    const styles = getComputedStyle(document.documentElement);
    state.colors = {
      blue: styles.getPropertyValue("--break-blue").trim() || "#087cff",
      block: styles.getPropertyValue("--break-surface").trim() || "#fffefa",
      border: styles.getPropertyValue("--break-border").trim() || "#c9c7c1",
    };
  }

  function applyPanelGeometry() {
    if (!state.playing) return;

    const availableWidth = Math.max(1, window.innerWidth - 16);
    const width = Math.min(state.panelOriginalWidth || 288, availableWidth);
    state.panelX = clamp(state.panelX, 8, window.innerWidth - width - 8);
    bottomPanel.style.setProperty("width", `${width}px`, "important");
    bottomPanel.style.setProperty("left", `${state.panelX}px`, "important");
    bottomPanel.style.setProperty("right", "auto", "important");
    bottomPanel.style.setProperty("bottom", "auto", "important");
    bottomPanel.style.setProperty("transform", "none", "important");

    const panelHeight = bottomPanel.getBoundingClientRect().height;
    const top = Math.max(
      8,
      window.innerHeight - state.panelBottomGap - panelHeight,
    );
    bottomPanel.style.setProperty("top", `${top}px`, "important");
  }

  function movePanelToCenter(centerX) {
    if (!state.playing) return;

    const panelRect = bottomPanel.getBoundingClientRect();
    state.panelX = clamp(
      centerX - panelRect.width / 2,
      8,
      state.width - panelRect.width - 8,
    );
    bottomPanel.style.setProperty("left", `${state.panelX}px`, "important");
    if (!state.launched) dockBallToPanel();
  }

  function layoutBricks(clearedCount) {
    const rows = state.width < 500 ? 3 : 4;
    const gap = state.width < 500 ? 6 : 8;
    const availableWidth = Math.min(state.width - 32, 720);
    const preferredWidth = state.width < 500 ? 57 : 68;
    const columns = clamp(
      Math.floor((availableWidth + gap) / (preferredWidth + gap)),
      4,
      10,
    );
    const brickWidth =
      (availableWidth - gap * (columns - 1)) / columns;
    const brickHeight = state.width < 500 ? 18 : 21;
    const gridWidth = brickWidth * columns + gap * (columns - 1);
    const startX = (state.width - gridWidth) / 2;
    const startY = clamp(state.height * 0.15, 102, 138);
    const total = rows * columns;
    const alreadyCleared = Math.min(clearedCount, total);

    state.score = alreadyCleared;
    updateScore();
    state.bricks = [];

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const index = row * columns + column;
        state.bricks.push({
          x: startX + column * (brickWidth + gap),
          y: startY + row * (brickHeight + gap),
          width: brickWidth,
          height: brickHeight,
          radius: 3,
          collidable: index >= alreadyCleared,
          visible: index >= alreadyCleared,
          hitTime: null,
          opacity: index >= alreadyCleared ? 1 : 0,
        });
      }
    }
  }

  function playAgain() {
    if (!state.playing) return;

    state.won = false;
    state.score = 0;
    state.scoreSaved = false;
    state.winPanel.classList.remove("is-visible");
    state.playerNameInput.disabled = false;
    state.saveTimeButton.disabled = false;
    state.saveTimeButton.textContent = "SAVE TIME";
    resetRunTimer();
    layoutBricks(0);
    resetBall();
    drawFrame(performance.now());
    if (!state.paused) startAnimationLoop();
    state.canvas.focus({ preventScroll: true });
  }

  function resetBall() {
    state.launched = false;
    state.ball.velocityX = 0;
    state.ball.velocityY = 0;
    state.launchHint?.classList.add("is-visible");
    dockBallToPanel();
  }

  function dockBallToPanel() {
    const panelRect = bottomPanel.getBoundingClientRect();
    state.ball.x = panelRect.left + panelRect.width / 2;
    state.ball.y = panelRect.top - state.ball.radius - 6;
  }

  function launchBall() {
    if (!state.playing || state.won || state.launched || state.paused) return;

    const speed = reducedMotion ? 270 : 330;
    const direction = Math.random() < 0.5 ? -1 : 1;
    startRunTimer(performance.now());
    playSound("launch");
    state.launched = true;
    state.ball.velocityX = direction * speed * 0.52;
    state.ball.velocityY = -speed * 0.85;
    state.launchHint?.classList.remove("is-visible");
    startAnimationLoop();
  }

  function startAnimationLoop() {
    if (!state.playing || state.paused || state.rafId || state.won) return;

    state.lastFrameTime = performance.now();
    state.rafId = requestAnimationFrame(gameLoop);
  }

  function stopAnimationLoop() {
    if (state.rafId) cancelAnimationFrame(state.rafId);
    state.rafId = 0;
  }

  function gameLoop(time) {
    state.rafId = 0;
    if (!state.playing || state.paused) return;

    const deltaSeconds = Math.min(
      0.024,
      Math.max(0, (time - state.lastFrameTime) / 1000),
    );
    state.lastFrameTime = time;
    updatePanelFromKeyboard(deltaSeconds);

    if (state.launched && !state.won) {
      updateBall(deltaSeconds, time);
    } else if (!state.won) {
      dockBallToPanel();
    }

    updateBrickFades(time);
    updateTimerDisplay(time);
    drawFrame(time);

    if (!state.won) {
      state.rafId = requestAnimationFrame(gameLoop);
    }
  }

  function updatePanelFromKeyboard(deltaSeconds) {
    const direction = Number(state.keys.right) - Number(state.keys.left);
    if (!direction) return;

    const panelRect = bottomPanel.getBoundingClientRect();
    const movement = direction * 430 * deltaSeconds;
    state.panelX = clamp(
      state.panelX + movement,
      8,
      state.width - panelRect.width - 8,
    );
    bottomPanel.style.setProperty("left", `${state.panelX}px`, "important");
    if (!state.launched) dockBallToPanel();
  }

  function updateBall(deltaSeconds, time) {
    const ball = state.ball;
    ball.x += ball.velocityX * deltaSeconds;
    ball.y += ball.velocityY * deltaSeconds;

    if (ball.x - ball.radius <= 0) {
      ball.x = ball.radius;
      ball.velocityX = Math.abs(ball.velocityX);
    } else if (ball.x + ball.radius >= state.width) {
      ball.x = state.width - ball.radius;
      ball.velocityX = -Math.abs(ball.velocityX);
    }

    if (ball.y - ball.radius <= 0) {
      ball.y = ball.radius;
      ball.velocityY = Math.abs(ball.velocityY);
    }

    collideWithPaddle();
    collideWithBricks(time);

    const panelRect = bottomPanel.getBoundingClientRect();
    if (ball.y - ball.radius > panelRect.bottom + 14) {
      playSound("miss");
      resetBall();
    }
  }

  function collideWithPaddle() {
    const ball = state.ball;
    if (ball.velocityY <= 0) return;

    const panelRect = bottomPanel.getBoundingClientRect();
    const collision = circleRectangleCollision(ball, panelRect);
    if (!collision) return;

    resolveCollision(ball, collision);
    const impact = clamp(
      (ball.x - (panelRect.left + panelRect.width / 2)) /
        (panelRect.width / 2),
      -1,
      1,
    );
    const speed = Math.max(
      reducedMotion ? 250 : 300,
      Math.hypot(ball.velocityX, ball.velocityY),
    );
    ball.velocityX = impact * speed * 0.72;
    ball.velocityY = -Math.sqrt(
      Math.max(speed * speed - ball.velocityX * ball.velocityX, speed * speed * 0.35),
    );
    ball.y = panelRect.top - ball.radius - 0.2;
    const now = performance.now();
    if (now - state.lastPaddleSoundAt > 70) {
      state.lastPaddleSoundAt = now;
      playSound("paddle");
    }
  }

  function collideWithBricks(time) {
    const ball = state.ball;

    for (const brick of state.bricks) {
      if (!brick.collidable) continue;

      const collision = circleRectangleCollision(ball, brick);
      if (!collision) continue;

      resolveCollision(ball, collision);
      brick.collidable = false;
      brick.hitTime = time;
      state.score += 1;
      updateScore();
      playSound("brick");
      break;
    }
  }

  function circleRectangleCollision(circle, rectangle) {
    const left = rectangle.left ?? rectangle.x;
    const top = rectangle.top ?? rectangle.y;
    const width = rectangle.width;
    const height = rectangle.height;
    const right = rectangle.right ?? left + width;
    const bottom = rectangle.bottom ?? top + height;
    const closestX = clamp(circle.x, left, right);
    const closestY = clamp(circle.y, top, bottom);
    let differenceX = circle.x - closestX;
    let differenceY = circle.y - closestY;
    const distanceSquared =
      differenceX * differenceX + differenceY * differenceY;

    if (distanceSquared > circle.radius * circle.radius) return null;

    if (distanceSquared > 0.000001) {
      const distance = Math.sqrt(distanceSquared);
      return {
        normalX: differenceX / distance,
        normalY: differenceY / distance,
        penetration: circle.radius - distance,
      };
    }

    const distances = [
      { value: Math.abs(circle.x - left), normalX: -1, normalY: 0 },
      { value: Math.abs(right - circle.x), normalX: 1, normalY: 0 },
      { value: Math.abs(circle.y - top), normalX: 0, normalY: -1 },
      { value: Math.abs(bottom - circle.y), normalX: 0, normalY: 1 },
    ].sort(function (first, second) {
      return first.value - second.value;
    });

    return {
      normalX: distances[0].normalX,
      normalY: distances[0].normalY,
      penetration: circle.radius + distances[0].value,
    };
  }

  function resolveCollision(ball, collision) {
    ball.x += collision.normalX * (collision.penetration + 0.15);
    ball.y += collision.normalY * (collision.penetration + 0.15);
    const velocityAlongNormal =
      ball.velocityX * collision.normalX +
      ball.velocityY * collision.normalY;

    if (velocityAlongNormal < 0) {
      ball.velocityX -= 2 * velocityAlongNormal * collision.normalX;
      ball.velocityY -= 2 * velocityAlongNormal * collision.normalY;
    }
  }

  function updateBrickFades(time) {
    const outlineDuration = reducedMotion ? 20 : 75;
    const fadeDuration = reducedMotion ? 35 : 145;

    state.bricks.forEach(function (brick) {
      if (brick.hitTime === null || !brick.visible) return;

      const elapsed = time - brick.hitTime;
      if (elapsed <= outlineDuration) {
        brick.opacity = 1;
      } else {
        brick.opacity = clamp(
          1 - (elapsed - outlineDuration) / fadeDuration,
          0,
          1,
        );
      }

      if (brick.opacity <= 0) brick.visible = false;
    });

    if (
      !state.won &&
      state.bricks.length > 0 &&
      state.bricks.every(function (brick) {
        return !brick.visible;
      })
    ) {
      showWin();
    }
  }

  function drawFrame(time) {
    if (!state.context) return;

    const context = state.context;
    context.clearRect(0, 0, state.width, state.height);
    drawBricks(context, time);
    drawBall(context);
  }

  function drawBricks(context, time) {
    const outlineDuration = reducedMotion ? 20 : 75;

    state.bricks.forEach(function (brick) {
      if (!brick.visible) return;

      const wasJustHit =
        brick.hitTime !== null && time - brick.hitTime <= outlineDuration;
      context.save();
      context.globalAlpha = brick.opacity;
      roundedRectanglePath(
        context,
        brick.x,
        brick.y,
        brick.width,
        brick.height,
        brick.radius,
      );
      context.fillStyle = state.colors.block;
      context.globalAlpha = brick.opacity * 0.62;
      context.fill();
      context.globalAlpha = brick.opacity;
      context.lineWidth = 1;
      context.strokeStyle = wasJustHit
        ? state.colors.blue
        : state.colors.border;
      context.stroke();
      context.restore();
    });
  }

  function drawBall(context) {
    context.save();
    context.beginPath();
    context.arc(
      state.ball.x,
      state.ball.y,
      state.ball.radius,
      0,
      Math.PI * 2,
    );
    context.fillStyle = state.colors.blue;
    context.fill();
    context.restore();
  }

  function roundedRectanglePath(context, x, y, width, height, radius) {
    const safeRadius = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.moveTo(x + safeRadius, y);
    context.lineTo(x + width - safeRadius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
    context.lineTo(x + width, y + height - safeRadius);
    context.quadraticCurveTo(
      x + width,
      y + height,
      x + width - safeRadius,
      y + height,
    );
    context.lineTo(x + safeRadius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
    context.lineTo(x, y + safeRadius);
    context.quadraticCurveTo(x, y, x + safeRadius, y);
    context.closePath();
  }

  function resetRunTimer() {
    state.timerStarted = false;
    state.timerRunning = false;
    state.timerStartedAt = 0;
    state.timerElapsedMs = 0;
    state.finalTimeMs = 0;
    updateTimerDisplay(0);
  }

  function startRunTimer(time) {
    if (state.timerStarted) return;

    state.timerStarted = true;
    state.timerRunning = true;
    state.timerStartedAt = time;
    state.timerElapsedMs = 0;
  }

  function pauseRunTimer(time) {
    if (!state.timerStarted || !state.timerRunning) return;

    state.timerElapsedMs += Math.max(0, time - state.timerStartedAt);
    state.timerRunning = false;
    state.timerStartedAt = 0;
  }

  function resumeRunTimer(time) {
    if (!state.timerStarted || state.timerRunning || state.won) return;

    state.timerRunning = true;
    state.timerStartedAt = time;
  }

  function finishRunTimer(time) {
    pauseRunTimer(time);
    state.finalTimeMs = Math.max(0, state.timerElapsedMs);
    updateTimerDisplay(time);
  }

  function getElapsedTime(time) {
    if (!state.timerStarted) return 0;
    if (!state.timerRunning) return state.timerElapsedMs;
    return state.timerElapsedMs + Math.max(0, time - state.timerStartedAt);
  }

  function updateTimerDisplay(time) {
    if (!state.timerText) return;
    state.timerText.textContent = formatTime(getElapsedTime(time));
  }

  function formatTime(milliseconds) {
    const totalTenths = Math.max(0, Math.floor(milliseconds / 100));
    const minutes = Math.floor(totalTenths / 600);
    const seconds = Math.floor((totalTenths % 600) / 10);
    const tenths = totalTenths % 10;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths}`;
  }

  function loadLeaderboard() {
    try {
      const parsed = JSON.parse(
        localStorage.getItem(LEADERBOARD_STORAGE_KEY) || "[]",
      );
      if (!Array.isArray(parsed)) return [];

      return parsed
        .filter(function (entry) {
          return (
            entry &&
            typeof entry.name === "string" &&
            Number.isFinite(entry.timeMs) &&
            entry.timeMs > 0
          );
        })
        .map(function (entry) {
          return {
            name: sanitizePlayerName(entry.name),
            timeMs: Math.round(entry.timeMs),
            savedAt: Number.isFinite(entry.savedAt) ? entry.savedAt : 0,
          };
        })
        .sort(compareLeaderboardEntries)
        .slice(0, MAX_LEADERBOARD_ENTRIES);
    } catch (error) {
      return [];
    }
  }

  function saveCompletedTime(event) {
    event.preventDefault();
    if (!state.won || state.scoreSaved || state.finalTimeMs <= 0) return;

    const entry = {
      name: sanitizePlayerName(state.playerNameInput?.value),
      timeMs: Math.round(state.finalTimeMs),
      savedAt: Date.now(),
    };

    state.leaderboard = [...state.leaderboard, entry]
      .sort(compareLeaderboardEntries)
      .slice(0, MAX_LEADERBOARD_ENTRIES);
    state.scoreSaved = true;
    saveLeaderboard();
    renderLeaderboard();
    state.playerNameInput.disabled = true;
    state.saveTimeButton.disabled = true;
    state.saveTimeButton.textContent = "SAVED ✓";
    playSound("save");
  }

  function saveLeaderboard() {
    try {
      localStorage.setItem(
        LEADERBOARD_STORAGE_KEY,
        JSON.stringify(state.leaderboard),
      );
    } catch (error) {
      // The in-memory leaderboard still works when local storage is blocked.
    }
  }

  function compareLeaderboardEntries(first, second) {
    return first.timeMs - second.timeMs || first.savedAt - second.savedAt;
  }

  function sanitizePlayerName(value) {
    const cleanName = String(value || "")
      .trim()
      .replace(/\s+/g, " ")
      .slice(0, 12)
      .toUpperCase();
    return cleanName || DEFAULT_PLAYER_NAME;
  }

  function renderLeaderboard() {
    updateBestTimeText();
    if (!state.leaderboardList) return;

    state.leaderboardList.replaceChildren();
    if (state.leaderboard.length === 0) {
      const emptyEntry = document.createElement("li");
      emptyEntry.className = "is-empty";
      emptyEntry.textContent = "NO SAVED TIMES YET";
      state.leaderboardList.appendChild(emptyEntry);
      return;
    }

    state.leaderboard.forEach(function (entry, index) {
      const listItem = document.createElement("li");
      const rank = document.createElement("span");
      const name = document.createElement("strong");
      const time = document.createElement("span");
      rank.textContent = String(index + 1).padStart(2, "0");
      name.textContent = entry.name;
      time.textContent = formatTime(entry.timeMs);
      listItem.append(rank, name, time);
      state.leaderboardList.appendChild(listItem);
    });
  }

  function updateBestTimeText() {
    if (!state.bestTimeText) return;
    const bestTime = state.leaderboard[0]?.timeMs;
    state.bestTimeText.textContent = bestTime
      ? `BEST ${formatTime(bestTime)}`
      : "BEST --:--.-";
  }

  function toggleSound() {
    if (!getAudioContextConstructor()) return;

    state.soundEnabled = !state.soundEnabled;
    updateSoundButton();
    if (state.soundEnabled) {
      ensureAudioContext();
      playSound("save");
    }
  }

  function updateSoundButton() {
    if (!state.soundButton) return;

    if (!getAudioContextConstructor()) {
      state.soundButton.textContent = "SOUND N/A";
      state.soundButton.disabled = true;
      state.soundButton.setAttribute("aria-label", "Game sound is unavailable");
      state.soundButton.setAttribute("aria-pressed", "false");
      return;
    }

    state.soundButton.disabled = false;
    state.soundButton.textContent = state.soundEnabled
      ? "SOUND ON"
      : "SOUND OFF";
    state.soundButton.setAttribute(
      "aria-label",
      state.soundEnabled ? "Turn game sound off" : "Turn game sound on",
    );
    state.soundButton.setAttribute("aria-pressed", String(state.soundEnabled));
  }

  function getAudioContextConstructor() {
    return window.AudioContext || window.webkitAudioContext || null;
  }

  function ensureAudioContext() {
    if (!state.soundEnabled) return null;
    const AudioContextConstructor = getAudioContextConstructor();
    if (!AudioContextConstructor) return null;

    if (!state.audioContext) {
      state.audioContext = new AudioContextConstructor();
      state.audioMasterGain = state.audioContext.createGain();
      state.audioMasterGain.gain.value = 0.48;
      state.audioMasterGain.connect(state.audioContext.destination);
    }

    if (state.audioContext.state === "suspended") {
      state.audioContext.resume().catch(function () {});
    }
    return state.audioContext;
  }

  function playSound(soundName) {
    if (!state.soundEnabled) return;
    const context = ensureAudioContext();
    if (!context) return;

    const sounds = {
      launch: [{ frequency: 320, duration: 0.045, volume: 0.04 }],
      paddle: [{ frequency: 245, duration: 0.035, volume: 0.035 }],
      brick: [{ frequency: 510, duration: 0.038, volume: 0.036 }],
      miss: [{ frequency: 145, duration: 0.09, volume: 0.045 }],
      save: [{ frequency: 430, duration: 0.045, volume: 0.035 }],
      win: [
        { frequency: 440, duration: 0.07, volume: 0.038 },
        { frequency: 660, duration: 0.1, volume: 0.04, delay: 0.075 },
      ],
    };
    const notes = sounds[soundName];
    if (!notes) return;

    const schedule = function () {
      if (state.audioContext !== context || context.state === "closed") return;
      notes.forEach(function (note) {
        scheduleTone(context, note);
      });
    };

    if (context.state === "suspended") {
      context.resume().then(schedule).catch(function () {});
    } else {
      schedule();
    }
  }

  function scheduleTone(context, note) {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const startTime = context.currentTime + (note.delay || 0);
    const endTime = startTime + note.duration;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(note.frequency, startTime);
    envelope.gain.setValueAtTime(0.0001, startTime);
    envelope.gain.exponentialRampToValueAtTime(note.volume, startTime + 0.006);
    envelope.gain.exponentialRampToValueAtTime(0.0001, endTime);
    oscillator.connect(envelope);
    envelope.connect(state.audioMasterGain);
    oscillator.start(startTime);
    oscillator.stop(endTime + 0.015);
    oscillator.addEventListener("ended", function () {
      oscillator.disconnect();
      envelope.disconnect();
    });
  }

  function closeAudioContext() {
    const context = state.audioContext;
    state.audioContext = null;
    state.audioMasterGain = null;
    if (context && context.state !== "closed") {
      context.close().catch(function () {});
    }
  }

  function updateScore() {
    if (state.scoreText) {
      state.scoreText.textContent = String(state.score).padStart(3, "0");
    }
  }

  function showWin() {
    state.won = true;
    state.launched = false;
    finishRunTimer(performance.now());
    stopAnimationLoop();
    state.launchHint?.classList.remove("is-visible");
    if (state.finalTimeText) {
      state.finalTimeText.textContent = formatTime(state.finalTimeMs);
    }
    state.scoreSaved = false;
    state.playerNameInput.disabled = false;
    state.saveTimeButton.disabled = false;
    state.saveTimeButton.textContent = "SAVE TIME";
    renderLeaderboard();
    state.winPanel?.classList.add("is-visible");
    playSound("win");
    state.playerNameInput?.focus({ preventScroll: true });
  }

  function closeGame() {
    if (!state.playing) {
      cancelEasterEgg();
      return;
    }

    state.playing = false;
    state.paused = false;
    state.won = false;
    state.launched = false;
    pauseRunTimer(performance.now());
    stopAnimationLoop();
    clearMovementKeys();
    closeAudioContext();
    state.gameEvents?.abort();
    state.gameEvents = null;
    state.stage?.remove();
    state.stage = null;
    state.canvas = null;
    state.context = null;
    state.scoreText = null;
    state.timerText = null;
    state.bestTimeText = null;
    state.soundButton = null;
    state.launchHint = null;
    state.winPanel = null;
    state.finalTimeText = null;
    state.playerNameInput = null;
    state.saveTimeButton = null;
    state.leaderboardList = null;
    state.bricks = [];
    resetRunTimer();
    restorePanel();
    restorePage();
    cancelEasterEgg();
  }

  function restorePanel() {
    bottomPanel.classList.remove("rynl-break-paddle");
    bottomPanel.inert = state.savedPanelInert;

    if (state.savedPanelAriaDisabled === null) {
      bottomPanel.removeAttribute("aria-disabled");
    } else {
      bottomPanel.setAttribute("aria-disabled", state.savedPanelAriaDisabled);
    }

    state.savedPanelItems.forEach(function (saved) {
      restoreAttribute(saved.item, "tabindex", saved.tabIndex);
      restoreAttribute(saved.item, "aria-disabled", saved.ariaDisabled);
    });
    state.savedPanelItems = [];

    if (state.savedPanelStyle === null) {
      bottomPanel.removeAttribute("style");
    } else {
      bottomPanel.setAttribute("style", state.savedPanelStyle);
    }
  }

  function restorePage() {
    document.body.classList.remove("rynl-break-active");

    if (state.savedBodyStyle === null) {
      document.body.removeAttribute("style");
    } else {
      document.body.setAttribute("style", state.savedBodyStyle);
    }

    state.savedContentStates.forEach(function (saved) {
      saved.element.inert = saved.inert;
      restoreAttribute(saved.element, "aria-hidden", saved.ariaHidden);
    });
    state.savedContentStates = [];
    window.scrollTo(state.scrollX, state.scrollY);
  }

  function restoreAttribute(element, name, value) {
    if (value === null) {
      element.removeAttribute(name);
    } else {
      element.setAttribute(name, value);
    }
  }

  function clamp(value, minimum, maximum) {
    return Math.min(Math.max(value, minimum), maximum);
  }
})();