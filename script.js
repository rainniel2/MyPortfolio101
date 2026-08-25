const root = document.documentElement;
const themeBtn = document.getElementById("themeBtn");
const themeIcon = document.getElementById("themeIcon");
const themeLabel = document.getElementById("themeLabel");
const quoteBtn = document.getElementById("quoteBtn");
const quoteBox = document.getElementById("quoteBox");
const quoteText = document.getElementById("quoteText");
const typedRole = document.getElementById("typedRole");
const phTime = document.getElementById("phTime");
const bottomNavItems = document.querySelectorAll(".bottom-nav-item");
const contactFooter = document.querySelector(".contact-footer");

const pageName = (function () {
  let path = window.location.pathname;

  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }

  const rawName = path.split("/").pop() || "index";

  return (rawName.replace(/\.html$/i, "") || "index").toLowerCase();
})();
const isHomePage = pageName === "index";

if (contactFooter) {
  const footerObserver = new IntersectionObserver(
    function (entries) {
      document.body.classList.toggle(
        "footer-in-view",
        entries[0].isIntersecting,
      );
      updateActiveNav();
    },
    { threshold: 0.12 },
  );

  footerObserver.observe(contactFooter);
}
const fallbackQuotes = [
  "Good design makes the difficult feel clear.",
  "Simple ideas become meaningful when they are made with care.",
  "Creativity begins where curiosity refuses to stop.",
  "Small improvements can completely change the experience.",
  "Build what helps people, then make it easier to use.",
  "The best work balances purpose, clarity, and character.",
  "Trying something unfamiliar is often where better ideas begin.",
];

function getFallbackQuote() {
  const day = Math.floor(Date.now() / 86400000);
  return fallbackQuotes[day % fallbackQuotes.length];
}

const labelTimers = new WeakMap();

function revealBottomLabel(item) {
  if (!item) return;

  const previousTimer = labelTimers.get(item);
  if (previousTimer) {
    clearTimeout(previousTimer);
  }

  item.classList.add("label-visible");

  const timer = setTimeout(function () {
    item.classList.remove("label-visible");
    labelTimers.delete(item);
  }, 950);

  labelTimers.set(item, timer);
}

bottomNavItems.forEach(function (item) {
  item.addEventListener("pointerdown", function () {
    revealBottomLabel(item);
  });

  item.addEventListener("click", function () {
    revealBottomLabel(item);
  });
});

function updateThemeButton() {
  if (!themeBtn) return;

  const isDark = root.classList.contains("dark");
  themeBtn.setAttribute("aria-pressed", String(isDark));
  themeBtn.setAttribute(
    "aria-label",
    isDark ? "Switch to creative mode" : "Switch to tech mode",
  );
  themeBtn.classList.toggle("is-on", isDark);

  if (themeIcon) {
    themeIcon.className = "dock-png dock-mode-image";
    themeIcon.src = isDark ? "image/icon/spark.png" : "image/icon/hexagon.png";
  }

  if (themeLabel) {
    themeLabel.textContent = isDark ? "Creative Mode" : "Tech Mode";
  }
}

function updatePhilippineTime() {
  if (!phTime) return;

  phTime.textContent =
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Manila",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(new Date()) + " PHT";
}

updatePhilippineTime();
setInterval(updatePhilippineTime, 1000);

if (themeBtn) {
  updateThemeButton();

  themeBtn.addEventListener("click", function () {
    root.classList.toggle("dark");

    try {
      localStorage.setItem(
        "theme",
        root.classList.contains("dark") ? "dark" : "light",
      );
    } catch (error) {
      console.warn("Theme preference could not be saved.");
    }

    updateThemeButton();
    resetTypewriter();
  });
}

/* ================================================================
   RESUME DOWNLOAD
   Creative Mode (light) -> Graphics Resume
   Tech Mode (dark) -> Tech Resume
   ================================================================ */
(function () {
  "use strict";

  const resumeFiles = {
    creative: "file/rainniel-villela-graphics-resume.pdf",
    tech: "file/rainniel-villela-tech-resume.pdf",
  };

  function getCurrentResume() {
    return root.classList.contains("dark")
      ? resumeFiles.tech
      : resumeFiles.creative;
  }

  function downloadCurrentResume(event) {
    if (event) event.preventDefault();

    const resumePath = getCurrentResume();
    const fileName = resumePath.split("/").pop();

    const downloadLink = document.createElement("a");
    downloadLink.href = resumePath;
    downloadLink.download = fileName;
    downloadLink.style.display = "none";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
  }

  const resumeLinks = [
    document.getElementById("resumeDownload"),
    document.getElementById("passResumeLink"),
  ].filter(Boolean);

  resumeLinks.forEach(function (link) {
    link.removeAttribute("target");
    link.removeAttribute("rel");
    link.setAttribute("download", "");

    link.addEventListener("click", downloadCurrentResume);
  });

  function updateResumeLinks() {
    const resumePath = getCurrentResume();

    resumeLinks.forEach(function (link) {
      link.href = resumePath;
      link.setAttribute("download", resumePath.split("/").pop());
    });
  }

  updateResumeLinks();

  const resumeThemeObserver = new MutationObserver(function () {
    updateResumeLinks();
  });

  resumeThemeObserver.observe(root, {
    attributes: true,
    attributeFilter: ["class"],
  });
})();

