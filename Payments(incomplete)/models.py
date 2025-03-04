from django.db import models

class PaymentMethod(models.Model):
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=50, choices=[('Cards', 'Cards'), ('Digital Wallets', 'Digital Wallets')])
    description = models.TextField()
    logo_url = models.URLField()

    def __str__(self):
        return self.name

class Transaction(models.Model):
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=[('Pending', 'Pending'), ('Success', 'Success'), ('Failed', 'Failed')])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.payment_method.name} - ${self.amount} - {self.status}"
