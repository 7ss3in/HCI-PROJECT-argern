const products = [
  { id: 1, name: "Urban E-Bike 750W", category: "ebike", price: 1299, tag: "Featured", image: "images/1.jpg" },
  { id: 2, name: "Foldable E-Bike 500W", category: "ebike", price: 899, tag: "New", image: "images/2.jpg" },
  { id: 3, name: "City Scooter Pro", category: "scooter", price: 699, tag: "Top", image: "images/3.jpg" },
  { id: 4, name: "Off-Road ATV Mini", category: "atv", price: 1599, tag: "Popular", image: "images/4.jpg" },
  { id: 5, name: "Kids Electric Car", category: "kids", price: 299, tag: "Sale", image: "images/5.jpg" },
  { id: 6, name: "Smart Gadget Bundle", category: "gadgets", price: 199, tag: "Deal", image: "images/6.jpg" },
  { id: 7, name: "3-Wheel Mobility Scooter", category: "scooter", price: 999, tag: "Featured", image: "images/7.jpg" },
  { id: 8, name: "Electric Go-Kart", category: "kids", price: 549, tag: "New", image: "images/8.jpg" },
  { id: 9, name: "Adventure E-Bike 1000W", category: "ebike", price: 1799, tag: "Top", image: "images/9.jpg" }
];

let cart = 0;
let viewMode = "grid";

const grid = document.getElementById("productGrid");
const statusEl = document.getElementById("status");
const toast = document.getElementById("toast");
const cartCount = document.getElementById("cartCount");

const categorySel = document.getElementById("category");
const sortSel = document.getElementById("sort");
const resetBtn = document.getElementById("resetFilters");

const gridBtn = document.getElementById("gridBtn");
const listBtn = document.getElementById("listBtn");

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1600);
}

function priceRangesSelected() {
  const checks = [...document.querySelectorAll(".price:checked")];
  return checks.map(c => c.value);
}

function matchPrice(product, ranges) {
  if (ranges.length === 0) return true;
  return ranges.some(r => {
    const [min, max] = r.split("-").map(Number);
    return product.price >= min && product.price < max;
  });
}

function sortProducts(list, mode) {
  const arr = [...list];
  switch (mode) {
    case "priceAsc": return arr.sort((a, b) => a.price - b.price);
    case "priceDesc": return arr.sort((a, b) => b.price - a.price);
    case "nameAsc": return arr.sort((a, b) => a.name.localeCompare(b.name));
    default: return arr; 
  }
}

function render() {
  
  statusEl.textContent = "Loading products...";
  grid.setAttribute("aria-busy", "true");
  grid.innerHTML = "";

  setTimeout(() => {
    const cat = categorySel.value;
    const sort = sortSel.value;
    const ranges = priceRangesSelected();

    let filtered = products.filter(p => (cat === "all" ? true : p.category === cat));
    filtered = filtered.filter(p => matchPrice(p, ranges));
    filtered = sortProducts(filtered, sort);

    statusEl.textContent = `${filtered.length} product(s) shown`;
    grid.setAttribute("aria-busy", "false");

   
    grid.className = viewMode === "grid" ? "grid" : "grid grid--list";
    grid.innerHTML = filtered.map(p => cardHTML(p)).join("");

    
    [...document.querySelectorAll("[data-add]")].forEach(btn => {
      btn.addEventListener("click", () => {
        cart += 1;
        cartCount.textContent = cart;
        showToast(`Added to cart: ${btn.dataset.add}`);
      });
    });

    [...document.querySelectorAll("[data-view]")].forEach(btn => {
      btn.addEventListener("click", () => {
        showToast(`Viewing: ${btn.dataset.view}`);
      });
    });
  }, 250);
}

function cardHTML(p) {
  const badge = `<span class="badge" aria-label="Tag">${p.tag}</span>`;

  return `
  <article class="card">
    <div class="card__img">
      <img src="${p.image}" alt="${p.name}" loading="lazy" />
    </div>
    <div class="card__body">
      <h3 class="card__title">${p.name}</h3>
      <div class="card__meta">
        <span class="muted">${badge}</span>
        <span class="price">$${p.price}</span>
      </div>
      <div class="card__actions">
        <button class="btn" type="button" data-view="${p.name}">View</button>
        <button class="btn btn--primary" type="button" data-add="${p.name}">Add to cart</button>
      </div>
    </div>
  </article>`;
}

document.querySelector(".search").addEventListener("submit", (e) => {
  e.preventDefault();
  const q = document.getElementById("q").value.trim().toLowerCase();
  if (!q) {
    showToast("Type something to search.");
    return;
  }

  const found = products.filter(p => p.name.toLowerCase().includes(q));
  statusEl.textContent = `Search results for "${q}": ${found.length} item(s)`;
  grid.innerHTML = found.map(p => cardHTML(p)).join("");

  
  [...document.querySelectorAll("[data-add]")].forEach(btn => {
    btn.addEventListener("click", () => {
      cart += 1;
      cartCount.textContent = cart;
      showToast(`Added to cart: ${btn.dataset.add}`);
    });
  });

  [...document.querySelectorAll("[data-view]")].forEach(btn => {
    btn.addEventListener("click", () => {
      showToast(`Viewing: ${btn.dataset.view}`);
    });
  });

  showToast(`Showing results for "${q}"`);
});

[categorySel, sortSel].forEach(el => el.addEventListener("change", render));
document.querySelectorAll(".price").forEach(ch => ch.addEventListener("change", render));

resetBtn.addEventListener("click", () => {
  categorySel.value = "all";
  sortSel.value = "featured";
  document.querySelectorAll(".price").forEach(ch => ch.checked = false);
  showToast("Filters reset.");
  render();
});

gridBtn.addEventListener("click", () => {
  viewMode = "grid";
  gridBtn.classList.add("btn--active");
  listBtn.classList.remove("btn--active");
  showToast("Grid view");
  render();
});

listBtn.addEventListener("click", () => {
  viewMode = "list";
  listBtn.classList.add("btn--active");
  gridBtn.classList.remove("btn--active");
  showToast("List view");
  render();
});


render();
