from django.db import models

# Create your models


class Game(models.Model):
	class gameType(models.TextChoices):
		TR = "TR",  "tournament"
		MP = "MP", "multiplayer"

	class status(models.TextChoices):
		W = "W",  "win"
		L = "L", "lose"

	type = models.CharField(max_length=2, choices=gameType.choices, default='')
	gameStatus = models.CharField(max_length=1, choices=status.choices, default='')
	created_at = models.DateTimeField(auto_now=True)
	points = models.IntegerField(default=0)

	def __str__(self):
		return f"{self.pk}"




class Player(models.Model):
	name = models.CharField(max_length=50)
	game = models.ForeignKey(Game, on_delete=models.SET_NULL, null=True)


	def __str__(self):
		return f"{self.name}{self.pk}"
