const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");

function closeMenu() {
  document.body.classList.remove("nav-open");
  menuButton?.setAttribute("aria-expanded", "false");
}

menuButton?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

navLinks?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});
