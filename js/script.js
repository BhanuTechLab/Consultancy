// PAGE SWITCH HANDLER
function showSection(id) {
  // hide all sections
  document.querySelectorAll(".page-section").forEach((sec) => {
    sec.classList.remove("active");
  });

  // show selected section
  document.getElementById(id).classList.add("active");

  // update navbar active button
  document.querySelectorAll(".nav-links button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.target === id);
  });

  // close mobile menu after clicking
  document.getElementById("nav-links").classList.remove("show");
}

// MOBILE MENU TOGGLE
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.getElementById("nav-links");

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

// SET FOOTER YEAR
document.getElementById("year").textContent = new Date().getFullYear();
