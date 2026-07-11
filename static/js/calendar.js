// ─── Helpers ─────────────────────────────────────────────────────────────────

function getCsrfToken() {
  const match = document.cookie.match(/(^| )csrftoken=([^;]+)/);
  return match ? match[2] : '';
}

function fmtDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function fmtShort(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function nightsLabel(n) {
  return n + ' ' + (n === 1 ? 'night' : 'nights');
}

// ─── Month View ──────────────────────────────────────────────────────────────

function renderMonthView(year, month, bookings) {
  const grid        = document.getElementById('calendarGrid');
  const container   = document.getElementById('calendarContainer');
  const weekCont    = document.getElementById('weekContainer');
  const emptyState  = document.getElementById('emptyState');
  const weekdays    = document.getElementById('calendarWeekdays');

  weekCont.style.display  = 'none';
  weekdays.style.display  = '';

  grid.innerHTML = '';

  const firstDOW    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalRows   = Math.ceil((firstDOW + daysInMonth) / 7);

  const today         = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  // Build day cells
  let idx = 0;
  for (let row = 0; row < totalRows; row++) {
    for (let col = 0; col < 7; col++) {
      const dayNum   = idx - firstDOW + 1;
      const inMonth  = idx >= firstDOW && idx < firstDOW + daysInMonth;
      const isToday  = inMonth && isCurrentMonth && dayNum === today.getDate();

      const cell = document.createElement('div');
      cell.className = 'day-cell' +
        (!inMonth  ? ' empty'  : '') +
        (isToday   ? ' today'  : '');
      cell.dataset.row = row;
      cell.style.gridRow = (row + 1).toString();
      cell.style.gridColumn = (col + 1).toString();

      if (inMonth) {
        const numRow = document.createElement('div');
        numRow.className = 'day-number-row';

        const num = document.createElement('span');
        num.className   = 'day-number';
        num.textContent = dayNum;
        numRow.appendChild(num);

        if (isToday) {
          const badge = document.createElement('span');
          badge.className = 'today-badge-text';
          badge.textContent = 'Today';
          numRow.appendChild(badge);
        }

        cell.appendChild(numRow);
      }

      grid.appendChild(cell);
      idx++;
    }
  }

  if (!bookings || bookings.length === 0) {
    container.style.display = 'none';
    emptyState.classList.add('visible');
    return;
  }

  container.style.display = '';
  emptyState.classList.remove('visible');

  _renderMonthBars(bookings, firstDOW, daysInMonth, totalRows, year, month, grid);
}

function _renderMonthBars(bookings, firstDOW, daysInMonth, totalRows, year, month, grid) {
  const monthStart = new Date(year, month, 1);
  const monthEnd   = new Date(year, month + 1, 0);

  const segments = [];

  for (const bk of bookings) {
    const ci = new Date(bk.checkIn  + 'T00:00:00');
    const co = new Date(bk.checkOut + 'T00:00:00');

    const visStart = ci < monthStart ? monthStart : ci;
    const visEnd   = co > monthEnd   ? monthEnd   : new Date(co.getTime() - 86400000);

    const startIdx = firstDOW + visStart.getDate() - 1;
    const endIdx   = firstDOW + visEnd.getDate()   - 1;

    const startRow = Math.floor(startIdx / 7);
    const endRow   = Math.floor(endIdx   / 7);

    for (let row = startRow; row <= endRow; row++) {
      const segStartCol = row === startRow ? (startIdx % 7) : 0;
      const segEndCol   = row === endRow   ? (endIdx   % 7) : 6;
      const isFirst = row === startRow && ci  >= monthStart;
      const isLast  = row === endRow   && co  <= new Date(year, month + 1, 1);

      segments.push({ bk, row, segStartCol, segEndCol, isFirst, isLast });
    }
  }

  // Lane assignment per row
  const rowLanes = {};
  for (const seg of segments) {
    if (!rowLanes[seg.row]) rowLanes[seg.row] = [];
    const lanes = rowLanes[seg.row];
    let placed  = false;
    for (let i = 0; i < lanes.length; i++) {
      const noOverlap = lanes[i].every(s =>
        s.segEndCol < seg.segStartCol || s.segStartCol > seg.segEndCol
      );
      if (noOverlap) { lanes[i].push(seg); seg.lane = i; placed = true; break; }
    }
    if (!placed) { lanes.push([seg]); seg.lane = lanes.length - 1; }
  }

  // Render one overlay per calendar row
  for (let row = 0; row < totalRows; row++) {
    const segsInRow = segments.filter(s => s.row === row);
    if (!segsInRow.length) continue;

    const overlay = document.createElement('div');
    overlay.className       = 'booking-row-overlay';
    overlay.style.gridColumn = '1 / 8';
    overlay.style.gridRow   = row + 1;

    // Calculate vertical offset to center the lane(s) in the 120px cell
    const maxLaneInRow = segsInRow.reduce((max, s) => Math.max(max, s.lane), 0);
    const numLanes = maxLaneInRow + 1;
    const occupiedHeight = numLanes * 42 - 6;
    const startTop = Math.max(28, Math.round((120 - occupiedHeight) / 2));

    for (const seg of segsInRow) {
      const bar = seg.isFirst
        ? _buildBar(seg.bk, seg.bk.nights)
        : _buildContinuationBar(seg.bk);

      const colW  = 100 / 7;
      const inset = colW * 0.5;
      const left  = seg.segStartCol * colW + (seg.isFirst ? inset : 0);
      const right = (6 - seg.segEndCol) * colW + (seg.isLast  ? inset : 0);

      const topPos = startTop + seg.lane * 42;
      bar.style.cssText += `position:absolute;left:${left}%;right:${right}%;top:${topPos}px;height:36px;min-width:0;`;

      bar.addEventListener('click', e => {
        e.stopPropagation();
        openBookingModal(seg.bk);
      });

      overlay.appendChild(bar);
    }

    grid.appendChild(overlay);
  }
}

function _buildBar(bk, nights) {
  const bar = document.createElement('div');
  bar.className = `booking-bar status-${bk.status}`;
  bar.title     = `${bk.guestName} · ${nightsLabel(nights)} · #${bk.id}`;

  const avatar = document.createElement('div');
  avatar.className = 'booking-bar-avatar';
  const img = document.createElement('img');
  img.src = bk.guestAvatar;
  img.alt = bk.guestName;
  avatar.appendChild(img);

  const name = document.createElement('span');
  name.className   = 'booking-bar-name';
  name.textContent = bk.guestName;

  const meta = document.createElement('span');
  meta.className   = 'booking-bar-meta';
  meta.textContent = ` · ${nightsLabel(nights)}`;

  bar.appendChild(avatar);
  bar.appendChild(name);
  bar.appendChild(meta);
  return bar;
}

function _buildContinuationBar(bk) {
  const bar = document.createElement('div');
  bar.className = `booking-bar status-${bk.status} booking-bar--continued`;
  bar.title     = `${bk.guestName} (cont.)`;

  const name = document.createElement('span');
  name.className   = 'booking-bar-name';
  name.textContent = `→ ${bk.guestName}`;
  bar.appendChild(name);
  return bar;
}

// ─── Week View ───────────────────────────────────────────────────────────────

function renderWeekView(year, month, day, bookings) {
  const container  = document.getElementById('calendarContainer');
  const weekCont   = document.getElementById('weekContainer');
  const weekGrid   = document.getElementById('weekGrid');
  const weekdays   = document.getElementById('calendarWeekdays');
  const emptyState = document.getElementById('emptyState');

  container.style.display = 'none';
  weekdays.style.display  = 'none';
  weekGrid.innerHTML      = '';

  // Find Sunday of the week containing `day`
  const anchor = new Date(year, month, day);
  const dow    = anchor.getDay();
  const sunday = new Date(anchor);
  sunday.setDate(anchor.getDate() - dow);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    days.push(d);
  }

  const today = new Date();

  // Header row
  const header = document.createElement('div');
  header.className = 'week-header';
  days.forEach(d => {
    const cell = document.createElement('div');
    cell.className = 'week-header-cell';
    const isToday  = d.toDateString() === today.toDateString();
    cell.innerHTML = `
      <span class="week-dow">${d.toLocaleDateString('en-US',{weekday:'short'})}</span>
      <span class="week-date-num${isToday?' today-num':''}">${d.getDate()}</span>
    `;
    header.appendChild(cell);
  });
  weekGrid.appendChild(header);

  // Booking rows
  if (!bookings || bookings.length === 0) {
    weekCont.style.display = 'flex';
    emptyState.classList.add('visible');
    return;
  }

  weekCont.style.display = 'flex';
  emptyState.classList.remove('visible');

  const weekStart = days[0];
  const weekEnd   = days[6];

  // Filter bookings that overlap this week
  const visible = bookings.filter(bk => {
    const ci = new Date(bk.checkIn  + 'T00:00:00');
    const co = new Date(bk.checkOut + 'T00:00:00');
    return ci <= weekEnd && co >= weekStart;
  });

  if (!visible.length) {
    weekCont.style.display = 'flex';
    emptyState.classList.add('visible');
    return;
  }

  // Assign lanes
  const laned = [];
  for (const bk of visible) {
    const ci     = new Date(bk.checkIn  + 'T00:00:00');
    const co     = new Date(bk.checkOut + 'T00:00:00');
    const startD = ci < weekStart ? weekStart : ci;
    const endD   = co > weekEnd   ? weekEnd   : new Date(co.getTime() - 1); // checkOut is exclusive

    const startCol = days.findIndex(d => d.toDateString() === startD.toDateString());
    let endCol = days.findIndex(d => d.toDateString() === endD.toDateString());
    if (endCol === -1) endCol = 6;

    let lane = 0;
    while (laned.some(x => x.lane === lane && x.endCol >= startCol && x.startCol <= endCol)) lane++;
    laned.push({ bk, startCol, endCol, lane, isFirst: ci >= weekStart, isLast: co <= new Date(weekEnd.getTime() + 86400000) });
  }

  const maxLane = laned.reduce((m, x) => Math.max(m, x.lane), 0);
  const bodyHeight = (maxLane + 1) * 42 + 16;

  const body = document.createElement('div');
  body.className = 'week-body';
  body.style.height = bodyHeight + 'px';

  // Day column lines
  days.forEach((d, i) => {
    const isToday = d.toDateString() === today.toDateString();
    const col = document.createElement('div');
    col.className = 'week-day-col' + (isToday ? ' week-today-col' : '');
    col.style.gridColumn = i + 1;
    body.appendChild(col);
  });

  // Bars
  for (const seg of laned) {
    const bar = document.createElement('div');
    bar.className = `week-booking-bar status-${seg.bk.status}`;
    bar.style.cssText = `
      left: calc(${seg.startCol} * (100% / 7) + 4px);
      right: calc(${6 - seg.endCol} * (100% / 7) + 4px);
      top: ${seg.lane * 42 + 8}px;
    `;
    bar.title = `#${seg.bk.id} · ${seg.bk.guestName} · ${nightsLabel(seg.bk.nights)}`;
    bar.innerHTML = `
      <img class="week-bar-avatar" src="${seg.bk.guestAvatar}" alt="">
      <span class="week-bar-name">${seg.bk.guestName}</span>
      <span class="week-bar-meta">#${seg.bk.id} · ${nightsLabel(seg.bk.nights)}</span>
    `;
    bar.addEventListener('click', e => { e.stopPropagation(); openBookingModal(seg.bk); });
    body.appendChild(bar);
  }

  weekGrid.appendChild(body);
}

