from builtins import property as builtin_property
from django.db import models
from django.core.exceptions import ValidationError


class Property(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    address = models.CharField(max_length=300, blank=True, default='')
    city = models.CharField(max_length=100, blank=True, default='')
    state = models.CharField(max_length=100, blank=True, default='')
    country = models.CharField(max_length=100, blank=True, default='')
    max_guests = models.PositiveSmallIntegerField(default=2)
    property_image = models.URLField(max_length=500, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'properties'
        ordering = ['name']
        indexes = [models.Index(fields=['name'])]

    def __str__(self):
        return self.name


class Guest(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(blank=True, default='')
    phone = models.CharField(max_length=50, blank=True, default='')
    profile_image = models.ImageField(upload_to='guest_avatars/', blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['first_name', 'last_name']
        indexes = [models.Index(fields=['last_name', 'first_name'])]

    def __str__(self):
        return f'{self.first_name} {self.last_name}'


class Reservation(models.Model):
    STATUS_CONFIRMED  = 'confirmed'
    STATUS_PENDING    = 'pending'
    STATUS_CANCELLED  = 'cancelled'
    STATUS_CHECKED_OUT = 'checked_out'

    STATUS_CHOICES = [
        (STATUS_CONFIRMED,   'Confirmed'),
        (STATUS_PENDING,     'Pending'),
        (STATUS_CANCELLED,   'Cancelled'),
        (STATUS_CHECKED_OUT, 'Checked Out'),
    ]

    SOURCE_CHOICES = [
        ('airbnb',   'Airbnb'),
        ('booking',  'Booking.com'),
        ('expedia',  'Expedia'),
        ('vrbo',     'VRBO'),
        ('direct',   'Direct'),
        ('other',    'Other'),
    ]

    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name='reservations'
    )
    guest = models.ForeignKey(
        Guest, on_delete=models.CASCADE, related_name='reservations'
    )
    check_in  = models.DateField(db_index=True)
    check_out = models.DateField(db_index=True)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES,
        default=STATUS_CONFIRMED, db_index=True
    )
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount    = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    source       = models.CharField(max_length=50, blank=True, default='direct')
    booking_link = models.URLField(max_length=500, blank=True, default='')
    notes        = models.TextField(blank=True, default='')
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['check_in']
        indexes = [
            models.Index(fields=['property', 'check_in']),
            models.Index(fields=['property', 'status']),
        ]

    def clean(self):
        if self.check_in and self.check_out:
            if self.check_out <= self.check_in:
                raise ValidationError('Check-out must be after check-in.')

    @builtin_property
    def nights(self):
        if self.check_in and self.check_out:
            return (self.check_out - self.check_in).days
        return 0

    def __str__(self):
        return f'#{self.id} {self.guest} @ {self.property.name} ({self.check_in} to {self.check_out})'


# Proxy alias kept so old migrations & import_data.py don't break
class Booking(Reservation):
    class Meta:
        proxy = True


class Task(models.Model):
    PRIORITY_CHOICES = [
        ('high',   'High'),
        ('medium', 'Medium'),
        ('low',    'Low'),
    ]
    TYPE_CHOICES = [
        ('cleaning',    'Cleaning'),
        ('maintenance', 'Maintenance'),
        ('inspection',  'Inspection'),
        ('other',       'Other'),
    ]
    STATUS_CHOICES = [
        ('pending',     'Pending'),
        ('in_progress', 'In Progress'),
        ('done',        'Done'),
    ]

    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name='tasks'
    )
    reservation = models.ForeignKey(
        Reservation, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='tasks'
    )
    title       = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    task_type   = models.CharField(max_length=20, choices=TYPE_CHOICES, default='cleaning')
    priority    = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    status      = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    assigned_to = models.CharField(max_length=100, blank=True, default='')
    due_date    = models.DateField(null=True, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['due_date', '-priority']
        indexes = [models.Index(fields=['property', 'status'])]

    def __str__(self):
        return f'{self.title} -- {self.property}'


class Inquiry(models.Model):
    STATUS_CHOICES = [
        ('new',      'New'),
        ('replied',  'Replied'),
        ('archived', 'Archived'),
    ]

    property = models.ForeignKey(
        Property, on_delete=models.CASCADE,
        related_name='inquiries', null=True, blank=True
    )
    guest_name = models.CharField(max_length=200)
    email      = models.EmailField(blank=True, default='')
    phone      = models.CharField(max_length=50, blank=True, default='')
    message    = models.TextField()
    status     = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'inquiries'

    def __str__(self):
        return f'{self.guest_name} -- {self.created_at.date()}'
