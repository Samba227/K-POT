from django.contrib import admin
from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.api.urls')),
    path('api/auth/', include('users.api.auth.urls')),
    path('api/connexions/', include('connexions.api.urls')),
    path('', include('honeypot.urls')),
    path('api/dashboard/', include('dashboard.urls')),
    path('api/report/', include('report.urls')),
]

urlpatterns = format_suffix_patterns(urlpatterns)
