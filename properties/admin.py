from django.contrib import admin
from .models import Property, Guest, Booking


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'country', 'created_at')
    search_fields = ('name', 'city', 'country')


@admin.register(Guest)
class GuestAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'created_at')
    search_fields = ('first_name', 'last_name', 'email')


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('guest', 'property', 'check_in', 'check_out', 'status', 'total_price')
    list_filter = ('status', 'property', 'check_in', 'check_out')
    search_fields = ('guest__first_name', 'guest__last_name', 'property__name')
