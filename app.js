document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    loadCategories();
  });
  async function loadFeaturedProducts() {
    const products = await fetchAPI("https://fakestoreapi.com/products?limit=4"); // Limit to top 4 products
    const featuredGrid = document.getElementById("featuredProducts");
    featuredGrid.innerHTML = products.map(product => productCardHTML(product)).join("");
  }
  
  document.addEventListener("DOMContentLoaded", loadFeaturedProducts);
  let currentPage = 1;
const itemsPerPage = 10;
let allProducts = [];

async function loadProducts(page = 1) {
  const start = (page - 1) * itemsPerPage;
  const products = await fetchAPI(`https://fakestoreapi.com/products?limit=${itemsPerPage}&skip=${start}`);
  allProducts = products;
  displayProducts(products);
}

function filterByPrice(event) {
  const maxPrice = event.target.value;
  const filteredProducts = allProducts.filter(p => p.price <= maxPrice);
  displayProducts(filteredProducts);
}

function nextPage() {
  currentPage++;
  loadProducts(currentPage);
}

function previousPage() {
  if (currentPage > 1) currentPage--;
  loadProducts(currentPage);
}
async function viewProduct(id) {
    const product = await fetchAPI(`https://fakestoreapi.com/products/${id}`);
    const productDetailContent = document.getElementById("productDetailContent");
    productDetailContent.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h2>${product.title}</h2>
      <p>${product.description}</p>
      <p>Price: $${product.price}</p>
      <p>Rating: ${product.rating.rate} ⭐</p>
      <button onclick="addToCart(${id})">Add to Cart</button>
    `;
  }
  let cart = [];

function addToCart(id) {
  const product = allProducts.find(p => p.id === id);
  cart.push(product);
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  document.getElementById("cartTotal").innerText = total.toFixed(2);

  cartItems.innerHTML = cart.map(item => `
    <div>${item.title} - $${item.price} <button onclick="removeFromCart(${item.id})">Remove</button></div>
  `).join("");
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
  }
  function showLoader() {
    document.getElementById("loader").style.display = "block";
  }
  
  function hideLoader() {
    document.getElementById("loader").style.display = "none";
  }
  
  async function fetchAPI(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
  
  async function loadProducts(query = "") {
    let url = "https://fakestoreapi.com/products";
    if (query) url += `/category/${query}`;
    
    const products = await fetchAPI(url);
    displayProducts(products);
  }
  
  async function loadCategories() {
    const categories = await fetchAPI("https://fakestoreapi.com/products/categories");
    const categoriesDiv = document.getElementById("categories");
  
    categoriesDiv.innerHTML = categories.map(category => `
      <button onclick="loadProducts('${category}')">${category}</button>
    `).join("");
  }
  
  function displayProducts(products) {
    const productGrid = document.getElementById("productGrid");
    productGrid.innerHTML = products.map(product => `
      <div class="product-card">
        <img src="${product.image}" alt="${product.title}">
        <h2>${product.title}</h2>
        <p>${product.description.slice(0, 50)}...</p>
        <p><strong>$${product.price}</strong></p>
        <button onclick="viewProduct(${product.id})">View Details</button>
      </div>
    `).join("");
  }
  
  function viewProduct(id) {
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then(response => response.json())
      .then(product => {
        alert(`Product Details:\n\n${product.title}\n$${product.price}\n\n${product.description}`);
      });
  }
  
  function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    fetchAPI("https://fakestoreapi.com/products")
      .then(products => {
        const filteredProducts = products.filter(product =>
          product.title.toLowerCase().includes(query)
        );
        displayProducts(filteredProducts);
      });
  }
  