from django.urls import path
from .views import ProfileView, ActionView, LoginAttemptView

app_name = 'home'

urlpatterns = [
    path('', ProfileView.as_view()),
    path('action/speed/', ActionView.as_view()),
    path('action/login/', LoginAttemptView.as_view()),

]
