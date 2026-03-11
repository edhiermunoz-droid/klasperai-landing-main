/* ========================================================
   KlasperAI — Script (Arcane-inspired)
   ======================================================== */

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
  menuBtn.addEventListener("click", () => {
    mainNav.classList.toggle("nav-open");
  });
}

// ---------- URGENCY BAR ----------
(function initUrgencyBar() {
  const bar = document.getElementById("urgency-bar");
  const closeBtn = document.getElementById("urgencyClose");
  if (!bar) return;

  document.body.classList.add("has-urgency-bar");

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      bar.classList.add("hidden");
      document.body.classList.remove("has-urgency-bar");
    });
  }
})();

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
