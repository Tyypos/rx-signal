from django.urls import path, include
from django.conf import settings
from django.http import FileResponse, HttpResponseNotFound


def spa_index(request, path=""):
    index = settings.FRONTEND_DIST / "index.html"
    if index.exists():
        return FileResponse(open(index, "rb"), content_type="text/html")
    return HttpResponseNotFound(
        "Frontend not built. Run: cd frontend && npm run build"
    )


urlpatterns = [
    path("api/", include("api.urls")),
    path("", spa_index),
    path("<path:path>", spa_index),
]