// ─── Booking Detail Modal ────────────────────────────────────────────────────

function openBookingModal(bk) {
  const overlay  = document.getElementById('modalOverlay');
  const content  = document.getElementById('modalContent');
  const statusLabel = bk.status.replace('_', ' ');

  content.innerHTML = `
    <div class="modal-header">
      <div class="modal-guest-avatar">
        <img src="${bk.guestAvatar}" alt="${bk.guestName}">
      </div>
      <div class="modal-guest-info">
        <h2>${bk.guestName}</h2>
        <span class="modal-property-name">${bk.propertyName || ''}</span>
      </div>
      <div class="modal-status-badge status-${bk.status}">${statusLabel}</div>
    </div>
    <div class="modal-body">
      <div class="modal-detail-item">
        <span class="modal-detail-label">Reservation #</span>
        <span class="modal-detail-value">${bk.id}</span>
      </div>
      <div class="modal-detail-item">
        <span class="modal-detail-label">Check In</span>
        <span class="modal-detail-value">${fmtDate(bk.checkIn)}</span>
      </div>
      <div class="modal-detail-item">
        <span class="modal-detail-label">Check Out</span>
        <span class="modal-detail-value">${fmtDate(bk.checkOut)}</span>
      </div>
      <div class="modal-detail-item">
        <span class="modal-detail-label">Nights</span>
        <span class="modal-detail-value">${nightsLabel(bk.nights)}</span>
      </div>
      <div class="modal-detail-item">
        <span class="modal-detail-label">Total</span>
        <span class="modal-detail-value price-value">$${Number(bk.totalAmount).toLocaleString()}</span>
      </div>
      <div class="modal-detail-item">
        <span class="modal-detail-label">Source</span>
        <span class="modal-detail-value">${bk.source || '—'}</span>
      </div>
      ${bk.bookingLink ? `
      <div class="modal-detail-item">
        <span class="modal-detail-label">Booking Link</span>
        <span class="modal-detail-value"><a href="${bk.bookingLink}" target="_blank" rel="noopener">View →</a></span>
      </div>` : ''}
      ${bk.notes ? `
      <div class="modal-detail-item full-width">
        <span class="modal-detail-label">Notes</span>
        <span class="modal-detail-value" style="font-size:13px;font-weight:400">${bk.notes}</span>
      </div>` : ''}
    </div>
    <div class="modal-footer" style="display: flex; gap: 8px;">
      <button class="modal-btn modal-btn-secondary" data-modal-action="close">Close</button>
      <button class="modal-btn" id="deleteBookingBtn" style="background:#ef4444;color:white;border:none;border-radius:10px;padding:12px 20px;font-size:14px;font-weight:600;cursor:pointer;">Delete</button>
      <a href="/reservations/" class="modal-btn modal-btn-primary" style="text-decoration:none;text-align:center">Manage</a>
    </div>
  `;

  overlay.classList.add('open');

  const deleteBtn = document.getElementById('deleteBookingBtn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this reservation?')) {
        fetch(`/api/reservations/${bk.id}/delete/`, {
          method: 'DELETE',
          headers: { 'X-CSRFToken': getCsrfToken() }
        })
          .then(r => {
            if (r.ok) {
              closeModal();
              if (typeof loadData === 'function') {
                loadData();
              } else if (typeof fetchAndRender === 'function') {
                fetchAndRender();
              }
            } else {
              alert('Failed to delete reservation.');
            }
          })
          .catch(() => alert('Network error. Please try again.'));
      }
    });
  }
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  const overlay  = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => {
    if (e.target === overlay || e.target.dataset.modalAction === 'close') closeModal();
  });
});

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
