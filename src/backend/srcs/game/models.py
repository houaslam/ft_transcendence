from django.db import models

# Create your models

class Player(models.Model):
    name = models.CharField(max_length=50)
    
class Game(models.Model):
    name = models.CharField(max_length=50)
    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='game_player')
    oponnent = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='game_opponnent')
    players_nb = models.IntegerField(default=0);