document.querySelectorAll(".nav-link").forEach(function (link) {
  link.addEventListener("click", function () {
    closeQuote();
  });
});

/* ================================================================
   ABOUT NAV LINK — NO #about IN THE URL
   href="/" is the plain fallback (About is the first thing on the
   home page anyway). If we're already on the home page, intercept
   the click and smooth-scroll to the top instead of letting the
   browser reload "/", so there's no jump/flash and never a hash.
   ================================================================ */
document
  .querySelectorAll('.nav-link[data-nav="about"]')
  .forEach(function (link) {
    link.addEventListener("click", function (event) {
      if (!isHomePage) return;

      event.preventDefault();

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  });

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeQuote();
  }
});

function updateActiveNav() {
  const links = document.querySelectorAll(".nav-link");
  let active = "about";

  if (pageName === "work") {
    active = "work";
  } else if (pageName === "skill") {
    active = "skill";
  } else if (isHomePage) {
    const workSection = document.getElementById("work");
    const skillSection = document.getElementById("skill");
    const contactSection = document.getElementById("contact");
    const position = window.scrollY + 220;
    const contactRect = contactSection?.getBoundingClientRect();
    const contactIsVisible =
      document.body.classList.contains("footer-in-view") ||
      (contactRect &&
        contactRect.top <= window.innerHeight * 0.76 &&
        contactRect.bottom > 0);

    if (contactIsVisible) {
      active = "";
    } else if (
      workSection &&
      skillSection &&
      position >= workSection.offsetTop &&
      position < skillSection.offsetTop
    ) {
      active = "work";
    } else if (
      skillSection &&
      position >= skillSection.offsetTop &&
      (!contactSection || position < contactSection.offsetTop)
    ) {
      active = "skill";
    }
  }

  links.forEach(function (link) {
    const isActive = link.dataset.nav === active;

    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function getTodayKey() {
  const today = new Date();

  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
}

function getSavedQuote() {
  try {
    return JSON.parse(localStorage.getItem("dailyQuote") || "null");
  } catch (error) {
    return null;
  }
}

function saveQuote(quote) {
  try {
    localStorage.setItem("dailyQuote", JSON.stringify(quote));
  } catch (error) {
    console.warn("Quote could not be saved.");
  }
}

function isSafeQuote(text) {
  const blockedWords = [
    "suicide",
    "kill",
    "murder",
    "death",
    "dead",
    "die",
    "war",
    "blood",
    "hate",
    "hell",
    "weapon",
    "pain",
  ];
  const cleanText = text.toLowerCase();

  return !blockedWords.some(function (word) {
    return cleanText.includes(word);
  });
}

function isRelevantQuote(text) {
  const goodWords = [
    "create",
    "creative",
    "design",
    "learn",
    "kind",
    "love",
    "hope",
    "success",
    "wisdom",
    "work",
    "idea",
    "life",
    "dream",
    "purpose",
    "happiness",
    "courage",
    "better",
    "good",
    "inspire",
  ];
  const cleanText = text.toLowerCase();

  return goodWords.some(function (word) {
    return cleanText.includes(word);
  });
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(function () {
    controller.abort();
  }, 7000);

  try {
    return await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
    });
  } finally {
    clearTimeout(timer);
  }
}

async function getQuote() {
  const savedQuote = getSavedQuote();

  if (
    savedQuote &&
    savedQuote.date === getTodayKey() &&
    savedQuote.text &&
    isSafeQuote(savedQuote.text) &&
    isRelevantQuote(savedQuote.text)
  ) {
    return savedQuote.text;
  }

  const response = await fetchWithTimeout(
    "https://dummyjson.com/quotes?limit=100",
  );

  if (!response.ok) {
    throw new Error("Quote request failed");
  }

  const data = await response.json();
  const quotes = data.quotes || [];
  const cleanQuotes = quotes.filter(function (item) {
    return item.quote && isSafeQuote(item.quote) && isRelevantQuote(item.quote);
  });

  if (!cleanQuotes.length) {
    throw new Error("No clean quote found");
  }

  const day = Math.floor(Date.now() / 86400000);
  const quote = cleanQuotes[day % cleanQuotes.length].quote;

  saveQuote({
    date: getTodayKey(),
    text: quote,
  });

  return quote;
}

function positionQuote() {
  if (!quoteBtn || !quoteBox) return;

  const icon = quoteBtn.getBoundingClientRect();
  const boxWidth = quoteBox.offsetWidth;
  const boxHeight = quoteBox.offsetHeight;
  const gap = 14;
  const sideLayout = false;

  quoteBox.classList.remove("above", "below", "side");

  if (sideLayout) {
    const left = icon.right + gap;
    let top = icon.top + icon.height / 2 - boxHeight / 2;

    top = Math.max(20, Math.min(top, window.innerHeight - boxHeight - 20));

    quoteBox.classList.add("side");
    quoteBox.style.left = left + "px";
    quoteBox.style.top = top + "px";
    quoteBox.style.setProperty(
      "--arrow-top",
      icon.top + icon.height / 2 - top + "px",
    );
    return;
  }

  let left = icon.left + icon.width / 2 - boxWidth / 2;

  left = Math.max(20, Math.min(left, window.innerWidth - boxWidth - 20));

  let top = icon.bottom + gap;

  quoteBox.classList.add("below");

  if (top + boxHeight > window.innerHeight - 20) {
    top = icon.top - boxHeight - gap;
    quoteBox.classList.remove("below");
    quoteBox.classList.add("above");
  }

  quoteBox.style.left = left + "px";
  quoteBox.style.top = top + "px";
  quoteBox.style.setProperty(
    "--arrow-left",
    icon.left + icon.width / 2 - left + "px",
  );
}

async function openQuote() {
  if (!quoteBox || !quoteText || !quoteBtn) return;

  quoteText.textContent = "Finding today's quote...";
  quoteBox.classList.add("show");
  quoteBtn.setAttribute("aria-expanded", "true");
  positionQuote();

  try {
    quoteText.textContent = await getQuote();
  } catch (error) {
    quoteText.textContent = getFallbackQuote();
  }

  try {
    sessionStorage.setItem("quoteOpened", "yes");
  } catch (error) {
    console.warn("Quote status could not be saved.");
  }

  quoteBtn.classList.remove("has-alert");
  positionQuote();
}

function closeQuote() {
  quoteBox?.classList.remove("show");
  quoteBtn?.setAttribute("aria-expanded", "false");
}

if (quoteBtn && quoteBox) {
  let quoteWasOpened = false;

  try {
    quoteWasOpened = sessionStorage.getItem("quoteOpened") === "yes";
  } catch (error) {
    quoteWasOpened = false;
  }

  if (!quoteWasOpened) {
    quoteBtn.classList.add("has-alert");
  }

  quoteBtn.addEventListener("click", function () {
    if (quoteBox.classList.contains("show")) {
      closeQuote();
    } else {
      openQuote();
    }
  });
}

document.addEventListener("click", function (event) {
  if (
    quoteBox &&
    quoteBtn &&
    !quoteBox.contains(event.target) &&
    !quoteBtn.contains(event.target)
  ) {
    closeQuote();
  }
});

const creativeRoles = [
  "BSIT Graduate",
  "Graphic Designer",
  "Social Media Manager",
];
const techRoles = creativeRoles;

let roleIndex = 0;
let letterIndex = 0;
let deleting = false;
let typeTimer;

function getRoles() {
  return root.classList.contains("dark") ? techRoles : creativeRoles;
}

function resetTypewriter() {
  clearTimeout(typeTimer);
  roleIndex = 0;
  letterIndex = 0;
  deleting = false;

  if (typedRole) {
    typedRole.textContent = "";
    typeRole();
  }
}

function typeRole() {
  if (!typedRole) return;

  const roles = getRoles();
  const role = roles[roleIndex];

  if (deleting) {
    letterIndex -= 1;
  } else {
    letterIndex += 1;
  }

  typedRole.textContent = role.substring(0, letterIndex);

  if (!deleting && letterIndex === role.length) {
    deleting = true;
    typeTimer = setTimeout(typeRole, 1200);
    return;
  }

  if (deleting && letterIndex === 0) {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
  }

  typeTimer = setTimeout(typeRole, deleting ? 45 : 85);
}

let ticking = false;

window.addEventListener("scroll", function () {
  if (ticking) return;

  ticking = true;

  window.requestAnimationFrame(function () {
    updateActiveNav();
    closeQuote();
    ticking = false;
  });
});

window.addEventListener("resize", function () {
  if (quoteBox?.classList.contains("show")) {
    positionQuote();
  }
});

window.addEventListener("hashchange", updateActiveNav);

updateActiveNav();
typeRole();

/* Bryllim-style page and scroll entrance */
(function () {
  function startEntranceAnimation() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const selector = [
      ".hero .profile-square",
      ".hero .intro-text > :not(.socials)",
      ".hero .socials a",

      ".resume-heading p",
      ".resume-entry",

      ".section-heading > *",
      ".work-five",
      ".tech-project",

      ".skill-top > *",
      ".creative-skill-block > h3",
      ".creative-skill-list > span",
      ".creative-tool-list > div",
      ".skill-clean-column > h3",
      ".clean-pills > span",
      ".tool-icons > *",

      ".contact-top > *",
      ".contact-actions a",

      ".work-page > h1",
      ".work-page > .page-intro",
      ".work-page .project-card",

      ".skill-page > h1",
      ".skill-page > .page-intro",
      ".skill-page .full-skill-group > h2",
      ".skill-page .tool-grid > div",
      ".skill-page .full-skill-list > span",
    ].join(",");

    const items = [...new Set(document.querySelectorAll(selector))];

    items.forEach(function (item) {
      item.classList.add("page-enter-item");
    });

    function showItem(item, delayIndex) {
      const delay = Math.min(delayIndex, 7) * 40;

      item.style.setProperty("--page-enter-delay", delay + "ms");
      item.classList.add("is-page-entered");

      function finishAnimation(event) {
        if (event.target !== item || event.animationName !== "portfolioEnter") {
          return;
        }

        item.classList.remove("page-enter-item", "is-page-entered");
        item.style.removeProperty("--page-enter-delay");
        item.removeEventListener("animationend", finishAnimation);
      }

      item.addEventListener("animationend", finishAnimation);
    }

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (item, index) {
        showItem(item, index);
      });

      return;
    }

    /* ================================================================
   PORTFOLIO CONTENT PROTECTION
   ================================================================ */

(function () {
  "use strict";

  /* Disable right-click */
  document.addEventListener("contextmenu", function (event) {
    event.preventDefault();
  });


  /* Prevent text selection */
  document.addEventListener("selectstart", function (event) {
    event.preventDefault();
  });


  /* Prevent dragging images */
  document.addEventListener("dragstart", function (event) {
    if (event.target.closest("img")) {
      event.preventDefault();
    }
  });


  /* Prevent copy */
  document.addEventListener("copy", function (event) {
    event.preventDefault();
  });


  /* Prevent cut */
  document.addEventListener("cut", function (event) {
    event.preventDefault();
  });


  /* Prevent common save / copy / inspect shortcuts */
  document.addEventListener("keydown", function (event) {
    const key = event.key.toLowerCase();

    /* Ctrl/Cmd + C */
    if ((event.ctrlKey || event.metaKey) && key === "c") {
      event.preventDefault();
    }

    /* Ctrl/Cmd + X */
    if ((event.ctrlKey || event.metaKey) && key === "x") {
      event.preventDefault();
    }

    /* Ctrl/Cmd + S */
    if ((event.ctrlKey || event.metaKey) && key === "s") {
      event.preventDefault();
    }

    /* Ctrl/Cmd + U */
    if ((event.ctrlKey || event.metaKey) && key === "u") {
      event.preventDefault();
    }

    /* F12 */
    if (event.key === "F12") {
      event.preventDefault();
    }

    /* Ctrl/Cmd + Shift + I */
    if (
      (event.ctrlKey || event.metaKey) &&
      event.shiftKey &&
      key === "i"
    ) {
      event.preventDefault();
    }

    /* Ctrl/Cmd + Shift + J */
    if (
      (event.ctrlKey || event.metaKey) &&
      event.shiftKey &&
      key === "j"
    ) {
      event.preventDefault();
    }

    /* Ctrl/Cmd + Shift + C */
    if (
      (event.ctrlKey || event.metaKey) &&
      event.shiftKey &&
      key === "c"
    ) {
      event.preventDefault();
    }
  });
})();

    const observer = new IntersectionObserver(
      function (entries) {
        const visibleItems = entries
          .filter(function (entry) {
            return entry.isIntersecting;
          })
          .sort(function (first, second) {
            return first.boundingClientRect.top - second.boundingClientRect.top;
          });

        visibleItems.forEach(function (entry, index) {
          showItem(entry.target, index);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.04,
        rootMargin: "0px 0px -4% 0px",
      },
    );

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startEntranceAnimation, {
      once: true,
    });
  } else {
    startEntranceAnimation();
  }
})();
/* ================================================================
   TOP STATUS SCROLL HIDE / SHOW
   Time + availability + X hide together while scrolling down and
   return when the user reaches the top again.
   ================================================================ */
(function () {
  const topStatus = document.querySelector(".top-status");
  if (!topStatus) return;

  let ticking = false;

  function updateTopStatusVisibility() {
    topStatus.classList.toggle("is-scroll-hidden", window.scrollY > 18);
    ticking = false;
  }

  function handleTopStatusScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateTopStatusVisibility);
  }

  window.addEventListener("scroll", handleTopStatusScroll, { passive: true });
  updateTopStatusVisibility();
})();