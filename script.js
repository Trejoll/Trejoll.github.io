// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, set, get, push, onValue } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_DOMINIO.firebaseapp.com",
  databaseURL: "https://TU_BASE_DE_DATOS.firebaseio.com",
  projectId: "TU_ID_PROYECTO",
  storageBucket: "TU_BUCKET.appspot.com",
  messagingSenderId: "ID_MENSAJES",
  appId: "ID_APP"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

// Función para navegar entre pantallas
function navigateTo(page) {
  window.location.href = page;
}

// Cargar productos
function loadProducts() {
  const productRef = ref(db, "products");
  onValue(productRef, (snapshot) => {
    const products = snapshot.val();
    const productList = document.getElementById("product-list");
    productList.innerHTML = Object.keys(products).map(key => `
      <li>${products[key].name} - $${products[key].price}
        <img src="${products[key].image}" alt="${products[key].name}">
        <button onclick="addToCart('${key}')">Agregar</button>
      </li>`).join("");
  });
}

// Agregar producto
document.getElementById("add-product-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("product-name").value;
  const price = document.getElementById("product-price").value;
  const imageFile = document.getElementById("product-image").files[0];

  const imageRef = storageRef(storage, `products/${imageFile.name}`);
  await uploadBytes(imageRef, imageFile);
  const imageUrl = await getDownloadURL(imageRef);

  const productRef = push(ref(db, "products"));
  await set(productRef, { name, price, image: imageUrl });

  alert("Producto agregado con éxito");
});
