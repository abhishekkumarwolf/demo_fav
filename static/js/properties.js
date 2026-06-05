function renderPropertyList(properties, selectedId, filterText) {
  const container = document.getElementById('propertyList');
  const countEl = document.getElementById('propertyCount');

  const filtered = properties.filter(p =>
    p.name.toLowerCase().includes(filterText.toLowerCase())
  );

  countEl.textContent = filtered.length;

  if (filtered.length === 0) {
    container.innerHTML = '<div class="no-properties">No properties found</div>';
    return;
  }

  container.innerHTML = '';

  filtered.forEach(property => {
    const item = document.createElement('div');
    item.className = `property-item${property.id === selectedId ? ' active' : ''}`;
    item.dataset.propertyId = property.id;

    const bookingCount = getBookingCountForProperty(property.id);

    item.innerHTML = `
      <div class="property-thumb">
        <img src="${property.image}" alt="${property.name}" loading="lazy">
      </div>
      <span class="property-name">${property.name}</span>
      ${bookingCount > 0 ? `<span class="booking-badge">${bookingCount}</span>` : ''}
    `;

    item.addEventListener('click', () => {
      if (typeof onPropertySelect === 'function') {
        onPropertySelect(property.id);
      }
    });

    container.appendChild(item);
  });
}
