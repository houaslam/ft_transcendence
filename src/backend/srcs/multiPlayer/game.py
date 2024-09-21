from . import models, consumers
import json, time, asyncio, random, math
from asgiref.sync import async_to_sync, sync_to_async
from channels.layers import get_channel_layer

class Plane():
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

class Player():
	def __init__(self,position, velocity, dimension):
		self.position = position
		self.velocity = velocity
		self.dimension = dimension
		self.score = 0
		self.factor = 0.1
		self.updateBounds()

	def updateBounds(self) :
		self.top= self.position[1] + self.dimension[1] / 2
		self.bottom = self.position[1] - self.dimension[1] / 2

		self.back = self.position[2] + self.dimension[2] / 2
		self.front = self.position[2] - self.dimension[2] / 2

		self.left = self.position[0] - self.dimension[0] / 2
		self.right = self.position[0] + self.dimension[0] / 2

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
		self.position[0] += (target - self.position[0]) * self.factor


class Ball():

	def __init__(self, position, velocity, dimension):
		self.position = position
		self.velocity = velocity
		self.dimension = dimension
		self.updateBounds()

	def reset(self):
		self.position = [0, 0.8, 0]
		self.velocity = [random.uniform(-0.1, 0.1), 0.01, 0.05]

	def updateBounds(self) :
		self.left = self.position[0] - self.dimension[0]
		self.right = self.position[0] + self.dimension[0]
		self.top= self.position[1] + self.dimension[0]
		self.bottom = self.position[1] - self.dimension[0]
		self.back = self.position[2] + self.dimension[0]
		self.front = self.position[2] - self.dimension[0]

	def is_out_of_bound(self, plane):
		return (self.front < plane.front or
	  		self.back > plane.back)

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

						hitpont = (self.position[0] - players[i].position[0]) / players[i].dimension[0]
						self.velocity[0] = hitpont * 0.05
						self.velocity[2] += 0.01
						self.velocity[2] *= -1


			elif (self.front <= players[i].back and i > 1):
				if (self.left >= players[i].left - self.dimension[0] and self.right <= players[i].right + self.dimension[0]) :
					hitpont = (self.position[0] - players[i].position[0]) / players[i].dimension[0]
					self.velocity[0] = hitpont * 0.05
					self.velocity[2] -= 0.01
					self.velocity[2] *= -1
			
		self.position[0] += self.velocity[0]
		self.position[1] -= self.velocity[1]
		self.position[2] += self.velocity[2]


async def startGame(channel_layer, consumers):
	# 			position,  		 velocity,   		 dimension,         mOde (player)
	#			   x    y   z	    x   y   z		 x  y  z	
	ball = Ball( [ 0 , .8 , 0 ], [ .01 , .01 , .01 ], [ .2 , 32 , 15 ] )
	plane = Plane( [ 0 , 0 , 0 ], [ .01 , .01 , .05 ], [ 5 , .2 , 5 ])

	player1 = Player( [ plane.dimension[0]/2 - .5, .4 , plane.dimension[2]/2 - .3 ], [ 0 , -.1 , .05 ], [ 1 , .3 , .3 ])
	player2 = Player( [ -plane.dimension[0]/2 + .5 , .4 , plane.dimension[2]/2 - .3 ], [ 0 , -.1 , .05 ], [ 1 , .3 , .3 ])


	player3 = Player( [ plane.dimension[0]/2 - .5, .4 , -(plane.dimension[2]/2 - .3) ], [ 0 , -.1 , .05 ], [ 1 , .3 , .3 ])
	player4 = Player( [ -plane.dimension[0]/2 + .5 , .4 , -(plane.dimension[2]/2 - .3) ], [ 0 , -.1 , .05 ], [ 1 , .3 , .3 ])
	

	players = [player1, player2, player3, player4]
	run = True
	messgae = "endGame"
	while run:
	#  ELEMETS UPDATE
		player1.update(plane)
		player2.update(plane)
		player3.update(plane)
		player4.update(plane)
		ball.update(plane, players)


	# MOVEMENT 

		# PLAYER MOVEMENT
		for i in range(len(consumers)):
			if (consumers[i].keycode == -1):
				run = False
				message = "disconnect"
				break
			players[i].move(consumers[i].keycode, plane, i)
			consumers[i].keycode = 0

	# SCORE 

	# SEND TO FRONT
		allCoordinate = {
				"ball" :{
					"position": ball.position
					},
				"player1":{
					"position":player1.position, 
					"dimension": player1.dimension,
			  		"score":player1.score
				},
				"player2":{
					"position": player2.position,
					"dimension": player2.dimension,
					"score": player2.score
					},
				"player3":{
					"position": player3.position,
					"dimension": player3.dimension,
					"score": player3.score
					},
				"player4":{
					"position": player4.position,
					"dimension": player4.dimension,
					"score": player4.score
					},
				"plane":{
					"position": plane.position,
					"dimension": plane.dimension,
				}
		}
		await channel_layer.group_send("test",
			{
				'type': 'coordinates',
				'data': allCoordinate
			}
		)

		await asyncio.sleep(0.04)
	await channel_layer.group_send("test",
			{
				'type': 'message',
				'data': message
			}
	)
	winner = max(players, key=lambda player: player.score)
	print ("WINNER =- ", winner)
	# SAVE TO DATABASE
	# if (player1.score > player2.score):
	# 	first.match.gameStatus = "W"
	# 	second.match.gameStatus = "L"
	# else:
	# 	second.match.gameStatus = "W"
	# 	first.match.gameStatus = "L"

	# await sync_to_async(first.match.save)()
	# await sync_to_async(second.match.save)()