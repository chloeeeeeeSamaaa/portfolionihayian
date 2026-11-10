/* =========================================
   0. LIGHT / DARK MODE
   The initial theme is set by the inline script in <head>.
   ========================================= */
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');

const getSavedTheme = () => {
  try {
    return localStorage.getItem("theme");
  } catch (e) {
    return null;
  }
};

const applyTheme = (theme) => {
  const isLight = theme === "light";
  root.setAttribute("data-theme", theme);
  themeToggle.querySelector("i").className = isLight ? "bx bx-moon" : "bx bx-sun";
  themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
  if (themeMeta) themeMeta.setAttribute("content", isLight ? "#fafafa" : "#09090b");
};

applyTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark");

themeToggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";

  root.classList.add("theme-transition");
  applyTheme(next);
  setTimeout(() => root.classList.remove("theme-transition"), 400);

  try {
    localStorage.setItem("theme", next);
  } catch (e) {
    /* storage blocked: theme still switches for this visit */
  }
});

// Follow the device's theme until the visitor picks one themselves
if (window.matchMedia) {
  const systemLight = window.matchMedia("(prefers-color-scheme: light)");
  const onSystemChange = (e) => {
    if (!getSavedTheme()) applyTheme(e.matches ? "light" : "dark");
  };
  if (systemLight.addEventListener) systemLight.addEventListener("change", onSystemChange);
}

/* =========================================
   1. HEADER BACKGROUND ON SCROLL
   ========================================= */
const header = document.getElementById("header");

const updateHeader = () => {
  header.classList.toggle("scrolled", window.scrollY > 10);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

/* =========================================
   2. MOBILE MENU
   ========================================= */
const menuBtn = document.getElementById("menu-icon");
const navbar = document.getElementById("navbar");
const navLinks = navbar.querySelectorAll("a");

const setMenu = (open) => {
  navbar.classList.toggle("active", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.querySelector("i").className = open ? "bx bx-x" : "bx bx-menu";
};

menuBtn.addEventListener("click", () => {
  setMenu(!navbar.classList.contains("active"));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

/* =========================================
   3. ACTIVE NAV LINK WHILE SCROLLING
   ========================================= */
const sections = document.querySelectorAll("section[id]");

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${entry.target.id}`
        );
      });
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);

sections.forEach((section) => navObserver.observe(section));

/* =========================================
   4. REVEAL ON SCROLL
   ========================================= */
const reveals = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

reveals.forEach((el) => revealObserver.observe(el));

/* =========================================
   5. TYPING EFFECT
   ========================================= */
if (window.Typed) {
  new Typed(".multiple-text", {
    strings: ["BSIT Student", "Web Developer", "Mobile App Developer", "AI-Assisted Developer"],
    typeSpeed: 70,
    backSpeed: 40,
    startDelay: 400,
    backDelay: 1800,
    smartBackspace: true,
    loop: true,
  });
} else {
  document.querySelector(".multiple-text").textContent = "Web Developer";
}

/* =========================================
   6. PROJECT MODAL
   ========================================= */
const modal = document.getElementById("projectModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalTags = document.getElementById("modalTags");
const modalFeatures = document.getElementById("modalFeatures");
const modalFeaturesLabel = document.getElementById("modalFeaturesLabel");
const modalLinks = document.getElementById("modalLinks");
const closeModalBtn = modal.querySelector(".close-modal");
let lastFocused = null;

const openModal = (card) => {
  const img = card.querySelector("img");
  const tags = card.querySelector(".tags");
  const features = card.querySelector(".feature-list");

  modalImage.src = img.src;
  modalImage.alt = img.alt;
  modalTitle.textContent = card.querySelector("h3").textContent;
  modalDescription.textContent = card.querySelector("p").textContent.trim();
  modalTags.innerHTML = tags ? tags.innerHTML : "";
  modalFeatures.innerHTML = features ? features.innerHTML : "";
  modalFeatures.hidden = modalFeaturesLabel.hidden = !features;

  // Repeat the card's GitHub / demo links inside the modal
  const links = card.querySelectorAll(".project-actions a");
  modalLinks.replaceChildren(...Array.from(links, (a) => a.cloneNode(true)));
  modalLinks.hidden = links.length === 0;

  lastFocused = document.activeElement;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  closeModalBtn.focus();
};

const closeModal = () => {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (lastFocused) lastFocused.focus();
};

document.querySelectorAll(".project-card").forEach((card) => {
  card.querySelector(".project-thumb").addEventListener("click", () => openModal(card));
  card.querySelector(".project-link").addEventListener("click", () => openModal(card));
});

closeModalBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
});

/* =========================================
   7. FOOTER YEAR
   ========================================= */
document.getElementById("year").textContent = new Date().getFullYear();

/* =========================================
   8. CONTACT FORM (EmailJS)
   ========================================= */
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const submitBtn = contactForm.querySelector('button[type="submit"]');
const submitLabel = submitBtn.innerHTML;

if (window.emailjs) {
  emailjs.init("a6xdIScX1qpLDyT2u");
}

const showStatus = (message, type) => {
  formStatus.textContent = message;
  formStatus.className = `form-status ${type}`;
};

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (name.length < 3) {
    showStatus("Please enter your full name.", "error");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showStatus("Please enter a valid email address.", "error");
    return;
  }

  if (message.length < 10) {
    showStatus("Your message should be at least 10 characters long.", "error");
    return;
  }

  if (!window.emailjs) {
    showStatus("The message service didn't load. Please email me directly instead.", "error");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";
  showStatus("", "");

  emailjs
    .send("service_b836pk3", "template_730vr64", {
      name,
      email,
      message,
      time: new Date().toLocaleString(),
    })
    .then(
      () => {
        showStatus("Message sent! I'll get back to you soon.", "success");
        contactForm.reset();
      },
      (error) => {
        showStatus("Something went wrong. Please try again or email me directly.", "error");
        console.error("EmailJS Error:", error);
      }
    )
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = submitLabel;
    });
});

/* =========================================
   9. FLIP PHOTO (formal <-> casual)
   Mouse: hover flips it, cursor tilts it, click flips it back.
   Touch / keyboard: tap or Enter/Space toggles it.
   ========================================= */
const photoFlip = document.getElementById("photoFlip");

if (photoFlip) {
  const canTilt = !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  const setFlipped = (on) => {
    photoFlip.classList.toggle("is-flipped", on);
    photoFlip.setAttribute("aria-pressed", String(on));
  };

  photoFlip.addEventListener("pointerenter", (e) => {
    if (e.pointerType === "mouse") setFlipped(true);
  });

  photoFlip.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse" || !canTilt) return;
    const rect = photoFlip.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    photoFlip.style.setProperty("--tilt-x", `${(-y * 12).toFixed(2)}deg`);
    photoFlip.style.setProperty("--tilt-y", `${(x * 12).toFixed(2)}deg`);
  });

  photoFlip.addEventListener("pointerleave", (e) => {
    if (e.pointerType !== "mouse") return;
    setFlipped(false);
    photoFlip.style.removeProperty("--tilt-x");
    photoFlip.style.removeProperty("--tilt-y");
  });

  photoFlip.addEventListener("click", () => {
    setFlipped(!photoFlip.classList.contains("is-flipped"));
  });
}
