// Animaciones suaves al hacer scroll. Agrega la clase .reveal a cualquier bloque nuevo.
const revealElements = document.querySelectorAll(".reveal");
const header = document.querySelector(".site-header");
const brandLink = document.querySelector(".brand");
const menuToggle = document.querySelector(".menu-toggle");
const headerMenu = document.querySelector("#header-menu");
const heroScroll = document.querySelector(".hero-scroll");
const heroProductLink = document.querySelector("[data-hero-product-link]");
const heroScrollCue = document.querySelector(".hero-scroll-cue");
const heroTransition = document.querySelector(".hero-transition");
const emotionalTransition = document.querySelector(".emotional-transition");
const emotionalSection = document.querySelector(".full-bleed-image");
const emotionalIntro = document.querySelector(".window-line-intro");
const emotionalLineOne = document.querySelector(".window-line-1");
const emotionalLineTwo = document.querySelector(".window-line-2");
const headerSectionLinks = document.querySelectorAll(".header-links a");
const howSection = document.querySelector(".how");
const benefitsSection = document.querySelector(".benefits");
const specExploded = document.querySelector(".spec-exploded");
const lastHowStep = howSection?.querySelector(".how-step:last-child");
const ritualVideos = [...document.querySelectorAll(".ritual-card video")];
const benefitTabs = document.querySelectorAll("[data-benefit-index]");
const benefitItems = document.querySelectorAll(".benefit-item");
const benefitImage = document.querySelector(".benefit-image");
const accessoryPanels = document.querySelectorAll("[data-accessory-panel]");
const accessoryAccordion = document.querySelector(".accessory-accordion");
const explodedPieceIds = ["tapa", "contratapa", "filtro", "cuerpo", "piso"];
const explodedHotspots = document.querySelectorAll("[data-exploded-hotspot]");
const finalCta = document.querySelector(".final-cta");
const newsletterForm = document.querySelector("[data-newsletter-form]");
const newsletterStatus = document.querySelector("[data-newsletter-status]");
const desktopHoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
const mobileMediaQuery = window.matchMedia("(max-width: 768px)");

const benefits = [
  {
    description: "Compacta para mochila, valija o kit de ruta.",
    image: "assets/benefit-portable.jpg",
    alt: "Minipresso GR lista para llevar durante un viaje",
  },
  {
    description: "Sistema manual: no requiere batería ni electricidad.",
    image: "assets/benefit-independent.jpg",
    alt: "Minipresso GR funcionando de manera manual al aire libre",
  },
  {
    description: "Compatible con café molido para ajustar origen, molienda e intensidad.",
    image: "assets/benefit-customizable.jpg",
    alt: "Café molido preparado para personalizar una extracción",
  },
  {
    description: "Hasta 8 bares de presión para una extracción intensa y crema natural.",
    image: "assets/benefit-espresso.jpeg",
    alt: "Espresso intenso preparado con Minipresso GR",
  },
  {
    description: "El café deja de depender del lugar y vuelve a depender de vos.",
    image: "assets/benefit-pause.jpg",
    alt: "Una pausa de café con Minipresso GR durante el viaje",
  },
];

let activeBenefit = 0;
let benefitChangeTimer;
let benefitScrollAmount = 0;
let benefitTourCompleted = false;
let benefitSectionAligned = false;
let howAnimationTimer;
let howLinesTimer;
let specExplodedTimer;
let explodedHoverTimer;

const setActiveExplodedNote = (activeId) => {
  if (!specExploded) {
    return;
  }

  explodedPieceIds.forEach((id) => {
    const isActive = id === activeId;
    specExploded.querySelector(`.note-${id}`)?.classList.toggle("is-active", isActive);
    specExploded.querySelector(`.hotspot-${id}`)?.classList.toggle("is-active", isActive);
    specExploded.querySelector(`#${id}`)?.classList.toggle("is-piece-highlight", isActive);
  });

  explodedHotspots.forEach((button) => {
    button.setAttribute("aria-expanded", String(button.dataset.explodedHotspot === activeId));
  });
};

const setActiveBenefit = (nextIndex, direction = 1) => {
  if (!benefitImage || nextIndex === activeBenefit) {
    return;
  }

  window.clearTimeout(benefitChangeTimer);
  activeBenefit = (nextIndex + benefits.length) % benefits.length;
  benefitTabs.forEach((tab, index) => {
    const isActive = index === activeBenefit;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.setAttribute("aria-expanded", String(isActive));
    benefitItems[index]?.classList.toggle("is-active", isActive);
  });

  benefitImage.classList.add("is-changing");

  benefitChangeTimer = window.setTimeout(() => {
    benefitImage.src = benefits[activeBenefit].image;
    benefitImage.alt = benefits[activeBenefit].alt;
    benefitImage.classList.remove("is-changing");
  }, 240);
};

benefitTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const nextIndex = Number(tab.dataset.benefitIndex);
    setActiveBenefit(nextIndex, nextIndex > activeBenefit ? 1 : -1);
  });
});

