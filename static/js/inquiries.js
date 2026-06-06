function getCsrfToken() {
  const match = document.cookie.match(/(^| )csrftoken=([^;]+)/);
  return match ? match[2] : '';
}

function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function statusBadge(status) {
  const map = { new: 'var(--color-primary)', replied: '#22c55e', archived: '#94a3b8' };
  const color = map[status] || '#94a3b8';
  return status !== 'archived'
    ? `<span class="message-badge" style="background:${color}20;color:${color}">${status}</span>`
    : '';
}

function renderInquiries(inquiries) {
  const list = document.getElementById('inquiryList');
  if (!inquiries.length) {
    list.innerHTML = '<div class="text-muted" style="padding:24px">No inquiries found.</div>';
    return;
  }
  list.innerHTML = inquiries.map(i => `
    <div class="message-item" data-id="${i.id}">
      <div class="message-avatar">
        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(i.guestName)}&background=55c1d9&color=fff&size=40&rounded=true" alt="">
      </div>
      <div class="message-body">
        <div class="message-header">
          <span class="message-name">${i.guestName} ${statusBadge(i.status)}</span>
          <span class="message-time">${timeAgo(i.createdAt)}</span>
        </div>
        <div class="message-preview">${i.message}</div>
        ${i.propertyName ? `<div style="font-size:11px;color:var(--color-text-muted);margin-top:3px">${i.propertyName}</div>` : ''}
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;margin-left:8px;flex-shrink:0">
        ${i.status === 'new' ? `<button class="filter-btn" style="padding:4px 8px;font-size:11px" onclick="updateInquiry(${i.id},'replied')">Mark Replied</button>` : ''}
        ${i.status !== 'archived' ? `<button class="filter-btn" style="padding:4px 8px;font-size:11px;color:var(--color-text-muted)" onclick="updateInquiry(${i.id},'archived')">Archive</button>` : ''}
      </div>
    </div>
  `).join('');
}

function updateInquiry(id, status) {
  fetch(`/api/inquiries/${id}/update/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCsrfToken() },
    body: JSON.stringify({ status }),
  }).then(() => loadInquiries()).catch(() => {});
}

let activeStatus = '';

function loadInquiries() {
  let url = '/api/inquiries/';
  if (activeStatus) url += '?status=' + activeStatus;
  fetch(url)
    .then(r => r.json())
    .then(renderInquiries)
    .catch(() => {
      document.getElementById('inquiryList').innerHTML =
        '<div class="text-muted" style="padding:24px">Failed to load inquiries.</div>';
    });
}

document.addEventListener('DOMContentLoaded', () => {
  loadInquiries();

  document.querySelectorAll('.inquiry-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.inquiry-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeStatus = btn.dataset.status || '';
      loadInquiries();
    });
  });
});
