from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('calendar/', views.calendar_view, name='calendar'),
    path('reservations/', views.reservations_view, name='reservations'),
    path('listings/', views.listings_view, name='listings'),
    path('tasks/', views.tasks_view, name='tasks'),
    path('enquiries/', views.enquiries_view, name='enquiries'),
    path('api/properties/', views.api_properties, name='api_properties'),
    path('api/properties/<int:property_id>/', views.api_property_detail, name='api_property_detail'),
    path('api/properties/<int:property_id>/bookings/', views.api_property_bookings, name='api_property_bookings'),
    path('api/bookings/<int:booking_id>/', views.api_booking_detail, name='api_booking_detail'),
]