window.addEventListener("wheel", (event) => {
  if (!benefitsSection || !benefitImage || benefitTabs.length === 0) {
    return;
  }

  const rect = benefitsSection.getBoundingClientRect();
  const direction = event.deltaY > 0 ? 1 : -1;
  const headerHeight = header?.offsetHeight ?? 0;
  const alignedTop = headerHeight;
  const isAligned = Math.abs(rect.top - alignedTop) <= 28;
  const isApproaching =
    direction > 0 &&
    rect.top <= alignedTop + 90 &&
    rect.top > alignedTop - 120 &&
    rect.bottom > window.innerHeight * 0.8;

  if (!benefitTourCompleted && !benefitSectionAligned && isApproaching) {
    event.preventDefault();
    benefitSectionAligned = true;
    window.scrollTo({
      top: benefitsSection.offsetTop - headerHeight,
      behavior: "smooth",
    });
    return;
  }

  const canLock = benefitSectionAligned || (benefitTourCompleted && isAligned);
  const shouldLock =
    canLock &&
    ((direction > 0 && activeBenefit < benefits.length - 1) ||
      (direction < 0 && activeBenefit > 0));

  if (!canLock) {
    benefitScrollAmount = 0;
    return;
  }

  if (shouldLock) {
    event.preventDefault();
  }

  benefitScrollAmount += event.deltaY;

  if (Math.abs(benefitScrollAmount) >= 160) {
    const nextIndex = Math.min(Math.max(activeBenefit + direction, 0), benefits.length - 1);
    setActiveBenefit(nextIndex, direction);
    benefitScrollAmount = 0;

    if (direction > 0 && nextIndex === benefits.length - 1) {
      benefitTourCompleted = true;
      benefitSectionAligned = false;
    }
  }
}, { passive: false });

let activeAccessory = 0;

const setActiveAccessory = (activeIndex) => {
  activeAccessory = activeIndex;
  accessoryPanels.forEach((item, index) => {
    const isActive = index === activeIndex;
    item.classList.toggle("is-active", isActive);
    item.querySelector(".accessory-panel-trigger")?.setAttribute("aria-expanded", String(isActive));
  });
};

accessoryPanels.forEach((panel, index) => {
  const prevButton = document.createElement("button");
  prevButton.className = "accessory-prev";
  prevButton.type = "button";
  prevButton.setAttribute("aria-label", "Ver accesorio anterior");
  prevButton.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 12H5"></path>
      <path d="m11 6-6 6 6 6"></path>
    </svg>
  `;
  const nextButton = document.createElement("button");
  nextButton.className = "accessory-next";
  nextButton.type = "button";
  nextButton.setAttribute("aria-label", "Ver siguiente accesorio");
  nextButton.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 12h14"></path>
      <path d="m13 6 6 6-6 6"></path>
    </svg>
  `;
  panel.append(prevButton, nextButton);

  panel.querySelector(".accessory-panel-trigger")?.addEventListener("click", () => {
    setActiveAccessory(index);
  });

  nextButton.addEventListener("click", (event) => {
    event.stopPropagation();
    setActiveAccessory((index + 1) % accessoryPanels.length);
  });

  prevButton.addEventListener("click", (event) => {
    event.stopPropagation();
    setActiveAccessory((index - 1 + accessoryPanels.length) % accessoryPanels.length);
  });
});

let accessoryTouchStartX = 0;
let accessoryTouchStartY = 0;

accessoryAccordion?.addEventListener("touchstart", (event) => {
  if (window.innerWidth > 768 || event.touches.length !== 1) return;
  accessoryTouchStartX = event.touches[0].clientX;
  accessoryTouchStartY = event.touches[0].clientY;
}, { passive: true });

accessoryAccordion?.addEventListener("touchend", (event) => {
  if (window.innerWidth > 768 || !event.changedTouches.length) return;
  const deltaX = event.changedTouches[0].clientX - accessoryTouchStartX;
  const deltaY = event.changedTouches[0].clientY - accessoryTouchStartY;

  if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
    const direction = deltaX < 0 ? 1 : -1;
    setActiveAccessory((activeAccessory + direction + accessoryPanels.length) % accessoryPanels.length);
  }
}, { passive: true });

newsletterForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  newsletterForm.reset();

  if (newsletterStatus) {
    newsletterStatus.textContent = "Gracias por sumarte. Pronto vas a recibir novedades.";
  }
});

const closeMobileMenu = () => {
  menuToggle?.classList.remove("is-open");
  headerMenu?.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Abrir men\u00fa");
};

menuToggle?.addEventListener("click", () => {
  const isOpen = !menuToggle.classList.contains("is-open");
  menuToggle.classList.toggle("is-open", isOpen);
  headerMenu?.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar men\u00fa" : "Abrir men\u00fa");
});

headerSectionLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 575.98) {
    closeMobileMenu();
  }
});

heroProductLink?.addEventListener("click", (event) => {
  if (!heroScroll) {
    return;
  }

  event.preventDefault();
  const scrollDistance = heroScroll.offsetHeight - window.innerHeight;
  const productPosition = heroScroll.offsetTop + scrollDistance * 0.82;

  window.scrollTo({
    top: productPosition,
    behavior: "smooth",
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -8% 0px",
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

const finalCtaLineObserver = finalCta
  ? new IntersectionObserver(
      ([entry]) => {
        entry.target.classList.toggle("is-line-animated", entry.isIntersecting);
      },
      {
        threshold: 0.25,
      }
    )
  : null;

if (finalCta && finalCtaLineObserver) {
  finalCtaLineObserver.observe(finalCta);
}

const emotionalTransitionObserver = emotionalTransition
  ? new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-animated");
        } else {
          entry.target.classList.remove("is-animated");
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px 8% 0px",
      }
    )
  : null;

if (emotionalTransition && emotionalTransitionObserver) {
  emotionalTransitionObserver.observe(emotionalTransition);
}

const updateEmotionalWindow = () => {
  if (!emotionalSection) {
    return;
  }

  const rect = emotionalSection.getBoundingClientRect();
  const transitionRect = emotionalTransition?.getBoundingClientRect();
  const isMobileEmotional = window.matchMedia("(max-width: 768px)").matches;
  const isVisible =
    (rect.bottom > 0 && rect.top < window.innerHeight) ||
    Boolean(transitionRect && transitionRect.bottom > 0 && transitionRect.top < window.innerHeight);
  const progress = Math.min(
    1,
    Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height))
  );
  const exitProgress = Math.min(
    1,
    Math.max(
      0,
      (window.innerHeight * (isMobileEmotional ? 0.72 : 1.18) - rect.bottom) / window.innerHeight
    )
  );
  const caption = emotionalSection.querySelector(".full-bleed-caption p");

  document.body.classList.toggle("emotional-active", isVisible);
  emotionalIntro?.classList.toggle("is-visible", progress > 0.08);
  emotionalLineOne?.classList.toggle("is-visible", progress > (isMobileEmotional ? 0.05 : 0.22));
  emotionalLineTwo?.classList.toggle("is-visible", progress > (isMobileEmotional ? 0.18 : 0.4));
  caption?.style.setProperty(
    "--emotional-caption-y",
    `${(exitProgress * window.innerHeight * (isMobileEmotional ? 0.5 : 0.78)).toFixed(2)}px`
  );
};

