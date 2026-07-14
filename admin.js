"use strict";

const STORAGE_KEYS = {
  products: "litopsProductsV1",
  orders: "litopsCustomOrdersV1",
  subscribers: "litopsSubscribersV1"
};

const DEFAULT_PRODUCTS = [
  { id: "prehnite", name: "Пренит", material: "Натуральный пренит · нержавеющая сталь", description: "Полупрозрачный зелёный минерал с мягким природным свечением. Спокойный акцент для повседневных образов.", price: 5490, image: "assets/products/prehnite.webp", categories: ["light", "rare", "steel", "gift"], badge: "Выбор мастера", stock: 8, featured: true, color: "Светло-зелёный", hardwareMaterial: "Нержавеющая сталь высокого качества", hasClasp: false, braceletCountry: "Россия", stoneCountry: "Китай", packageContents: ["Бирка", "Мешочек для хранения", "Браслет"], gallery: [] },
  { id: "tourmaline", name: "Турмалин", material: "Натуральный турмалин · нержавеющая сталь", description: "Живое сочетание розовых, зелёных и золотистых оттенков. Каждый браслет имеет уникальную палитру.", price: 4890, image: "assets/products/tourmaline.webp", categories: ["color", "rare", "steel", "gift"], badge: "Новинка", stock: 6, featured: true, color: "Мультиколор", hardwareMaterial: "Нержавеющая сталь высокого качества", hasClasp: false, braceletCountry: "Россия", stoneCountry: "Бразилия", packageContents: ["Бирка", "Мешочек для хранения", "Браслет"], gallery: [] },
  { id: "rutilated-quartz", name: "Кварц рутиловый", material: "Натуральный кварц · нержавеющая сталь", description: "Прозрачный кварц с золотистыми иглами рутила. Выразительная фактура, созданная самой природой.", price: 4690, image: "assets/products/rutilated-quartz.webp", categories: ["light", "rare", "steel", "gift"], badge: "Редкий камень", stock: 5, featured: true, color: "Золотисто-прозрачный", hardwareMaterial: "Нержавеющая сталь высокого качества", hasClasp: false, braceletCountry: "Россия", stoneCountry: "Бразилия", packageContents: ["Бирка", "Мешочек для хранения", "Браслет"], gallery: [] },
  { id: "larimar", name: "Ларимар", material: "Натуральный ларимар · нержавеющая сталь", description: "Небесно-голубой минерал с облачным рисунком. Лёгкий и чистый оттенок для спокойных сочетаний.", price: 6290, image: "assets/products/larimar.webp", categories: ["light", "color", "rare", "steel", "gift"], badge: "Хит", stock: 4, featured: true, color: "Небесно-голубой", hardwareMaterial: "Нержавеющая сталь высокого качества", hasClasp: false, braceletCountry: "Россия", stoneCountry: "Доминиканская Республика", packageContents: ["Бирка", "Мешочек для хранения", "Браслет"], gallery: [] },
  { id: "labradorite", name: "Лабрадор", material: "Натуральный лабрадорит · нержавеющая сталь", description: "Серый камень с синими, зелёными и золотистыми переливами, которые раскрываются при движении.", price: 6790, image: "assets/products/labradorite.webp", categories: ["color", "rare", "steel", "gift"], badge: "Бестселлер", stock: 7, featured: true, color: "Серо-синий", hardwareMaterial: "Нержавеющая сталь высокого качества", hasClasp: false, braceletCountry: "Россия", stoneCountry: "Мадагаскар", packageContents: ["Бирка", "Мешочек для хранения", "Браслет"], gallery: [] },
  { id: "charoite", name: "Чароит", material: "Натуральный чароит · нержавеющая сталь", description: "Глубокий фиолетовый минерал с волокнистым рисунком. Яркий самостоятельный акцент.", price: 5990, image: "assets/products/charoite.webp", categories: ["color", "rare", "steel", "gift"], badge: "Новинка", stock: 5, featured: true, color: "Фиолетовый", hardwareMaterial: "Нержавеющая сталь высокого качества", hasClasp: false, braceletCountry: "Россия", stoneCountry: "Россия", packageContents: ["Бирка", "Мешочек для хранения", "Браслет"], gallery: [] }
];

