const contactForms = document.querySelectorAll("[data-contact-form]");
const stepForms = document.querySelectorAll("[data-step-form]");
const bookingDialog = document.querySelector("[data-booking-dialog]");
const bookingOpenButtons = document.querySelectorAll("[data-booking-open]");
const bookingCloseButton = document.querySelector("[data-booking-close]");
const pageImages = document.querySelectorAll("img");

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
    type: "choice",
    key: "project_type",
    question: "¿Qué estás preparando?",
    summaryLabel: "Tipo de proyecto",
    options: [
      { value: "Boda" },
      { value: "Elopement" },
      { value: "Preboda o postboda" },
      { value: "Editorial" },
      { value: "Aún estoy explorando" },
    ],
  },
  {
    type: "choice",
    key: "wedding_timing",
    question: "¿Cuándo sería?",
    summaryLabel: "Fecha aproximada",
    options: [
      { value: "2026" },
      { value: "Primavera 2027" },
      { value: "Verano 2027" },
      { value: "Otoño 2027" },
      { value: "2028 o más adelante" },
      { value: "Aún sin fecha" },
    ],
  },
  {
    type: "choice",
    key: "date_status",
    question: "¿Cómo de cerrada está la fecha?",
    summaryLabel: "Estado de la fecha",
    options: [
      { value: "Fecha cerrada" },
      { value: "Tenemos temporada" },
      { value: "Estamos entre varias fechas" },
      { value: "Aún por decidir" },
    ],
  },
  {
    type: "choice",
    key: "location",
    question: "¿Dónde os imagináis la celebración?",
    summaryLabel: "Ubicación",
    options: [
      { value: "Madrid o alrededores" },
      { value: "España peninsular" },
      { value: "Baleares o Canarias" },
      { value: "Europa" },
      { value: "Destino internacional" },
      { value: "Aún por decidir" },
    ],
  },
  {
    type: "choice",
    key: "celebration",
    question: "¿Qué tipo de celebración será?",
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
    key: "guest_count",
    question: "¿Cuántas personas calculáis?",
    summaryLabel: "Invitados",
    options: [
      { value: "Menos de 30" },
      { value: "30-70" },
      { value: "70-120" },
      { value: "Más de 120" },
      { value: "Aún no lo sabemos" },
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
      { value: "Solo unas horas" },
      { value: "Aún no lo sabemos" },
    ],
  },
  {
    type: "choice",
    key: "gallery_mood",
    question: "¿Qué queréis sentir al ver la galería?",
    summaryLabel: "Sensación buscada",
    options: [
      { value: "Emoción y naturalidad" },
      { value: "Elegancia editorial" },
      { value: "Fiesta y movimiento" },
      { value: "Intimidad y calma" },
      { value: "Un poco de todo" },
    ],
  },
  {
    type: "text",
    key: "phone",
    question: "¿Cuál es tu número de teléfono?",
    summaryLabel: "Teléfono",
    placeholder: "+34 600 000 000",
    autoComplete: "tel",
    inputMode: "tel",
    inputType: "tel",
    validate: (value) =>
      value.replace(/\D/g, "").length >= 6 ? "" : "Introduce un número de teléfono válido.",
  },
  {
    type: "text",
    key: "name",
    question: "¿Cuál es tu nombre?",
    summaryLabel: "Nombre",
    placeholder: "Nombre y apellidos",
    autoComplete: "name",
    inputMode: "text",
    validate: (value) => (value.trim().length >= 2 ? "" : "Escribe tu nombre para continuar."),
  },
  {
    type: "text",
    key: "email",
    question: "¿A qué correo electrónico te escribo?",
    summaryLabel: "Correo electrónico",
    placeholder: "tu@correo.com",
    autoComplete: "email",
    inputMode: "email",
    inputType: "email",
    validate: (value) => (EMAIL_RE.test(value.trim()) ? "" : "Introduce un correo válido."),
  },
  {
    type: "choice",
    key: "contact_preference",
    question: "¿Cómo prefieres que te contacte?",
    summaryLabel: "Canal preferido",
    options: [
      { value: "Email" },
      { value: "WhatsApp" },
      { value: "Llamada" },
      { value: "Me da igual" },
    ],
  },
  {
    type: "text",
    key: "whatsapp",
    question: "¿Cuál es tu WhatsApp?",
    summaryLabel: "WhatsApp",
    placeholder: "Puede ser el mismo número",
    autoComplete: "tel",
    inputMode: "tel",
    inputType: "tel",
    validate: (value) =>
      value.replace(/\D/g, "").length >= 6 ? "" : "Introduce un WhatsApp válido.",
  },
];

const arrowIcon =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>';

const isWritableStep = (step) => step?.type === "text" || step?.type === "textarea";

const focusTextControl = (control) => {
  if (!control || control.disabled) return;

  const focus = () => {
    control.focus({ preventScroll: true });

    if (typeof control.setSelectionRange === "function") {
      const cursorPosition = control.value.length;
      control.setSelectionRange(cursorPosition, cursorPosition);
    }
  };

  focus();
  window.setTimeout(focus, 80);
};

