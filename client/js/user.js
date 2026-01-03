const BASE = "http://localhost:3000";
let apiKey = localStorage.getItem("api_key");

const generateBtn = document.getElementById("generateKey");
const apiKeySpan = document.getElementById("apiKey");
const snackGrid = document.getElementById("snackGrid");

const role = localStorage.getItem("role");
if (!role || role !== "user") {
  alert("Silakan login sebagai user");
  window.location.href = "login.html";
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

// Generate API Key
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

// Load snack list
async function loadSnacks() {
  if (!apiKey) return;
  try {
    const res = await fetch(`${BASE}/api/snacks`, {
      headers: { "x-api-key": apiKey },
    });
    const snacks = await res.json();
    snackGrid.innerHTML = "";
    snacks.forEach(s => {
      const card = document.createElement("div");
      card.className = "snack-card";
      card.innerHTML = `<img src="${BASE}/images/${s.image_url}" alt="${s.name}"><h4>${s.name}</h4>`;
      card.onclick = () => showDetail(s.id);
      snackGrid.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    alert("Gagal load snack");
  }
}
