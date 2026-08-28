
const MOCK_PROPERTIES = [
  {
    title: "10.5 Acre High-Desert Homestead",
    location: "Coconino County, Arizona",
    price: 14900,
    description: "Off-grid recreational land with dirt road access, stunning mountain views, and no HOA restrictions. Ideal for camping, RVing, or building a solar homestead.",
    images: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"]
  },
  {
    title: "5.2 Acre Timber & Cabin Site",
    location: "Costilla County, Colorado",
    price: 8400,
    description: "Wooded mountain parcel located minutes from public hunting grounds. Clear legal access with flat building envelope ready for off-grid cabin installation.",
    images: ["https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80"]
  },
  {
    title: "2.1 Acre Infill Residential Lot",
    location: "Marion County, Florida",
    price: 21900,
    description: "Zoned R-1 for single-family residential construction. Electric power available at street line with paved road frontage in a growing neighborhood.",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"]
  },
  {
    title: "40.0 Acre Ranch & Recreation Tract",
    location: "Elko County, Nevada",
    price: 24500,
    description: "Extensive acreage parcel perfect for livestock, hunting camp, or long-term land banking. Features legal recorded easement access.",
    images: ["https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80"]
  }
];

let allProperties = [];

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initSearch();
  fetchProperties();
});

/**
 * Mobile Navigation Menu Handler
 */
function initMobileNav() {
  const toggleBtn = document.getElementById("mobile-toggle");
  const menu = document.getElementById("mobile-menu");

  if (toggleBtn && menu) {
    toggleBtn.addEventListener("click", () => {
      const isActive = menu.classList.toggle("active");
      toggleBtn.setAttribute("aria-expanded", isActive);
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!toggleBtn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove("active");
        toggleBtn.setAttribute("aria-expanded", "false");
      }
    });
  }
}

/**
 * Search Handler (Client-side filtering with Debounce)
 */
function initSearch() {
  const searchInput = document.getElementById("inventory-search");
  const container = document.getElementById("inventory-list");

  if (!searchInput) return;

  const handleSearch = debounce((e) => {
    const query = e.target.value.trim().toLowerCase();

    const filtered = allProperties.filter((item) => {
      const title = (item.title || item.name || "").toLowerCase();
      const location = (item.location || item.address || "").toLowerCase();
      const description = (item.description || item.desc || "").toLowerCase();

      return title.includes(query) || location.includes(query) || description.includes(query);
    });

    renderInventory(filtered, container);
  }, 200);

  searchInput.addEventListener("input", handleSearch);
}

/**
 * Utility: Debounce function to optimize search input processing
 */
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}


async function fetchProperties() {
  const container = document.getElementById("inventory-list");

  try {
    const res = await fetch("/api/dashboard/fetch-data", { method: "GET" });

    if (!res.ok) {
      throw new Error(`Server status ${res.status}`);
    }

    const result = await res.json();
    const rawData = result.data || result;

    if (Array.isArray(rawData) && rawData.length > 0) {
      allProperties = rawData;
    } else {
      allProperties = MOCK_PROPERTIES;
    }
  } catch (error) {
    console.warn("Backend API offline. Loading fallback portfolio.", error);
    allProperties = MOCK_PROPERTIES;
  }

  renderInventory(allProperties, container);
}

/**
 * Render property card grid with high-resolution images
 */
function renderInventory(properties, container) {
  if (!container) return;
  container.innerHTML = "";

  if (!properties || properties.length === 0) {
    container.innerHTML = `
      <div class="loading-state">
        <p>No parcels match your search criteria.</p>
      </div>`;
    return;
  }

  const fragment = document.createDocumentFragment();

  properties.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "property-card";

    const title = item.title || item.name || "Vacant Land Parcel";
    const location = item.location || item.address || "USA Location";
    const priceVal = item.price ? Number(item.price) : 0;
    const priceFormatted = priceVal > 0 ? `$${priceVal.toLocaleString()}` : "Inquire";
    const description = item.description || item.desc || "Direct wholesale land contract ready for immediate assignment.";

    const locParts = location.split(",");
    const stateBadge = locParts.length > 1 ? locParts[locParts.length - 1].trim().substring(0, 2).toUpperCase() : "USA";

    // Extract dynamic image or provide a reliable high-res land photo backup
    const imagesList = Array.isArray(item.images) ? item.images : [];
    const fallbackImgs = [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80"
    ];
    const imageSrc = imagesList[0] || fallbackImgs[index % fallbackImgs.length];

    const emailSubject = encodeURIComponent(`Inquiry for ${title}`);
    const emailBody = encodeURIComponent(`Hello Deals Team,\n\nI am interested in acquiring the property: ${title} (${location}). Please send over details and contract terms.\n\nThank you!`);

    card.innerHTML = `
      <div class="card-media">
        <img src="${imageSrc}" alt="${title}" loading="lazy">
        <span class="card-tag">${stateBadge}</span>
      </div>
      
      <div class="card-body">
        <h3>${title}</h3>
        <div class="card-location">
          <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          ${location}
        </div>
        <p class="card-desc">${description}</p>
        
        <div class="card-footer">
          <div class="card-price">${priceFormatted}</div>
          <a href="mailto:USAVACANTLANDDEALS@GMAIL.COM?subject=${emailSubject}&body=${emailBody}" class="btn-card">
            LOCK DEAL
          </a>
        </div>
      </div>
    `;

    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}
