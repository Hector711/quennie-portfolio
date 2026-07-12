const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const menuLinks = document.querySelectorAll("[data-mobile-menu] a");

const setMenuState = (isOpen) => {
  if (!menuToggle || !mobileMenu) return;

  mobileMenu.hidden = !isOpen;
  document.body.classList.toggle("menu-is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
};

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  setMenuState(!isOpen);
});

menuLinks.forEach((link) => {
  link.addEventListener("click", () => setMenuState(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenuState(false);
  }
});
