import json, time, asyncio
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync, sync_to_async
from channels.db import database_sync_to_async
from game import models
from . import game

players=[]

class GameConsumer(AsyncWebsocketConsumer):
	gameOption = {}
	async def connect(self):
		# # INTERNAL CONNECTION
		print("NEW CONNECTION")
		await self.accept()
		await self.channel_layer.group_add("test",self.channel_name)

		# # PLAYER CREATION
		self.keycode= 0
		players.append(self)

		# # GAME LAUNCH
		self.is_host = await self.is_host()
		if (self.is_host):
			print("IS HOST")
			await self.send(text_data=json.dumps({
				'type' : 'gameInfo',
				'data' : 'game_options'
		}))

		else:
			print("IS INVITED")
			self.game = await self.find_game()
			self.game.player_count += 1
			await sync_to_async(self.game.save)()
			if (self.game and await self.game_is_ready(self.game) and len(players)  >= 4):
				print("GAME GONNA START")
				self.game.gameStatus = 'STARTED'
				await sync_to_async(self.game.save)()
					# await self.start_game()

 
	@database_sync_to_async
	def game_is_ready(self, game):
		return game.player_count == 4

	@database_sync_to_async
	def is_host(self):
		game = models.Game.objects.filter(gameStatus='WAITING').first()
		if not game :
			return  True
		return  False

	@database_sync_to_async
	def create_game(self):
		return models.Game.objects.create(gameStatus='WAITING', player_count=1)


	async def receive(self, text_data):
		dataJson = json.loads(text_data)
		dataType = dataJson['type']

		if (dataType == 'keycode'):
			data = dataJson['data']
			self.keycode = data
		elif (dataType == 'gameSettings' and self.is_host):
			self.game = await self.create_game()
			self.game.settings = dataJson['data']
			await sync_to_async(self.game.save)()
  
	async def coordinates(self, event):
		data = event['data']
		await self.send(text_data=json.dumps({
			'type': 'coordinates',
			'data': data
		}))
  
	async def time(self, event):
		data = event['data']
		await self.send(text_data=json.dumps({
			'type': 'time',
			'data': data
		}))
 
	async def disconnect(self, close_code):
		self.keycode =  -1
		print("BYE BYE : ", close_code)
