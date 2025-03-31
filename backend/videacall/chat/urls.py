from django.urls import path
from django.shortcuts import render

def index(request):
    return render(request, "chat/video_call.html")

urlpatterns = [
    path('', index, name='video_call'),
]
