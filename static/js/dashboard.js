function getStatusBadge(status) {
  return `<span class="status-badge ${status}">${status.replace('_', ' ')}</span>`;
}

function renderRecentReservations(reservations) {
  const tbody = document.getElementById('recentBookings');
  if (!reservations.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-muted">No recent reservations.</td></tr>';
    return;
  }
  tbody.innerHTML = reservations.map(r => `
    <tr>
      <td><strong>${r.guestName}</strong></td>
      <td><a href="/calendar/?property=${r.propertyId}" style="color:var(--color-primary);text-decoration:none">${r.propertyName}</a></td>
      <td>${r.checkIn}</td>
      <td>${r.checkOut}</td>
      <td>${getStatusBadge(r.status)}</td>
      <td><strong>$${Number(r.totalAmount).toLocaleString()}</strong></td>
    </tr>
  `).join('');
}

function loadDashboard() {
  fetch('/api/dashboard/stats/')
    .then(r => r.json())
    .then(data => {
      document.getElementById('totalProperties').textContent  = data.totalProperties;
      document.getElementById('activeBookings').textContent   = data.activeReservations;
      document.getElementById('totalRevenue').textContent     = '$' + Number(data.totalRevenue).toLocaleString();

      const avgEl = document.getElementById('avgRate');
      if (avgEl) {
        const avg = data.avgNightlyRate ? '$' + Number(data.avgNightlyRate).toFixed(0) : '—';
        avgEl.textContent = avg;
      }

      renderRecentReservations(data.recentReservations || []);
    })
    .catch(() => {
      document.getElementById('recentBookings').innerHTML =
        '<tr><td colspan="6" class="text-muted">Failed to load data.</td></tr>';
    });
}

document.addEventListener('DOMContentLoaded', loadDashboard);
