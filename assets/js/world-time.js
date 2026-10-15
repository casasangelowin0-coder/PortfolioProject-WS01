/**
 * World Time Module
 * Live clock for the hero timer card (Manila main + city row)
 * Main digits roll upward one by one, ones first (odometer cascade)
 */

const ZONES = {
  main: 'Asia/Manila',
  manila: 'Asia/Manila',
  la: 'America/Los_Angeles',
  ny: 'America/New_York',
  london: 'Europe/London',
  paris: 'Europe/Paris',
};

const ROLL_OUT_MS = 170;
const ROLL_IN_MS = 210;
const CASCADE_MS = 55; // stagger between digits, rightmost first

function parts(timeZone, withSeconds = false) {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    ...(withSeconds ? { second: '2-digit' } : {}),
    hour12: false,
  });
  const out = { hour: '00', minute: '00', second: '00' };
  for (const p of fmt.formatToParts(new Date())) {
    if (p.type in out) out[p.type] = p.value;
  }
  return out;
}

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Roll a single character upward: old slides up/out, new slides up/in.
 * `delay` staggers digits so they flip one by one instead of all at once.
 */
function rollDigit(el, newChar, delay = 0, big = true) {
  if (!el || el.textContent === newChar) return;
  if (reducedMotion() || typeof el.animate !== 'function') {
    el.textContent = newChar;
    return;
  }
  const outMs = big ? ROLL_OUT_MS : 150;
  const inMs = big ? ROLL_IN_MS : 180;
  setTimeout(() => {
    try {
      const out = el.animate(
        [
          { transform: 'translateY(0)', filter: 'blur(0)', opacity: 1 },
          { transform: 'translateY(-75%)', filter: 'blur(5px)', opacity: 0 },
        ],
        { duration: outMs, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' }
      );
      out.onfinish = () => {
        el.textContent = newChar;
        el.animate(
          [
            { transform: 'translateY(75%)', filter: 'blur(5px)', opacity: 0 },
            { transform: 'translateY(0)', filter: 'blur(0)', opacity: 1 },
          ],
          { duration: inMs, easing: 'cubic-bezier(0.2, 0, 0, 1)', fill: 'forwards' }
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
  const cityEls = {
    manila: document.getElementById('wt-manila'),
    la: document.getElementById('wt-la'),
    ny: document.getElementById('wt-ny'),
    london: document.getElementById('wt-london'),
    paris: document.getElementById('wt-paris'),
  };
  if (!digits.s2) return;

  const dateFmt = new Intl.DateTimeFormat('en-US', {
    timeZone: ZONES.main,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  let first = true;

  function setMainDigits(t) {
    // Order rightmost first so ones flip before tens (cascade)
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
      rollDigit(el, ch, delay, true);
    }
  }

  function setHM(el, zone) {
    if (!el) return;
    const p = parts(zone);
    const text = `${p.hour}:${p.minute}`;
    if (first) {
      el.textContent = text;
      return;
    }
    rollDigit(el, text, 0, false);
  }

  function tick() {
    const t = parts(ZONES.main, true);
    setMainDigits(t);

    setHM(cityEls.manila, ZONES.manila);
    setHM(cityEls.la, ZONES.la);
    setHM(cityEls.ny, ZONES.ny);
    setHM(cityEls.london, ZONES.london);
    setHM(cityEls.paris, ZONES.paris);

    if (dateEl) dateEl.textContent = dateFmt.format(new Date());
    first = false;
  }

  tick();
  const id = setInterval(() => {
    if (!document.hidden) tick();
  }, 1000);

  return () => clearInterval(id);
}
