const PAGE_COUNT = 11;
const PAGE_PREFIX = "assets/pages/page-";
const PAGE_EXTENSION = ".jpg";
const PAGE_RATIOS = {
  1: "1241 / 1754",
  11: "1241 / 1754"
};

const book = document.querySelector("[data-book]");
const leftSlot = document.querySelector('[data-slot="left"]');
const rightSlot = document.querySelector('[data-slot="right"]');
const statusText = document.querySelector("[data-status]");
const controls = Array.from(document.querySelectorAll("[data-action]"));

let currentStart = 1;

function pageUrl(pageNumber) {
  return `${PAGE_PREFIX}${String(pageNumber).padStart(2, "0")}${PAGE_EXTENSION}`;
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
  slot.style.aspectRatio = PAGE_RATIOS[pageNumber] || "2481 / 1754";
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

controls.forEach((control) => {
  control.addEventListener("click", () => {
    if (control.dataset.action === "next") {
      goNext();
    }

    if (control.dataset.action === "previous") {
      goPrevious();
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
