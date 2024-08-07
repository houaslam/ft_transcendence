from django.db import models

# Create your models

class Player(models.Model):
	name = models.CharField(max_length=50)

	def __str__(self):
		return f"{self.name}"
	
# class Game(models.Model):
# 	# p1 = Player("player")
# 	name = models.CharField(max_length=50)
# #  WINNER
# 	player = models.ForeignKey(Player, on_delete=models.CASCADE, null=True, related_name="player")
# # LOSER
# 	opponent = models.ForeignKey(Player, on_delete=models.CASCADE, null=True, related_name="opponent")
# 	players_nb = models.IntegerField(default=0);
 
# 	def __str__(self):
# 		return f"{self.name}"