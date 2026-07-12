from django.urls import path
from . import views

urlpatterns = [
    # Pages
    path('', views.landing, name='landing'),
    path('dashboard/', views.index, name='index'),
    path('calendar/', views.calendar_view, name='calendar'),
    path('reservations/', views.reservations_view, name='reservations'),
    path('listings/', views.listings_view, name='listings'),
    path('tasks/', views.tasks_view, name='tasks'),
    path('enquiries/', views.enquiries_view, name='enquiries'),

    # Properties
    path('api/properties/', views.api_properties, name='api_properties'),
    path('api/properties/create/', views.api_create_property, name='api_create_property'),
    path('api/properties/<int:property_id>/', views.api_property_detail, name='api_property_detail'),
    path('api/properties/<int:property_id>/delete/', views.api_delete_property, name='api_delete_property'),
    path('api/properties/<int:property_id>/reservations/', views.api_property_reservations, name='api_property_reservations'),

    # Reservations
    path('api/reservations/', views.api_all_reservations, name='api_all_reservations'),
    path('api/reservations/create/', views.api_create_reservation, name='api_create_reservation'),
    path('api/reservations/<int:reservation_id>/', views.api_reservation_detail, name='api_reservation_detail'),
    path('api/reservations/<int:reservation_id>/update/', views.api_update_reservation, name='api_update_reservation'),
    path('api/reservations/<int:reservation_id>/delete/', views.api_delete_reservation, name='api_delete_reservation'),

    # Guests
    path('api/guests/', views.api_guests, name='api_guests'),

    # Tasks
    path('api/tasks/', views.api_tasks, name='api_tasks'),
    path('api/tasks/<int:task_id>/update/', views.api_update_task, name='api_update_task'),

    # Inquiries
    path('api/inquiries/', views.api_inquiries, name='api_inquiries'),
    path('api/inquiries/<int:inquiry_id>/update/', views.api_update_inquiry, name='api_update_inquiry'),

    # Dashboard
    path('api/dashboard/stats/', views.api_dashboard_stats, name='api_dashboard_stats'),
]
