const menuButton = document.querySelector(".menu-button");
const navPanel = document.querySelector(".nav-panel");
const loginModal = document.querySelector("[data-login-modal]");
const loginOpenButtons = document.querySelectorAll("[data-open-login]");
const loginCloseButtons = document.querySelectorAll("[data-close-login]");
const visualLoginForm = document.querySelector(".visual-login-form");
const searchForm = document.querySelector(".site-search");
const searchInput = searchForm?.querySelector("input");
const searchFeedback = searchForm?.querySelector(".search-feedback");
const cookieNotice = document.querySelector("[data-cookie-notice]");
const cookieOkButton = document.querySelector("[data-cookie-ok]");
const cookieKey = "cofrinhoRealPrototypePrivacyNotice";

function closeMenu() {
  document.body.classList.remove("nav-open");
  menuButton?.setAttribute("aria-expanded", "false");
}

function openLoginModal() {
  closeMenu();
  loginModal?.removeAttribute("hidden");
  document.body.classList.add("modal-open");
}

function closeLoginModal() {
  loginModal?.setAttribute("hidden", "");
  document.body.classList.remove("modal-open");
}

menuButton?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

navPanel?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    closeMenu();
  }
});

loginOpenButtons.forEach((button) => {
  button.addEventListener("click", openLoginModal);
});

loginCloseButtons.forEach((button) => {
  button.addEventListener("click", closeLoginModal);
});

visualLoginForm?.addEventListener("submit", (event) => {
  event.preventDefault();
});

searchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const term = searchInput?.value.trim();

  if (searchFeedback) {
    searchFeedback.textContent = term
      ? "Busca visual no protótipo"
      : "Digite algo para testar";
    searchForm.classList.add("has-feedback");
    window.setTimeout(() => searchForm.classList.remove("has-feedback"), 2400);
  }
});

try {
  if (cookieNotice && window.localStorage.getItem(cookieKey) === "ok") {
    cookieNotice.setAttribute("hidden", "");
  }

  cookieOkButton?.addEventListener("click", () => {
    window.localStorage.setItem(cookieKey, "ok");
    cookieNotice?.setAttribute("hidden", "");
  });
} catch {
  cookieOkButton?.addEventListener("click", () => {
    cookieNotice?.setAttribute("hidden", "");
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    closeLoginModal();
  }
});
