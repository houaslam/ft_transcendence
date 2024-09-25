from django.db import models

# Create your models


class Game(models.Model):
	class gameType(models.TextChoices):
		TR = "TR",  "tournament"
		MP = "MP", "multiplayer"
		VS = "VS", "inviteFriend"

	class status(models.TextChoices):
		STARTED = "STARTED", "started"
		WAITING = "WAITING" , "waiting"


	type = models.CharField(max_length=2, choices=gameType.choices, default='')

	created_at = models.DateTimeField(auto_now=True)


	gameStatus = models.CharField(max_length=7, choices=status.choices, default='')

	def __str__(self):
		return f"{self.pk}"




class Player(models.Model):
	name = models.CharField(max_length=50)
	is_host = models.BooleanField(default=False)
	game = models.ForeignKey("Game" , on_delete=models.CASCADE)
	def __str__(self):
		return f"{self.name}{self.pk}"
