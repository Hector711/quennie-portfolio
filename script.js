const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menuPanel = document.querySelector("[data-menu-panel]");
const menuClose = document.querySelector("[data-menu-close]");
const menuLinks = document.querySelectorAll(".menu-panel a");
const filterButtons = document.querySelectorAll("[data-filter]");
const workCards = document.querySelectorAll("[data-category]");
const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

const setMenuState = (isOpen) => {
  if (!menuToggle || !menuPanel || !header) return;

  menuPanel.hidden = !isOpen;
  document.body.classList.toggle("menu-is-open", isOpen);
  header.classList.toggle("is-menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  setMenuState(!isOpen);
});

menuClose?.addEventListener("click", () => setMenuState(false));

menuLinks.forEach((link) => {
  link.addEventListener("click", () => setMenuState(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenuState(false);
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    workCards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(contactForm);
  const name = data.get("name");
  const email = data.get("email");
  const session = data.get("session");
  const message = data.get("message");

  const subject = encodeURIComponent(`Consulta ${session} - ${name}`);
  const body = encodeURIComponent(
    `Nombre: ${name}\nEmail: ${email}\nTipo de sesión: ${session}\n\n${message}`
  );

  if (formStatus) {
    formStatus.textContent = "Consulta preparada en tu cliente de email.";
  }

  window.location.href = `mailto:hello@quennie.studio?subject=${subject}&body=${body}`;
});
