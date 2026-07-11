import json
from datetime import date
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q, Count, Prefetch
from .models import Property, Guest, Reservation, Task, Inquiry


# ─── Page views ────────────────────────────────────────────────────────────────

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


# ─── Helpers ───────────────────────────────────────────────────────────────────

def _reservation_dict(r, include_property=False):
    nights = r.nights
    d = {
        'id': r.id,
        'propertyId': r.property_id,
        'guestId': r.guest_id,
        'guestName': str(r.guest),
        'guestAvatar': r.guest.profile_image.url if r.guest.profile_image else
          'https://ui-avatars.com/api/?name=' + r.guest.first_name.replace(' ', '+') +
          '+' + r.guest.last_name.replace(' ', '+') + '&background=55c1d9&color=fff&size=40&rounded=true',
        'checkIn': r.check_in.isoformat(),
        'checkOut': r.check_out.isoformat(),
        'nights': nights,
        'status': r.status,
        'totalAmount': float(r.total_amount),
        'pricePerNight': float(r.price_per_night),
        'source': r.source,
        'bookingLink': r.booking_link,
        'notes': r.notes,
    }
    if include_property:
        d['propertyName'] = r.property.name
    return d


# ─── Properties API ────────────────────────────────────────────────────────────

@require_GET
def api_properties(request):
    props = (
        Property.objects
        .annotate(reservation_count=Count('reservations'))
        .order_by('name')
    )
    data = [{
        'id': p.id,
        'name': p.name,
        'image': p.property_image or '',
        'city': p.city,
        'state': p.state,
        'country': p.country,
        'maxGuests': p.max_guests,
        'bookingCount': p.reservation_count,
    } for p in props]
    return JsonResponse(data, safe=False)


@require_GET
def api_property_detail(request, property_id):
    p = get_object_or_404(
        Property.objects.annotate(reservation_count=Count('reservations')),
        id=property_id
    )
    return JsonResponse({
        'id': p.id,
        'name': p.name,
        'image': p.property_image or '',
        'description': p.description,
        'address': p.address,
        'city': p.city,
        'state': p.state,
        'country': p.country,
        'maxGuests': p.max_guests,
        'bookingCount': p.reservation_count,
    })


# ─── Reservations API ──────────────────────────────────────────────────────────

@require_GET
def api_property_reservations(request, property_id):
    get_object_or_404(Property, id=property_id)
    qs = (
        Reservation.objects
        .filter(property_id=property_id)
        .select_related('guest')
        .order_by('check_in')
    )

    month_param = request.GET.get('month')
    year_param = request.GET.get('year')
    if month_param is not None and year_param is not None:
        month = int(month_param) + 1   # JS 0-based → 1-based
        year = int(year_param)
        month_start = date(year, month, 1)
        month_end = date(year + 1, 1, 1) if month == 12 else date(year, month + 1, 1)
        qs = qs.filter(check_in__lt=month_end, check_out__gt=month_start)

    status_filter = request.GET.get('status')
    if status_filter:
        qs = qs.filter(status=status_filter)

    return JsonResponse([_reservation_dict(r) for r in qs], safe=False)


@require_GET
def api_all_reservations(request):
    qs = (
        Reservation.objects
        .select_related('property', 'guest')
        .order_by('-check_in')
    )
    status_filter = request.GET.get('status')
    if status_filter:
        qs = qs.filter(status=status_filter)
    search = request.GET.get('search', '').strip()
    if search:
        qs = qs.filter(
            Q(guest__first_name__icontains=search) |
            Q(guest__last_name__icontains=search) |
            Q(property__name__icontains=search)
        )
    return JsonResponse([_reservation_dict(r, include_property=True) for r in qs], safe=False)


@require_GET
def api_reservation_detail(request, reservation_id):
    r = get_object_or_404(
        Reservation.objects.select_related('property', 'guest'),
        id=reservation_id
    )
    d = _reservation_dict(r, include_property=True)
    d['tasks'] = list(r.tasks.values('id', 'title', 'status', 'priority', 'due_date'))
    return JsonResponse(d)


