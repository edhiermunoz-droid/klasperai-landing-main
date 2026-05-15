/* ========================================================
   KlasperAI — Script (Arcane-inspired)
   ======================================================== */

// ---------- THEME TOGGLE ----------
(function initTheme() {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;

  function getTheme() {
    return document.documentElement.getAttribute("data-theme") || "dark";
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("klasper_theme", theme);
    toggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Cambiar a modo luz" : "Cambiar a modo oscuro"
    );
  }

  toggle.addEventListener("click", () => {
    setTheme(getTheme() === "dark" ? "light" : "dark");
  });

  // Sync aria-label on load without writing to localStorage
  const current = getTheme();
  toggle.setAttribute(
    "aria-label",
    current === "dark" ? "Cambiar a modo luz" : "Cambiar a modo oscuro"
  );

  // Follow system preference when no manual override is saved
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("klasper_theme")) {
      document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");
    }
  });
})();

// ---------- STARFIELD CANVAS ----------
(function initStarfield() {
  const canvas = document.getElementById("starfield");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h, stars = [];
  const STAR_COUNT = 180;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.3,
        alpha: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.0008 + 0.0003,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  function draw(time) {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      const flicker = Math.sin(time * s.speed * 1000 + s.phase) * 0.3 + 0.7;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 180, 255, ${s.alpha * flicker})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  resize();
  createStars();
  requestAnimationFrame(draw);

  window.addEventListener("resize", () => {
    resize();
    createStars();
  });
})();

// ---------- SMOOTH SCROLL ----------
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");
    if (!targetId || targetId === "#") return;
    const target = document.querySelector(targetId);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    // Close mobile nav if open
    const nav = document.getElementById("mainNav");
    if (nav) nav.classList.remove("nav-open");
  });
});

// ---------- YEAR ----------
const yearNode = document.getElementById("year");
if (yearNode) yearNode.textContent = String(new Date().getFullYear());

// ---------- SCROLL REVEAL (Intersection Observer) ----------
const revealSelectors = [
  ".hero-text",
  ".portal-wrap",
  ".stats-row",
  ".quote",
  ".section-label",
  ".section-title",
  ".section-desc",
  ".features-grid",
  ".process-step",
  ".evidence-card",
  ".compare-card",
  ".testimonial-card",
  ".testimonial-card-v2",
  ".pain-card",
  ".pain-bridge",
  ".cta-buttons",
  ".trust-indicators",
  ".lead-magnet",
  ".blog-card",
];

const revealNodes = document.querySelectorAll(revealSelectors.join(","));

if ("IntersectionObserver" in window && revealNodes.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealNodes.forEach((node) => observer.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
}

// Hero visible immediately
requestAnimationFrame(() => {
  document.querySelectorAll(".hero-text, .portal-wrap").forEach((node) => {
    node.classList.add("is-visible");
  });
});

// ---------- NAVBAR SCROLL EFFECT ---------- 
const topbar = document.getElementById("topbar");
if (topbar) {
  window.addEventListener("scroll", () => {
    topbar.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });
}

// ---------- MOBILE MENU ----------
const menuBtn = document.getElementById("menuBtn");
const mainNav = document.getElementById("mainNav");
if (menuBtn && mainNav) {
  // Set initial ARIA state
  menuBtn.setAttribute("aria-expanded", "false");
  
  menuBtn.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("nav-open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  });
}



// ---------- STICKY MOBILE CTA ----------
(function initStickyCta() {
  const cta = document.getElementById("stickyCta");
  const hero = document.querySelector(".hero");
  const finalSection = document.getElementById("final");
  if (!cta || !hero) return;

  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY > hero.offsetHeight * 0.55;
    const finalRect = finalSection ? finalSection.getBoundingClientRect() : null;
    const pastFinal = finalRect && finalRect.top < window.innerHeight * 0.85;

    if (scrolled && !pastFinal) {
      cta.classList.add("is-active");
      cta.setAttribute("aria-hidden", "false");
    } else {
      cta.classList.remove("is-active");
      cta.setAttribute("aria-hidden", "true");
    }
  }, { passive: true });
})();

// Email links are handled natively by mailto:

