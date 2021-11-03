from django.urls import path
from .views import GlobalReport
urlpatterns = [
    path('global/<str:date>/', GlobalReport.as_view()),
]