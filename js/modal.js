function openBookingModal(booking) {
  const overlay = document.getElementById('modalOverlay');
  const content = document.getElementById('modalContent');

  const property = getPropertyById(booking.propertyId);
  const checkIn = new Date(booking.checkIn + 'T00:00:00');
  const checkOut = new Date(booking.checkOut + 'T00:00:00');
  const totalNights = Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24));

  const statusClass = `status-${booking.status}`;
  const statusLabel = booking.status.replace('_', ' ');

  content.innerHTML = `
    <div class="modal-header">
      <div class="modal-guest-avatar">
        <img src="${booking.guestAvatar}" alt="${booking.guestName}">
      </div>
      <div class="modal-guest-info">
        <h2>${booking.guestName}</h2>
        <span class="modal-property-name">${property ? property.name : 'Unknown Property'}</span>
      </div>
      <div class="modal-status-badge ${statusClass}">${statusLabel}</div>
    </div>
    <div class="modal-body">
      <div class="modal-detail-item">
        <span class="modal-detail-label">Check In</span>
        <span class="modal-detail-value">${formatDate(checkIn)}</span>
      </div>
      <div class="modal-detail-item">
        <span class="modal-detail-label">Check Out</span>
        <span class="modal-detail-value">${formatDate(checkOut)}</span>
      </div>
      <div class="modal-detail-item">
        <span class="modal-detail-label">Total Nights</span>
        <span class="modal-detail-value">${totalNights} ${totalNights === 1 ? 'night' : 'nights'}</span>
      </div>
      <div class="modal-detail-item">
        <span class="modal-detail-label">Total Price</span>
        <span class="modal-detail-value price-value">$${booking.totalPrice.toLocaleString()}</span>
      </div>
      <div class="modal-detail-item">
        <span class="modal-detail-label">Booking Source</span>
        <span class="modal-detail-value">${booking.bookingSource}</span>
      </div>
      <div class="modal-detail-item">
        <span class="modal-detail-label">Booking Link</span>
        <span class="modal-detail-value"><a href="${booking.bookingLink}" target="_blank" rel="noopener">View Booking</a></span>
      </div>
    </div>
    <div class="modal-footer">
      <button class="modal-btn modal-btn-secondary" data-modal-action="close">Close</button>
      <button class="modal-btn modal-btn-primary">Edit Booking</button>
    </div>
  `;

  overlay.classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');

  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
    }
    if (e.target.hasAttribute('data-modal-action') && e.target.getAttribute('data-modal-action') === 'close') {
      closeModal();
    }
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

function formatDate(date) {
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}
