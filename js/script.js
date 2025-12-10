const ADMIN_PIN = "9347856661";
const ADMIN_PASSWORD = "qwe123mnb890";

let adminLoggedIn = false;

// ---------- NAV / PAGE SWITCHING ----------

function showSection(id) {
  // protect admin dashboard
  if (id === "admin-dashboard" && !adminLoggedIn) {
    id = "login";
  }
  // if already logged in and clicks "Admin Login", go directly to dashboard
  if (id === "login" && adminLoggedIn) {
    id = "admin-dashboard";
  }

  const sections = document.querySelectorAll(".page-section");
  sections.forEach((sec) => sec.classList.remove("active"));

  const target = document.getElementById(id);
  if (target) target.classList.add("active");

  const buttons = document.querySelectorAll(".nav-links button");
  buttons.forEach((btn) => {
    const active = btn.dataset.target === id || (id === "admin-dashboard" && btn.dataset.target === "login");
    btn.classList.toggle("active", active);
  });

  const navLinks = document.getElementById("nav-links");
  if (navLinks) navLinks.classList.remove("show");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---------- REGISTRATION STORAGE (localStorage) ----------

function getRegistrations() {
  try {
    const raw = localStorage.getItem("registrations");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to parse registrations", e);
    return [];
  }
}

function saveRegistrations(list) {
  localStorage.setItem("registrations", JSON.stringify(list));
}

function handleContactSubmit(event) {
  event.preventDefault();
  const form = event.target;

  const data = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    country: form.country.value.trim(),
    message: form.message.value.trim(),
    createdAt: new Date().toISOString()
  };

  const list = getRegistrations();
  list.push(data);
  saveRegistrations(list);

  form.reset();
  const msg = document.getElementById("contact-success");
  if (msg) {
    msg.textContent = "Thank you! Your enquiry has been saved for the admin.";
    setTimeout(() => (msg.textContent = ""), 4000);
  }

  renderAdminTable();
}

// ---------- ADMIN LOGIN / LOGOUT ----------

function renderAdminStatus() {
  const statusEl = document.getElementById("admin-status");
  if (!statusEl) return;
  statusEl.textContent = adminLoggedIn ? "Logged in as admin" : "Not logged in";
  statusEl.classList.toggle("admin-status-ok", adminLoggedIn);
  statusEl.classList.toggle("admin-status-bad", !adminLoggedIn);
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const pin = form.pin.value.trim();
  const password = form.password.value.trim();
  const errorEl = document.getElementById("login-error");

  if (pin === ADMIN_PIN && password === ADMIN_PASSWORD) {
    adminLoggedIn = true;
    localStorage.setItem("adminLoggedIn", "true");
    if (errorEl) errorEl.textContent = "";
    renderAdminStatus();
    renderAdminTable();
    showSection("admin-dashboard");
  } else {
    adminLoggedIn = false;
    localStorage.setItem("adminLoggedIn", "false");
    if (errorEl) errorEl.textContent = "Invalid PIN or password.";
    renderAdminStatus();
  }
}

function handleLogout() {
  adminLoggedIn = false;
  localStorage.setItem("adminLoggedIn", "false");
  renderAdminStatus();
  showSection("login");
}

// ---------- ADMIN TABLE RENDER ----------

function renderAdminTable() {
  const tbody = document.getElementById("admin-table-body");
  const emptyMsg = document.getElementById("admin-empty");
  if (!tbody || !emptyMsg) return;

  const data = getRegistrations();
  tbody.innerHTML = "";

  if (!data.length) {
    emptyMsg.style.display = "block";
    return;
  }

  emptyMsg.style.display = "none";

  data.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.name || "-"}</td>
      <td>${item.email || "-"}</td>
      <td>${item.phone || "-"}</td>
      <td>${item.country || "-"}</td>
      <td>${item.message || "-"}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ---------- INIT ----------

document.addEventListener("DOMContentLoaded", () => {
  // footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // mobile nav toggle
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.getElementById("nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  }

  // restore admin login state
  adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";

  // contact form registrations
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactSubmit);
  }

  // login form
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLoginSubmit);
  }

  // logout button
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }

  renderAdminStatus();
  renderAdminTable();
});
