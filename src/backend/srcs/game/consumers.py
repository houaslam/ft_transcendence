import json, time, asyncio
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync, sync_to_async
from collections import deque
from . import models,  game

players=[]

class GameConsumer(AsyncWebsocketConsumer):
	gameOption = {}
	async def connect(self):
		await self.accept()
		await self.channel_layer.group_add("invite",self.channel_name)

		self.keycode= 0


		self.game, is_host = await self.find_or_create_game()
		# self.player = create_player(game=game, is_host=is_host, name='test')

		# players.append(self)
		# await self.game_is_ready(self.game)
		# if await game_is_ready()
			# await start_game()



	async def game_is_ready(self, game):
		print("PLAYER = ", game.players_set)
		# return game.players_set.count.
	
	async def find_or_create_game(self):
		print("HAREEEEEEEEEEEE")
		game = models.Game.objects.filter(gameStatus='waiting').first()
		if not game :
			game = Game.objects.create(gameStatus='waiting')
			return game , True
		return game, False

	async def start_game():
		if (len(players) >= 2):
			user = models.Player( name="second" )
			await sync_to_async( user.save )()
			second = players.pop()
			first = players.pop()
			asyncio.create_task(game.startGame(self.channel_layer, first, second))
		else :
			match = models.Game( type="VS" )
			user = models.Player( name="first" , game=match, is_host=True)
			await sync_to_async( user.save )()
			await sync_to_async( match.save )()

	async def receive(self, text_data):
		dataJson = json.loads(text_data)
		dataType = dataJson['type']
		if (dataType == 'keycode'):
			self.keycode = dataJson['data']
		elif (dataType == 'gameSettings'):
			self.gameOption = dataJson['data']
			
  
	async def coordinates(self, event):
		data = event['data']
		await self.send(text_data=json.dumps({
			'type': 'coordinates',
			'data': data
		}))
 
	async def disconnect(self, close_code):
		self.keycode = -1
		print("BYE BYE : ", close_code)
