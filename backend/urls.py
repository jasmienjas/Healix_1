from django.urls import path
from .views import login, register

urlpatterns = [
    path('api/login/', login, name='login'),
    path('api/register/', register, name='register'),
]
