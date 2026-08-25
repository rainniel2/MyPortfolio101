(function () {
  "use strict";

  const galleryOrder = [
    /* RED */
    ["toyota", "ativ-red.webp"],
    ["toyota", "toyota-family.webp"],
    ["syntax", "syntax-flame-mark.webp"],
    ["syntax", "elevate-team-frame-red.webp"],
    ["toyota", "t-sure-red.webp"],
    ["toyota", "tamaraw-search.webp"],
    ["toyota", "tamaraw-search-02.webp"],
    ["toyota", "labor-day.webp"],
    ["toyota", "toyota-lineup.webp"],
    ["toyota", "corolla-02.webp"],
    ["syntax", "mobile-legends-team-frame.webp"],

    /* ORANGE AND BROWN */
    ["toyota", "insure-damage.webp"],
    ["toyota", "avanza.webp"],
    ["syntax", "creme-de-la-crust-poster.webp"],
    ["syntax", "creme-de-la-crust-logo-dark.webp"],
    ["syntax", "creme-de-la-crust-logo-light.webp"],
    ["syntax", "cybersecurity-infographic.webp"],
    ["syntax", "christmas-calendar.webp"],
    ["toyota", "fortuner.webp"],
    ["syntax", "christmas-poster.webp"],

    /* YELLOW */
    ["toyota", "insure-no-turning-back.webp"],
    ["toyota", "raize-campaign.webp"],
    ["toyota", "innova.webp"],

    /* GREEN */
    ["toyota", "ativ-white.webp"],
    ["syntax", "intramurals-frame-green.webp"],
    ["syntax", "student-id-fatima.webp"],
    ["toyota", "utility-tamaraw-grid.webp"],
    ["toyota", "corolla-01.webp"],
    ["toyota", "raize-moments.webp"],
    ["toyota", "insure-protection.webp"],
    ["syntax", "elevate-team-frame-green.webp"],
    ["syntax", "graduate-recognition-abel.webp"],
    ["syntax", "graduation-greeting.webp"],

    /* TEAL */
    ["syntax", "certificate-recognition.webp"],
    ["syntax", "programming-champion-certificate.webp"],
    ["syntax", "student-id-villela.webp"],
    ["syntax", "year-end-scratch-card.webp"],
    ["syntax", "food-stub-coupon.webp"],
    ["syntax", "birthday-folder-concept.webp"],
    ["syntax", "september-folder-concept.webp"],
    ["toyota", "hilux-conquest.webp"],
    ["toyota", "corolla.webp"],
    ["toyota", "toyota-hilux.webp"],
    ["syntax", "bsit-profile-frame.webp"],
    ["syntax", "ignite-schedule.webp"],
    ["syntax", "ignite-2026-banner.webp"],
    ["syntax", "first-year-appreciation.webp"],
    ["syntax", "team-solid-template.webp"],
    ["syntax", "ignite-event-mark.webp"],
    ["syntax", "mobile-legends-platform.webp"],
    ["syntax", "hotdog-coupon-03.webp"],
    ["syntax", "ignite-wordmark.webp"],

    /* BLUE */
    ["toyota", "insure-seatbelt.webp"],
    ["toyota", "insure-small.webp"],
    ["toyota", "toyota-quality-service.webp"],
    ["toyota", "independence-day.webp"],
    ["toyota", "yaris-cross.webp"],
    ["toyota", "ativ.webp"],
    ["toyota", "utility-tamaraw.webp"],
    ["syntax", "september-desktop-concept.webp"],
    ["syntax", "elevate-team-frame-blue.webp"],
    ["syntax", "faculty-frame-blue.webp"],

    /* PURPLE */
    ["syntax", "student-id-malabanan.webp"],
    ["syntax", "elevate-team-frame-purple.webp"],
    ["syntax", "visual-graphic-medal.webp"],
    ["syntax", "volleyball-boys.webp"],
    ["syntax", "faculty-frame-purple.webp"],
    ["syntax", "volleyball-girls.webp"],
    ["syntax", "basketball-boys.webp"],

    /* LIGHT, NEUTRAL, AND BLACK */
    ["toyota", "toyota-puzzle.webp"],
    ["toyota", "t-sure-memories.webp"],
    ["toyota", "t-sure.webp"],
    ["syntax", "hotdog-coupon-01.webp"],
    ["syntax", "hotdog-coupon-02.webp"],
    ["syntax", "intramurals-frame-black.webp"],
  ];

  const imageDimensions = {
    "first-year-appreciation.webp": [2200, 1844],
    "certificate-recognition.webp": [2200, 1551],
    "ignite-event-mark.webp": [2200, 1238],
    "ignite-schedule.webp": [1787, 2200],
    "student-id-malabanan.webp": [1386, 2200],
    "cybersecurity-infographic.webp": [1556, 2200],
    "food-stub-coupon.webp": [2200, 1238],
    "hotdog-coupon-01.webp": [2200, 1238],
    "hotdog-coupon-02.webp": [2200, 1238],
    "hotdog-coupon-03.webp": [2200, 1238],
    "mobile-legends-platform.webp": [2200, 1155],
    "ignite-wordmark.webp": [2200, 1556],
    "ignite-2026-banner.webp": [2200, 900],
    "intramurals-frame-black.webp": [733, 2200],
    "intramurals-frame-green.webp": [733, 2200],
    "student-id-fatima.webp": [1540, 2200],
    "programming-champion-certificate.webp": [2200, 1551],
    "creme-de-la-crust-logo-dark.webp": [1551, 2200],
    "year-end-scratch-card.webp": [2200, 1466],
    "creme-de-la-crust-logo-light.webp": [1551, 2200],
    "graduate-recognition-abel.webp": [2200, 1238],
    "graduation-greeting.webp": [2200, 1238],
    "student-id-villela.webp": [1386, 2200],
  };

  /*
    Every key below must exactly match an image path
    generated from galleryOrder, including ".webp".
  */

  const publishedLinks = {
    "image/work/toyota/insure-no-turning-back.webp": {
      url: "https://www.facebook.com/share/p/1cpQSabD8T/",
      account: "Toyota Lucena",
      platform: "Facebook",
    },

    "image/work/toyota/utility-tamaraw.webp": {
      url: "https://www.facebook.com/share/p/1BbahPPHQz/",
      account: "Toyota Lucena",
      platform: "Facebook",
    },

    "image/work/toyota/t-sure-memories.webp": {
      url: "https://www.facebook.com/share/p/1A9CvKvrUH/",
      account: "Toyota Lucena",
      platform: "Facebook",
    },

    "image/work/toyota/fortuner.webp": {
      url: "https://www.facebook.com/share/p/14ogzztzhuV/",
      account: "Toyota Lucena",
      platform: "Facebook",
    },

    "image/work/toyota/utility-tamaraw-grid.webp": {
      url: "https://www.facebook.com/share/p/1Jwt1XLsfV/",
      account: "Toyota Lucena",
      platform: "Facebook",
    },

    "image/work/toyota/insure-protection.webp": {
      url: "https://www.facebook.com/share/p/1EPqrqdNTb/",
      account: "Toyota Lucena",
      platform: "Facebook",
    },

    /*
      Your original key was "raize-protection", but that
      filename is not in galleryOrder. This link is currently
      connected to "raize-campaign.webp".
    */

    "image/work/toyota/raize-campaign.webp": {
      url: "https://www.facebook.com/share/p/193WrSgphZ/",
      account: "Toyota Lucena",
      platform: "Facebook",
    },

    "image/work/toyota/independence-day.webp": {
      url: "https://www.facebook.com/share/p/1DTbzEj5Lu/",
      account: "Toyota Lucena",
      platform: "Facebook",
    },

    "image/work/toyota/insure-small.webp": {
      url: "https://www.facebook.com/share/p/1ExXCbAkoF/",
      account: "Toyota Lucena",
      platform: "Facebook",
    },

    "image/work/toyota/corolla.webp": {
      url: "https://www.facebook.com/share/p/19EyNtm13Y/",
      account: "Toyota Lucena",
      platform: "Facebook",
    },

    "image/work/toyota/toyota-quality-service.webp": {
      url: "https://www.facebook.com/share/p/1DJfSGdSjC/",
      account: "Toyota Lucena",
      platform: "Facebook",
    },

    "image/work/toyota/t-sure.webp": {
      url: "https://www.facebook.com/share/p/197uBY22gs/",
      account: "Toyota Lucena",
      platform: "Facebook",
    },

    "image/work/toyota/toyota-family.webp": {
      url: "https://www.facebook.com/share/p/1BcyXRxbBv/",
      account: "Toyota Lucena",
      platform: "Facebook",
    },

    "image/work/toyota/innova.webp": {
      url: "https://www.facebook.com/share/p/1K3LRyoVSW/",
      account: "Toyota Lucena",
      platform: "Facebook",
    },

    "image/work/toyota/labor-day.webp": {
      url: "https://www.facebook.com/share/p/1LoJfCn9eC/",
      account: "Toyota Lucena",
      platform: "Facebook",
    },

    "image/work/toyota/insure-seatbelt.webp": {
      url: "https://www.facebook.com/share/p/1ExSPSysAf/",
      account: "Toyota Lucena",
      platform: "Facebook",
    },

    "image/work/toyota/toyota-puzzle.webp": {
      url: "https://www.facebook.com/share/p/1EnRsV7sYx/",
      account: "Toyota Lucena",
      platform: "Facebook",
    },

    "image/work/toyota/toyota-hilux.webp": {
      url: "https://www.facebook.com/share/p/1BEfN9kjsZ/",
      account: "Toyota Lucena",
      platform: "Facebook",
    },

    "image/work/toyota/insure-damage.webp": {
      url: "https://www.facebook.com/share/p/18ZVnr2Q6T/",
      account: "Toyota Lucena",
      platform: "Facebook",
    },

    "image/work/toyota/ativ-white.webp": {
      url: "https://www.facebook.com/share/p/1BbEQd7Drm/",
      account: "Toyota Lucena",
      platform: "Facebook",
    },

    "image/work/toyota/toyota-lineup.webp": {
      url: "https://www.facebook.com/share/p/19LeRNNvLm/",
      account: "Toyota Lucena",
      platform: "Facebook",
    },

    "image/work/toyota/ativ-red.webp": {
      url: "https://www.facebook.com/share/p/17xPNAgNWc/",
      account: "Toyota Lucena",
      platform: "Facebook",
    },

    "image/work/syntax/mobile-legends-platform.webp": {
      url: "https://www.facebook.com/share/p/1FztF4f576/",
      account: "SYNTAX Organization",
      platform: "Facebook",
    },

    "image/work/syntax/team-solid-template.webp": {
      url: "https://www.facebook.com/share/p/1bXA46xZUX/",
      account: "SYNTAX Organization",
      platform: "Facebook",
    },

    "image/work/syntax/christmas-poster.webp": {
      url: "https://www.facebook.com/share/p/1Hc8uX2kq6/",
      account: "SYNTAX Organization",
      platform: "Facebook",
    },

    "image/work/syntax/ignite-2026-banner.webp": {
      url: "https://www.facebook.com/share/v/1GYFf2V1Xr/",
      account: "SYNTAX Organization",
      platform: "Facebook",
    },

    "image/work/syntax/graduation-greeting.webp": {
      url: "https://www.facebook.com/share/p/1BjbG8X1pj/",
      account: "SYNTAX Organization",
      platform: "Facebook",
    },

    "image/work/syntax/mobile-legends-team-frame.webp": {
      url: "https://www.facebook.com/share/p/1HBA3LShSF/",
      account: "SYNTAX Organization",
      platform: "Facebook",
    },
  };

  const gallery = document.getElementById("moreWorkGallery");

  if (!gallery) {
    return;
  }

  const workImages = galleryOrder.map(function (image) {
    const folder = image[0];
    const file = image[1];
    const dimensions = imageDimensions[file] || [2200, 2200];

    return {
      src: "image/work/" + folder + "/" + file,
      width: dimensions[0],
      height: dimensions[1],
    };
  });

  /*
    Warn about any future published link that does not
    match an image in galleryOrder.
  */

  const galleryPaths = new Set(
    workImages.map(function (image) {
      return image.src;
    }),
  );

  Object.keys(publishedLinks).forEach(function (path) {
    if (!galleryPaths.has(path)) {
      console.warn(
        'Published image not found in galleryOrder: "' +
          path +
          '"',
      );
    }
  });

  let openPublishedItem = null;

  function makeDisplayTitle(src) {
    const fileName = src
      .split("/")
      .pop()
      .replace(/\.[^.]+$/i, "");

    return fileName
      .split("-")
      .map(function (word) {
        const uppercaseWords = {
          ativ: "ATIV",
          bsit: "BSIT",
          id: "ID",
          t: "T",
        };

        if (uppercaseWords[word]) {
          return uppercaseWords[word];
        }

        return (
          word.charAt(0).toUpperCase() +
          word.slice(1)
        );
      })
      .join(" ");
  }

  function makeAltText(src) {
    return "Creative work: " + makeDisplayTitle(src);
  }

  function getPublication(src) {
    const value = publishedLinks[src];

    if (!value) {
      return null;
    }

    if (typeof value === "string") {
      if (!/^https?:\/\//i.test(value.trim())) {
        return null;
      }

      return {
        url: value.trim(),
        account: "Official social page",
        platform: "Facebook",
      };
    }

    const url = String(value.url || "").trim();

    if (!/^https?:\/\//i.test(url)) {
      return null;
    }

    return {
      url: url,
      account: String(
        value.account || "Official social page",
      ),
      platform: String(
        value.platform || "Facebook",
      ),
    };
  }

  function createArtworkImage(
    imageData,
    index,
    onError,
  ) {
    const image = document.createElement("img");

    image.alt = makeAltText(imageData.src);
    image.width = imageData.width;
    image.height = imageData.height;
    image.decoding = "async";
    image.loading = index < 10 ? "eager" : "lazy";
    image.draggable = false;

    image.addEventListener(
      "error",
      function () {
        if (typeof onError === "function") {
          onError();
        }
      },
      { once: true },
    );

    image.src = imageData.src;

    return image;
  }

  function setPublishedState(
    item,
    shouldOpen,
    moveFocus,
  ) {
    const front = item.querySelector(
      ".more-work-front",
    );

    const back = item.querySelector(
      ".more-work-back",
    );

    const panel = item.querySelector(
      ".published-panel",
    );

    const link = item.querySelector(
      ".published-action",
    );

    item.classList.toggle(
      "is-revealed",
      shouldOpen,
    );

    front.setAttribute(
      "aria-expanded",
      String(shouldOpen),
    );

    front.tabIndex = shouldOpen ? -1 : 0;
    back.tabIndex = shouldOpen ? 0 : -1;

    panel.setAttribute(
      "aria-hidden",
      String(!shouldOpen),
    );

    link.tabIndex = shouldOpen ? 0 : -1;

    if (moveFocus) {
      const nextFocus = shouldOpen ? back : front;

      window.requestAnimationFrame(function () {
        nextFocus.focus({ preventScroll: true });
      });
    }
  }

  function closeCurrentCard(moveFocus) {
    if (!openPublishedItem) {
      return;
    }

    setPublishedState(
      openPublishedItem,
      false,
      Boolean(moveFocus),
    );

    openPublishedItem = null;
  }

  function createPublishedItem(
    imageData,
    publication,
    index,
  ) {
    const item = document.createElement("article");
    const card = document.createElement("div");
    const cardInner = document.createElement("div");

    const front = document.createElement("button");
    const back = document.createElement("button");

    const panel = document.createElement("div");
    const panelInner = document.createElement("div");
    const originalLink = document.createElement("a");

    const dot = document.createElement("span");
    const backLabel = document.createElement("span");
    const backAccount =
      document.createElement("strong");

    const linkText = document.createElement("span");
    const linkArrow =
      document.createElement("span");

    const panelId = "published-panel-" + index;
    const title = makeDisplayTitle(imageData.src);

    item.className =
      "more-work-item is-published";

    item.style.setProperty(
      "--item-ratio",
      imageData.width + " / " + imageData.height,
    );

    card.className = "more-work-card";
    cardInner.className = "more-work-card-inner";

    front.className =
      "more-work-face more-work-front";

    front.type = "button";

    front.setAttribute(
      "aria-label",
      "Show publication details for " + title,
    );

    front.setAttribute(
      "aria-expanded",
      "false",
    );

    front.setAttribute(
      "aria-controls",
      panelId,
    );

    const image = createArtworkImage(
      imageData,
      index,
      function () {
        item.dataset.loadFailed = "true";

        if (openPublishedItem === item) {
          openPublishedItem = null;
        }

        item.remove();
      },
    );

    dot.className = "published-dot";
    dot.setAttribute("aria-hidden", "true");

    front.append(image, dot);

    back.className =
      "more-work-face more-work-back";

    back.type = "button";
    back.tabIndex = -1;

    back.setAttribute(
      "aria-label",
      "Return to the artwork for " + title,
    );

    backLabel.className =
      "published-back-label";

    backLabel.textContent =
      "Published on " + publication.platform;

    backAccount.className =
      "published-back-account";

    backAccount.textContent =
      publication.account;

    back.append(backLabel, backAccount);

    cardInner.append(front, back);
    card.append(cardInner);

    panel.id = panelId;
    panel.className = "published-panel";

    panel.setAttribute(
      "aria-hidden",
      "true",
    );

    panelInner.className =
      "published-panel-inner";

    originalLink.className =
      "published-action";

    originalLink.href = publication.url;
    originalLink.target = "_blank";
    originalLink.rel = "noopener noreferrer";
    originalLink.tabIndex = -1;

    originalLink.setAttribute(
      "aria-label",
      "View the original post on " +
        publication.platform +
        " in a new tab",
    );

    linkText.textContent = "View original";

    linkArrow.className =
      "published-action-arrow";

    linkArrow.textContent = "↗";

    linkArrow.setAttribute(
      "aria-hidden",
      "true",
    );

    originalLink.append(linkText, linkArrow);
    panelInner.append(originalLink);
    panel.append(panelInner);

    item.append(card, panel);

    front.addEventListener(
      "click",
      function () {
        const shouldOpen =
          !item.classList.contains(
            "is-revealed",
          );

        if (
          openPublishedItem &&
          openPublishedItem !== item
        ) {
          setPublishedState(
            openPublishedItem,
            false,
            false,
          );
        }

        setPublishedState(
          item,
          shouldOpen,
          true,
        );

        openPublishedItem = shouldOpen
          ? item
          : null;
      },
    );

    back.addEventListener(
      "click",
      function () {
        setPublishedState(item, false, true);
        openPublishedItem = null;
      },
    );

    return item;
  }

  function createRegularItem(imageData, index) {
    const item =
      document.createElement("figure");

    item.className = "more-work-item";

    const image = createArtworkImage(
      imageData,
      index,
      function () {
        item.dataset.loadFailed = "true";
        item.remove();
      },
    );

    item.append(image);

    return item;
  }

  function createGalleryItem(imageData, index) {
    const publication = getPublication(
      imageData.src,
    );

    if (publication) {
      return createPublishedItem(
        imageData,
        publication,
        index,
      );
    }

    return createRegularItem(
      imageData,
      index,
    );
  }

  const galleryItems =
    workImages.map(createGalleryItem);

  const tabletQuery = window.matchMedia(
    "(max-width: 1050px)",
  );

  const mobileQuery = window.matchMedia(
    "(max-width: 700px)",
  );

  let activeColumnCount = 0;

  function getColumnCount() {
    if (mobileQuery.matches) {
      return 2;
    }

    if (tabletQuery.matches) {
      return 3;
    }

    return 4;
  }

  function renderGalleryColumns() {
    const columnCount = getColumnCount();

    if (
      columnCount === activeColumnCount &&
      gallery.children.length
    ) {
      return;
    }

    activeColumnCount = columnCount;

    const columns = Array.from(
      { length: columnCount },
      function (_, columnIndex) {
        const column =
          document.createElement("div");

        column.className =
          "more-work-column";

        column.dataset.column = String(
          columnIndex + 1,
        );

        return column;
      },
    );

    let visibleIndex = 0;

    galleryItems.forEach(function (item) {
      if (
        item.dataset.loadFailed === "true"
      ) {
        return;
      }

      const targetColumn =
        visibleIndex % columnCount;

      columns[targetColumn].append(item);
      visibleIndex += 1;
    });

    gallery.replaceChildren(...columns);
  }

  function watchBreakpoint(query) {
    if (
      typeof query.addEventListener ===
      "function"
    ) {
      query.addEventListener(
        "change",
        renderGalleryColumns,
      );
    } else {
      query.addListener(
        renderGalleryColumns,
      );
    }
  }

  document.addEventListener(
    "click",
    function (event) {
      if (
        openPublishedItem &&
        !openPublishedItem.contains(event.target)
      ) {
        closeCurrentCard(false);
      }
    },
  );

  document.addEventListener(
    "keydown",
    function (event) {
      if (
        event.key === "Escape" &&
        openPublishedItem
      ) {
        closeCurrentCard(true);
      }
    },
  );

  watchBreakpoint(tabletQuery);
  watchBreakpoint(mobileQuery);

  renderGalleryColumns();
})();