const CATEGORY_LABELS = {
  light: "Светлые",
  color: "Цветные",
  rare: "Редкие",
  steel: "Нержавеющая сталь",
  gift: "Подарок"
};

const state = {
  products: loadJson(STORAGE_KEYS.products, DEFAULT_PRODUCTS),
  orders: loadJson(STORAGE_KEYS.orders, []),
  productSearch: "",
  currentSection: "overview",
  confirmAction: null,
  editorImages: []
};

const els = {};
let toastTimer;

function loadJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : structuredClone(fallback);
  } catch (error) {
    console.warn(`Ошибка чтения ${key}`, error);
    return structuredClone(fallback);
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
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
    "adminSidebar", "sidebarToggle", "adminNav", "pageTitle", "navProductCount", "navOrderCount", "metricProducts",
    "metricValue", "metricStock", "metricOrders", "recentProducts", "productTableBody", "productTableEmpty",
    "productSearch", "addProductButton", "orderList", "orderEmpty", "clearOrdersButton", "resetCatalogButton",
    "exportButton", "settingsExportButton", "importInput", "productEditor", "editorClose", "editorCancel", "editorTitle",
    "productForm", "editorStatus", "imageDropZone", "imageFileInput", "imagePreview", "confirmModal", "confirmTitle", "confirmText", "confirmCancel", "confirmAccept", "adminToast"
  ].forEach(id => { els[id] = document.getElementById(id); });
}

function normalizeState() {
  if (!Array.isArray(state.products) || !state.products.length) state.products = structuredClone(DEFAULT_PRODUCTS);
  if (!Array.isArray(state.orders)) state.orders = [];

  state.products = state.products.map((product, index) => ({
    id: String(product.id || `product-${index + 1}`).toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-"),
    name: product.name || "Без названия",
    material: product.material || "Натуральный камень",
    description: product.description || "Браслет ручной работы Litops Atelier.",
    price: Math.max(0, Number(product.price) || 0),
    stock: Math.max(0, Number(product.stock) || 0),
    image: product.image || "assets/products/prehnite.webp",
    badge: product.badge || "Ручная работа",
    categories: Array.isArray(product.categories) ? product.categories.filter(item => CATEGORY_LABELS[item]) : ["steel", "gift"],
    featured: Boolean(product.featured),
    color: product.color || "Не указан",
    hardwareMaterial: product.hardwareMaterial || "Нержавеющая сталь высокого качества",
    hasClasp: Boolean(product.hasClasp),
    braceletCountry: product.braceletCountry || "Россия",
    stoneCountry: product.stoneCountry || "Не указана",
    packageContents: Array.isArray(product.packageContents) ? product.packageContents : ["Бирка", "Мешочек для хранения", "Браслет"],
    gallery: Array.isArray(product.gallery) ? product.gallery : []
  }));

  saveJson(STORAGE_KEYS.products, state.products);
  saveJson(STORAGE_KEYS.orders, state.orders);
}

function showSection(section) {
  state.currentSection = section;
  const titleMap = { overview: "Обзор", products: "Товары", orders: "Заявки", settings: "Настройки" };
  els.pageTitle.textContent = titleMap[section] || "Панель управления";

  document.querySelectorAll("[data-section-panel]").forEach(panel => {
    panel.classList.toggle("is-active", panel.dataset.sectionPanel === section);
  });
  els.adminNav.querySelectorAll("[data-section]").forEach(button => {
    button.classList.toggle("is-active", button.dataset.section === section);
  });

  els.adminSidebar.classList.remove("is-open");
  if (section === "products") renderProductsTable();
  if (section === "orders") renderOrders();
}

function renderMetrics() {
  const totalValue = state.products.reduce((sum, product) => sum + product.price, 0);
  const totalStock = state.products.reduce((sum, product) => sum + product.stock, 0);
  const newOrders = state.orders.filter(order => order.status === "Новая" || !order.status).length;

  els.metricProducts.textContent = state.products.length;
  els.metricValue.textContent = formatPrice(totalValue);
  els.metricStock.textContent = totalStock;
  els.metricOrders.textContent = newOrders;
  els.navProductCount.textContent = state.products.length;
  els.navOrderCount.textContent = newOrders;
}

