function getCsrfToken() {
  const match = document.cookie.match(/(^| )csrftoken=([^;]+)/);
  return match ? match[2] : '';
}

function renderTasks(tasks) {
  const list = document.getElementById('taskList');
  if (!tasks.length) {
    list.innerHTML = '<div class="text-muted" style="padding:24px 20px">No tasks found.</div>';
    return;
  }
  list.innerHTML = tasks.map(t => `
    <div class="activity-item" data-task-id="${t.id}">
      <div class="task-check${t.status === 'done' ? ' done' : ''}" data-id="${t.id}">
        ${t.status === 'done' ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
      </div>
      <div class="activity-content" style="${t.status === 'done' ? 'opacity:0.5' : ''}">
        <div class="activity-title-row">
          <span class="activity-text">${t.title}</span>
          <span class="task-priority ${t.priority}">${t.priority}</span>
          <span class="task-priority" style="background:#e0f7ff;color:#2d7d8f;margin-left:4px">${t.taskType}</span>
        </div>
        <span class="activity-time">
          ${t.dueDate ? 'Due: ' + t.dueDate : 'No due date'}
          ${t.assignedTo ? ' — ' + t.assignedTo : ''}
          ${t.guestName ? ' · ' + t.guestName : ''}
        </span>
      </div>
      <div class="task-property">${t.propertyName}</div>
    </div>
  `).join('');

  list.querySelectorAll('.task-check').forEach(el => {
    el.addEventListener('click', () => toggleTask(el));
  });
}

function toggleTask(el) {
  const id = el.dataset.id;
  const isDone = el.classList.contains('done');
  const newStatus = isDone ? 'pending' : 'done';

  fetch(`/api/tasks/${id}/update/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCsrfToken() },
    body: JSON.stringify({ status: newStatus }),
  })
    .then(r => r.json())
    .then(() => loadTasks())
    .catch(() => {});
}

let activeType = '';
let activeStatus = '';

function loadTasks() {
  let url = '/api/tasks/?';
  if (activeType)   url += `type=${activeType}&`;
  if (activeStatus) url += `status=${activeStatus}&`;

  fetch(url)
    .then(r => r.json())
    .then(renderTasks)
    .catch(() => {
      document.getElementById('taskList').innerHTML =
        '<div class="text-muted" style="padding:24px">Failed to load tasks.</div>';
    });
}

document.addEventListener('DOMContentLoaded', () => {
  loadTasks();

  document.querySelectorAll('.task-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.task-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeType = btn.dataset.type || '';
      activeStatus = btn.dataset.status || '';
      loadTasks();
    });
  });
});
