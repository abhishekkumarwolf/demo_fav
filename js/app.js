const properties = [
  {
    id: 1,
    name: 'Beach Villa',
    image: 'https://ui-avatars.com/api/?name=Beach+Villa&background=55c1d9&color=fff&size=80&rounded=true&bold=true'
  },
  {
    id: 2,
    name: 'Mountain Retreat',
    image: 'https://ui-avatars.com/api/?name=Mountain+Retreat&background=2ecc71&color=fff&size=80&rounded=true&bold=true'
  },
  {
    id: 3,
    name: 'City Apartment',
    image: 'https://ui-avatars.com/api/?name=City+Apartment&background=3498db&color=fff&size=80&rounded=true&bold=true'
  },
  {
    id: 4,
    name: 'Lake House',
    image: 'https://ui-avatars.com/api/?name=Lake+House&background=9b59b6&color=fff&size=80&rounded=true&bold=true'
  },
  {
    id: 5,
    name: 'Garden Studio',
    image: 'https://ui-avatars.com/api/?name=Garden+Studio&background=e67e22&color=fff&size=80&rounded=true&bold=true'
  },
  {
    id: 6,
    name: 'Skyline Penthouse',
    image: 'https://ui-avatars.com/api/?name=Skyline+Place&background=e74c3c&color=fff&size=80&rounded=true&bold=true'
  },
  {
    id: 7,
    name: 'Cozy Cottage',
    image: 'https://ui-avatars.com/api/?name=Cozy+Cottage&background=1abc9c&color=fff&size=80&rounded=true&bold=true'
  }
];

const bookings = [
  {
    id: 1,
    propertyId: 1,
    guestName: 'John Smith',
    guestAvatar: 'https://ui-avatars.com/api/?name=John+Smith&background=random&color=fff&size=40&rounded=true',
    checkIn: '2026-03-05',
    checkOut: '2026-03-10',
    status: 'confirmed',
    totalPrice: 1750,
    bookingSource: 'Booking.com',
    bookingLink: 'https://booking.com/booking/1'
  },
  {
    id: 2,
    propertyId: 1,
    guestName: 'Sarah Johnson',
    guestAvatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=random&color=fff&size=40&rounded=true',
    checkIn: '2026-03-12',
    checkOut: '2026-03-18',
    status: 'confirmed',
    totalPrice: 2100,
    bookingSource: 'Airbnb',
    bookingLink: 'https://airbnb.com/h/2'
  },
  {
    id: 3,
    propertyId: 1,
    guestName: 'Mike Brown',
    guestAvatar: 'https://ui-avatars.com/api/?name=Mike+Brown&background=random&color=fff&size=40&rounded=true',
    checkIn: '2026-03-20',
    checkOut: '2026-03-25',
    status: 'pending',
    totalPrice: 1500,
    bookingSource: 'Direct',
    bookingLink: 'https://favhost.com/bookings/3'
  },
  {
    id: 4,
    propertyId: 2,
    guestName: 'Emily Davis',
    guestAvatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=random&color=fff&size=40&rounded=true',
    checkIn: '2026-03-03',
    checkOut: '2026-03-08',
    status: 'confirmed',
    totalPrice: 1200,
    bookingSource: 'Booking.com',
    bookingLink: 'https://booking.com/booking/4'
  },
  {
    id: 5,
    propertyId: 2,
    guestName: 'Alex Wilson',
    guestAvatar: 'https://ui-avatars.com/api/?name=Alex+Wilson&background=random&color=fff&size=40&rounded=true',
    checkIn: '2026-03-15',
    checkOut: '2026-03-22',
    status: 'cancelled',
    totalPrice: 1960,
    bookingSource: 'Expedia',
    bookingLink: 'https://expedia.com/bookings/5'
  },
  {
    id: 6,
    propertyId: 3,
    guestName: 'Lisa Anderson',
    guestAvatar: 'https://ui-avatars.com/api/?name=Lisa+Anderson&background=random&color=fff&size=40&rounded=true',
    checkIn: '2026-03-01',
    checkOut: '2026-03-06',
    status: 'confirmed',
    totalPrice: 900,
    bookingSource: 'Airbnb',
    bookingLink: 'https://airbnb.com/h/6'
  },
  {
    id: 7,
    propertyId: 3,
    guestName: 'James Taylor',
    guestAvatar: 'https://ui-avatars.com/api/?name=James+Taylor&background=random&color=fff&size=40&rounded=true',
    checkIn: '2026-03-10',
    checkOut: '2026-03-14',
    status: 'confirmed',
    totalPrice: 800,
    bookingSource: 'Booking.com',
    bookingLink: 'https://booking.com/booking/7'
  },
  {
    id: 8,
    propertyId: 3,
    guestName: 'Emma Thompson',
    guestAvatar: 'https://ui-avatars.com/api/?name=Emma+Thompson&background=random&color=fff&size=40&rounded=true',
    checkIn: '2026-03-18',
    checkOut: '2026-03-24',
    status: 'pending',
    totalPrice: 1200,
    bookingSource: 'Direct',
    bookingLink: 'https://favhost.com/bookings/8'
  },
  {
    id: 9,
    propertyId: 4,
    guestName: 'Robert Martinez',
    guestAvatar: 'https://ui-avatars.com/api/?name=Robert+Martinez&background=random&color=fff&size=40&rounded=true',
    checkIn: '2026-03-04',
    checkOut: '2026-03-09',
    status: 'confirmed',
    totalPrice: 1100,
    bookingSource: 'Booking.com',
    bookingLink: 'https://booking.com/booking/9'
  },
  {
    id: 10,
    propertyId: 4,
    guestName: 'Jennifer Garcia',
    guestAvatar: 'https://ui-avatars.com/api/?name=Jennifer+Garcia&background=random&color=fff&size=40&rounded=true',
    checkIn: '2026-03-14',
    checkOut: '2026-03-20',
    status: 'checked_out',
    totalPrice: 1500,
    bookingSource: 'Expedia',
    bookingLink: 'https://expedia.com/bookings/10'
  },
  {
    id: 11,
    propertyId: 5,
    guestName: 'David Miller',
    guestAvatar: 'https://ui-avatars.com/api/?name=David+Miller&background=random&color=fff&size=40&rounded=true',
    checkIn: '2026-03-02',
    checkOut: '2026-03-07',
    status: 'confirmed',
    totalPrice: 750,
    bookingSource: 'Airbnb',
    bookingLink: 'https://airbnb.com/h/11'
  },
  {
    id: 12,
    propertyId: 5,
    guestName: 'Olivia White',
    guestAvatar: 'https://ui-avatars.com/api/?name=Olivia+White&background=random&color=fff&size=40&rounded=true',
    checkIn: '2026-03-10',
    checkOut: '2026-03-16',
    status: 'confirmed',
    totalPrice: 1050,
    bookingSource: 'Booking.com',
    bookingLink: 'https://booking.com/booking/12'
  },
  {
    id: 13,
    propertyId: 6,
    guestName: 'Daniel Lee',
    guestAvatar: 'https://ui-avatars.com/api/?name=Daniel+Lee&background=random&color=fff&size=40&rounded=true',
    checkIn: '2026-03-08',
    checkOut: '2026-03-14',
    status: 'confirmed',
    totalPrice: 2800,
    bookingSource: 'Booking.com',
    bookingLink: 'https://booking.com/booking/13'
  },
  {
    id: 14,
    propertyId: 6,
    guestName: 'Sophia Clark',
    guestAvatar: 'https://ui-avatars.com/api/?name=Sophia+Clark&background=random&color=fff&size=40&rounded=true',
    checkIn: '2026-03-20',
    checkOut: '2026-03-28',
    status: 'confirmed',
    totalPrice: 4400,
    bookingSource: 'Direct',
    bookingLink: 'https://favhost.com/bookings/14'
  },
  {
    id: 15,
    propertyId: 7,
    guestName: 'William Turner',
    guestAvatar: 'https://ui-avatars.com/api/?name=William+Turner&background=random&color=fff&size=40&rounded=true',
    checkIn: '2026-03-06',
    checkOut: '2026-03-11',
    status: 'pending',
    totalPrice: 650,
    bookingSource: 'Airbnb',
    bookingLink: 'https://airbnb.com/h/15'
  },
  {
    id: 16,
    propertyId: 1,
    guestName: 'Nina Patel',
    guestAvatar: 'https://ui-avatars.com/api/?name=Nina+Patel&background=random&color=fff&size=40&rounded=true',
    checkIn: '2026-03-27',
    checkOut: '2026-04-02',
    status: 'confirmed',
    totalPrice: 1800,
    bookingSource: 'Expedia',
    bookingLink: 'https://expedia.com/bookings/16'
  },
  {
    id: 17,
    propertyId: 7,
    guestName: 'Oliver Harris',
    guestAvatar: 'https://ui-avatars.com/api/?name=Oliver+Harris&background=random&color=fff&size=40&rounded=true',
    checkIn: '2026-03-17',
    checkOut: '2026-03-21',
    status: 'confirmed',
    totalPrice: 800,
    bookingSource: 'Booking.com',
    bookingLink: 'https://booking.com/booking/17'
  }
];

