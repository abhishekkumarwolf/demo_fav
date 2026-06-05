from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('properties.urls')),
    path('index.html', RedirectView.as_view(url='/', permanent=False)),
    path('calendar.html', RedirectView.as_view(url='/calendar/', permanent=False)),
    path('reservations.html', RedirectView.as_view(url='/reservations/', permanent=False)),
    path('listings.html', RedirectView.as_view(url='/listings/', permanent=False)),
    path('tasks.html', RedirectView.as_view(url='/tasks/', permanent=False)),
    path('enquiries.html', RedirectView.as_view(url='/enquiries/', permanent=False)),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.BASE_DIR / 'static')