// ---------- BETA MODAL LOGIC ----------
(function initBetaModal() {
  const modal = document.getElementById("betaModal");
  const closeBtn = document.getElementById("modalClose");
  const form = document.getElementById("betaForm");
  const formStep = document.getElementById("modalStepForm");
  const successStep = document.getElementById("modalStepSuccess");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");

  if (!modal) return;

  let activeTriggerType = 'download'; // 'download' or 'guide'

  function updateModalContent() {
    if (!modalTitle || !modalDesc) return;
    const isES = !window.KlasperI18n || window.KlasperI18n.getLanguage() === 'es';
    if (activeTriggerType === 'guide') {
      modalTitle.textContent = isES ? 'Recibe la Guía Gratis' : 'Get the Free Guide';
      modalDesc.textContent  = isES
        ? 'Déjanos tu correo y te enviamos la guía interactiva de inmediato.'
        : 'Leave your email and we\'ll send you the interactive guide immediately.';
    } else {
      modalTitle.textContent = isES ? 'Acceso Beta Exclusivo' : 'Exclusive Beta Access';
      modalDesc.textContent  = isES
        ? 'Déjanos tu nombre y correo para recibir noticias y desbloquear tu enlace de descarga para iOS.'
        : 'Leave your name and email to receive news and unlock your download link for iOS.';
    }
  }

  function openModal() {
    updateModalContent();
    modal.classList.add("is-active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("is-active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".trigger-beta-modal");
    if (btn) {
      e.preventDefault();
      activeTriggerType = btn.classList.contains('lead-magnet-btn') ? 'guide' : 'download';
      openModal();
    }
  });

  // Auto-open for mobile after 12 seconds (if not closed)
  const isMobile = window.innerWidth <= 768;
  const hasSeenModal = localStorage.getItem("klasper_beta_modal_seen");

  if (isMobile && !hasSeenModal) {
    setTimeout(() => {
      activeTriggerType = 'download';
      openModal();
      localStorage.setItem("klasper_beta_modal_seen", "true");
    }, 12000);
  }

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Form validation helpers
  function showError(inputEl, errorEl, msg) {
    inputEl.classList.add("input-error");
    errorEl.textContent = msg;
    errorEl.style.display = "block";
  }

  function clearError(inputEl, errorEl) {
    inputEl.classList.remove("input-error");
    errorEl.style.display = "none";
  }

  // Form Submission
  if (form) {
    const nameInput  = document.getElementById("betaName");
    const emailInput = document.getElementById("betaEmail");
    const nameError  = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const submitBtn  = form.querySelector("button[type='submit']");

    nameInput.addEventListener("input", () => clearError(nameInput, nameError));
    emailInput.addEventListener("input", () => clearError(emailInput, emailError));

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const isES = !window.KlasperI18n || window.KlasperI18n.getLanguage() === 'es';
      const name  = nameInput.value.trim();
      const email = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let valid = true;

      if (name.length < 2) {
        showError(nameInput, nameError, isES ? 'Ingresa al menos 2 caracteres.' : 'Enter at least 2 characters.');
        valid = false;
      }
      if (!emailRegex.test(email)) {
        showError(emailInput, emailError, isES ? 'Ingresa un correo válido.' : 'Enter a valid email.');
        valid = false;
      }
      if (!valid) return;

      // Loading state
      const originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = isES ? 'Enviando...' : 'Sending...';

      const payload = {
        name,
        email,
        source: activeTriggerType,
        timestamp: new Date().toISOString(),
        url: window.location.href
      };

      fetch('https://webhookn8n.soursop-ia.com/webhook/e47e0784-97af-414f-9bd5-73145b519710', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify(payload)
      }).catch(err => console.warn("Webhook background sync error:", err)).finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      });

      console.log("Lead captured:", payload);
      localStorage.setItem("klasper_beta_converted", "true");

      if (activeTriggerType === 'guide') {
        formStep.innerHTML = `<h2>${isES ? 'Redirigiendo...' : 'Redirecting...'}</h2><p>${isES ? `Gracias ${name}, estamos abriendo tu guía.` : `Thanks ${name}, opening your guide.`}</p>`;
        setTimeout(() => {
          window.location.href = 'guia.html';
        }, 1500);
      } else {
        formStep.classList.add("hidden");
        successStep.classList.remove("hidden");
      }
    });
  }
})();