const howObserver = howSection
  ? new IntersectionObserver(
    ([entry]) => {
      window.clearTimeout(howAnimationTimer);
      window.clearTimeout(howLinesTimer);

      if (entry.isIntersecting) {
        heroTransition?.classList.remove("is-animated");
        howAnimationTimer = window.setTimeout(() => {
          entry.target.classList.add("is-animated");

          const animateHowLines = () => {
            heroTransition?.classList.add("is-animated");
          };

          if (lastHowStep) {
            lastHowStep.addEventListener("transitionend", animateHowLines, { once: true });
          }

          howLinesTimer = window.setTimeout(animateHowLines, 3100);
        }, 180);
        return;
      }

      entry.target.classList.remove("is-animated");
      heroTransition?.classList.remove("is-animated");
    },
    {
      threshold: 0.08,
      rootMargin: "0px",
    }
  )
  : null;

if (howSection && howObserver) {
  howObserver.observe(howSection);
}

let activeRitualVideo;
let hasStartedMobileRitualIntro = false;
let hasUnlockedMobileRitualVideos = false;

const setRitualVideoState = (card, state) => {
  card?.classList.remove(
    "is-video-intro",
    "is-video-locked",
    "is-video-playing",
    "is-video-paused",
    "is-video-ended",
  );

  if (state) {
    card?.classList.add(state);
  }
};

const pauseRitualVideo = (video) => {
  const card = video.closest(".ritual-card");
  video.pause();
  if (mobileMediaQuery.matches && !video.ended && !card?.classList.contains("is-video-locked") && !card?.classList.contains("is-video-intro")) {
    setRitualVideoState(card, "is-video-paused");
    card?.querySelector(".ritual-play-icon")?.setAttribute("src", "assets/icono-play.svg");
    return;
  }

  card?.classList.remove("is-video-playing");
};

const playRitualVideo = (video, restart = false) => {
  const card = video.closest(".ritual-card");

  if (mobileMediaQuery.matches && card?.classList.contains("is-video-locked") && video !== ritualVideos[0]) {
    setRitualVideoState(card, "is-video-paused");
    card?.querySelector(".ritual-play-icon")?.setAttribute("src", "assets/icono-play.svg");
  }

  ritualVideos.forEach((otherVideo) => {
    if (otherVideo !== video) {
      if (mobileMediaQuery.matches && video !== ritualVideos[0] && otherVideo.ended) {
        const otherCard = otherVideo.closest(".ritual-card");
        setRitualVideoState(otherCard, "is-video-paused");
        otherCard?.querySelector(".ritual-play-icon")?.setAttribute("src", "assets/icono-play.svg");
        return;
      }

      pauseRitualVideo(otherVideo);
    }
  });

  if (restart) {
    video.currentTime = 0;
  }

  activeRitualVideo = video;
  setRitualVideoState(card, "is-video-playing");
  video.play().catch(() => {
    if (mobileMediaQuery.matches) {
      setRitualVideoState(card, video === ritualVideos[0] && !hasUnlockedMobileRitualVideos ? "is-video-intro" : "is-video-paused");
      return;
    }

    card?.classList.remove("is-video-playing");
  });
};

ritualVideos.forEach((video, index) => {
  const card = video.closest(".ritual-card");
  const playButton = document.createElement("button");
  let isHovered = false;
  let replayTimer;

  video.autoplay = false;
  video.loop = false;
  video.muted = true;
  video.controls = false;
  video.pause();
  video.currentTime = 0;
  if (index === 0) {
    setRitualVideoState(card, "is-video-intro");
  }

  if (index > 0) {
    setRitualVideoState(card, "is-video-locked");
  }

  playButton.className = "ritual-play-button";
  playButton.type = "button";
  playButton.setAttribute("aria-label", `Reproducir video ${index + 1}`);
  playButton.innerHTML = '<img class="ritual-play-icon" src="assets/icono-play.svg" alt="" aria-hidden="true">';
  card?.appendChild(playButton);

  const handleMobilePlay = (event) => {
    if (!mobileMediaQuery.matches) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    playRitualVideo(video, video.ended);
  };

  card?.addEventListener("click", handleMobilePlay);
  playButton.addEventListener("click", handleMobilePlay);

  card?.addEventListener("mouseenter", () => {
    if (mobileMediaQuery.matches) {
      return;
    }

    isHovered = true;

    if (video.ended) {
      replayTimer = window.setTimeout(() => {
        if (!isHovered) {
          return;
        }

        video.currentTime = 0;
        setRitualVideoState(card, "is-video-playing");
        video.play().catch(() => card.classList.remove("is-video-playing"));
      }, 300);
      return;
    }

    setRitualVideoState(card, "is-video-playing");
    video.play().catch(() => card.classList.remove("is-video-playing"));
  });

  card?.addEventListener("mouseleave", () => {
    if (mobileMediaQuery.matches) {
      return;
    }

    isHovered = false;
    window.clearTimeout(replayTimer);
    video.pause();
    card.classList.remove("is-video-playing");
  });

  video.addEventListener("ended", () => {
    setRitualVideoState(card, "is-video-ended");
    card?.querySelector(".ritual-play-icon")?.setAttribute("src", "assets/icono-replay.svg");

    if (mobileMediaQuery.matches && index === 0 && !hasUnlockedMobileRitualVideos) {
      hasUnlockedMobileRitualVideos = true;
      ritualVideos.forEach((ritualVideo) => {
        const ritualCard = ritualVideo.closest(".ritual-card");
        if (ritualVideo !== video && !ritualVideo.ended) {
          setRitualVideoState(ritualCard, "is-video-paused");
          ritualCard?.querySelector(".ritual-play-icon")?.setAttribute("src", "assets/icono-play.svg");
        }
      });
    }

    if (isHovered) {
      replayTimer = window.setTimeout(() => {
        if (!isHovered) {
          return;
        }

        video.currentTime = 0;
        setRitualVideoState(card, "is-video-playing");
        video.play().catch(() => card?.classList.remove("is-video-playing"));
      }, 300);
    }
  });
});

