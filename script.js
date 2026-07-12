const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const menuLinks = document.querySelectorAll("[data-mobile-menu] a, [data-mobile-menu] button");
const contactForms = document.querySelectorAll("[data-contact-form]");
const stepForms = document.querySelectorAll("[data-step-form]");
const bookingDialog = document.querySelector("[data-booking-dialog]");
const bookingOpenButtons = document.querySelectorAll("[data-booking-open]");
const bookingCloseButton = document.querySelector("[data-booking-close]");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TRACKING_FIELDS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
];

const WEDDING_FORM_STEPS = [
  {
    type: "text",
    key: "name",
    question: "¿Cuál es tu nombre y apellidos?",
    summaryLabel: "Nombre",
    placeholder: "Nombre y apellidos",
    autoComplete: "name",
    inputMode: "text",
    validate: (value) => (value.trim().length >= 2 ? "" : "Escribe tu nombre para continuar."),
  },
  {
    type: "text",
    key: "email",
    question: "¿A qué correo te escribo?",
    summaryLabel: "Correo electrónico",
    placeholder: "tu@correo.com",
    autoComplete: "email",
    inputMode: "email",
    validate: (value) => (EMAIL_RE.test(value.trim()) ? "" : "Introduce un correo válido."),
  },
  {
    type: "text",
    key: "phone",
    question: "¿Cuál es tu teléfono o WhatsApp?",
    summaryLabel: "Teléfono",
    placeholder: "+34 600 000 000",
    autoComplete: "tel",
    inputMode: "tel",
    validate: (value) =>
      value.replace(/\D/g, "").length >= 6 ? "" : "Introduce un teléfono válido.",
  },
  {
    type: "choice",
    key: "wedding_timing",
    question: "¿Cuándo es vuestra boda?",
    summaryLabel: "Fecha aproximada",
    options: [
      { value: "2026" },
      { value: "2027" },
      { value: "2028" },
      { value: "Aún no tenemos fecha cerrada" },
    ],
  },
  {
    type: "text",
    key: "date",
    question: "¿Qué fecha o temporada tenéis en mente?",
    summaryLabel: "Fecha de la boda",
    placeholder: "Ej. septiembre 2027",
    autoComplete: "off",
    inputMode: "text",
    validate: (value) =>
      value.trim().length >= 2 ? "" : "Indica una fecha o temporada aproximada.",
  },
  {
    type: "text",
    key: "location",
    question: "¿Dónde será la celebración?",
    summaryLabel: "Lugar de la boda",
    placeholder: "Ciudad, finca o país",
    autoComplete: "off",
    inputMode: "text",
    validate: (value) =>
      value.trim().length >= 2 ? "" : "Cuéntame dónde será la celebración.",
  },
  {
    type: "choice",
    key: "celebration",
    question: "¿Qué tipo de celebración estáis preparando?",
    summaryLabel: "Tipo de celebración",
    options: [
      { value: "Boda completa" },
      { value: "Boda íntima" },
      { value: "Destination wedding" },
      { value: "Elopement" },
      { value: "Editorial o preboda" },
    ],
  },
  {
    type: "choice",
    key: "coverage",
    question: "¿Qué cobertura os interesa?",
    summaryLabel: "Cobertura",
    options: [
      { value: "Día completo" },
      { value: "Ceremonia + celebración" },
      { value: "Fin de semana completo" },
      { value: "Aún no lo sabemos" },
    ],
  },
  {
    type: "textarea",
    key: "message",
    question: "¿Qué os gustaría sentir al ver la galería?",
    summaryLabel: "Historia que quieren recordar",
    placeholder: "Cuéntame qué tipo de historia queréis recordar.",
    validate: (value) =>
      value.trim().length >= 10 ? "" : "Cuéntame un poco más para preparar la consulta.",
  },
];

const arrowIcon =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>';

