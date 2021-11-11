from django.urls import path
from .views import Bandwidth, AllNetworkConsupmtion, IPNetworkConsupmtion, ActiveIps, TodayConnections #, Index

urlpatterns = [
    #path('', Index.as_view()),
    path('', Bandwidth.as_view()),
    path('bandwidth/', Bandwidth.as_view()),
    path('data/', AllNetworkConsupmtion.as_view()),
    path('data/d=<str:date>/', AllNetworkConsupmtion.as_view()),
    path('data/<str:ip>/', IPNetworkConsupmtion.as_view()),
    path('data/<str:ip>/d=<str:date>/', IPNetworkConsupmtion.as_view()),
    path('activeIPs/', ActiveIps.as_view()),
    path('activeIPs/<str:ip>/', ActiveIps.as_view()),
    path('activeIPs/<str:ip>/d=<str:date>/', ActiveIps.as_view()),
    path('todayConnections/', TodayConnections.as_view()),
]