if (howSection && ritualVideos.length) {
  const ritualIntroObserver = new IntersectionObserver((entries) => {
    const [entry] = entries;

    if (!mobileMediaQuery.matches || hasStartedMobileRitualIntro || !entry.isIntersecting) {
      return;
    }

    hasStartedMobileRitualIntro = true;
    playRitualVideo(ritualVideos[0], true);
    ritualIntroObserver.disconnect();
  }, { threshold: 0.32 });

  ritualIntroObserver.observe(howSection);
}

brandLink?.addEventListener("click", (event) => {
  event.preventDefault();
  window.clearTimeout(howAnimationTimer);
  window.clearTimeout(howLinesTimer);

  revealElements.forEach((element) => {
    element.classList.remove("is-visible");
    revealObserver.unobserve(element);
  });

  if (howSection && howObserver) {
    howSection.classList.remove("is-animated");
    howObserver.unobserve(howSection);
  }

  heroTransition?.classList.remove("is-animated");

  if (emotionalTransition && emotionalTransitionObserver) {
    emotionalTransition.classList.remove("is-animated");
    emotionalTransitionObserver.unobserve(emotionalTransition);
  }

  emotionalIntro?.classList.remove("is-visible");
  emotionalLineOne?.classList.remove("is-visible");
  emotionalLineTwo?.classList.remove("is-visible");
  document.body.classList.remove("emotional-active");

  let animationsRearmed = false;
  const rearmAnimations = () => {
    if (animationsRearmed) {
      return;
    }

    animationsRearmed = true;
    revealElements.forEach((element) => revealObserver.observe(element));

    if (howSection && howObserver) {
      howObserver.observe(howSection);
    }

    if (emotionalTransition && emotionalTransitionObserver) {
      emotionalTransitionObserver.observe(emotionalTransition);
    }

  };

  window.addEventListener("scrollend", rearmAnimations, { once: true });
  window.setTimeout(rearmAnimations, 1800);

  window.scrollTo({
    top: heroScroll?.offsetTop ?? 0,
    behavior: "smooth",
  });
});

const updateActiveHeaderLink = (heroProgress = 0) => {
  const sectionIds = [
    "como-funciona",
    "beneficios",
    "especificaciones",
    "accesorios",
    "resenas",
  ];
  const marker = window.scrollY + Math.min(window.innerHeight * 0.34, 260);
  let activeHref = "#hero";

  sectionIds.forEach((id) => {
    const section = document.getElementById(id);
    const sectionTop = section?.offsetTop;

    if (sectionTop !== undefined && sectionTop <= marker) {
      activeHref = `#${id}`;
    }
  });

  headerSectionLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === activeHref);
  });
};

const updateExplodedMinipresso = () => {
  if (!specExploded) {
    return;
  }

  const rect = specExploded.getBoundingClientRect();
  const sectionRect = specExploded.closest("section")?.getBoundingClientRect();
  const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
  const isSectionVisible = sectionRect
    ? sectionRect.bottom > 0 && sectionRect.top < window.innerHeight
    : isVisible;

  if (isVisible) {
    if (!specExploded.classList.contains("is-open") && !specExplodedTimer) {
      specExplodedTimer = window.setTimeout(() => {
        specExploded.classList.add("is-open");
        specExplodedTimer = undefined;
      }, 1800);
    }

    return;
  }

  if (specExploded.classList.contains("is-open") && isSectionVisible) {
    return;
  }

  window.clearTimeout(specExplodedTimer);
  specExplodedTimer = undefined;
  specExploded.classList.remove("is-open");
  setActiveExplodedNote(undefined);
};

if (specExploded) {
  explodedHotspots.forEach((button) => {
    const noteId = button.dataset.explodedHotspot;
    const note = specExploded.querySelector(`.note-${noteId}`);

    const keepExplodedNote = () => {
      window.clearTimeout(explodedHoverTimer);
      setActiveExplodedNote(noteId);
    };

    const releaseExplodedNote = () => {
      window.clearTimeout(explodedHoverTimer);
      explodedHoverTimer = window.setTimeout(() => {
        if (!button.matches(":hover") && !note?.matches(":hover")) {
          setActiveExplodedNote(undefined);
        }
      }, 90);
    };

    button.addEventListener("mouseenter", () => {
      if (desktopHoverQuery.matches) {
        keepExplodedNote();
      }
    });

    button.addEventListener("mouseleave", () => {
      if (desktopHoverQuery.matches) {
        releaseExplodedNote();
      }
    });

    button.addEventListener("focus", () => {
      if (desktopHoverQuery.matches) {
        keepExplodedNote();
      }
    });

    button.addEventListener("blur", () => {
      if (desktopHoverQuery.matches) {
        releaseExplodedNote();
      }
    });

    note?.addEventListener("mouseenter", () => {
      if (desktopHoverQuery.matches) {
        keepExplodedNote();
      }
    });

    note?.addEventListener("mouseleave", () => {
      if (desktopHoverQuery.matches) {
        releaseExplodedNote();
      }
    });

    button.addEventListener("click", (event) => {
      event.stopPropagation();

      if (desktopHoverQuery.matches) {
        return;
      }

      const isAlreadyActive = button.classList.contains("is-active");
      setActiveExplodedNote(isAlreadyActive ? undefined : noteId);
    });
  });
}

