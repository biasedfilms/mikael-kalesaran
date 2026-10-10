(() => {
  "use strict";

  const root = document.documentElement;
  const body = document.body;
  const themeButton = document.querySelector(".theme-toggle");
  const themeStorageKey = "mikael-portfolio-theme";
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointerQuery = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  );
  const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
  let themeAnimationTimer = 0;

  const safelyReadTheme = () => {
    try {
      return window.localStorage.getItem(themeStorageKey) || "dark";
    } catch (_error) {
      return "dark";
    }
  };

  const setTheme = (theme, { persist = false } = {}) => {
    const normalizedTheme = theme === "light" ? "light" : "dark";
    if (normalizedTheme === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");

    if (themeColorMeta) {
      themeColorMeta.setAttribute(
        "content",
        normalizedTheme === "light" ? "#f3f0ec" : "#121114",
      );
    }

    if (themeButton) {
      const nextTheme = normalizedTheme === "light" ? "dark" : "light";
      const label = `Switch to ${nextTheme} theme`;
      themeButton.setAttribute("aria-label", label);
      themeButton.setAttribute("title", label);
    }

    if (persist) {
      try {
        window.localStorage.setItem(themeStorageKey, normalizedTheme);
      } catch (_error) {
        // The theme still changes for the current visit if storage is unavailable.
      }
    }
  };

  setTheme(safelyReadTheme());

  themeButton?.addEventListener("click", () => {
    const nextTheme =
      root.getAttribute("data-theme") === "light" ? "dark" : "light";
    setTheme(nextTheme, { persist: true });

    if (!motionQuery.matches) {
      window.clearTimeout(themeAnimationTimer);
      themeButton.classList.remove("is-switching");
      // Restarting the class gives the icon a reliable animation on repeated clicks.
      void themeButton.offsetWidth;
      themeButton.classList.add("is-switching");
      themeAnimationTimer = window.setTimeout(
        () => themeButton.classList.remove("is-switching"),
        650,
      );
    }
  });

  // Pick a reveal style by content role. The markup stays semantic and content remains visible
  // when JavaScript is disabled, an observer fails, or reduced motion is requested.
  const revealStyleFor = (element) => {
    if (element.matches(".hero-title, .contact-main")) return "clip";
    if (element.matches(".hero-visual")) return "scale";
    if (element.matches(".about-story, .service-row")) return "left";
    if (element.matches(".toolkit-panel")) return "right";
    if (element.matches(".project-card")) return "card";
    return "up";
  };

  revealItems.forEach((item) => {
    if (!item.dataset.reveal || item.dataset.reveal === "true") {
      item.dataset.reveal = revealStyleFor(item);
    }
  });

  let revealObserver = null;
  const revealEverything = () => {
    root.classList.remove("motion-ready");
    revealItems.forEach((item) => item.classList.add("is-visible"));
    revealObserver?.disconnect();
    revealObserver = null;
  };

  const setupReveals = () => {
    revealObserver?.disconnect();
    revealObserver = null;

    if (
      motionQuery.matches ||
      !("IntersectionObserver" in window) ||
      !revealItems.length
    ) {
      revealEverything();
      return;
    }

    // Only opt into hidden-before-reveal styles after the observer is ready to run.
    root.classList.add("motion-ready");
    const pendingRevealItems = revealItems.filter(
      (item) => !item.classList.contains("is-visible"),
    );

    revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.06,
        rootMargin: "0px 0px -6% 0px",
      },
    );

    pendingRevealItems.forEach((item) => revealObserver.observe(item));

    // A guard for browser quirks, late layout shifts, or a throttled observer. It only reveals
    // content near the viewport, so off-screen sections still animate naturally when reached.
    window.setTimeout(() => {
      if (!root.classList.contains("motion-ready")) return;
      revealItems.forEach((item) => {
        if (item.classList.contains("is-visible")) return;
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight * 1.12 && rect.bottom > -40) {
          item.classList.add("is-visible");
          revealObserver?.unobserve(item);
        }
      });
    }, 1600);
  };

  setupReveals();
  motionQuery.addEventListener?.("change", setupReveals);

  // Current section indicator. A compact center band prevents navigation from jumping between
  // adjacent sections when headings sit close to a viewport edge.
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const observedSections = Array.from(
    document.querySelectorAll("main section[id]"),
  );
  if (
    "IntersectionObserver" in window &&
    navLinks.length &&
    observedSections.length
  ) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            const current = link.getAttribute("href") === `#${entry.target.id}`;
            if (current) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-30% 0px -56% 0px", threshold: 0 },
    );
    observedSections.forEach((section) => sectionObserver.observe(section));
  }

  // Scroll progress and the header's elevated state share one rAF update to stay inexpensive.
  let scrollFramePending = false;
  const header = document.querySelector(".site-header");
  const updateScrollChrome = () => {
    const scrollableHeight = root.scrollHeight - window.innerHeight;
    const progress =
      scrollableHeight > 0
        ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight))
        : 0;
    root.style.setProperty("--progress", progress.toFixed(4));
    header?.classList.toggle("is-scrolled", window.scrollY > 28);
    scrollFramePending = false;
  };
  const requestScrollUpdate = () => {
    if (scrollFramePending) return;
    scrollFramePending = true;
    window.requestAnimationFrame(updateScrollChrome);
  };
  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate, { passive: true });
  updateScrollChrome();

  // A restrained pointer tilt and local highlight gives the project artwork depth on desktop.
  // Touch and reduced-motion users get the same content without pointer-driven movement.
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  if (finePointerQuery.matches && !motionQuery.matches) {
    document.querySelectorAll(".project-card").forEach((card) => {
      const art = card.querySelector(".project-art");
      if (!art) return;

      card.addEventListener(
        "pointermove",
        (event) => {
          if (event.pointerType === "touch") return;
          const rect = card.getBoundingClientRect();
          const x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
          const y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
          const artRect = art.getBoundingClientRect();
          const spotX = clamp(
            ((event.clientX - artRect.left) / artRect.width) * 100,
            0,
            100,
          );
          const spotY = clamp(
            ((event.clientY - artRect.top) / artRect.height) * 100,
            0,
            100,
          );

          card.style.setProperty(
            "--tilt-x",
            `${((0.5 - y) * 2.2).toFixed(2)}deg`,
          );
          card.style.setProperty(
            "--tilt-y",
            `${((x - 0.5) * 2.8).toFixed(2)}deg`,
          );
          art.style.setProperty("--spot-x", `${spotX.toFixed(1)}%`);
          art.style.setProperty("--spot-y", `${spotY.toFixed(1)}%`);
          card.classList.add("is-tilting");
        },
        { passive: true },
      );

      card.addEventListener("pointerleave", () => {
        card.classList.remove("is-tilting");
        card.style.removeProperty("--tilt-x");
        card.style.removeProperty("--tilt-y");
        art.style.removeProperty("--spot-x");
        art.style.removeProperty("--spot-y");
      });
    });

    const heroVisual = document.querySelector(".hero-visual");
    const portrait = heroVisual?.querySelector(".portrait-frame");
    if (heroVisual && portrait) {
      heroVisual.addEventListener(
        "pointermove",
        (event) => {
          if (event.pointerType === "touch") return;
          const rect = portrait.getBoundingClientRect();
          const x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
          const y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
          portrait.style.setProperty(
            "--portrait-tilt-x",
            `${((0.5 - y) * 4).toFixed(2)}deg`,
          );
          portrait.style.setProperty(
            "--portrait-tilt-y",
            `${((x - 0.5) * 5).toFixed(2)}deg`,
          );
          portrait.classList.add("is-tilting");
        },
        { passive: true },
      );

      heroVisual.addEventListener("pointerleave", () => {
        portrait.classList.remove("is-tilting");
        portrait.style.removeProperty("--portrait-tilt-x");
        portrait.style.removeProperty("--portrait-tilt-y");
      });
    }
  }

  // A concise enhancement for browser tab and footer date without assuming this script always runs.
  const year = document.getElementById("current-year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
