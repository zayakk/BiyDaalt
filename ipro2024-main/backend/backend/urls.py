from django.urls import path
from appbackend.views import add_product, get_products, update_product, delete_product
from appbackend import views,edituser

urlpatterns = [
    path('user/', views.checkService), # localhost:8000/user/ gehed views.checkService function duudna.
    path('useredit/', edituser.editcheckService), # localhost:8000/useredit/ gehed edituser.editcheckService function duudna.
    path('products/', get_products, name='get_products'),
    path('products/add/', add_product, name='add_product'),
    path('products/update/<int:product_id>/', update_product, name='update_product'),
    path('products/delete/<int:product_id>/', delete_product, name='delete_product'),
]
