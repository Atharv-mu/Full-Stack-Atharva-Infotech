const API_BASE = "http://localhost:5000/api";

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

function productEmoji(category) {
  return ({Printers:"🖨️", Monitors:"🖥️", Computers:"💻", Accessories:"⌨️", Storage:"💾", Networking:"📡"})[category] || "📦";
}

function money(value) {
  if (value === undefined || value === null) return "Ask for price";
  return new Intl.NumberFormat("en-IN", {style:"currency", currency:"INR", maximumFractionDigits:0}).format(value);
}

function renderProducts(products) {
  if (!products.length) {
    productGrid.innerHTML = '<div class="empty">No products found. Try another search or category.</div>';
    return;
  }
  productGrid.innerHTML = products.map(p => `
    <article class="product-card">
      <div class="product-img">${p.image ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" style="width:100%;height:100%;object-fit:contain">` : productEmoji(p.category)}</div>
      <div class="product-body">
        <span class="product-brand">${escapeHtml(p.brand || p.category)}</span>
        <h3>${escapeHtml(p.name)}</h3>
        <p>${escapeHtml(p.description || "Quality electronics product. Contact us for details.")}</p>
        <div class="product-bottom">
          <span class="price">${money(p.price)}</span>
          <button class="enquire-btn" data-product="${escapeHtml(p.name)}">Enquire</button>
        </div>
      </div>
    </article>`).join("");

  document.querySelectorAll(".enquire-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector('[name="product"]').value = btn.dataset.product;
      document.querySelector("#contact").scrollIntoView({behavior:"smooth"});
    });
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

async function loadProducts() {
  productGrid.innerHTML = '<div class="loading">Loading products...</div>';
  const q = new URLSearchParams();
  if (searchInput.value.trim()) q.set("search", searchInput.value.trim());
  if (categoryFilter.value) q.set("category", categoryFilter.value);
  try {
    const res = await fetch(`${API_BASE}/products?${q}`);
    if (!res.ok) throw new Error();
    renderProducts(await res.json());
  } catch {
    productGrid.innerHTML = '<div class="empty">Unable to connect to the server. Start the backend and refresh the page.</div>';
  }
}

let searchTimer;
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(loadProducts, 300);
});
categoryFilter.addEventListener("change", loadProducts);

document.querySelectorAll(".category-card").forEach(card => {
  card.addEventListener("click", () => {
    categoryFilter.value = card.dataset.category;
    document.querySelector("#products").scrollIntoView({behavior:"smooth"});
    loadProducts();
  });
});

document.getElementById("contactForm").addEventListener("submit", async e => {
  e.preventDefault();
  const form = e.currentTarget;
  const status = document.getElementById("formStatus");
  const data = Object.fromEntries(new FormData(form).entries());
  status.className = "form-status";
  status.textContent = "Sending your enquiry...";
  try {
    const res = await fetch(`${API_BASE}/enquiries`, {
      method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed");
    status.className = "form-status success";
    status.textContent = "Thank you! Your enquiry has been submitted.";
    form.reset();
  } catch (err) {
    status.className = "form-status error";
    status.textContent = err.message || "Could not send enquiry. Please try again.";
  }
});

document.getElementById("menuBtn").addEventListener("click", () => {
  document.getElementById("mainNav").classList.toggle("open");
});
document.querySelectorAll("#mainNav a").forEach(a => a.addEventListener("click", () => document.getElementById("mainNav").classList.remove("open")));
document.getElementById("year").textContent = new Date().getFullYear();

loadProducts();
