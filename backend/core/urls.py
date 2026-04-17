from django.urls import path, include

urlpatterns = [
    path('prompts/', include('prompts.urls')),
]
