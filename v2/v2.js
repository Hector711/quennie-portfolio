(() => {
  const VERSION_COOKIE = "quennie_version";
  const header = document.querySelector(".v2-header");
  const masthead = document.querySelector(".v2-masthead");
  const runningHead = document.querySelector("[data-running]");
  const sections = [...document.querySelectorAll("section[data-running-head]")];
  const navLinks = [...document.querySelectorAll(".v2-header__link")];
  const revealItems = [...document.querySelectorAll(".v2-reveal")];
  const markedPlates = [...document.querySelectorAll(".v2-plate[data-select]")];
  const plateFrames = [...document.querySelectorAll(".v2-plate__frame:has(.v2-mark)")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.cookie = `${VERSION_COOKIE}=v2; Max-Age=2592000; Path=/; SameSite=Lax`;

  if (window.location.hash === "#booking") {
    history.replaceState(null, "", `${window.location.pathname}${window.location.search}#reserva`);
    window.requestAnimationFrame(() => document.querySelector("#reserva")?.scrollIntoView());
  }

  const setScrolled = () => header?.classList.toggle("is-scrolled", window.scrollY > 8);
  let scrollFrame = 0;
  window.addEventListener(
    "scroll",
    () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        setScrolled();
        scrollFrame = 0;
      });
    },
    { passive: true }
  );
  setScrolled();

  if (header && masthead && "IntersectionObserver" in window) {
    const mastheadObserver = new IntersectionObserver(
      ([entry]) => {
        header.dataset.masthead = entry?.isIntersecting ? "in" : "out";
      },
      { threshold: 0.05 }
    );
    mastheadObserver.observe(masthead);
  } else if (header) {
    header.dataset.masthead = "out";
  }

  let runningTimer = 0;
  const setRunningHead = (section) => {
    if (!section || !runningHead) return;
    const next = section.dataset.runningHead || "";
    if (runningHead.textContent === next) return;

    const apply = () => {
      runningHead.textContent = next;
      runningHead.classList.remove("is-changing");
    };

    window.clearTimeout(runningTimer);
    if (reduceMotion) {
      apply();
    } else {
      runningHead.classList.add("is-changing");
      runningTimer = window.setTimeout(apply, 160);
    }

    navLinks.forEach((link) => {
      const current = link.getAttribute("href") === `#${section.id}`;
      if (current) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setRunningHead(visible.target);
      },
      { rootMargin: "-42% 0px -48% 0px", threshold: [0, 0.1, 0.5] }
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-in"));
    markedPlates.forEach((plate) => plate.classList.add("is-marked"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );
    revealItems.forEach((item) => revealObserver.observe(item));

    const markObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          window.setTimeout(() => entry.target.classList.add("is-marked"), 250);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    markedPlates.forEach((plate) => markObserver.observe(plate));
  }

  const makeMark = (frame) => {
    const svg = frame.querySelector(".v2-mark");
    const path = svg?.querySelector("path");
    if (!svg || !path) return;

    const pad = window.innerWidth < 640 ? 16 : 24;
    const inset = pad / -2;
    const width = Math.max(1, frame.clientWidth + pad);
    const height = Math.max(1, frame.clientHeight + pad);
    const x = (value) => (value / 100) * width;
    const y = (value) => (value / 100) * height;
    const d = [
      `M${x(10)} ${y(12)}`,
      `C${x(32)} ${y(1)} ${x(76)} ${y(0)} ${x(93)} ${y(11)}`,
      `C${x(103)} ${y(28)} ${x(102)} ${y(70)} ${x(91)} ${y(88)}`,
      `C${x(72)} ${y(100)} ${x(27)} ${y(100)} ${x(9)} ${y(88)}`,
      `C${x(-2)} ${y(71)} ${x(-1)} ${y(29)} ${x(11)} ${y(10)}`,
      `C${x(15)} ${y(6)} ${x(22)} ${y(4)} ${x(29)} ${y(3)}`,
    ].join(" ");

    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.style.inset = `${inset}px`;
    path.setAttribute("d", d);
    path.style.setProperty("--len", `${path.getTotalLength()}`);
  };

  plateFrames.forEach(makeMark);
  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => makeMark(entry.target));
    });
    plateFrames.forEach((frame) => resizeObserver.observe(frame));
  } else {
    let resizeFrame = 0;
    window.addEventListener(
      "resize",
      () => {
        window.cancelAnimationFrame(resizeFrame);
        resizeFrame = window.requestAnimationFrame(() => plateFrames.forEach(makeMark));
      },
      { passive: true }
    );
  }
})();
