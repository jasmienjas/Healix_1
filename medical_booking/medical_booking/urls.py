from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def home_view(request):
    return JsonResponse({"message": "Welcome to the Django API!"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),  # ✅ Ensure `accounts.urls` is included
    path('', home_view),  # ✅ Handles `/` route
]

