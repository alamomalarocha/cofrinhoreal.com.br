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
const siteHeader = document.querySelector(".site-header");
const siteHeaderInner = document.querySelector(".site-header-inner");
const headerLogo = document.querySelector(".header-logo");
const cookieKey = "cofrinhoRealPrototypePrivacyNotice";

function getClosedHeaderHeight() {
  const innerStyles = siteHeaderInner ? window.getComputedStyle(siteHeaderInner) : null;
  const verticalPadding = innerStyles
    ? Number.parseFloat(innerStyles.paddingTop) + Number.parseFloat(innerStyles.paddingBottom)
    : 0;
  const logoHeight = headerLogo?.getBoundingClientRect().height ?? 0;
  const menuHeight = menuButton?.getBoundingClientRect().height ?? 0;

  return Math.max(logoHeight, menuHeight) + verticalPadding;
}

function syncHeaderOffset() {
  const measuredHeight = siteHeader?.getBoundingClientRect().height ?? 0;
  const headerHeight = document.body.classList.contains("nav-open")
    ? getClosedHeaderHeight()
    : measuredHeight;

  if (headerHeight > 0) {
    document.documentElement.style.setProperty(
      "--header-offset",
      `${Math.ceil(headerHeight + 18)}px`
    );
  }
}

function currentHashTarget() {
  const id = window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : "";
  return id ? document.getElementById(id) : null;
}

function alignHashTarget() {
  const target = currentHashTarget();
  target?.scrollIntoView({ block: "start" });
}

function scheduleHashAlignment() {
  if (!window.location.hash) {
    return;
  }

  const align = () => {
    syncHeaderOffset();
    alignHashTarget();
  };

  window.requestAnimationFrame(align);
  window.setTimeout(align, 140);
  window.setTimeout(align, 420);
}

function closeMenu() {
  document.body.classList.remove("nav-open");
  menuButton?.setAttribute("aria-expanded", "false");
  syncHeaderOffset();
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
  window.requestAnimationFrame(syncHeaderOffset);
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

syncHeaderOffset();
headerLogo?.addEventListener("load", () => {
  syncHeaderOffset();
  scheduleHashAlignment();
});
window.addEventListener("resize", syncHeaderOffset);
window.addEventListener("load", () => {
  syncHeaderOffset();
  scheduleHashAlignment();
});
window.addEventListener("hashchange", scheduleHashAlignment);

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
