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

// Open/Close Modal Handlers
openModalBtn?.addEventListener('click', () => modal.classList.remove('hidden'));
closeModalBtn?.addEventListener('click', () => modal.classList.add('hidden'));

// Logout function
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

// Display properties with Delete action button & Cloudinary images
function displayProperties(properties) {
  container.innerHTML = '';

  if (properties.length === 0) {
    container.innerHTML = '<p>No properties available.</p>';
    return;
  }

  properties.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'property-card';

    // Render uploaded image gallery if present
    const imagesHtml = Array.isArray(item.images) && item.images.length > 0
      ? `<div class="image-gallery" style="display:flex; gap:8px; overflow-x:auto; margin:10px 0;">
           ${item.images.map(url => `<img src="${url}" style="width:80px; height:60px; object-fit:cover; border-radius:4px;" />`).join('')}
         </div>`
      : '';

    card.innerHTML = `
      <h3 class="property-title">${item.title || item.name || 'Property'}</h3>
      <div class="property-price">$${item.price ? Number(item.price).toLocaleString() : 'N/A'}</div>
      <p class="property-details"><strong>Location:</strong> ${item.location || item.address || 'No location provided'}</p>
      ${item.description ? `<p class="property-details"><strong>Description:</strong> ${item.description}</p>` : ''}
      ${imagesHtml}
      <button class="btn-delete" data-id="${item.id}">Delete</button>
    `;

    // Attach click handler for deleting this card
    const deleteBtn = card.querySelector('.btn-delete');
    deleteBtn.addEventListener('click', () => deleteProperty(item.id));

    container.appendChild(card);
  });
}

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
      renderDashboard(); // Refresh property list
    } else {
      alert(result.message || 'Failed to delete property.');
    }

  } catch (error) {
    console.error('Error deleting property:', error);
  }
}

// POST: Add New Property with Multi-Image FormData
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
        // Do NOT set 'Content-Type' header here
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
      renderDashboard(); // Refresh property list
    } else {
      alert(result.message || 'Failed to insert property.');
    }
  } catch (error) {
    console.error('Error submitting POST request:', error);
  }
});

renderDashboard();
