from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from .models import CustomUser, DoctorProfile, PatientProfile, Appointment, DoctorAvailability
import logging

logger = logging.getLogger('accounts')

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'user_type', 'is_staff', 'is_superuser')
    list_filter = ('user_type', 'is_staff', 'is_superuser')
    fieldsets = UserAdmin.fieldsets + ((None, {'fields': ('user_type',)}),)
    add_fieldsets = UserAdmin.add_fieldsets + ((None, {'fields': ('user_type',)}),)

@admin.register(DoctorProfile)
class DoctorProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'specialty', 'is_approved', 'created_at')
    list_filter = ('is_approved', 'specialty')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'specialty')
    
    def response_change(self, request, obj):
        # Check if is_approved is True
        if obj.is_approved:
            # Send approval email
            try:
                subject = 'Your HEALIX Doctor Account Has Been Approved'
                context = {
                    'doctor_name': f"{obj.user.first_name} {obj.user.last_name}",
                    'login_url': f"{settings.FRONTEND_URL}/login"
                }
                
                # Log email configuration
                logger.info(f"Email configuration - From: {settings.DEFAULT_FROM_EMAIL}")
                logger.info(f"Email configuration - Host: {settings.EMAIL_HOST}")
                logger.info(f"Email configuration - Port: {settings.EMAIL_PORT}")
                logger.info(f"Email configuration - TLS: {settings.EMAIL_USE_TLS}")
                
                # Render both HTML and plain text versions
                html_message = render_to_string('email/doctor_approval.html', context)
                plain_message = f"Dear Dr. {context['doctor_name']},\n\n"
                plain_message += "We are pleased to inform you that your HEALIX doctor account has been approved!\n\n"
                plain_message += f"You can now log in to your account at {context['login_url']} and start managing your profile and appointments.\n\n"
                plain_message += "If you have any questions or need assistance, please don't hesitate to contact our support team.\n\n"
                plain_message += "Best regards,\nThe HEALIX Team"
                
                # Log email details
                logger.info(f"Sending approval email to {obj.user.email}")
                logger.info(f"Email subject: {subject}")
                logger.info(f"Login URL: {context['login_url']}")
                logger.info(f"HTML message length: {len(html_message)}")
                logger.info(f"Plain message length: {len(plain_message)}")

                send_mail(
                    subject,
                    plain_message,
                    settings.DEFAULT_FROM_EMAIL,
                    [obj.user.email],
                    html_message=html_message,
                    fail_silently=False
                )
                
                logger.info(f"Approval email sent successfully to {obj.user.email}")

            except Exception as e:
                logger.error(f"Failed to send approval email: {str(e)}")
                logger.error(f"Error type: {type(e).__name__}")
                logger.error(f"Error details: {str(e)}")
                # Don't fail the approval if email sending fails
                logger.warning("Continuing with approval despite email failure")
        
        return super().response_change(request, obj)

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(PatientProfile)

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'doctor', 'patient', 'appointment_date', 'start_time', 'status', 'created_at')
    list_filter = ('status', 'appointment_date')
    search_fields = ('doctor__user__username', 'patient__username', 'notes')

admin.site.register(DoctorAvailability)