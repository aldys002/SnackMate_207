const BASE = "http://localhost:3000";
let apiKey = localStorage.getItem("api_key");

const generateBtn = document.getElementById("generateKey");
const apiKeySpan = document.getElementById("apiKey");
const snackGrid = document.getElementById("snackGrid");
const searchInput = document.getElementById("searchInput"); // SEARCH

let allSnacks = []; // SIMPAN SEMUA SNACK

const role = localStorage.getItem("role");
if (!role || role !== "user") {
  alert("Silakan login sebagai user");
  window.location.href = "login.html";
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

// ================= GENERATE API KEY =================
generateBtn.addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE}/apikey/generate`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    console.log("Generate API response:", data);

    if (res.ok) {
      apiKey = data.api_key;
      localStorage.setItem("api_key", apiKey);
      apiKeySpan.innerText = apiKey;
      loadSnacks();
    } else {
      alert("Gagal generate API Key: " + data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Gagal generate API Key (network / server error)");
  }
});

// ================= LOAD SNACK =================
async function loadSnacks() {
  if (!apiKey) return;
  try {
    const res = await fetch(`${BASE}/api/snacks`, {
      headers: { "x-api-key": apiKey },
    });
    allSnacks = await res.json(); // SIMPAN DATA
    renderSnacks(allSnacks);
  } catch (err) {
    console.error(err);
    alert("Gagal load snack");
  }
}

// ================= RENDER SNACK =================
function renderSnacks(snacks) {
  snackGrid.innerHTML = "";
  snacks.forEach(s => {
    const card = document.createElement("div");
    card.className = "snack-card";
    card.innerHTML = `
      <img src="${BASE}/images/${s.image_url}" alt="${s.name}">
      <h4>${s.name}</h4>
    `;
    card.onclick = () => showDetail(s.id);
    snackGrid.appendChild(card);
  });
}

// ================= SEARCH =================
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase();
    const filtered = allSnacks.filter(s =>
      s.name.toLowerCase().includes(keyword)
    );
    renderSnacks(filtered);
  });
}

// ================= MODAL DETAIL =================
const modal = document.getElementById("modal");
const mTitle = document.getElementById("mTitle");
const mImg = document.getElementById("mImg");
const mDesc = document.getElementById("mDesc");
const mBrand = document.getElementById("mBrand");
const mCountry = document.getElementById("mCountry");
const mPrice = document.getElementById("mPrice");
const mStock = document.getElementById("mStock");
const closeModalBtn = document.getElementById("closeModal");

closeModalBtn.onclick = () => modal.style.display = "none";

// ================= DETAIL SNACK =================
async function showDetail(id) {
  if (!apiKey) return;
  try {
    const res = await fetch(`${BASE}/api/snacks/${id}`, {
      headers: { "x-api-key": apiKey },
    });
    const s = await res.json();

    if (!res.ok) {
      alert(s.message || "Gagal mengambil detail");
      return;
    }

    mTitle.innerText = s.name;
    // Gunakan pengecekan jika image_url mengandung http atau tidak
    mImg.src = s.image_url.startsWith('http') ? s.image_url : `${BASE}/images/${s.image_url}`;
    
    mDesc.innerText = s.description;
    mBrand.innerText = s.brand || "-";
    mCountry.innerText = s.country || "-";
    
    // Format harga jadi Rp 10.000 (pakai titik)
    mPrice.innerText = "Rp " + parseFloat(s.price).toLocaleString("id-ID");
    
    mStock.innerText = s.stock + " pcs";

    modal.style.display = "flex";
  } catch (err) {
    console.error(err);
    alert("Gagal load detail snack");
  }
}

// ================= AUTO LOAD =================
if (apiKey) {
  apiKeySpan.innerText = apiKey;
  loadSnacks();
}
