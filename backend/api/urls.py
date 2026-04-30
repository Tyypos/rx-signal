from django.urls import path
from .views import AdverseEventsView

urlpatterns = [
    path("events/", AdverseEventsView.as_view(), name="adverse-events"),
]