function renderRecentProducts() {
  const products = state.products.slice(-5).reverse();
  els.recentProducts.innerHTML = products.map(product => `
    <article class="recent-item">
      <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">
      <div><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.material)}</p></div>
      <strong>${formatPrice(product.price)}</strong>
    </article>`).join("");
}

function filteredProducts() {
  const query = state.productSearch.trim().toLocaleLowerCase("ru");
  if (!query) return state.products;
  return state.products.filter(product => `${product.name} ${product.material} ${product.id}`.toLocaleLowerCase("ru").includes(query));
}

function renderProductsTable() {
  const products = filteredProducts();
  els.productTableEmpty.hidden = products.length > 0;

  els.productTableBody.innerHTML = products.map(product => `
    <tr data-product-id="${escapeHtml(product.id)}">
      <td>
        <div class="product-cell">
          <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">
          <div><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.material)}</p></div>
        </div>
      </td>
      <td><strong>${formatPrice(product.price)}</strong></td>
      <td><span class="stock-badge ${product.stock === 0 ? "is-empty" : ""}">${product.stock === 0 ? "Под заказ" : product.stock + " шт."}</span></td>
      <td><div class="category-tags">${product.categories.map(category => `<span class="category-tag">${CATEGORY_LABELS[category] || escapeHtml(category)}</span>`).join("")}</div></td>
      <td><span class="status-badge">${product.featured ? "В витрине" : "Обычный"}</span></td>
      <td><div class="row-actions">
        <button type="button" data-action="edit" title="Редактировать"><i data-lucide="pencil"></i></button>
        <button type="button" data-action="duplicate" title="Дублировать"><i data-lucide="copy"></i></button>
        <button type="button" data-action="delete" title="Удалить"><i data-lucide="trash-2"></i></button>
      </div></td>
    </tr>`).join("");

  refreshIcons();
}

function renderOrders() {
  els.orderEmpty.hidden = state.orders.length > 0;
  els.orderList.innerHTML = state.orders.map(order => {
    const date = order.createdAt ? new Date(order.createdAt) : new Date();
    const formattedDate = new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short" }).format(date);
    const status = order.status || "Новая";

    return `
      <article class="order-card" data-order-id="${escapeHtml(order.id)}">
        <div>
          <div class="order-card__top"><h3>${escapeHtml(order.name || "Без имени")}</h3><time>${formattedDate}</time></div>
          <div class="order-card__details">
            <div><span>Контакт</span><p>${escapeHtml(order.contact || "Не указан")}</p></div>
            <div><span>Запястье</span><p>${escapeHtml(order.wrist || "Не указано")}</p></div>
            <div><span>Статус</span><p>${escapeHtml(status)}</p></div>
            <div class="order-message"><span>Пожелания</span><p>${escapeHtml(order.message || "Без дополнительных пожеланий")}</p></div>
          </div>
        </div>
        <div class="order-card__actions">
          <select data-order-status aria-label="Статус заявки">
            ${["Новая", "В работе", "Выполнена", "Отменена"].map(item => `<option value="${item}" ${item === status ? "selected" : ""}>${item}</option>`).join("")}
          </select>
          <button type="button" data-order-action="delete" aria-label="Удалить заявку"><i data-lucide="trash-2"></i></button>
        </div>
      </article>`;
  }).join("");

  refreshIcons();
}

