/**
 * Contact Form Module
 * Handles form validation, submission to Formspree, toast notifications
 */

const FORM_SELECTOR = '#contact-form';
const TOAST_CONTAINER_SELECTOR = '#toast-container';

// Replace with your Formspree endpoint
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xnpjlnoz';

const FIELD_RULES = {
  name: {
    label: 'Name',
    min: 2,
    max: 60,
    pattern: /^[\p{L} .'-]+$/u,
    patternMessage: 'Name may only contain letters, spaces, periods, hyphens, and apostrophes',
  },
  email: {
    label: 'Email',
    max: 100,
    pattern: /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/,
    patternMessage: 'Please enter a valid email address',
  },
  subject: { label: 'Subject' },
  message: { label: 'Message' },
};

export function initContactForm() {
  const form = document.querySelector(FORM_SELECTOR);
  if (!form) return;

  form.addEventListener('submit', handleSubmit);

  // Enter should not submit the form (textarea still allows new lines)
  form.querySelectorAll('.textfield__input').forEach(input => {
    input.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' || input.tagName === 'TEXTAREA') return;
      event.preventDefault();
    });
  });
}

async function handleSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const submitBtn = form.querySelector('[type="submit"]');

  // Validate all fields
  let firstInvalid = null;
  let firstError = '';
  form.querySelectorAll('.textfield__input').forEach(input => {
    const error = validateField(input);
    if (error && !firstInvalid) {
      firstInvalid = input;
      firstError = error;
    }
  });

  if (firstInvalid) {
    firstInvalid.focus();
    showToast(firstError, 'error');
    return;
  }

  // Show loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <svg class="icon animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
    </svg>
    Sending...
  `;

  try {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
      form.reset();
      // Reset floating labels
      form.querySelectorAll('.textfield__label').forEach(label => {
        label.style.top = '';
        label.style.transform = '';
        label.style.fontSize = '';
        label.style.color = '';
        label.style.fontWeight = '';
      });
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to send message');
    }
  } catch (error) {
    console.error('Form submission error:', error);
    showToast('Failed to send message. Please try again or email directly.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
      Send Message
    `;
  }
}

function validateField(input) {
  const rules = FIELD_RULES[input.name] || {};
  const label = rules.label || 'This field';
  const value = input.value.trim();

  const invalid = (message) => {
    input.setAttribute('aria-invalid', 'true');
    return message;
  };

  if (!value) {
    return input.required ? invalid(`${label} is required`) : '';
  }

  if (rules.min && value.length < rules.min) {
    return invalid(`${label} must be at least ${rules.min} characters`);
  }

  if (rules.max && value.length > rules.max) {
    return invalid(`${label} must be ${rules.max} characters or fewer`);
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    return invalid(rules.patternMessage || `${label} is invalid`);
  }

  input.setAttribute('aria-invalid', 'false');
  return '';
}

function showToast(message, type = 'info') {
  const container = document.querySelector(TOAST_CONTAINER_SELECTOR);
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');

  const icons = {
    success: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    error: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  };

  toast.innerHTML = `${icons[type] || icons.info}<span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.add('toast--show');
  });

  // Auto dismiss
  setTimeout(() => {
    toast.classList.remove('toast--show');
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Add spin animation for loading state
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .animate-spin { animation: spin 1s linear infinite; }
`;
document.head.appendChild(style);