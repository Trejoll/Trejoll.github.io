import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
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

// Referencias a elementos del DOM
const addProductForm = document.getElementById("add-product-form");
const productTableBody = document.querySelector("#vendor-products tbody");
const reviewTableBody = document.querySelector("#vendor-reviews tbody");
const logoutButton = document.getElementById("logout-button");

// Función para cargar productos desde Firestore
async function loadProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));
  productTableBody.innerHTML = "";

  if (!querySnapshot.empty) {
    querySnapshot.forEach((doc) => {
      const product = doc.data();
      productTableBody.innerHTML += `
        <tr>
          <td>${product.name}</td>
          <td>$${product.price.toFixed(2)}</td>
          <td><img src="${product.image}" alt="${product.name}" class="product-image"></td>
          <td><button class="secondary-button" onclick="deleteProduct('${doc.id}')">Eliminar</button></td>
        </tr>`;
    });
  } else {
    productTableBody.innerHTML = `<tr><td colspan="4">No hay productos subidos.</td></tr>`;
  }
}

// Función para cargar reseñas desde Firestore
async function loadReviews() {
  const querySnapshot = await getDocs(collection(db, "reviews"));
  reviewTableBody.innerHTML = "";

  if (!querySnapshot.empty) {
    querySnapshot.forEach((doc) => {
      const review = doc.data();
      reviewTableBody.innerHTML += `
        <tr>
          <td>${review.name}</td>
          <td>${review.review}</td>
          <td>${new Date(review.date).toLocaleString()}</td>
        </tr>`;
    });
  } else {
    reviewTableBody.innerHTML = `<tr><td colspan="3">No hay reseñas disponibles.</td></tr>`;
  }
}

// Función para agregar productos a Firestore
addProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("product-name").value;
  const price = parseFloat(document.getElementById("product-price").value);
  const imageUrl = document.getElementById("product-image-url").value;

  if (!name || !price || !imageUrl) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  try {
    await addDoc(collection(db, "products"), { name, price, image: imageUrl });
    alert("Producto agregado con éxito");
    addProductForm.reset();
    loadProducts();
  } catch (error) {
    console.error("Error al agregar el producto:", error);
    alert("Ocurrió un error al agregar el producto. Intenta de nuevo.");
  }
});

// Función para eliminar productos de Firestore
window.deleteProduct = async function (id) {
  try {
    await deleteDoc(doc(db, "products", id));
    alert("Producto eliminado");
    loadProducts();
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    alert("Ocurrió un error al eliminar el producto. Intenta de nuevo.");
  }
};

// Función para cerrar sesión
logoutButton.addEventListener("click", () => {
  localStorage.removeItem("user");
  alert("Has cerrado sesión.");
  window.location.href = "login.html";
});

// Cargar productos y reseñas al inicializar
loadProducts();
loadReviews();