function openProductEditor(product = null) {
  const form = els.productForm;
  form.reset();
  els.editorStatus.textContent = "";

  if (product) {
    els.editorTitle.textContent = `Редактирование: ${product.name}`;
    form.elements.originalId.value = product.id;
    form.elements.id.value = product.id;
    form.elements.name.value = product.name;
    form.elements.price.value = product.price;
    form.elements.stock.value = product.stock;
    form.elements.material.value = product.material;
    form.elements.description.value = product.description;
    form.elements.image.value = product.image;
    form.elements.badge.value = product.badge;
    form.elements.featured.checked = product.featured;
    form.elements.color.value = product.color;
    form.elements.hardwareMaterial.value = product.hardwareMaterial;
    form.elements.hasClasp.checked = product.hasClasp;
    form.elements.braceletCountry.value = product.braceletCountry;
    form.elements.stoneCountry.value = product.stoneCountry;
    state.editorImages = [product.image, ...(product.gallery || [])].filter(Boolean);
    form.elements.gallery.value = JSON.stringify(product.gallery || []);
    form.querySelectorAll('input[name="packageContents"]').forEach(input => { input.checked = product.packageContents.includes(input.value); });
    form.querySelectorAll('input[name="categories"]').forEach(input => { input.checked = product.categories.includes(input.value); });
  } else {
    els.editorTitle.textContent = "Новый товар";
    form.elements.originalId.value = "";
    form.elements.stock.value = 1;
    form.elements.price.value = 4990;
    form.elements.material.value = "Натуральный камень";
    form.elements.badge.value = "Новинка";
    form.elements.image.value = "assets/products/prehnite.webp";
    form.elements.color.value = "";
    form.elements.hardwareMaterial.value = "Нержавеющая сталь высокого качества";
    form.elements.braceletCountry.value = "Россия";
    form.elements.stoneCountry.value = "";
    state.editorImages = [form.elements.image.value];
    form.querySelectorAll('input[name="packageContents"]').forEach(input => { input.checked = ["Бирка", "Мешочек для хранения", "Браслет"].includes(input.value); });
    form.querySelector('input[name="categories"][value="steel"]').checked = true;
    form.querySelector('input[name="categories"][value="gift"]').checked = true;
  }

  renderImagePreview();
  els.productEditor.showModal();
  refreshIcons();
}

function saveProductFromForm(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const originalId = data.get("originalId");
  const id = data.get("id").trim().toLowerCase();
  const categories = data.getAll("categories");

  if (!/^[a-z0-9-]+$/.test(id)) {
    els.editorStatus.textContent = "ID может содержать только латинские буквы, цифры и дефисы.";
    return;
  }

  const duplicate = state.products.some(product => product.id === id && product.id !== originalId);
  if (duplicate) {
    els.editorStatus.textContent = "Товар с таким ID уже существует.";
    return;
  }

  const product = {
    id,
    name: data.get("name").trim(),
    price: Math.max(0, Number(data.get("price")) || 0),
    stock: Math.max(0, Number(data.get("stock")) || 0),
    material: data.get("material").trim(),
    description: data.get("description").trim(),
    image: state.editorImages[0] || data.get("image").trim(),
    badge: data.get("badge").trim() || "Ручная работа",
    featured: data.get("featured") === "on",
    categories: categories.length ? categories : ["steel", "gift"],
    color: data.get("color").trim(),
    hardwareMaterial: data.get("hardwareMaterial").trim(),
    hasClasp: data.get("hasClasp") === "on",
    braceletCountry: data.get("braceletCountry").trim(),
    stoneCountry: data.get("stoneCountry").trim(),
    packageContents: data.getAll("packageContents"),
    gallery: state.editorImages.slice(1)
  };

  const index = state.products.findIndex(item => item.id === originalId);
  if (index >= 0) state.products[index] = product;
  else state.products.push(product);

  saveJson(STORAGE_KEYS.products, state.products);
  els.productEditor.close();
  renderAll();
  showToast(index >= 0 ? "Товар обновлён" : "Товар добавлен");
}

function duplicateProduct(id) {
  const original = state.products.find(product => product.id === id);
  if (!original) return;

  let suffix = 2;
  let newId = `${id}-copy`;
  while (state.products.some(product => product.id === newId)) newId = `${id}-copy-${suffix++}`;

  state.products.push({ ...structuredClone(original), id: newId, name: `${original.name} — копия`, featured: false });
  saveJson(STORAGE_KEYS.products, state.products);
  renderAll();
  showToast("Копия товара создана");
}