const state = {
  selectedPropertyId: null,
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear(),
  searchFilter: ''
};

function getBookingsForProperty(propertyId) {
  return bookings.filter(b => b.propertyId === propertyId);
}

function getBookingCountForProperty(propertyId) {
  return bookings.filter(b => b.propertyId === propertyId).length;
}

function getPropertyById(id) {
  return properties.find(p => p.id === id);
}

function onPropertySelect(propertyId) {
  state.selectedPropertyId = propertyId;
  renderPropertyList(properties, propertyId, state.searchFilter);
  refreshCalendar();
}

function refreshCalendar() {
  const propertyBookings = state.selectedPropertyId
    ? getBookingsForProperty(state.selectedPropertyId)
    : [];

  renderCalendar(state.currentYear, state.currentMonth, propertyBookings);
}

function updateMonthTitle() {
  const date = new Date(state.currentYear, state.currentMonth);
  const title = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  document.getElementById('monthTitle').textContent = title;
}

function loadMonth(delta) {
  state.currentMonth += delta;
  if (state.currentMonth > 11) {
    state.currentMonth = 0;
    state.currentYear++;
  } else if (state.currentMonth < 0) {
    state.currentMonth = 11;
    state.currentYear--;
  }
  updateMonthTitle();
  refreshCalendar();
}

document.addEventListener('DOMContentLoaded', () => {
  state.currentMonth = 2;
  state.currentYear = 2026;

  updateMonthTitle();

  state.selectedPropertyId = properties[0].id;
  renderPropertyList(properties, state.selectedPropertyId, '');
  refreshCalendar();

  document.getElementById('prevMonth').addEventListener('click', () => loadMonth(-1));
  document.getElementById('nextMonth').addEventListener('click', () => loadMonth(1));

  document.getElementById('propertySearch').addEventListener('input', (e) => {
    state.searchFilter = e.target.value;
    renderPropertyList(properties, state.selectedPropertyId, state.searchFilter);
  });
});
