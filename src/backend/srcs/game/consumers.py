import json, time
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from . import models


class GameConsumer(WebsocketConsumer):

	def connect(self):

		available_games = models.Game.objects.filter(players_nb__lt=2)
		available_games_num = available_games.count()

		if (available_games_num > 0):
			game = available_games[0]
			if (game.players_nb == 0):
				player = models.Player(name="player")
				player.save()
				game.player = player
			elif (game.players_nb == 1):
				player = models.Player(name="op")
				player.save()
				game.opponent = player

		else:
			name = input("game name : ")
			player = models.Player(name="player")
			player.save()
			game = models.Game(name=name, player=player)
			game.save()

		game.players_nb += 1

		self.game_name = game.name;
		# self.game_name = "test";
		game.save()
  
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