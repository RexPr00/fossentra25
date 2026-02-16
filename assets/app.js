const body = document.body;

const trapFocus = (container, active) => {
  if (!active) return;
  const focusable = container.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  first.focus();

  const onKey = (event) => {
    if (event.key !== 'Tab') return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  container.addEventListener('keydown', onKey);
  container.dataset.trap = 'on';
  container.dataset.trapRef = String(Date.now());
  container._onTrapKey = onKey;
};

const releaseFocus = (container) => {
  if (container?._onTrapKey) {
    container.removeEventListener('keydown', container._onTrapKey);
    container._onTrapKey = null;
  }
};

const dropdown = document.querySelector('[data-language-switcher]');
if (dropdown) {
  const trigger = dropdown.querySelector('[data-language-trigger]');
  const menu = dropdown.querySelector('[data-language-menu]');

  const closeMenu = () => {
    menu.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
  };

  trigger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  document.addEventListener('click', (event) => {
    if (!dropdown.contains(event.target)) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach((item) => {
  const button = item.querySelector('.faq-question');
  button.addEventListener('click', () => {
    faqItems.forEach((other) => {
      if (other !== item) other.classList.remove('open');
    });
    item.classList.toggle('open');
  });
});

const forms = document.querySelectorAll('.lead-form');
const validateForm = (form) => {
  const requiredFields = form.querySelectorAll('[required]');
  let valid = true;
  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      valid = false;
      field.setAttribute('aria-invalid', 'true');
    } else {
      field.removeAttribute('aria-invalid');
    }
  });
  return valid;
};

forms.forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateForm(form)) return;
    const feedback = form.querySelector('.form-note');
    if (feedback) feedback.textContent = form.dataset.success || 'Thanks. We will contact you shortly.';
    form.reset();
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      if (entry.target.classList.contains('bar-fill')) {
        entry.target.style.width = entry.target.dataset.width;
      }
    }
  });
}, { threshold: 0.25 });

document.querySelectorAll('.animate, .bar-fill').forEach((el) => observer.observe(el));

const modal = document.querySelector('[data-modal]');
const modalOpeners = document.querySelectorAll('[data-open-modal]');
const modalClose = document.querySelector('[data-close-modal]');
const overlay = document.querySelector('[data-overlay]');
const drawer = document.querySelector('[data-drawer]');
const drawerOpen = document.querySelector('[data-open-drawer]');
const drawerClose = document.querySelector('[data-close-drawer]');

const closeModal = () => {
  if (!modal) return;
  modal.classList.remove('open');
  overlay.classList.remove('open');
  body.classList.remove('lock-scroll');
  releaseFocus(modal);
};

const openModal = () => {
  if (!modal) return;
  modal.classList.add('open');
  overlay.classList.add('open');
  body.classList.add('lock-scroll');
  trapFocus(modal, true);
};

modalOpeners.forEach((btn) => btn.addEventListener('click', openModal));
modalClose?.addEventListener('click', closeModal);

const closeDrawer = () => {
  drawer?.classList.remove('open');
  overlay.classList.remove('open');
  body.classList.remove('lock-scroll');
  releaseFocus(drawer);
};

const openDrawer = () => {
  drawer?.classList.add('open');
  overlay.classList.add('open');
  body.classList.add('lock-scroll');
  if (drawer) trapFocus(drawer, true);
};

drawerOpen?.addEventListener('click', openDrawer);
drawerClose?.addEventListener('click', closeDrawer);

overlay?.addEventListener('click', () => {
  closeModal();
  closeDrawer();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
    closeDrawer();
  }
});
