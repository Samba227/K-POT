from django.urls import path
from .views import GlobalReport
urlpatterns = [
    path('', GlobalReport.as_view()),
    path('date=<str:date>/', GlobalReport.as_view()),
]