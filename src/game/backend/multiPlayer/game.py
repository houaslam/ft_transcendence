from . import models, consumers
import json, time, asyncio, random, math
from asgiref.sync import async_to_sync, sync_to_async
from channels.layers import get_channel_layer
from typing import List


class GameObject():
	position : List[float]
	dimension : List[float]
	velocity : List[float]

 
	def __init__(self,position, velocity, dimension):
		self.position = position
		self.velocity = velocity
		self.dimension = dimension
		self.updateBounds()

	def updateBounds(self) :
		self.top= self.position[1] + self.dimension[1] / 2
		self.bottom = self.position[1] - self.dimension[1] / 2

		self.back = self.position[2] + self.dimension[2] / 2
		self.front = self.position[2] - self.dimension[2] / 2

		self.left = self.position[0] - self.dimension[0] / 2
		self.right = self.position[0] + self.dimension[0] / 2


class Plane(GameObject):
	pass

class Player(GameObject):
	score = 0

	def update(self, plane):
		self.velocity[1] += -0.01
		
		self.updateBounds()

		if (self.bottom > plane.top):
			self.position[1] += self.velocity[1]
		self.velocity[1] = 0

	def move(self, keycode, plane, i):
		target = self.position[0]
		if (keycode == 37 ):
			if (i % 2 == 0 and self.left >= plane.position[0]):
				target -= 0.5
			elif (i%2 != 0 and self.left > - plane.dimension[0] / 2):
				target -= 0.5
		
		if (keycode == 39 ):
			if (i % 2 == 0 and  self.right <  plane.dimension[0] / 2):
				target += 0.5
			elif (i%2 != 0 and self.right <= plane.position[0]):
				target += 0.5
		self.position[0] += (target - self.position[0]) * 0.5


class Ball(GameObject):

	def reset(self):
		self.position = [0, 0.8, 0]
		self.velocity = [random.uniform(-0.1, 0.1), 0.01, 0.05]

	def is_out_of_bound(self, plane):
			return (self.front < plane.front or self.back > plane.back)


	def update(self, plane, players):
		self.updateBounds()
		self.velocity[1] += 0.03
		
		if (self.bottom <= plane.top):
			self.velocity[1] = 0

		if (self.left <= plane.left or self.right >= plane.right):
			self.velocity[0] *= -1
		
		if (self.is_out_of_bound(plane)):
			self.reset()
			return

		for i in range(len(players)):
			
			if (self.back >= players[i].front and i <= 1):
				if ((self.left >= players[i].left - self.dimension[0] and self.right <= players[i].right + self.dimension[0]) or
					( players[i].left > self.position[0]  and players[i].left < self.right) or 
					( players[i].right < self.position[0]  and players[i].right > self.left)):
						self.handle_collision(players[i], 0.01)

			elif (self.front <= players[i].back and i > 1):
				if (self.left >= players[i].left - self.dimension[0] and self.right <= players[i].right + self.dimension[0]) :
					self.handle_collision(players[i], -0.01)
			
		self.position[0] += self.velocity[0]
		self.position[1] -= self.velocity[1]
		self.position[2] += self.velocity[2]

	def handle_collision(self, player, factor):
		hitpont = (self.position[0] - player.position[0]) / player.dimension[0]
		self.velocity[0] = hitpont * 0.05
		self.velocity[2] += factor
		self.velocity[2] *= -1

