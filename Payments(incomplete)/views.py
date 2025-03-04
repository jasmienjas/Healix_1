from rest_framework import generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import PaymentMethod, Transaction
from .serializers import PaymentMethodSerializer, TransactionSerializer

# List all available payment methods
class PaymentMethodListView(generics.ListAPIView):
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer

# Process a payment transaction
@api_view(['POST'])
def process_payment(request):
    """
    Processes a payment with a specified payment method.
    Example Request:
    {
        "payment_method_id": 1,
        "amount": 100.00
    }
    """
    payment_method_id = request.data.get("payment_method_id")
    amount = request.data.get("amount")

    try:
        payment_method = PaymentMethod.objects.get(id=payment_method_id)
        transaction = Transaction.objects.create(payment_method=payment_method, amount=amount, status="Pending")
        
        # Simulating payment processing
        transaction.status = "Success"
        transaction.save()
        
        return Response({"message": "Payment successful!", "transaction_id": transaction.id}, status=200)
    
    except PaymentMethod.DoesNotExist:
        return Response({"error": "Invalid payment method"}, status=400)
