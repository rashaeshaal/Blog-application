from django.urls import path
from .views import RegisterView, LoginView, ProfileView, BlogPostListCreateView, BlogPostDetailView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('handlelogin/', LoginView.as_view(), name='handlelogin'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('posts/', BlogPostListCreateView.as_view(), name='post-list-create'),
    path('posts/<int:pk>/', BlogPostDetailView.as_view(), name='post-detail'),
]