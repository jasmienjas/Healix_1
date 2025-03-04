from django.urls import path
from .views import PaymentMethodListView, process_payment

urlpatterns = [
    path('methods/', PaymentMethodListView.as_view(), name='payment-methods'),
    path('process/', process_payment, name='process-payment'),
]
