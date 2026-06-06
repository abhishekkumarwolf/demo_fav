from django.contrib import admin
from .models import Property, Guest, Reservation, Task, Inquiry


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'state', 'country', 'max_guests')
    search_fields = ('name', 'city', 'state')


@admin.register(Guest)
class GuestAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'phone')
    search_fields = ('first_name', 'last_name', 'email')


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ('id', 'guest', 'property', 'check_in', 'check_out', 'nights', 'status', 'total_amount', 'source')
    list_filter = ('status', 'source', 'property')
    search_fields = ('guest__first_name', 'guest__last_name', 'property__name')
    date_hierarchy = 'check_in'

    def nights(self, obj):
        return obj.nights
    nights.short_description = 'Nights'


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'property', 'task_type', 'priority', 'status', 'assigned_to', 'due_date')
    list_filter = ('status', 'priority', 'task_type', 'property')
    search_fields = ('title', 'property__name', 'assigned_to')


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ('guest_name', 'email', 'property', 'status', 'created_at')
    list_filter = ('status', 'property')
    search_fields = ('guest_name', 'email')
