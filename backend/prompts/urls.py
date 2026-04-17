from django.urls import path
from .views import PromptListView, PromptDetailView

urlpatterns = [
    path('', PromptListView.as_view(), name='prompt-list'),
    path('<uuid:pk>/', PromptDetailView.as_view(), name='prompt-detail'),
]