const ambassadorGallery = document.querySelector("[data-ambassador-gallery]");
const ambassadorDots = document.querySelectorAll("[data-ambassador-index]");
const ambassadorPrev = document.querySelector("[data-ambassador-prev]");
const ambassadorNext = document.querySelector("[data-ambassador-next]");
const ambassadorName = document.querySelector("[data-ambassador-name]");
const ambassadorHandle = document.querySelector("[data-ambassador-handle]");
const ambassadorDescription = document.querySelector("[data-ambassador-description]");
const ambassadorLink = document.querySelector("[data-ambassador-link]");
const ambassadorModal = document.querySelector("[data-ambassador-modal]");
const ambassadorModalImage = document.querySelector("[data-ambassador-modal-image]");
const ambassadorModalName = document.querySelector("[data-ambassador-modal-name]");
const ambassadorModalHandle = document.querySelector("[data-ambassador-modal-handle]");
const ambassadorModalRole = document.querySelector("[data-ambassador-modal-role]");
const ambassadorModalStory = document.querySelector("[data-ambassador-modal-story]");
const ambassadorModalLink = document.querySelector("[data-ambassador-modal-link]");
const ambassadorModalDots = document.querySelector("[data-ambassador-modal-dots]");
const ambassadorModalPrev = document.querySelector("[data-ambassador-modal-prev]");
const ambassadorModalNext = document.querySelector("[data-ambassador-modal-next]");
const ambassadorModalCloseButtons = document.querySelectorAll("[data-ambassador-modal-close]");
const ambassadorProfiles = [
  {
    layout: "amamos",
    name: "Amamos Cafés",
    handle: "@amamoscafes",
    description: "Viajes, café de especialidad y rituales compartidos.",
    role: "Viajeros y amantes del café de especialidad.",
    story: "Recorren nuevos paisajes buscando sabores, encuentros y pequeñas pausas para compartir.",
    profileUrl: "https://www.instagram.com/amamoscafes/",
    mobileImages: null,
    images: [
      ["assets/ambassador-amamos-5.png", "Pareja caminando hacia un lago entre montañas"],
      ["assets/ambassador-amamos-2.png", "Pareja de excursionistas junto a un lago de montaña"],
      ["assets/ambassador-amamos-1.jpg", "Granos de café recién cosechados"],
      ["assets/ambassador-amamos-3.jpg", "Minipresso y café frente a un paisaje al amanecer"],
      ["assets/ambassador-amamos-4.jpg", "Hamaca frente a un paisaje de cafetales"],
      ["assets/ambassador-amamos-6.jpg", "Minipresso lista para usar durante un viaje"],
    ],
  },
  {
    layout: "breanna",
    name: "Breanna Wilson",
    handle: "@breannajwilson",
    description: "Café, rutas y equipaje liviano para cada destino.",
    role: "Fotógrafa outdoor.",
    story: "Entre aeropuertos, rutas y senderos, encuentra en cada parada una forma simple de volver a empezar.",
    profileUrl: "https://www.instagram.com/breannajwilson",
    mobileImages: [
      ["assets/ambassador-breanna-4.jpg", "Breanna Wilson con café frente a un paisaje abierto"],
      ["assets/ambassador-breanna-5.jpg", "Breanna Wilson preparando café junto a un ave en la montaña"],
    ],
    images: [
      ["assets/ambassador-breanna-1.jpg", "Breanna disfrutando un café durante un viaje"],
      ["assets/ambassador-breanna-5.png", "Viajera con una Minipresso guardada en su mochila en un aeropuerto"],
      
      ["assets/ambassador-breanna-2.jpg", "Minipresso y objetos preparados para viajar"],
      ["assets/ambassador-breanna-3.jpg", "Equipo de viaje y café guardado en una mochila"],
    ],
  },
  {
    layout: "nicolette",
    name: "Nicolette",
    handle: "@n1c0l3t",
    description: "Pausas cálidas entre montañas, nieve y senderos.",
    role: "Exploradora de montaña.",
    story: "Sus recorridos combinan nieve, altura y momentos tranquilos donde el paisaje marca el ritmo.",
    profileUrl: "https://www.instagram.com/n1c0l3t/",
    mobileImages: null,
      images: [
        ["assets/ambassador-nicolette-vertical.jpg", "Nicolette con una Minipresso en la montaña"],
        ["assets/ambassador-nicolette-2.jpg", "Pausa de café junto a un bosque"],
      ["assets/ambassador-nicolette-3.jpg", "Café en una cumbre nevada"],
      ["assets/ambassador-nicolette-4.jpg", "Preparación de espresso en el bosque"],
      ["assets/ambassador-nicolette-5.jpg", "Nicolette en un paisaje de nieve"],
      ["assets/ambassador-nicolette-6.jpg", "Nicolette preparando espresso bajo la luz del sol"],
    ],
  },
  {
    layout: "vissers",
    name: "Brodie Vissers",
    handle: "@Brodievissers",
    description: "Del origen del grano al espresso en viaje.",
    role: "Explorador del origen.",
    story: "Del grano al paisaje, conecta cada preparación con el lugar donde empieza la historia.",
    profileUrl: "https://www.instagram.com/brodievissers/",
    mobileImages: [
      ["assets/ambassador-vissers-5.jpg", "Vissers explorando nuevas formas de preparar café"],
      ["assets/ambassador-vissers-6.jpg", "Vissers con Minipresso durante un recorrido urbano"],
    ],
    images: [
      ["assets/ambassador-vissers-vertical.jpg", "Viajero tomando café frente a un paisaje abierto"],
      ["assets/ambassador-vissers-1.png", "Brodie Vissers en una plantación de café"],
      ["assets/ambassador-vissers-2.jpg", "Fotógrafo explorando un paisaje rocoso"],
      ["assets/ambassador-vissers-3.png", "Preparación de café sobre una montaña"],
      ["assets/ambassador-vissers-4.jpg", "Extracción de espresso con Minipresso"],
    ],
  },
  {
    layout: "shorecreations",
    name: "Shore creations",
    displayName: "Shore<br>creations",
    handle: "@shorecreations.content",
    description: "Retrata pequeños rituales donde el café, el paisaje y el tiempo encuentran un equilibrio natural.",
    role: "Rituales de café",
    story: "Retrata pequeños rituales donde el café, el paisaje y el tiempo encuentran un equilibrio natural.",
    profileUrl: "https://www.instagram.com/shorecreations.content/",
    mobileImages: null,
    images: [
      ["assets/shorecreations.content2.jpg", "Pausa de café junto a un paisaje costero"],
      ["assets/shorecreations.content1.jpg", "Shorecreations.content preparando café"],
      
      ["assets/shorecreations.content3.jpg", "Minipresso en una escena de viaje"],
      ["assets/shorecreations.content4.jpg", "Momento de café al aire libre"],
    ],
  },
  {
    layout: "myhappycoffee",
    name: "My Happy Coffee Moments",
    handle: "@myhappycoffeemoments",
    description: "Pequeñas pausas, café y momentos cálidos.",
    role: "Café y naturaleza",
    story: "Construye escenas cercanas donde cada preparación se vuelve una pausa amable dentro del día.",
    profileUrl: "https://www.instagram.com/myhappycoffeemoments/",
    mobileImages: null,
    images: [
            ["assets/myhappycoffeemoments5.jpg", "Momento de café compartido"],
      ["assets/myhappycoffeemoments2.png", "Preparación de café en una escena cálida"],
      ["assets/myhappycoffeemoments3.png", "Detalle de café y accesorios"],
      ["assets/myhappycoffeemoments4.jpg", "Pausa de café en interior"],
      ["assets/myhappycoffeemoments1.jpg", "My Happy Coffee Moments con Minipresso"],
    ],
  },
];

