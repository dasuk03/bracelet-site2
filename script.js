"use strict";

const STORAGE_KEYS = {
  products: "litopsProductsV1",
  cart: "litopsCartV1",
  favorites: "litopsFavoritesV1",
  orders: "litopsCustomOrdersV1",
  subscribers: "litopsSubscribersV1"
};

const WB_STORE_URL = "https://www.wildberries.ru/seller/4489837";

const DEFAULT_PRODUCTS = [
  {
    id: "prehnite",
    name: "Пренит",
    material: "Натуральный пренит · нержавеющая сталь",
    description: "Полупрозрачный зелёный минерал с мягким природным свечением. Спокойный акцент для повседневных образов.",
    price: 5490,
    image: "assets/products/prehnite.webp",
    categories: ["light", "rare", "steel", "gift"],
    badge: "Выбор мастера",
    stock: 8,
    featured: true, color: "Светло-зелёный", hardwareMaterial: "Нержавеющая сталь высокого качества", hasClasp: false, braceletCountry: "Россия", stoneCountry: "Китай", packageContents: ["Бирка", "Мешочек для хранения", "Браслет"], gallery: []
  },
  {
    id: "tourmaline",
    name: "Турмалин",
    material: "Натуральный турмалин · нержавеющая сталь",
    description: "Живое сочетание розовых, зелёных и золотистых оттенков. Каждый браслет имеет уникальную палитру.",
    price: 4890,
    image: "assets/products/tourmaline.webp",
    categories: ["color", "rare", "steel", "gift"],
    badge: "Новинка",
    stock: 6,
    featured: true, color: "Мультиколор", hardwareMaterial: "Нержавеющая сталь высокого качества", hasClasp: false, braceletCountry: "Россия", stoneCountry: "Бразилия", packageContents: ["Бирка", "Мешочек для хранения", "Браслет"], gallery: []
  },
  {
    id: "rutilated-quartz",
    name: "Кварц рутиловый",
    material: "Натуральный кварц · нержавеющая сталь",
    description: "Прозрачный кварц с золотистыми иглами рутила. Выразительная фактура, созданная самой природой.",
    price: 4690,
    image: "assets/products/rutilated-quartz.webp",
    categories: ["light", "rare", "steel", "gift"],
    badge: "Редкий камень",
    stock: 5,
    featured: true, color: "Золотисто-прозрачный", hardwareMaterial: "Нержавеющая сталь высокого качества", hasClasp: false, braceletCountry: "Россия", stoneCountry: "Бразилия", packageContents: ["Бирка", "Мешочек для хранения", "Браслет"], gallery: []
  },
  {
    id: "larimar",
    name: "Ларимар",
    material: "Натуральный ларимар · нержавеющая сталь",
    description: "Небесно-голубой минерал с облачным рисунком. Лёгкий и чистый оттенок для спокойных сочетаний.",
    price: 6290,
    image: "assets/products/larimar.webp",
    categories: ["light", "color", "rare", "steel", "gift"],
    badge: "Хит",
    stock: 4,
    featured: true, color: "Небесно-голубой", hardwareMaterial: "Нержавеющая сталь высокого качества", hasClasp: false, braceletCountry: "Россия", stoneCountry: "Доминиканская Республика", packageContents: ["Бирка", "Мешочек для хранения", "Подарочная упаковка", "Браслет"], gallery: []
  },
  {
    id: "labradorite",
    name: "Лабрадор",
    material: "Натуральный лабрадорит · нержавеющая сталь",
    description: "Серый камень с синими, зелёными и золотистыми переливами, которые раскрываются при движении.",
    price: 6790,
    image: "assets/products/labradorite.webp",
    categories: ["color", "rare", "steel", "gift"],
    badge: "Бестселлер",
    stock: 7,
    featured: true, color: "Серо-синий", hardwareMaterial: "Нержавеющая сталь высокого качества", hasClasp: false, braceletCountry: "Россия", stoneCountry: "Мадагаскар", packageContents: ["Бирка", "Мешочек для хранения", "Браслет"], gallery: []
  },
  {
    id: "charoite",
    name: "Чароит",
    material: "Натуральный чароит · нержавеющая сталь",
    description: "Глубокий фиолетовый минерал с волокнистым рисунком. Яркий самостоятельный акцент.",
    price: 5990,
    image: "assets/products/charoite.webp",
    categories: ["color", "rare", "steel", "gift"],
    badge: "Новинка",
    stock: 5,
    featured: true, color: "Фиолетовый", hardwareMaterial: "Нержавеющая сталь высокого качества", hasClasp: false, braceletCountry: "Россия", stoneCountry: "Россия", packageContents: ["Бирка", "Мешочек для хранения", "Браслет"], gallery: []
  }
];

