from django.urls import path
from .views import RegisterView, DoctorRegisterView, LoginView
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from .views import DoctorListView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('doctor-register/', DoctorRegisterView.as_view(), name='doctor-register'),  # ✅ Doctor registration route
    path('login/', LoginView.as_view(), name='login'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from django.urls import path
from .views import DoctorListView

urlpatterns = [
    path('api/doctors/', DoctorListView.as_view(), name='doctor-list'),
]


