from django.urls import path
from .views import UserView, UsersListView

app_name = 'users'

urlpatterns = [
    path('list/', UsersListView.as_view()),
    path('delete/<int:uid>/', UsersListView.as_view()),
    path('profile/', UserView.as_view()),
]
