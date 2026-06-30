const PAGE_COUNT = 20;
const PAGE_PREFIX = "assets/single-pages/page-";
const PAGE_EXTENSION = ".jpg";
const PAGE_VERSION = "20260630-final-design";
const PAGE_RATIO = "1241 / 1754";
const MIN_ZOOM = 1;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.25;

const book = document.querySelector("[data-book]");
const leftSlot = document.querySelector('[data-slot="left"]');
const rightSlot = document.querySelector('[data-slot="right"]');
const statusText = document.querySelector("[data-status]");
const zoomStatus = document.querySelector("[data-zoom-status]");
const controls = Array.from(document.querySelectorAll("[data-action]"));

let currentStart = 1;
let zoomLevel = 1;

function pageUrl(pageNumber) {
  return `${PAGE_PREFIX}${String(pageNumber).padStart(2, "0")}${PAGE_EXTENSION}?v=${PAGE_VERSION}`;
}

function nextStart() {
  return Math.min(currentStart + 1, PAGE_COUNT);
}

function previousStart() {
  return Math.max(currentStart - 1, 1);
}

function visiblePages() {
  return [currentStart];
}

function setSlot(slot, pageNumber) {
  const image = slot.querySelector("img");

  if (!pageNumber) {
    slot.classList.add("is-hidden");
    image.removeAttribute("src");
    image.alt = "";
    return;
  }

  slot.classList.remove("is-hidden");
  slot.classList.toggle("is-zoomed", zoomLevel > MIN_ZOOM);
  slot.style.aspectRatio = PAGE_RATIO;
  slot.style.setProperty("--page-zoom", zoomLevel);
  slot.scrollTop = 0;
  slot.scrollLeft = 0;
  image.src = pageUrl(pageNumber);
  image.alt = `Overtourism playbook page ${pageNumber}`;
}

function updateControls() {
  controls.forEach((control) => {
    const action = control.dataset.action;

    if (action === "previous") {
      control.disabled = currentStart === 1;
    }

    if (action === "next") {
      control.disabled = currentStart === PAGE_COUNT;
    }

    if (action === "zoom-out") {
      control.disabled = zoomLevel <= MIN_ZOOM;
    }

    if (action === "zoom-in") {
      control.disabled = zoomLevel >= MAX_ZOOM;
    }
  });
}

function updateStatus(pages) {
  if (pages.length === 1) {
    statusText.textContent = `Page ${pages[0]} of ${PAGE_COUNT}`;
    return;
  }

  statusText.textContent = `Pages ${pages[0]}-${pages[1]} of ${PAGE_COUNT}`;
}

function render(direction = "next") {
  const pages = visiblePages();
  book.classList.add("is-single");
  book.classList.remove("is-turning-next", "is-turning-previous");
  book.classList.add(direction === "previous" ? "is-turning-previous" : "is-turning-next");

  setSlot(leftSlot, pages[0]);
  setSlot(rightSlot, null);
  updateStatus(pages);
  updateControls();

  window.setTimeout(() => {
    book.classList.remove("is-turning-next", "is-turning-previous");
  }, 180);
}

function goNext() {
  const target = nextStart();

  if (target !== currentStart) {
    currentStart = target;
    render("next");
  }
}

function goPrevious() {
  const target = previousStart();

  if (target !== currentStart) {
    currentStart = target;
    render("previous");
  }
}

function preloadNextPages() {
  for (let page = 1; page <= PAGE_COUNT; page += 1) {
    const image = new Image();
    image.src = pageUrl(page);
  }
}

function formatZoom() {
  return `${Math.round(zoomLevel * 100)}%`;
}

function updateZoom() {
  [leftSlot, rightSlot].forEach((slot) => {
    slot.classList.toggle("is-zoomed", zoomLevel > MIN_ZOOM);
    slot.style.setProperty("--page-zoom", zoomLevel);
  });

  zoomStatus.textContent = formatZoom();
  updateControls();
}

function setZoom(nextZoom) {
  zoomLevel = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoom));
  updateZoom();
}

controls.forEach((control) => {
  control.addEventListener("click", () => {
    if (control.dataset.action === "next") {
      goNext();
    }

    if (control.dataset.action === "previous") {
      goPrevious();
    }

    if (control.dataset.action === "zoom-out") {
      setZoom(zoomLevel - ZOOM_STEP);
    }

    if (control.dataset.action === "zoom-in") {
      setZoom(zoomLevel + ZOOM_STEP);
    }

    if (control.dataset.action === "zoom-reset") {
      setZoom(MIN_ZOOM);
    }
  });
});

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    goNext();
  }

  if (event.key === "ArrowLeft") {
    goPrevious();
  }

  if (event.key === "+" || event.key === "=") {
    setZoom(zoomLevel + ZOOM_STEP);
  }

  if (event.key === "-") {
    setZoom(zoomLevel - ZOOM_STEP);
  }

  if (event.key === "0") {
    setZoom(MIN_ZOOM);
  }
});

let touchStartX = null;

book.addEventListener(
  "touchstart",
  (event) => {
    touchStartX = event.changedTouches[0].clientX;
  },
  { passive: true }
);

book.addEventListener(
  "touchend",
  (event) => {
    if (touchStartX === null) {
      return;
    }

    const distance = event.changedTouches[0].clientX - touchStartX;

    if (Math.abs(distance) > 42) {
      distance < 0 ? goNext() : goPrevious();
    }

    touchStartX = null;
  },
  { passive: true }
);

render();
preloadNextPages();
