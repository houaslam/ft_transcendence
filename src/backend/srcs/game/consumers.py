import json, time
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
class GameConsumer(WebsocketConsumer):

	def connect(self):
		



		self.game_name = 'test';
  
		async_to_sync(self.channel_layer.group_add)(
			self.game_name,
			self.channel_name
		)
		self.accept()

 
	def receive(self, text_data):
		dataJson = json.loads(text_data)
		data = dataJson['data']
		async_to_sync(self.channel_layer.group_send)(
			self.game_name,
			{
				'type': 'create_msg',
    			'data': data
       		}
		)
	
	def create_msg(self, event):
		data = event['data']
		self.send(text_data=json.dumps({
			'type': 'msg',
            'data': data
        }))
 

	def disconnect(self, close_code):
		pass