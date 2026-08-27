/* ==========================================================================
   USA Vacant Land Wholesaler - Client Engine
   ========================================================================== */

// Fallback high-value land inventory tailored precisely to: title, location, price, description
const MOCK_PROPERTIES = [
  {
    title: "10.5 Acre High-Desert Homestead",
    location: "Coconino County, Arizona",
    price: 14900,
    description: "Off-grid recreational land with dirt road access, stunning mountain views, and no HOA restrictions. Ideal for camping, RVing, or building a solar homestead."
  },
  {
    title: "5.2 Acre Timber & Cabin Site",
    location: "Costilla County, Colorado",
    price: 8400,
    description: "Wooded mountain parcel located minutes from public hunting grounds. Clear legal access with flat building envelope ready for off-grid cabin installation."
  },
  {
    title: "2.1 Acre Infill Residential Lot",
    location: "Marion County, Florida",
    price: 21900,
    description: "Zoned R-1 for single-family residential construction. Electric power available at street line with paved road frontage in a growing neighborhood."
  },
  {
    title: "40.0 Acre Ranch & Recreation Tract",
    location: "Elko County, Nevada",
    price: 24500,
    description: "Extensive acreage parcel perfect for livestock, hunting camp, or long-term land banking. Features legal recorded easement access."
  }
];

let allProperties = [];

document.addEventListener("DOMContentLoaded", () => {
  initSearch();
  fetchProperties();
});

/**
 * Fetch land deals from backend endpoint or fallback to mock inventory
 */
async function fetchProperties() {
  const container = document.getElementById("inventory-list");

  try {
    const res = await fetch("/api/dashboard/fetch-data", { method: "GET" });

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }

    const result = await res.json();
    const rawData = result.data || result;

    if (Array.isArray(rawData) && rawData.length > 0) {
      allProperties = rawData;
    } else {
      allProperties = MOCK_PROPERTIES;
    }
  } catch (error) {
    console.warn("Backend API offline. Displaying fallback portfolio.", error);
    allProperties = MOCK_PROPERTIES;
  }

  renderInventory(allProperties, container);
}

/**
 * Render text-based property rows into DOM
 */
function renderInventory(properties, container) {
  container.innerHTML = "";

  if (!properties || properties.length === 0) {
    container.innerHTML = `<div class="loading-state"><p>No parcels match your current search query.</p></div>`;
    return;
  }

  properties.forEach((item) => {
    const row = document.createElement("article");
    row.className = "inventory-row";

    const title = item.title || item.name || "Vacant Land Parcel";
    const location = item.location || item.address || "USA Location";
    const priceVal = item.price ? Number(item.price) : 0;
    const priceFormatted = priceVal > 0 ? `$${priceVal.toLocaleString()}` : "Contact for Price";
    const description = item.description || item.desc || "Direct wholesale opportunity available.";

    const locParts = location.split(",");
    const stateBadge = locParts.length > 1 ? locParts[locParts.length - 1].trim().substring(0, 2).toUpperCase() : "USA";

    // Build image preview strip for main landing page
    const imagesList = Array.isArray(item.images) ? item.images : [];
    const mainImage = imagesList[0] 
      ? `<img src="${imagesList[0]}" alt="${title}" style="width:120px; height:80px; object-fit:cover; border-radius:6px; margin-right:12px;">` 
      : '';

    row.innerHTML = `
      <div class="inv-col inv-info" style="display:flex; align-items:center;">
        ${mainImage}
        <div>
          <h3>
            ${title}
            <span class="badge">${stateBadge}</span>
          </h3>
          <p class="inv-loc">
            <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            ${location}
          </p>
        </div>
      </div>

      <div class="inv-col inv-desc">
        <p>${description}</p>
      </div>

      <div class="inv-col inv-action">
        <div class="price">${priceFormatted}</div>
        <a href="mailto:USAVACANTLANDDEALS@GMAIL.COM?subject=Inquiry for ${encodeURIComponent(title)}" class="btn-sm">
          INQUIRE / LOCK DEAL &rarr;
        </a>
      </div>
    `;

    container.appendChild(row);
  });
}

/**
 * Search functionality
 */
function initSearch() {
  const searchInput = document.getElementById("inventory-search");
  const container = document.getElementById("inventory-list");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      
      const filtered = allProperties.filter((item) => {
        const text = `${item.title || ''} ${item.location || ''} ${item.description || ''}`.toLowerCase();
        return text.includes(query);
      });

      renderInventory(filtered, container);
    });
  }
}