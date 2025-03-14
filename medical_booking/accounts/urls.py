from django.urls import path
from .views import RegisterView, DoctorRegisterView, LoginView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('doctor-register/', DoctorRegisterView.as_view(), name='doctor-register'),  # ✅ Doctor registration route
    path('login/', LoginView.as_view(), name='login'),
    path('appointments/<int:pk>/postpone/', PostponeAppointmentView.as_view(), name='postpone-appointment'),
    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

