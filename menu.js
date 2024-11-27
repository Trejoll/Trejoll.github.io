import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCfYwCRHz-kihRV8p2Sa_IAwR7Iho2RV2I",
  authDomain: "cafeshop-3672d.firebaseapp.com",
  projectId: "cafeshop-3672d",
  storageBucket: "cafeshop-3672d.appspot.com",
  messagingSenderId: "469499271309",
  appId: "1:469499271309:web:9e450339d546d68d2eaac4",
  measurementId: "G-TG0MR2GCW9",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referencias del DOM
const productList = document.getElementById("product-list");
const cartButton = document.getElementById("cart-button");
const logoutButton = document.getElementById("logout-button");

// Cargar productos del menú
async function loadMenu() {
  const querySnapshot = await getDocs(collection(db, "products"));
  productList.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const product = doc.data();
    productList.innerHTML += `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-name">${product.name}</div>
        <div class="product-price">$${product.price.toFixed(2)}</div>
        <button class="primary-button" onclick="addToCart('${doc.id}', '${product.name}', ${product.price}, '${product.image}')">Agregar al Carrito</button>
        <div class="review-section">
          <textarea class="review-input" id="review-${doc.id}" placeholder="Deja tu reseña"></textarea>
          <button class="secondary-button" onclick="submitReview('${product.store}', '${product.name}', '${doc.id}')">Enviar Reseña</button>
        </div>
      </div>`;
  });
}

// Agregar producto al carrito
window.addToCart = (id, name, price, image) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ id, name, price, image, quantity: 1 });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${name} agregado al carrito.`);
};

// Enviar una reseña
window.submitReview = async (store, name, productId) => {
  const reviewText = document.getElementById(`review-${productId}`).value.trim();

  if (!reviewText) {
    alert("Por favor, escribe una reseña antes de enviarla.");
    return;
  }

  try {
    // Crear manualmente la colección si no existe al agregar el documento
    const reviewRef = collection(db, "reviews");
    await addDoc(reviewRef, {
      store,
      name,
      review: reviewText,
      date: new Date().toISOString(),
    });

    alert("¡Reseña enviada con éxito!");
    document.getElementById(`review-${productId}`).value = "";
  } catch (error) {
    console.error("Error al enviar la reseña:", error);
    alert("Ocurrió un error al enviar tu reseña. Intenta de nuevo.");
  }
};

// Navegar a la página del carrito
if (cartButton) {
  cartButton.addEventListener("click", () => {
    window.location.href = "cart.html";
  });
}

// Cerrar sesión
if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("user");
    alert("Has cerrado sesión.");
    window.location.href = "login.html";
  });
}

// Inicializar menú
loadMenu();
