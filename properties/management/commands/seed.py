from decimal import Decimal
from datetime import date
from django.core.management.base import BaseCommand
from django.db import transaction
from properties.models import Property, Guest, Reservation, Task, Inquiry

PROPERTIES = [
    {'id': 1, 'name': 'Beach Villa',       'city': 'Miami',        'state': 'FL', 'country': 'US', 'max_guests': 8,  'image': '/media/guest_avatars/hpics/h1.jpg'},
    {'id': 2, 'name': 'Mountain Retreat',  'city': 'Aspen',        'state': 'CO', 'country': 'US', 'max_guests': 6,  'image': '/media/guest_avatars/hpics/h2.jpg'},
    {'id': 3, 'name': 'City Apartment',    'city': 'New York',     'state': 'NY', 'country': 'US', 'max_guests': 4,  'image': '/media/guest_avatars/hpics/h3.jpg'},
    {'id': 4, 'name': 'Lake House',        'city': 'Lake Tahoe',   'state': 'CA', 'country': 'US', 'max_guests': 10, 'image': '/media/guest_avatars/hpics/h4.jpg'},
    {'id': 5, 'name': 'Garden Studio',     'city': 'Austin',       'state': 'TX', 'country': 'US', 'max_guests': 2,  'image': '/media/guest_avatars/hpics/h5.jpg'},
    {'id': 6, 'name': 'Skyline Penthouse', 'city': 'Chicago',      'state': 'IL', 'country': 'US', 'max_guests': 6,  'image': '/media/guest_avatars/hpics/h6.jpg'},
    {'id': 7, 'name': 'Cozy Cottage',      'city': 'Nashville',    'state': 'TN', 'country': 'US', 'max_guests': 4,  'image': '/media/guest_avatars/hpics/h7.jpg'},
]

GUESTS = [
    {'id': 1,  'first_name': 'John',     'last_name': 'Smith',    'email': 'john.smith@example.com',     'phone': '+1-555-0101'},
    {'id': 2,  'first_name': 'Sarah',    'last_name': 'Johnson',  'email': 'sarah.johnson@example.com',  'phone': '+1-555-0102'},
    {'id': 3,  'first_name': 'Mike',     'last_name': 'Brown',    'email': 'mike.brown@example.com',     'phone': '+1-555-0103'},
    {'id': 4,  'first_name': 'Emily',    'last_name': 'Davis',    'email': 'emily.davis@example.com',    'phone': '+1-555-0104'},
    {'id': 5,  'first_name': 'Alex',     'last_name': 'Wilson',   'email': 'alex.wilson@example.com',    'phone': '+1-555-0105'},
    {'id': 6,  'first_name': 'Lisa',     'last_name': 'Anderson', 'email': 'lisa.anderson@example.com',  'phone': '+1-555-0106'},
    {'id': 7,  'first_name': 'James',    'last_name': 'Taylor',   'email': 'james.taylor@example.com',   'phone': '+1-555-0107'},
    {'id': 8,  'first_name': 'Emma',     'last_name': 'Thompson', 'email': 'emma.thompson@example.com',  'phone': '+1-555-0108'},
    {'id': 9,  'first_name': 'Robert',   'last_name': 'Martinez', 'email': 'robert.martinez@example.com','phone': '+1-555-0109'},
    {'id': 10, 'first_name': 'Jennifer', 'last_name': 'Garcia',   'email': 'jennifer.garcia@example.com','phone': '+1-555-0110'},
    {'id': 11, 'first_name': 'David',    'last_name': 'Miller',   'email': 'david.miller@example.com',   'phone': '+1-555-0111'},
    {'id': 12, 'first_name': 'Olivia',   'last_name': 'White',    'email': 'olivia.white@example.com',   'phone': '+1-555-0112'},
    {'id': 13, 'first_name': 'Daniel',   'last_name': 'Lee',      'email': 'daniel.lee@example.com',     'phone': '+1-555-0113'},
    {'id': 14, 'first_name': 'Sophia',   'last_name': 'Clark',    'email': 'sophia.clark@example.com',   'phone': '+1-555-0114'},
    {'id': 15, 'first_name': 'William',  'last_name': 'Turner',   'email': 'william.turner@example.com', 'phone': '+1-555-0115'},
    {'id': 16, 'first_name': 'Nina',     'last_name': 'Patel',    'email': 'nina.patel@example.com',     'phone': '+1-555-0116'},
    {'id': 17, 'first_name': 'Oliver',   'last_name': 'Harris',   'email': 'oliver.harris@example.com',  'phone': '+1-555-0117'},
]

