from django.urls import re_path
from . import consumers


print("---------------------YYYYYYYYYYAAAAAAYYYYYYYYY----------------------")
websocket_urlpatterns = [
    re_path(r'ws/socket-server/', consumers.GameConsumer.as_asgi())
]