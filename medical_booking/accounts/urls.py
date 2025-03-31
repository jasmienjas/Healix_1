from django.urls import path
<<<<<<< HEAD
=======
from .views import RegisterView, DoctorRegisterView, LoginView, PatientRegisterView
>>>>>>> fa6fdd2d1a94a2aac892c6acbb68081bd7fd732e
from django.conf import settings
from django.conf.urls.static import static
from .views import PatientScheduleView, RegisterView, DoctorRegisterView, LoginView, PostponeAppointmentView, CancelAppointmentView


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('doctor-register/', DoctorRegisterView.as_view(), name='doctor-register'),  # ✅ Doctor registration route
    path('login/', LoginView.as_view(), name='login'),
<<<<<<< HEAD
    path('appointments/<int:pk>/postpone/', PostponeAppointmentView.as_view(), name='postpone-appointment'),
    path('appointments/<int:pk>/cancel/', CancelAppointmentView.as_view(), name='cancel-appointment'),
    path('appointments/schedule/', PatientScheduleView.as_view(), name='patient-schedule'),
    
=======
    path('register/patient/', PatientRegisterView.as_view(), name='patient-register'),
>>>>>>> fa6fdd2d1a94a2aac892c6acbb68081bd7fd732e
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