RESERVATIONS = [
    {'id': 1,  'property_id': 1, 'guest_id': 1,  'check_in': '2026-03-05', 'check_out': '2026-03-10', 'status': 'confirmed',   'total_amount': 1750,  'source': 'booking'},
    {'id': 2,  'property_id': 1, 'guest_id': 2,  'check_in': '2026-03-12', 'check_out': '2026-03-18', 'status': 'confirmed',   'total_amount': 2100,  'source': 'airbnb'},
    {'id': 3,  'property_id': 1, 'guest_id': 3,  'check_in': '2026-03-20', 'check_out': '2026-03-25', 'status': 'pending',     'total_amount': 1500,  'source': 'direct'},
    {'id': 4,  'property_id': 2, 'guest_id': 4,  'check_in': '2026-03-03', 'check_out': '2026-03-08', 'status': 'confirmed',   'total_amount': 1200,  'source': 'booking'},
    {'id': 5,  'property_id': 2, 'guest_id': 5,  'check_in': '2026-03-15', 'check_out': '2026-03-22', 'status': 'cancelled',   'total_amount': 1960,  'source': 'expedia'},
    {'id': 6,  'property_id': 3, 'guest_id': 6,  'check_in': '2026-03-01', 'check_out': '2026-03-06', 'status': 'confirmed',   'total_amount': 900,   'source': 'airbnb'},
    {'id': 7,  'property_id': 3, 'guest_id': 7,  'check_in': '2026-03-10', 'check_out': '2026-03-14', 'status': 'confirmed',   'total_amount': 800,   'source': 'booking'},
    {'id': 8,  'property_id': 3, 'guest_id': 8,  'check_in': '2026-03-18', 'check_out': '2026-03-24', 'status': 'pending',     'total_amount': 1200,  'source': 'direct'},
    {'id': 9,  'property_id': 4, 'guest_id': 9,  'check_in': '2026-03-04', 'check_out': '2026-03-09', 'status': 'confirmed',   'total_amount': 1100,  'source': 'booking'},
    {'id': 10, 'property_id': 4, 'guest_id': 10, 'check_in': '2026-03-14', 'check_out': '2026-03-20', 'status': 'checked_out', 'total_amount': 1500,  'source': 'expedia'},
    {'id': 11, 'property_id': 5, 'guest_id': 11, 'check_in': '2026-03-02', 'check_out': '2026-03-07', 'status': 'confirmed',   'total_amount': 750,   'source': 'airbnb'},
    {'id': 12, 'property_id': 5, 'guest_id': 12, 'check_in': '2026-03-10', 'check_out': '2026-03-16', 'status': 'confirmed',   'total_amount': 1050,  'source': 'booking'},
    {'id': 13, 'property_id': 6, 'guest_id': 13, 'check_in': '2026-03-08', 'check_out': '2026-03-14', 'status': 'confirmed',   'total_amount': 2800,  'source': 'booking'},
    {'id': 14, 'property_id': 6, 'guest_id': 14, 'check_in': '2026-03-20', 'check_out': '2026-03-28', 'status': 'confirmed',   'total_amount': 4400,  'source': 'direct'},
    {'id': 15, 'property_id': 7, 'guest_id': 15, 'check_in': '2026-03-06', 'check_out': '2026-03-11', 'status': 'pending',     'total_amount': 650,   'source': 'airbnb'},
    {'id': 16, 'property_id': 1, 'guest_id': 16, 'check_in': '2026-03-27', 'check_out': '2026-04-02', 'status': 'confirmed',   'total_amount': 1800,  'source': 'expedia'},
    {'id': 17, 'property_id': 7, 'guest_id': 17, 'check_in': '2026-03-17', 'check_out': '2026-03-21', 'status': 'confirmed',   'total_amount': 800,   'source': 'booking'},
    # April data
    {'id': 18, 'property_id': 1, 'guest_id': 2,  'check_in': '2026-04-05', 'check_out': '2026-04-10', 'status': 'confirmed',   'total_amount': 1750,  'source': 'airbnb'},
    {'id': 19, 'property_id': 2, 'guest_id': 4,  'check_in': '2026-04-08', 'check_out': '2026-04-14', 'status': 'confirmed',   'total_amount': 1440,  'source': 'booking'},
    {'id': 20, 'property_id': 3, 'guest_id': 6,  'check_in': '2026-04-02', 'check_out': '2026-04-07', 'status': 'pending',     'total_amount': 1000,  'source': 'direct'},
    {'id': 21, 'property_id': 4, 'guest_id': 9,  'check_in': '2026-04-12', 'check_out': '2026-04-18', 'status': 'confirmed',   'total_amount': 1320,  'source': 'booking'},
    {'id': 22, 'property_id': 5, 'guest_id': 11, 'check_in': '2026-04-20', 'check_out': '2026-04-25', 'status': 'confirmed',   'total_amount': 875,   'source': 'airbnb'},
    {'id': 23, 'property_id': 6, 'guest_id': 13, 'check_in': '2026-04-15', 'check_out': '2026-04-22', 'status': 'confirmed',   'total_amount': 3850,  'source': 'direct'},
    {'id': 24, 'property_id': 7, 'guest_id': 15, 'check_in': '2026-04-03', 'check_out': '2026-04-08', 'status': 'confirmed',   'total_amount': 650,   'source': 'booking'},
]