function requestConfirmation(title, text, action) {
  state.confirmAction = action;
  els.confirmTitle.textContent = title;
  els.confirmText.textContent = text;
  els.confirmModal.classList.add("is-open");
  els.confirmModal.setAttribute("aria-hidden", "false");
}

function closeConfirmation() {
  state.confirmAction = null;
  els.confirmModal.classList.remove("is-open");
  els.confirmModal.setAttribute("aria-hidden", "true");
}

function deleteProduct(id) {
  const product = state.products.find(item => item.id === id);
  if (!product) return;

  requestConfirmation(
    "Удалить товар?",
    `«${product.name}» будет удалён из каталога в этом браузере.`,
    () => {
      state.products = state.products.filter(item => item.id !== id);
      saveJson(STORAGE_KEYS.products, state.products);
      renderAll();
      showToast("Товар удалён");
    }
  );
}

function deleteOrder(id) {
  state.orders = state.orders.filter(order => order.id !== id);
  saveJson(STORAGE_KEYS.orders, state.orders);
  renderAll();
  showToast("Заявка удалена");
}

function exportData() {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    products: state.products,
    orders: state.orders,
    subscribers: loadJson(STORAGE_KEYS.subscribers, [])
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `litops-atelier-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Резервная копия скачана");
}

async function importData(file) {
  if (!file) return;
  try {
    const payload = JSON.parse(await file.text());
    if (!Array.isArray(payload.products)) throw new Error("В файле нет массива products");

    state.products = payload.products;
    state.orders = Array.isArray(payload.orders) ? payload.orders : state.orders;
    if (Array.isArray(payload.subscribers)) saveJson(STORAGE_KEYS.subscribers, payload.subscribers);
    normalizeState();
    renderAll();
    showToast("Данные импортированы");
  } catch (error) {
    showToast(`Ошибка импорта: ${error.message}`);
  } finally {
    els.importInput.value = "";
  }
}

function resetCatalog() {
  requestConfirmation(
    "Восстановить каталог?",
    "Все изменения товаров будут заменены исходными шестью позициями.",
    () => {
      state.products = structuredClone(DEFAULT_PRODUCTS);
      saveJson(STORAGE_KEYS.products, state.products);
      renderAll();
      showToast("Исходный каталог восстановлен");
    }
  );
}

function showToast(message) {
  clearTimeout(toastTimer);
  els.adminToast.textContent = message;
  els.adminToast.classList.add("is-visible");
  toastTimer = setTimeout(() => els.adminToast.classList.remove("is-visible"), 2600);
}

function renderAll() {
  renderMetrics();
  renderRecentProducts();
  renderProductsTable();
  renderOrders();
  refreshIcons();
}

function renderImagePreview() {
  if (!els.imagePreview) return;
  els.imagePreview.innerHTML = state.editorImages.map((src, index) => `
    <div class="upload-preview__item" data-image-index="${index}">
      <img src="${escapeHtml(src)}" alt="Фото товара ${index + 1}">
      <button type="button" data-remove-image aria-label="Удалить фото"><i data-lucide="x"></i></button>
    </div>`).join("");
  const form = els.productForm;
  if (state.editorImages[0]) form.elements.image.value = state.editorImages[0];
  form.elements.gallery.value = JSON.stringify(state.editorImages.slice(1));
  refreshIcons();
}

async function filesToDataUrls(files) {
  const accepted = [...files].filter(file => ["image/jpeg","image/png","image/webp"].includes(file.type) && file.size <= 3 * 1024 * 1024);
  if (!accepted.length) { showToast("Выберите JPG, PNG или WEBP до 3 МБ"); return; }
  const urls = await Promise.all(accepted.map(file => new Promise((resolve, reject) => {
    const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file);
  })));
  state.editorImages.push(...urls);
  renderImagePreview();
  showToast(`Добавлено фотографий: ${urls.length}`);
}

function bindEvents() {
  els.sidebarToggle.addEventListener("click", () => els.adminSidebar.classList.toggle("is-open"));

  els.adminNav.addEventListener("click", event => {
    const button = event.target.closest("[data-section]");
    if (button) showSection(button.dataset.section);
  });

  document.addEventListener("click", event => {
    const goButton = event.target.closest("[data-go-section]");
    if (goButton) showSection(goButton.dataset.goSection);
  });

  els.productSearch.addEventListener("input", event => {
    state.productSearch = event.target.value;
    renderProductsTable();
  });

  els.addProductButton.addEventListener("click", () => openProductEditor());
  els.productTableBody.addEventListener("click", event => {
    const row = event.target.closest("tr[data-product-id]");
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (!row || !action) return;
    const id = row.dataset.productId;
    if (action === "edit") openProductEditor(state.products.find(product => product.id === id));
    if (action === "duplicate") duplicateProduct(id);
    if (action === "delete") deleteProduct(id);
  });

  els.editorClose.addEventListener("click", () => els.productEditor.close());
  els.editorCancel.addEventListener("click", () => els.productEditor.close());
  els.productEditor.addEventListener("click", event => { if (event.target === event.currentTarget) event.currentTarget.close(); });
  els.productForm.addEventListener("submit", saveProductFromForm);
  els.imageDropZone.addEventListener("click", () => els.imageFileInput.click());
  els.imageDropZone.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") els.imageFileInput.click(); });
  els.imageFileInput.addEventListener("change", event => filesToDataUrls(event.target.files));
  ["dragenter", "dragover"].forEach(type => els.imageDropZone.addEventListener(type, event => { event.preventDefault(); els.imageDropZone.classList.add("is-dragging"); }));
  ["dragleave", "drop"].forEach(type => els.imageDropZone.addEventListener(type, event => { event.preventDefault(); els.imageDropZone.classList.remove("is-dragging"); }));
  els.imageDropZone.addEventListener("drop", event => filesToDataUrls(event.dataTransfer.files));
  els.imagePreview.addEventListener("click", event => {
    const button = event.target.closest("[data-remove-image]"); if (!button) return;
    const index = Number(button.closest("[data-image-index]").dataset.imageIndex);
    state.editorImages.splice(index, 1); renderImagePreview();
  });

  els.orderList.addEventListener("change", event => {
    const card = event.target.closest("[data-order-id]");
    if (!card || !event.target.matches("[data-order-status]")) return;
    const order = state.orders.find(item => item.id === card.dataset.orderId);
    if (order) {
      order.status = event.target.value;
      saveJson(STORAGE_KEYS.orders, state.orders);
      renderMetrics();
      renderOrders();
      showToast("Статус заявки обновлён");
    }
  });

  els.orderList.addEventListener("click", event => {
    const card = event.target.closest("[data-order-id]");
    if (!card || !event.target.closest('[data-order-action="delete"]')) return;
    deleteOrder(card.dataset.orderId);
  });

  els.clearOrdersButton.addEventListener("click", () => {
    if (!state.orders.length) return showToast("Список заявок уже пуст");
    requestConfirmation("Очистить заявки?", "Все сохранённые заявки будут удалены из этого браузера.", () => {
      state.orders = [];
      saveJson(STORAGE_KEYS.orders, state.orders);
      renderAll();
      showToast("Заявки очищены");
    });
  });

  els.resetCatalogButton.addEventListener("click", resetCatalog);
  els.exportButton.addEventListener("click", exportData);
  els.settingsExportButton.addEventListener("click", exportData);
  els.importInput.addEventListener("change", event => importData(event.target.files[0]));

  els.confirmCancel.addEventListener("click", closeConfirmation);
  els.confirmAccept.addEventListener("click", () => {
    const action = state.confirmAction;
    closeConfirmation();
    action?.();
  });
  els.confirmModal.addEventListener("click", event => { if (event.target === event.currentTarget) closeConfirmation(); });

  window.addEventListener("storage", event => {
    if (event.key === STORAGE_KEYS.products) state.products = loadJson(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
    if (event.key === STORAGE_KEYS.orders) state.orders = loadJson(STORAGE_KEYS.orders, []);
    normalizeState();
    renderAll();
  });
}

function init() {
  cacheElements();
  normalizeState();
  bindEvents();
  renderAll();
  refreshIcons();
}

document.addEventListener("DOMContentLoaded", init);