@csrf_exempt
@require_POST
def api_create_reservation(request):
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    property_id  = body.get('property_id')
    guest_id     = body.get('guest_id')
    check_in_str = body.get('check_in')
    check_out_str= body.get('check_out')
    total_amount = body.get('total_amount', 0)
    price_per_night = body.get('price_per_night', 0)
    source       = body.get('source', 'direct')
    status       = body.get('status', 'confirmed')
    notes        = body.get('notes', '')

    errors = {}
    if not property_id:  errors['property_id'] = 'Property is required.'
    if not guest_id:     errors['guest_id']    = 'Guest is required.'
    if not check_in_str: errors['check_in']    = 'Check-in date is required.'
    if not check_out_str:errors['check_out']   = 'Check-out date is required.'
    if errors:
        return JsonResponse({'error': 'Validation failed.', 'fieldErrors': errors}, status=400)

    try:
        check_in  = date.fromisoformat(check_in_str)
        check_out = date.fromisoformat(check_out_str)
    except ValueError:
        return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

    if check_out <= check_in:
        return JsonResponse({'error': 'Check-out must be after check-in.'}, status=400)

    prop  = get_object_or_404(Property, id=property_id)
    guest = get_object_or_404(Guest, id=guest_id)

    # Overlap check (exclude cancelled)
    overlap = Reservation.objects.filter(
        property_id=property_id,
        check_in__lt=check_out,
        check_out__gt=check_in,
    ).exclude(status='cancelled')
    if overlap.exists():
        c = overlap.select_related('guest').first()
        return JsonResponse({
            'error': 'Property already booked for those dates.',
            'collision': {
                'id': c.id, 'guestName': str(c.guest),
                'checkIn': c.check_in.isoformat(), 'checkOut': c.check_out.isoformat(),
                'status': c.status,
            }
        }, status=409)

    r = Reservation.objects.create(
        property=prop, guest=guest,
        check_in=check_in, check_out=check_out,
        total_amount=total_amount, price_per_night=price_per_night,
        source=source, status=status, notes=notes,
    )
    d = _reservation_dict(r, include_property=True)
    return JsonResponse(d, status=201)


@csrf_exempt
def api_update_reservation(request, reservation_id):
    r = get_object_or_404(Reservation, id=reservation_id)
    if request.method not in ('PUT', 'PATCH'):
        return JsonResponse({'error': 'Method not allowed.'}, status=405)
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    allowed = {'status', 'notes', 'total_amount', 'price_per_night', 'source', 'booking_link'}
    for field in allowed:
        if field in body:
            setattr(r, field, body[field])
    r.save()
    return JsonResponse(_reservation_dict(r, include_property=True))


# ─── Guests API ────────────────────────────────────────────────────────────────

@require_GET
def api_guests(request):
    guests = Guest.objects.all().order_by('first_name', 'last_name')
    data = [{
        'id': g.id,
        'firstName': g.first_name,
        'lastName': g.last_name,
        'name': str(g),
        'email': g.email,
        'phone': g.phone,
        'profileImage': g.profile_image.url if g.profile_image else '',
    } for g in guests]
    return JsonResponse(data, safe=False)


# ─── Tasks API ─────────────────────────────────────────────────────────────────

@require_GET
def api_tasks(request):
    qs = Task.objects.select_related('property', 'reservation__guest').order_by('due_date', '-priority')
    property_id = request.GET.get('property')
    status = request.GET.get('status')
    task_type = request.GET.get('type')
    if property_id:  qs = qs.filter(property_id=property_id)
    if status:       qs = qs.filter(status=status)
    if task_type:    qs = qs.filter(task_type=task_type)

    data = [{
        'id': t.id,
        'propertyId': t.property_id,
        'propertyName': t.property.name,
        'reservationId': t.reservation_id,
        'guestName': str(t.reservation.guest) if t.reservation else '',
        'title': t.title,
        'description': t.description,
        'taskType': t.task_type,
        'priority': t.priority,
        'status': t.status,
        'assignedTo': t.assigned_to,
        'dueDate': t.due_date.isoformat() if t.due_date else None,
    } for t in qs]
    return JsonResponse(data, safe=False)


