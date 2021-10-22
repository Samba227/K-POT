from django.urls import path
from .views import HoneypotView

urlpatterns = [
    path('', HoneypotView.as_view()),
]
