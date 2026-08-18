// ---------- Mobile nav toggle ----------
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.getAttribute('data-open') === 'true';
    nav.setAttribute('data-open', String(!isOpen));
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });
})();

// ---------- Accessible contact form validation ----------
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = document.getElementById('form-status');

  const fields = [
    { id: 'name', validate: (v) => v.trim().length > 0, message: 'Enter your name.' },
    {
      id: 'email',
      validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      message: 'Enter a valid email address.',
    },
    { id: 'message', validate: (v) => v.trim().length >= 10, message: 'Message should be at least 10 characters.' },
  ];

  function showError(id, message) {
    const input = document.getElementById(id);
    const error = document.getElementById(id + '-error');
    if (!input || !error) return;
    if (message) {
      error.textContent = message;
      error.classList.add('is-visible');
      input.setAttribute('aria-invalid', 'true');
    } else {
      error.textContent = '';
      error.classList.remove('is-visible');
      input.removeAttribute('aria-invalid');
    }
  }

  fields.forEach(({ id, validate, message }) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener('blur', () => {
      const ok = validate(input.value);
      showError(id, ok ? '' : message);
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let firstInvalid = null;
    let allValid = true;

    fields.forEach(({ id, validate, message }) => {
      const input = document.getElementById(id);
      const ok = validate(input.value);
      showError(id, ok ? '' : message);
      if (!ok) {
        allValid = false;
        if (!firstInvalid) firstInvalid = input;
      }
    });

    status.classList.remove('success', 'error');

    if (!allValid) {
      status.textContent = 'Please fix the highlighted fields before sending.';
      status.classList.add('error', 'is-visible');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // No backend is wired up — this simulates a send so the flow is demonstrable end to end.
    status.textContent = 'Thanks — your message has been sent. I\u2019ll reply within a couple of days.';
    status.classList.add('success', 'is-visible');
    form.reset();
  });
})();
