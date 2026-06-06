// ─── State ───────────────────────────────────────────────────────────────────

let properties = [];

const state = {
  view: 'month',            // 'month' | 'week'
  selectedPropertyId: null,
  year:  new Date().getFullYear(),
  month: new Date().getMonth(),  // 0-based
  weekDay: new Date().getDate(),
  searchFilter: '',
  statusFilter: '',
};

// ─── Utilities ────────────────────────────────────────────────────────────────

function getPropertyById(id) {
  return properties.find(p => p.id === id);
}

function getBookingCountForProperty(id) {
  return (getPropertyById(id) || {}).bookingCount || 0;
}

// ─── Period title ─────────────────────────────────────────────────────────────

function updatePeriodTitle() {
  const el = document.getElementById('periodTitle');
  if (state.view === 'month') {
    el.textContent = new Date(state.year, state.month)
      .toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  } else {
    // Week: show "Jun 1 – Jun 7, 2026"
    const anchor = new Date(state.year, state.month, state.weekDay);
    const dow    = anchor.getDay();
    const sun    = new Date(anchor); sun.setDate(anchor.getDate() - dow);
    const sat    = new Date(sun);    sat.setDate(sun.getDate() + 6);
    const fmt    = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    el.textContent = `${fmt(sun)} – ${fmt(sat)}, ${sat.getFullYear()}`;
  }
}

// ─── Fetch & render ───────────────────────────────────────────────────────────

function fetchAndRender() {
  if (!state.selectedPropertyId) {
    _renderEmpty();
    return;
  }

  const prop = getPropertyById(state.selectedPropertyId);

  let url = `/api/properties/${state.selectedPropertyId}/reservations/?month=${state.month}&year=${state.year}`;
  if (state.statusFilter) url += `&status=${state.statusFilter}`;

  fetch(url)
    .then(r => r.json())
    .then(data => {
      const reservations = data.map(r => ({
        id:          r.id,
        propertyId:  r.propertyId,
        propertyName: prop ? prop.name : '',
        guestName:   r.guestName,
        guestAvatar: r.guestAvatar ||
          'https://ui-avatars.com/api/?name=' + encodeURIComponent(r.guestName) +
          '&background=55c1d9&color=fff&size=40&rounded=true',
        checkIn:     r.checkIn,
        checkOut:    r.checkOut,
        nights:      r.nights,
        status:      r.status,
        totalAmount: Number(r.totalAmount),
        source:      r.source || '',
        bookingLink: r.bookingLink || '',
        notes:       r.notes || '',
      }));

      if (state.view === 'month') {
        renderMonthView(state.year, state.month, reservations);
      } else {
        renderWeekView(state.year, state.month, state.weekDay, reservations);
      }
    })
    .catch(() => _renderEmpty());
}

function _renderEmpty() {
  if (state.view === 'month') {
    renderMonthView(state.year, state.month, []);
  } else {
    renderWeekView(state.year, state.month, state.weekDay, []);
  }
}

// ─── Property sidebar ─────────────────────────────────────────────────────────

function renderPropertyList(filter) {
  const container = document.getElementById('propertyList');
  const countEl   = document.getElementById('propertyCount');

  const filtered = properties.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );
  countEl.textContent = filtered.length;

  if (!filtered.length) {
    container.innerHTML = '<div class="no-properties">No properties found</div>';
    return;
  }

  container.innerHTML = '';
  filtered.forEach(p => {
    const item = document.createElement('div');
    item.className   = `property-item${p.id === state.selectedPropertyId ? ' active' : ''}`;
    item.dataset.id  = p.id;

    const count = p.bookingCount || 0;
    item.innerHTML = `
      <div class="property-thumb"><img src="${p.image}" alt="${p.name}" loading="lazy"></div>
      <span class="property-name">${p.name}</span>
      <div class="property-item-right" style="margin-left: auto; display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
        ${count > 0 ? `<span class="booking-badge">${count}</span>` : ''}
        <button class="property-menu-btn" style="background: none; border: none; color: var(--color-text-muted); cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center;" onclick="event.stopPropagation()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1.5"></circle><circle cx="12" cy="5" r="1.5"></circle><circle cx="12" cy="19" r="1.5"></circle></svg>
        </button>
      </div>
    `;
    item.addEventListener('click', () => onPropertySelect(p.id));
    container.appendChild(item);
  });
}

function onPropertySelect(id) {
  state.selectedPropertyId = id;
  renderPropertyList(state.searchFilter);
  fetchAndRender();
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function navigate(delta) {
  if (state.view === 'month') {
    state.month += delta;
    if (state.month > 11) { state.month = 0;  state.year++; }
    if (state.month < 0)  { state.month = 11; state.year--; }
    state.weekDay = 1;
  } else {
    // Move by 1 week
    const anchor = new Date(state.year, state.month, state.weekDay);
    anchor.setDate(anchor.getDate() + delta * 7);
    state.year    = anchor.getFullYear();
    state.month   = anchor.getMonth();
    state.weekDay = anchor.getDate();
  }
  updatePeriodTitle();
  fetchAndRender();
}

// ─── View toggle ──────────────────────────────────────────────────────────────

function setView(v) {
  state.view = v;
  document.querySelectorAll('.view-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.view === v);
  });
  if (v === 'week') {
    // default to current week day within the current month
    state.weekDay = new Date().getMonth() === state.month &&
                    new Date().getFullYear() === state.year
      ? new Date().getDate()
      : 1;
  }
  updatePeriodTitle();
  fetchAndRender();
}

// ─── Bootstrap ────────────────────────────────────────────────────────────────

function loadData() {
  fetch('/api/properties/')
    .then(r => r.json())
    .then(props => {
      properties = props.map(p => ({
        id:           p.id,
        name:         p.name,
        image:        p.image ||
          'https://ui-avatars.com/api/?name=' + encodeURIComponent(p.name) +
          '&background=55c1d9&color=fff&size=80&rounded=true&bold=true',
        bookingCount: p.bookingCount || 0,
        city:  p.city,
        state: p.state,
      }));

      updatePeriodTitle();

      // Honour ?property=<id> query param
      const params     = new URLSearchParams(window.location.search);
      const preselect  = params.get('property');
      const match      = preselect && properties.find(p => p.id === parseInt(preselect));
      state.selectedPropertyId = match ? match.id : (properties[0] ? properties[0].id : null);

      renderPropertyList('');
      fetchAndRender();
    })
    .catch(() => {
      document.getElementById('periodTitle').textContent = 'Failed to load';
    });
}

document.addEventListener('DOMContentLoaded', () => {
  loadData();

  document.getElementById('prevPeriod').addEventListener('click', () => navigate(-1));
  document.getElementById('nextPeriod').addEventListener('click', () => navigate(+1));

  document.getElementById('propertySearch').addEventListener('input', e => {
    state.searchFilter = e.target.value;
    renderPropertyList(state.searchFilter);
  });

  document.getElementById('statusFilter').addEventListener('change', e => {
    state.statusFilter = e.target.value;
    fetchAndRender();
  });

  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => setView(btn.dataset.view));
  });
});
