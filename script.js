/*  */// Produktdaten: Die verlinkten Bilder koennen hier zentral gepflegt werden.
const products = [
  {
    id: "clarity-cleanser",
    title: "Clarity Cleanser",
    short: "Sanfte Tiefenreinigung für ein frisches Hautgefühl.",
    description:
      "Der Clarity Cleanser entfernt Rückstände und verleiht ein klares, weiches Finish. Entwickelt für die tägliche Anwendung mit ausgewogener Pflegeleistung.",
    price: "29,90 €",
    buyUrl: "https://example.com/shop/clarity-cleanser",
    images: ["img/desinfektionsspray.png"],
  },
  {
    id: "deep-hydration",
    title: "Deep Hydration Serum",
    short: "Intensive Hydration mit leichtem, cleanem Finish.",
    description:
      "Ein hochkonzentriertes Serum für langanhaltende Feuchtigkeit und ein sichtbar ausgeglichenes Hautbild, ohne zu beschweren.",
    price: "39,90 €",
    buyUrl: "https://example.com/shop/deep-hydration",
    images: ["img/desinfektionsseife.png"],
  },
  {
    id: "repair-cream",
    title: "Repair Cream",
    short: "Regenerierende Pflege für Tag und Nacht.",
    description:
      "Die Repair Cream unterstützt die Hautbarriere und sorgt für ein geschmeidiges, gepflegtes Ergebnis mit minimalistischem Duftprofil.",
    price: "34,90 €",
    buyUrl: "https://example.com/shop/repair-cream",
    images: ["img/desinfektionstuecher.png"],
  },
  {
    id: "daily-spf",
    title: "Daily SPF Shield",
    short: "Leichter UV-Schutz mit modernem Skin-Feel.",
    description:
      "Daily SPF Shield bietet verlässlichen Schutz und ein natürliches Finish, perfekt als letzter Schritt deiner morgendlichen Routine.",
    price: "32,90 €",
    buyUrl: "https://example.com/shop/daily-spf",
    images: ["img/desinfektionsspray_cllipper.png"],
  },
];

const grid = document.getElementById("productGrid");
const modal = document.getElementById("productModal");
const modalTag = document.getElementById("modalTag");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
const modalBuy = document.getElementById("modalBuy");
const modalMainImage = document.getElementById("modalMainImage");
const modalThumbs = document.getElementById("modalThumbs");
const modalPrev = document.getElementById("modalPrev");
const modalNext = document.getElementById("modalNext");
const modalClose = modal.querySelector(".modal-close");
const siteHeader = document.getElementById("siteHeader");
const productSection = document.getElementById("produkte");
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");

const THEME_STORAGE_KEY = "clenz-theme";

let activeProduct = null;
let activeGallery = [];
let activeImageIndex = 0;

function getPreferredTheme() {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  if (!themeToggle) {
    return;
  }

  const isLight = theme === "light";
  themeToggle.setAttribute("aria-pressed", String(isLight));
  themeToggle.setAttribute("aria-label", isLight ? "Zu Dark Mode wechseln" : "Zu Light Mode wechseln");
}

function setupThemeToggle() {
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  if (!themeToggle) {
    return;
  }

  themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
  });
}

function setMenuState(isOpen) {
  if (!menuToggle || !siteNav) {
    return;
  }

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Menue schliessen" : "Menue oeffnen");
  siteNav.classList.toggle("is-open", isOpen);
}

function setupMenuToggle() {
  if (!menuToggle || !siteNav) {
    return;
  }

  setMenuState(false);

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 680) {
        setMenuState(false);
      }
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 680) {
      setMenuState(false);
    }
  });
}

function buildGalleryImages(images) {
  const safeImages = images.filter(Boolean);

  if (!safeImages.length) {
    return [];
  }

  return Array.from({ length: Math.max(4, safeImages.length) }, (_, index) => safeImages[index % safeImages.length]);
}

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

function renderModalGallery() {
  if (!activeProduct || !activeGallery.length) {
    return;
  }

  const activeImage = activeGallery[activeImageIndex];

  modalMainImage.src = activeImage;
  modalMainImage.alt = `${activeProduct.title} Detail ${activeImageIndex + 1}`;
  modalMainImage.classList.remove("is-animating");
  void modalMainImage.offsetWidth;
  modalMainImage.classList.add("is-animating");

  modalThumbs.innerHTML = activeGallery
    .map(
      (image, index) => `
        <button
          class="modal-thumb ${index === activeImageIndex ? "is-active" : ""}"
          type="button"
          data-image-index="${index}"
          aria-label="Bild ${index + 1} anzeigen"
          aria-pressed="${index === activeImageIndex}"
        >
          <img src="${image}" alt="${activeProduct.title} Thumbnail ${index + 1}" loading="lazy" />
        </button>
      `
    )
    .join("");
}

function updateActiveImage(index) {
  if (!activeGallery.length) {
    return;
  }

  activeImageIndex = (index + activeGallery.length) % activeGallery.length;
  renderModalGallery();
}

function shiftGallery(direction) {
  updateActiveImage(activeImageIndex + direction);
}

function openModal(product) {
  activeProduct = product;
  activeGallery = buildGalleryImages(product.images);
  activeImageIndex = 0;

  modalTag.textContent = "Clenz Essentials";
  modalTitle.textContent = product.title;
  modalDescription.textContent = product.description;
  modalPrice.textContent = product.price;
  modalBuy.href = product.buyUrl;

  renderModalGallery();

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  if (modalClose) {
    modalClose.focus();
  }
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  activeProduct = null;
  activeGallery = [];
  activeImageIndex = 0;

  modalMainImage.removeAttribute("src");
  modalMainImage.removeAttribute("alt");
  modalThumbs.innerHTML = "";
}

function setupInteractions() {
  grid.addEventListener("click", (event) => {
    const card = event.target.closest(".product-card");

    if (!card) {
      return;
    }

    const product = products.find((item) => item.id === card.dataset.productId);

    if (product) {
      openModal(product);
    }
  });

  grid.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    const card = event.target.closest(".product-card");

    if (!card) {
      return;
    }

    event.preventDefault();

    const product = products.find((item) => item.id === card.dataset.productId);

    if (product) {
      openModal(product);
    }
  });

  modal.addEventListener("click", (event) => {
    if (event.target.hasAttribute("data-close-modal")) {
      closeModal();
      return;
    }

    const thumb = event.target.closest(".modal-thumb");

    if (thumb) {
      updateActiveImage(Number(thumb.dataset.imageIndex));
    }
  });

  modalPrev.addEventListener("click", () => shiftGallery(-1));
  modalNext.addEventListener("click", () => shiftGallery(1));

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") {
      setMenuState(false);
    }

    if (!modal.classList.contains("is-open")) {
      return;
    }

    if (event.key === "Escape") {
      closeModal();
      return;
    }

    if (event.key === "ArrowLeft") {
      shiftGallery(-1);
    }

    if (event.key === "ArrowRight") {
      shiftGallery(1);
    }
  });
}

function setupScrollEffects() {
  window.addEventListener(
    "scroll",
    () => {
      siteHeader.classList.toggle("scrolled", window.scrollY > 8);
    },
    { passive: true }
  );

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

  document.querySelectorAll(".fade-in-up").forEach((element) => revealObserver.observe(element));

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
setupThemeToggle();
setupMenuToggle();
setupInteractions();
setupScrollEffects();
