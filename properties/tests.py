from django.test import TestCase
from django.urls import reverse, resolve
from properties.views import landing, index

class RoutingTests(TestCase):
    def test_landing_route_resolves_and_returns_ok(self):
        url = reverse('landing')
        self.assertEqual(url, '/')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'landing.html')

    def test_dashboard_route_resolves_and_returns_ok(self):
        url = reverse('index')
        self.assertEqual(url, '/dashboard/')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'index.html')