TASKS = [
    {'property_id': 1, 'reservation_id': 2,  'title': 'Deep clean Beach Villa',             'task_type': 'cleaning',     'priority': 'high',   'assigned_to': 'Maria',       'due_date': '2026-03-12'},
    {'property_id': 3, 'reservation_id': 7,  'title': 'Fix leaking faucet — City Apartment','task_type': 'maintenance',  'priority': 'high',   'assigned_to': 'Carlos',      'due_date': '2026-03-10'},
    {'property_id': 2, 'reservation_id': 4,  'title': 'Restock supplies — Mountain Retreat', 'task_type': 'other',        'priority': 'medium', 'assigned_to': 'Maria',       'due_date': '2026-03-08'},
    {'property_id': 4, 'reservation_id': 9,  'title': 'Pre-arrival inspection — Lake House', 'task_type': 'inspection',   'priority': 'low',    'assigned_to': 'James',       'due_date': '2026-03-04'},
    {'property_id': 7, 'reservation_id': 15, 'title': 'Lawn maintenance — Cozy Cottage',     'task_type': 'maintenance',  'priority': 'low',    'assigned_to': 'Garden Team', 'due_date': '2026-03-06'},
    {'property_id': 6, 'reservation_id': 13, 'title': 'Replace HVAC filter — Skyline',       'task_type': 'maintenance',  'priority': 'medium', 'assigned_to': 'Carlos',      'due_date': '2026-03-08'},
    {'property_id': 5, 'reservation_id': 11, 'title': 'Towel & linen refresh — Garden Studio','task_type': 'cleaning',    'priority': 'medium', 'assigned_to': 'Maria',       'due_date': '2026-03-02'},
]

INQUIRIES = [
    {'property_id': 1, 'guest_name': 'Sarah Johnson',  'email': 'sarah.j@example.com', 'message': "Hi! I'm interested in booking Beach Villa for the first week of July. Is it available? I'd love to know more about the amenities.", 'status': 'new'},
    {'property_id': 5, 'guest_name': 'Mike Brown',     'email': 'mike.b@example.com',  'message': 'Can I get an early check-in for Garden Studio? My flight arrives at 10 AM.', 'status': 'new'},
    {'property_id': 2, 'guest_name': 'Emily Davis',    'email': 'emily.d@example.com', 'message': 'Thank you for the wonderful stay at Mountain Retreat! The views were breathtaking. We will definitely be back.', 'status': 'replied'},
    {'property_id': 3, 'guest_name': 'James Taylor',   'email': 'james.t@example.com', 'message': 'New booking request: Sep 5-10, 2 guests, $1,200 total. Waiting for confirmation.', 'status': 'new'},
    {'property_id': 3, 'guest_name': 'Lisa Anderson',  'email': 'lisa.a@example.com',  'message': 'Is there a parking spot available at the City Apartment? I will be renting a car.', 'status': 'replied'},
    {'property_id': 4, 'guest_name': 'Robert Martinez','email': 'robert.m@example.com','message': 'The Lake House was perfect for our family reunion. The kitchen was well-stocked and the dock was beautiful!', 'status': 'archived'},
]


