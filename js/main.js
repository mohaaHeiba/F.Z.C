document.addEventListener('DOMContentLoaded', () => {
  initProducts();
  initHeader();
  initMobileMenu();
  initScrollAnimations();
});

const WHATSAPP_NUMBER = '971551125668';
const INITIAL_PRODUCTS = 6;
const LOAD_MORE_COUNT = 12;

let visibleCount = 0;

function whatsappLink(product) {
  // Build absolute image URL so the shop owner can see exactly which product
  const base = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/');
  const imageUrl = base + product.image;
  const text =
    `Hello! 👋 I'm interested in this product:\n\n` +
    `*${product.name}*\n` +
    `${product.description}\n\n` +
    `🖼️ Product image: ${imageUrl}\n\n` +
    `Please send me more details and pricing. Thank you!`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function productCardHTML(product) {
  return `
    <article class="product-card animate-on-scroll" data-animate="fade-up">
      <div class="product-card-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-card-body">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <a
          href="${whatsappLink(product)}"
          class="btn btn-orange btn-sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Order via WhatsApp
        </a>
      </div>
    </article>
  `;
}

function initProducts() {
  const grid = document.getElementById('products-grid');
  const loadMoreBtn = document.getElementById('load-more-btn');
  const countEl = document.getElementById('products-count');

  if (!grid || typeof PRODUCTS === 'undefined') return;

  visibleCount = 0;
  grid.innerHTML = '';

  loadProducts(INITIAL_PRODUCTS);

  loadMoreBtn.addEventListener('click', () => {
    loadProducts(LOAD_MORE_COUNT);
  });

  function loadProducts(count) {
    const start = visibleCount;
    const end = Math.min(start + count, PRODUCTS.length);
    const batch = PRODUCTS.slice(start, end);

    batch.forEach((product, i) => {
      grid.insertAdjacentHTML('beforeend', productCardHTML(product));
      const card = grid.lastElementChild;
      card.style.animationDelay = `${(i % 6) * 0.08}s`;
    });

    visibleCount = end;
    updateLoadMoreUI(loadMoreBtn, countEl);
    observeNewCards(grid.querySelectorAll('.product-card:not(.observed)'));
  }

  function updateLoadMoreUI(btn, count) {
    const remaining = PRODUCTS.length - visibleCount;

    if (remaining <= 0) {
      btn.style.display = 'none';
    } else {
      btn.style.display = 'inline-flex';
      const nextBatch = Math.min(LOAD_MORE_COUNT, remaining);
      btn.textContent = `Show More (${nextBatch} products)`;
    }

    count.textContent = `Showing ${visibleCount} of ${PRODUCTS.length} products`;
  }
}

function observeNewCards(cards) {
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  cards.forEach(card => {
    card.classList.add('observed');
    card.classList.remove('animated');
    observer.observe(card);
  });
}

function initHeader() {
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });
}

function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    nav.classList.toggle('mobile-open');
  });

  nav.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      nav.classList.remove('mobile-open');
    });
  });
}

function initScrollAnimations() {
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.classList.add('hero-animate');
  }

  const elements = document.querySelectorAll('.animate-on-scroll:not(.product-card)');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay;
        if (delay) {
          entry.target.style.transitionDelay = `${delay * 0.12}s`;
        }
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}
