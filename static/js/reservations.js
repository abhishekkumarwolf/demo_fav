const bookingsData = [
  {id:1,propertyId:1,guestName:'John Smith',guestAvatar:'https://ui-avatars.com/api/?name=John+Smith&background=random&color=fff&size=40',checkIn:'2026-03-05',checkOut:'2026-03-10',status:'confirmed',totalPrice:1750,bookingSource:'Booking.com'},
  {id:2,propertyId:1,guestName:'Sarah Johnson',guestAvatar:'https://ui-avatars.com/api/?name=Sarah+Johnson&background=random&color=fff&size=40',checkIn:'2026-03-12',checkOut:'2026-03-18',status:'confirmed',totalPrice:2100,bookingSource:'Airbnb'},
  {id:3,propertyId:1,guestName:'Mike Brown',guestAvatar:'https://ui-avatars.com/api/?name=Mike+Brown&background=random&color=fff&size=40',checkIn:'2026-03-20',checkOut:'2026-03-25',status:'pending',totalPrice:1500,bookingSource:'Direct'},
  {id:4,propertyId:2,guestName:'Emily Davis',guestAvatar:'https://ui-avatars.com/api/?name=Emily+Davis&background=random&color=fff&size=40',checkIn:'2026-03-03',checkOut:'2026-03-08',status:'confirmed',totalPrice:1200,bookingSource:'Booking.com'},
  {id:5,propertyId:2,guestName:'Alex Wilson',guestAvatar:'https://ui-avatars.com/api/?name=Alex+Wilson&background=random&color=fff&size=40',checkIn:'2026-03-15',checkOut:'2026-03-22',status:'cancelled',totalPrice:1960,bookingSource:'Expedia'},
  {id:6,propertyId:3,guestName:'Lisa Anderson',guestAvatar:'https://ui-avatars.com/api/?name=Lisa+Anderson&background=random&color=fff&size=40',checkIn:'2026-03-01',checkOut:'2026-03-06',status:'confirmed',totalPrice:900,bookingSource:'Airbnb'},
  {id:7,propertyId:3,guestName:'James Taylor',guestAvatar:'https://ui-avatars.com/api/?name=James+Taylor&background=random&color=fff&size=40',checkIn:'2026-03-10',checkOut:'2026-03-14',status:'confirmed',totalPrice:800,bookingSource:'Booking.com'},
  {id:8,propertyId:3,guestName:'Emma Thompson',guestAvatar:'https://ui-avatars.com/api/?name=Emma+Thompson&background=random&color=fff&size=40',checkIn:'2026-03-18',checkOut:'2026-03-24',status:'pending',totalPrice:1200,bookingSource:'Direct'},
  {id:9,propertyId:4,guestName:'Robert Martinez',guestAvatar:'https://ui-avatars.com/api/?name=Robert+Martinez&background=random&color=fff&size=40',checkIn:'2026-03-04',checkOut:'2026-03-09',status:'confirmed',totalPrice:1100,bookingSource:'Booking.com'},
  {id:10,propertyId:4,guestName:'Jennifer Garcia',guestAvatar:'https://ui-avatars.com/api/?name=Jennifer+Garcia&background=random&color=fff&size=40',checkIn:'2026-03-14',checkOut:'2026-03-20',status:'checked_out',totalPrice:1500,bookingSource:'Expedia'},
  {id:11,propertyId:5,guestName:'David Miller',guestAvatar:'https://ui-avatars.com/api/?name=David+Miller&background=random&color=fff&size=40',checkIn:'2026-03-02',checkOut:'2026-03-07',status:'confirmed',totalPrice:750,bookingSource:'Airbnb'},
  {id:12,propertyId:5,guestName:'Olivia White',guestAvatar:'https://ui-avatars.com/api/?name=Olivia+White&background=random&color=fff&size=40',checkIn:'2026-03-10',checkOut:'2026-03-16',status:'confirmed',totalPrice:1050,bookingSource:'Booking.com'},
  {id:13,propertyId:6,guestName:'Daniel Lee',guestAvatar:'https://ui-avatars.com/api/?name=Daniel+Lee&background=random&color=fff&size=40',checkIn:'2026-03-08',checkOut:'2026-03-14',status:'confirmed',totalPrice:2800,bookingSource:'Booking.com'},
  {id:14,propertyId:6,guestName:'Sophia Clark',guestAvatar:'https://ui-avatars.com/api/?name=Sophia+Clark&background=random&color=fff&size=40',checkIn:'2026-03-20',checkOut:'2026-03-28',status:'confirmed',totalPrice:4400,bookingSource:'Direct'},
  {id:15,propertyId:7,guestName:'William Turner',guestAvatar:'https://ui-avatars.com/api/?name=William+Turner&background=random&color=fff&size=40',checkIn:'2026-03-06',checkOut:'2026-03-11',status:'pending',totalPrice:650,bookingSource:'Airbnb'},
  {id:16,propertyId:1,guestName:'Nina Patel',guestAvatar:'https://ui-avatars.com/api/?name=Nina+Patel&background=random&color=fff&size=40',checkIn:'2026-03-27',checkOut:'2026-04-02',status:'confirmed',totalPrice:1800,bookingSource:'Expedia'},
  {id:17,propertyId:7,guestName:'Oliver Harris',guestAvatar:'https://ui-avatars.com/api/?name=Oliver+Harris&background=random&color=fff&size=40',checkIn:'2026-03-17',checkOut:'2026-03-21',status:'confirmed',totalPrice:800,bookingSource:'Booking.com'},
];

const propertyNames = {
  1:'Beach Villa',2:'Mountain Retreat',3:'City Apartment',4:'Lake House',
  5:'Garden Studio',6:'Skyline Penthouse',7:'Cozy Cottage'
};

function getStatusBadge(status) {
  const cls = status.replace(' ', '_');
  return `<span class="status-badge ${cls}">${status.replace('_', ' ')}</span>`;
}

function renderReservations(data) {
  const tbody = document.getElementById('reservationsTable');
  if (!data.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-muted">No reservations found.</td></tr>';
    return;
  }
  tbody.innerHTML = data.map(b => `
    <tr>
      <td><strong>${b.guestName}</strong></td>
      <td>${propertyNames[b.propertyId] || 'Unknown'}</td>
      <td>${b.checkIn}</td>
      <td>${b.checkOut}</td>
      <td>${getStatusBadge(b.status)}</td>
      <td><strong>$${b.totalPrice.toLocaleString()}</strong></td>
      <td style="color:var(--color-text-secondary)">${b.bookingSource}</td>
    </tr>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderReservations(bookingsData);

  const searchInput = document.getElementById('reservationSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const filtered = bookingsData.filter(b =>
        b.guestName.toLowerCase().includes(q) ||
        (propertyNames[b.propertyId] || '').toLowerCase().includes(q)
      );
      renderReservations(filtered);
    });
  }
});
