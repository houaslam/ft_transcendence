from . import models, consumers
import json, time, asyncio, random
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


class Ball():

	def __init__(self, position, velocity, dimension):
		self.position = position
		self.velocity = velocity
		self.dimension = dimension
		self.updateBounds()

	def reset(self):
		self.position = [0, 0.8, 0]
		self.velocity = [0.01, 0.01, 0.05]

	def updateBounds(self) :
		self.top= self.position[1] + self.dimension[0]
		self.bottom = self.position[1] - self.dimension[0]
		self.back = self.position[2] + self.dimension[0]
		self.front = self.position[2] - self.dimension[0]
		self.left = self.position[0] - self.dimension[0]
		self.right = self.position[0] + self.dimension[0]

	def update(self, plane, player, otherplayer):
		self.updateBounds()
		self.velocity[1] += 0.03
		
		if (self.bottom <= plane.top):
			self.velocity[1] = 0

		if (self.left <= plane.left or self.right >= plane.right):
			self.velocity[0] *= -1
		
		
		if (self.back >= player.front and self.velocity[2] > 0):
			if ((self.left >= player.left - self.dimension[0] and self.right <= player.right + self.dimension[0]) or
				( player.left > self.position[0]  and player.left < self.right) or 
				( player.right < self.position[0]  and player.right > self.left)):

					hitpont = (self.position[0] - player.position[0]) / player.dimension[0]
					self.velocity[0] = hitpont * 0.05
					self.velocity[2] += 0.01
					self.velocity[2] *= -1

			else:
				otherplayer.score += 1
				self.reset()

		if (self.front <= otherplayer.back  and self.velocity[2] < 0):
			if (self.left >= otherplayer.left - self.dimension[0] and self.right <= otherplayer.right + self.dimension[0]) :
				hitpont = (self.position[0] - otherplayer.position[0]) / player.dimension[0]
				self.velocity[0] = hitpont * 0.05
				self.velocity[2] -= 0.01
				self.velocity[2] *= -1

			else:
				self.reset()
				player += 1

		self.position[0] += self.velocity[0]
		self.position[1] -= self.velocity[1]
		self.position[2] += self.velocity[2]


async def animation(channel_layer, first, second):
	# 			position,  		 velocity,   		 dimension,         mOde (player)
	#			   x    y   z	    x   y   z		 x  y  z	
	ball = Ball( [ 0 , .8 , 0 ], [ .01,.01,.01 ], [ .2,32,15 ] )
	plane = Plane([0,0,0], [.01,.01,.05], [3,.2,5])
	player = Player([0,.4,plane.dimension[2]/2 - .3], [0,-.1,.05], [1,.3,.3])
	otherPlayer = Player([0,.4,-plane.dimension[2]/2 + .3], [0,-.1,.05], [1,.3,.3])

	while True:
		ball.update(plane, player, otherPlayer)
		player.update(plane)
		otherPlayer.update(plane)

		if (first.keycode == 37):
			player.position[0] -= 0.2
		elif (first.keycode == 39):
			player.position[0] += 0.2

		if (second.keycode == 37):
			otherPlayer.position[0] += 0.2
		elif (second.keycode == 39):
			otherPlayer.position[0] -= 0.2

		first.keycode = 0
		second.keycode = 0

		allCoordinate = {
				"ball" :{"position": ball.position},
				"player":{
					"position":player.position, 
			  		"score":player.score
				},
				"otherPlayer":{
					"position": otherPlayer.position,
					"score": otherPlayer.score
					}
		}

		await asyncio.sleep(0.04)
		await channel_layer.group_send("test",
			{
				'type': 'create_msg',
				'data': allCoordinate
			}
		)
