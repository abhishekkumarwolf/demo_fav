document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.task-check').forEach(el => {
    el.addEventListener('click', () => {
      el.classList.toggle('done');
      if (el.classList.contains('done')) {
        el.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
        el.closest('.activity-item').style.opacity = '0.5';
      } else {
        el.innerHTML = '';
        el.closest('.activity-item').style.opacity = '1';
      }
    });
  });
});
