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

const propertiesData = [
  {id:1,name:'Beach Villa',image:'https://ui-avatars.com/api/?name=Beach+Villa&background=55c1d9&color=fff&size=80&rounded=true&bold=true',city:'Miami',country:'USA'},
  {id:2,name:'Mountain Retreat',image:'https://ui-avatars.com/api/?name=Mountain+Retreat&background=2ecc71&color=fff&size=80&rounded=true&bold=true',city:'Aspen',country:'USA'},
  {id:3,name:'City Apartment',image:'https://ui-avatars.com/api/?name=City+Apartment&background=3498db&color=fff&size=80&rounded=true&bold=true',city:'New York',country:'USA'},
  {id:4,name:'Lake House',image:'https://ui-avatars.com/api/?name=Lake+House&background=9b59b6&color=fff&size=80&rounded=true&bold=true',city:'Lake Tahoe',country:'USA'},
  {id:5,name:'Garden Studio',image:'https://ui-avatars.com/api/?name=Garden+Studio&background=e67e22&color=fff&size=80&rounded=true&bold=true',city:'Austin',country:'USA'},
  {id:6,name:'Skyline Penthouse',image:'https://ui-avatars.com/api/?name=Skyline+Place&background=e74c3c&color=fff&size=80&rounded=true&bold=true',city:'Chicago',country:'USA'},
  {id:7,name:'Cozy Cottage',image:'https://ui-avatars.com/api/?name=Cozy+Cottage&background=1abc9c&color=fff&size=80&rounded=true&bold=true',city:'Nashville',country:'USA'},
];

const propertyNames = {};
propertiesData.forEach(p => { propertyNames[p.id] = p.name; });

function getPropertyName(id) { return propertyNames[id] || 'Unknown'; }

function getStatusBadge(status) {
  const cls = status.replace(' ', '_');
  return `<span class="status-badge ${cls}">${status.replace('_', ' ')}</span>`;
}

function renderRecentBookings() {
  const tbody = document.getElementById('recentBookings');
  const sorted = [...bookingsData].sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn));
  const recent = sorted.slice(0, 5);

  tbody.innerHTML = recent.map(b => `
    <tr>
      <td><strong>${b.guestName}</strong></td>
      <td>${getPropertyName(b.propertyId)}</td>
      <td>${b.checkIn}</td>
      <td>${b.checkOut}</td>
      <td>${getStatusBadge(b.status)}</td>
      <td><strong>$${b.totalPrice.toLocaleString()}</strong></td>
    </tr>
  `).join('');
}

const state = { currentMonth: 2, currentYear: 2026 };

function updateMonthTitle() {
  const date = new Date(state.currentYear, state.currentMonth);
  const title = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  document.getElementById('monthTitle').textContent = title;
}

function loadMonth(delta) {
  state.currentMonth += delta;
  if (state.currentMonth > 11) { state.currentMonth = 0; state.currentYear++; }
  else if (state.currentMonth < 0) { state.currentMonth = 11; state.currentYear--; }
  updateMonthTitle();
}

document.addEventListener('DOMContentLoaded', () => {
  updateMonthTitle();
  renderRecentBookings();
  document.getElementById('prevMonth').addEventListener('click', () => loadMonth(-1));
  document.getElementById('nextMonth').addEventListener('click', () => loadMonth(1));
});
