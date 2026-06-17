const menu = [
  {
    id: "latte",
    name: "Velvet Latte",
    category: "Coffee",
    price: 4.5,
    emoji: "☕",
    art: "#f4d8b5",
    description: "Double espresso, steamed milk, and a silky microfoam finish.",
    options: ["Regular", "Oat milk +$0.60", "Vanilla +$0.50", "Iced"],
  },
  {
    id: "cappuccino",
    name: "Classic Cappuccino",
    category: "Coffee",
    price: 4.25,
    emoji: "☕",
    art: "#d9c0a1",
    description: "Bold espresso with airy milk foam and cocoa dust.",
    options: ["Regular", "Extra shot +$1.00", "Almond milk +$0.60"],
  },
  {
    id: "coldbrew",
    name: "Citrus Cold Brew",
    category: "Coffee",
    price: 4.95,
    emoji: "🧊",
    art: "#b7d7d4",
    description: "Slow-steeped coffee served over ice with orange peel.",
    options: ["Regular", "Light ice", "Honey +$0.40"],
  },
  {
    id: "mocha",
    name: "Dark Mocha",
    category: "Coffee",
    price: 5.2,
    emoji: "🍫",
    art: "#caa48c",
    description: "Espresso, dark chocolate, milk, and whipped cream.",
    options: ["Regular", "No whip", "Extra chocolate +$0.50"],
  },
  {
    id: "croissant",
    name: "Butter Croissant",
    category: "Food",
    price: 3.75,
    emoji: "🥐",
    art: "#f3c365",
    description: "Flaky, golden pastry baked fresh this morning.",
    options: ["Warm", "Room temperature", "Jam +$0.50"],
  },
  {
    id: "toast",
    name: "Avocado Toast",
    category: "Food",
    price: 7.8,
    emoji: "🥑",
    art: "#c9df9d",
    description: "Sourdough toast with avocado, herbs, chili, and lemon.",
    options: ["Regular", "Add egg +$1.50", "No chili"],
  },
  {
    id: "bagel",
    name: "Smoked Bagel",
    category: "Food",
    price: 8.5,
    emoji: "🥯",
    art: "#efcf9f",
    description: "Toasted bagel with cream cheese, cucumber, and smoked salmon.",
    options: ["Toasted", "Plain", "Extra cream cheese +$0.80"],
  },
  {
    id: "panini",
    name: "Pesto Panini",
    category: "Food",
    price: 8.25,
    emoji: "🥪",
    art: "#d7b969",
    description: "Grilled focaccia with mozzarella, tomato, basil, and pesto.",
    options: ["Regular", "Extra cheese +$1.00", "No tomato"],
  },
  {
    id: "salad",
    name: "Harvest Bowl",
    category: "Food",
    price: 9.4,
    emoji: "🥗",
    art: "#b8d5a3",
    description: "Greens, roasted vegetables, grains, seeds, and herb dressing.",
    options: ["Regular", "Add chicken +$2.50", "Dressing on side"],
  },
  {
    id: "cheesecake",
    name: "Berry Cheesecake",
    category: "Dessert",
    price: 5.95,
    emoji: "🍰",
    art: "#f3c6cf",
    description: "Creamy cheesecake with berry compote and biscuit crumb.",
    options: ["Regular", "Extra berries +$0.70"],
  },
  {
    id: "cookie",
    name: "Sea Salt Cookie",
    category: "Dessert",
    price: 3.25,
    emoji: "🍪",
    art: "#d7aa74",
    description: "Soft chocolate chip cookie finished with flaky sea salt.",
    options: ["Warm", "Room temperature"],
  },
  {
    id: "brownie",
    name: "Walnut Brownie",
    category: "Dessert",
    price: 4.1,
    emoji: "🟫",
    art: "#bb8a76",
    description: "Fudgy brownie with toasted walnuts and glossy ganache.",
    options: ["Regular", "Warm", "Ice cream +$1.40"],
  },
];

const optionPrices = {
  "Oat milk +$0.60": 0.6,
  "Vanilla +$0.50": 0.5,
  "Extra shot +$1.00": 1,
  "Almond milk +$0.60": 0.6,
  "Honey +$0.40": 0.4,
  "Extra chocolate +$0.50": 0.5,
  "Jam +$0.50": 0.5,
  "Add egg +$1.50": 1.5,
  "Extra cream cheese +$0.80": 0.8,
  "Extra cheese +$1.00": 1,
  "Add chicken +$2.50": 2.5,
  "Extra berries +$0.70": 0.7,
  "Ice cream +$1.40": 1.4,
};

let currentCategory = "All";
let cart = [];

const menuGrid = document.querySelector("#menu-grid");
const menuSummary = document.querySelector("#menu-summary");
const cartItems = document.querySelector("#cart-items");
const cartCount = document.querySelector("#cart-count");
const subtotalEl = document.querySelector("#subtotal");
const taxEl = document.querySelector("#tax");
const totalEl = document.querySelector("#total");
const successEl = document.querySelector("#order-success");

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function optionPrice(option) {
  return optionPrices[option] || 0;
}

