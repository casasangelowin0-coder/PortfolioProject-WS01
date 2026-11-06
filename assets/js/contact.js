const ENDPOINT = 'https://formspree.io/f/xnpjlnoz';
const RULES = {
  name: { min: 2, max: 60, re: /^[\p{L} .'-]+$/u, msg: 'Name may only contain letters, spaces, periods, hyphens, and apostrophes' },
  email: { max: 100, re: /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/, msg: 'Please enter a valid email address' },
};
export function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => submit(e, form));
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') e.preventDefault();
  });
}
async function submit(e, form) {
  e.preventDefault();
  for (const input of form.querySelectorAll('.textfield__input')) {
    const error = validate(input);
    if (error) { input.focus(); return toast(error, 'error'); }
  }
  const btn = form.querySelector('[type="submit"]');
  const original = btn.innerHTML;
  btn.disabled = true;
  btn.textContent = 'Sending...';
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    toast("Message sent successfully! I'll get back to you soon.", 'success');
    form.reset();
  } catch (err) {
    console.error('Form submission error:', err);
    toast('Failed to send message. Please try again or email directly.', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = original;
  }
}
function validate(input) {
  const { name, value } = input;
  const v = value.trim();
  const label = name[0].toUpperCase() + name.slice(1);
  const r = RULES[name] || {};
  let error = '';
  if (!v) error = `${label} is required`;
  else if (r.min && v.length < r.min) error = `${label} must be at least ${r.min} characters`;
  else if (r.max && v.length > r.max) error = `${label} must be ${r.max} characters or fewer`;
  else if (r.re && !r.re.test(v)) error = r.msg;
  input.setAttribute('aria-invalid', String(!!error));
  return error;
}
function toast(message, type = 'info') {
  const container = document.querySelector('#toast-container');
  if (!container) return;
  const el = document.createElement('div');
  el.className = `toast toast--${type}`;
  el.setAttribute('role', 'alert');
  el.textContent = message;
  container.appendChild(el);
  requestAnimationFrame(() => el.classList.add('toast--show'));
  setTimeout(() => {
    el.classList.remove('toast--show');
    setTimeout(() => el.remove(), 300);
  }, 5000);
}