const collectTrackingFields = () => {
  const params = new URLSearchParams(window.location.search);

  return TRACKING_FIELDS
    .map((key) => [key, params.get(key)])
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${value}`);
};

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

const closeBookingDialog = () => {
  if (!bookingDialog) return;

  if (typeof bookingDialog.close === "function" && bookingDialog.open) {
    bookingDialog.close();
  } else {
    bookingDialog.removeAttribute("open");
    document.body.classList.remove("dialog-is-open");
  }
};

const openBookingDialog = () => {
  if (!bookingDialog) return;

  setMenuState(false);

  if (typeof bookingDialog.showModal === "function") {
    bookingDialog.showModal();
  } else {
    bookingDialog.setAttribute("open", "");
  }

  document.body.classList.add("dialog-is-open");
  window.setTimeout(() => {
    bookingDialog.querySelector("input, textarea, button")?.focus({ preventScroll: true });
  }, 80);
};

bookingOpenButtons.forEach((button) => {
  button.addEventListener("click", openBookingDialog);
});

bookingCloseButton?.addEventListener("click", closeBookingDialog);

bookingDialog?.addEventListener("click", (event) => {
  if (event.target === bookingDialog) {
    closeBookingDialog();
  }
});

bookingDialog?.addEventListener("close", () => {
  document.body.classList.remove("dialog-is-open");
});

if (window.location.hash === "#booking") {
  window.setTimeout(openBookingDialog, 120);
}

window.addEventListener("hashchange", () => {
  if (window.location.hash === "#booking") {
    openBookingDialog();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenuState(false);
  }
});

const buildMailto = (form, answers) => {
  const recipient = form.dataset.recipient || "hello@quennie.studio";
  const subjectPrefix = form.dataset.subjectPrefix || "Consulta Quennie";
  const name = answers.name || "Nueva consulta";
  const lines = WEDDING_FORM_STEPS.map((step) => {
    const label = step.summaryLabel || step.question;
    return `${label}: ${answers[step.key] || ""}`;
  });
  const trackingLines = collectTrackingFields();

  lines.push("", `Página: ${window.location.href}`);
  lines.push(`Enviado: ${new Date().toLocaleString("es-ES")}`);

  if (trackingLines.length) {
    lines.push("", "Datos de origen:", ...trackingLines);
  }

  const subject = encodeURIComponent(`${subjectPrefix} - ${name}`);
  const body = encodeURIComponent(lines.join("\n"));

  return `mailto:${recipient}?subject=${subject}&body=${body}`;
};

const initStepForm = (form) => {
  const screen = form.querySelector("[data-form-screen]");
  const progress = form.querySelector("[data-form-progress]");
  const backButton = form.querySelector("[data-form-back]");
  const counter = form.querySelector("[data-form-counter]");
  const status = form.querySelector("[data-form-status]");

  if (!screen || !progress || !backButton || !counter) return;

  let index = 0;
  let direction = "next";
  let answers = {};
  let error = "";
  let isSubmitting = false;

  const setStatus = (message, isError = false) => {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("is-error", isError);
  };

  const setValue = (key, value) => {
    answers = { ...answers, [key]: value };
    if (error) {
      error = "";
      setStatus("");
    }
  };

  const finish = () => {
    isSubmitting = true;
    setStatus("Consulta preparada en tu cliente de email.");
    window.location.href = buildMailto(form, answers);
  };

  const render = () => {
    const total = WEDDING_FORM_STEPS.length;
    const step = WEDDING_FORM_STEPS[index];
    const value = answers[step.key] || "";
    const percentage = Math.round(((index + (isSubmitting ? 1 : 0)) / total) * 100);

    screen.innerHTML = "";
    progress.style.width = `${Math.max(percentage, 4)}%`;
    backButton.hidden = index === 0 || isSubmitting;
    counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

    const stepElement = document.createElement("section");
    stepElement.className = "zivo-form__step";
    stepElement.dataset.dir = direction;

    const brand = document.createElement("div");
    brand.className = "zivo-form__brand";
    brand.textContent = "QUENNIE";
    stepElement.append(brand);

    const question = document.createElement("h3");
    question.className = "zivo-form__question";
    question.id = `zivo-question-${step.key}`;
    question.textContent = step.question;
    stepElement.append(question);

    if (step.type === "text" || step.type === "textarea") {
      const field = document.createElement("div");
      field.className = "zivo-form__field";

      const input =
        step.type === "textarea" ? document.createElement("textarea") : document.createElement("input");
      input.name = step.key;
      input.value = value;
      input.placeholder = step.placeholder || "";
      input.autocomplete = step.autoComplete || "off";
      input.disabled = isSubmitting;
      input.setAttribute("aria-labelledby", question.id);
      input.setAttribute("aria-invalid", String(Boolean(error)));

      if (step.type === "text") {
        input.type = step.key === "email" ? "email" : "text";
        input.inputMode = step.inputMode || "text";
        input.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            advance();
          }
        });
      } else {
        input.rows = 4;
        input.addEventListener("keydown", (event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
            event.preventDefault();
            advance();
          }
        });
      }

      input.addEventListener("input", (event) => setValue(step.key, event.target.value));
      field.append(input);
      stepElement.append(field);

      const actions = document.createElement("div");
      actions.className = "zivo-form__actions";

      const submitButton = document.createElement("button");
      submitButton.className = "zivo-form__submit";
      submitButton.type = "button";
      submitButton.disabled = isSubmitting;
      submitButton.textContent =
        isSubmitting ? "Preparando..." : index === total - 1 ? "Enviar consulta" : "OK";
      submitButton.insertAdjacentHTML("beforeend", arrowIcon);
      submitButton.addEventListener("click", () => advance());
      actions.append(submitButton);

      if (step.type === "text" && !isSubmitting) {
        const keyboardHint = document.createElement("span");
        keyboardHint.className = "zivo-form__kbd";
        keyboardHint.innerHTML = 'pulsa <kbd>Enter ↵</kbd>';
        actions.append(keyboardHint);
      }

      stepElement.append(actions);
      window.setTimeout(() => input.focus({ preventScroll: true }), 90);
    }

    if (step.type === "choice") {
      const choices = document.createElement("div");
      choices.className = "zivo-form__choices";

      step.options.forEach((option) => {
        const selected = value === option.value;
        const button = document.createElement("button");
        button.type = "button";
        button.className = `zivo-form__choice${selected ? " is-selected" : ""}`;
        button.disabled = isSubmitting;

        const marker = document.createElement("span");
        marker.className = "zivo-form__choice-marker";
        marker.setAttribute("aria-hidden", "true");

        const label = document.createElement("span");
        label.textContent = option.value;

        button.append(marker, label);
        button.addEventListener("click", () => {
          setValue(step.key, option.value);
          choices.querySelectorAll(".zivo-form__choice").forEach((choice) => {
            choice.classList.remove("is-selected");
          });
          button.classList.add("is-selected");
          window.setTimeout(() => advance(option.value), 180);
        });
        choices.append(button);
      });

      stepElement.append(choices);
    }

    if (error) {
      const errorMessage = document.createElement("p");
      errorMessage.className = "zivo-form__error";
      errorMessage.role = "alert";
      errorMessage.textContent = error;
      stepElement.append(errorMessage);
    }

    screen.append(stepElement);
  };

  const advance = (overrideValue) => {
    if (isSubmitting) return;

    const step = WEDDING_FORM_STEPS[index];
    const current = overrideValue ?? answers[step.key] ?? "";
    const validationMessage = step.validate ? step.validate(String(current)) : "";

    if (validationMessage) {
      error = validationMessage;
      setStatus(validationMessage, true);
      render();
      return;
    }

    answers = { ...answers, [step.key]: String(current).trim() };
    error = "";
    setStatus("");

    if (index === WEDDING_FORM_STEPS.length - 1) {
      finish();
      render();
      return;
    }

    direction = "next";
    index += 1;
    render();
  };

  backButton.addEventListener("click", () => {
    if (index === 0 || isSubmitting) return;
    direction = "prev";
    index -= 1;
    error = "";
    setStatus("");
    render();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    advance();
  });

  render();
};

stepForms.forEach(initStepForm);

contactForms.forEach((form) => {
  if (form.matches("[data-step-form]")) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = data.get("name") || "";
    const email = data.get("email") || "";
    const subjectPrefix = form.dataset.subjectPrefix || "Consulta Quennie";
    const status = form.querySelector("[data-form-status]");
    const lines = [];

    for (const [key, value] of data.entries()) {
      const label = key
        .replace(/-/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
      lines.push(`${label}: ${value}`);
    }

    if (status) {
      status.textContent = "Consulta preparada en tu cliente de email.";
    }

    const subject = encodeURIComponent(`${subjectPrefix} - ${name}`);
    const body = encodeURIComponent(lines.join("\n"));
    const replyTo = email ? `&reply-to=${encodeURIComponent(email)}` : "";

    window.location.href = `mailto:hello@quennie.studio?subject=${subject}&body=${body}${replyTo}`;
  });
});