class Game():

	def __init__(self, settings):
		self.ball = Ball( [ 0 , .8 , 0 ], [ .01 , .01 , .01 ], [ .2 , .2 , .2 ] )
		self.plane = Plane( [ 0 , 0 , 0 ], [ .01 , .01 , .05 ], [ 5 , .2 , 5 ])

		self.player1 = Player( [ self.plane.dimension[0]/2 - .5, .4 , self.plane.dimension[2]/2 - .3 ], [ 0 , -.1 , .05 ], [ 1 , .3 , .3 ])
		self.player2 = Player( [ -self.plane.dimension[0]/2 + .5 , .4 , self.plane.dimension[2]/2 - .3 ], [ 0 , -.1 , .05 ], [ 1 , .3 , .3 ])

		self.player3 = Player( [ self.plane.dimension[0]/2 - .5, .4 , -(self.plane.dimension[2]/2 - .3) ], [ 0 , -.1 , .05 ], [ 1 , .3 , .3 ])
		self.player4 = Player( [ -self.plane.dimension[0]/2 + .5 , .4 , -(self.plane.dimension[2]/2 - .3) ], [ 0 , -.1 , .05 ], [ 1 , .3 , .3 ])

		self.settings = settings
		self.players = [self.player1, self.player2,self.player3, self.player4]
		
	def update(self):
		self.player1.update(self.plane)
		self.player2.update(self.plane)
		self.player3.update(self.plane)
		self.player4.update(self.plane)
		self.ball.update(self.plane, self.players)
	
	def get_coordinates(self):
		return  {
				"ball" :{
					"position": self.ball.position
					},
				"player1":{
					"position":self.player1.position, 
					"dimension": self.player1.dimension,
			  		"score":self.player1.score
				},
				"player2":{
					"position": self.player2.position,
					"dimension": self.player2.dimension,
					"score": self.player2.score
					},
				"player3":{
					"position": self.player3.position,
					"dimension": self.player3.dimension,
					"score": self.player3.score
					},
				"player4":{
					"position": self.player4.position,
					"dimension": self.player4.dimension,
					"score": self.player4.score
					},
				"plane":{
					"position": self.plane.position,
					"dimension": self.plane.dimension,
				}
		}

	def move_players(self, consumers):
		for i in range(len(consumers)):
			if (consumers[i].keycode == -1):
				return "disconnect", False
			self.players[i].move(consumers[i].keycode, self.plane, i)
			consumers[i].keycode = 0
		return "endgame", True

    def score(self):
		for i in range(4):
			if ( self.ball.front < self.plane.front or self.ball.back > self.plane.back ):
				if (i% 2 == 0):
					if (self.ball.position[0] > self.plane.position[0]):
						players[]
					else:
						print("2")
				else:
					if (self.ball.position[0] > self.plane.position[0]):
						print("3")
					else:
						print("4")
      

	async def is_game_over(self, start_time, channel_layer):
		if (self.settings['gameout'] == 'score'):
			goal =  int(self.settings['counts'])
			return self.player1.score == goal or self.player2.score == goal or self.player3.score == goal or self.player4.score == goal

		if (self.settings['gameout'] == 'time'):
			goalTime =  int(self.settings['counts'])
			elapsed = time.time() - start_time
			await channel_layer.group_send("invite",
			{
				'type': 'time',
				'data': int(elapsed)
			}
			)
			# if (elapsed >= goalTime and self.player.score == self.otherPlayer.score):
			# 	goalTime +=  5
			return elapsed >= goalTime

		return False

	async def end_game_results(self, consumers, message):
		# result = sorted(consumers, key= lambda x: x.score);
		for i in range(4):
			await consumers[i].send(text_data=json.dumps({
			'type' : 'endGame',
			'state' : i,
			'by' : message
		}))


async def startGame(channel_layer, consumers):
	game = Game(consumers[0].game.settings)
	start = time.time()
	message = 'endGame'

	while True:
		#  ELEMETS UPDATE
		game.update()

		# MOVEMENT 
		message , run = game.move_players(consumers)
		if not run :
			break

		# SEND TO FRONT
		await channel_layer.group_send("test",
			{
				'type': 'coordinates',
				'data': game.get_coordinates()
			}
		)
	
		# GAME OVER CHECK
		game.score()
		if (await game.is_game_over(start, channel_layer)):
    			break
		await asyncio.sleep(0.04)

	print("GAME ENDED")
	await game.end_game_results(consumers, message)

	# await channel_layer.group_send("test",
	# 		{
	# 			'type': 'message',
	# 			'data': message
	# 		}
	# )
	# winner = max(player , key x: x.score)
	# SAVE TO DATABASE
	# if (player1.score > player2.score):
	# 	first.match.gameStatus = "W"
	# 	second.match.gameStatus = "L"
	# else:
	# 	second.match.gameStatus = "W"
	# 	first.match.gameStatus = "L"

	# await sync_to_async(first.match.save)()
	# await sync_to_async(second.match.save)()