function renderMenu() {
  const filtered = currentCategory === "All" ? menu : menu.filter((item) => item.category === currentCategory);

  menuSummary.textContent = `${filtered.length} ${filtered.length === 1 ? "item" : "items"}`;
  menuGrid.innerHTML = filtered
    .map(
      (item) => `
        <article class="menu-card">
          <div class="item-art" style="--art-bg: ${item.art}">
            <span class="item-emoji" aria-hidden="true">${item.emoji}</span>
          </div>
          <div class="item-body">
            <div class="item-title-row">
              <h3>${item.name}</h3>
              <span class="price">${money.format(item.price)}</span>
            </div>
            <p class="description">${item.description}</p>
            <select class="custom-select" aria-label="Customize ${item.name}" data-option-for="${item.id}">
              ${item.options.map((option) => `<option value="${option}">${option}</option>`).join("")}
            </select>
            <button type="button" data-add="${item.id}">Add to cart</button>
          </div>
        </article>
      `
    )
    .join("");
}

function addToCart(itemId, option = null) {
  const item = menu.find((entry) => entry.id === itemId);
  const selectedOption =
    option || document.querySelector(`[data-option-for="${itemId}"]`)?.value || item.options[0];
  const cartId = `${itemId}-${selectedOption}`;
  const existing = cart.find((entry) => entry.cartId === cartId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      cartId,
      itemId,
      name: item.name,
      option: selectedOption,
      unitPrice: item.price + optionPrice(selectedOption),
      qty: 1,
    });
  }

  successEl.classList.remove("show");
  renderCart();
}

function changeQuantity(cartId, direction) {
  const item = cart.find((entry) => entry.cartId === cartId);
  if (!item) return;

  item.qty += direction;
  if (item.qty <= 0) {
    cart = cart.filter((entry) => entry.cartId !== cartId);
  }

  renderCart();
}

function renderCart() {
  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  const quantity = cart.reduce((sum, item) => sum + item.qty, 0);

  cartCount.textContent = quantity;
  subtotalEl.textContent = money.format(subtotal);
  taxEl.textContent = money.format(tax);
  totalEl.textContent = money.format(total);

  if (!cart.length) {
    cartItems.innerHTML = '<div class="empty-cart">Your cart is empty.<br />Add coffee, food, or dessert to start.</div>';
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <div>
            <h3>${item.name}</h3>
            <p>${item.option}</p>
            <p>${money.format(item.unitPrice)} each</p>
          </div>
          <div class="qty-control" aria-label="Quantity for ${item.name}">
            <button class="qty-button" type="button" data-qty="${item.cartId}" data-dir="-1" aria-label="Decrease ${item.name}">−</button>
            <strong>${item.qty}</strong>
            <button class="qty-button" type="button" data-qty="${item.cartId}" data-dir="1" aria-label="Increase ${item.name}">+</button>
          </div>
        </div>
      `
    )
    .join("");
}

document.querySelector(".category-tabs").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-category]");
  if (!button) return;

  currentCategory = button.dataset.category;
  document.querySelectorAll("[data-category]").forEach((tab) => tab.classList.toggle("active", tab === button));
  renderMenu();
});

menuGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-add]");
  if (!button) return;
  addToCart(button.dataset.add);
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-qty]");
  if (!button) return;
  changeQuantity(button.dataset.qty, Number(button.dataset.dir));
});

document.querySelector("#clear-cart").addEventListener("click", () => {
  cart = [];
  successEl.classList.remove("show");
  renderCart();
});

document.querySelector("[data-featured]").addEventListener("click", () => {
  addToCart("latte", "Oat milk +$0.60");
  addToCart("croissant", "Warm");
});

document.querySelector(".cart-jump").addEventListener("click", () => {
  document.querySelector(".cart-panel").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelector("#checkout-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!cart.length) {
    successEl.textContent = "Add at least one item before placing your order.";
    successEl.classList.add("show");
    return;
  }

  const name = document.querySelector("#customer-name").value.trim();
  const service = document.querySelector('input[name="service"]:checked').value;
  const notes = document.querySelector("#order-notes").value.trim();

  if (!name) {
    successEl.textContent = "Please enter your name before placing your order.";
    successEl.classList.add("show");
    return;
  }

  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, service, notes, cart }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to place order.");
    }

    successEl.textContent = `Thanks, ${name}. Your ${service.toLowerCase()} order was placed for ${data.order.total.toLocaleString("en-US", { style: "currency", currency: "USD" })}. We will start preparing it now.`;
    successEl.classList.add("show");
    cart = [];
    renderCart();
    event.target.reset();
  } catch (error) {
    successEl.textContent = error.message;
    successEl.classList.add("show");
  }
});

renderMenu();
renderCart();
