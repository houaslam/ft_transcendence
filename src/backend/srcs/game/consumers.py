import json
from channels.generic.websocket import WebsocketConsumer

class GameConsumer(WebsocketConsumer):

	def connect(self):
		self.accept()

		self.send(text_data=json.dumps(
		{
			"message" : "HELLO ",
			'USER': "root"
		})
	)