const BASE = "http://localhost:3000";
const token = localStorage.getItem("token");

// Elements
const snackList = document.getElementById("snackList");
const userList = document.getElementById("userList");
const apiList = document.getElementById("apiList");

const snackForm = document.getElementById("snackForm");
const nameInput = document.getElementById("nameInput");
const brandInput = document.getElementById("brandInput");
const countryInput = document.getElementById("countryInput");
const descInput = document.getElementById("descInput");
const priceInput = document.getElementById("priceInput");
const stockInput = document.getElementById("stockInput");
const imgInput = document.getElementById("imgInput");

let editId = null; // untuk edit

// Protect page: must be admin
const role = localStorage.getItem("role");
if (!role || role !== "admin") {
  alert("Silakan login sebagai admin");
  window.location.href = "login.html";
}

// Load snacks
async function loadSnacks() {
  try {
    const res = await fetch(`${BASE}/admin/snacks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const snacks = await res.json();
    snackList.innerHTML = "";

    snacks.forEach((s) => {
      snackList.innerHTML += `
        <div class="snack-card">
          <img src="${BASE}/images/${s.image_url}" alt="${s.name}">
          <h4>${s.name}</h4>
          <p>Brand: ${s.brand || "-"}</p>
          <p>Country: ${s.country || "-"}</p>
          <p>${s.description}</p>
          <p>Harga: Rp${s.price}</p>
          <p>Stock: ${s.stock}</p>
          <button onclick="editSnack(${s.id})" class="btn btn-blue">Edit</button>
          <button onclick="deleteSnack(${s.id})" class="btn btn-red">Hapus</button>
        </div>
      `;
    });
  } catch (err) {
    console.error(err);
    alert("Gagal load snack");
  }
}

// Add / Update snack
snackForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    name: nameInput.value,
    brand: brandInput.value,
    country: countryInput.value,
    description: descInput.value,
    price: priceInput.value,
    stock: stockInput.value,
    image_url: imgInput.value,
  };

  try {
    let res;
    if (editId) {
      // Update snack
      res = await fetch(`${BASE}/admin/snacks/${editId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      editId = null;
    } else {
      // Add snack
      res = await fetch(`${BASE}/admin/snacks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    }

    const data = await res.json();
    alert(data.message || "Berhasil");
    snackForm.reset();
    loadSnacks();
  } catch (err) {
    console.error(err);
    alert("Gagal menyimpan snack");
  }
});

// Edit snack
window.editSnack = async (id) => {
  try {
    const res = await fetch(`${BASE}/admin/snacks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const s = await res.json();
    nameInput.value = s.name;
    brandInput.value = s.brand || "";
    countryInput.value = s.country || "";
    descInput.value = s.description;
    priceInput.value = s.price;
    stockInput.value = s.stock;
    imgInput.value = s.image_url;

    editId = id;
  } catch (err) {
    console.error(err);
    alert("Gagal load snack untuk edit");
  }
};

// Delete snack
window.deleteSnack = async (id) => {
  if (!confirm("Yakin hapus snack ini?")) return;
  try {
    const res = await fetch(`${BASE}/admin/snacks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    alert(data.message || "Berhasil dihapus");
    loadSnacks();
  } catch (err) {
    console.error(err);
    alert("Gagal hapus snack");
  }
};

// Load users
async function loadUsers() {
  try {
    const res = await fetch(`${BASE}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const users = await res.json();
    userList.innerHTML = users
      .map((u) => `<p>${u.name} (${u.email}) - ${u.role}</p>`)
      .join("");
  } catch (err) {
    console.error(err);
    alert("Gagal load users");
  }
}

// Load API keys
async function loadApiKeys() {
  try {
    const res = await fetch(`${BASE}/admin/apikeys`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const keys = await res.json();
    apiList.innerHTML = keys
      .map(
        (k) =>
          `<p>UserID: ${k.user_id} - ${k.api_key} (Status: ${k.status || "-"})</p>`
      )
      .join("");
  } catch (err) {
    console.error(err);
    alert("Gagal load API keys");
  }
}

// Initial load
loadSnacks();
loadUsers();
loadApiKeys();