const state = {
  products: loadJson(STORAGE_KEYS.products, DEFAULT_PRODUCTS),
  cart: loadJson(STORAGE_KEYS.cart, {}),
  favorites: new Set(loadJson(STORAGE_KEYS.favorites, [])),
  filter: "all",
  sort: "featured",
  search: "",
  advancedFilters: { priceMin: 0, priceMax: Infinity, colors: [], hardware: "all", clasp: "all" }
};

const els = {};
let toastTimer;

function loadJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : structuredClone(fallback);
  } catch (error) {
    console.warn(`Не удалось прочитать ${key}`, error);
    return structuredClone(fallback);
  }
}

function saveJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Не удалось сохранить ${key}`, error);
  }
}

function formatPrice(value) {
  return new Intl.NumberFormat("ru-RU").format(Number(value) || 0) + " ₽";
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function refreshIcons() {
  window.lucide?.createIcons({ attrs: { "stroke-width": 1.6 } });
}

function cacheElements() {
  [
    "siteHeader", "mainNav", "menuButton", "productGrid", "emptyState", "categoryBar", "sortSelect",
    "cartButton", "cartDrawer", "cartItems", "cartTotal", "cartCount", "cartSummary", "favoritesButton",
    "favoritesDrawer", "favoriteItems", "favoriteCount", "drawerBackdrop", "searchButton", "searchPanel",
    "searchInput", "searchResults", "searchClose", "productDialog", "dialogClose", "dialogImage", "dialogName",
    "dialogMaterial", "dialogDescription", "dialogPrice", "dialogAddToCart", "customOrderButton", "orderDialog",
    "orderDialogClose", "customOrderForm", "orderFormStatus", "newsletterForm", "newsletterMessage", "toast",
    "featuredName", "featuredPrice", "featuredImage", "heroImage", "dialogFacts", "dialogSpecs",
    "filterOpenButton", "activeFilterCount", "filterDialog", "filterForm", "filterCloseButton",
    "filterResetButton", "filterApplyButton", "filterResultCount", "averagePriceLabel", "selectedRangeLabel",
    "priceMinRange", "priceMaxRange", "priceMinInput", "priceMaxInput", "rangeFill", "priceLine",
    "priceAreaPath", "pricePoints"
  ].forEach(id => { els[id] = document.getElementById(id); });
}

function normalizeProducts() {
  if (!Array.isArray(state.products) || !state.products.length) {
    state.products = structuredClone(DEFAULT_PRODUCTS);
    saveJson(STORAGE_KEYS.products, state.products);
  }

  state.products = state.products.map((product, index) => ({
    id: product.id || `product-${index + 1}`,
    name: product.name || "Без названия",
    material: product.material || "Натуральный камень",
    description: product.description || "Браслет ручной работы Litops Atelier.",
    price: Number(product.price) || 0,
    image: product.image || "assets/products/prehnite.webp",
    categories: Array.isArray(product.categories) ? product.categories : ["steel", "gift"],
    badge: product.badge || "Ручная работа",
    stock: Math.max(0, Number(product.stock) || 0),
    featured: Boolean(product.featured),
    color: product.color || "Не указан",
    hardwareMaterial: product.hardwareMaterial || "Нержавеющая сталь высокого качества",
    hasClasp: Boolean(product.hasClasp),
    braceletCountry: product.braceletCountry || "Россия",
    stoneCountry: product.stoneCountry || "Не указана",
    packageContents: Array.isArray(product.packageContents) ? product.packageContents : ["Бирка", "Мешочек для хранения", "Браслет"],
    gallery: Array.isArray(product.gallery) ? product.gallery : []
  }));
}

function getProduct(id) {
  return state.products.find(product => product.id === id);
}

function getVisibleProducts() {
  let products = [...state.products];

  if (state.filter !== "all") {
    products = products.filter(product => product.categories.includes(state.filter));
  }

  if (state.search.trim()) {
    const query = state.search.trim().toLocaleLowerCase("ru");
    products = products.filter(product =>
      [product.name, product.material, product.description].some(value => value.toLocaleLowerCase("ru").includes(query))
    );
  }

  const filters = state.advancedFilters;
  products = products.filter(product => {
    if (product.price < filters.priceMin || product.price > filters.priceMax) return false;
    if (filters.colors.length && !filters.colors.includes(getColorGroup(product.color))) return false;
    if (filters.hardware === "steel" && !product.hardwareMaterial.toLocaleLowerCase("ru").includes("нержав")) return false;
    if (filters.clasp === "yes" && !product.hasClasp) return false;
    if (filters.clasp === "no" && product.hasClasp) return false;
    return true;
  });

  products.sort((a, b) => {
    switch (state.sort) {
      case "price-asc": return a.price - b.price;
      case "price-desc": return b.price - a.price;
      case "name": return a.name.localeCompare(b.name, "ru");
      default:
        return Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name, "ru");
    }
  });

  return products;
}


function getPriceBounds() {
  const prices = state.products.map(product => Number(product.price) || 0);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 1000;
  const min = Math.floor(minPrice / 100) * 100;
  const max = Math.ceil(maxPrice / 100) * 100;
  return { min, max: Math.max(max, min + 1000) };
}

function getColorGroup(color = "") {
  const value = color.toLocaleLowerCase("ru");
  if (/зел|олив|мят/.test(value)) return "green";
  if (/голуб|син|бирюз/.test(value)) return "blue";
  if (/фиолет|сирен/.test(value)) return "purple";
  if (/золот|жёлт|прозрач/.test(value)) return "gold";
  if (/мульти|разноцвет/.test(value)) return "multi";
  return "dark";
}

const PRICE_GRAPH_BASE = [18, 28, 42, 62, 84, 104, 118, 128, 116, 98, 88, 72, 58, 48, 39, 31, 25, 20];
let priceGraphFrame = 0;
let currentGraphY = [];

function graphPointsForRange(minValue, maxValue) {
  const bounds = getPriceBounds();
  const span = bounds.max - bounds.min || 1;
  return PRICE_GRAPH_BASE.map((height, index) => {
    const ratio = index / (PRICE_GRAPH_BASE.length - 1);
    const price = bounds.min + ratio * span;
    const selected = price >= minValue && price <= maxValue;
    const edgeDistance = Math.min(Math.abs(price - minValue), Math.abs(price - maxValue)) / span;
    const pulse = selected ? 1 + Math.max(0, .12 - edgeDistance) * 1.8 : .34;
    return 140 - Math.min(126, height * pulse);
  });
}

function drawPriceGraph(yValues) {
  if (!els.priceLine || !els.priceAreaPath || !els.pricePoints) return;
  const width = 600;
  const step = width / (yValues.length - 1);
  const points = yValues.map((y, index) => `${(index * step).toFixed(1)},${y.toFixed(1)}`).join(" ");
  els.priceLine.setAttribute("points", points);
  els.priceAreaPath.setAttribute("d", `M 0 145 L ${points.replaceAll(" ", " L ")} L 600 145 Z`);
  els.pricePoints.innerHTML = yValues.map((y, index) => `<circle cx="${(index * step).toFixed(1)}" cy="${y.toFixed(1)}" r="${index % 2 ? 2.3 : 3.2}"></circle>`).join("");
}

function animatePriceGraph(minValue, maxValue) {
  cancelAnimationFrame(priceGraphFrame);
  const target = graphPointsForRange(minValue, maxValue);
  if (!currentGraphY.length) currentGraphY = [...target];
  const start = [...currentGraphY];
  const startedAt = performance.now();
  const duration = 380;
  const tick = now => {
    const t = Math.min(1, (now - startedAt) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    currentGraphY = start.map((value, index) => value + (target[index] - value) * eased);
    drawPriceGraph(currentGraphY);
    if (t < 1) priceGraphFrame = requestAnimationFrame(tick);
  };
  priceGraphFrame = requestAnimationFrame(tick);
}

function countAdvancedFilterResults(draft) {
  return state.products.filter(product => {
    if (product.price < draft.priceMin || product.price > draft.priceMax) return false;
    if (draft.colors.length && !draft.colors.includes(getColorGroup(product.color))) return false;
    if (draft.hardware === "steel" && !product.hardwareMaterial.toLocaleLowerCase("ru").includes("нержав")) return false;
    if (draft.clasp === "yes" && !product.hasClasp) return false;
    if (draft.clasp === "no" && product.hasClasp) return false;
    return true;
  }).length;
}

function readFilterDraft() {
  return {
    priceMin: Number(els.priceMinRange.value),
    priceMax: Number(els.priceMaxRange.value),
    colors: [...els.filterForm.querySelectorAll('input[name="color"]:checked')].map(input => input.value),
    hardware: els.filterForm.querySelector('input[name="hardware"]:checked')?.value || "all",
    clasp: els.filterForm.querySelector('input[name="clasp"]:checked')?.value || "all"
  };
}

function updateFilterPreview(source = "range") {
  const bounds = getPriceBounds();
  let minValue = Number(source === "min-input" ? els.priceMinInput.value : els.priceMinRange.value);
  let maxValue = Number(source === "max-input" ? els.priceMaxInput.value : els.priceMaxRange.value);
  minValue = Math.max(bounds.min, Math.min(minValue || bounds.min, bounds.max - 100));
  maxValue = Math.min(bounds.max, Math.max(maxValue || bounds.max, bounds.min + 100));
  if (minValue > maxValue - 100) {
    if (source.includes("min")) minValue = maxValue - 100;
    else maxValue = minValue + 100;
  }
  els.priceMinRange.value = minValue;
  els.priceMaxRange.value = maxValue;
  els.priceMinInput.value = minValue;
  els.priceMaxInput.value = maxValue;
  const left = ((minValue - bounds.min) / (bounds.max - bounds.min)) * 100;
  const right = 100 - ((maxValue - bounds.min) / (bounds.max - bounds.min)) * 100;
  els.rangeFill.style.left = `${left}%`;
  els.rangeFill.style.right = `${right}%`;
  els.selectedRangeLabel.textContent = `${formatPrice(minValue)} — ${formatPrice(maxValue)}`;
  const draft = readFilterDraft();
  els.filterResultCount.textContent = countAdvancedFilterResults(draft);
  animatePriceGraph(minValue, maxValue);
}

function syncFilterFormFromState() {
  const bounds = getPriceBounds();
  const minValue = Number.isFinite(state.advancedFilters.priceMin) ? state.advancedFilters.priceMin : bounds.min;
  const maxValue = Number.isFinite(state.advancedFilters.priceMax) ? state.advancedFilters.priceMax : bounds.max;
  [els.priceMinRange, els.priceMaxRange, els.priceMinInput, els.priceMaxInput].forEach(input => {
    input.min = bounds.min; input.max = bounds.max; input.step = 100;
  });
  els.priceMinRange.value = minValue;
  els.priceMaxRange.value = maxValue;
  els.priceMinInput.value = minValue;
  els.priceMaxInput.value = maxValue;
  els.filterForm.querySelectorAll('input[name="color"]').forEach(input => { input.checked = state.advancedFilters.colors.includes(input.value); });
  const hardware = els.filterForm.querySelector(`input[name="hardware"][value="${state.advancedFilters.hardware}"]`);
  const clasp = els.filterForm.querySelector(`input[name="clasp"][value="${state.advancedFilters.clasp}"]`);
  if (hardware) hardware.checked = true;
  if (clasp) clasp.checked = true;
  const average = state.products.reduce((sum, product) => sum + product.price, 0) / Math.max(1, state.products.length);
  els.averagePriceLabel.textContent = formatPrice(Math.round(average / 10) * 10);
  updateFilterPreview();
}

function updateActiveFilterCount() {
  const bounds = getPriceBounds();
  const filters = state.advancedFilters;
  let count = filters.colors.length;
  if (filters.priceMin > bounds.min || filters.priceMax < bounds.max) count += 1;
  if (filters.hardware !== "all") count += 1;
  if (filters.clasp !== "all") count += 1;
  els.activeFilterCount.textContent = count;
  els.activeFilterCount.hidden = count === 0;
  els.filterOpenButton.classList.toggle("is-active", count > 0);
}

function resetAdvancedFilters() {
  const bounds = getPriceBounds();
  state.advancedFilters = { priceMin: bounds.min, priceMax: bounds.max, colors: [], hardware: "all", clasp: "all" };
  syncFilterFormFromState();
}

function openFilterDialog() {
  syncFilterFormFromState();
  els.filterDialog.showModal();
  refreshIcons();
}

function productCardTemplate(product) {
  const isFavorite = state.favorites.has(product.id);
  const stockText = product.stock > 0 ? `В наличии: ${product.stock}` : "Под заказ";

  return `
    <article class="product-card reveal is-visible" data-product-id="${escapeHtml(product.id)}">
      <div class="product-card__media open-product" role="button" tabindex="0" aria-label="Открыть ${escapeHtml(product.name)}">
        <span class="product-card__badge badge">${escapeHtml(product.badge)}</span>
        <button class="product-card__favorite ${isFavorite ? "is-active" : ""}" type="button" data-action="favorite" aria-label="${isFavorite ? "Удалить из избранного" : "Добавить в избранное"}">
          <i data-lucide="heart"></i>
        </button>
        <img src="${escapeHtml(product.image)}" alt="Браслет ${escapeHtml(product.name)}" loading="lazy">
      </div>
      <div class="product-card__content">
        <p class="product-card__meta">${escapeHtml(product.material)}</p>
        <h3>${escapeHtml(product.name)}</h3>
        <p class="product-card__description">${escapeHtml(product.description)}</p>
        <div class="product-card__footer">
          <div>
            <strong class="product-card__price">${formatPrice(product.price)}</strong>
            <p class="product-card__stock">${stockText}</p>
          </div>
          <div class="product-card__actions">
            <button class="open-product" type="button">Подробнее</button>
            <button class="add-to-cart" type="button" data-action="cart" aria-label="Добавить ${escapeHtml(product.name)} в корзину"><i data-lucide="shopping-bag"></i></button>
          </div>
        </div>
      </div>
    </article>`;
}

function renderProducts() {
  const products = getVisibleProducts();
  els.productGrid.innerHTML = products.map(productCardTemplate).join("");
  els.emptyState.hidden = products.length > 0;
  refreshIcons();
}

function setFeaturedProduct() {
  const product = state.products.find(item => item.featured) || state.products[0];
  if (!product) return;

  els.featuredName.textContent = product.name;
  els.featuredPrice.textContent = formatPrice(product.price);
  els.featuredImage.src = product.image;
  els.featuredImage.alt = product.name;
  els.heroImage.src = product.image;
  els.heroImage.alt = `Браслет ${product.name} Litops Atelier`;

  document.querySelectorAll("#featuredCard [data-product-id]").forEach(button => {
    button.dataset.productId = product.id;
  });

  const favoriteButton = document.querySelector("#featuredCard .favorite-toggle");
  favoriteButton?.classList.toggle("is-active", state.favorites.has(product.id));
}

function updateCartSummary() {
  const entries = Object.entries(state.cart).filter(([id, quantity]) => getProduct(id) && quantity > 0);
  const count = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
  const total = entries.reduce((sum, [id, quantity]) => sum + getProduct(id).price * quantity, 0);

  els.cartCount.textContent = count;
  els.cartSummary.textContent = formatPrice(total);
  els.cartTotal.textContent = formatPrice(total);
}

function renderCart() {
  const entries = Object.entries(state.cart).filter(([id, quantity]) => getProduct(id) && quantity > 0);

  if (!entries.length) {
    els.cartItems.innerHTML = `<div class="drawer-empty"><i data-lucide="shopping-bag"></i><p>В корзине пока нет изделий.</p></div>`;
    updateCartSummary();
    refreshIcons();
    return;
  }

  els.cartItems.innerHTML = entries.map(([id, quantity]) => {
    const product = getProduct(id);
    return `
      <article class="drawer-item" data-product-id="${escapeHtml(id)}">
        <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">
        <div>
          <h3>${escapeHtml(product.name)}</h3>
          <p>${escapeHtml(product.material)}</p>
          <strong>${formatPrice(product.price * quantity)}</strong>
        </div>
        <div class="drawer-item__controls">
          <button type="button" data-cart-action="remove" aria-label="Удалить"><i data-lucide="trash-2"></i></button>
          <div class="quantity-control">
            <button type="button" data-cart-action="decrease" aria-label="Уменьшить">−</button>
            <span>${quantity}</span>
            <button type="button" data-cart-action="increase" aria-label="Увеличить">+</button>
          </div>
        </div>
      </article>`;
  }).join("");

  updateCartSummary();
  refreshIcons();
}

function updateFavoritesSummary() {
  els.favoriteCount.textContent = state.favorites.size;
}

function renderFavorites() {
  const products = state.products.filter(product => state.favorites.has(product.id));

  if (!products.length) {
    els.favoriteItems.innerHTML = `<div class="drawer-empty"><i data-lucide="heart"></i><p>Добавляйте изделия, чтобы вернуться к ним позже.</p></div>`;
    updateFavoritesSummary();
    refreshIcons();
    return;
  }

  els.favoriteItems.innerHTML = products.map(product => `
    <article class="drawer-item" data-product-id="${escapeHtml(product.id)}">
      <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">
      <div>
        <h3>${escapeHtml(product.name)}</h3>
        <p>${escapeHtml(product.material)}</p>
        <strong>${formatPrice(product.price)}</strong>
      </div>
      <div class="drawer-item__controls">
        <button type="button" data-favorite-action="remove" aria-label="Удалить из избранного"><i data-lucide="heart-off"></i></button>
        <button type="button" data-favorite-action="cart" aria-label="Добавить в корзину"><i data-lucide="shopping-bag"></i></button>
      </div>
    </article>`).join("");

  updateFavoritesSummary();
  refreshIcons();
}

function addToCart(id, quantity = 1) {
  const product = getProduct(id);
  if (!product) return;

  state.cart[id] = Math.max(0, Number(state.cart[id]) || 0) + quantity;
  saveJson(STORAGE_KEYS.cart, state.cart);
  renderCart();
  showToast(`${product.name} добавлен в корзину`);
}

function changeCartQuantity(id, delta) {
  if (!state.cart[id]) return;
  state.cart[id] += delta;
  if (state.cart[id] <= 0) delete state.cart[id];
  saveJson(STORAGE_KEYS.cart, state.cart);
  renderCart();
}

function toggleFavorite(id, force) {
  const product = getProduct(id);
  if (!product) return;

  const shouldAdd = typeof force === "boolean" ? force : !state.favorites.has(id);
  if (shouldAdd) state.favorites.add(id);
  else state.favorites.delete(id);

  saveJson(STORAGE_KEYS.favorites, [...state.favorites]);
  renderProducts();
  renderFavorites();
  setFeaturedProduct();
  showToast(shouldAdd ? `${product.name} добавлен в избранное` : `${product.name} удалён из избранного`);
}

function openDrawer(drawer) {
  closeAllDrawers(false);
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  els.drawerBackdrop.classList.add("is-visible");
  document.body.classList.add("is-locked");
}

function closeAllDrawers(unlock = true) {
  [els.cartDrawer, els.favoritesDrawer].forEach(drawer => {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
  });
  els.drawerBackdrop.classList.remove("is-visible");
  if (unlock) document.body.classList.remove("is-locked");
}

function openProductDialog(id) {
  const product = getProduct(id);
  if (!product) return;

  els.dialogImage.src = product.image;
  els.dialogImage.alt = product.name;
  els.dialogName.textContent = product.name;
  els.dialogMaterial.textContent = product.material;
  els.dialogDescription.textContent = product.description;
  els.dialogPrice.textContent = formatPrice(product.price);
  els.dialogAddToCart.dataset.productId = product.id;
  const facts = [
    ["palette", `Цвет: ${product.color}`],
    ["badge-check", product.hardwareMaterial],
    [product.hasClasp ? "lock-keyhole" : "circle-slash", product.hasClasp ? "С замком" : "Без замка"],
    ["package-check", product.packageContents.join(", ")]
  ];
  els.dialogFacts.innerHTML = facts.map(([icon, text]) => `<span><i data-lucide="${icon}"></i> ${escapeHtml(text)}</span>`).join("");
  const specs = [
    ["Страна изготовления браслета", product.braceletCountry],
    ["Страна происхождения камня", product.stoneCountry],
    ["Материал фурнитуры", product.hardwareMaterial],
    ["Комплектация", product.packageContents.join(", ")]
  ];
  els.dialogSpecs.innerHTML = specs.map(([term, value]) => `<div><dt>${escapeHtml(term)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("");
  els.productDialog.showModal();
  refreshIcons();
}

