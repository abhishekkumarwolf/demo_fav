import urllib.request, json

try:
    resp = urllib.request.urlopen('http://127.0.0.1:8081/api/properties/', timeout=5)
    data = json.loads(resp.read())
    print(f'Properties API: OK ({len(data)} properties)')
    for p in data:
        print(f'  - {p["name"]} ({p["bookingCount"]} bookings)')
except Exception as e:
    print(f'Properties API Error: {e}')

try:
    resp = urllib.request.urlopen('http://127.0.0.1:8081/api/properties/1/bookings/?month=2&year=2026', timeout=5)
    data = json.loads(resp.read())
    print(f'Bookings API: OK ({len(data)} bookings)')
    for b in data:
        print(f'  - {b["guestName"]} ({b["checkIn"]} to {b["checkOut"]})')
except Exception as e:
    print(f'Bookings API Error: {e}')

try:
    resp = urllib.request.urlopen('http://127.0.0.1:8081/api/bookings/1/', timeout=5)
    data = json.loads(resp.read())
    print(f'Booking Detail API: OK - {data["guestName"]} @ {data["propertyName"]}')
except Exception as e:
    print(f'Booking Detail Error: {e}')

try:
    resp = urllib.request.urlopen('http://127.0.0.1:8081/', timeout=5)
    html = resp.read().decode()
    print(f'Homepage: OK ({len(html)} bytes)')
except Exception as e:
    print(f'Homepage Error: {e}')
