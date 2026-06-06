let allProperties = [];

function renderListings(properties) {
  const grid = document.getElementById('listingsGrid');
  if (!properties.length) {
    grid.innerHTML = '<div class="text-muted" style="grid-column:1/-1">No properties found.</div>';
    return;
  }
  grid.innerHTML = properties.map(p => {
    const img = p.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=55c1d9&color=fff&size=48`;
    const location = [p.city, p.country].filter(Boolean).join(', ') || 'No location';
    return `
      <div class="content-card" onclick="window.location='/calendar/?property=${p.id}'">
        <div class="content-card-top">
          <div class="content-card-thumb">
            <img src="${img}" alt="${p.name}">
          </div>
          <div class="content-card-info">
            <div class="content-card-title">${p.name}</div>
            <div class="content-card-sub">${location}</div>
          </div>
          <span class="status-badge confirmed">Active</span>
        </div>
        <div class="content-card-meta">
          <span>${p.bookingCount} booking${p.bookingCount !== 1 ? 's' : ''}</span>
          <a href="/calendar/?property=${p.id}" onclick="event.stopPropagation()" style="margin-left:auto;font-size:12px;font-weight:500;color:var(--color-primary);text-decoration:none;">View Calendar →</a>
        </div>
      </div>
    `;
  }).join('');
}

function loadListings() {
  fetch('/api/properties/')
    .then(r => r.json())
    .then(data => {
      allProperties = data;
      renderListings(data);
    })
    .catch(() => {
      document.getElementById('listingsGrid').innerHTML =
        '<div class="text-muted" style="grid-column:1/-1">Failed to load listings.</div>';
    });
}

function getCsrfToken() {
  const match = document.cookie.match(/(^| )csrftoken=([^;]+)/);
  return match ? match[2] : '';
}

function showModal() {
  document.getElementById('createListingModal').classList.add('open');
  document.getElementById('formAlert').classList.remove('visible');
  document.getElementById('formSuccess').classList.remove('visible');
}

function hideModal() {
  document.getElementById('createListingModal').classList.remove('open');
  document.getElementById('createListingForm').reset();
  document.getElementById('formAlert').classList.remove('visible');
  document.getElementById('formSuccess').classList.remove('visible');
}

function showError(msg) {
  const el = document.getElementById('formAlert');
  el.textContent = msg;
  el.classList.add('visible');
  document.getElementById('formSuccess').classList.remove('visible');
}

function showSuccess(msg) {
  const el = document.getElementById('formSuccess');
  el.textContent = msg;
  el.classList.add('visible');
  document.getElementById('formAlert').classList.remove('visible');
}

document.addEventListener('DOMContentLoaded', () => {
  loadListings();

  document.getElementById('listingSearch').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    renderListings(allProperties.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.city || '').toLowerCase().includes(q) ||
      (p.country || '').toLowerCase().includes(q)
    ));
  });

  document.getElementById('newListingBtn').addEventListener('click', showModal);
  document.getElementById('closeModalBtn').addEventListener('click', hideModal);
  document.getElementById('cancelBtn').addEventListener('click', hideModal);
  document.getElementById('createListingModal').addEventListener('click', e => {
    if (e.target === e.currentTarget) hideModal();
  });

  document.getElementById('createListingForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('propertyName').value.trim();
    const description = document.getElementById('propertyDescription').value.trim();
    const city = document.getElementById('propertyCity').value.trim();
    const state = document.getElementById('propertyState').value.trim();
    const country = document.getElementById('propertyCountry').value.trim();
    const max_guests = parseInt(document.getElementById('propertyMaxGuests').value) || 2;
    const address = document.getElementById('propertyAddress').value.trim();
    const property_image = document.getElementById('propertyImage').value.trim();

    if (!name || !city || !country) {
      showError('Please fill in all required fields.');
      return;
    }

    const btn = document.getElementById('submitListing');
    btn.disabled = true;
    btn.textContent = 'Creating...';

    fetch('/api/properties/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCsrfToken()
      },
      body: JSON.stringify({
        name, description, city, state, country, max_guests, address, property_image
      })
    })
      .then(r => r.json().then(data => ({ ok: r.ok, data })))
      .then(({ ok, data }) => {
        if (ok) {
          showSuccess('Listing created successfully!');
          setTimeout(() => {
            hideModal();
            loadListings();
          }, 1000);
        } else {
          showError(data.error || 'Failed to create listing.');
        }
      })
      .catch(() => showError('Network error. Please try again.'))
      .finally(() => {
        btn.disabled = false;
        btn.textContent = 'Create Listing';
      });
  });
});