const ambassadorDisplayOrder = [2, 3, 1, 0, 4, 5];
const ambassadorDesktopMosaic = [
  { profileIndex: 2, imageIndex: 0 },
  { profileIndex: 3, imageIndex: 3 },
  { profileIndex: 1, imageIndex: 0 },
  { profileIndex: 0, imageIndex: 0 },
  { profileIndex: 4, imageIndex: 0 },
  { profileIndex: 5, imageIndex: 0 },
];

let activeAmbassador = 0;
let activeAmbassadorImage = 0;
let ambassadorModalTrigger;
let ambassadorTransitionTimer;
let ambassadorTouchStartX = 0;
let ambassadorTouchStartY = 0;
let ambassadorSwipeHandled = false;
let ambassadorModalScrollY = 0;
let ambassadorModalMeasureFrame;
let ambassadorModalMeasureToken = 0;
let ambassadorModalRenderedProfileIndex;
const ambassadorMobileQuery = window.matchMedia("(max-width: 768px)");
const ambassadorDesktopQuery = window.matchMedia("(min-width: 992px)");

const getAmbassadorImages = (ambassador) => {
  if (!ambassadorMobileQuery.matches || !ambassador.mobileImages?.length) {
    return ambassador.images;
  }

  return [...ambassador.mobileImages, ...ambassador.images];
};

const resetAmbassadorModalTitleState = () => {
  if (!ambassadorModalName) {
    return;
  }

  ambassadorModalName.classList.remove("is-title-multiline", "is-title-long");
  ambassadorModalName.style.fontSize = "";
  ambassadorModalName.style.lineHeight = "";
  ambassadorModalName.style.transform = "";
  ambassadorModalName.style.height = "";
  ambassadorModalName.style.maxHeight = "";
};

const updateAmbassadorModalTitleSize = (measureToken) => {
  if (!ambassadorModalName || measureToken !== ambassadorModalMeasureToken) {
    return;
  }

  resetAmbassadorModalTitleState();

  if (!ambassadorMobileQuery.matches || !ambassadorModal?.classList.contains("is-open")) {
    return;
  }

  const styles = window.getComputedStyle(ambassadorModalName);
  const lineHeight = parseFloat(styles.lineHeight);

  if (!lineHeight) {
    return;
  }

  const lineCount = ambassadorModalName.scrollHeight / lineHeight;

  if (lineCount > 2.35) {
    ambassadorModalName.classList.add("is-title-long");
  } else if (lineCount > 1.35) {
    ambassadorModalName.classList.add("is-title-multiline");
  }

  window.requestAnimationFrame(() => {
    if (
      measureToken !== ambassadorModalMeasureToken ||
      !ambassadorMobileQuery.matches ||
      !ambassadorModal?.classList.contains("is-open") ||
      !ambassadorModalStory
    ) {
      return;
    }

    const titleRect = ambassadorModalName.getBoundingClientRect();
    const storyRect = ambassadorModalStory.getBoundingClientRect();

    if (titleRect.bottom > storyRect.top - 8 && !ambassadorModalName.classList.contains("is-title-long")) {
      ambassadorModalName.classList.remove("is-title-multiline");
      ambassadorModalName.classList.add("is-title-long");
    }
  });
};

