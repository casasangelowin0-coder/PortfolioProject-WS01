/**
 * Contact Form Module
 * Handles form validation, submission to Formspree, toast notifications
 */

const FORM_SELECTOR = '#contact-form';
const STATUS_SELECTOR = '#form-status';
const TOAST_CONTAINER_SELECTOR = '#toast-container';

// Replace with your Formspree endpoint
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xnpjlnoz';

export function initContactForm() {
  const form = document.querySelector(FORM_SELECTOR);
  if (!form) return;

  form.addEventListener('submit', handleSubmit);

  // Real-time validation
  form.querySelectorAll('.textfield__input').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('textfield__input--invalid')) {
        validateField(input);
      }
    });
  });
}

async function handleSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const submitBtn = form.querySelector('[type="submit"]');
  const statusEl = document.querySelector(STATUS_SELECTOR);

  // Validate all fields
  let isValid = true;
  form.querySelectorAll('.textfield__input').forEach(input => {
    if (!validateField(input)) {
      isValid = false;
    }
  });

  if (!isValid) {
    showToast('Please fix the errors above', 'error');
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
  const fieldGroup = input.closest('.textfield') || input.closest('.form__group');
  const errorEl = fieldGroup?.querySelector('.textfield__error');
  let isValid = true;
  let errorMessage = '';

  // Required check
  if (input.required && !input.value.trim()) {
    isValid = false;
    errorMessage = 'This field is required';
  }

  // Email validation
  if (input.type === 'email' && input.value.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value.trim())) {
      isValid = false;
      errorMessage = 'Please enter a valid email address';
    }
  }

  // Update UI
  if (isValid) {
    input.classList.remove('textfield__input--invalid');
    fieldGroup?.classList.remove('textfield--error');
    if (errorEl) errorEl.textContent = '';
  } else {
    input.classList.add('textfield__input--invalid');
    fieldGroup?.classList.add('textfield--error');
    if (errorEl) errorEl.textContent = errorMessage;
  }

  return isValid;
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