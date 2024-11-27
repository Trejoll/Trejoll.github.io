// Referencias del DOM
const cartItems = document.getElementById("cart-items");

// Cargar carrito
function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartItems.innerHTML = "";

  cart.forEach((item, index) => {
    cartItems.innerHTML += `
      <li class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <span>${item.name} - $${item.price.toFixed(2)} x ${item.quantity}</span>
        <div>
          <button onclick="changeQuantity(${index}, 1)">+</button>
          <button onclick="changeQuantity(${index}, -1)">-</button>
          <button onclick="removeItem(${index})">Eliminar</button>
        </div>
      </li>`;
  });
}

// Cambiar cantidad
window.changeQuantity = (index, change) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart[index].quantity + change > 0) {
    cart[index].quantity += change;
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
  } else {
    removeItem(index);
  }
};

// Eliminar producto
window.removeItem = (index) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
};

// Finalizar compra
window.checkout = () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length > 0) {
    alert("Compra realizada con éxito.");
    localStorage.removeItem("cart");
    loadCart();
  } else {
    alert("El carrito está vacío.");
  }
};

// Función para navegar al menú
window.navigateToMenu = () => {
  window.location.href = "menu.html"; // Cambia "menu.html" por el nombre correcto de tu archivo.
};

// Inicializar carrito
loadCart();
