from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("api/", include("api.urls")),
]

# Serve the React SPA in production
if not settings.DEBUG:
    from django.views.generic import TemplateView
    urlpatterns += [
        path("", TemplateView.as_view(template_name="index.html")),
        path("<path:path>", TemplateView.as_view(template_name="index.html")),
    ]
