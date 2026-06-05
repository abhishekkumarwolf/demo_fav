import json
from datetime import datetime
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from .models import Property, Guest, Booking


def index(request):
    return render(request, 'index.html')


def calendar_view(request):
    return render(request, 'calendar.html')


def reservations_view(request):
    return render(request, 'reservations.html')


def listings_view(request):
    return render(request, 'listings.html')


def tasks_view(request):
    return render(request, 'tasks.html')


def enquiries_view(request):
    return render(request, 'enquiries.html')


@require_GET
def api_properties(request):
    properties = Property.objects.all().order_by('name')
    data = []
    for p in properties:
        data.append({
            'id': p.id,
            'name': p.name,
            'image': p.property_image or '',
            'description': p.description,
            'city': p.city,
            'country': p.country,
            'bookingCount': p.bookings.count(),
        })
    return JsonResponse(data, safe=False)


@require_GET
def api_property_bookings(request, property_id):
    property_obj = get_object_or_404(Property, id=property_id)
    bookings = property_obj.bookings.select_related('guest').all().order_by('check_in')

    month = request.GET.get('month')
    year = request.GET.get('year')

    if month and year:
        month = int(month) + 1
        year = int(year)
        bookings = bookings.filter(check_in__lte=datetime(year, month + 1, 1).date())
        bookings = bookings.filter(check_out__gte=datetime(year, month, 1).date())

    data = []
    for b in bookings:
        data.append({
            'id': b.id,
            'propertyId': b.property_id,
            'guestName': str(b.guest),
            'guestAvatar': b.guest.profile_image or '',
            'checkIn': b.check_in.isoformat(),
            'checkOut': b.check_out.isoformat(),
            'status': b.status,
            'totalPrice': float(b.total_price),
            'bookingSource': b.booking_source or '',
            'bookingLink': b.booking_link or '',
        })
    return JsonResponse(data, safe=False)


@require_GET
def api_booking_detail(request, booking_id):
    booking = get_object_or_404(
        Booking.objects.select_related('property', 'guest'),
        id=booking_id
    )
    nights = (booking.check_out - booking.check_in).days

    data = {
        'id': booking.id,
        'propertyId': booking.property_id,
        'propertyName': booking.property.name,
        'guestName': str(booking.guest),
        'guestAvatar': booking.guest.profile_image or '',
        'checkIn': booking.check_in.isoformat(),
        'checkOut': booking.check_out.isoformat(),
        'totalNights': nights,
        'pricePerNight': float(booking.price_per_night),
        'totalPrice': float(booking.total_price),
        'bookingSource': booking.booking_source or '',
        'bookingLink': booking.booking_link or '',
        'status': booking.status,
    }
    return JsonResponse(data)


@require_GET
def api_property_detail(request, property_id):
    property_obj = get_object_or_404(Property, id=property_id)
    data = {
        'id': property_obj.id,
        'name': property_obj.name,
        'image': property_obj.property_image or '',
        'description': property_obj.description,
        'address': property_obj.address,
        'city': property_obj.city,
        'country': property_obj.country,
        'bookingCount': property_obj.bookings.count(),
    }
    return JsonResponse(data)
