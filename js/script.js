// ===========================================================
// Kit Bíblico pra Montar — script.js
// ===========================================================

// ⚠️ ALTERAR por produto: link de checkout (Cakto, Hotmart, Kiwify, etc.)
const CHECKOUT_LINK = 'https://pay.cakto.com.br/w7eatim_952738';

document.addEventListener('DOMContentLoaded', () => {
  applyCheckoutLink();
  applyScrollOffer();
  applyPrice();
  initFaq();
  initScrollReveal();
  initStickyCta();
  setYear();
});

/**
 * Aplica o CHECKOUT_LINK a todos os botões [data-checkout-link].
 */
function applyCheckoutLink() {
  document.querySelectorAll('[data-checkout-link]').forEach((btn) => {
    btn.dataset.href = CHECKOUT_LINK;
  });
}

/**
 * Todos os botões [data-checkout-link], exceto o último (seção de oferta),
 * fazem scroll suave até #oferta em vez de ir direto ao checkout.
 * O último botão (dentro da oferta final) vai direto para o link de pagamento.
 */
/**
 * Comportamento desejado:
 * - Apenas o botão dentro de `#oferta` deve enviar diretamente ao checkout.
 * - Todos os outros botões com `data-checkout-link` devem rolar suavemente
 *   até a seção `#oferta`.
 */
function applyScrollOffer() {
  const buttons = Array.from(document.querySelectorAll('[data-checkout-link]'));
  const ofertaButton = document.querySelector('#oferta [data-checkout-link]');

  buttons.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      if (ofertaButton && btn === ofertaButton) {
        // botão da oferta: vai direto ao checkout
        window.location.href = btn.dataset.href;
      } else {
        // outros botões: rolam até a seção de oferta
        event.preventDefault();
        const oferta = document.querySelector('#oferta');
        if (oferta) oferta.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/**
 * Lê data-price e data-price-old do <body> e preenche os elementos de preço.
 * Nunca hardcodear preço em outro lugar do HTML.
 */
function applyPrice() {
  const body = document.body;
  const current = body.dataset.price;
  const old = body.dataset.priceOld;

  if (current) {
    document.querySelectorAll('[data-price-current]').forEach((el) => {
      el.textContent = `R$ ${current}`;
    });
  }

  if (old) {
    document.querySelectorAll('[data-price-current]').forEach((el) => {
      const oldEl = document.createElement('span');
      oldEl.className = 'price__old';
      oldEl.textContent = `R$ ${old}`;
      el.insertAdjacentElement('beforebegin', oldEl);
    });
  }
}

/**
 * Acordeão do FAQ — mantém apenas uma pergunta aberta por vez.
 */
function initFaq() {
  const items = document.querySelectorAll('.faq__item');

  items.forEach((item) => {
    const question = item.querySelector('.faq__question');

    question.addEventListener('click', () => {
      const isOpen = item.getAttribute('data-open') === 'true';

      items.forEach((other) => {
        other.setAttribute('data-open', 'false');
        other.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.setAttribute('data-open', 'true');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/**
 * Fade-in dos elementos .reveal ao entrarem na viewport.
 */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window) || elements.length === 0) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((el) => observer.observe(el));
}

/**
 * Mostra a barra fixa de compra no mobile depois que o Hero sai da tela.
 */
function initStickyCta() {
  const sticky = document.querySelector('#stickyCta');
  const hero = document.querySelector('.hero');

  if (!sticky || !hero) return;

  if (!('IntersectionObserver' in window)) {
    sticky.classList.add('is-visible');
    return;
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      sticky.classList.toggle('is-visible', !entry.isIntersecting);
    },
    { threshold: 0 }
  );

  observer.observe(hero);
}

/**
 * Atualiza o ano no rodapé automaticamente.
 */
function setYear() {
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