const scheduleAmbassadorModalTitleSize = () => {
  ambassadorModalMeasureToken += 1;
  const measureToken = ambassadorModalMeasureToken;

  if (ambassadorModalMeasureFrame) {
    window.cancelAnimationFrame(ambassadorModalMeasureFrame);
  }

  const measureAfterLayout = () => {
    ambassadorModalMeasureFrame = window.requestAnimationFrame(() => {
      ambassadorModalMeasureFrame = window.requestAnimationFrame(() => {
        ambassadorModalMeasureFrame = undefined;
        updateAmbassadorModalTitleSize(measureToken);
      });
    });
  };

  measureAfterLayout();

  document.fonts?.ready.then(() => {
    if (measureToken === ambassadorModalMeasureToken && ambassadorModal?.classList.contains("is-open")) {
      measureAfterLayout();
    }
  });
};

const renderAmbassador = (index) => {
  if (!ambassadorGallery) {
    return;
  }

  if (ambassadorDesktopQuery.matches) {
    ambassadorGallery.dataset.layout = "desktop-fixed";
    ambassadorGallery.innerHTML = ambassadorDesktopMosaic.map(({ profileIndex, imageIndex }) => {
      const ambassador = ambassadorProfiles[profileIndex];
      const [src, alt] = ambassador.images[imageIndex];

      return `
        <button class="ambassador-photo" type="button" data-ambassador-profile-index="${profileIndex}" data-ambassador-photo-index="${imageIndex}" aria-label="Conocer la historia de ${ambassador.name}">
          <img src="${src}" alt="${alt}" loading="lazy" decoding="async">
          <span class="ambassador-photo-action" aria-hidden="true">
            <svg class="ambassador-expand-icon" viewBox="0 0 351.3 351.28" focusable="false">
              <g class="ambassador-expand-bg">
                <path d="M337.73,291.68c0,25.53-20.7,46.23-46.23,46.23H57.09c-25.53,0-46.23-20.7-46.23-46.23V60.67c0-25.53,20.7-46.23,46.23-46.23h265.09c8.59,0,15.55,6.96,15.55,15.55v261.7Z"/>
              </g>
              <g class="ambassador-expand-lines">
                <path d="M282.41,85.39l-12.28,12.13-129.24,128.99c-3.39,3.38-8.58,3.1-11.75.04s-3.63-8.49-.16-11.95l141.14-141.1-90.56-.06c-4.68,0-8.02-4.3-7.92-8.55s3.61-8.17,8.34-8.17h110.8c4.39,0,8.36,3.46,8.36,7.98l.03,112.12c0,4.76-3.81,8.25-8.18,8.35s-8.55-3.5-8.55-8.33l-.03-91.46Z"/>
                <path d="M336.09.68H43.18C17.65.68-3.05,21.37-3.05,46.9v258.55c0,25.53,20.7,46.23,46.23,46.23h262.23c25.53,0,46.23-20.7,46.23-46.23V16.22c0-8.59-6.96-15.55-15.55-15.55ZM337.73,291.68c0,25.53-20.7,46.23-46.23,46.23H57.09c-25.53,0-46.23-20.7-46.23-46.23V60.67c0-25.53,20.7-46.23,46.23-46.23h265.09c8.59,0,15.55,6.96,15.55,15.55v261.7Z"/>
              </g>
            </svg>
          </span>
        </button>
      `;
    }).join("");
    return;
  }

  const ambassador = ambassadorProfiles[ambassadorDisplayOrder[index]];
  const renderedImages = ambassadorMobileQuery.matches
    ? [getAmbassadorImages(ambassador)[0]]
    : ambassador.images;
  ambassadorGallery.dataset.layout = ambassador.layout;
  ambassadorGallery.innerHTML = renderedImages.map(([src, alt], imageIndex) => `
    <button class="ambassador-photo" type="button" data-ambassador-photo-index="${imageIndex}" aria-label="Conocer la historia de ${ambassador.name}, imagen ${imageIndex + 1}">
      <img src="${src}" alt="${alt}" loading="lazy" decoding="async">
      <span class="ambassador-photo-action">Conocer historia</span>
    </button>
  `).join("");

  ambassadorName.textContent = ambassador.name;
  ambassadorHandle.textContent = ambassador.handle;
  ambassadorDescription.textContent = ambassador.description;
  ambassadorLink.href = ambassador.profileUrl;
};

const getActiveAmbassadorProfileIndex = () => ambassadorDisplayOrder[activeAmbassador];
const getActiveAmbassadorProfile = () => ambassadorProfiles[getActiveAmbassadorProfileIndex()];

const renderAmbassadorModal = () => {
  const ambassador = getActiveAmbassadorProfile();
  const profileIndex = getActiveAmbassadorProfileIndex();
  const modalImages = getAmbassadorImages(ambassador);
  const [src, alt] = modalImages[activeAmbassadorImage];
  const didChangeProfile = ambassadorModalRenderedProfileIndex !== profileIndex;

  ambassadorModalImage.src = src;
  ambassadorModalImage.alt = alt;

  if (didChangeProfile) {
    resetAmbassadorModalTitleState();
    ambassadorModalName.innerHTML = ambassador.displayName || ambassador.name;
    ambassadorModalHandle.textContent = ambassador.handle;
    ambassadorModalRole.textContent = ambassador.role;
    ambassadorModalStory.textContent = ambassador.story;
    ambassadorModalLink.href = ambassador.profileUrl;
    ambassadorModalRenderedProfileIndex = profileIndex;
  }

  ambassadorModalDots.innerHTML = modalImages.map((_, imageIndex) => `
    <button class="ambassador-modal-dot${imageIndex === activeAmbassadorImage ? " is-active" : ""}" type="button" data-ambassador-modal-index="${imageIndex}" aria-label="Ver imagen ${imageIndex + 1}" aria-current="${imageIndex === activeAmbassadorImage ? "true" : "false"}"></button>
  `).join("");

  return didChangeProfile;
};

