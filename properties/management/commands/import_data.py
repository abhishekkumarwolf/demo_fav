import json
import shutil
from pathlib import Path
from datetime import datetime, date
from decimal import Decimal
from django.conf import settings
from django.core.management.base import BaseCommand
from properties.models import Property, Guest, Booking


PROPERTIES_DATA = [
    {
        'id': 1,
        'name': 'Beach Villa',
        'image': 'https://ui-avatars.com/api/?name=Beach+Villa&background=55c1d9&color=fff&size=80&rounded=true&bold=true'
    },
    {
        'id': 2,
        'name': 'Mountain Retreat',
        'image': 'https://ui-avatars.com/api/?name=Mountain+Retreat&background=2ecc71&color=fff&size=80&rounded=true&bold=true'
    },
    {
        'id': 3,
        'name': 'City Apartment',
        'image': 'https://ui-avatars.com/api/?name=City+Apartment&background=3498db&color=fff&size=80&rounded=true&bold=true'
    },
    {
        'id': 4,
        'name': 'Lake House',
        'image': 'https://ui-avatars.com/api/?name=Lake+House&background=9b59b6&color=fff&size=80&rounded=true&bold=true'
    },
    {
        'id': 5,
        'name': 'Garden Studio',
        'image': 'https://ui-avatars.com/api/?name=Garden+Studio&background=e67e22&color=fff&size=80&rounded=true&bold=true'
    },
    {
        'id': 6,
        'name': 'Skyline Penthouse',
        'image': 'https://ui-avatars.com/api/?name=Skyline+Place&background=e74c3c&color=fff&size=80&rounded=true&bold=true'
    },
    {
        'id': 7,
        'name': 'Cozy Cottage',
        'image': 'https://ui-avatars.com/api/?name=Cozy+Cottage&background=1abc9c&color=fff&size=80&rounded=true&bold=true'
    },
]

