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
    DoctorSearchView,
    DoctorProfileView,
    DoctorAvailabilityView,
    DoctorAvailabilityDeleteView,
    AdminRegisterView,
    get_doctor_details,
    get_doctor_availability,
    CreateAppointmentView,
    ConfirmAppointmentView,
    DeleteAppointmentView,
    send_verification_email_view,
    verify_email,
    DoctorApprovalView
)

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/patient/', PatientRegisterView.as_view(), name='patient-register'),
    path('register/doctor/', DoctorRegisterView.as_view(), name='doctor-register'),
    path('register/admin/', AdminRegisterView.as_view(), name='admin-register'),
    path('send-verification/', send_verification_email_view, name='send-verification'),
    path('verify-email/', verify_email, name='verify-email'),
    path('appointments/<int:pk>/postpone/', PostponeAppointmentView.as_view(), name='postpone-appointment'),
    path('appointments/<int:pk>/cancel/', CancelAppointmentView.as_view(), name='cancel-appointment'),
    path('appointments/<int:pk>/delete/', DeleteAppointmentView.as_view(), name='delete-appointment'),
    path('appointments/confirm/<int:pk>/', ConfirmAppointmentView.as_view(), name='confirm-appointment'),
    path('appointments/schedule/', PatientScheduleView.as_view(), name='patient-schedule'),
    path('appointments/create/', CreateAppointmentView.as_view(), name='create-appointment'),
    path('appointments/doctor-schedule/', DoctorScheduleView.as_view(), name='doctor-schedule'),
    path('doctor/approval-status/<str:email>/', DoctorApprovalStatusView.as_view(), name='doctor-approval-status'),
    path('doctor/approve/<int:doctor_id>/', DoctorApprovalView.as_view(), name='doctor-approve'),
    path('doctors/search/', DoctorSearchView.as_view(), name='doctor-search'),
    path('doctor/profile/', DoctorProfileView.as_view(), name='doctor-profile'),
    path('doctor/availability/', DoctorAvailabilityView.as_view(), name='doctor-availability'),
    path('doctor/availability/<str:availability_id>/', DoctorAvailabilityView.as_view(), name='doctor-availability-detail'),
    path('doctor/availability/delete/', DoctorAvailabilityDeleteView.as_view(), name='doctor-availability-delete'),
    path('doctors/<int:doctor_id>/', get_doctor_details, name='doctor-details'),
    path('appointments/availability/<int:doctor_id>/<str:date>/', get_doctor_availability, name='doctor-availability'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
