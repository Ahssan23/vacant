const token = localStorage.getItem('token');

// Immediate redirect if token is missing
if (!token) {
  window.location.href = '/dashboard';
}

const container = document.querySelector('#properties-container');
const logoutBtn = document.querySelector('#logout-btn');

// Modal Elements
const modal = document.querySelector('#property-modal');
const openModalBtn = document.querySelector('#open-modal-btn');
const closeModalBtn = document.querySelector('#close-modal-btn');
const addForm = document.querySelector('#add-property-form');

// Lightbox Elements
const lightboxModal = document.querySelector('#lightbox-modal');
const lightboxImg = document.querySelector('#lightbox-img');
const lightboxCounter = document.querySelector('#lightbox-counter');
const lightboxClose = document.querySelector('#lightbox-close');
const lightboxPrev = document.querySelector('#lightbox-prev');
const lightboxNext = document.querySelector('#lightbox-next');

let activeGallery = [];
let activeIndex = 0;

// Open/Close Modal Handlers
openModalBtn?.addEventListener('click', () => modal.classList.remove('hidden'));
closeModalBtn?.addEventListener('click', () => modal.classList.add('hidden'));

// Logout handler
logoutBtn?.addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = '/';
});

// GET: Fetch Properties
async function renderDashboard() {
  try {
    const res = await fetch('/api/dashboard/fetch-data', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return;
    }

    const result = await res.json();

    if (result.success && result.data) {
      displayProperties(result.data);
    } else {
      container.innerHTML = '<p>No properties found.</p>';
    }

  } catch (error) {
    console.error('Error loading properties:', error);
    container.innerHTML = '<p>Failed to load properties. Try again later.</p>';
  }
}

// Display properties with vertical stack & full image slider
function displayProperties(properties) {
  container.innerHTML = '';

  if (!properties || properties.length === 0) {
    container.innerHTML = '<p>No properties available.</p>';
    return;
  }

  properties.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'property-card';

    // Normalize images: ensure array format
    let imageList = [];
    if (Array.isArray(item.images)) {
      imageList = item.images;
    } else if (typeof item.images === 'string' && item.images.trim() !== '') {
      imageList = [item.images];
    }

    // Render enlarged image carousel at the top of the card
    const imagesHtml = imageList.length > 0
      ? `<div class="property-slider-container">
           <div class="property-slider">
             ${imageList.map((url, idx) => `
               <div class="slide-item" data-index="${idx}">
                 <img src="${url}" alt="Property Image ${idx + 1}" loading="lazy" />
                 ${imageList.length > 1 ? `<span class="badge">${idx + 1}/${imageList.length}</span>` : ''}
               </div>
             `).join('')}
           </div>
         </div>`
      : '';

    // Property details stacked directly below the image gallery
    card.innerHTML = `
      ${imagesHtml}
      <div class="card-body">
        <h3 class="property-title">${item.title || item.name || 'Property'}</h3>
        <div class="property-price">
          $${item.price ? Number(item.price).toLocaleString() : 'N/A'}
        </div>
        <p class="property-details"><strong>Location:</strong> ${item.location || item.address || 'No location provided'}</p>
        ${item.description ? `<p class="property-details"><strong>Description:</strong> ${item.description}</p>` : ''}
        <button class="btn-delete" data-id="${item.id}">Delete Property</button>
      </div>
    `;

    // Attach Lightbox click handlers to images inside this card
    const slideItems = card.querySelectorAll('.slide-item');
    slideItems.forEach((slide) => {
      slide.addEventListener('click', () => {
        const clickedIdx = parseInt(slide.getAttribute('data-index'), 10);
        openLightbox(imageList, clickedIdx);
      });
    });

    // Delete handler
    const deleteBtn = card.querySelector('.btn-delete');
    deleteBtn?.addEventListener('click', () => deleteProperty(item.id));

    container.appendChild(card);
  });
}

// Lightbox Navigation Functions
function openLightbox(images, index) {
  activeGallery = images;
  activeIndex = index;
  updateLightboxImage();
  lightboxModal.classList.remove('hidden');
}

function updateLightboxImage() {
  if (activeGallery.length === 0) return;
  lightboxImg.src = activeGallery[activeIndex];
  lightboxCounter.textContent = `${activeIndex + 1} / ${activeGallery.length}`;
}

lightboxClose?.addEventListener('click', () => lightboxModal.classList.add('hidden'));

lightboxPrev?.addEventListener('click', () => {
  activeIndex = (activeIndex - 1 + activeGallery.length) % activeGallery.length;
  updateLightboxImage();
});

lightboxNext?.addEventListener('click', () => {
  activeIndex = (activeIndex + 1) % activeGallery.length;
  updateLightboxImage();
});

// DELETE: Remove Property
async function deleteProperty(id) {
  if (!confirm('Are you sure you want to delete this property?')) return;

  try {
    const res = await fetch(`/api/dashboard/delete-data/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return;
    }

    const result = await res.json();

    if (res.ok && result.success) {
      renderDashboard();
    } else {
      alert(result.message || 'Failed to delete property.');
    }

  } catch (error) {
    console.error('Error deleting property:', error);
  }
}

// POST: Add New Property
addForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('title', document.querySelector('#title').value);
  formData.append('location', document.querySelector('#location').value);
  formData.append('price', parseFloat(document.querySelector('#price').value));
  formData.append('description', document.querySelector('#description').value);

  const fileInput = document.querySelector('#images');
  if (fileInput && fileInput.files.length > 0) {
    if (fileInput.files.length > 10) {
      alert('You can upload a maximum of 10 images.');
      return;
    }

    for (let i = 0; i < fileInput.files.length; i++) {
      formData.append('images', fileInput.files[i]);
    }
  }

  try {
    const res = await fetch('/api/dashboard/post-data', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return;
    }

    const result = await res.json();

    if (res.ok && result.success) {
      addForm.reset();
      modal.classList.add('hidden');
      renderDashboard();
    } else {
      alert(result.message || 'Failed to insert property.');
    }
  } catch (error) {
    console.error('Error submitting POST request:', error);
  }
});

// Initial load
renderDashboard();