class Command(BaseCommand):
    help = 'Seed the database with canonical property/reservation/task/inquiry data'

    def add_arguments(self, parser):
        parser.add_argument('--clear', action='store_true', help='Clear existing data before seeding')

    @transaction.atomic
    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Clearing existing data...')
            Inquiry.objects.all().delete()
            Task.objects.all().delete()
            Reservation.objects.all().delete()
            Guest.objects.all().delete()
            Property.objects.all().delete()

        # Properties
        self.stdout.write('Seeding properties...')
        prop_map = {}
        for p in PROPERTIES:
            obj, created = Property.objects.update_or_create(
                id=p['id'],
                defaults={
                    'name': p['name'], 'city': p['city'], 'state': p['state'],
                    'country': p['country'], 'max_guests': p['max_guests'],
                    'property_image': p['image'],
                }
            )
            prop_map[p['id']] = obj
            self.stdout.write(f"  [Created] {obj.name}" if created else f"  [Updated] {obj.name}")

        # Guests
        self.stdout.write('Seeding guests...')
        guest_map = {}
        for g in GUESTS:
            obj, created = Guest.objects.update_or_create(
                id=g['id'],
                defaults={'first_name': g['first_name'], 'last_name': g['last_name'],
                          'email': g['email'], 'phone': g['phone']}
            )
            guest_map[g['id']] = obj
            self.stdout.write(f"  [Created] {obj}" if created else f"  [Updated] {obj}")

        # Reservations
        self.stdout.write('Seeding reservations...')
        res_map = {}
        for r in RESERVATIONS:
            ci = date.fromisoformat(r['check_in'])
            co = date.fromisoformat(r['check_out'])
            nights = (co - ci).days
            ppn = Decimal(str(r['total_amount'])) / nights if nights else Decimal('0')
            obj, created = Reservation.objects.update_or_create(
                id=r['id'],
                defaults={
                    'property': prop_map[r['property_id']],
                    'guest': guest_map[r['guest_id']],
                    'check_in': ci, 'check_out': co,
                    'status': r['status'],
                    'total_amount': Decimal(str(r['total_amount'])),
                    'price_per_night': ppn.quantize(Decimal('0.01')),
                    'source': r['source'],
                }
            )
            res_map[r['id']] = obj
            self.stdout.write(f"  [Created] {obj}" if created else f"  [Updated] {obj}")

        # Tasks
        self.stdout.write('Seeding tasks...')
        Task.objects.all().delete()
        for t in TASKS:
            Task.objects.create(
                property=prop_map[t['property_id']],
                reservation=res_map.get(t['reservation_id']),
                title=t['title'],
                task_type=t['task_type'],
                priority=t['priority'],
                assigned_to=t['assigned_to'],
                due_date=date.fromisoformat(t['due_date']),
                status='pending',
            )
            self.stdout.write(f"  [Created] {t['title']}")

        # Inquiries
        self.stdout.write('Seeding inquiries...')
        Inquiry.objects.all().delete()
        for i in INQUIRIES:
            Inquiry.objects.create(
                property=prop_map.get(i['property_id']),
                guest_name=i['guest_name'],
                email=i['email'],
                message=i['message'],
                status=i['status'],
            )
            self.stdout.write(f"  [Created] {i['guest_name']}")

        # Reset sequences to prevent duplicate key violations on manual inserts
        self.stdout.write('Resetting database sequences...')
        from django.core.management import call_command
        from django.db import connection
        import io
        out = io.StringIO()
        call_command('sqlsequencereset', 'properties', stdout=out)
        sql = out.getvalue()
        with connection.cursor() as cursor:
            cursor.execute(sql)

        self.stdout.write(self.style.SUCCESS(
            f'\nDone. {len(PROPERTIES)} properties, {len(GUESTS)} guests, '
            f'{len(RESERVATIONS)} reservations, {len(TASKS)} tasks, {len(INQUIRIES)} inquiries.'
        ))
