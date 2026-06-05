from django.db import models


class Property(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    address = models.CharField(max_length=300, blank=True, default='')
    city = models.CharField(max_length=100, blank=True, default='')
    country = models.CharField(max_length=100, blank=True, default='')
    property_image = models.URLField(max_length=500, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'properties'
        ordering = ['name']

    def __str__(self):
        return self.name


class Guest(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(blank=True, default='')
    phone = models.CharField(max_length=50, blank=True, default='')
    profile_image = models.URLField(max_length=500, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['first_name', 'last_name']

    def __str__(self):
        return f'{self.first_name} {self.last_name}'


class Booking(models.Model):
    STATUS_CHOICES = [
        ('confirmed', 'Confirmed'),
        ('pending', 'Pending'),
        ('cancelled', 'Cancelled'),
        ('checked_out', 'Checked Out'),
    ]

    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    guest = models.ForeignKey(
        Guest,
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    check_in = models.DateField()
    check_out = models.DateField()
    price_per_night = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )
    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    booking_source = models.CharField(max_length=100, blank=True, default='')
    booking_link = models.URLField(max_length=500, blank=True, default='')
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='confirmed'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['check_in']

    def __str__(self):
        return f'{self.guest} @ {self.property} ({self.check_in} - {self.check_out})'
