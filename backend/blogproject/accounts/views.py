from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions,viewsets
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User,BlogPost,Profile
from .serializers import UserSerializer,PostSerializer,ProfileSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import OutstandingToken, BlacklistedToken
from rest_framework.decorators import api_view
from django.contrib.auth import logout
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.generics import ListAPIView
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'user_id': user.id, 'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        else:
            # Log the errors for debugging
            print(serializer.errors)  # Print errors to the console
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
User = get_user_model()  # Use this to get the User model

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = User.objects.filter(email=email).first()

        if user is None:
            return Response({'error': 'User not found!'}, status=status.HTTP_404_NOT_FOUND)

        if not user.check_password(password):
            return Response({'error': 'Incorrect password!'}, status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)
        return Response({
            'user': {
                'id': user.id,
                'email': user.email,  # You can add more user data as needed
                'name': user.name
            },
            'token': str(refresh.access_token)  # Change this line to 'token'
        })
        


class ProfileListView(generics.ListAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]  # Require authentication to access this view

    def get_queryset(self):
        # Fetch profiles only for the authenticated user
        return Profile.objects.filter(user=self.request.user)

    def patch(self, request, *args, **kwargs):
        # Fetch the profile instance for the authenticated user
        profile_instance = self.get_queryset().first()

        if not profile_instance:
            return Response({'detail': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Update the profile fields
        serializer = self.get_serializer(profile_instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            # Also update the user model's name if the 'name' field is present in the request data
            if 'name' in request.data:
                user_instance = profile_instance.user  # Get the related user instance
                user_instance.name = request.data['name']  # Update the user's name
                user_instance.save()  # Save changes to the User model

            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class PostCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("Request data:", request.data)  # Print the incoming data for debugging

        # Serialize the incoming data
        serializer = PostSerializer(data=request.data)
        
        if serializer.is_valid():
            # Save the post and set the user as the current authenticated user
            serializer.save(user=request.user)
            print("Post created successfully")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Validation errors:", serializer.errors)  # Print validation errors
            # Return validation errors if the data is invalid
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BlogPostPagination(PageNumberPagination):
    page_size = 6  # Number of posts per page
    page_size_query_param = 'page_size'  # Optional: allows clients to set the page size
    max_page_size = 100  # Optional: limits the maximum page size

class BlogPostListView(ListAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = PostSerializer
    permission_classes = [AllowAny]  # Allows unauthenticated users to view posts
    pagination_class = BlogPostPagination
    
class BlogPostDetailView(generics.RetrieveAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = PostSerializer
    permission_classes = [AllowAny]  # Allows unauthenticated users to view the post
    lookup_field = 'id'    
class UpdateBlogPostView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def patch(self, request, pk):  # Change from put to patch for partial updates
        post = get_object_or_404(BlogPost, pk=pk)
        
        # Check if the authenticated user is the author of the post
        if post.author != request.user:
            return Response({"detail": "You do not have permission to update this post."}, status=status.HTTP_403_FORBIDDEN)
        
        # Partial update with `partial=True`
        serializer = PostSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
import logging

logger = logging.getLogger(__name__)

class DeleteBlogPostView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        post = get_object_or_404(BlogPost, pk=pk)
        
        if post.author != request.user:
            return Response({"detail": "You do not have permission to delete this post."}, status=status.HTTP_403_FORBIDDEN)
        
        # Log the deletion
        logger.info(f"User {request.user} deleted post {post.title}")
        
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)