function closeDialogOnBackdrop(event) {
  if (event.target === event.currentTarget) event.currentTarget.close();
}

function openSearch() {
  els.searchPanel.classList.add("is-open");
  els.searchPanel.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");
  renderSearchResults("");
  requestAnimationFrame(() => els.searchInput.focus());
}

function closeSearch() {
  els.searchPanel.classList.remove("is-open");
  els.searchPanel.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-locked");
}

function renderSearchResults(query) {
  const normalized = query.trim().toLocaleLowerCase("ru");
  const products = state.products.filter(product => !normalized ||
    `${product.name} ${product.material} ${product.description}`.toLocaleLowerCase("ru").includes(normalized)
  ).slice(0, 8);

  els.searchResults.innerHTML = products.length
    ? products.map(product => `
      <article class="search-result" data-product-id="${escapeHtml(product.id)}" tabindex="0">
        <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">
        <div><h3>${escapeHtml(product.name)}</h3><p>${formatPrice(product.price)}</p></div>
      </article>`).join("")
    : `<div class="drawer-empty"><p>Ничего не найдено.</p></div>`;
}

function submitCustomOrder(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  const orders = loadJson(STORAGE_KEYS.orders, []);
  orders.unshift({
    id: `request-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "Новая",
    ...data
  });
  saveJson(STORAGE_KEYS.orders, orders);

  els.orderFormStatus.textContent = "Заявка сохранена. Она уже отображается в демо-панели администратора.";
  event.currentTarget.reset();
  showToast("Заявка на индивидуальный заказ сохранена");
  setTimeout(() => {
    els.orderDialog.close();
    els.orderFormStatus.textContent = "";
  }, 1700);
}

function submitNewsletter(event) {
  event.preventDefault();
  const email = new FormData(event.currentTarget).get("email").trim().toLowerCase();
  const subscribers = loadJson(STORAGE_KEYS.subscribers, []);
  if (!subscribers.includes(email)) subscribers.push(email);
  saveJson(STORAGE_KEYS.subscribers, subscribers);
  els.newsletterMessage.textContent = "Спасибо! Адрес сохранён в демо-базе браузера.";
  event.currentTarget.reset();
}

function showToast(message) {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("is-visible");
  toastTimer = setTimeout(() => els.toast.classList.remove("is-visible"), 2600);
}

function setupReveal() {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion || !("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach(item => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach(item => observer.observe(item));
}

function bindEvents() {
  window.addEventListener("scroll", () => {
    els.siteHeader.classList.toggle("is-scrolled", window.scrollY > 28);
  }, { passive: true });

  window.addEventListener("storage", event => {
    if (event.key === STORAGE_KEYS.products) {
      state.products = loadJson(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
      normalizeProducts();
      renderProducts();
      renderCart();
      renderFavorites();
      setFeaturedProduct();
    }
  });

  els.menuButton.addEventListener("click", () => {
    const open = els.mainNav.classList.toggle("is-open");
    els.menuButton.setAttribute("aria-expanded", String(open));
  });

  els.mainNav.addEventListener("click", event => {
    if (event.target.closest("a")) {
      els.mainNav.classList.remove("is-open");
      els.menuButton.setAttribute("aria-expanded", "false");
    }
  });

  els.categoryBar.addEventListener("click", event => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    state.filter = button.dataset.filter;
    els.categoryBar.querySelectorAll("[data-filter]").forEach(item => item.classList.toggle("is-active", item === button));
    renderProducts();
  });

  els.sortSelect.addEventListener("change", event => {
    state.sort = event.target.value;
    renderProducts();
  });

  els.productGrid.addEventListener("click", event => {
    const card = event.target.closest(".product-card");
    if (!card) return;
    const id = card.dataset.productId;

    if (event.target.closest('[data-action="favorite"]')) toggleFavorite(id);
    else if (event.target.closest('[data-action="cart"]')) addToCart(id);
    else if (event.target.closest(".open-product")) openProductDialog(id);
  });

  els.productGrid.addEventListener("keydown", event => {
    if ((event.key === "Enter" || event.key === " ") && event.target.classList.contains("open-product")) {
      event.preventDefault();
      openProductDialog(event.target.closest(".product-card").dataset.productId);
    }
  });

  document.getElementById("featuredCard").addEventListener("click", event => {
    const favoriteButton = event.target.closest(".favorite-toggle");
    const cartButton = event.target.closest(".add-to-cart");
    if (favoriteButton) toggleFavorite(favoriteButton.dataset.productId);
    if (cartButton) addToCart(cartButton.dataset.productId);
  });

  els.cartButton.addEventListener("click", () => { renderCart(); openDrawer(els.cartDrawer); });
  els.favoritesButton.addEventListener("click", () => { renderFavorites(); openDrawer(els.favoritesDrawer); });
  els.drawerBackdrop.addEventListener("click", () => closeAllDrawers());
  document.querySelectorAll("[data-close-drawer]").forEach(button => button.addEventListener("click", () => closeAllDrawers()));

  els.cartItems.addEventListener("click", event => {
    const item = event.target.closest(".drawer-item");
    const action = event.target.closest("[data-cart-action]")?.dataset.cartAction;
    if (!item || !action) return;
    const id = item.dataset.productId;
    if (action === "increase") changeCartQuantity(id, 1);
    if (action === "decrease") changeCartQuantity(id, -1);
    if (action === "remove") { delete state.cart[id]; saveJson(STORAGE_KEYS.cart, state.cart); renderCart(); }
  });

  els.favoriteItems.addEventListener("click", event => {
    const item = event.target.closest(".drawer-item");
    const action = event.target.closest("[data-favorite-action]")?.dataset.favoriteAction;
    if (!item || !action) return;
    if (action === "remove") toggleFavorite(item.dataset.productId, false);
    if (action === "cart") addToCart(item.dataset.productId);
  });

  els.searchButton.addEventListener("click", openSearch);
  els.searchClose.addEventListener("click", closeSearch);
  els.searchInput.addEventListener("input", event => renderSearchResults(event.target.value));
  els.searchResults.addEventListener("click", event => {
    const result = event.target.closest(".search-result");
    if (!result) return;
    closeSearch();
    openProductDialog(result.dataset.productId);
  });

  els.filterOpenButton.addEventListener("click", openFilterDialog);
  els.filterCloseButton.addEventListener("click", () => els.filterDialog.close());
  els.filterDialog.addEventListener("click", closeDialogOnBackdrop);
  els.priceMinRange.addEventListener("input", () => updateFilterPreview("min-range"));
  els.priceMaxRange.addEventListener("input", () => updateFilterPreview("max-range"));
  els.priceMinInput.addEventListener("input", () => updateFilterPreview("min-input"));
  els.priceMaxInput.addEventListener("input", () => updateFilterPreview("max-input"));
  els.filterForm.addEventListener("change", event => {
    if (!event.target.matches('input[type="range"], input[type="number"]')) updateFilterPreview();
  });
  els.filterResetButton.addEventListener("click", () => {
    resetAdvancedFilters();
    updateFilterPreview();
  });
  els.filterForm.addEventListener("submit", event => {
    event.preventDefault();
    state.advancedFilters = readFilterDraft();
    updateActiveFilterCount();
    renderProducts();
    els.filterDialog.close();
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  els.dialogClose.addEventListener("click", () => els.productDialog.close());
  els.productDialog.addEventListener("click", closeDialogOnBackdrop);
  els.dialogAddToCart.addEventListener("click", event => addToCart(event.currentTarget.dataset.productId));

  els.customOrderButton.addEventListener("click", () => els.orderDialog.showModal());
  els.orderDialogClose.addEventListener("click", () => els.orderDialog.close());
  els.orderDialog.addEventListener("click", closeDialogOnBackdrop);
  els.customOrderForm.addEventListener("submit", submitCustomOrder);
  els.newsletterForm.addEventListener("submit", submitNewsletter);

  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    closeAllDrawers();
    closeSearch();
    els.mainNav.classList.remove("is-open");
  });
}

function init() {
  const announcementTrack = document.querySelector(".announcement__track");
  if (announcementTrack && !announcementTrack.dataset.loopReady) {
    announcementTrack.innerHTML += announcementTrack.innerHTML;
    announcementTrack.dataset.loopReady = "true";
  }
  cacheElements();
  normalizeProducts();
  const priceBounds = getPriceBounds();
  if (!Number.isFinite(state.advancedFilters.priceMax)) state.advancedFilters.priceMax = priceBounds.max;
  state.advancedFilters.priceMin = Math.max(priceBounds.min, state.advancedFilters.priceMin);
  state.advancedFilters.priceMax = Math.min(priceBounds.max, state.advancedFilters.priceMax);
  renderProducts();
  renderCart();
  renderFavorites();
  setFeaturedProduct();
  bindEvents();
  updateActiveFilterCount();
  setupReveal();
  refreshIcons();
}

document.addEventListener("DOMContentLoaded", init);
