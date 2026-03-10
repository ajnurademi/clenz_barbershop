// Produktdaten: Die verlinkten Bilder können hier zentral gepflegt werden.
const products = [
  {
    id: "clarity-cleanser",
    title: "Clarity Cleanser",
    short: "Sanfte Tiefenreinigung für ein frisches Hautgefühl.",
    description:
      "Der Clarity Cleanser entfernt Rückstände und verleiht ein klares, weiches Finish. Entwickelt für die tägliche Anwendung mit ausgewogener Pflegeleistung.",
    price: "29,90 €",
    buyUrl: "https://example.com/shop/clarity-cleanser",
    images: [
      "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "deep-hydration",
    title: "Deep Hydration Serum",
    short: "Intensive Hydration mit leichtem, cleanem Finish.",
    description:
      "Ein hochkonzentriertes Serum für langanhaltende Feuchtigkeit und ein sichtbar ausgeglichenes Hautbild – ohne zu beschweren.",
    price: "39,90 €",
    buyUrl: "https://example.com/shop/deep-hydration",
    images: [
      "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1631730486787-ecf1f4e2eec2?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "repair-cream",
    title: "Repair Cream",
    short: "Regenerierende Pflege für Tag und Nacht.",
    description:
      "Die Repair Cream unterstützt die Hautbarriere und sorgt für ein geschmeidiges, gepflegtes Ergebnis mit minimalistischem Duftprofil.",
    price: "34,90 €",
    buyUrl: "https://example.com/shop/repair-cream",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1570554886111-e80fcca6a029?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "daily-spf",
    title: "Daily SPF Shield",
    short: "Leichter UV-Schutz mit modernem Skin-Feel.",
    description:
      "Daily SPF Shield bietet verlässlichen Schutz und ein natürliches Finish – perfekt als letzter Schritt deiner morgendlichen Routine.",
    price: "32,90 €",
    buyUrl: "https://example.com/shop/daily-spf",
    images: [
      "https://images.unsplash.com/photo-1629198735660-e39ea93f5d8f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
    ],
  },
];

const grid = document.getElementById("productGrid");
const modal = document.getElementById("productModal");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
const modalBuy = document.getElementById("modalBuy");
const modalImages = document.getElementById("modalImages");
const siteHeader = document.getElementById("siteHeader");
const productSection = document.getElementById("produkte");

function renderProducts() {
  const cards = products
    .map(
      (product) => `
      <article class="product-card fade-in-up" data-product-id="${product.id}" tabindex="0" role="button" aria-label="${product.title} öffnen">
        <img src="${product.images[0]}" alt="${product.title}" loading="lazy" />
        <h3>${product.title}</h3>
        <p>${product.short}</p>
      </article>
    `
    )
    .join("");

  grid.innerHTML = cards;
}

function openModal(product) {
  modalTitle.textContent = product.title;
  modalDescription.textContent = product.description;
  modalPrice.textContent = product.price;
  modalBuy.href = product.buyUrl;

  modalImages.innerHTML = product.images
    .map((img, index) => `<img src="${img}" alt="${product.title} Detail ${index + 1}" loading="lazy" />`)
    .join("");

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function setupInteractions() {
  grid.addEventListener("click", (event) => {
    const card = event.target.closest(".product-card");
    if (!card) return;

    const product = products.find((item) => item.id === card.dataset.productId);
    if (product) openModal(product);
  });

  grid.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const card = event.target.closest(".product-card");
    if (!card) return;

    event.preventDefault();
    const product = products.find((item) => item.id === card.dataset.productId);
    if (product) openModal(product);
  });

  modal.addEventListener("click", (event) => {
    if (event.target.hasAttribute("data-close-modal")) closeModal();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });
}

function setupScrollEffects() {
  // Header-Blur beim Scrollen
  window.addEventListener(
    "scroll",
    () => {
      siteHeader.classList.toggle("scrolled", window.scrollY > 8);
    },
    { passive: true }
  );

  // Intersection Observer für Reveal-Animationen
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  document.querySelectorAll(".fade-in-up").forEach((el) => revealObserver.observe(el));

  // Observer für die "Hero -> Produkte sliden" Transition
  const slideObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        productSection.classList.add("is-visible");
      }
    },
    {
      threshold: 0.24,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  slideObserver.observe(productSection);
}

renderProducts();
setupInteractions();
setupScrollEffects();
