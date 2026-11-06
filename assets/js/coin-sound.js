const FLIP_SELECTOR = '.hero__avatar-flip';
const SOUND_SRC = 'assets/audio/coin-flip.mp3';
const VOLUME = 0.3;
const CYCLE_MS = 6000;
const FLIP_START_MS = CYCLE_MS * 0.58;
const ANIMATION_NAME = 'avatar-flip';
const MAX_FRAME_DELTA_MS = 250;

export function initCoinSound() {
  const element = document.querySelector(FLIP_SELECTOR);
  if (!element) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Browsers never allow audible sound before the visitor has interacted with
  // the page at all, so the sound is "unlocked" by ANY first interaction
  // (tap, key press, click, scroll gesture) - not by clicking the coin itself.
  // After that it plays automatically on every flip. Chrome/Edge also allow it
  // from the very first flip on sites the visitor has engaged with before.
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const ctx = AudioCtx ? new AudioCtx() : null;
  let buffer = null;

  const fallback = new Audio(SOUND_SRC);
  fallback.preload = 'auto';
  fallback.volume = VOLUME;

  if (ctx) {
    fetch(SOUND_SRC)
      .then(r => r.arrayBuffer())
      .then(data => new Promise((res, rej) => ctx.decodeAudioData(data, res, rej)))
      .then(b => { buffer = b; })
      .catch(() => {});
  }

  function unlock() {
    if (ctx && ctx.state !== 'running') ctx.resume().catch(() => {});
  }
  // Try right away (works if the browser already trusts the site).
  unlock();
  // Any real user activation unlocks it; keep listening until it is running.
  const UNLOCK_EVENTS = ['pointerdown', 'pointerup', 'click', 'keydown', 'touchstart', 'touchend'];
  function onGesture() {
    unlock();
    if (!ctx || ctx.state === 'running') {
      UNLOCK_EVENTS.forEach(e => window.removeEventListener(e, onGesture, true));
    }
  }
  UNLOCK_EVENTS.forEach(e => window.addEventListener(e, onGesture, true));

  function play() {
    if (ctx && buffer && ctx.state === 'running') {
      const src = ctx.createBufferSource();
      const gain = ctx.createGain();
      gain.gain.value = VOLUME;
      src.buffer = buffer;
      src.connect(gain).connect(ctx.destination);
      src.start();
      return;
    }
    // Fallback (e.g. opened from file://, or Web Audio unavailable).
    fallback.currentTime = 0;
    fallback.play().catch(() => {});
  }

  // Detect the moment each flip begins by watching the CSS animation's clock.
  let lastPhase = null;
  function tick() {
    // Pick the flip animation by name; theme changes add CSS transitions
    // to the same element and would otherwise be picked up by mistake.
    const anim = element.getAnimations().find(a => a.animationName === ANIMATION_NAME);
    if (anim && anim.playState === 'running' && !document.hidden
        && !document.body.classList.contains('is-offscreen')) {
      const phase = Number(anim.currentTime) % CYCLE_MS;
      const delta = phase - (lastPhase ?? phase);
      // Only count a normal forward step, never a jump or restart of the clock.
      if (lastPhase !== null && delta >= 0 && delta < MAX_FRAME_DELTA_MS
          && lastPhase < FLIP_START_MS && phase >= FLIP_START_MS) {
        play();
      }
      lastPhase = phase;
    } else {
      lastPhase = null;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
