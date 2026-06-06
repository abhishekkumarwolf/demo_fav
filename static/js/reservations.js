let allReservations = [];
let propertiesMap = {};
let guestsMap = {};

function getCsrfToken() {
  const match = document.cookie.match(/(^| )csrftoken=([^;]+)/);
  return match ? match[2] : '';
}

function getStatusBadge(status) {
  return `<span class="status-badge ${status}">${status.replace('_', ' ')}</span>`;
}

function renderReservations(data) {
  const tbody = document.getElementById('reservationsTable');
  if (!data.length) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-muted">No reservations found.</td></tr>';
    return;
  }
  tbody.innerHTML = data.map(r => `
    <tr>
      <td><strong>${r.guestName}</strong></td>
      <td><a href="/calendar/?property=${r.propertyId}" style="color:var(--color-primary);text-decoration:none;font-weight:500">${r.propertyName || 'Unknown'}</a></td>
      <td>${r.checkIn}</td>
      <td>${r.checkOut}</td>
      <td>${r.nights} night${r.nights !== 1 ? 's' : ''}</td>
      <td>${getStatusBadge(r.status)}</td>
      <td><strong>$${Number(r.totalAmount).toLocaleString()}</strong></td>
      <td style="color:var(--color-text-secondary)">${r.source || '-'}</td>
    </tr>
  `).join('');
}

function loadReservations(search, status) {
  let url = '/api/reservations/?';
  if (search) url += 'search=' + encodeURIComponent(search) + '&';
  if (status) url += 'status=' + encodeURIComponent(status) + '&';
  return fetch(url)
    .then(r => r.json())
    .then(data => { allReservations = data; renderReservations(data); })
    .catch(() => {
      document.getElementById('reservationsTable').innerHTML =
        '<tr><td colspan="8" class="text-muted">Failed to load reservations.</td></tr>';
    });
}

function loadProperties() {
  return fetch('/api/properties/')
    .then(r => r.json())
    .then(data => {
      const sel = document.getElementById('bookingProperty');
      data.forEach(p => {
        propertiesMap[p.id] = p.name;
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.name;
        sel.appendChild(opt);
      });
    });
}

function loadGuests() {
  return fetch('/api/guests/')
    .then(r => r.json())
    .then(data => {
      const sel = document.getElementById('bookingGuest');
      data.forEach(g => {
        guestsMap[g.id] = g.name;
        const opt = document.createElement('option');
        opt.value = g.id;
        opt.textContent = g.name;
        sel.appendChild(opt);
      });
    });
}

function showModal() {
  document.getElementById('createBookingModal').classList.add('open');
  document.getElementById('formAlert').classList.remove('visible');
  document.getElementById('formSuccess').classList.remove('visible');
}

function hideModal() {
  document.getElementById('createBookingModal').classList.remove('open');
  document.getElementById('createBookingForm').reset();
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
  loadReservations();
  loadProperties();
  loadGuests();

  let currentSearch = '';
  let currentStatus = '';

  document.getElementById('reservationSearch').addEventListener('input', e => {
    currentSearch = e.target.value.trim();
    loadReservations(currentSearch, currentStatus);
  });

  document.querySelectorAll('.status-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.status-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentStatus = btn.dataset.status || '';
      loadReservations(currentSearch, currentStatus);
    });
  });

  document.getElementById('newReservationBtn').addEventListener('click', showModal);
  document.getElementById('closeModalBtn').addEventListener('click', hideModal);
  document.getElementById('cancelBtn').addEventListener('click', hideModal);
  document.getElementById('createBookingModal').addEventListener('click', e => {
    if (e.target === e.currentTarget) hideModal();
  });

  document.getElementById('createBookingForm').addEventListener('submit', e => {
    e.preventDefault();
    const property_id   = document.getElementById('bookingProperty').value;
    const guest_id      = document.getElementById('bookingGuest').value;
    const check_in      = document.getElementById('bookingCheckIn').value;
    const check_out     = document.getElementById('bookingCheckOut').value;
    const price_per_night = parseFloat(document.getElementById('bookingPrice').value) || 0;
    const total_amount  = parseFloat(document.getElementById('bookingTotal').value) || 0;
    const source        = document.getElementById('bookingSource').value;
    const status        = document.getElementById('bookingStatus').value;

    if (!property_id || !guest_id || !check_in || !check_out) {
      showError('Please fill in all required fields.'); return;
    }
    if (check_in >= check_out) {
      showError('Check-out must be after check-in.'); return;
    }

    const btn = document.getElementById('submitBooking');
    btn.disabled = true; btn.textContent = 'Creating...';

    fetch('/api/reservations/create/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCsrfToken() },
      body: JSON.stringify({
        property_id: parseInt(property_id), guest_id: parseInt(guest_id),
        check_in, check_out, price_per_night, total_amount, source, status,
      }),
    })
      .then(r => r.json().then(data => ({ ok: r.ok, status: r.status, data })))
      .then(({ ok, status: httpStatus, data }) => {
        if (ok) {
          showSuccess('Reservation created!');
          hideModal();
          loadReservations(currentSearch, currentStatus);
        } else if (httpStatus === 409) {
          const c = data.collision;
          showError(`${data.error} (${c.guestName}: ${c.checkIn} – ${c.checkOut})`);
        } else {
          showError(data.error || 'Failed to create reservation.');
        }
      })
      .catch(() => showError('Network error. Please try again.'))
      .finally(() => { btn.disabled = false; btn.textContent = 'Create Reservation'; });
  });
});
