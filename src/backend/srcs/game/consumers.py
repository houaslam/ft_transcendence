import json
from channels.generic.websocket import WebsocketConsumer


class Box():
	def __init__(self,position, velocity, dimension, mode):
  #[0, 0.4, 0]
		self.position = position # X Y Z
  #[0, -0.01, 0.05]	
		self.velocity = velocity # X Y Z
  #[0 0.4 PLANE_BACK]
		self.dimension = dimension # WIDTH HEIGHT DEPTH
		self.mode =mode
		self.updateBounds()
  


	def reset(self):
		self.position = [0, 0.8, 0]
		self.velocity = [0, 0.01, 0.05] # x y z

	def updateBounds(self) :
		self.top= self.position[1] + self.dimension[1] / 2;
		self.bottom = self.position[1] - self.dimension[1] / 2;

		self.back = self.position[2] + self.dimension[2] / 2;
		self.front = self.position[2] - self.dimension[2] / 2;

		self.left = self.position[0] - self.dimension[0] / 2;
		self.right = self.position[0] + self.dimension[0] / 2;

	# def update(self):
	def update(self, plane, ball):
		self.velocity[1] += -0.01
		
		self.updateBounds()

		if (self.bottom > plane.top):
			self.position[1] += self.velocity[1];
		self.velocity[1] = 0;
		if (self.mode == "AI"):
			self.position[0] = ball.position[0]


class Ball():

	def __init__(self, position, velocity, dimension):
		self.position = position #[0, 0.8, 0] x y z
		self.velocity = velocity #[0, 0.01, 0.05] x y z
		self.dimension = dimension # [2, 32, 15] x y z
		self.updateBounds()

	def reset(self):
		self.position = [0, 0.8, 0]
		self.velocity = [0, 0.01, 0.05]

	def updateBounds(self) :
		self.top= self.position[1] + self.dimension[0];
		self.bottom = self.position[1] - self.dimension[0];
		self.back = self.position[2] + self.dimension[0];
		self.front = self.position[2] - self.dimension[0];
		self.left = self.position[0] - self.dimension[0];
		self.right = self.position[0] + self.dimension[0];

	# def update(self):
	def update(self, plane, player, otherplayer):
		self.velocity[1] += 0.03;
		self.velocity[0] += 0.03;	
		
		if (self.bottom <= plane.top):
			self.velocity[1] = 0;
		if (self.left <= plane.left or self.right >= plane.right):
			self.velocity[0] *= -1;
		
		
		if (self.back >= player.front and self.velocity[2] > 0):
			if ((self.left >= player.left - self.dimension[0] and self.right <= player.right + self.dimension[0]) or
				( player.left > self.position[0]  and player.left < self.right) or 
				( player.right < self.position[0]  and player.right > self.left)):
					# hitpont = (self.position[0] - player.position[0]) / player.dimension[0]
					# self.velocity[0] = hitpont * 0.05
					# print("player x " , self.position[0])
					# print("ball x " , player.position[0])
					# print("HITPOINT " , hitpont)
					self.velocity[2] *= -1
			else:
				self.reset();

		# if (self.front <= otherplayer.back  and self.velocity[2] < 0):
		# 	if (self.left >= otherplayer.left - self.dimension[0] and self.right <= otherplayer.right + self.dimension[0]) :
		# 		hitpont = (self.position[0] - otherplayer.position[0]) / player.dimension[0];
		# 		self.velocity[0] = hitpont * 0.05
		# 		self.velocity[2] *= -1;
		# 	else:
		# 		self.reset();

		self.position[1] -= self.velocity[1];
		self.position[0] += self.velocity[0];
		self.position[2] += self.velocity[2];

		self.updateBounds()

def animation(sender):
	# 			position,   velocity,    dimension, mOde (player)
	#			 x  y  z	x   y   z	  x  y  z	
	ball = Ball([0,.8,0], [.01,.01,.05], [.2,32,15]);
	plane = Box([0,0,0], [.01,.01,.05], [3,.2,5], '')
	player = Box([0,.4,.2], [0,-.1,.05], [1,.3,.3], '');
	otherPlayer = Box([0,.4,.2], [0,-.1,.05], [1,.3,.3], 'AI')
	while True:
		ball.update(plane, player, otherPlayer)
		allCoordinate = {
			"ball" :{
				"position": ball.position
			},
			"player":{
				"position":player.position
			},
			"otherPlayer":otherPlayer.position
		}
		sender.send(text_data=json.dumps(allCoordinate))
		# return allCoordinate
		# render(request, 'index.html', context=allCoordinate);

# animation()

class GameConsumer(WebsocketConsumer):

	def connect(self):
		self.accept()
		animation(self);
		# self.send(text_data=json.dumps(
		# {
		# 	"message" : "HELLO ",
		# 	'USER': "root"
		# })
	# )