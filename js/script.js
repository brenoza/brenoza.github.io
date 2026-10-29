const menuToggle = document.querySelector('#menu-toggle');
const menu = document.querySelector('#menu');
const themeToggle = document.querySelector('#theme-toggle');
const greeting = document.querySelector('#greeting');
const year = document.querySelector('#year');
const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');

function updateGreeting() {
  const hour = new Date().getHours();
  let message = 'Olá! Seja bem-vindo(a).';
  if (hour >= 5 && hour < 12) message = 'Bom dia! Seja bem-vindo(a).';
  else if (hour >= 12 && hour < 18) message = 'Boa tarde! Seja bem-vindo(a).';
  else message = 'Boa noite! Seja bem-vindo(a).';
  greeting.textContent = message;
}
updateGreeting();
year.textContent = new Date().getFullYear();

// Menu acessível: fecha ao selecionar um link, clicar fora ou pressionar Escape.
function setMenuOpen(open) {
  menu.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
}
menuToggle.addEventListener('click', () => {
  setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});
menu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => setMenuOpen(false));
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    setMenuOpen(false);
    menuToggle.focus();
  }
});
document.addEventListener('click', event => {
  if (!menu.contains(event.target) && !menuToggle.contains(event.target)) setMenuOpen(false);
});

// Alternância de tema sem armazenar preferências pessoais.
themeToggle.addEventListener('click', () => {
  const dark = document.body.classList.toggle('dark-theme');
  themeToggle.setAttribute('aria-label', dark ? 'Ativar modo claro' : 'Ativar modo escuro');
  themeToggle.title = dark ? 'Ativar modo claro' : 'Ativar modo escuro';
});

// Validação no navegador. Este formulário de demonstração não envia dados para um servidor.
const fields = {
  nome: {
    input: document.querySelector('#nome'),
    error: document.querySelector('#nome-error'),
    validate(value) {
      return value.trim().length >= 2 ? '' : 'Informe seu nome (pelo menos 2 caracteres).';
    }
  },
  email: {
    input: document.querySelector('#email'),
    error: document.querySelector('#email-error'),
    validate(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? '' : 'Digite um e-mail válido.';
    }
  },
  mensagem: {
    input: document.querySelector('#mensagem'),
    error: document.querySelector('#mensagem-error'),
    validate(value) {
      return value.trim().length >= 10 ? '' : 'Escreva uma mensagem com pelo menos 10 caracteres.';
    }
  }
};
const consent = document.querySelector('#consentimento');
const consentError = document.querySelector('#consentimento-error');

function validateField(field) {
  const message = field.validate(field.input.value);
  field.error.textContent = message;
  field.input.setAttribute('aria-invalid', String(Boolean(message)));
  return !message;
}
Object.values(fields).forEach(field => {
  field.input.addEventListener('input', () => {
    if (field.input.hasAttribute('aria-invalid')) validateField(field);
    formStatus.textContent = '';
  });
});
consent.addEventListener('change', () => {
  consentError.textContent = consent.checked ? '' : 'É necessário aceitar o consentimento para continuar.';
  consent.setAttribute('aria-invalid', String(!consent.checked));
});
contactForm.addEventListener('submit', event => {
  event.preventDefault();
  const validFields = Object.values(fields).map(validateField);
  const consentValid = consent.checked;
  consentError.textContent = consentValid ? '' : 'É necessário aceitar o consentimento para continuar.';
  consent.setAttribute('aria-invalid', String(!consentValid));

  if (validFields.every(Boolean) && consentValid) {
    formStatus.textContent = 'Tudo certo! A validação foi concluída. Este formulário ainda não envia mensagens; conecte um backend para ativar o envio.';
    contactForm.reset();
    Object.values(fields).forEach(field => {
      field.error.textContent = '';
      field.input.removeAttribute('aria-invalid');
    });
    consent.removeAttribute('aria-invalid');
  } else {
    formStatus.textContent = 'Revise os campos destacados antes de continuar.';
    const firstInvalid = Object.values(fields).find(field => field.input.getAttribute('aria-invalid') === 'true');
    if (firstInvalid) firstInvalid.input.focus();
    else consent.focus();
  }
});
