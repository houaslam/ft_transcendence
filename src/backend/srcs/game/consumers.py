import json, time, asyncio
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from collections import deque
from . import models,  game

players=deque()

class GameConsumer(AsyncWebsocketConsumer):

	async def connect(self):

		# # INTERNAL CONNECTION
		await self.accept()
		# self.group_name = "test"
		await self.channel_layer.group_add("test",self.channel_name)
  

		# PLAYER CREATION
		player = models.Player("hajar")
		players.append(player);

		# # GAME LAUNCH
		if (len(players) >= 2):
			task = asyncio.create_task(game.animation(self.channel_layer));
			await task
			print(task)

	async def receive(self, text_data):
		dataJson = json.loads(text_data)
		data = dataJson['data']
		await self.channel_layer.group_send(
			"test",
			{
				'type': 'create_msg',
				'data': data
	   		}
		)
	
	async def create_msg(self, event):
		data = event['data']
		await self.send(text_data=json.dumps({
			'type': 'msg',
			'data': data
		}))
 
	async def disconnect(self, close_code):
		print("BYE BYE : ", close_code)
