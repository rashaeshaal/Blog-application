from django.urls import path
from django.conf import settings
from .views import RegisterView, LoginView,LogoutView,ProfileListView,PostCreateView,BlogPostListView,BlogPostDetailView,DeleteBlogPostView,UpdateBlogPostView
from django.conf.urls.static import static


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('handlelogin/', LoginView.as_view(), name='handlelogin'),
    path('profiles/', ProfileListView.as_view(), name='profile-list'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('posts/', PostCreateView.as_view(), name='create_post'),
    path('postsviews/<int:id>/', BlogPostDetailView.as_view(), name='post-detail'),
    path('postsviews/', BlogPostListView.as_view(), name='postsviews'),
    path('postsviews/<int:id>/update/', UpdateBlogPostView.as_view(), name='post-update'),  
    path('postsviews/<int:id>/delete/', DeleteBlogPostView.as_view(), name='post-delete'), 
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)