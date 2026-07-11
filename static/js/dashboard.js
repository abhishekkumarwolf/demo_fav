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

function renderRecentTasks(tasks) {
  const container = document.getElementById('activityList');
  if (!tasks.length) {
    container.innerHTML = '<div class="text-muted" style="padding:24px">No pending tasks.</div>';
    return;
  }
  container.innerHTML = tasks.slice(0, 5).map(t => `
    <div class="activity-item">
      <div class="activity-content">
        <div class="activity-title-row">
          <span class="activity-text"><strong>${t.title}</strong></span>
          <span class="task-priority ${t.priority}">${t.priority}</span>
          <span class="task-priority" style="background:#e0f7ff;color:#2d7d8f;margin-left:4px">${t.taskType}</span>
        </div>
        <span class="activity-time">
          ${t.dueDate ? 'Due: ' + t.dueDate : 'No due date'}
          ${t.assignedTo ? ' — ' + t.assignedTo : ''}
        </span>
      </div>
      <div class="task-property">${t.propertyName}</div>
    </div>
  `).join('');
}

function loadRecentTasks() {
  fetch('/api/tasks/?status=pending')
    .then(r => r.json())
    .then(data => {
      renderRecentTasks(data);
    })
    .catch(() => {
      document.getElementById('activityList').innerHTML =
        '<div class="text-muted" style="padding:24px">Failed to load tasks.</div>';
    });
}

document.addEventListener('DOMContentLoaded', () => {
  loadDashboard();
  loadRecentTasks();
});
