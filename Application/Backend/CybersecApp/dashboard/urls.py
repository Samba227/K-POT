from django.urls import path
from .views import TotalConsumption, DeviceConsumption, LocalDevices

urlpatterns = [
    path('total-consumption/d=<str:date>/', TotalConsumption.as_view()),
    path('local-devices/filter=<str:filter>/', LocalDevices.as_view()),
    path('device-consumption/<str:ip>/d=<str:date>/', DeviceConsumption.as_view()),
]
