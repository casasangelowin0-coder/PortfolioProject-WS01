const TIME_ZONE = 'Asia/Manila';
const ROLL_OUT_MS = 170;
const ROLL_IN_MS = 210;
const CASCADE_MS = 55;
const TIME_FMT = new Intl.DateTimeFormat('en-GB', {
  timeZone: TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)');

function parts() {
  const out = { hour: '00', minute: '00', second: '00' };
  for (const p of TIME_FMT.formatToParts(new Date())) {
    if (p.type in out) out[p.type] = p.value;
  }
  return out;
}
function rollDigit(el, newChar, delay = 0) {
  if (!el || el.textContent === newChar) return;
  if (REDUCED.matches || typeof el.animate !== 'function') {
    el.textContent = newChar;
    return;
  }
  setTimeout(() => {
    try {
      const out = el.animate(
        [
          { transform: 'translateY(0)', opacity: 1 },
          { transform: 'translateY(-75%)', opacity: 0 },
        ],
        { duration: ROLL_OUT_MS, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' }
      );
      out.onfinish = () => {
        el.textContent = newChar;
        el.animate(
          [
            { transform: 'translateY(75%)', opacity: 0 },
            { transform: 'translateY(0)', opacity: 1 },
          ],
          { duration: ROLL_IN_MS, easing: 'cubic-bezier(0.2, 0, 0, 1)', fill: 'forwards' }
        );
      };
    } catch {
      el.textContent = newChar;
    }
  }, delay);
}
export function initWorldTime() {
  const digits = {
    h1: document.getElementById('wt-h1'),
    h2: document.getElementById('wt-h2'),
    m1: document.getElementById('wt-m1'),
    m2: document.getElementById('wt-m2'),
    s1: document.getElementById('wt-s1'),
    s2: document.getElementById('wt-s2'),
  };
  const dateEl = document.getElementById('wt-date');
  if (!digits.s2) return;
  const dateFmt = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  let first = true;
  function setMainDigits(t) {
    const plan = [
      [digits.s2, t.second[1], 0],
      [digits.s1, t.second[0], CASCADE_MS],
      [digits.m2, t.minute[1], CASCADE_MS * 2],
      [digits.m1, t.minute[0], CASCADE_MS * 3],
      [digits.h2, t.hour[1], CASCADE_MS * 4],
      [digits.h1, t.hour[0], CASCADE_MS * 5],
    ];
    for (const [el, ch, delay] of plan) {
      if (!el) continue;
      if (first) {
        el.textContent = ch;
        continue;
      }
      rollDigit(el, ch, delay);
    }
  }
  function tick() {
    const t = parts();
    setMainDigits(t);
    if (dateEl) {
      const d = dateFmt.format(new Date());
      if (dateEl.textContent !== d) dateEl.textContent = d;
    }
    first = false;
  }
  tick();
  const id = setInterval(() => {
    if (!document.hidden) tick();
  }, 1000);
  return () => clearInterval(id);
}