const FALLBACK_PHOTOS = [
  "assets/photos/wedding-couple.jpg",
  "assets/photos/ceremony-flowers.jpg",
  "assets/photos/outdoor-wedding.jpg",
  "assets/photos/wedding-detail.jpg",
  "assets/photos/team-photographer.jpg",
  "assets/photos/couple-walk.jpg",
];
const FINAL_FALLBACK_PHOTO = `data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
    <defs>
      <linearGradient id="sky" x1="0" x2="1" y1="0" y2="1">
        <stop stop-color="#f7eee4" />
        <stop offset=".5" stop-color="#b6bfd4" />
        <stop offset="1" stop-color="#636d84" />
      </linearGradient>
      <linearGradient id="light" x1="0" x2="1">
        <stop stop-color="#ffffff" stop-opacity=".72" />
        <stop offset="1" stop-color="#ffffff" stop-opacity=".08" />
      </linearGradient>
    </defs>
    <rect width="1200" height="800" fill="url(#sky)" />
    <circle cx="930" cy="165" r="150" fill="#fff6df" opacity=".56" />
    <path d="M0 595c180-102 322-134 490-74 128 46 248 54 392-26 128-71 224-80 318-36v341H0z" fill="#2b3040" opacity=".38" />
    <path d="M162 218c94 76 204 89 335 39 92-35 163-33 214 8-116 20-215 63-298 128-98-75-181-100-251-175z" fill="url(#light)" opacity=".58" />
    <rect width="1200" height="800" fill="#141824" opacity=".08" />
  </svg>
`)}`;

pageImages.forEach((image, index) => {
  const fallbackPhoto = image.dataset.fallbackSrc || FALLBACK_PHOTOS[index % FALLBACK_PHOTOS.length];
  const fallbackQueue = [
    fallbackPhoto,
    ...FALLBACK_PHOTOS.filter((photo) => photo !== fallbackPhoto),
    FINAL_FALLBACK_PHOTO,
  ];
  let fallbackIndex = 0;

  const useFallbackPhoto = () => {
    const currentSource = image.currentSrc || image.getAttribute("src") || "";
    const nextFallback = fallbackQueue.find((photo, queueIndex) => {
      if (queueIndex < fallbackIndex) return false;
      return photo.startsWith("data:") || !currentSource.endsWith(photo);
    });

    if (!nextFallback) return;

    fallbackIndex = fallbackQueue.indexOf(nextFallback) + 1;
    image.dataset.fallbackApplied = "true";
    image.classList.add("image-fallback");
    image.src = nextFallback;
  };

  image.addEventListener("error", useFallbackPhoto);

  if (image.complete && image.naturalWidth === 0) {
    useFallbackPhoto();
  }
});

const collectTrackingFields = () => {
  const params = new URLSearchParams(window.location.search);

  return TRACKING_FIELDS
    .map((key) => [key, params.get(key)])
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${value}`);
};

const collectTrackingData = () => {
  const params = new URLSearchParams(window.location.search);

  return TRACKING_FIELDS.reduce((tracking, key) => {
    const value = params.get(key);
    if (value) {
      tracking[key] = value;
    }
    return tracking;
  }, {});
};

const getWebhookUrl = (form) => {
  const formWebhookUrl = form.dataset.webhookUrl?.trim();

  if (formWebhookUrl) return formWebhookUrl;
  if (typeof window.QUENNIE_WEBHOOK_URL === "string") {
    return window.QUENNIE_WEBHOOK_URL.trim();
  }

  return "";
};

const buildSubmissionPayload = (form, answers, steps = WEDDING_FORM_STEPS) => {
  const submittedAt = new Date();

  return {
    source: "quennie-portfolio",
    form: form.dataset.subjectPrefix || "Consulta Quennie",
    page: window.location.href,
    submittedAt: submittedAt.toISOString(),
    submittedAtLocal: submittedAt.toLocaleString("es-ES"),
    answers,
    summary: steps.map((step) => ({
      key: step.key,
      label: step.summaryLabel || step.question,
      value: answers[step.key] || "",
    })),
    tracking: collectTrackingData(),
    userAgent: window.navigator.userAgent,
  };
};

const postToWebhook = async (form, payload) => {
  const webhookUrl = getWebhookUrl(form);

  if (!webhookUrl) return false;

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    keepalive: true,
  });

  if (!response.ok) {
    throw new Error(`Webhook error: ${response.status}`);
  }

  return true;
};

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

const buildMailto = (form, answers) => {
  const recipient = form.dataset.recipient || "hello@quennie.studio";
  const subjectPrefix = form.dataset.subjectPrefix || "Consulta Quennie";
  const name = answers.name || answers.email || answers.phone || "Nueva consulta";
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

  const finish = async () => {
    isSubmitting = true;
    error = "";
    render();
    setStatus("Enviando consulta...");

    try {
      const payload = buildSubmissionPayload(form, answers);
      const sentToWebhook = await postToWebhook(form, payload);

      if (sentToWebhook) {
        setStatus("Consulta enviada. Te escribiremos pronto.");
      } else {
        setStatus("Consulta preparada en tu cliente de email.");
        window.location.href = buildMailto(form, answers);
      }
    } catch (submissionError) {
      console.error(submissionError);
      isSubmitting = false;
      error = "No se pudo enviar. Inténtalo de nuevo en unos segundos.";
      setStatus(error, true);
      render();
    }
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
    let controlToFocus = null;

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
        input.type = step.inputType || (step.key === "email" ? "email" : "text");
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
      controlToFocus = input;
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

          if (isWritableStep(WEDDING_FORM_STEPS[index + 1])) {
            advance(option.value);
          } else {
            window.setTimeout(() => advance(option.value), 180);
          }
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

    if (controlToFocus && !isSubmitting) {
      focusTextControl(controlToFocus);
    }
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

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const answers = Object.fromEntries(data.entries());
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
      status.textContent = "Enviando consulta...";
      status.classList.remove("is-error");
    }

    try {
      const sentToWebhook = await postToWebhook(form, buildSubmissionPayload(form, answers, []));

      if (sentToWebhook) {
        if (status) status.textContent = "Consulta enviada. Te escribiremos pronto.";
        return;
      }
    } catch (submissionError) {
      console.error(submissionError);
      if (status) {
        status.textContent = "No se pudo enviar. Inténtalo de nuevo en unos segundos.";
        status.classList.add("is-error");
      }
      return;
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
