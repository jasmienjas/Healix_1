from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, DoctorProfile, PatientProfile, Appointment

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'user_type', 'is_staff', 'is_superuser')
    list_filter = ('user_type', 'is_staff', 'is_superuser')
    fieldsets = UserAdmin.fieldsets + ((None, {'fields': ('user_type',)}),)
    add_fieldsets = UserAdmin.add_fieldsets + ((None, {'fields': ('user_type',)}),)

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(DoctorProfile)
admin.site.register(PatientProfile)

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'doctor', 'patient', 'appointment_date', 'start_time', 'status', 'created_at')
    list_filter = ('status', 'appointment_date')
    search_fields = ('doctor__user__username', 'patient__username', 'notes')