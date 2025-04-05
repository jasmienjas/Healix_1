from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import (
    DoctorRegisterView, 
    LoginView, 
    PatientRegisterView,
    PatientScheduleView,
    DoctorScheduleView,
    PostponeAppointmentView,
    CancelAppointmentView,
    DoctorApprovalStatusView,
    DoctorSearchView
)

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/patient/', PatientRegisterView.as_view(), name='patient-register'),
    path('register/doctor/', DoctorRegisterView.as_view(), name='doctor-register'),
    path('appointments/<int:pk>/postpone/', PostponeAppointmentView.as_view(), name='postpone-appointment'),
    path('appointments/<int:pk>/cancel/', CancelAppointmentView.as_view(), name='cancel-appointment'),
    path('appointments/schedule/', PatientScheduleView.as_view(), name='patient-schedule'),
    path('appointments/doctor-schedule/', DoctorScheduleView.as_view(), name='doctor-schedule'),
    path('doctor/approval-status/<str:email>/', DoctorApprovalStatusView.as_view(), name='doctor-approval-status'),
    path('doctors/search/', DoctorSearchView.as_view(), name='doctor-search'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
