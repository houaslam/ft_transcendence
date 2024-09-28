import json, time, asyncio
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync, sync_to_async
from channels.db import database_sync_to_async
from collections import deque
from . import models,  game

players=[]

class GameConsumer(AsyncWebsocketConsumer):
	gameOption = {}
	async def connect(self):
		await self.accept()
		await self.channel_layer.group_add("invite",self.channel_name)

		self.keycode= 0
		players.append(self)


		self.game, self.is_host = await self.find_or_create_game()
		self.player = await sync_to_async(models.Player.objects.create)(game=self.game, is_host=self.is_host, name='test')

		self.game.player_count += 1
		await sync_to_async(self.game.save)()
  
		if (self.is_host):
			await self.send(text_data=json.dumps({
				'type' : 'gameInfo',
				'data' : 'game_options'
			}))

		if (await self.game_is_ready(self.game) and len(players)  >= 2):
				self.game.gameStatus = 'STARTED'
				await sync_to_async(self.game.save)()
				await self.start_game()

	@database_sync_to_async
	def game_is_ready(self, game):
		return game.player_count == 2

	@database_sync_to_async
	def find_or_create_game(self):
		game = models.Game.objects.filter(gameStatus='WAITING').first()
		if not game :
			game = models.Game.objects.create(gameStatus='WAITING')
			return game , True
		return game, False

	async def start_game(self):
		invited = players.pop()
		hoster = players.pop()
		asyncio.create_task(game.startGame(self.channel_layer, hoster, invited))

	async def receive(self, text_data):
		dataJson = json.loads(text_data)
		dataType = dataJson['type']
		if (dataType == 'keycode'):
			self.keycode = dataJson['data']
		elif (dataType == 'gameSettings' and self.is_host):
			self.game.settings = dataJson['data']
			await sync_to_async(self.game.save)()
   

	async def coordinates(self, event):
		data = event['data']
		await self.send(text_data=json.dumps({
			'type': 'coordinates',
			'data': data
		}))
 
	async def disconnect(self, close_code):
		self.keycode = -1
		print("BYE BYE : ", close_code)
