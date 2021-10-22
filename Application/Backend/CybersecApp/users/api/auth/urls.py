from django.urls import path
from .auth_views import RegisterView, LoginView, LogoutView, AdminLoginView


urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('admin-login/', AdminLoginView.as_view()),
    path('logout/', LogoutView.as_view()),
]