@csrf_exempt
def api_update_task(request, task_id):
    t = get_object_or_404(Task, id=task_id)
    if request.method not in ('PUT', 'PATCH'):
        return JsonResponse({'error': 'Method not allowed.'}, status=405)
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    for field in ('status', 'priority', 'assigned_to', 'description'):
        if field in body:
            setattr(t, field, body[field])
    t.save()
    return JsonResponse({'id': t.id, 'status': t.status, 'priority': t.priority})


# ─── Inquiries API ─────────────────────────────────────────────────────────────

@require_GET
def api_inquiries(request):
    qs = Inquiry.objects.select_related('property').order_by('-created_at')
    status = request.GET.get('status')
    if status:
        qs = qs.filter(status=status)
    data = [{
        'id': i.id,
        'propertyId': i.property_id,
        'propertyName': i.property.name if i.property else '',
        'guestName': i.guest_name,
        'email': i.email,
        'message': i.message,
        'status': i.status,
        'createdAt': i.created_at.isoformat(),
    } for i in qs]
    return JsonResponse(data, safe=False)


@csrf_exempt
def api_update_inquiry(request, inquiry_id):
    i = get_object_or_404(Inquiry, id=inquiry_id)
    if request.method not in ('PUT', 'PATCH'):
        return JsonResponse({'error': 'Method not allowed.'}, status=405)
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    if 'status' in body:
        i.status = body['status']
        i.save()
    return JsonResponse({'id': i.id, 'status': i.status})


# ─── Dashboard stats API ───────────────────────────────────────────────────────

@require_GET
def api_dashboard_stats(request):
    from django.db.models import Avg
    total_props = Property.objects.count()
    active = Reservation.objects.filter(status__in=['confirmed', 'pending']).count()
    revenue_qs  = Reservation.objects.filter(status__in=['confirmed', 'checked_out'])
    revenue     = sum(float(r.total_amount) for r in revenue_qs)
    avg_rate    = revenue_qs.aggregate(avg=Avg('price_per_night'))['avg'] or 0
    recent = (
        Reservation.objects
        .select_related('property', 'guest')
        .order_by('-created_at')[:8]
    )
    return JsonResponse({
        'totalProperties': total_props,
        'activeReservations': active,
        'totalRevenue': revenue,
        'avgNightlyRate': float(avg_rate),
        'recentReservations': [_reservation_dict(r, include_property=True) for r in recent],
    })


# ─── Property Creation API ─────────────────────────────────────────────────────

@csrf_exempt
@require_POST
def api_create_property(request):
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON body'}, status=400)

    name = body.get('name', '').strip()
    if not name:
        return JsonResponse({'error': 'Property name is required.'}, status=400)

    description = body.get('description', '').strip()
    address = body.get('address', '').strip()
    city = body.get('city', '').strip()
    state = body.get('state', '').strip()
    country = body.get('country', '').strip()

    try:
        max_guests = int(body.get('max_guests', 2))
    except (ValueError, TypeError):
        max_guests = 2

    property_image = body.get('property_image', '').strip()
    if not property_image:
        import urllib.parse
        encoded_name = urllib.parse.quote_plus(name)
        property_image = f"https://ui-avatars.com/api/?name={encoded_name}&background=55c1d9&color=fff&size=120&rounded=true&bold=true"

    prop = Property.objects.create(
        name=name,
        description=description,
        address=address,
        city=city,
        state=state,
        country=country,
        max_guests=max_guests,
        property_image=property_image
    )

    return JsonResponse({
        'id': prop.id,
        'name': prop.name,
        'image': prop.property_image,
        'description': prop.description,
        'address': prop.address,
        'city': prop.city,
        'state': prop.state,
        'country': prop.country,
        'maxGuests': prop.max_guests,
        'bookingCount': 0,
    }, status=201)


# ─── Deletion APIs ─────────────────────────────────────────────────────────────

@csrf_exempt
def api_delete_property(request, property_id):
    if request.method != 'DELETE':
        return JsonResponse({'error': 'Method not allowed.'}, status=405)
    p = get_object_or_404(Property, id=property_id)
    p.delete()
    return JsonResponse({'success': True})


@csrf_exempt
def api_delete_reservation(request, reservation_id):
    if request.method != 'DELETE':
        return JsonResponse({'error': 'Method not allowed.'}, status=405)
    r = get_object_or_404(Reservation, id=reservation_id)
    r.delete()
    return JsonResponse({'success': True})