BOOKINGS_DATA = [
    {'id': 1, 'propertyId': 1, 'guestName': 'John Smith', 'guestAvatar': 'https://ui-avatars.com/api/?name=John+Smith&background=random&color=fff&size=40&rounded=true', 'checkIn': '2026-03-05', 'checkOut': '2026-03-10', 'status': 'confirmed', 'totalPrice': 1750, 'bookingSource': 'Booking.com', 'bookingLink': 'https://booking.com/booking/1'},
    {'id': 2, 'propertyId': 1, 'guestName': 'Sarah Johnson', 'guestAvatar': 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=random&color=fff&size=40&rounded=true', 'checkIn': '2026-03-12', 'checkOut': '2026-03-18', 'status': 'confirmed', 'totalPrice': 2100, 'bookingSource': 'Airbnb', 'bookingLink': 'https://airbnb.com/h/2'},
    {'id': 3, 'propertyId': 1, 'guestName': 'Mike Brown', 'guestAvatar': 'https://ui-avatars.com/api/?name=Mike+Brown&background=random&color=fff&size=40&rounded=true', 'checkIn': '2026-03-20', 'checkOut': '2026-03-25', 'status': 'pending', 'totalPrice': 1500, 'bookingSource': 'Direct', 'bookingLink': 'https://favhost.com/bookings/3'},
    {'id': 4, 'propertyId': 2, 'guestName': 'Emily Davis', 'guestAvatar': 'https://ui-avatars.com/api/?name=Emily+Davis&background=random&color=fff&size=40&rounded=true', 'checkIn': '2026-03-03', 'checkOut': '2026-03-08', 'status': 'confirmed', 'totalPrice': 1200, 'bookingSource': 'Booking.com', 'bookingLink': 'https://booking.com/booking/4'},
    {'id': 5, 'propertyId': 2, 'guestName': 'Alex Wilson', 'guestAvatar': 'https://ui-avatars.com/api/?name=Alex+Wilson&background=random&color=fff&size=40&rounded=true', 'checkIn': '2026-03-15', 'checkOut': '2026-03-22', 'status': 'cancelled', 'totalPrice': 1960, 'bookingSource': 'Expedia', 'bookingLink': 'https://expedia.com/bookings/5'},
    {'id': 6, 'propertyId': 3, 'guestName': 'Lisa Anderson', 'guestAvatar': 'https://ui-avatars.com/api/?name=Lisa+Anderson&background=random&color=fff&size=40&rounded=true', 'checkIn': '2026-03-01', 'checkOut': '2026-03-06', 'status': 'confirmed', 'totalPrice': 900, 'bookingSource': 'Airbnb', 'bookingLink': 'https://airbnb.com/h/6'},
    {'id': 7, 'propertyId': 3, 'guestName': 'James Taylor', 'guestAvatar': 'https://ui-avatars.com/api/?name=James+Taylor&background=random&color=fff&size=40&rounded=true', 'checkIn': '2026-03-10', 'checkOut': '2026-03-14', 'status': 'confirmed', 'totalPrice': 800, 'bookingSource': 'Booking.com', 'bookingLink': 'https://booking.com/booking/7'},
    {'id': 8, 'propertyId': 3, 'guestName': 'Emma Thompson', 'guestAvatar': 'https://ui-avatars.com/api/?name=Emma+Thompson&background=random&color=fff&size=40&rounded=true', 'checkIn': '2026-03-18', 'checkOut': '2026-03-24', 'status': 'pending', 'totalPrice': 1200, 'bookingSource': 'Direct', 'bookingLink': 'https://favhost.com/bookings/8'},
    {'id': 9, 'propertyId': 4, 'guestName': 'Robert Martinez', 'guestAvatar': 'https://ui-avatars.com/api/?name=Robert+Martinez&background=random&color=fff&size=40&rounded=true', 'checkIn': '2026-03-04', 'checkOut': '2026-03-09', 'status': 'confirmed', 'totalPrice': 1100, 'bookingSource': 'Booking.com', 'bookingLink': 'https://booking.com/booking/9'},
    {'id': 10, 'propertyId': 4, 'guestName': 'Jennifer Garcia', 'guestAvatar': 'https://ui-avatars.com/api/?name=Jennifer+Garcia&background=random&color=fff&size=40&rounded=true', 'checkIn': '2026-03-14', 'checkOut': '2026-03-20', 'status': 'checked_out', 'totalPrice': 1500, 'bookingSource': 'Expedia', 'bookingLink': 'https://expedia.com/bookings/10'},
    {'id': 11, 'propertyId': 5, 'guestName': 'David Miller', 'guestAvatar': 'https://ui-avatars.com/api/?name=David+Miller&background=random&color=fff&size=40&rounded=true', 'checkIn': '2026-03-02', 'checkOut': '2026-03-07', 'status': 'confirmed', 'totalPrice': 750, 'bookingSource': 'Airbnb', 'bookingLink': 'https://airbnb.com/h/11'},
    {'id': 12, 'propertyId': 5, 'guestName': 'Olivia White', 'guestAvatar': 'https://ui-avatars.com/api/?name=Olivia+White&background=random&color=fff&size=40&rounded=true', 'checkIn': '2026-03-10', 'checkOut': '2026-03-16', 'status': 'confirmed', 'totalPrice': 1050, 'bookingSource': 'Booking.com', 'bookingLink': 'https://booking.com/booking/12'},
    {'id': 13, 'propertyId': 6, 'guestName': 'Daniel Lee', 'guestAvatar': 'https://ui-avatars.com/api/?name=Daniel+Lee&background=random&color=fff&size=40&rounded=true', 'checkIn': '2026-03-08', 'checkOut': '2026-03-14', 'status': 'confirmed', 'totalPrice': 2800, 'bookingSource': 'Booking.com', 'bookingLink': 'https://booking.com/booking/13'},
    {'id': 14, 'propertyId': 6, 'guestName': 'Sophia Clark', 'guestAvatar': 'https://ui-avatars.com/api/?name=Sophia+Clark&background=random&color=fff&size=40&rounded=true', 'checkIn': '2026-03-20', 'checkOut': '2026-03-28', 'status': 'confirmed', 'totalPrice': 4400, 'bookingSource': 'Direct', 'bookingLink': 'https://favhost.com/bookings/14'},
    {'id': 15, 'propertyId': 7, 'guestName': 'William Turner', 'guestAvatar': 'https://ui-avatars.com/api/?name=William+Turner&background=random&color=fff&size=40&rounded=true', 'checkIn': '2026-03-06', 'checkOut': '2026-03-11', 'status': 'pending', 'totalPrice': 650, 'bookingSource': 'Airbnb', 'bookingLink': 'https://airbnb.com/h/15'},
    {'id': 16, 'propertyId': 1, 'guestName': 'Nina Patel', 'guestAvatar': 'https://ui-avatars.com/api/?name=Nina+Patel&background=random&color=fff&size=40&rounded=true', 'checkIn': '2026-03-27', 'checkOut': '2026-04-02', 'status': 'confirmed', 'totalPrice': 1800, 'bookingSource': 'Expedia', 'bookingLink': 'https://expedia.com/bookings/16'},
    {'id': 17, 'propertyId': 7, 'guestName': 'Oliver Harris', 'guestAvatar': 'https://ui-avatars.com/api/?name=Oliver+Harris&background=random&color=fff&size=40&rounded=true', 'checkIn': '2026-03-17', 'checkOut': '2026-03-21', 'status': 'confirmed', 'totalPrice': 800, 'bookingSource': 'Booking.com', 'bookingLink': 'https://booking.com/booking/17'},
]


GUEST_AVATAR_MAP = {
    'John Smith': 'm1.jpg',
    'Sarah Johnson': 'w1.jpg',
    'Mike Brown': 'm2.jpg',
    'Emily Davis': 'w2.jpg',
    'Alex Wilson': 'm3.jpg',
    'Lisa Anderson': 'w3.jpg',
    'James Taylor': 'm4.jpg',
    'Emma Thompson': 'w4.jpg',
    'Robert Martinez': 'm5.jpg',
    'Jennifer Garcia': 'w5.jpg',
    'David Miller': 'm6.jpg',
    'Olivia White': 'w6.jpg',
    'Daniel Lee': 'm7.jpg',
    'Sophia Clark': 'w7.jpg',
    'William Turner': 'm8.jpg',
    'Nina Patel': 'w8.jpg',
    'Oliver Harris': 'm9.jpg',
}


def copy_favpics_to_media():
    src = Path(settings.BASE_DIR) / 'favpics'
    dst = Path(settings.MEDIA_ROOT) / 'guest_avatars'
    dst.mkdir(parents=True, exist_ok=True)
    for f in src.glob('*.jpg'):
        shutil.copy2(f, dst / f.name)


def compute_price_per_night(total_price, check_in, check_out):
    nights = (check_out - check_in).days
    if nights <= 0:
        return Decimal(str(total_price))
    return Decimal(str(total_price)) / Decimal(str(nights))


class Command(BaseCommand):
    help = 'Import hardcoded mock data from app.js into the database'

    def handle(self, *args, **options):
        self.stdout.write('Importing properties...')
        imported_properties = {}
        for p in PROPERTIES_DATA:
            prop, created = Property.objects.get_or_create(
                id=p['id'],
                defaults={
                    'name': p['name'],
                    'property_image': p['image'],
                }
            )
            if not created:
                prop.name = p['name']
                prop.property_image = p['image']
                prop.save()
            imported_properties[p['id']] = prop
            self.stdout.write(f'  {"Created" if created else "Updated"}: {prop.name}')

        self.stdout.write('Importing guests...')
        copy_favpics_to_media()
        guest_cache = {}
        for b in BOOKINGS_DATA:
            name_parts = b['guestName'].strip().split(' ', 1)
            first_name = name_parts[0]
            last_name = name_parts[1] if len(name_parts) > 1 else ''

            key = b['guestName']
            avatar_file = GUEST_AVATAR_MAP.get(key)
            profile_path = f'guest_avatars/{avatar_file}' if avatar_file else ''

            if key not in guest_cache:
                guest, created = Guest.objects.get_or_create(
                    first_name=first_name,
                    last_name=last_name,
                    defaults={
                        'email': f'{first_name.lower()}.{last_name.lower().replace(" ", "")}@example.com',
                    }
                )
                if profile_path:
                    guest.profile_image.name = profile_path
                    guest.save(update_fields=['profile_image'])
                guest_cache[key] = guest
                self.stdout.write(f'  {"Created" if created else "Updated"}: {guest}')

        self.stdout.write('Importing bookings...')
        for b in BOOKINGS_DATA:
            check_in = datetime.strptime(b['checkIn'], '%Y-%m-%d').date()
            check_out = datetime.strptime(b['checkOut'], '%Y-%m-%d').date()
            price_per_night = compute_price_per_night(b['totalPrice'], check_in, check_out)

            guest = guest_cache[b['guestName']]
            prop = imported_properties[b['propertyId']]

            booking, created = Booking.objects.update_or_create(
                id=b['id'],
                defaults={
                    'property': prop,
                    'guest': guest,
                    'check_in': check_in,
                    'check_out': check_out,
                    'price_per_night': price_per_night.quantize(Decimal('0.01')),
                    'total_amount': Decimal(str(b['totalPrice'])),
                    'source': b['bookingSource'],
                    'booking_link': b['bookingLink'],
                    'status': b['status'],
                }
            )
            self.stdout.write(f'  {"Created" if created else "Updated"}: {booking}')

        self.stdout.write(self.style.SUCCESS(
            f'Successfully imported {len(PROPERTIES_DATA)} properties, '
            f'{len(guest_cache)} guests, and {len(BOOKINGS_DATA)} bookings'
        ))
