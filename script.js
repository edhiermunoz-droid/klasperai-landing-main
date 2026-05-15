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

// ---------- COPY EMAIL FUNCTIONALITY ----------
(function initCopyEmail() {
  const emailLinks = document.querySelectorAll('a[href^="mailto:support@klasperai.com"]');
  
  emailLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Allow default mailto action for CTA buttons, but also copy to clipboard
      navigator.clipboard.writeText('support@klasperai.com').then(() => {
        // Optional: show a small toast or change text temporarily
        const originalText = link.textContent;
        if (!link.classList.contains('btn-outline') && !link.classList.contains('blog-card-cta')) {
            // Only change text for icon/footer links to avoid layout shift on main buttons
            link.title = "¡Email copiado al portapapeles!";
            setTimeout(() => { link.title = ""; }, 2000);
        }
      }).catch(err => {
        console.error('Failed to copy email: ', err);
      });
    });
  });
})();
// ---------- BETA MODAL LOGIC ----------
(function initBetaModal() {
  const modal = document.getElementById("betaModal");
  const closeBtn = document.getElementById("modalClose");
  const form = document.getElementById("betaForm");
  const formStep = document.getElementById("modalStepForm");
  const successStep = document.getElementById("modalStepSuccess");

  if (!modal) return;

  function openModal() {
    modal.classList.add("is-active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("is-active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Trigger from all Beta Buttons using Event Delegation (more robust)
  let activeTriggerType = 'download'; // 'download' or 'guide'

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

  // Form Submission
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("betaName").value;
      const email = document.getElementById("betaEmail").value;
      
      const payload = {
        name: name,
        email: email,
        source: activeTriggerType,
        timestamp: new Date().toISOString(),
        url: window.location.href
      };

      // Send to Webhook (n8n)
      fetch('https://webhookn8n.soursop-ia.com/webhook/e47e0784-97af-414f-9bd5-73145b519710', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors', // Standard for many webhooks to avoid CORS issues
        body: JSON.stringify(payload)
      }).catch(err => console.warn("Webhook background sync error:", err));

      console.log("Lead captured:", payload);
      localStorage.setItem("klasper_beta_converted", "true");

      if (activeTriggerType === 'guide') {
        formStep.innerHTML = `<h2>Redirigiendo...</h2><p>Gracias ${name}, estamos abriendo tu guía.</p>`;
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


