function renderCalendar(year, month, bookings) {
  const grid = document.getElementById('calendarGrid');
  const emptyState = document.getElementById('emptyState');
  const calendarContainer = document.querySelector('.calendar-container');

  grid.innerHTML = '';

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = firstDayOfWeek + daysInMonth;
  const totalRows = Math.ceil(totalCells / 7);

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const todayDate = today.getDate();

  let cellIndex = 0;

  for (let row = 1; row <= totalRows; row++) {
    for (let col = 1; col <= 7; col++) {
      const dayNum = cellIndex - firstDayOfWeek + 1;
      const isInMonth = cellIndex >= firstDayOfWeek && cellIndex < firstDayOfWeek + daysInMonth;

      const cell = document.createElement('div');
      cell.className = 'day-cell';
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.dataset.day = isInMonth ? dayNum : '';

      if (!isInMonth) {
        cell.classList.add('empty');
      } else {
        if (isCurrentMonth && dayNum === todayDate) {
          cell.classList.add('today');
        }
        const numEl = document.createElement('span');
        numEl.className = 'day-number';
        numEl.textContent = dayNum;
        cell.appendChild(numEl);
      }

      cell.style.gridColumn = col;
      cell.style.gridRow = row;
      grid.appendChild(cell);

      cellIndex++;
    }
  }

  if (bookings.length === 0) {
    emptyState.classList.add('visible');
    calendarContainer.style.display = 'none';
    return;
  }

  emptyState.classList.remove('visible');
  calendarContainer.style.display = 'flex';
  calendarContainer.style.flexDirection = 'column';

  renderBookingBars(bookings, firstDayOfWeek, daysInMonth, totalRows, year, month, grid);
}

function renderBookingBars(bookings, firstDayOfWeek, daysInMonth, totalRows, year, month, grid) {
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);

  const segments = [];

  for (const booking of bookings) {
    const checkIn = new Date(booking.checkIn + 'T00:00:00');
    const checkOut = new Date(booking.checkOut + 'T00:00:00');

    const visibleStart = checkIn < monthStart ? new Date(monthStart) : new Date(checkIn);
    const visibleEnd = checkOut > monthEnd ? new Date(monthEnd) : new Date(checkOut);

    const startDay = visibleStart.getDate();
    const endDay = visibleEnd.getDate();

    const startDayIndex = firstDayOfWeek + startDay - 1;
    const endDayIndex = firstDayOfWeek + endDay - 1;

    const startRow = Math.floor(startDayIndex / 7) + 1;
    const startCol = (startDayIndex % 7) + 1;
    const endRow = Math.floor(endDayIndex / 7) + 1;
    const endCol = (endDayIndex % 7) + 1;

    for (let row = startRow; row <= endRow; row++) {
      const segStartCol = row === startRow ? startCol : 1;
      const segEndCol = row === endRow ? endCol + 1 : 8;

      segments.push({
        booking,
        row,
        startCol: segStartCol,
        endCol: segEndCol,
        endColExclusive: segEndCol
      });
    }
  }

  const rowsWithSegments = {};
  for (const seg of segments) {
    if (!rowsWithSegments[seg.row]) {
      rowsWithSegments[seg.row] = [];
    }
    rowsWithSegments[seg.row].push(seg);
  }

  for (const row in rowsWithSegments) {
    const rowSegments = rowsWithSegments[row];
    rowSegments.sort((a, b) => a.startCol - b.startCol);

    const lanes = [];
    for (const seg of rowSegments) {
      let placed = false;
      for (let i = 0; i < lanes.length; i++) {
        const lastSeg = lanes[i][lanes[i].length - 1];
        if (seg.startCol >= lastSeg.endColExclusive) {
          lanes[i].push(seg);
          seg.lane = i;
          placed = true;
          break;
        }
      }
      if (!placed) {
        lanes.push([seg]);
        seg.lane = lanes.length - 1;
      }
    }
  }

  for (const seg of segments) {
    const bar = buildBarElement(seg.booking);
    bar.style.gridColumn = `${seg.startCol} / ${seg.endColExclusive}`;
    bar.style.gridRow = `${seg.row}`;

    const laneOffset = 28 + (seg.lane || 0) * 30;
    bar.style.marginTop = `${laneOffset}px`;

    bar.addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof openBookingModal === 'function') {
        openBookingModal(seg.booking);
      }
    });

    grid.appendChild(bar);
  }
}

function buildBarElement(booking) {
  const bar = document.createElement('div');
  bar.className = `booking-bar status-${booking.status}`;

  const avatarWrapper = document.createElement('div');
  avatarWrapper.className = 'booking-bar-avatar';

  const avatarImg = document.createElement('img');
  avatarImg.src = booking.guestAvatar;
  avatarImg.alt = booking.guestName;

  avatarWrapper.appendChild(avatarImg);

  const nameSpan = document.createElement('span');
  nameSpan.className = 'booking-bar-name';
  nameSpan.textContent = booking.guestName;

  bar.appendChild(avatarWrapper);
  bar.appendChild(nameSpan);

  return bar;
}