const openAmbassadorModal = (imageIndex, trigger, profileIndex) => {
  if (!ambassadorModal) {
    return;
  }

  if (profileIndex !== undefined) {
    const displayIndex = ambassadorDisplayOrder.indexOf(profileIndex);
    activeAmbassador = displayIndex >= 0 ? displayIndex : activeAmbassador;
  }

  activeAmbassadorImage = imageIndex;
  ambassadorModalTrigger = trigger;
  ambassadorModalScrollY = window.scrollY;
  document.body.classList.add("ambassador-modal-open");
  ambassadorModal.classList.add("is-open");
  ambassadorModal.setAttribute("aria-hidden", "false");
  ambassadorModalRenderedProfileIndex = undefined;
  renderAmbassadorModal();
  scheduleAmbassadorModalTitleSize();
  ambassadorModal.querySelector(".ambassador-modal-close")?.focus();
};

const closeAmbassadorModal = () => {
  if (!ambassadorModal?.classList.contains("is-open")) {
    return;
  }

  ambassadorModal.classList.remove("is-open");
  ambassadorModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("ambassador-modal-open");
  if (ambassadorModalMeasureFrame) {
    window.cancelAnimationFrame(ambassadorModalMeasureFrame);
    ambassadorModalMeasureFrame = undefined;
  }
  ambassadorModalMeasureToken += 1;
  ambassadorModalRenderedProfileIndex = undefined;
  resetAmbassadorModalTitleState();
  ambassadorModalTrigger?.focus();
};

const moveAmbassadorModal = (direction) => {
  const imageCount = getAmbassadorImages(getActiveAmbassadorProfile()).length;
  activeAmbassadorImage = (activeAmbassadorImage + direction + imageCount) % imageCount;
  const didChangeProfile = renderAmbassadorModal();
  if (didChangeProfile) {
    scheduleAmbassadorModalTitleSize();
  }
};

const setActiveAmbassador = (index) => {
  if (!ambassadorGallery || index === activeAmbassador) {
    return;
  }

  window.clearTimeout(ambassadorTransitionTimer);
  ambassadorGallery.classList.add("is-switching");
  ambassadorTransitionTimer = window.setTimeout(() => {
    activeAmbassador = index;
    renderAmbassador(activeAmbassador);
    ambassadorDots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeAmbassador;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", String(isActive));
    });
    requestAnimationFrame(() => ambassadorGallery.classList.remove("is-switching"));
  }, 250);
};

ambassadorDots.forEach((dot) => {
  dot.addEventListener("click", () => setActiveAmbassador(Number(dot.dataset.ambassadorIndex)));
});

ambassadorPrev?.addEventListener("click", () => {
  setActiveAmbassador((activeAmbassador - 1 + ambassadorDisplayOrder.length) % ambassadorDisplayOrder.length);
});

ambassadorNext?.addEventListener("click", () => {
  setActiveAmbassador((activeAmbassador + 1) % ambassadorDisplayOrder.length);
});

ambassadorGallery?.addEventListener("click", (event) => {
  if (ambassadorSwipeHandled) {
    ambassadorSwipeHandled = false;
    return;
  }

  const photo = event.target.closest("[data-ambassador-photo-index]");
  if (photo) {
    const profileIndex = photo.dataset.ambassadorProfileIndex;
    openAmbassadorModal(
      Number(photo.dataset.ambassadorPhotoIndex),
      photo,
      profileIndex === undefined ? undefined : Number(profileIndex)
    );
  }
});

ambassadorGallery?.addEventListener("touchstart", (event) => {
  if (!ambassadorMobileQuery.matches || event.touches.length !== 1) return;
  ambassadorSwipeHandled = false;
  ambassadorTouchStartX = event.touches[0].clientX;
  ambassadorTouchStartY = event.touches[0].clientY;
}, { passive: true });

ambassadorGallery?.addEventListener("touchend", (event) => {
  if (!ambassadorMobileQuery.matches || !event.changedTouches.length) return;
  const deltaX = event.changedTouches[0].clientX - ambassadorTouchStartX;
  const deltaY = event.changedTouches[0].clientY - ambassadorTouchStartY;

  if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
    ambassadorSwipeHandled = true;
    const direction = deltaX < 0 ? 1 : -1;
    setActiveAmbassador((activeAmbassador + direction + ambassadorDisplayOrder.length) % ambassadorDisplayOrder.length);
  }
}, { passive: true });

ambassadorModalPrev?.addEventListener("click", () => moveAmbassadorModal(-1));
ambassadorModalNext?.addEventListener("click", () => moveAmbassadorModal(1));
ambassadorModalCloseButtons.forEach((button) => button.addEventListener("click", closeAmbassadorModal));

ambassadorModalDots?.addEventListener("click", (event) => {
  const dot = event.target.closest("[data-ambassador-modal-index]");
  if (dot) {
    activeAmbassadorImage = Number(dot.dataset.ambassadorModalIndex);
    const didChangeProfile = renderAmbassadorModal();
    if (didChangeProfile) {
      scheduleAmbassadorModalTitleSize();
    }
  }
});

document.addEventListener("keydown", (event) => {
  if (!ambassadorModal?.classList.contains("is-open")) {
    return;
  }

  if (event.key === "Escape") closeAmbassadorModal();
  if (event.key === "ArrowLeft") moveAmbassadorModal(-1);
  if (event.key === "ArrowRight") moveAmbassadorModal(1);
});

renderAmbassador(activeAmbassador);
ambassadorMobileQuery.addEventListener("change", () => renderAmbassador(activeAmbassador));
ambassadorDesktopQuery.addEventListener("change", () => renderAmbassador(activeAmbassador));
window.addEventListener("resize", scheduleAmbassadorModalTitleSize);

const updateHero = () => {
  heroScrollCue?.classList.toggle("is-hidden", window.scrollY > 8);

  updateActiveHeaderLink();
  updateEmotionalWindow();
  updateExplodedMinipresso();
};

updateHero();
window.addEventListener("scroll", updateHero, { passive: true });
window.addEventListener("resize", updateHero);




